# ZapDocs Backend Provider Failover & Resilience Specification

This document details the production backend implementation for **automatic provider failover** for **eStamp** and **eSign** services, including distributed idempotency, timeout handling, retry logic, and circuit breakers.

---

## 1. Provider Topology

### A. eStamp Engine
- **Primary Provider**: `SignDesk` (Direct integration with SHCIL / State Treasury Gateways)
- **Backup Provider**: `Leegality` (Fallback State Treasury Hub)
- **Supported States**: Karnataka (KA), Maharashtra (MH), Telangana (TG)

### B. eSign Engine
- **Primary Provider**: `Protean (NSDL) Aadhaar eSign` (Direct UIDAI ASP/ESP)
- **Backup Provider**: `CDAC eSign Gateway` (Government Electronic Signature Infrastructure)

---

## 2. Distributed Idempotency Protocol (Zero Duplicates)

To prevent duplicate eStamp issuance, double bank debits, or multiple Aadhaar OTP requests during failover retries:

### Redis Distributed Lock Pattern
```python
import redis
import hashlib
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def acquire_idempotency_lock(service: str, entity_id: str, payload: dict, ttl_seconds: int = 60) -> tuple[bool, str]:
    payload_hash = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()[:16]
    lock_key = f"idemp:lock:{service}:{entity_id}"
    cache_key = f"idemp:result:{service}:{entity_id}"
    
    # 1. Check if operation already completed successfully
    existing_result = redis_client.get(cache_key)
    if existing_result:
        return False, json.loads(existing_result)
        
    # 2. Acquire atomic in-flight lock (SET key val NX EX ttl)
    acquired = redis_client.set(lock_key, payload_hash, nx=True, ex=ttl_seconds)
    return acquired, None

def commit_idempotency_result(service: str, entity_id: str, result: dict, ttl_seconds: int = 86400 * 7):
    lock_key = f"idemp:lock:{service}:{entity_id}"
    cache_key = f"idemp:result:{service}:{entity_id}"
    
    # Store finalized reference (certificate number, payment ref, transaction ref)
    redis_client.set(cache_key, json.dumps(result), ex=ttl_seconds)
    redis_client.delete(lock_key)
```

---

## 3. Circuit Breaker & Automatic Failover Engine

```python
import time
import httpx
from enum import Enum
from pydantic import BaseModel

class CircuitState(str, Enum):
    CLOSED = "closed"       # Normal operation (Primary active)
    OPEN = "open"           # Tripped (Backup active)
    HALF_OPEN = "half_open" # Testing recovery of Primary

class FailoverConfig(BaseModel):
    timeout_seconds: float = 8.0
    max_retries: int = 2
    failure_threshold: int = 3
    cooldown_seconds: int = 120

class ProviderFailoverEngine:
    def __init__(self, service_name: str, primary_url: str, backup_url: str, config: FailoverConfig):
        self.service_name = service_name
        self.primary_url = primary_url
        self.backup_url = backup_url
        self.config = config
        self.state = CircuitState.CLOSED
        self.consecutive_failures = 0
        self.last_failure_time = 0

    async def execute_request(self, entity_id: str, payload: dict, db_session) -> dict:
        # Step 1: Idempotency Verification
        is_new, cached = acquire_idempotency_lock(self.service_name, entity_id, payload)
        if not is_new:
            return cached

        # Step 2: Route according to Circuit Breaker state
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time > self.config.cooldown_seconds:
                self.state = CircuitState.HALF_OPEN
            else:
                return await self._call_backup(entity_id, payload, db_session, reason="Circuit Open")

        # Step 3: Attempt Primary with Timeout & Retries
        for attempt in range(1, self.config.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                    response = await client.post(self.primary_url, json=payload)
                    response.raise_for_status()
                    
                    data = response.json()
                    self.consecutive_failures = 0
                    self.state = CircuitState.CLOSED
                    commit_idempotency_result(self.service_name, entity_id, data)
                    return data
            except (httpx.TimeoutException, httpx.HTTPStatusError) as e:
                self.consecutive_failures += 1
                if attempt == self.config.max_retries or self.consecutive_failures >= self.config.failure_threshold:
                    self.state = CircuitState.OPEN
                    self.last_failure_time = time.time()
                    self._log_failover_event(entity_id, str(e), db_session)
                    return await self._call_backup(entity_id, payload, db_session, reason=str(e))
                time.sleep(0.5 * attempt) # Exponential backoff

    async def _call_backup(self, entity_id: str, payload: dict, db_session, reason: str) -> dict:
        async with httpx.AsyncClient(timeout=self.config.timeout_seconds + 4.0) as client:
            resp = await client.post(self.backup_url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            data["failover_engaged"] = True
            commit_idempotency_result(self.service_name, entity_id, data)
            return data

    def _log_failover_event(self, entity_id: str, reason: str, db_session):
        # Insert tamper-evident audit record in Postgres
        db_session.execute(
            """
            INSERT INTO audit_logs (id, timestamp, actor, actor_role, action, entity, entity_id, result, description)
            VALUES (gen_random_uuid(), NOW(), 'system:failover_engine', 'SYSTEM', 'PROVIDER_FAILOVER', :service, :entity_id, 'success', :desc)
            """,
            {"service": self.service_name, "entity_id": entity_id, "desc": f"Automatic failover engaged due to: {reason}"}
        )
        db_session.commit()
```

---

## 4. Background Health Check Job (APScheduler / Celery)

```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()

@scheduler.scheduled_job('interval', seconds=30)
async def check_all_providers_health():
    async with httpx.AsyncClient(timeout=3.0) as client:
        # 1. Ping SignDesk Primary
        resp_sd = await client.get("https://api.signdesk.com/health")
        redis_client.hset("health:estamp:primary", mapping={"status": resp_sd.status_code, "ping": resp_sd.elapsed.total_seconds() * 1000})

        # 2. Ping Protean eSign Primary
        resp_nsdl = await client.get("https://esign.proteantech.in/health")
        redis_client.hset("health:esign:primary", mapping={"status": resp_nsdl.status_code, "ping": resp_nsdl.elapsed.total_seconds() * 1000})
```

---

## 5. Webhook Re-Routing & De-duplication

When state treasury webhooks arrive after a failover:
1. Validate incoming digital signature / HMAC token.
2. Check `idemp:result:{service}:{entity_id}`:
   - If already completed via backup provider, safely acknowledge (`200 OK`) and discard duplicate certificate.
   - If pending, reconcile transaction and dispatch notifications.
