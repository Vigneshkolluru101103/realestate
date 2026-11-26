/**
 * ZapDocs Help & Support Data Store
 * Structured FAQ, video guide placeholders, and troubleshooting content.
 * NOTE: All guidelines reflect current prototype specifications.
 * No official support phone number or playable video URLs are currently configured in this repository.
 */

export const SUPPORT_CONFIG = {
  // Explicitly null: No official support number or helpline is configured in the repository
  officialWhatsAppNumber: null,
  officialHelplineNumber: null,
  officialEmail: null
};

export const FAQ_ITEMS = [
  {
    id: 'faq-1',
    category: 'Account & Access',
    question: 'How do I resolve registration and login issues?',
    answer: 'Ensure you are entering the exact email address or 10-digit mobile number registered with your broker account. Use the show/hide password toggle to check for typos. If you have forgotten your password, use the "Forgot Password" link on the login page to set a new password. Newly registered brokers automatically gain access to the dashboard under the Pay-Per-Document tier.'
  },
  {
    id: 'faq-2',
    category: 'Agreements',
    question: 'How do I create a new rental or commercial agreement?',
    answer: 'Navigate to "My Agreements" and select agreement drafting, or click "Create Agreement" directly from a client record in the Clients Vault. Select either an 11-Month Residential Rental or a Commercial Lease Agreement, specify the property details, rent, and deposit, and proceed to digital verification.'
  },
  {
    id: 'faq-3',
    category: 'e-Sign & e-Stamp',
    question: 'How do Aadhaar e-Sign and e-Stamping work on ZapDocs?',
    answer: 'Once an agreement draft is prepared, state stamp duty is processed digitally (e-Stamp issued). An Aadhaar e-Sign link is then dispatched to the primary tenant for OTP verification. Note: Co-occupants are recorded under occupant covenants on the lease and do not receive separate e-sign links.'
  },
  {
    id: 'faq-4',
    category: 'Plans & Pricing',
    question: 'What monthly subscription plans are available for brokers?',
    answer: 'ZapDocs offers the Standard / Professional Plan at ₹5,000 per month, which includes 100 legal agreement drafts (effective ₹50/document). Brokers without an active monthly plan operate on the Pay-Per-Document tier at ₹99 per drafted agreement.'
  },
  {
    id: 'faq-5',
    category: 'Quota & Top-Ups',
    question: 'How does document quota work, and how can I purchase top-ups?',
    answer: 'Active Professional Plan subscribers receive a quota of 100 documents per billing cycle. Track your total, used, and remaining quota on the Plan & Billing screen. If your quota is exhausted, you can purchase instant top-ups: 10 documents for ₹990 or 25 documents for ₹1,875 (24% savings).'
  },
  {
    id: 'faq-6',
    category: 'Renewal & Expiry',
    question: 'What happens when my monthly subscription plan expires, and how do I renew?',
    answer: 'When a subscription expires, document creation under that quota is paused and the dashboard displays "Plan Expired". You can renew the Professional Plan for ₹5,000 or switch to the ₹99 pay-per-document tier. You can also turn Auto-Renew ON or OFF using the toggle switch in Plan & Billing.'
  },
  {
    id: 'faq-7',
    category: 'Billing & Invoices',
    question: 'Where can I view and download my billing receipts and invoices?',
    answer: 'Go to the "Plan & Billing" section to view your complete invoice history. Each invoice item displays the invoice reference number, billing date, description, amount, and payment status, along with a download action to save the invoice receipt.'
  },
  {
    id: 'faq-8',
    category: 'Refer & Earn',
    question: 'How does the Refer & Earn program work, and what is the reward?',
    answer: 'Brokers earn ₹50 directly to UPI per eligible referral after their app download and signup. Share your unique broker referral link via WhatsApp or copy the link directly from the Refer & Earn screen. Track successful signups and total rewards on your referral dashboard.'
  },
  {
    id: 'faq-9',
    category: 'Bank & UPI',
    question: 'How do I configure my UPI ID for referral reward payouts?',
    answer: 'Navigate to "Bank & UPI Settings" from the navigation sidebar. Enter and verify your UPI Virtual Payment Address (e.g., broker@upi). Referral earnings are routed to this verified handle once payout processing is activated.'
  },
  {
    id: 'faq-10',
    category: 'Downloads & Compliance',
    question: 'How do I download executed agreements and Section 63 evidentiary certificates?',
    answer: 'In the "My Agreements" screen, click the "Download" button on any completed agreement to access the final legal PDF and e-stamped certificate. You can also use the Section 63 Certificate Generator by entering the agreement reference or SHA-256 hash to download electronic evidence certificates under Bharatiya Sakshya Adhiniyam, 2023.'
  }
];

export const VIDEO_GUIDES = [
  {
    id: 'vid-1',
    title: 'How to register and sign in',
    description: 'A step-by-step walkthrough on creating your broker account, password setup, and accessing your dashboard.',
    duration: '2 min tutorial',
    category: 'Getting Started',
    hasPlayableVideo: false // No playable video URL configured in project
  },
  {
    id: 'vid-2',
    title: 'How to create an agreement',
    description: 'Learn how to draft an 11-month residential or commercial agreement, fill tenant details, and trigger e-Sign.',
    duration: '3 min tutorial',
    category: 'Agreements',
    hasPlayableVideo: false
  },
  {
    id: 'vid-3',
    title: 'How to manage clients',
    description: 'Guide to adding landlords and tenants in Clients Vault, keeping permanent addresses separate from linked properties.',
    duration: '3 min tutorial',
    category: 'Clients Vault',
    hasPlayableVideo: false
  },
  {
    id: 'vid-4',
    title: 'How to manage subscription and quota',
    description: 'Understand document quota utilization, purchasing 10 or 25 top-up packs, and auto-renewal controls.',
    duration: '2 min tutorial',
    category: 'Billing',
    hasPlayableVideo: false
  },
  {
    id: 'vid-5',
    title: 'How to use Refer & Earn',
    description: 'Learn how to invite fellow brokers via WhatsApp and earn ₹50 directly to your verified UPI ID.',
    duration: '2 min tutorial',
    category: 'Referrals',
    hasPlayableVideo: false
  }
];

export const TROUBLESHOOTING_TIPS = [
  {
    id: 'tb-1',
    scenario: 'Unable to sign in',
    title: 'Account Sign-In Troubleshooting',
    steps: [
      'Verify that you are using the exact email address or 10-digit mobile number associated with your broker registration.',
      'Check password case sensitivity using the eye toggle in the password field.',
      'If you have forgotten your password, click "Forgot Password" on the sign-in page to set a new password.'
    ]
  },
  {
    id: 'tb-2',
    scenario: 'Agreement download problems',
    title: 'Agreement Download Troubleshooting',
    steps: [
      'Ensure the agreement status is marked as Completed with digital signature authentication.',
      'Check whether your browser or device has blocked pop-up downloads.',
      'In this prototype environment, downloads generate instant in-browser sample previews.'
    ]
  },
  {
    id: 'tb-3',
    scenario: 'Exhausted document quota',
    title: 'Zero Document Quota Resolution',
    steps: [
      'Inspect your remaining quota on the Plan & Billing page (shows 0 / 100 documents).',
      'Add an instant 10-document top-up (₹990) or 25-document top-up (₹1,875) for immediate drafting credits.',
      'Alternatively, renew your Professional Plan (₹5,000) or utilize the ₹99 pay-per-document option.'
    ]
  },
  {
    id: 'tb-4',
    scenario: 'Expired subscription',
    title: 'Expired Subscription Resolution',
    steps: [
      'When your 30-day billing cycle lapses, document creation under the expired plan is paused.',
      'Visit Plan & Billing to click "Renew Plan (₹5,000)" or switch to the Pay-Per-Document tier at ₹99/draft.',
      'Enable Auto-Renew to prevent future service pauses at the end of billing cycles.'
    ]
  },
  {
    id: 'tb-5',
    scenario: 'Referral not appearing',
    title: 'Referral Tracking Troubleshooting',
    steps: [
      'Verify that the invited broker used your exact unique invite link (https://zapdocs.mock/join?ref=...).',
      'Rewards are granted only after the referred broker successfully completes app download and account signup.',
      'Note that prototype referral figures reflect local demo data and are not connected to a live production database.'
    ]
  }
];
