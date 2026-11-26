import { mockAuditLogs, mockNotifications } from "../data/mockData";
import { storage } from "../utils/storage.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";
// ── Initial State ───────────────────────────────────────────────
const INITIAL_CONFIG = {
	estamp: {
		service: "estamp",
		serviceLabel: "eStamp Stamping Engine",
		autoFailoverEnabled: true,
		timeoutMs: 8e3,
		maxRetries: 2,
		activeRole: "primary",
		circuitBreakerState: "closed",
		primaryProvider: {
			id: "prv_stp_primary",
			name: "SignDesk (SHCIL Gateway)",
			service: "estamp",
			role: "primary",
			endpoint: "https://api.signdesk.com/v2/estamp/procure",
			status: "operational",
			latencyMs: 340,
			uptime: "99.85%",
			consecutiveFailures: 0,
			lastChecked: new Date().toISOString(),
			isSimulatedDown: false,
			supportedStates: [
				"Karnataka",
				"Maharashtra",
				"Telangana"
			],
			certFormat: "SHCIL Digital Certificate with 2D QR"
		},
		backupProvider: {
			id: "prv_stp_backup",
			name: "Leegality (Treasury Failover Hub)",
			service: "estamp",
			role: "backup",
			endpoint: "https://sandbox.leegality.com/v3/treasury/stamp",
			status: "operational",
			latencyMs: 410,
			uptime: "99.92%",
			consecutiveFailures: 0,
			lastChecked: new Date().toISOString(),
			isSimulatedDown: false,
			supportedStates: [
				"Karnataka",
				"Maharashtra",
				"Telangana"
			],
			certFormat: "State Treasury Digitally Encrypted Bundle"
		}
	},
	esign: {
		service: "esign",
		serviceLabel: "eSign Digital Signature Engine",
		autoFailoverEnabled: true,
		timeoutMs: 8e3,
		maxRetries: 2,
		activeRole: "primary",
		circuitBreakerState: "closed",
		primaryProvider: {
			id: "prv_sig_primary",
			name: "Protean (NSDL Aadhaar eSign)",
			service: "esign",
			role: "primary",
			endpoint: "https://esign.proteantech.in/v2/otp/sign",
			status: "operational",
			latencyMs: 180,
			uptime: "99.94%",
			consecutiveFailures: 0,
			lastChecked: new Date().toISOString(),
			isSimulatedDown: false,
			supportedStates: [
				"Karnataka",
				"Maharashtra",
				"Telangana"
			],
			certFormat: "UIDAI Aadhaar XML Signature / PKCS#7"
		},
		backupProvider: {
			id: "prv_sig_backup",
			name: "CDAC eSign Gateway",
			service: "esign",
			role: "backup",
			endpoint: "https://esignservice.cdac.in/v2.1/asp/sign",
			status: "operational",
			latencyMs: 260,
			uptime: "99.90%",
			consecutiveFailures: 0,
			lastChecked: new Date().toISOString(),
			isSimulatedDown: false,
			supportedStates: [
				"Karnataka",
				"Maharashtra",
				"Telangana"
			],
			certFormat: "CDAC e-Hastakshar Compliant PKCS#7"
		}
	}
};
// ── In-Memory Idempotency & Lock Store ───────────────────────────
const idempotencyStore = new Map();
const listeners = new Set();
// Load persistent config from storage if available
function loadConfig() {
	try {
		const parsed = storage.get(STORAGE_KEYS.FAILOVER_CONFIG || "zapdocs_failover_config");
		if (parsed && typeof parsed === "object") {
			return {
				estamp: {
					...INITIAL_CONFIG.estamp,
					...(parsed.estamp || {})
				},
				esign: {
					...INITIAL_CONFIG.esign,
					...(parsed.esign || {})
				}
			};
		}
	} catch {}
	return { ...INITIAL_CONFIG };
}
let currentConfig = loadConfig();
function saveConfig() {
	try {
		storage.set(STORAGE_KEYS.FAILOVER_CONFIG || "zapdocs_failover_config", currentConfig);
	} catch {}
	listeners.forEach((fn) => fn(currentConfig));
}
// ── Failover Service API ────────────────────────────────────────
export const failoverService = {
	// Subscribe to config changes
	subscribe(listener) {
		listeners.add(listener);
		listener(currentConfig);
		return () => listeners.delete(listener);
	},
	// Get current snapshot
	getConfig(service) {
		if (service) return currentConfig[service];
		return currentConfig;
	},
	// Update failover thresholds
	updateSettings(service, updates) {
		currentConfig[service] = {
			...currentConfig[service],
			...updates
		};
		saveConfig();
	},
	// Simulate an outage on primary or backup
	simulateOutage(service, role, isDown) {
		const cfg = currentConfig[service];
		const targetNode = role === "primary" ? cfg.primaryProvider : cfg.backupProvider;
		targetNode.isSimulatedDown = isDown;
		targetNode.status = isDown ? "down" : "operational";
		targetNode.latencyMs = isDown ? 9999 : role === "primary" ? 340 : 410;
		targetNode.consecutiveFailures = isDown ? 3 : 0;
		targetNode.lastChecked = new Date().toISOString();
		if (isDown && cfg.autoFailoverEnabled && cfg.activeRole === role) {
			// Automatic switch triggered
			this.triggerFailover(service, role === "primary" ? "backup" : "primary", `Automatic failover triggered: ${targetNode.name} server reported unresponsive / 503 Gateway Down.`);
		} else {
			saveConfig();
		}
	},
	// Manually or automatically switch active provider
	triggerFailover(service, targetRole, reason) {
		const cfg = currentConfig[service];
		const prevRole = cfg.activeRole;
		if (prevRole === targetRole) return;
		const fromProvider = prevRole === "primary" ? cfg.primaryProvider.name : cfg.backupProvider.name;
		const toProvider = targetRole === "primary" ? cfg.primaryProvider.name : cfg.backupProvider.name;
		cfg.activeRole = targetRole;
		cfg.circuitBreakerState = targetRole === "backup" ? "open" : "closed";
		cfg.lastFailoverTime = new Date().toISOString();
		cfg.lastFailoverReason = reason;
		// 1. Audit Log Generation
		const newLog = {
			id: `log_failover_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			timestamp: new Date().toISOString(),
			actor: "system:failover_engine",
			actorRole: "SYSTEM",
			action: "SYSTEM_PROVIDER_FAILOVER",
			entity: service === "estamp" ? "estamp_gateway" : "esign_gateway",
			entityId: `${service.toUpperCase()}_FAILOVER`,
			result: "success",
			description: `AUTOMATIC FAILOVER: Switched ${cfg.serviceLabel} from ${fromProvider} to ${toProvider}. Reason: ${reason}`
		};
		mockAuditLogs.unshift(newLog);
		// 2. Notification for Admins
		const newNotif = {
			id: `ntf_failover_${Date.now()}`,
			title: `⚡ Provider Failover: ${cfg.serviceLabel}`,
			message: `Automatic failover engaged. Traffic routed to ${toProvider}. Cause: ${reason}`,
			category: "System",
			priority: "Important",
			recipient: "Operations Admin",
			status: "sent",
			readStatus: "Unread",
			createdAt: new Date().toISOString(),
			type: "provider_failover"
		};
		mockNotifications.unshift(newNotif);
		saveConfig();
	},
	// Restore primary provider
	restorePrimary(service) {
		const cfg = currentConfig[service];
		cfg.primaryProvider.isSimulatedDown = false;
		cfg.primaryProvider.status = "operational";
		cfg.primaryProvider.consecutiveFailures = 0;
		cfg.primaryProvider.latencyMs = service === "estamp" ? 320 : 180;
		cfg.primaryProvider.lastChecked = new Date().toISOString();
		this.triggerFailover(service, "primary", "Primary provider server recovered and passed health checks. Restored normal routing.");
	},
	// Run live health check ping
	async runHealthCheck(service) {
		await new Promise((r) => setTimeout(r, 450));
		const now = new Date().toISOString();
		const checkService = (s) => {
			const cfg = currentConfig[s];
			// Check primary
			if (!cfg.primaryProvider.isSimulatedDown) {
				cfg.primaryProvider.latencyMs = Math.floor(Math.random() * 80) + (s === "estamp" ? 300 : 160);
				cfg.primaryProvider.status = cfg.primaryProvider.latencyMs > 750 ? "degraded" : "operational";
				cfg.primaryProvider.lastChecked = now;
			}
			// Check backup
			if (!cfg.backupProvider.isSimulatedDown) {
				cfg.backupProvider.latencyMs = Math.floor(Math.random() * 90) + (s === "estamp" ? 380 : 240);
				cfg.backupProvider.status = cfg.backupProvider.latencyMs > 850 ? "degraded" : "operational";
				cfg.backupProvider.lastChecked = now;
			}
		};
		if (!service || service === "estamp") checkService("estamp");
		if (!service || service === "esign") checkService("esign");
		saveConfig();
		return {
			estampLatency: currentConfig.estamp.primaryProvider.latencyMs,
			esignLatency: currentConfig.esign.primaryProvider.latencyMs,
			timestamp: now
		};
	},
	// ── Idempotency & Anti-Duplicate Guard ─────────────────────────
	acquireIdempotencyLock(service, entityId, operation) {
		const key = `idemp_${service}_${entityId}_${operation}`;
		const existing = idempotencyStore.get(key);
		const now = Date.now();
		// If existing and completed, block duplicate and return cached proof
		if (existing && existing.status === "completed") {
			return {
				acquired: false,
				existingRecord: existing,
				key
			};
		}
		// If existing and locked within 30 seconds, concurrent execution protection
		if (existing && existing.status === "in_flight" && existing.lockedUntil > now) {
			return {
				acquired: false,
				existingRecord: existing,
				key
			};
		}
		// Set lock
		const record = {
			key,
			service,
			entityId,
			operation,
			status: "in_flight",
			providerUsed: currentConfig[service].activeRole === "primary" ? currentConfig[service].primaryProvider.name : currentConfig[service].backupProvider.name,
			createdAt: new Date().toISOString(),
			lockedUntil: now + 3e4
		};
		idempotencyStore.set(key, record);
		return {
			acquired: true,
			key
		};
	},
	releaseIdempotencyLock(key, status, refs) {
		const rec = idempotencyStore.get(key);
		if (rec) {
			rec.status = status;
			if (refs?.certificateRef) rec.certificateRef = refs.certificateRef;
			if (refs?.paymentRef) rec.paymentRef = refs.paymentRef;
			if (refs?.providerUsed) rec.providerUsed = refs.providerUsed;
		}
	},
	getIdempotencyRecord(key) {
		return idempotencyStore.get(key);
	},
	// ── High-Level Failover Execution Wrapper ─────────────────────
	// Simulates end-to-end request with timeout handling, retry counter,
	// idempotency protection, and automatic backup failover.
	async executeWithFailover(service, entityId, operation, actionFn) {
		const startTime = Date.now();
		const cfg = currentConfig[service];
		// Step 1: Idempotency Check (Prevent duplicate issuance, payments, invitations)
		const lock = this.acquireIdempotencyLock(service, entityId, operation);
		if (!lock.acquired && lock.existingRecord?.status === "completed") {
			return {
				success: true,
				providerUsed: lock.existingRecord.providerUsed,
				wasFailoverEngaged: false,
				retryAttempts: 0,
				executionTimeMs: Date.now() - startTime,
				idempotencyKey: lock.key,
				message: `IDEMPOTENCY GUARD ACTIVE: Request for ${entityId} was already completed by ${lock.existingRecord.providerUsed}. Duplicate procurement prevented.`
			};
		}
		if (!lock.acquired && lock.existingRecord?.status === "in_flight") {
			return {
				success: false,
				providerUsed: lock.existingRecord.providerUsed,
				wasFailoverEngaged: false,
				retryAttempts: 0,
				executionTimeMs: Date.now() - startTime,
				idempotencyKey: lock.key,
				message: `CONCURRENT LOCK HELD: Another procurement process is in-flight for ${entityId}. Duplicate request aborted.`
			};
		}
		let retryCount = 0;
		let failoverTriggered = false;
		let chosenProvider = cfg.activeRole === "primary" ? cfg.primaryProvider : cfg.backupProvider;
		// Step 2: Attempt primary or current active provider
		try {
			if (chosenProvider.isSimulatedDown || chosenProvider.status === "down") {
				throw new Error(`Connection timeout: Provider ${chosenProvider.name} server unreachable (503 Service Unavailable)`);
			}
			const res = await actionFn(chosenProvider.name, lock.key);
			this.releaseIdempotencyLock(lock.key, "completed", { providerUsed: chosenProvider.name });
			return {
				success: true,
				providerUsed: chosenProvider.name,
				wasFailoverEngaged: false,
				retryAttempts: 0,
				executionTimeMs: Date.now() - startTime,
				idempotencyKey: lock.key,
				message: `Successfully executed via ${chosenProvider.name}.`,
				data: res
			};
		} catch (primaryErr) {
			const errMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
			retryCount++;
			// Step 3: Handle Automatic Failover if primary failed and auto-failover is enabled
			if (cfg.autoFailoverEnabled && cfg.activeRole === "primary") {
				failoverTriggered = true;
				this.triggerFailover(service, "backup", `Primary provider ${cfg.primaryProvider.name} encountered error: "${errMsg}". Automatic failover engaged to ${cfg.backupProvider.name}.`);
				chosenProvider = currentConfig[service].backupProvider;
				// Step 4: Execute on Backup Provider with same idempotency key
				try {
					const backupRes = await actionFn(chosenProvider.name, lock.key);
					this.releaseIdempotencyLock(lock.key, "completed", { providerUsed: chosenProvider.name });
					return {
						success: true,
						providerUsed: chosenProvider.name,
						wasFailoverEngaged: true,
						retryAttempts: retryCount,
						executionTimeMs: Date.now() - startTime,
						idempotencyKey: lock.key,
						message: `AUTOMATIC FAILOVER SUCCESS: Primary ${cfg.primaryProvider.name} timed out. Request securely processed by backup provider ${chosenProvider.name} with zero duplicates.`,
						data: backupRes
					};
				} catch (backupErr) {
					const bErrMsg = backupErr instanceof Error ? backupErr.message : String(backupErr);
					this.releaseIdempotencyLock(lock.key, "failed");
					return {
						success: false,
						providerUsed: chosenProvider.name,
						wasFailoverEngaged: true,
						retryAttempts: retryCount + 1,
						executionTimeMs: Date.now() - startTime,
						idempotencyKey: lock.key,
						message: `Both primary and backup providers failed: ${bErrMsg}`
					};
				}
			}
			this.releaseIdempotencyLock(lock.key, "failed");
			return {
				success: false,
				providerUsed: chosenProvider.name,
				wasFailoverEngaged: failoverTriggered,
				retryAttempts: retryCount,
				executionTimeMs: Date.now() - startTime,
				idempotencyKey: lock.key,
				message: errMsg
			};
		}
	}
};
