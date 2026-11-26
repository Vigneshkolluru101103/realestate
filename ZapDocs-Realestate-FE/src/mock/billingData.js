/**
 * ZapDocs Mock Billing & Invoices Store
 * Realistic mock invoice records for prototype evaluation.
 * NOTE: All records are prototype sample data. No real financial transactions,
 * tax invoices, or payment gateway debits have taken place.
 */

export const MOCK_INVOICES = {
  // brk_1 (Ramesh Kumar): Newly registered / Pay-Per-Doc -> Empty billing history
  brk_1: [],

  // brk_2 (Priya Sharma): Expired subscription
  brk_2: [
    {
      invoiceNumber: 'INV-2025-0891',
      date: '15 Jul 2025',
      description: 'Standard Professional Plan (100 Documents) — Expired',
      amount: 5000,
      paymentMethod: 'UPI (priya@oksbi)',
      status: 'Paid',
      planTier: 'Professional Tier',
      documentCredits: 100,
      isSample: true
    }
  ],

  // brk_3 (Rajesh Rao): Active subscription with remaining quota
  brk_3: [
    {
      invoiceNumber: 'INV-2026-1042',
      date: '01 Oct 2026',
      description: 'Standard Professional Plan (100 Documents)',
      amount: 5000,
      paymentMethod: 'UPI (rajesh@okhdfcbank)',
      status: 'Paid',
      planTier: 'Professional Tier',
      documentCredits: 100,
      isSample: true
    },
    {
      invoiceNumber: 'INV-2026-0782',
      date: '01 Sep 2026',
      description: 'Standard Professional Plan (100 Documents)',
      amount: 5000,
      paymentMethod: 'UPI (rajesh@okhdfcbank)',
      status: 'Paid',
      planTier: 'Professional Tier',
      documentCredits: 100,
      isSample: true
    }
  ],

  // brk_4 (Suresh Reddy): Active subscription with zero quota
  brk_4: [
    {
      invoiceNumber: 'INV-2026-0914',
      date: '10 Sep 2026',
      description: 'Standard Professional Plan (100 Documents) — Quota Exhausted',
      amount: 5000,
      paymentMethod: 'Net Banking (HDFC Bank)',
      status: 'Paid',
      planTier: 'Professional Tier',
      documentCredits: 100,
      isSample: true
    }
  ]
};

/**
 * Returns invoices for the authenticated broker.
 * If broker has no invoices, returns empty array.
 */
export function getInvoicesForBroker(brokerId) {
  if (!brokerId || !MOCK_INVOICES[brokerId]) {
    return [];
  }
  return MOCK_INVOICES[brokerId];
}
