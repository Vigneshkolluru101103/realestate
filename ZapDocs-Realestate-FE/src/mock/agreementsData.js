/**
 * ZapDocs Mock Agreements Store
 * Scoped to individual authenticated broker accounts.
 * Newly registered brokers default to an empty agreement store.
 * NOTE: All data is sample mock data for prototype evaluation.
 */

export const MOCK_AGREEMENTS_BY_BROKER = {
  // Rajesh Rao (brk_3) - Active Professional plan broker with sample executed and pending agreements
  brk_3: [
    {
      id: 'ZD-2026-BLR-8491',
      brokerId: 'brk_3',
      isSample: true,
      sha256Hash: 'a7c9f82d4e1b3056c7d8e9f01a2b3c4d5e6f708192a3b4c5d6e7f8a9b0c1d2e3',
      date: '12 Oct 2026',
      agreementType: '11-Month Residential Rental',
      tenantName: 'Rahul Verma',
      tenantPhone: '+91 98765 43210',
      coOccupants: ['Pooja Verma (Spouse)', 'Aarav Verma (Child)'],
      ownerName: 'Suresh Kumar Hegde',
      ownerPhone: '+91 98111 22334',
      propertyArea: 'Indiranagar, Bengaluru',
      propertyAddress: 'Flat 402, Shanti Vihar, 12th Main, Indiranagar, Bengaluru - 560038',
      monthlyRent: 38000,
      securityDeposit: 190000,
      leaseStartDate: '2026-10-15',
      leaseEndDate: '2027-09-14',
      status: 'Pending e-Sign', // 'Pending e-Sign' | 'Completed' | 'Expiring Soon'
      eStampIssued: true,
      eStampNumber: 'IN-KA99482019482X',
      tenantSigned: false,
      ownerSigned: true,
      eSignLink: 'https://zapdocs.mock/esign/ZD-2026-BLR-8491'
    },
    {
      id: 'ZD-2026-BLR-7720',
      brokerId: 'brk_3',
      isSample: true,
      sha256Hash: 'b2d8e41a0f9c3b7e5d1a8c4f2e0b6d9a3c7e1f5b8d2a4c6e9f1a3b5c7d9e2f4a',
      date: '28 Sep 2026',
      agreementType: '11-Month Residential Rental',
      tenantName: 'Ananya Deshmukh',
      tenantPhone: '+91 98450 11223',
      coOccupants: [],
      ownerName: 'Venkat Ramanathan',
      ownerPhone: '+91 98222 33445',
      propertyArea: 'Koramangala 4th Block, Bengaluru',
      propertyAddress: 'No. 88, 5th Cross, 4th Block, Koramangala, Bengaluru - 560034',
      monthlyRent: 45000,
      securityDeposit: 225000,
      leaseStartDate: '2026-10-01',
      leaseEndDate: '2027-08-31',
      status: 'Completed',
      eStampIssued: true,
      eStampNumber: 'IN-KA88301928471Y',
      tenantSigned: true,
      ownerSigned: true,
      eSignLink: 'https://zapdocs.mock/esign/ZD-2026-BLR-7720'
    },
    {
      id: 'ZD-2025-BLR-3104',
      brokerId: 'brk_3',
      isSample: true,
      sha256Hash: 'f4e2c8a1b9d0e7f3a5c2d8b1e4f6a9c3e7b1d5a8c2f4e6b9d1a3c5e7f9b2d4a6',
      date: '18 Nov 2025',
      agreementType: '11-Month Residential Rental',
      tenantName: 'Karthik Subbaraj',
      tenantPhone: '+91 98333 44556',
      coOccupants: ['Deepa Subbaraj (Co-Tenant)', 'Ravi Subbaraj (Father)'],
      ownerName: 'Manjunath Reddy',
      ownerPhone: '+91 98444 55667',
      propertyArea: 'HSR Layout Sector 2, Bengaluru',
      propertyAddress: 'Villa 14, 19th Main, Sector 2, HSR Layout, Bengaluru - 560102',
      monthlyRent: 52000,
      securityDeposit: 260000,
      leaseStartDate: '2025-11-20',
      leaseEndDate: '2026-10-19',
      status: 'Expiring Soon',
      eStampIssued: true,
      eStampNumber: 'IN-KA77291048192Z',
      tenantSigned: true,
      ownerSigned: true,
      eSignLink: 'https://zapdocs.mock/esign/ZD-2025-BLR-3104'
    }
  ],

  // Priya Sharma (brk_2) - Expired subscription broker with historical lease
  brk_2: [
    {
      id: 'ZD-2025-BLR-2299',
      brokerId: 'brk_2',
      isSample: true,
      sha256Hash: 'e5b7a9c1d3f2e4a6c8b0d2f4e6a8c1e3b5d7f9a2c4e6b8d0f2a4c6e8b1d3f5a7',
      date: '02 Nov 2025',
      agreementType: '11-Month Residential Rental',
      tenantName: 'Farhan Akhtar',
      tenantPhone: '+91 98999 00112',
      coOccupants: ['Zoya Akhtar (Sister)'],
      ownerName: 'Girish Karnad Properties',
      ownerPhone: '+91 98000 11223',
      propertyArea: 'Hebbal, Bengaluru',
      propertyAddress: 'Tower B-1102, Lake Vista, Outer Ring Road, Hebbal, Bengaluru - 560024',
      monthlyRent: 42000,
      securityDeposit: 210000,
      leaseStartDate: '2025-11-05',
      leaseEndDate: '2026-10-25',
      status: 'Expiring Soon',
      eStampIssued: true,
      eStampNumber: 'IN-KA22948102938C',
      tenantSigned: true,
      ownerSigned: true,
      eSignLink: 'https://zapdocs.mock/esign/ZD-2025-BLR-2299'
    }
  ],

  // Suresh Reddy (brk_4) - Quota-Exhausted broker
  brk_4: [
    {
      id: 'ZD-2026-BLR-6612',
      brokerId: 'brk_4',
      isSample: true,
      sha256Hash: 'c1a3e5f7b9d2e4a6c8f0b2d4e6a8c1f3b5d7e9a2c4f6b8d0e2a4c6f8b1d3e5a7',
      date: '04 Oct 2026',
      agreementType: 'Commercial Lease Agreement',
      tenantName: 'TechWave Solutions LLP (Rep: Vikram Rao)',
      tenantPhone: '+91 98555 66778',
      coOccupants: ['Aditya Joshi (Partner)', 'Meera Nair (Director)'],
      ownerName: 'Brigade Commercial Ventures',
      ownerPhone: '+91 98666 77889',
      propertyArea: 'Whitefield, Bengaluru',
      propertyAddress: 'Unit 304, IT Park Zone, EPIP Area, Whitefield, Bengaluru - 560066',
      monthlyRent: 85000,
      securityDeposit: 510000,
      leaseStartDate: '2026-10-10',
      leaseEndDate: '2027-09-09',
      status: 'Pending e-Sign',
      eStampIssued: true,
      eStampNumber: 'IN-KA66109284710A',
      tenantSigned: false,
      ownerSigned: true,
      eSignLink: 'https://zapdocs.mock/esign/ZD-2026-BLR-6612'
    },
    {
      id: 'ZD-2026-BLR-5190',
      brokerId: 'brk_4',
      isSample: true,
      sha256Hash: 'd9f1b3e5a7c2d4e6f8a0b2c4d6e8f1a3b5c7d9e2f4a6b8c0d2e4f6a8b1c3d5e7',
      date: '15 Sep 2026',
      agreementType: '11-Month Residential Rental',
      tenantName: 'Priyanka Sen',
      tenantPhone: '+91 98777 88990',
      coOccupants: [],
      ownerName: 'Narayana Murthy Trust',
      ownerPhone: '+91 98888 99001',
      propertyArea: 'Jayanagar 9th Block, Bengaluru',
      propertyAddress: 'Door 45, 33rd Cross, 9th Block, Jayanagar, Bengaluru - 560069',
      monthlyRent: 31000,
      securityDeposit: 155000,
      leaseStartDate: '2026-09-20',
      leaseEndDate: '2027-08-19',
      status: 'Completed',
      eStampIssued: true,
      eStampNumber: 'IN-KA51928401928B',
      tenantSigned: true,
      ownerSigned: true,
      eSignLink: 'https://zapdocs.mock/esign/ZD-2026-BLR-5190'
    }
  ],

  // Ramesh Kumar (brk_1) - Pay-per-document broker defaults to empty store
  brk_1: []
};

// Backwards compatibility export
export const MOCK_AGREEMENTS = MOCK_AGREEMENTS_BY_BROKER.brk_3;

const STORAGE_KEY_PREFIX = 'zapdocs_agreements_';

/**
 * Retrieve agreements strictly scoped to the specified broker ID.
 * Returns empty array for unknown or newly registered brokers.
 */
export function getAgreements(brokerId = 'default') {
  if (typeof window === 'undefined') {
    return MOCK_AGREEMENTS_BY_BROKER[brokerId] || [];
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
    // Seed initial mock agreements only if broker has defined mock records
    const initialRecords = MOCK_AGREEMENTS_BY_BROKER[brokerId] || [];
    window.sessionStorage.setItem(key, JSON.stringify(initialRecords));
    return initialRecords;
  } catch {
    return MOCK_AGREEMENTS_BY_BROKER[brokerId] || [];
  }
}

/**
 * Save updated agreements list strictly for the specified broker ID.
 */
export function saveAgreements(param1, param2) {
  let brokerId = param1;
  let agreements = param2;
  if (Array.isArray(param1) && typeof param2 === 'string') {
    agreements = param1;
    brokerId = param2;
  }
  if (!brokerId || typeof window === 'undefined') return;
  try {
    const key = `${STORAGE_KEY_PREFIX}${brokerId}`;
    window.sessionStorage.setItem(key, JSON.stringify(agreements));
  } catch (err) {
    console.error('Failed to save agreements in session:', err);
  }
}
