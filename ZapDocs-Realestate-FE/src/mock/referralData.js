/**
 * ZapDocs Mock Referral Records
 * Fictional referral activity for UI evaluation and prototyping.
 * NOTE: Sample records are strictly for frontend testing.
 * Newly registered brokers default to an empty records list.
 */

export const MOCK_REFERRAL_RECORDS = {
  // Ramesh Kumar (brk_1)
  brk_1: [
    {
      id: 'ref_001',
      brokerName: 'Anil Deshmukh',
      date: '2026-10-08',
      status: 'Eligible', // 'Invited' | 'Downloaded' | 'Registered' | 'Eligible' | 'Reward Pending'
      rewardAmount: 50,
      payoutStatus: 'Credited to UPI' // Payout confirmed
    },
    {
      id: 'ref_002',
      brokerName: 'Sneha Patel',
      date: '2026-10-10',
      status: 'Reward Pending',
      rewardAmount: 50,
      payoutStatus: 'Awaiting Payout' // Eligible confirmed, awaiting UPI batch payout
    },
    {
      id: 'ref_003',
      brokerName: 'Vikram Joshi',
      date: '2026-10-11',
      status: 'Registered',
      rewardAmount: 0,
      payoutStatus: 'Pending Eligibility' // App downloaded & registered; awaiting eligibility confirmation
    },
    {
      id: 'ref_004',
      brokerName: 'Manoj Tiwari',
      date: '2026-10-12',
      status: 'Downloaded',
      rewardAmount: 0,
      payoutStatus: 'Pending Eligibility' // Downloaded app, registration pending
    },
    {
      id: 'ref_005',
      brokerName: 'Harish Chandra',
      date: '2026-10-13',
      status: 'Invited',
      rewardAmount: 0,
      payoutStatus: 'Pending Eligibility' // Link sent, download pending
    }
  ],

  // Priya Sharma (brk_2)
  brk_2: [
    {
      id: 'ref_006',
      brokerName: 'Geeta Varma',
      date: '2026-09-28',
      status: 'Eligible',
      rewardAmount: 50,
      payoutStatus: 'Credited to UPI'
    },
    {
      id: 'ref_007',
      brokerName: 'Rohan Mehta',
      date: '2026-10-02',
      status: 'Reward Pending',
      rewardAmount: 50,
      payoutStatus: 'Awaiting Payout'
    }
  ],

  // Rajesh Rao (brk_3) - active plan broker with linked UPI ID
  brk_3: [
    {
      id: 'ref_008',
      brokerName: 'Karthik Narayanan',
      date: '2026-10-01',
      status: 'Eligible',
      rewardAmount: 50,
      payoutStatus: 'Credited to UPI'
    },
    {
      id: 'ref_009',
      brokerName: 'Sunil Gavaskar',
      date: '2026-10-05',
      status: 'Eligible',
      rewardAmount: 50,
      payoutStatus: 'Credited to UPI'
    },
    {
      id: 'ref_010',
      brokerName: 'Pradeep Shetty',
      date: '2026-10-09',
      status: 'Reward Pending',
      rewardAmount: 50,
      payoutStatus: 'Awaiting Payout'
    }
  ],

  // Suresh Reddy (brk_4) - empty referrals for testing zero-state
  brk_4: []
};

/**
 * Retrieve referral records for a specific broker account
 * Returns empty array for unknown or newly registered brokers.
 */
export function getReferralRecords(brokerId) {
  if (!brokerId) return [];
  return MOCK_REFERRAL_RECORDS[brokerId] || [];
}
