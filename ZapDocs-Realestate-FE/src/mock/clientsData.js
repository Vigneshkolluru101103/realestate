/**
 * ZapDocs Mock Clients Vault Store
 * Scoped to individual authenticated broker accounts.
 * Newly registered brokers default to an empty clients vault.
 * NOTE: All data is sample mock data for prototype evaluation.
 * Full Aadhaar numbers are never stored or exposed; only masked representations (XXXX-XXXX-NNNN) are maintained.
 */

export const MOCK_CLIENTS_BY_BROKER = {
  // Rajesh Rao (brk_3) - Active Pro broker with sample landlord and tenant portfolio
  brk_3: [
    {
      id: 'CLI-BLR-1001',
      brokerId: 'brk_3',
      isSample: true,
      name: 'Suresh Kumar Hegde',
      role: 'Landlord / Owner',
      phone: '+91 98111 22334',
      maskedAadhaar: 'XXXX-XXXX-4819',
      permanentAddress: 'No. 42, Sri Rama Nilaya, 3rd Main, Malleshwaram, Bengaluru - 560003',
      linkedProperties: [
        {
          id: 'PROP-BLR-01',
          propertyArea: 'Indiranagar, Bengaluru',
          address: 'Flat 402, Shanti Vihar, 12th Main, Indiranagar, Bengaluru - 560038',
          monthlyRent: 38000,
          securityDeposit: 190000,
          maintenance: 3500,
          status: 'Occupied',
          currentTenant: 'Rahul Verma'
        },
        {
          id: 'PROP-BLR-02',
          propertyArea: 'Domlur 2nd Stage, Bengaluru',
          address: 'Villa 7, Cambridge Layout, Domlur 2nd Stage, Bengaluru - 560071',
          monthlyRent: 55000,
          securityDeposit: 275000,
          maintenance: 4500,
          status: 'Vacant',
          currentTenant: null
        }
      ]
    },
    {
      id: 'CLI-BLR-1002',
      brokerId: 'brk_3',
      isSample: true,
      name: 'Venkat Ramanathan',
      role: 'Landlord / Owner',
      phone: '+91 98222 33445',
      maskedAadhaar: 'XXXX-XXXX-7104',
      permanentAddress: 'Plot 108, Lake View Enclave, Bellandur, Bengaluru - 560103',
      linkedProperties: [
        {
          id: 'PROP-BLR-03',
          propertyArea: 'Koramangala 4th Block, Bengaluru',
          address: 'No. 88, 5th Cross, 4th Block, Koramangala, Bengaluru - 560034',
          monthlyRent: 45000,
          securityDeposit: 225000,
          maintenance: 4000,
          status: 'Occupied',
          currentTenant: 'Ananya Deshmukh'
        }
      ]
    },
    {
      id: 'CLI-BLR-1003',
      brokerId: 'brk_3',
      isSample: true,
      name: 'Manjunath Reddy',
      role: 'Landlord / Owner',
      phone: '+91 98444 55667',
      maskedAadhaar: 'XXXX-XXXX-3928',
      permanentAddress: 'Farmhouse 12, Sarjapur Road, Anekal Taluk, Bengaluru - 562125',
      linkedProperties: [
        {
          id: 'PROP-BLR-04',
          propertyArea: 'HSR Layout Sector 2, Bengaluru',
          address: 'Villa 14, 19th Main, Sector 2, HSR Layout, Bengaluru - 560102',
          monthlyRent: 52000,
          securityDeposit: 260000,
          maintenance: 5000,
          status: 'Occupied',
          currentTenant: 'Karthik Subbaraj'
        }
      ]
    },
    {
      id: 'CLI-BLR-2001',
      brokerId: 'brk_3',
      isSample: true,
      name: 'Rahul Verma',
      role: 'Tenant',
      phone: '+91 98765 43210',
      maskedAadhaar: 'XXXX-XXXX-9142',
      permanentAddress: 'House 12B, Banjara Hills, Hyderabad, Telangana - 500034',
      linkedProperties: [
        {
          id: 'PROP-BLR-01',
          propertyArea: 'Indiranagar, Bengaluru',
          address: 'Flat 402, Shanti Vihar, 12th Main, Indiranagar, Bengaluru - 560038',
          monthlyRent: 38000,
          securityDeposit: 190000,
          maintenance: 3500,
          status: 'Leased'
        }
      ]
    },
    {
      id: 'CLI-BLR-2002',
      brokerId: 'brk_3',
      isSample: true,
      name: 'Ananya Deshmukh',
      role: 'Tenant',
      phone: '+91 98450 11223',
      maskedAadhaar: 'XXXX-XXXX-6231',
      permanentAddress: 'B-404, Shivaji Park Apartments, Dadar West, Mumbai, Maharashtra - 400028',
      linkedProperties: [
        {
          id: 'PROP-BLR-03',
          propertyArea: 'Koramangala 4th Block, Bengaluru',
          address: 'No. 88, 5th Cross, 4th Block, Koramangala, Bengaluru - 560034',
          monthlyRent: 45000,
          securityDeposit: 225000,
          maintenance: 4000,
          status: 'Leased'
        }
      ]
    },
    {
      id: 'CLI-BLR-2003',
      brokerId: 'brk_3',
      isSample: true,
      name: 'Karthik Subbaraj',
      role: 'Tenant',
      phone: '+91 98333 44556',
      maskedAadhaar: 'XXXX-XXXX-8820',
      permanentAddress: 'Flat 302, Green Glen Layout, Bellandur, Bengaluru - 560103',
      linkedProperties: [
        {
          id: 'PROP-BLR-04',
          propertyArea: 'HSR Layout Sector 2, Bengaluru',
          address: 'Villa 14, 19th Main, Sector 2, HSR Layout, Bengaluru - 560102',
          monthlyRent: 52000,
          securityDeposit: 260000,
          maintenance: 5000,
          status: 'Leased'
        }
      ]
    }
  ],

  // Ramesh Kumar (brk_1) - Pay-per-document broker defaults to empty clients vault
  brk_1: [],

  // Priya Sharma (brk_2) - Expired subscription broker defaults to empty clients vault
  brk_2: [],

  // Suresh Reddy (brk_4) - Quota-exhausted broker defaults to empty clients vault
  brk_4: []
};

// Backwards compatibility export
export const INITIAL_CLIENTS = MOCK_CLIENTS_BY_BROKER.brk_3;

const STORAGE_KEY_PREFIX = 'zapdocs_clients_';

/**
 * Helper to mask Aadhaar string to XXXX-XXXX-NNNN format.
 * Never stores or exposes unmasked digits.
 */
export function formatMaskedAadhaar(raw) {
  if (!raw) return 'XXXX-XXXX-XXXX';
  const clean = String(raw).replace(/\D/g, '');
  if (clean.length >= 4) {
    const last4 = clean.slice(-4);
    return `XXXX-XXXX-${last4}`;
  }
  return 'XXXX-XXXX-XXXX';
}

/**
 * Retrieve clients strictly scoped to the specified broker ID.
 * Returns empty array for unknown or newly registered brokers.
 */
export function getClients(brokerId = 'default') {
  if (typeof window === 'undefined') {
    return MOCK_CLIENTS_BY_BROKER[brokerId] || [];
  }
  try {
    const key = `${STORAGE_KEY_PREFIX}${brokerId}`;
    const stored = window.sessionStorage.getItem(key);
    if (stored !== null) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {}
    }
    // Seed initial mock clients only if broker has defined mock records
    const initialRecords = MOCK_CLIENTS_BY_BROKER[brokerId] || [];
    window.sessionStorage.setItem(key, JSON.stringify(initialRecords));
    return initialRecords;
  } catch {
    return MOCK_CLIENTS_BY_BROKER[brokerId] || [];
  }
}

/**
 * Save updated clients list strictly for the specified broker ID.
 */
export function saveClients(param1, param2) {
  let clients = param1;
  let brokerId = param2 || 'default';
  if (typeof param1 === 'string' && Array.isArray(param2)) {
    brokerId = param1;
    clients = param2;
  }
  if (typeof window === 'undefined') return;
  try {
    const key = `${STORAGE_KEY_PREFIX}${brokerId}`;
    window.sessionStorage.setItem(key, JSON.stringify(clients));
  } catch (err) {
    console.error('Failed to save clients in session:', err);
  }
}
