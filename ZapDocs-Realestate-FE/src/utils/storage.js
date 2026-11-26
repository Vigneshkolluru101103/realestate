/**
 * ZapDocs Centralized Storage Utility
 * Safe JSON read, write, remove, and scoped portal clearing with in-memory fallback.
 */
import { STORAGE_KEYS } from '../constants/storageKeys.js';

// Fallback in-memory storage if window.localStorage is blocked/unavailable
const memoryStorage = new Map();

function isStorageAvailable() {
  try {
    const testKey = '__zd_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const hasLocalStorage = typeof window !== 'undefined' && isStorageAvailable();

export const storage = {
  /**
   * Safely retrieve and parse a JSON value from storage
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  get: (key, defaultValue = null) => {
    try {
      let raw = null;
      if (hasLocalStorage) {
        raw = window.localStorage.getItem(key);
      } else {
        raw = memoryStorage.get(key) ?? null;
      }

      if (raw === null || raw === undefined) {
        return defaultValue;
      }

      // Handle simple string values if stored directly without quotes
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    } catch (err) {
      console.warn(`[Storage] Failed to read key "${key}":`, err);
      return defaultValue;
    }
  },

  /**
   * Safely serialize and store a value in storage
   * @param {string} key
   * @param {any} value
   * @returns {boolean}
   */
  set: (key, value) => {
    try {
      if (value === undefined) {
        storage.remove(key);
        return true;
      }

      const serialized = typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value);

      if (hasLocalStorage) {
        window.localStorage.setItem(key, serialized);
      } else {
        memoryStorage.set(key, serialized);
      }
      return true;
    } catch (err) {
      console.warn(`[Storage] Failed to set key "${key}":`, err);
      return false;
    }
  },

  /**
   * Remove a specific key from storage
   * @param {string} key
   */
  remove: (key) => {
    try {
      if (hasLocalStorage) {
        window.localStorage.removeItem(key);
      } else {
        memoryStorage.delete(key);
      }
    } catch (err) {
      console.warn(`[Storage] Failed to remove key "${key}":`, err);
    }
  },

  /**
   * Clear all Admin portal specific keys (session, preferences, filters, table settings)
   * Preserves shared preferences like theme.
   */
  clearAdmin: () => {
    storage.remove(STORAGE_KEYS.ADMIN_SESSION);
    storage.remove(STORAGE_KEYS.ADMIN_PREFERENCES);
    storage.remove(STORAGE_KEYS.ADMIN_FILTERS);
    storage.remove(STORAGE_KEYS.ADMIN_TABLES);
    
    // Also remove legacy keys if present
    storage.remove('zapdocs_admin_demo_user');
    storage.remove('zapdocs_admin_name');
    storage.remove('zapdocs_admin_phone');
  },

  /**
   * Clear all Broker portal specific keys (session, preferences, filters, table settings, drafts)
   * Preserves shared preferences like theme.
   */
  clearBroker: () => {
    storage.remove(STORAGE_KEYS.BROKER_SESSION);
    storage.remove(STORAGE_KEYS.BROKER_PREFERENCES);
    storage.remove(STORAGE_KEYS.BROKER_FILTERS);
    storage.remove(STORAGE_KEYS.BROKER_TABLES);
    storage.remove(STORAGE_KEYS.BROKER_DRAFTS);

    // Also remove legacy broker active user key
    storage.remove('zapdocs_active_user_v1');
  },

  /**
   * Clear all portal data while keeping the active theme intact
   */
  clearAllSessions: () => {
    storage.clearAdmin();
    storage.clearBroker();
    storage.remove(STORAGE_KEYS.USER_SESSION);
  }
};

export default storage;
