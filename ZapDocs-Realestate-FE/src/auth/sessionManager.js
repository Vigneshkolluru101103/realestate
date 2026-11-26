/**
 * ZapDocs Session Manager
 * Dedicated, separate session persistence for Admin (zd_adm) and Broker (zd_brk).
 * Enforces role isolation, migration from legacy keys, and clean portal clearing.
 */
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { storage } from '../utils/storage.js';

const LEGACY_ADMIN_KEY = 'zapdocs_admin_demo_user';
const LEGACY_BROKER_KEY = 'zapdocs_active_user_v1';

/**
 * Migrate legacy keys if they exist, preserving existing users' demo sessions
 */
function runLegacyMigration() {
  try {
    // 1. Admin migration
    const legacyAdmin = window?.localStorage?.getItem(LEGACY_ADMIN_KEY);
    if (legacyAdmin) {
      try {
        const parsed = JSON.parse(legacyAdmin);
        if (parsed && !storage.get(STORAGE_KEYS.ADMIN_SESSION)) {
          storage.set(STORAGE_KEYS.ADMIN_SESSION, { ...parsed, role: 'admin' });
        }
      } catch {}
      window?.localStorage?.removeItem(LEGACY_ADMIN_KEY);
    }

    // 2. Broker migration
    const legacyBroker = window?.localStorage?.getItem(LEGACY_BROKER_KEY);
    if (legacyBroker) {
      try {
        const parsed = JSON.parse(legacyBroker);
        if (parsed && !storage.get(STORAGE_KEYS.BROKER_SESSION)) {
          storage.set(STORAGE_KEYS.BROKER_SESSION, { ...parsed, role: 'broker' });
        }
      } catch {}
      window?.localStorage?.removeItem(LEGACY_BROKER_KEY);
    }
  } catch (err) {
    console.warn('[SessionManager] Migration check skipped:', err);
  }
}

// Run migration immediately on module load
if (typeof window !== 'undefined') {
  runLegacyMigration();
}

export const sessionManager = {
  // ── Admin Session ───────────────────────────────────────────
  getAdminSession: () => {
    const session = storage.get(STORAGE_KEYS.ADMIN_SESSION, null);
    if (!session || typeof session !== 'object') {
      return null;
    }
    // Prevent broker sessions from being treated as admin
    if (session.role && session.role !== 'admin') {
      return null;
    }
    return session;
  },

  setAdminSession: (user) => {
    if (!user) {
      sessionManager.clearAdminSession();
      return;
    }
    // Never persist passwords or secrets
    const { password, token, ...sanitized } = user;
    storage.set(STORAGE_KEYS.ADMIN_SESSION, {
      ...sanitized,
      role: 'admin'
    });
  },

  clearAdminSession: () => {
    storage.clearAdmin();
  },

  isAdminAuthenticated: () => {
    return Boolean(sessionManager.getAdminSession());
  },

  // ── Broker Session ──────────────────────────────────────────
  getBrokerSession: () => {
    const session = storage.get(STORAGE_KEYS.BROKER_SESSION, null);
    if (!session || typeof session !== 'object') {
      return null;
    }
    // Prevent admin sessions from being treated as broker
    if (session.role && session.role !== 'broker') {
      return null;
    }
    return session;
  },

  setBrokerSession: (user) => {
    if (!user) {
      sessionManager.clearBrokerSession();
      return;
    }
    // Never persist passwords or secrets
    const { password, token, secret, ...sanitized } = user;
    storage.set(STORAGE_KEYS.BROKER_SESSION, {
      ...sanitized,
      role: 'broker'
    });
  },

  clearBrokerSession: () => {
    storage.clearBroker();
  },

  isBrokerAuthenticated: () => {
    return Boolean(sessionManager.getBrokerSession());
  },

  // ── User/Owner Session ──────────────────────────────────────
  getUserSession: () => {
    const session = storage.get(STORAGE_KEYS.USER_SESSION, null);
    if (!session || typeof session !== 'object') {
      return null;
    }
    if (session.role && session.role !== 'user') {
      return null;
    }
    return session;
  },

  setUserSession: (user) => {
    if (!user) {
      sessionManager.clearUserSession();
      return;
    }
    // Never persist passwords or secrets
    const { password, token, ...sanitized } = user;
    storage.set(STORAGE_KEYS.USER_SESSION, {
      ...sanitized,
      role: 'user'
    });
  },

  clearUserSession: () => {
    storage.remove(STORAGE_KEYS.USER_SESSION);
  },

  isUserAuthenticated: () => {
    return Boolean(sessionManager.getUserSession());
  }
};

export default sessionManager;
