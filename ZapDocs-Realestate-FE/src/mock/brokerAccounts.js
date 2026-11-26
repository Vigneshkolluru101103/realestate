/**
 * ZapDocs Mock Broker Store
 * Fictional broker accounts for frontend prototyping.
 * 
 * ⚠️  MOCK PROTOTYPE ONLY: Plaintext passwords are NEVER persisted in
 * localStorage or stored in persisted broker records.
 * Authentication in this prototype is bypassed for direct portal preview;
 * real authentication MUST be handled by a trusted backend with secure session
 * management, HTTPS cookies, and industry-standard password hashing (e.g. Argon2, bcrypt).
 */

import { sessionManager } from '../auth/sessionManager.js';
import { storage } from '../utils/storage.js';

const BROKERS_STORE_KEY = 'zd_brokers_store';

/**
 * Initial fictional broker accounts for prototype evaluation.
 * Note: No passwords or auth secrets are included in these account records.
 */
export const INITIAL_MOCK_BROKERS = [
  {
    id: 'brk_1',
    name: 'Ramesh Kumar',
    identifier: 'ramesh@zapdocs.mock',
    phone: '9876500001',
    upiId: null,
    subscription: {
      status: 'none' // State 1: No active monthly subscription (Pay-Per-Doc)
    }
  },
  {
    id: 'brk_2',
    name: 'Priya Sharma',
    identifier: 'priya@zapdocs.mock',
    phone: '9876500002',
    upiId: 'priya@oksbi',
    subscription: {
      status: 'expired' // State 2: Expired subscription
    }
  },
  {
    id: 'brk_3',
    name: 'Rajesh Rao',
    identifier: 'rajesh@zapdocs.mock',
    phone: '9876500003',
    upiId: 'rajesh@okhdfcbank',
    subscription: {
      status: 'active', // State 3: Active with remaining quota
      tier: 'Professional Tier',
      price: 5000,
      totalQuota: 100,
      usedQuota: 50,
      remainingQuota: 50,
      autoRenew: true
    }
  },
  {
    id: 'brk_4',
    name: 'Suresh Reddy',
    identifier: 'suresh@zapdocs.mock',
    phone: '9876500004',
    upiId: null,
    subscription: {
      status: 'active', // State 4: Active with zero quota
      tier: 'Professional Tier',
      price: 5000,
      totalQuota: 100,
      usedQuota: 100,
      remainingQuota: 0,
      autoRenew: true
    }
  }
];

// ─────────────────────────────────────────────────────────────
// Credential Registry — sessionStorage-backed (tab-scoped, never localStorage)
// ─────────────────────────────────────────────────────────────

/**
 * Known default demo broker IDs.
 * These are the fictional demo accounts pre-seeded for prototype evaluation.
 */
export const DEMO_BROKER_IDS = new Set(['brk_1', 'brk_2', 'brk_3', 'brk_4']);

export function isDemoBroker(brokerId) {
  return DEMO_BROKER_IDS.has(brokerId);
}

/**
 * Key prefix used in sessionStorage for custom broker passwords.
 * ⚠️  PROTOTYPE ONLY: sessionStorage is cleared automatically when the tab closes.
 * Passwords are NEVER written to localStorage. Real credentials must be handled
 * by a secure backend with hashing (Argon2/bcrypt).
 */
const SESSION_CRED_PREFIX = 'zd_bcp_';

function _readSessionCred(brokerId) {
  try {
    return window?.sessionStorage?.getItem(SESSION_CRED_PREFIX + brokerId) ?? null;
  } catch {
    return null;
  }
}

function _writeSessionCred(brokerId, password) {
  try {
    if (brokerId && typeof password === 'string') {
      window?.sessionStorage?.setItem(SESSION_CRED_PREFIX + brokerId, password);
    }
  } catch {
    // sessionStorage unavailable — fall back to in-memory only
    inMemoryBrokerCredentials.set(brokerId, password);
  }
}

function _removeSessionCred(brokerId) {
  try {
    window?.sessionStorage?.removeItem(SESSION_CRED_PREFIX + brokerId);
  } catch {}
  inMemoryBrokerCredentials.delete(brokerId);
}

/**
 * Runtime in-memory fallback when sessionStorage is unavailable.
 * Kept strictly in memory — NEVER written to localStorage.
 */
const inMemoryBrokerCredentials = new Map();

/**
 * Set a tab-scoped credential for a broker account during registration or password reset.
 * Written to sessionStorage so same-tab refreshes still work.
 */
export function setBrokerInMemoryPassword(brokerId, password) {
  if (brokerId && typeof password === 'string') {
    _writeSessionCred(brokerId, password);
    // Also keep in-memory copy as hot fallback for immediate reads
    inMemoryBrokerCredentials.set(brokerId, password);
  }
}

/**
 * Remove a tab-scoped credential for a broker account.
 */
export function removeBrokerInMemoryPassword(brokerId) {
  _removeSessionCred(brokerId);
}

/**
 * Validates broker credentials against tab-scoped sessionStorage credentials
 * set during registration or password reset.
 *
 * ⚠️  MOCK PROTOTYPE ARCHITECTURAL LIMITATION:
 * Custom credentials are stored in sessionStorage for the current tab and are
 * cleared when the tab/window closes. They are NEVER stored in localStorage.
 */
export function checkBrokerPassword(broker, inputPassword) {
  if (!broker || typeof inputPassword !== 'string' || !inputPassword) {
    return { valid: false, error: 'Please enter your password.' };
  }

  // 1. Check in-memory copy first (fastest path within the current render cycle)
  //    then fall back to sessionStorage (survives same-tab refresh).
  const inMemCred = inMemoryBrokerCredentials.get(broker.id);
  const sessionCred = inMemCred !== undefined ? inMemCred : _readSessionCred(broker.id);

  if (sessionCred !== null) {
    const isMatch = sessionCred === inputPassword;
    return isMatch
      ? { valid: true }
      : { valid: false, error: 'Incorrect password. Please try again.' };
  }

  // 2. No session credential stored — requires backend authentication
  return {
    valid: false,
    error: 'Authentication is not configured in this preview build.'
  };
}

/**
 * Verify a broker's password against in-memory credentials or default demo password.
 * Returns boolean for callers expecting simple boolean outcome.
 */
export function verifyBrokerPassword(broker, inputPassword) {
  return checkBrokerPassword(broker, inputPassword).valid;
}

// ─────────────────────────────────────────────────────────────
// Sanitization & Storage Operations
// ─────────────────────────────────────────────────────────────

/**
 * Safely sanitizes a single broker record by omitting password and sensitive credentials.
 * Returns an immutable copy without modifying the original object.
 */
export function sanitizeBroker(broker) {
  if (!broker || typeof broker !== 'object') {
    return null;
  }
  const { password, token, secret, ...safeBroker } = broker;
  return safeBroker;
}

/**
 * Sanitizes an array of broker records. Filters out invalid/malformed entries.
 */
export function sanitizeBrokersList(brokers) {
  if (!Array.isArray(brokers)) {
    return [];
  }
  return brokers
    .map(sanitizeBroker)
    .filter(Boolean);
}

/**
 * Retrieve broker records from localStorage.
 * Automatically migrates existing dirty records that may contain plaintext passwords
 * or malformed entries, and ensures valid fallback brokers are saved when storage
 * is empty, invalid, or contains only malformed broker records.
 */
export function getStoredBrokers() {
  const stored = storage.get(BROKERS_STORE_KEY, null);

  // Case 1: Empty or non-array stored data -> seed with sanitized initial mock brokers
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    const initialSanitized = sanitizeBrokersList(INITIAL_MOCK_BROKERS);
    storage.set(BROKERS_STORE_KEY, initialSanitized);
    return initialSanitized;
  }

  // Case 2: Validate records and detect malformed or secret-bearing entries
  let needsStorageUpdate = false;
  const validSanitized = [];

  for (const item of stored) {
    // Malformed record check: must be a non-null object with a non-empty string id
    if (!item || typeof item !== 'object' || Array.isArray(item) || typeof item.id !== 'string' || !item.id.trim()) {
      needsStorageUpdate = true;
      continue;
    }

    // Secret check: detect plaintext password, token, or secret fields
    if ('password' in item || 'token' in item || 'secret' in item) {
      needsStorageUpdate = true;
    }

    const safe = sanitizeBroker(item);
    if (safe) {
      validSanitized.push(safe);
    }
  }

  // Case 3: Stored data contained only malformed records (zero valid broker profiles left)
  if (validSanitized.length === 0) {
    const fallbackSanitized = sanitizeBrokersList(INITIAL_MOCK_BROKERS);
    storage.set(BROKERS_STORE_KEY, fallbackSanitized);
    return fallbackSanitized;
  }

  // Case 4: Storage contained malformed records or secrets that were filtered/sanitized
  if (needsStorageUpdate) {
    storage.set(BROKERS_STORE_KEY, validSanitized);
  }

  return validSanitized;
}

/**
 * Persist broker records to localStorage.
 * Always creates sanitized copies omitting passwords and authentication secrets.
 */
export function saveStoredBrokers(brokers) {
  if (!Array.isArray(brokers)) {
    return;
  }
  const sanitized = sanitizeBrokersList(brokers);
  storage.set(BROKERS_STORE_KEY, sanitized);
}

export function getStoredActiveUser() {
  return sessionManager.getBrokerSession();
}

export function saveStoredActiveUser(user) {
  sessionManager.setBrokerSession(user);
}

