/**
 * ZapDocs Centralized LocalStorage Keys
 * Short, distinct keys for storage isolation between Admin, Broker, and Shared preferences.
 */
export const STORAGE_KEYS = {
  // Authentication & Demo Sessions
  ADMIN_SESSION: 'zd_adm',      // Admin demo session
  BROKER_SESSION: 'zd_brk',     // Broker demo session
  USER_SESSION: 'zd_usr',       // User/Owner mock session
  LOGIN_THROTTLE: 'zd_lt',      // Non-sensitive login attempt counters and cooldown timestamps

  // Shared Preferences
  THEME: 'zd_theme',            // Shared theme preference (e.g. 'light')
  LANGUAGE: 'zd_lang',          // Interface language preference
  FAILOVER_CONFIG: 'zapdocs_failover_config', // Failover configuration state

  // Bank & UPI Storage Prefixes
  BANK_ACCOUNT_PREFIX: 'zapdocs_bank_account_',
  UPI_ID_PREFIX: 'zapdocs_upi_id_',

  // Admin Portal State
  ADMIN_PREFERENCES: 'zd_ap',   // Admin UI preferences (profile details, sidebars)
  ADMIN_FILTERS: 'zd_af',       // Admin filters and search state across lists
  ADMIN_TABLES: 'zd_at',        // Admin table preferences (sort, page size)

  // Broker Portal State
  BROKER_PREFERENCES: 'zd_bp',  // Broker UI preferences (auto-renew, views)
  BROKER_FILTERS: 'zd_bf',      // Broker filters and search state
  BROKER_TABLES: 'zd_bt',       // Broker table preferences (page size, sorting)
  BROKER_DRAFTS: 'zd_bd'        // Broker non-sensitive form drafts (agreement draft)
};

// Freeze object to avoid accidental runtime mutation
Object.freeze(STORAGE_KEYS);

export default STORAGE_KEYS;
