/**
 * ZapDocs Login Attempt Throttler
 *
 * Implements client-side rate limiting and cooldown on failed login attempts
 * to protect against rapid password-guessing and brute-force attempts.
 *
 * ⚠️  PROTOTYPE ARCHITECTURAL LIMITATION:
 * This throttler operates client-side via localStorage (`zd_lt`).
 * It effectively protects the prototype UI from brute-force password guessing
 * and survives page reloads, but cannot replace server-side rate-limiting,
 * IP-based throttling, or WAF defense on production API endpoints.
 */

import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { storage } from '../utils/storage.js';
import { getClean10DigitPhone } from '../utils/validation.js';

export const THROTTLE_CONFIG = {
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 60 * 1000, // 60 seconds cooldown
  ATTEMPT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes failure expiry window
};

/**
 * Normalizes an account identifier and portal into a composite tracking key.
 * Ensures consistent tracking regardless of whitespace, casing, or phone formatting.
 *
 * Examples:
 *   admin + "Admin@ZapDocs.in" -> "admin:admin@zapdocs.in"
 *   broker + "+91 98765 00001" -> "broker:9876500001"
 *   broker + "09876500001"     -> "broker:9876500001"
 *   broker + "9876500001"      -> "broker:9876500001"
 */
export function normalizeThrottlingKey(portal, identifier) {
  const normPortal = (portal || 'shared').toLowerCase().trim();
  const trimmedId = (identifier || '').toLowerCase().trim();

  let normId = trimmedId;
  if (!trimmedId.includes('@')) {
    const clean10 = getClean10DigitPhone(trimmedId);
    if (clean10) {
      normId = clean10;
    } else {
      normId = trimmedId.replace(/\D/g, '') || trimmedId;
    }
  }

  return `${normPortal}:${normId}`;
}

/**
 * Reads all throttle state records from storage.
 * Automatically purges expired entries to prevent storage bloat.
 */
function getThrottleStore() {
  const store = storage.get(STORAGE_KEYS.LOGIN_THROTTLE, {});
  if (!store || typeof store !== 'object' || Array.isArray(store)) {
    return {};
  }
  return store;
}

/**
 * Writes updated throttle state records to storage.
 */
function setThrottleStore(store) {
  storage.set(STORAGE_KEYS.LOGIN_THROTTLE, store);
}

/**
 * Resolves a unique set of normalized storage keys for an identifier and its optional aliases.
 */
function getUniqueNormalizedKeys(portal, identifier, aliases = []) {
  const allIds = [identifier, ...(Array.isArray(aliases) ? aliases : [aliases])].filter(Boolean);
  return Array.from(new Set(allIds.map((id) => normalizeThrottlingKey(portal, id))));
}

/**
 * Checks if the specified portal and identifier (or any of its aliases) are currently throttled/locked.
 *
 * @param {string} portal - 'admin', 'broker', or 'shared'
 * @param {string} identifier - Email or mobile number
 * @param {string|string[]} [aliases] - Optional associated identifiers/aliases for the account
 * @returns {{ allowed: boolean, remainingSeconds: number, error?: string }}
 */
export function checkLoginThrottle(portal, identifier, aliases = []) {
  if (!identifier) {
    return { allowed: true, remainingSeconds: 0 };
  }

  const keys = getUniqueNormalizedKeys(portal, identifier, aliases);
  const store = getThrottleStore();
  const now = Date.now();

  let maxRemainingSeconds = 0;
  let isBlocked = false;
  let changed = false;

  for (const key of keys) {
    const record = store[key];
    if (!record) continue;

    // Check if currently locked out
    if (record.blockedUntil && record.blockedUntil > now) {
      const remainingSeconds = Math.max(1, Math.ceil((record.blockedUntil - now) / 1000));
      if (remainingSeconds > maxRemainingSeconds) {
        maxRemainingSeconds = remainingSeconds;
      }
      isBlocked = true;
      continue;
    }

    // If lockout expired, reset expired counter
    if (record.blockedUntil && record.blockedUntil <= now) {
      delete store[key];
      changed = true;
      continue;
    }

    // If attempt window lapsed without reaching threshold, reset expired counter
    if (record.lastAttempt && (now - record.lastAttempt > THROTTLE_CONFIG.ATTEMPT_WINDOW_MS)) {
      delete store[key];
      changed = true;
      continue;
    }
  }

  if (changed) {
    setThrottleStore(store);
  }

  if (isBlocked) {
    return {
      allowed: false,
      remainingSeconds: maxRemainingSeconds,
      error: `Too many failed login attempts. Account is temporarily locked. Please wait ${maxRemainingSeconds} second${maxRemainingSeconds === 1 ? '' : 's'} before trying again.`,
    };
  }

  return { allowed: true, remainingSeconds: 0 };
}

/**
 * Records a failed login attempt for the specified account, portal, and optional aliases.
 * Synchronizes the attempt counter across aliases and prevents extending an active cooldown.
 *
 * @param {string} portal - 'admin', 'broker', or 'shared'
 * @param {string} identifier - Email or mobile number
 * @param {string|string[]} [aliases] - Optional associated identifiers/aliases for the account
 * @returns {{ locked: boolean, attempts: number, remainingAttempts: number, remainingSeconds: number, error?: string }}
 */
export function recordFailedLogin(portal, identifier, aliases = []) {
  if (!identifier) {
    return { locked: false, attempts: 0, remainingAttempts: THROTTLE_CONFIG.MAX_FAILED_ATTEMPTS, remainingSeconds: 0 };
  }

  const keys = getUniqueNormalizedKeys(portal, identifier, aliases);
  const store = getThrottleStore();
  const now = Date.now();

  let maxCount = 0;
  let activeBlockedUntil = 0;

  for (const key of keys) {
    const record = store[key];
    if (!record) continue;

    // Check if active lockout exists
    if (record.blockedUntil && record.blockedUntil > now) {
      if (record.blockedUntil > activeBlockedUntil) {
        activeBlockedUntil = record.blockedUntil;
      }
      if (record.count > maxCount) {
        maxCount = record.count;
      }
    } else if (record.lastAttempt && (now - record.lastAttempt <= THROTTLE_CONFIG.ATTEMPT_WINDOW_MS)) {
      // Within window and not expired
      if (record.count > maxCount) {
        maxCount = record.count;
      }
    }
  }

  // If already locked out, do NOT extend the cooldown duration or alter blockedUntil!
  if (activeBlockedUntil && activeBlockedUntil > now) {
    const remainingSeconds = Math.max(1, Math.ceil((activeBlockedUntil - now) / 1000));
    return {
      locked: true,
      attempts: maxCount,
      remainingAttempts: 0,
      remainingSeconds,
      error: `Too many failed login attempts. Account is temporarily locked. Please wait ${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'} before trying again.`,
    };
  }

  const newCount = maxCount + 1;
  const isLocked = newCount >= THROTTLE_CONFIG.MAX_FAILED_ATTEMPTS;
  const blockedUntil = isLocked ? (now + THROTTLE_CONFIG.LOCKOUT_DURATION_MS) : 0;

  const newRecord = {
    count: newCount,
    lastAttempt: now,
    blockedUntil,
  };

  // Synchronize identical state across all unique alias keys for this account
  for (const key of keys) {
    store[key] = { ...newRecord };
  }
  setThrottleStore(store);

  if (isLocked) {
    const remainingSeconds = Math.ceil(THROTTLE_CONFIG.LOCKOUT_DURATION_MS / 1000);
    return {
      locked: true,
      attempts: newCount,
      remainingAttempts: 0,
      remainingSeconds,
      error: `Too many failed login attempts. Account is temporarily locked. Please wait ${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'} before trying again.`,
    };
  }

  const remainingAttempts = Math.max(0, THROTTLE_CONFIG.MAX_FAILED_ATTEMPTS - newCount);
  return {
    locked: false,
    attempts: newCount,
    remainingAttempts,
    remainingSeconds: 0,
  };
}

/**
 * Clears failed login counter and lockout for the specified account and optional aliases.
 * Called immediately upon successful login or password reset.
 *
 * @param {string} portal - 'admin', 'broker', or 'shared'
 * @param {string} identifier - Email or mobile number
 * @param {string|string[]} [aliases] - Optional associated identifiers/aliases for the account
 */
export function clearLoginThrottle(portal, identifier, aliases = []) {
  if (!identifier) return;

  const keys = getUniqueNormalizedKeys(portal, identifier, aliases);
  const store = getThrottleStore();

  let changed = false;
  for (const key of keys) {
    if (store[key]) {
      delete store[key];
      changed = true;
    }
  }

  if (changed) {
    setThrottleStore(store);
  }
}

/**
 * Resets all throttle records across all accounts. Useful for testing.
 */
export function resetAllThrottling() {
  storage.remove(STORAGE_KEYS.LOGIN_THROTTLE);
}
