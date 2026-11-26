/**
 * Broker Portal Storage Module
 * Centralized helpers for Broker UI preferences (zd_bp), filters (zd_bf),
 * table preferences (zd_bt), and non-sensitive drafts (zd_bd).
 */
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { storage } from '../utils/storage.js';

export const brokerStorage = {
  // ── UI Preferences (zd_bp) ──────────────────────────────────
  getPreferences: () => {
    return storage.get(STORAGE_KEYS.BROKER_PREFERENCES, {
      autoRenew: true,
      lastViewedTab: 'dashboard'
    });
  },

  setPreferences: (prefs) => {
    const current = brokerStorage.getPreferences();
    storage.set(STORAGE_KEYS.BROKER_PREFERENCES, { ...current, ...prefs });
  },

  // ── Filters & Search State (zd_bf) ──────────────────────────
  getFilters: (viewKey = 'agreements', defaultFilters = {}) => {
    const allFilters = storage.get(STORAGE_KEYS.BROKER_FILTERS, {});
    return allFilters[viewKey] || defaultFilters;
  },

  setFilters: (viewKey, filters) => {
    const allFilters = storage.get(STORAGE_KEYS.BROKER_FILTERS, {});
    storage.set(STORAGE_KEYS.BROKER_FILTERS, {
      ...allFilters,
      [viewKey]: filters
    });
  },

  clearFilters: (viewKey) => {
    if (!viewKey) {
      storage.remove(STORAGE_KEYS.BROKER_FILTERS);
      return;
    }
    const allFilters = storage.get(STORAGE_KEYS.BROKER_FILTERS, {});
    delete allFilters[viewKey];
    storage.set(STORAGE_KEYS.BROKER_FILTERS, allFilters);
  },

  // ── Table Preferences (zd_bt) ───────────────────────────────
  getTablePreferences: (tableKey = 'agreements', defaultPrefs = { pageSize: 10, sortOrder: 'desc' }) => {
    const allTables = storage.get(STORAGE_KEYS.BROKER_TABLES, {});
    return allTables[tableKey] || defaultPrefs;
  },

  setTablePreferences: (tableKey, prefs) => {
    const allTables = storage.get(STORAGE_KEYS.BROKER_TABLES, {});
    storage.set(STORAGE_KEYS.BROKER_TABLES, {
      ...allTables,
      [tableKey]: { ...(allTables[tableKey] || {}), ...prefs }
    });
  },

  // ── Form Drafts (zd_bd) ─────────────────────────────────────
  // Non-sensitive in-progress drafts only (e.g., rental agreement creation)
  getDraft: (formKey = 'agreement_creation') => {
    const allDrafts = storage.get(STORAGE_KEYS.BROKER_DRAFTS, {});
    return allDrafts[formKey] || null;
  },

  setDraft: (formKey, draftData) => {
    // Ensure no passwords or sensitive KYC data are saved in draft
    const { password, token, secret, aadhaar, ...safeDraft } = draftData || {};
    const allDrafts = storage.get(STORAGE_KEYS.BROKER_DRAFTS, {});
    storage.set(STORAGE_KEYS.BROKER_DRAFTS, {
      ...allDrafts,
      [formKey]: safeDraft
    });
  },

  clearDraft: (formKey = 'agreement_creation') => {
    const allDrafts = storage.get(STORAGE_KEYS.BROKER_DRAFTS, {});
    if (allDrafts[formKey]) {
      delete allDrafts[formKey];
      storage.set(STORAGE_KEYS.BROKER_DRAFTS, allDrafts);
    }
  }
};

export default brokerStorage;
