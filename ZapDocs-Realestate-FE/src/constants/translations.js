/**
 * ZapDocs Shared Translation System
 * Comprehensive interface dictionaries for English (EN), Hindi (HI), Telugu (TE), Kannada (KN), and Marathi (MR).
 */

export const AVAILABLE_LANGUAGES = [
  { code: 'en', displayCode: 'EN', shortCode: 'EN', label: 'English', native: 'English', fullLabel: 'English' },
  { code: 'hi', displayCode: 'हिन्दी', shortCode: 'हि', label: 'Hindi', native: 'हिन्दी', fullLabel: 'हिन्दी – Hindi' },
  { code: 'te', displayCode: 'తెలుగు', shortCode: 'తె', label: 'Telugu', native: 'తెలుగు', fullLabel: 'తెలుగు – Telugu' },
  { code: 'kn', displayCode: 'ಕನ್ನಡ', shortCode: 'ಕ', label: 'Kannada', native: 'ಕನ್ನಡ', fullLabel: 'ಕನ್ನಡ – Kannada' },
  { code: 'mr', displayCode: 'मराठी', shortCode: 'म', label: 'Marathi', native: 'मराठी', fullLabel: 'मराठी – Marathi' }
];

export const STATE_TO_LANGUAGE_MAP = {
  karnataka: 'kn',
  telangana: 'te',
  'andhra pradesh': 'te',
  andhra: 'te',
  maharashtra: 'mr',
  delhi: 'hi',
  'uttar pradesh': 'hi',
  up: 'hi',
  rajasthan: 'hi',
  gujarat: 'hi',
  'madhya pradesh': 'hi',
  mp: 'hi',
  haryana: 'hi',
  punjab: 'hi',
  bihar: 'hi',
  national: 'hi'
};

export function getLanguageForState(stateName) {
  if (!stateName || typeof stateName !== 'string') return 'en';
  const clean = stateName.toLowerCase().trim();
  if (STATE_TO_LANGUAGE_MAP[clean]) {
    return STATE_TO_LANGUAGE_MAP[clean];
  }
  return 'hi';
}

export const UI_TRANSLATIONS = {
  en: {
    // Navigation
    nav_home: 'Dashboard',
    nav_agreements: 'My Agreements',
    nav_clients: 'Clients Vault',
    nav_billing: 'Plan & Billing',
    nav_bank_upi: 'Bank & UPI Settings',
    nav_refer: 'Earn & Refer',
    nav_help: 'Help & Support',
    nav_section_main: 'Main Navigation',
    nav_section_growth: 'Growth & Support',
    logout: 'Log Out',

    // Top Header & Greeting
    header_greeting_prefix: 'Hello',
    header_subtitle: 'Commercial & Residential Broker Vault',

    // Profile Dropdown
    profile_title: 'Broker Profile',
    profile_account_details: 'Account & Plan Details',
    profile_id_label: 'Broker ID',
    profile_tier_label: 'Tier Status',
    profile_quota_label: 'Document Quota',
    profile_phone_label: 'Mobile',
    profile_email_label: 'Identifier',
    profile_view_billing: 'View Plan & Invoices',
    profile_view_bank: 'Manage Bank & Settlement UPI',
    pro_active: 'Professional Plan Active',
    pay_doc_active: 'Pay-Per-Doc Active',
    lang_selector_title: 'Interface Language',
    lang_selector_subtitle: 'Choose preferred regional working language',
    state_jurisdiction_label: 'Broker Jurisdiction',
    state_suggested_lang: 'Suggested for your state',
    lang_saved_feedback: 'Language preference saved',

    // Dashboard Quota & Cards
    pro_plan_title: 'Professional Tier — ₹5,000 / month',
    status_active: 'Active',
    status_completed: 'Completed',
    status_pending: 'Pending e-Sign',
    status_expiring: 'Expiring Soon',
    renewal_reset_prefix: 'Renewal cycle resets on',
    auto_renew: 'Auto-Renew',
    quota_title: 'Allocated Quota vs. Used Documents',
    quota_total: 'Total',
    quota_used: 'Used',
    quota_remaining: 'Remaining',
    quota_used_docs: 'Used Documents',
    quota_unused_docs: 'Unused Documents',
    quota_utilized: 'quota utilized',
    quota_exhausted_title: 'QUOTA EXHAUSTED (0 Agreements Left)',
    quota_exhausted_desc: 'Your monthly plan limit is fully utilized. Choose an instant replenishment option to continue generating agreements without interruptions.',

    // Buttons & Actions
    btn_renew_plan: 'Renew Plan (₹5,000)',
    btn_pay_doc_instant: 'Pay-Per-Doc (₹99 Instant Single Agreement)',
    btn_gen_rental: '+ Generate Rental Agreement',
    btn_gen_other: '+ Generate Other Agreements',
    btn_gen_new: '+ Generate New Agreement',
    btn_refer_action: 'Refer & Earn ₹50',
    btn_view_all_vault: 'View All in Vault →',
    btn_upgrade_pro: 'Upgrade to Pro Plan (₹5,000 / 100 Docs)',
    btn_whatsapp: 'WhatsApp',
    btn_resend_wa: 'Resend WA',
    btn_pdf: 'PDF',
    btn_renew: 'Renew',
    btn_remind_wa: 'Remind WA',
    btn_sec63: 'Section 63',
    btn_compliance: 'Compliance',
    compliance_retry: 'Retry Compliance',
    sec63_generating: 'Generating...',

    // Referral Banner & Section
    refer_badge: 'Broker Referral Initiative',
    refer_title: 'Invite Fellow Brokers & Earn ₹50 Directly to UPI',
    refer_desc: 'Prominent broker reward program: Earn ₹50 directly credited to your linked UPI ID per registered referral upon their app download and signup.',
    refer_page_title: 'Refer & Earn ₹50 per Broker',
    refer_page_subtitle: 'Earn ₹50 directly credited to your linked UPI ID per registered referral upon their app download and signup.',
    refer_link_label: 'Your Unique Broker Referral Link',
    btn_copy_link: 'Copy Referral Link',
    btn_share_whatsapp: 'Share via WhatsApp',
    refer_link_copied: 'Referral link copied to clipboard!',
    refer_stats_heading: 'Referral Performance Dashboard',
    refer_stat_total: 'Total Referrals',
    refer_stat_converted: 'Successfully Onboarded',
    refer_stat_earnings: 'Total Earned',

    // Vault Table & Agreements Screen
    vault_overview_title: 'Quick Document Vault Overview',
    vault_overview_sub: 'Live tracking of recently executed lease contracts',
    th_date: 'Date',
    th_client_property: 'Client / Property',
    th_agreement_type: 'Agreement Type',
    th_status: 'Status',
    th_quick_actions: 'Quick Actions',
    th_execution_date: 'Execution Date',
    th_client_property_name: 'Client / Property Name',
    th_real_time_status: 'Real-Time Status',
    th_universal_quick_actions: 'Universal Quick Actions',
    agreements_title: 'My Agreements Section',
    agreements_subtitle: 'The centralized document management and tracking vault.',
    search_agreements_placeholder: 'Search by Tenant Name, Owner Name, or Property Area...',
    filter_all: 'All',
    filter_pending: 'Pending e-Sign',
    filter_completed: 'Completed',
    filter_expiring: 'Expiring Soon',
    tenant_label: 'Tenant',
    owner_label: 'Owner',
    empty_agreements_title: 'No agreements found',
    empty_agreements_desc: 'Try adjusting your search terms or select the \'All\' filter.',
    btn_reset_filters: 'Reset Search & Filters',
    showing_agreements_prefix: 'Showing',
    showing_agreements_of: 'of',
    agreements_unit: 'agreements',
    nesl_uidai_backing: 'All agreements backed by NeSL e-Stamping & UIDAI e-Sign Certificate',

    // Clients Vault
    clients_title: 'Clients Vault',
    clients_subtitle: 'Centralized tenant & landlord records backed by UIDAI Aadhaar verification.',
    btn_add_client: '+ Add New Client',
    search_clients_placeholder: 'Search by Client Name, Phone, Aadhaar, or Property...',
    tab_all_clients: 'All Clients',
    tab_landlords: 'Landlords',
    tab_tenants: 'Tenants',
    th_client_name: 'Client Name',
    th_role: 'Role',
    th_contact: 'Contact & Identifiers',
    th_linked_agreements: 'Linked Agreements',
    th_actions: 'Actions',
    empty_clients_title: 'No clients found matching your query',
    empty_clients_desc: 'Try adjusting your search terms or reset filters.',
    role_tenant: 'Tenant',
    role_landlord: 'Landlord / Owner',
    aadhaar_verified: 'Aadhaar Verified',
    btn_create_agreement: 'Create Agreement',
    btn_edit_client: 'Edit Details',

    // Plan & Billing
    billing_title: 'Plan & Billing',
    billing_subtitle: 'Manage your subscription tier, top-ups, invoices, and settlement accounts.',
    billing_tier_header: 'Current Subscription Tier',
    billing_auto_renew_label: 'Auto-Renew',
    billing_quota_summary: 'Document Drafting Quota',
    billing_topup_title: 'Instant Quota Top-Ups',
    billing_topup_10: '10 Documents — ₹990',
    billing_topup_25: '25 Documents — ₹1,875 (24% Off)',
    billing_invoice_history: 'Invoice History & Receipts',
    th_invoice_num: 'Invoice #',
    th_billing_date: 'Date',
    th_description: 'Description',
    th_amount: 'Amount',
    th_payment_status: 'Status',
    th_receipt: 'Receipt',
    btn_download_receipt: 'Download Receipt',

    // Bank & UPI Settings
    bank_upi_title: 'Bank & UPI Settlement Settings',
    bank_upi_subtitle: 'Configure your settlement bank account and UPI handle for referral and payout disbursements.',
    bank_details_section: 'Linked Settlement Bank Account',
    account_holder_label: 'Account Holder Name',
    account_number_label: 'Bank Account Number',
    confirm_acc_number_label: 'Confirm Account Number',
    ifsc_code_label: 'IFSC Code',
    upi_section: 'Settlement UPI ID',
    upi_input_label: 'UPI Virtual Payment Address (VPA)',
    btn_verify_save_upi: 'Verify & Save UPI',
    btn_save_bank: 'Save Bank Details',
    btn_edit_bank: 'Edit Bank Account',
    bank_payout_guarantee: 'Referral rewards credited directly within 24 hours of successful signup.',

    // Help & Support
    help_page_title: 'Help & Support Desk',
    help_page_subtitle: 'Practical guidance on e-Stamping, agreement creation, quotas, and support requests.',
    faq_title: 'Frequently Asked Questions',
    faq_desc: 'Practical answers regarding onboarding, digital stamp duty, agreement drafting, and quota top-ups.',
    faq_search_placeholder: 'Search FAQs by keyword (e.g., e-stamp, quota, login, renewal)...',
    faq_showing_prefix: 'Showing',
    faq_of: 'of',
    faq_questions: 'questions',
    faq_expand_all: 'Expand All',
    faq_collapse_all: 'Collapse All',
    faq_clear_search: 'Clear FAQ Search',
    faq_empty_msg: 'No FAQ items matched your query',
    callback_heading: 'Request Priority Callback',
    callback_desc: 'Our broker operations desk will call you back within 15 minutes.',
    callback_name_label: 'Your Name',
    callback_phone_label: '10-Digit Mobile Number',
    callback_issue_label: 'Describe your issue or query',
    btn_request_callback: 'Request Priority Callback',
    callback_success_msg: 'Callback requested! Our team will reach you shortly.',

    // Common
    cancel: 'Cancel',
    save: 'Save Changes',
    close: 'Close',
    loading: 'Loading...',
    confirm: 'Confirm',
    success: 'Success',
    error: 'Error',
    select_language: 'Select Language'
  },

  hi: {
    // Navigation (Hindi)
    nav_home: 'डैशबोर्ड',
    nav_agreements: 'मेरे अनुबंध',
    nav_clients: 'क्लाइंट्स वॉल्ट',
    nav_billing: 'प्लान और बिलिंग',
    nav_bank_upi: 'बैंक और UPI सेटिंग्स',
    nav_refer: 'कमाएं और रेफर करें',
    nav_help: 'सहायता और समर्थन',
    nav_section_main: 'मुख्य मेनू',
    nav_section_growth: 'प्रगति और सहायता',
    logout: 'लॉग आउट',

    // Top Header & Greeting
    header_greeting_prefix: 'नमस्ते',
    header_subtitle: 'व्यावसायिक और आवासीय ब्रोकर वॉल्ट',

    // Profile Dropdown
    profile_title: 'ब्रोकर प्रोफाइल',
    profile_account_details: 'खाता और प्लान विवरण',
    profile_id_label: 'ब्रोकर आईडी',
    profile_tier_label: 'प्लान स्थिति',
    profile_quota_label: 'दस्तावेज़ कोटा',
    profile_phone_label: 'मोबाइल नंबर',
    profile_email_label: 'ईमेल / पहचान',
    profile_view_billing: 'प्लान और इनवॉइस देखें',
    profile_view_bank: 'बैंक और सेटलमेंट UPI प्रबंधित करें',
    pro_active: 'प्रोफेशनल प्लान सक्रिय',
    pay_doc_active: 'पे-पर-डॉक सक्रिय',
    lang_selector_title: 'इंटरफ़ेस भाषा',
    lang_selector_subtitle: 'अपनी पसंदीदा क्षेत्रीय कार्य भाषा चुनें',
    state_jurisdiction_label: 'ब्रोकर राज्य क्षेत्राधिकार',
    state_suggested_lang: 'आपके राज्य के अनुसार सुझाई गई',
    lang_saved_feedback: 'भाषा प्राथमिकता सुरक्षित की गई',

    // Dashboard Quota & Cards
    pro_plan_title: 'प्रोफेशनल टियर — ₹5,000 / माह',
    status_active: 'सक्रिय',
    status_completed: 'पूर्ण हुआ',
    status_pending: 'ई-हस्ताक्षर प्रतीक्षित',
    status_expiring: 'शीघ्र समाप्त',
    renewal_reset_prefix: 'नवीनीकरण चक्र रीसेट तिथि',
    auto_renew: 'ऑटो-रिन्यू',
    quota_title: 'आवंटित कोटा बनाम उपयोग किए गए दस्तावेज़',
    quota_total: 'कुल',
    quota_used: 'उपयोग हुआ',
    quota_remaining: 'शेष',
    quota_used_docs: 'उपयोग किए गए दस्तावेज़',
    quota_unused_docs: 'अप्रयुक्त दस्तावेज़',
    quota_utilized: 'कोटा उपयोग',
    quota_exhausted_title: 'कोटा समाप्त (0 अनुबंध शेष)',
    quota_exhausted_desc: 'आपकी मासिक प्लान सीमा समाप्त हो गई है। बिना रुकावट अनुबंध बनाने के लिए तुरंत टॉप-अप विकल्प चुनें।',

    // Buttons & Actions
    btn_renew_plan: 'प्लान रिन्यू करें (₹5,000)',
    btn_pay_doc_instant: 'पे-पर-डॉक (₹99 तुरंत एकल अनुबंध)',
    btn_gen_rental: '+ किराया अनुबंध बनाएं',
    btn_gen_other: '+ अन्य अनुबंध बनाएं',
    btn_gen_new: '+ नया अनुबंध बनाएं',
    btn_refer_action: 'रेफर करें और ₹50 कमाएं',
    btn_view_all_vault: 'वॉल्ट में सभी देखें →',
    btn_upgrade_pro: 'प्रो प्लान में अपग्रेड करें (₹5,000 / 100 दस्तावेज़)',
    btn_whatsapp: 'व्हाट्सएप',
    btn_resend_wa: 'व्हाट्सएप पुनः भेजें',
    btn_pdf: 'पीडीएफ',
    btn_renew: 'रिन्यू करें',
    btn_remind_wa: 'याद दिलाएं WA',
    btn_sec63: 'धारा 63',
    btn_compliance: 'अनुपालन',
    compliance_retry: 'अनुपालन पुनः प्रयास करें',
    sec63_generating: 'तैयार हो रहा है...',

    // Referral Banner & Section
    refer_badge: 'ब्रोकर रेफरल कार्यक्रम',
    refer_title: 'साथी ब्रोकर्स को आमंत्रित करें और सीधे UPI में ₹50 पाएं',
    refer_desc: 'ब्रोकर पुरस्कार कार्यक्रम: आपके रेफरल लिंक से पंजीकरण और ऐप डाउनलोड करने पर प्रत्येक सफल रेफरल पर ₹50 सीधे आपके UPI में जमा होंगे।',
    refer_page_title: 'रेफर करें और प्रति ब्रोकर ₹50 पाएं',
    refer_page_subtitle: 'अपने रेफरल लिंक से प्रत्येक सफल पंजीकरण पर ₹50 सीधे अपने बैंक UPI खाते में प्राप्त करें।',
    refer_link_label: 'आपका विशिष्ट रेफरल लिंक',
    btn_copy_link: 'लिंक कॉपी करें',
    btn_share_whatsapp: 'व्हाट्सएप पर शेयर करें',
    refer_link_copied: 'रेफरल लिंक क्लिपबोर्ड पर कॉपी हो गया!',
    refer_stats_heading: 'रेफरल प्रदर्शन डैशबोर्ड',
    refer_stat_total: 'कुल रेफरल',
    refer_stat_converted: 'सफल पंजीकृत',
    refer_stat_earnings: 'कुल कमाई',

    // Vault Table & Agreements Screen
    vault_overview_title: 'दस्तावेज़ वॉल्ट त्वरित समीक्षा',
    vault_overview_sub: 'हाल ही में निष्पादित पट्टा अनुबंधों की लाइव ट्रैकिंग',
    th_date: 'तारीख',
    th_client_property: 'क्लाइंट / संपत्ति',
    th_agreement_type: 'अनुबंध प्रकार',
    th_status: 'स्थिति',
    th_quick_actions: 'त्वरित कार्रवाई',
    th_execution_date: 'निष्पादन तिथि',
    th_client_property_name: 'क्लाइंट / संपत्ति का नाम',
    th_real_time_status: 'रीयल-टाइम स्थिति',
    th_universal_quick_actions: 'त्वरित कार्रवाइयां',
    agreements_title: 'मेरे अनुबंध अनुभाग',
    agreements_subtitle: 'केंद्रीकृत दस्तावेज़ प्रबंधन और ट्रैकिंग वॉल्ट।',
    search_agreements_placeholder: 'किरायेदार, मालिक या संपत्ति क्षेत्र से खोजें...',
    filter_all: 'सभी',
    filter_pending: 'ई-हस्ताक्षर प्रतीक्षित',
    filter_completed: 'पूर्ण हुआ',
    filter_expiring: 'शीघ्र समाप्त',
    tenant_label: 'किरायेदार',
    owner_label: 'मकान मालिक',
    empty_agreements_title: 'कोई अनुबंध नहीं मिला',
    empty_agreements_desc: 'खोज शब्द बदलकर देखें या \'सभी\' फ़िल्टर चुनें।',
    btn_reset_filters: 'खोज और फ़िल्टर रीसेट करें',
    showing_agreements_prefix: 'प्रदर्शित',
    showing_agreements_of: 'कुल',
    agreements_unit: 'अनुबंध',
    nesl_uidai_backing: 'सभी अनुबंध NeSL ई-स्टांपिंग और UIDAI ई-हस्ताक्षर प्रमाणित हैं',

    // Clients Vault
    clients_title: 'क्लाइंट्स वॉल्ट',
    clients_subtitle: 'UIDAI आधार सत्यापन द्वारा समर्थित केंद्रीकृत किरायेदार और मकान मालिक रिकॉर्ड।',
    btn_add_client: '+ नया क्लाइंट जोड़ें',
    search_clients_placeholder: 'नाम, फोन, आधार या संपत्ति से खोजें...',
    tab_all_clients: 'सभी क्लाइंट',
    tab_landlords: 'मकान मालिक',
    tab_tenants: 'किरायेदार',
    th_client_name: 'क्लाइंट का नाम',
    th_role: 'भूमिका',
    th_contact: 'संपर्क विवरण',
    th_linked_agreements: 'जुड़े अनुबंध',
    th_actions: 'कार्रवाई',
    empty_clients_title: 'कोई क्लाइंट रिकॉर्ड नहीं मिला',
    empty_clients_desc: 'खोज शब्द बदलकर देखें या नया क्लाइंट जोड़ें।',
    role_tenant: 'किरायेदार',
    role_landlord: 'मकान मालिक / संपत्ति स्वामी',
    aadhaar_verified: 'आधार सत्यापित',
    btn_create_agreement: 'अनुबंध बनाएं',
    btn_edit_client: 'विवरण संपादित करें',

    // Plan & Billing
    billing_title: 'प्लान और बिलिंग',
    billing_subtitle: 'अपनी सदस्यता, कोटा टॉप-अप, इनवॉइस और भुगतान विवरण प्रबंधित करें।',
    billing_tier_header: 'वर्तमान सदस्यता श्रेणी',
    billing_auto_renew_label: 'ऑटो-रिन्यू',
    billing_quota_summary: 'दस्तावेज़ निर्माण कोटा',
    billing_topup_title: 'तुरंत कोटा टॉप-अप',
    billing_topup_10: '10 दस्तावेज़ — ₹990',
    billing_topup_25: '25 दस्तावेज़ — ₹1,875 (24% छूट)',
    billing_invoice_history: 'इनवॉइस इतिहास और रसीदें',
    th_invoice_num: 'इनवॉइस #',
    th_billing_date: 'तारीख',
    th_description: 'विवरण',
    th_amount: 'राशि',
    th_payment_status: 'स्थिति',
    th_receipt: 'रसीद',
    btn_download_receipt: 'रसीद डाउनलोड करें',

    // Bank & UPI Settings
    bank_upi_title: 'बैंक और UPI सेटलमेंट सेटिंग्स',
    bank_upi_subtitle: 'रेफरल और भुगतान प्राप्त करने के लिए अपना बैंक खाता और UPI आईडी कॉन्फ़िगर करें।',
    bank_details_section: 'संबद्ध बैंक खाता',
    account_holder_label: 'खाताधारक का नाम',
    account_number_label: 'बैंक खाता संख्या',
    confirm_acc_number_label: 'खाता संख्या की पुष्टि करें',
    ifsc_code_label: 'IFSC कोड',
    upi_section: 'सेटलमेंट UPI आईडी',
    upi_input_label: 'UPI पता (VPA)',
    btn_verify_save_upi: 'UPI सत्यापित करें और सहेजें',
    btn_save_bank: 'बैंक विवरण सहेजें',
    btn_edit_bank: 'बैंक खाता संपादित करें',
    bank_payout_guarantee: 'सफल रेफरल सत्यापन के 24 घंटे के भीतर राशि सीधे आपके खाते में जमा होगी।',

    // Help & Support
    help_page_title: 'सहायता और सहायता डेस्क',
    help_page_subtitle: 'ई-स्टांपिंग, अनुबंध निर्माण, कोटा और तकनीकी सहायता पर मार्गदर्शन।',
    faq_title: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    faq_desc: 'ऑनबोर्डिंग, डिजिटल स्टांप शुल्क, अनुबंध मसौदा और कोटा टॉप-अप से जुड़े व्यावहारिक उत्तर।',
    faq_search_placeholder: 'कीवर्ड से खोजें (उदा: ई-स्टांप, कोटा, लॉगिन, रिन्यू)...',
    faq_showing_prefix: 'प्रदर्शित',
    faq_of: 'कुल',
    faq_questions: 'प्रश्न',
    faq_expand_all: 'सभी विस्तार करें',
    faq_collapse_all: 'सभी संक्षिप्त करें',
    faq_clear_search: 'खोज साफ़ करें',
    faq_empty_msg: 'आपकी खोज से मेल खाता कोई प्रश्न नहीं मिला',
    callback_heading: 'प्राथमिकता कॉलबैक का अनुरोध करें',
    callback_desc: 'हमारी ब्रोकर सहायता टीम 15 मिनट में आपसे संपर्क करेगी।',
    callback_name_label: 'आपका नाम',
    callback_phone_label: '10-अंकों का मोबाइल नंबर',
    callback_issue_label: 'अपनी समस्या का विवरण लिखें',
    btn_request_callback: 'कॉलबैक का अनुरोध करें',
    callback_success_msg: 'कॉलबैक का अनुरोध दर्ज हो गया है! हमारी टीम शीघ्र संपर्क करेगी।',

    // Common
    cancel: 'रद्द करें',
    save: 'परिवर्तन सहेजें',
    close: 'बंद करें',
    loading: 'लोड हो रहा है...',
    confirm: 'पुष्टि करें',
    success: 'सफल',
    error: 'त्रुटि',
    select_language: 'भाषा चुनें'
  },

  te: {
    // Navigation (Telugu)
    nav_home: 'డ్యాష్‌బోర్డ్',
    nav_agreements: 'నా ఒప్పందాలు',
    nav_clients: 'క్లయింట్ల వాల్ట్',
    nav_billing: 'ప్లాన్ & బిల్లింగ్',
    nav_bank_upi: 'బ్యాంక్ & UPI సెట్టింగ్‌లు',
    nav_refer: 'సంపాదించండి & రెఫర్ చేయండి',
    nav_help: 'సహాయం & మద్దతు',
    nav_section_main: 'ప్రధాన విభాగం',
    nav_section_growth: 'గ్రోత్ & మద్దతు',
    logout: 'లాగ్ అవుట్',

    // Top Header & Greeting
    header_greeting_prefix: 'నమస్కారం',
    header_subtitle: 'కమర్షియల్ & రెసిడెన్షియల్ బ్రోకర్ వాల్ట్',

    // Profile Dropdown
    profile_title: 'బ్రోకర్ ప్రొఫైల్',
    profile_account_details: 'ఖాతా & ప్లాన్ వివరాలు',
    profile_id_label: 'బ్రోకర్ ఐడి',
    profile_tier_label: 'ప్లాన్ స్థితి',
    profile_quota_label: 'డాక్యుమెంట్ కోటా',
    profile_phone_label: 'మొబైల్',
    profile_email_label: 'గుర్తింపు ఐడి',
    profile_view_billing: 'ప్లాన్ & ఇన్వాయిస్‌లు చూడండి',
    profile_view_bank: 'బ్యాంక్ & సెటిల్‌మెంట్ UPI నిర్వహణ',
    pro_active: 'ప్రొఫెషనల్ ప్లాన్ యాక్టివ్',
    pay_doc_active: 'పే-పర్-డాక్ యాక్టివ్',
    lang_selector_title: 'ఇంటర్‌ఫేస్ భాష',
    lang_selector_subtitle: 'మీ ప్రాంతీయ పని భాషను ఎంచుకోండి',
    state_jurisdiction_label: 'బ్రోకర్ రాష్ట్ర పరిధి',
    state_suggested_lang: 'మీ రాష్ట్రానికి సూచించిన భాష',
    lang_saved_feedback: 'భాషా ప్రాధాన్యత భద్రపరచబడింది',

    // Dashboard Quota & Cards
    pro_plan_title: 'ప్రొఫెషనల్ శ్రేణి — ₹5,000 / నెల',
    status_active: 'యాక్టివ్',
    status_completed: 'పూర్తయింది',
    status_pending: 'ఇ-సైన్ పెండింగ్',
    status_expiring: 'త్వరలో గడువు ముగుస్తుంది',
    renewal_reset_prefix: 'పునరుద్ధరణ తేదీ',
    auto_renew: 'ఆటో-రిన్యూ',
    quota_title: 'కేటాయించిన కోటా vs ఉపయోగించిన డాక్యుమెంట్లు',
    quota_total: 'మొత్తం',
    quota_used: 'ఉపయోగించినవి',
    quota_remaining: 'మిగిలినవి',
    quota_used_docs: 'ఉపయోగించిన డాక్యుమెంట్లు',
    quota_unused_docs: 'ఉపయోగించని డాక్యుమెంట్లు',
    quota_utilized: 'కోటా వినియోగించబడింది',
    quota_exhausted_title: 'కోటా పూర్తయింది (0 ఒప్పందాలు మిగిలాయి)',
    quota_exhausted_desc: 'మీ నెలవారీ ప్లాన్ పరిమితి పూర్తిగా ఉపయోగించబడింది. అంతరాయాలు లేకుండా ఒప్పందాలను సృష్టించడం కొనసాగించడానికి రీఛార్జ్ చేసుకోండి.',

    // Buttons & Actions
    btn_renew_plan: 'ప్లాన్ రీన్యూ చేసుకోండి (₹5,000)',
    btn_pay_doc_instant: 'పే-పర్-డాక్ (₹99 తక్షణ సింగిల్ అగ్రిమెంట్)',
    btn_gen_rental: '+ అద్దె ఒప్పందం రూపొందించండి',
    btn_gen_other: '+ ఇతర ఒప్పందాలు రూపొందించండి',
    btn_gen_new: '+ కొత్త ఒప్పందం రూపొందించండి',
    btn_refer_action: 'రెఫర్ & ₹50 సంపాదించండి',
    btn_view_all_vault: 'వాల్ట్‌లో అన్నీ చూడండి →',
    btn_upgrade_pro: 'ప్రో ప్లాన్‌కి అప్‌గ్రేడ్ అవ్వండి (₹5,000 / 100 డాక్స్)',
    btn_whatsapp: 'వాట్సాప్',
    btn_resend_wa: 'మళ్లీ పంపు WA',
    btn_pdf: 'పిడిఎఫ్',
    btn_renew: 'రీన్యూ',
    btn_remind_wa: 'గుర్తుచేయి WA',
    btn_sec63: 'సెక్షన్ 63',
    btn_compliance: 'అనుసరణ',
    compliance_retry: 'అనుసరణను మళ్లీ ప్రయత్నించండి',
    sec63_generating: 'రూపొందిస్తోంది...',

    // Referral Banner & Section
    refer_badge: 'బ్రోకర్ రెఫరల్ ప్రోగ్రామ్',
    refer_title: 'తోటి బ్రోకర్లను ఆహ్వానించండి & UPI కి ₹50 నేరుగా పొందండి',
    refer_desc: 'బ్రోకర్ రివార్డ్ ప్రోగ్రామ్: ప్రతి నమోదిత రెఫరల్ యాప్ డౌన్‌లోడ్ మరియు సైన్ అప్ అయిన వెంటనే మీ లింక్ చేయబడిన UPI ఐడికి ₹50 నేరుగా జమ చేయబడుతుంది.',
    refer_page_title: 'రెఫర్ చేసి ఒక్కో బ్రోకర్‌కు ₹50 సంపాదించండి',
    refer_page_subtitle: 'మీ రెఫరల్ లింక్ ద్వారా నమోదైన ప్రతి బ్రోకర్‌పై నేరుగా మీ UPI ఖాతాలో ₹50 పొందండి.',
    refer_link_label: 'మీ ప్రత్యేక రెఫరల్ లింక్',
    btn_copy_link: 'లింక్ కాపీ చేయండి',
    btn_share_whatsapp: 'వాట్సాప్‌లో షేర్ చేయండి',
    refer_link_copied: 'రెఫరల్ లింక్ కాపీ చేయబడింది!',
    refer_stats_heading: 'రెఫరల్ పనితీరు డ్యాష్‌బోర్డ్',
    refer_stat_total: 'మొత్తం రెఫరల్స్',
    refer_stat_converted: 'విజయవంతంగా నమోదైనవి',
    refer_stat_earnings: 'మొత్తం సంపాదన',

    // Vault Table & Agreements Screen
    vault_overview_title: 'డాక్యుమెంట్ వాల్ట్ శీఘ్ర పరిశీలన',
    vault_overview_sub: 'ఇటీవల అమలు చేసిన లీజు ఒప్పందాల లైవ్ ట్రాకింగ్',
    th_date: 'తేదీ',
    th_client_property: 'క్లయింట్ / ప్రాపర్టీ',
    th_agreement_type: 'ఒప్పందం రకం',
    th_status: 'స్థితి',
    th_quick_actions: 'త్వరిత చర్యలు',
    th_execution_date: 'అమలు తేదీ',
    th_client_property_name: 'క్లయింట్ / ఆస్తి పేరు',
    th_real_time_status: 'రియల్-టైమ్ స్థితి',
    th_universal_quick_actions: 'త్వరిత చర్యలు',
    agreements_title: 'నా ఒప్పందాల విభాగం',
    agreements_subtitle: 'కేంద్రీకృత డాక్యుమెంట్ నిర్వహణ మరియు ట్రాకింగ్ వాల్ట్.',
    search_agreements_placeholder: 'అద్దెదారు, యజమాని లేదా ప్రాపర్టీ ప్రాంతం ద్వారా శోధించండి...',
    filter_all: 'అన్నీ',
    filter_pending: 'ఇ-సైన్ పెండింగ్',
    filter_completed: 'పూర్తయింది',
    filter_expiring: 'త్వరలో గడువు ముగుస్తుంది',
    tenant_label: 'అద్దెదారు',
    owner_label: 'యజమాని',
    empty_agreements_title: 'ఎటువంటి ఒప్పందాలు కనుగొనబడలేదు',
    empty_agreements_desc: 'శోధన పదాలను మార్చి చూడండి లేదా \'అన్నీ\' ఫిల్టర్ ఎంచుకోండి.',
    btn_reset_filters: 'శోధన మరియు ఫిల్టర్లను రీసెట్ చేయండి',
    showing_agreements_prefix: 'చూపుతున్నవి',
    showing_agreements_of: 'మొత్తం',
    agreements_unit: 'ఒప్పందాలు',
    nesl_uidai_backing: 'అన్ని ఒప్పందాలు NeSL ఇ-స్టాంపింగ్ మరియు UIDAI ఇ-సైన్ సర్టిఫికేట్‌తో భద్రపరచబడ్డాయి',

    // Clients Vault
    clients_title: 'క్లయింట్ల వాల్ట్',
    clients_subtitle: 'UIDAI ఆధార్ ధృవీకరణతో కూడిన కేంద్రీకృత అద్దెదారు & యజమాని రికార్డులు.',
    btn_add_client: '+ కొత్త క్లయింట్‌ను జోడించండి',
    search_clients_placeholder: 'పేరు, ఫోన్, ఆధార్ లేదా ప్రాపర్టీ ద్వారా శోధించండి...',
    tab_all_clients: 'అందరు క్లయింట్లు',
    tab_landlords: 'మకాను యజమానులు',
    tab_tenants: 'అద్దెదారులు',
    th_client_name: 'క్లయింట్ పేరు',
    th_role: 'పాత్ర',
    th_contact: 'సంప్రదింపు వివరాలు',
    th_linked_agreements: 'లింక్ చేయబడిన ఒప్పందాలు',
    th_actions: 'చర్యలు',
    empty_clients_title: 'క్లయింట్లు కనుగొనబడలేదు',
    empty_clients_desc: 'మీ శోధనకు తగిన క్లయింట్ రికార్డులు లేవు.',
    role_tenant: 'అద్దెదారు',
    role_landlord: 'యజమాని / ఆస్తిదారు',
    aadhaar_verified: 'ఆధార్ ధృవీకరించబడింది',
    btn_create_agreement: 'ఒప్పందం సృష్టించు',
    btn_edit_client: 'వివరాలు సవరించు',

    // Plan & Billing
    billing_title: 'ప్లాన్ & బిల్లింగ్',
    billing_subtitle: 'సబ్‌స్క్రిప్షన్ ప్లాన్లు, కోటా టాప్-అప్‌లు మరియు ఇన్వాయిస్‌లను నిర్వహించండి.',
    billing_tier_header: 'ప్రస్తుత సబ్‌స్క్రిప్షన్ స్థాయి',
    billing_auto_renew_label: 'ఆటో-రిన్యూ',
    billing_quota_summary: 'డాక్యుమెంట్ డ్రాఫ్టింగ్ కోటా',
    billing_topup_title: 'తక్షణ కోటా టాప్-అప్‌లు',
    billing_topup_10: '10 పత్రాలు — ₹990',
    billing_topup_25: '25 పత్రాలు — ₹1,875 (24% రాయితీ)',
    billing_invoice_history: 'ఇన్వాయిస్ చరిత్ర & రశీదులు',
    th_invoice_num: 'ఇన్వాయిస్ #',
    th_billing_date: 'తేదీ',
    th_description: 'వివరణ',
    th_amount: 'మొత్తం',
    th_payment_status: 'స్థితి',
    th_receipt: 'రశీదు',
    btn_download_receipt: 'రశీదు డౌన్‌లోడ్',

    // Bank & UPI Settings
    bank_upi_title: 'బ్యాంక్ & UPI సెట్టింగ్‌లు',
    bank_upi_subtitle: 'రెఫరల్ రివార్డులు పొందడానికి మీ బ్యాంక్ ఖాతా మరియు UPI ఐడిని అమర్చండి.',
    bank_details_section: 'లింక్ చేయబడిన బ్యాంక్ ఖాతా',
    account_holder_label: 'ఖాతాదారుని పేరు',
    account_number_label: 'బ్యాంక్ ఖాతా సంఖ్య',
    confirm_acc_number_label: 'ఖాతా సంఖ్యను ధృవీకరించండి',
    ifsc_code_label: 'IFSC కోడ్',
    upi_section: 'సెటిల్‌మెంట్ UPI ఐడి',
    upi_input_label: 'UPI వర్చువల్ అడ్రస్ (VPA)',
    btn_verify_save_upi: 'ధృవీకరించి సేవ్ చేయండి',
    btn_save_bank: 'బ్యాంక్ వివరాలు భద్రపరచండి',
    btn_edit_bank: 'బ్యాంక్ ఖాతా సవరించండి',
    bank_payout_guarantee: 'విజయవంతమైన రెఫరల్ పూర్తయిన 24 గంటల్లో నిధులు నేరుగా జమ చేయబడతాయి.',

    // Help & Support
    help_page_title: 'సహాయం & మద్దతు డెస్క్',
    help_page_subtitle: 'ఇ-స్టాంపింగ్, ఒప్పందాల సృష్టి, కోటా మరియు సాంకేతిక సహాయం.',
    faq_title: 'తరచుగా అడిగే ప్రశ్నలు (FAQ)',
    faq_desc: 'ఆన్‌బోర్డింగ్, డిజిటల్ స్టాంప్ డ్యూటీ, అగ్రిమెంట్ డ్రాఫ్టింగ్ మరియు కోటా రీఛార్జ్‌లపై ఉపయోగకర సమాధానాలు.',
    faq_search_placeholder: 'కీవర్డ్ ద్వారా శోధించండి (ఉదా. ఇ-స్టాంప్, కోటా, లాగిన్, పునరుద్ధరణ)...',
    faq_showing_prefix: 'చూపుతున్నవి',
    faq_of: 'మొత్తం',
    faq_questions: 'ప్రశ్నలలో',
    faq_expand_all: 'అన్నీ విస్తరించండి',
    faq_collapse_all: 'అన్నీ కుదించండి',
    faq_clear_search: 'శోధనను క్లియర్ చేయండి',
    faq_empty_msg: 'మీ శోధనకు తగిన FAQ అంశాలు ఏవీ కనిపించలేదు',
    callback_heading: 'ప్రాధాన్యత కాల్‌బ్యాక్ అభ్యర్థించండి',
    callback_desc: 'మా బ్రోకర్ సహాయ బృందం 15 నిమిషాల్లో మిమ్మల్ని సంప్రదిస్తుంది.',
    callback_name_label: 'మీ పేరు',
    callback_phone_label: '10 అంకెల మొబైల్ సంఖ్య',
    callback_issue_label: 'మీ సమస్య లేదా ప్రశ్నను వివరించండి',
    btn_request_callback: 'కాల్‌బ్యాక్ అభ్యర్థించండి',
    callback_success_msg: 'కాల్‌బ్యాక్ అభ్యర్థించబడింది! మా బృందం త్వరలో సంప్రదిస్తుంది.',

    // Common
    cancel: 'రద్దు చేయండి',
    save: 'మార్పులను సేవ్ చేయండి',
    close: 'మూసివేయి',
    loading: 'లోడ్ అవుతోంది...',
    confirm: 'నిర్ధారించండి',
    success: 'విజయం',
    error: 'లోపం',
    select_language: 'భాషను ఎంచుకోండి'
  },

  kn: {
    // Navigation (Kannada)
    nav_home: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    nav_agreements: 'ನನ್ನ ಒಪ್ಪಂದಗಳು',
    nav_clients: 'ಗ್ರಾಹಕರ ಕಣಜ',
    nav_billing: 'ಪ್ಲಾನ್ ಮತ್ತು ಬಿಲ್ಲಿಂಗ್',
    nav_bank_upi: 'ಬ್ಯಾಂಕ್ & UPI ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    nav_refer: 'ಗಳಿಸಿ ಮತ್ತು ರೆಫರ್ ಮಾಡಿ',
    nav_help: 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
    nav_section_main: 'ಮುಖ್ಯ ಪರಿವಿಡಿ',
    nav_section_growth: 'ಬೆಳವಣಿಗೆ ಮತ್ತು ಬೆಂಬಲ',
    logout: 'ಲಾಗ್ ಔಟ್',

    // Top Header & Greeting
    header_greeting_prefix: 'ನಮಸ್ಕಾರ',
    header_subtitle: 'ವಾಣಿಜ್ಯ ಮತ್ತು ವಸತಿ ಬ್ರೋಕರ್ ವಾಲ್ಟ್',

    // Profile Dropdown
    profile_title: 'ಬ್ರೋಕರ್ ಪ್ರೊಫೈಲ್',
    profile_account_details: 'ಖಾತೆ ಮತ್ತು ಯೋಜನೆ ವಿವರಗಳು',
    profile_id_label: 'ಬ್ರೋಕರ್ ಐಡಿ',
    profile_tier_label: 'ಯೋಜನೆ ಸ್ಥಿತಿ',
    profile_quota_label: 'ದಾಖಲೆ ಕೋಟಾ',
    profile_phone_label: 'ಮೊಬೈಲ್',
    profile_email_label: 'ಗುರುತಿನ ವಿಳಾಸ',
    profile_view_billing: 'ಯೋಜನೆ ಮತ್ತು ರಶೀದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    profile_view_bank: 'ಬ್ಯಾಂಕ್ ಮತ್ತು ಇತ್ಯರ್ಥ UPI ನಿರ್ವಹಣೆ',
    pro_active: 'ಪ್ರೊಫೆಷನಲ್ ಪ್ಲಾನ್ ಸಕ್ರಿಯ',
    pay_doc_active: 'ಪೇ-ಪರ್-ಡಾಕ್ ಸಕ್ರಿಯ',
    lang_selector_title: 'ಇಂಟರ್ಫೇಸ್ ಭಾಷೆ',
    lang_selector_subtitle: 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಪ್ರಾದೇಶಿಕ ಕಾರ್ಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    state_jurisdiction_label: 'ಬ್ರೋಕರ್ ರಾಜ್ಯ ವ್ಯಾಪ್ತಿ',
    state_suggested_lang: 'ನಿಮ್ಮ ರಾಜ್ಯಕ್ಕೆ ಸೂಚಿಸಲಾದ ಭಾಷೆ',
    lang_saved_feedback: 'ಭಾಷಾ ಆದ್ಯತೆಯನ್ನು ಉಳಿಸಲಾಗಿದೆ',

    // Dashboard Quota & Cards
    pro_plan_title: 'ಪ್ರೊಫೆಷನಲ್ ಶ್ರೇಣಿ — ₹5,000 / ತಿಂಗಳಿಗೆ',
    status_active: 'ಸಕ್ರಿಯ',
    status_completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    status_pending: 'ಇ-ಸಹಿ ಬಾಕಿ ಇದೆ',
    status_expiring: 'ಶೀಘ್ರದಲ್ಲೇ ಮುಕ್ತಾಯ',
    renewal_reset_prefix: 'ನವೀಕರಣ ಚಕ್ರ ಮರುಹೊಂದಿಕೆ',
    auto_renew: 'ಸ್ವಯಂ ನವೀಕರಣ',
    quota_title: 'ಹಂಚಿಕೆಯಾದ ಕೋಟಾ vs ಬಳಸಿದ ದಾಖಲೆಗಳು',
    quota_total: 'ಒಟ್ಟು',
    quota_used: 'ಬಳಸಿದ್ದು',
    quota_remaining: 'ಉಳಿದಿರುವುದು',
    quota_used_docs: 'ಬಳಸಿದ ದಾಖಲೆಗಳು',
    quota_unused_docs: 'ಬಳಸದ ದಾಖಲೆಗಳು',
    quota_utilized: 'ಕೋಟಾ ಬಳಸಲಾಗಿದೆ',
    quota_exhausted_title: 'ಕೋಟಾ ಮುಕ್ತಾಯಗೊಂಡಿದೆ (0 ಒಪ್ಪಂದಗಳು ಬಾಕಿ)',
    quota_exhausted_desc: 'ನಿಮ್ಮ ಮಾಸಿಕ ಯೋಜನೆಯ ಮಿತಿ ಮುಕ್ತಾಯವಾಗಿದೆ. ಅಡೆತಡೆಗಳಿಲ್ಲದೆ ಒಪ್ಪಂದಗಳನ್ನು ಮುಂದುವರಿಸಲು ತಕ್ಷಣ ಟಾಪ್-ಅಪ್ ಆಯ್ಕೆಮಾಡಿ.',

    // Buttons & Actions
    btn_renew_plan: 'ಪ್ಲಾನ್ ನವೀಕರಿಸಿ (₹5,000)',
    btn_pay_doc_instant: 'ಪೇ-ಪರ್-ಡಾಕ್ (₹99 ತ್ವರಿತ ಏಕ ಒಪ್ಪಂದ)',
    btn_gen_rental: '+ ಬಾಡಿಗೆ ಒಪ್ಪಂದವನ್ನು ರಚಿಸಿ',
    btn_gen_other: '+ ಇತರ ಒಪ್ಪಂದಗಳನ್ನು ರಚಿಸಿ',
    btn_gen_new: '+ ಹೊಸ ಒಪ್ಪಂದವನ್ನು ರಚಿಸಿ',
    btn_refer_action: 'ರೆಫರ್ ಮಾಡಿ ₹50 ಗಳಿಸಿ',
    btn_view_all_vault: 'ವಾಲ್ಟ್‌ನಲ್ಲಿ ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ →',
    btn_upgrade_pro: 'ಪ್ರೊ ಪ್ಲಾನ್‌ಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ (₹5,000 / 100 ದಾಖಲೆಗಳು)',
    btn_whatsapp: 'ವಾಟ್ಸಾಪ್',
    btn_resend_wa: 'ಮರುಕಳುಹಿಸಿ WA',
    btn_pdf: 'ಪಿಡಿಎಫ್',
    btn_renew: 'ನವೀಕರಿಸಿ',
    btn_remind_wa: 'ನೆನಪಿಸಿ WA',
    btn_sec63: 'ವಿಭಾಗ 63',
    btn_compliance: 'ಅನುಸರಣೆ',
    compliance_retry: 'ಅನುಸರಣೆಯನ್ನು ಮರುಪ್ರಯತ್ನಿಸಿ',
    sec63_generating: 'ರಚಿಸಲಾಗುತ್ತಿದೆ...',

    // Referral Banner & Section
    refer_badge: 'ಬ್ರೋಕರ್ ರೆಫರಲ್ ಉಪಕ್ರಮ',
    refer_title: 'ಸಹವರ್ತಿ ಬ್ರೋಕರ್‌ಗಳನ್ನು ಆಹ್ವಾನಿಸಿ & ನೇರವಾಗಿ UPI ಗೆ ₹50 ಗಳಿಸಿ',
    refer_desc: 'ಬ್ರೋಕರ್ ಬಹುಮಾನ ಯೋಜನೆ: ಪ್ರತಿ ನೋಂದಾಯಿತ ರೆಫರಲ್ ಸೈನ್ ಅಪ್ ಆದ ನಂತರ ನಿಮ್ಮ ಲಿಂಕ್ ಮಾಡಲಾದ UPI ಐಡಿಗೆ ನೇರವಾಗಿ ₹50 ಜಮೆಯಾಗುತ್ತದೆ.',
    refer_page_title: 'ರೆಫರ್ ಮಾಡಿ ಪ್ರತಿ ಬ್ರೋಕರ್ ನೋಂದಣಿಗೆ ₹50 ಗಳಿಸಿ',
    refer_page_subtitle: 'ನಿಮ್ಮ ರೆಫರಲ್ ಲಿಂಕ್ ಮೂಲಕ ನೋಂದಾಯಿಸುವ ಪ್ರತಿಯೊಬ್ಬ ಬ್ರೋಕರ್‌ಗೆ ನೇರವಾಗಿ ನಿಮ್ಮ UPI ಗೆ ₹50 ಪಡೆಯಿರಿ.',
    refer_link_label: 'ನಿಮ್ಮ ವಿಶಿಷ್ಟ ರೆಫರಲ್ ಲಿಂಕ್',
    btn_copy_link: 'ಲಿಂಕ್ ನಕಲಿಸಿ',
    btn_share_whatsapp: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ',
    refer_link_copied: 'ರೆಫರಲ್ ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!',
    refer_stats_heading: 'ರೆಫರಲ್ ಕಾರ್ಯಕ್ಷಮತೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    refer_stat_total: 'ಒಟ್ಟು ರೆಫರಲ್‌ಗಳು',
    refer_stat_converted: 'ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿತ',
    refer_stat_earnings: 'ಒಟ್ಟು ಗಳಿಕೆ',

    // Vault Table & Agreements Screen
    vault_overview_title: 'ತ್ವರಿತ ದಾಖಲೆ ವಾಲ್ಟ್ ಅವಲೋಕನ',
    vault_overview_sub: 'ಇತ್ತೀಚೆಗೆ ಕಾರ್ಯಗತಗೊಳಿಸಿದ ಗುತ್ತಿಗೆ ಒಪ್ಪಂದಗಳ ನೇರ ಟ್ರ್ಯಾಕಿಂಗ್',
    th_date: 'ದಿನಾಂಕ',
    th_client_property: 'ಗ್ರಾಹಕರು / ಆಸ್ತಿ',
    th_agreement_type: 'ಒಪ್ಪಂದದ ಪ್ರಕಾರ',
    th_status: 'ಸ್ಥಿತಿ',
    th_quick_actions: 'ತ್ವರಿತ ಕ್ರಮಗಳು',
    th_execution_date: 'ಅನುಷ್ಠಾನ ದಿನಾಂಕ',
    th_client_property_name: 'ಗ್ರಾಹಕ / ಆಸ್ತಿ ಹೆಸರು',
    th_real_time_status: 'ನೈಜ-ಸಮಯ ಸ್ಥಿತಿ',
    th_universal_quick_actions: 'ತ್ವರಿತ ಕ್ರಮಗಳು',
    agreements_title: 'ನನ್ನ ಒಪ್ಪಂದಗಳ ವಿಭಾಗ',
    agreements_subtitle: 'ಕೇಂದ್ರೀಕೃತ ದಾಖಲೆ ನಿರ್ವಹಣೆ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್ ವಾಲ್ಟ್.',
    search_agreements_placeholder: 'ಬಾಡಿಗೆದಾರ, ಮಾಲೀಕ ಅಥವಾ ಆಸ್ತಿಯ ಪ್ರದೇಶದ ಮೂಲಕ ಹುಡುಕಿ...',
    filter_all: 'ಎಲ್ಲವೂ',
    filter_pending: 'ಇ-ಸಹಿ ಬಾಕಿ ಇದೆ',
    filter_completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    filter_expiring: 'ಶೀಘ್ರದಲ್ಲೇ ಮುಕ್ತಾಯ',
    tenant_label: 'ಬಾಡಿಗೆದಾರ',
    owner_label: 'ಮಾಲೀಕರು',
    empty_agreements_title: 'ಯಾವುದೇ ಒಪ್ಪಂದಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    empty_agreements_desc: 'ಹುಡುಕಾಟ ಪದಗಳನ್ನು ಬದಲಿಸಿ ಅಥವಾ \'ಎಲ್ಲವೂ\' ಫಿಲ್ಟರ್ ಆಯ್ಕೆಮಾಡಿ.',
    btn_reset_filters: 'ಹುಡುಕಾಟ ಮತ್ತು ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ',
    showing_agreements_prefix: 'ತೋರಿಸಲಾಗುತ್ತಿದೆ',
    showing_agreements_of: 'ಒಟ್ಟು',
    agreements_unit: 'ಒಪ್ಪಂದಗಳು',
    nesl_uidai_backing: 'ಎಲ್ಲಾ ಒಪ್ಪಂದಗಳು NeSL ಇ-ಸ್ಟ್ಯಾಂಪಿಂಗ್ ಮತ್ತು UIDAI ಇ-ಸಹಿ ಪ್ರಮಾಣಪತ್ರದ ಬೆಂಬಲ ಹೊಂದಿವೆ',

    // Clients Vault
    clients_title: 'ಗ್ರಾಹಕರ ಕಣಜ',
    clients_subtitle: 'UIDAI ಆಧಾರ್ ಪರಿಶೀಲನೆಯೊಂದಿಗೆ ಕೇಂದ್ರೀಕೃತ ಬಾಡಿಗೆದಾರ ಮತ್ತು ಮಾಲೀಕರ ದಾಖಲೆಗಳು.',
    btn_add_client: '+ ಹೊಸ ಗ್ರಾಹಕರನ್ನು ಸೇರಿಸಿ',
    search_clients_placeholder: 'ಹೆಸರು, ಫೋನ್, ಆಧಾರ್ ಅಥವಾ ಆಸ್ತಿಯ ಮೂಲಕ ಹುಡುಕಿ...',
    tab_all_clients: 'ಎಲ್ಲಾ ಗ್ರಾಹಕರು',
    tab_landlords: 'ಮಾಲೀಕರು',
    tab_tenants: 'ಬಾಡಿಗೆದಾರರು',
    th_client_name: 'ಗ್ರಾಹಕರ ಹೆಸರು',
    th_role: 'ಪಾತ್ರ',
    th_contact: 'ಸಂಪರ್ಕ ಮಾಹಿತಿ',
    th_linked_agreements: 'ಲಿಂಕ್ ಮಾಡಲಾದ ಒಪ್ಪಂದಗಳು',
    th_actions: 'ಕ್ರಮಗಳು',
    empty_clients_title: 'ಗ್ರಾಹಕರು ಕಂಡುಬಂದಿಲ್ಲ',
    empty_clients_desc: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ ಗ್ರಾಹಕರ ದಾಖಲೆಗಳಿಲ್ಲ.',
    role_tenant: 'ಬಾಡಿಗೆದಾರ',
    role_landlord: 'ಮಾಲೀಕರು / ಆಸ್ತಿ ಮಾಲೀಕರು',
    aadhaar_verified: 'ಆಧಾರ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    btn_create_agreement: 'ಒಪ್ಪಂದ ರಚಿಸಿ',
    btn_edit_client: 'ವಿವರಗಳನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ',

    // Plan & Billing
    billing_title: 'ಪ್ಲಾನ್ ಮತ್ತು ಬಿಲ್ಲಿಂಗ್',
    billing_subtitle: 'ನಿಮ್ಮ ಚಂದಾದಾರಿಕೆ, ಕೋಟಾ ಟಾಪ್-ಅಪ್‌ಗಳು, ಇನ್‌ವಾಯ್ಸ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
    billing_tier_header: 'ಪ್ರಸ್ತುತ ಚಂದಾದಾರಿಕೆ ಶ್ರೇಣಿ',
    billing_auto_renew_label: 'ಸ್ವಯಂ ನವೀಕರಣ',
    billing_quota_summary: 'ದಾಖಲೆ ರಚನೆ ಕೋಟಾ',
    billing_topup_title: 'ತ್ವರಿತ ಕೋಟಾ ಟಾಪ್-ಅಪ್‌ಗಳು',
    billing_topup_10: '10 ದಾಖಲೆಗಳು — ₹990',
    billing_topup_25: '25 ದಾಖಲೆಗಳು — ₹1,875 (24% ರಿಯಾಯಿತಿ)',
    billing_invoice_history: 'ಇನ್‌ವಾಯ್ಸ್ ಇತಿಹಾಸ ಮತ್ತು ರಶೀದಿಗಳು',
    th_invoice_num: 'ಇನ್‌ವಾಯ್ಸ್ #',
    th_billing_date: 'ದಿನಾಂಕ',
    th_description: 'ವಿವರಣೆ',
    th_amount: 'ಮೊತ್ತ',
    th_payment_status: 'ಸ್ಥಿತಿ',
    th_receipt: 'ರಶೀದಿ',
    btn_download_receipt: 'ರಶೀದಿ ಡೌನ್‌ಲೋಡ್',

    // Bank & UPI Settings
    bank_upi_title: 'ಬ್ಯಾಂಕ್ & UPI ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    bank_upi_subtitle: 'ಬಹುಮಾನ ಪಾವತಿಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಮತ್ತು UPI ವಿಳಾಸವನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ.',
    bank_details_section: 'ಲಿಂಕ್ ಮಾಡಲಾದ ಬ್ಯಾಂಕ್ ಖಾತೆ',
    account_holder_label: 'ಖಾತೆದಾರರ ಹೆಸರು',
    account_number_label: 'ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಂಖ್ಯೆ',
    confirm_acc_number_label: 'ಖಾತೆ ಸಂಖ್ಯೆಯನ್ನು ದೃಢೀಕರಿಸಿ',
    ifsc_code_label: 'IFSC ಕೋಡ್',
    upi_section: 'ಇತ್ಯರ್ಥ UPI ಐಡಿ',
    upi_input_label: 'UPI ವಿಳಾಸ (VPA)',
    btn_verify_save_upi: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಉಳಿಸಿ',
    btn_save_bank: 'ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಉಳಿಸಿ',
    btn_edit_bank: 'ಬ್ಯಾಂಕ್ ಖಾತೆಯನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ',
    bank_payout_guarantee: 'ರೆಫರಲ್ ಪರಿಶೀಲನೆಯ ನಂತರ 24 ಗಂಟೆಗಳಲ್ಲಿ ಹಣ ನೇರವಾಗಿ ಜಮೆಯಾಗುತ್ತದೆ.',

    // Help & Support
    help_page_title: 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ ಕೇಂದ್ರ',
    help_page_subtitle: 'ಇ-ಸ್ಟ್ಯಾಂಪಿಂಗ್, ಒಪ್ಪಂದ ರಚನೆ, ಕೋಟಾ ಮತ್ತು ತಾಂತ್ರಿಕ ಬೆಂಬಲದ ಮಾರ್ಗದರ್ಶನ.',
    faq_title: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQ)',
    faq_desc: 'ಆನ್‌ಬೋರ್ಡಿಂಗ್, ಡಿಜಿಟಲ್ ಮುದ್ರಾಂಕ ಶುಲ್ಕ, ಕರಾರು ರಚನೆ ಮತ್ತು ಕೋಟಾ ಟಾಪ್-ಅಪ್‌ಗಳ ಕುರಿತು ಪ್ರಾಯೋಗಿಕ ಉತ್ತರಗಳು.',
    faq_search_placeholder: 'ಕೀವರ್ಡ್ ಮೂಲಕ FAQ ಹುಡುಕಿ (ಉದಾ: ಇ-ಸ್ಟ್ಯಾಂಪ್, ಕೋಟಾ, ಲಾಗಿನ್, ನವೀಕರಣ)...',
    faq_showing_prefix: 'ತೋರಿಸಲಾಗುತ್ತಿದೆ',
    faq_of: 'ಒಟ್ಟು',
    faq_questions: 'ಪ್ರಶ್ನೆಗಳು',
    faq_expand_all: 'ಎಲ್ಲವನ್ನೂ ವಿಸ್ತರಿಸಿ',
    faq_collapse_all: 'ಎಲ್ಲವನ್ನೂ ಕುಗ್ಗಿಸಿ',
    faq_clear_search: 'ಹುಡುಕಾಟ ತೆರವುಗೊಳಿಸಿ',
    faq_empty_msg: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ FAQ ಅಂಶಗಳು ಸಿಗಲಿಲ್ಲ',
    callback_heading: 'ಆದ್ಯತೆಯ ಕಾಲ್‌ಬ್ಯಾಕ್ ವಿನಂತಿಸಿ',
    callback_desc: 'ನಮ್ಮ ಬ್ರೋಕರ್ ಕಾರ್ಯಾಚರಣೆಗಳ ತಂಡ 15 ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
    callback_name_label: 'ನಿಮ್ಮ ಹೆಸರು',
    callback_phone_label: '10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    callback_issue_label: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅಥವಾ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ',
    btn_request_callback: 'ಕಾಲ್‌ಬ್ಯಾಕ್ ವಿನಂತಿಸಿ',
    callback_success_msg: 'ಕಾಲ್‌ಬ್ಯಾಕ್ ವಿನಂತಿಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ! ನಮ್ಮ ತಂಡ ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತದೆ.',

    // Common
    cancel: 'ರದ್ದುಮಾಡಿ',
    save: 'ಬದಲಾವಣೆ ಉಳಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    confirm: 'ಖಚಿತಪಡಿಸಿ',
    success: 'ಯಶಸ್ಸು',
    error: 'ದೋಷ',
    select_language: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ'
  },

  mr: {
    // Navigation (Marathi)
    nav_home: 'डॅशबोर्ड',
    nav_agreements: 'माझे करार',
    nav_clients: 'ग्राहक व्हॉल्ट',
    nav_billing: 'प्लॅन आणि बिलिंग',
    nav_bank_upi: 'बँक आणि UPI सेटिंग्ज',
    nav_refer: 'मिळवा आणि रेफर करा',
    nav_help: 'मदत आणि सहाय्य',
    nav_section_main: 'मुख्य मेनू',
    nav_section_growth: 'विकास आणि सहाय्य',
    logout: 'लॉग आउट',

    // Top Header & Greeting
    header_greeting_prefix: 'नमस्कार',
    header_subtitle: 'व्यावसायिक आणि निवासी ब्रोकर व्हॉल्ट',

    // Profile Dropdown
    profile_title: 'ब्रोकर प्रोफाइल',
    profile_account_details: 'खाते आणि योजना तपशील',
    profile_id_label: 'ब्रोकर आयडी',
    profile_tier_label: 'योजना स्थिती',
    profile_quota_label: 'दस्तऐवज कोटा',
    profile_phone_label: 'मोबाईल',
    profile_email_label: 'ओळख आयडी',
    profile_view_billing: 'प्लॅन आणि पावत्या पहा',
    profile_view_bank: 'बँक आणि सेटलमेंट UPI व्यवस्थापन',
    pro_active: 'प्रोफेशनल प्लॅन सक्रिय',
    pay_doc_active: 'पे-पर-डॉक सक्रिय',
    lang_selector_title: 'इंटरफेस भाषा',
    lang_selector_subtitle: 'तुमची पसंतीची प्रादेशिक कार्य भाषा निवडा',
    state_jurisdiction_label: 'ब्रोकर राज्य कार्यक्षेत्र',
    state_suggested_lang: 'तुमच्या राज्यासाठी सुचवलेली भाषा',
    lang_saved_feedback: 'भाषा प्राधान्य जतन केले',

    // Dashboard Quota & Cards
    pro_plan_title: 'प्रोफेशनल श्रेणी — ₹5,000 / महिना',
    status_active: 'सक्रिय',
    status_completed: 'पूर्ण झाले',
    status_pending: 'ई-स्वाक्षरी प्रलंबित',
    status_expiring: 'लवकरच कालबाह्य',
    renewal_reset_prefix: 'नूतनीकरण चक्र रीसेट तारीख',
    auto_renew: 'ऑटो-नूतनीकरण',
    quota_title: 'वाटप केलेला कोटा वि वापरलेले दस्तऐवज',
    quota_total: 'एकूण',
    quota_used: 'वापरलेले',
    quota_remaining: 'उर्वरित',
    quota_used_docs: 'वापरलेले दस्तऐवज',
    quota_unused_docs: 'न वापरलेले दस्तऐवज',
    quota_utilized: 'कोटा वापरला',
    quota_exhausted_title: 'कोटा संपला (0 करार शिल्लक)',
    quota_exhausted_desc: 'तुमची मासिक योजना मर्यादा पूर्ण वापरली गेली आहे. कोणत्याही व्यत्ययाशिवाय करार करणे सुरू ठेवण्यासाठी रिचार्ज करा.',

    // Buttons & Actions
    btn_renew_plan: 'प्लॅन नूतनीकरण करा (₹5,000)',
    btn_pay_doc_instant: 'पे-पर-डॉक (₹99 झटपट एक करार)',
    btn_gen_rental: '+ भाडे करार तयार करा',
    btn_gen_other: '+ इतर करार तयार करा',
    btn_gen_new: '+ नवीन करार तयार करा',
    btn_refer_action: 'रेफर करा आणि ₹50 मिळवा',
    btn_view_all_vault: 'व्हॉल्टमध्ये सर्व पहा →',
    btn_upgrade_pro: 'प्रो प्लॅनवर अपग्रेड करा (₹5,000 / 100 दस्तऐवज)',
    btn_whatsapp: 'व्हॉट्सअ‍ॅप',
    btn_resend_wa: 'पुन्हा पाठवा WA',
    btn_pdf: 'पीडीएफ',
    btn_renew: 'नूतनीकरण',
    btn_remind_wa: 'आठवण करा WA',
    btn_sec63: 'कलम 63',
    btn_compliance: 'अनुपालन',
    compliance_retry: 'अनुपालन पुन्हा प्रयत्न करा',
    sec63_generating: 'तयार होत आहे...',

    // Referral Banner & Section
    refer_badge: 'ब्रोकर रेफरल उपक्रम',
    refer_title: 'सहकारी ब्रोकर्सना आमंत्रित करा आणि थेट UPI वर ₹50 मिळवा',
    refer_desc: 'ब्रोकर रिवॉर्ड प्रोग्राम: प्रत्येक नोंदणीकृत रेफरलने साइन अप केल्यावर तुमच्या लिंक केलेल्या UPI आयडीवर थेट ₹50 जमा होतात.',
    refer_page_title: 'रेफर करा आणि प्रति ब्रोकर ₹50 मिळवा',
    refer_page_subtitle: 'तुमच्या रेफरल लिंकद्वारे नोंदणी करणाऱ्या प्रत्येक ब्रोकरवर थेट तुमच्या UPI खात्यात ₹50 मिळवा.',
    refer_link_label: 'तुमची युनिक रेफरल लिंक',
    btn_copy_link: 'लिंक कॉपी करा',
    btn_share_whatsapp: 'व्हॉट्सअ‍ॅपवर शेअर करा',
    refer_link_copied: 'रेफरल लिंक कॉपी केली!',
    refer_stats_heading: 'रेफरल कामगिरी डॅशबोर्ड',
    refer_stat_total: 'एकूण रेफरल्स',
    refer_stat_converted: 'यशस्वी नोंदणीकृत',
    refer_stat_earnings: 'एकूण कमाई',

    // Vault Table & Agreements Screen
    vault_overview_title: 'दस्तऐवज व्हॉल्ट विहंगावलोकन',
    vault_overview_sub: 'अलीकडे कार्यान्वित केलेल्या लीज करारांचे थेट ट्रॅकिंग',
    th_date: 'तारीख',
    th_client_property: 'ग्राहक / मालमत्ता',
    th_agreement_type: 'कराराचा प्रकार',
    th_status: 'स्थिती',
    th_quick_actions: 'त्वरित कृती',
    th_execution_date: 'अंमलबजावणी तारीख',
    th_client_property_name: 'ग्राहक / मालमत्तेचे नाव',
    th_real_time_status: 'रिअल-टाइम स्थिती',
    th_universal_quick_actions: 'त्वरित कृती',
    agreements_title: 'माझे करार विभाग',
    agreements_subtitle: 'केंद्रीकृत दस्तऐवज व्यवस्थापन आणि ट्रॅकिंग व्हॉल्ट.',
    search_agreements_placeholder: 'भाडेकरू, मालक किंवा मालमत्ता क्षेत्रानुसार शोधा...',
    filter_all: 'सर्व',
    filter_pending: 'ई-स्वाक्षरी प्रलंबित',
    filter_completed: 'पूर्ण झाले',
    filter_expiring: 'लवकरच कालबाह्य',
    tenant_label: 'भाडेकरू',
    owner_label: 'मालक',
    empty_agreements_title: 'कोणतेही करार आढळले नाहीत',
    empty_agreements_desc: 'शोध शब्द बदलून पहा किंवा \'सर्व\' फिल्टर निवडा.',
    btn_reset_filters: 'शोध आणि फिल्टर रीसेट करा',
    showing_agreements_prefix: 'दाखवत आहे',
    showing_agreements_of: 'पैकी',
    agreements_unit: 'करार',
    nesl_uidai_backing: 'सर्व करार NeSL ई-स्टॅम्पिंग आणि UIDAI ई-स्वाक्षरी प्रमाणित आहेत',

    // Clients Vault
    clients_title: 'ग्राहक व्हॉल्ट',
    clients_subtitle: 'UIDAI आधार पडताळणीसह केंद्रीकृत भाडेकरू आणि घरमालक नोंदी.',
    btn_add_client: '+ नवीन ग्राहक जोडा',
    search_clients_placeholder: 'नाव, फोन, आधार किंवा मालमत्तेनुसार शोधा...',
    tab_all_clients: 'सर्व ग्राहक',
    tab_landlords: 'घरमालक',
    tab_tenants: 'भाडेकरू',
    th_client_name: 'ग्राहकाचे नाव',
    th_role: 'भूमिका',
    th_contact: 'संपर्क तपशील',
    th_linked_agreements: 'जोडलेले करार',
    th_actions: 'कृती',
    empty_clients_title: 'कोणतेही ग्राहक आढळले नाहीत',
    empty_clients_desc: 'तुमच्या शोधाशी जुळणाऱ्या नोंदी आढळल्या नाहीत.',
    role_tenant: 'भाडेकरू',
    role_landlord: 'घरमालक / मालमत्ता मालक',
    aadhaar_verified: 'आधार सत्यापित',
    btn_create_agreement: 'करार तयार करा',
    btn_edit_client: 'तपशील संपादित करा',

    // Plan & Billing
    billing_title: 'प्लॅन आणि बिलिंग',
    billing_subtitle: 'तुमची सदस्यता, कोटा टॉप-अप, पावत्या आणि पेमेंट तपशील व्यवस्थापित करा.',
    billing_tier_header: 'सध्याची सदस्यता श्रेणी',
    billing_auto_renew_label: 'ऑटो-नूतनीकरण',
    billing_quota_summary: 'दस्तऐवज निर्मिती कोटा',
    billing_topup_title: 'झटपट कोटा टॉप-अप',
    billing_topup_10: '10 दस्तऐवज — ₹990',
    billing_topup_25: '25 दस्तऐवज — ₹1,875 (24% सूट)',
    billing_invoice_history: 'पावत्या इतिहास आणि पावत्या',
    th_invoice_num: 'पावती #',
    th_billing_date: 'तारीख',
    th_description: 'तपशील',
    th_amount: 'रक्कम',
    th_payment_status: 'स्थिती',
    th_receipt: 'पावती',
    btn_download_receipt: 'पावती डाउनलोड करा',

    // Bank & UPI Settings
    bank_upi_title: 'बँक आणि UPI सेटिंग्ज',
    bank_upi_subtitle: 'पेआउट्स मिळविण्यासाठी तुमचे बँक खाते आणि UPI आयडी कॉन्फिगर करा.',
    bank_details_section: 'लिंक केलेले बँक खाते',
    account_holder_label: 'खातेदाराचे नाव',
    account_number_label: 'बँक खाते क्रमांक',
    confirm_acc_number_label: 'खाते क्रमांकाची पुष्टी करा',
    ifsc_code_label: 'IFSC कोड',
    upi_section: 'सेटलमेंट UPI आयडी',
    upi_input_label: 'UPI पत्ता (VPA)',
    btn_verify_save_upi: 'सत्यापित करा आणि जतन करा',
    btn_save_bank: 'बँक तपशील जतन करा',
    btn_edit_bank: 'बँक खाते संपादित करा',
    bank_payout_guarantee: 'यशस्वी रेफरल पडताळणीनंतर 24 तासांच्या आत थेट जमा.',

    // Help & Support
    help_page_title: 'मदत आणि सहाय्य कक्ष',
    help_page_subtitle: 'ई-स्टॅम्पिंग, करार निर्मिती, कोटा आणि तांत्रिक सहाय्य मार्गदर्शन.',
    faq_title: 'वारंवार विचारले जाणारे प्रश्न (FAQ)',
    faq_desc: 'ऑनबोर्डिंग, डिजिटल मुद्रांक शुल्क, करार मसुदा आणि कोटा टॉप-अप संबंधित व्यावहारिक उत्तरे.',
    faq_search_placeholder: 'कीवर्डनुसार FAQ शोधा (उदा. ई-स्टॅम्प, कोटा, लॉगिन, नूतनीकरण)...',
    faq_showing_prefix: 'दाखवत आहे',
    faq_of: 'पैकी',
    faq_questions: 'प्रश्न',
    faq_expand_all: 'सर्व विस्तृत करा',
    faq_collapse_all: 'सर्व संक्षिप्त करा',
    faq_clear_search: 'शोध साफ करा',
    faq_empty_msg: 'तुमच्या शोधाशी जुळणारे कोणतेही FAQ आढळले नाही',
    callback_heading: 'प्राधान्य कॉलबॅकची विनंती करा',
    callback_desc: 'आमची ब्रोकर ऑपरेशन्स टीम 15 मिनिटांत आपल्याशी संपर्क साधेल.',
    callback_name_label: 'तुमचे नाव',
    callback_phone_label: '10-अंकी मोबाईल नंबर',
    callback_issue_label: 'तुमची समस्या किंवा प्रश्न सांगा',
    btn_request_callback: 'कॉलबॅकची विनंती करा',
    callback_success_msg: 'कॉलबॅकची नोंदणी झाली! आमची टीम लवकरच संपर्क करेल.',

    // Common
    cancel: 'रद्द करा',
    save: 'बदल जतन करा',
    close: 'बंद करा',
    loading: 'लोड होत आहे...',
    confirm: 'पुष्टी करा',
    success: 'यशस्वी',
    error: 'त्रुटी',
    select_language: 'भाषा निवडा'
  }
};

export const FAQ_TRANSLATIONS = {
  en: [
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
  ],

  hi: [
    {
      id: 'faq-1',
      category: 'खाता और प्रवेश',
      question: 'पंजीकरण और लॉगिन समस्याओं का समाधान कैसे करें?',
      answer: 'सुनिश्चित करें कि आप अपने पंजीकृत ईमेल या 10-अंकों के मोबाइल नंबर का उपयोग कर रहे हैं। पासवर्ड जांचने के लिए शो/हाइड टॉगल का उपयोग करें। यदि आप पासवर्ड भूल गए हैं, तो लॉगिन पेज पर "Forgot Password" लिंक से नया पासवर्ड सेट करें।'
    },
    {
      id: 'faq-2',
      category: 'अनुबंध',
      question: 'नया किराया या व्यावसायिक अनुबंध कैसे बनाएं?',
      answer: '"मेरे अनुबंध" में जाकर नया अनुबंध विकल्प चुनें या क्लाइंट्स वॉल्ट से सीधे "अनुबंध बनाएं" पर क्लिक करें। 11-महीने का आवासीय या व्यावसायिक लीज अनुबंध चुनकर संपत्ति विवरण दर्ज करें।'
    },
    {
      id: 'faq-3',
      category: 'ई-हस्ताक्षर और ई-स्टांप',
      question: 'ZapDocs पर आधार ई-हस्ताक्षर और ई-स्टांपिंग कैसे काम करते हैं?',
      answer: 'अनुबंध का मसौदा तैयार होने पर राज्य स्टांप शुल्क का डिजिटल भुगतान किया जाता है (ई-स्टांप जारी)। इसके बाद प्राथमिक किरायेदार को OTP सत्यापन हेतु आधार ई-हस्ताक्षर लिंक भेजा जाता है।'
    },
    {
      id: 'faq-4',
      category: 'प्लान और मूल्य',
      question: 'ब्रोकर्स के लिए कौन से मासिक सदस्यता प्लान उपलब्ध हैं?',
      answer: 'ZapDocs ₹5,000 प्रति माह में प्रोफेशनल प्लान प्रदान करता है जिसमें 100 कानूनी अनुबंध शामिल हैं (मात्र ₹50 प्रति दस्तावेज़)। मासिक प्लान के बिना ब्रोकर्स ₹99 प्रति अनुबंध की दर से पे-पर-डॉक विकल्प का उपयोग कर सकते हैं।'
    },
    {
      id: 'faq-5',
      category: 'कोटा और टॉप-अप',
      question: 'दस्तावेज़ कोटा कैसे काम करता है और टॉप-अप कैसे खरीदें?',
      answer: 'सक्रिय प्रोफेशनल प्लान में प्रति बिलिंग चक्र 100 दस्तावेज़ मिलते हैं। यदि कोटा समाप्त हो जाए, तो आप त्वरित टॉप-अप खरीद सकते हैं: ₹990 में 10 दस्तावेज़ या ₹1,875 में 25 दस्तावेज़।'
    },
    {
      id: 'faq-6',
      category: 'नवीनीकरण और समाप्ति',
      question: 'मासिक प्लान समाप्त होने पर क्या होता है और रिन्यू कैसे करें?',
      answer: 'सदस्यता समाप्त होने पर दस्तावेज़ निर्माण रोक दिया जाता है। आप ₹5,000 में प्रोफेशनल प्लान रिन्यू कर सकते हैं या ₹99 पे-पर-डॉक टियर पर स्विच कर सकते हैं। आप ऑटो-रिन्यू भी सक्रिय रख सकते हैं।'
    },
    {
      id: 'faq-7',
      category: 'बिलिंग और रसीदें',
      question: 'बिलिंग रसीदें और इनवॉइस कहां देखें और डाउनलोड करें?',
      answer: 'अपना पूरा इनवॉइस इतिहास देखने के लिए "प्लान और बिलिंग" अनुभाग में जाएं। प्रत्येक इनवॉइस संदर्भ संख्या, तारीख, राशि और भुगतान स्थिति के साथ रसीद डाउनलोड करने का विकल्प प्रदान करता है।'
    },
    {
      id: 'faq-8',
      category: 'रेफर करें और कमाएं',
      question: 'रेफर और अर्न कार्यक्रम कैसे काम करता है और क्या पुरस्कार है?',
      answer: 'प्रत्येक पात्र रेफरल के साइन अप करने पर ब्रोकर्स सीधे अपने UPI में ₹50 कमाते हैं। व्हाट्सएप या रेफरल स्क्रीन से अपना अनूठा लिंक साझा करें।'
    },
    {
      id: 'faq-9',
      category: 'बैंक और UPI',
      question: 'रेफरल पुरस्कार भुगतान के लिए UPI आईडी कैसे सेट करें?',
      answer: 'साइडबार से "बैंक और UPI सेटिंग्स" चुनें। अपना सत्यापित UPI वर्चुअल पेमेंट एड्रेस (उदा: broker@upi) दर्ज करें।'
    },
    {
      id: 'faq-10',
      category: 'डाउनलोड और अनुपालन',
      question: 'निष्पादित अनुबंध और धारा 63 साक्ष्य प्रमाण पत्र कैसे डाउनलोड करें?',
      answer: '"मेरे अनुबंध" स्क्रीन पर, अंतिम कानूनी पीडीएफ और ई-स्टांप प्रमाण पत्र के लिए किसी भी पूर्ण अनुबंध पर "डाउनलोड" या "धारा 63" बटन पर क्लिक करें।'
    }
  ],

  te: [
    {
      id: 'faq-1',
      category: 'ఖాతా & యాక్సెస్',
      question: 'రిజిస్ట్రేషన్ మరియు లాగిన్ సమస్యలను ఎలా పరిష్కరించాలి?',
      answer: 'మీ బ్రోకర్ ఖాతాలో నమోదైన ఖచ్చితమైన ఇమెయిల్ లేదా 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేస్తున్నారని నిర్ధారించుకోండి. టైపోస్‌ను తనిఖీ చేయడానికి పాస్‌వర్డ్ షో/హైడ్ టోగుల్‌ని ఉపయోగించండి. ఒకవేళ మీరు పాస్‌వర్డ్ మర్చిపోతే, లాగిన్ పేజీలోని "Forgot Password" లింక్ ఉపయోగించి కొత్త పాస్‌వర్డ్ సెట్ చేసుకోండి.'
    },
    {
      id: 'faq-2',
      category: 'ఒప్పందాలు',
      question: 'కొత్త అద్దె లేదా వాణిజ్య ఒప్పందాన్ని ఎలా సృష్టించాలి?',
      answer: '"నా ఒప్పందాలు" విభాగంలో అగ్రిమెంట్ డ్రాఫ్టింగ్ ఎంచుకోండి, లేదా క్లయింట్ల వాల్ట్ నుండి నేరుగా "ఒప్పందం సృష్టించు" క్లిక్ చేయండి. 11-నెలల నివాస అద్దె లేదా వాణిజ్య లీజు ఒప్పందాన్ని ఎంచుకుని, ప్రాపర్టీ వివరాలను పూరించండి.'
    },
    {
      id: 'faq-3',
      category: 'ఇ-సైన్ & ఇ-స్టాంప్',
      question: 'ZapDocs లో ఆధార్ ఇ-సైన్ మరియు ఇ-స్టాంపింగ్ ఎలా పనిచేస్తాయి?',
      answer: 'ఒప్పందం డ్రాఫ్ట్ సిద్ధమైన తర్వాత, రాష్ట్ర స్టాంప్ డ్యూటీ డిజిటల్‌గా ప్రాసెస్ చేయబడుతుంది (ఇ-స్టాంప్ జారీ). ఆ తర్వాత ప్రాథమిక అద్దెదారునికి ఓటిపి ధృవీకరణ కోసం ఆధార్ ఇ-సైన్ లింక్ పంపబడుతుంది.'
    },
    {
      id: 'faq-4',
      category: 'ప్లాన్లు & ధరలు',
      question: 'బ్రోకర్ల కోసం అందుబాటులో ఉన్న నెలవారీ చందా ప్లాన్లు ఏమిటి?',
      answer: 'ZapDocs నెలకి ₹5,000 ధరతో ప్రొఫెషనల్ ప్లాన్‌ను అందిస్తుంది, ఇందులో 100 చట్టబద్ధమైన ఒప్పందాలు ఉంటాయి (ఒక్కో ఒప్పందానికి ₹50 మాత్రమే). నెలవారీ ప్లాన్ లేని బ్రోకర్లు ఒక్కో ఒప్పందానికి ₹99 చొప్పున పే-పర్-డాక్ విధానంలో పనిచేయవచ్చు.'
    },
    {
      id: 'faq-5',
      category: 'కోటా & టాప్-అప్‌లు',
      question: 'డాక్యుమెంట్ కోటా ఎలా పనిచేస్తుంది మరియు టాప్-అప్‌లను ఎలా కొనుగోలు చేయాలి?',
      answer: 'ప్రొఫెషనల్ ప్లాన్ సబ్‌స్క్రైబర్‌లు ప్రతి బిల్లింగ్ సైకిల్‌కు 100 డాక్యుమెంట్ల కోటాను పొందుతారు. కోటా ముగిసినట్లయితే, మీరు తక్షణ టాప్-అప్‌లను కొనుగోలు చేయవచ్చు: ₹990 కి 10 పత్రాలు లేదా ₹1,875 కి 25 పత్రాలు.'
    },
    {
      id: 'faq-6',
      category: 'పునరుద్ధరణ & గడువు',
      question: 'నెలవారీ ప్లాన్ గడువు ముగిసినప్పుడు ఏమి జరుగుతుంది మరియు ఎలా పునరుద్ధరించాలి?',
      answer: 'సబ్‌స్క్రిప్షన్ గడువు ముగిసినప్పుడు, కోటా క్రింద డాక్యుమెంట్ తయారీ నిలిపివేయబడుతుంది. మీరు ప్రొఫెషనల్ ప్లాన్‌ను ₹5,000 తో పునరుద్ధరించవచ్చు లేదా ₹99 పే-పర్-డాక్ టైర్‌కు మారవచ్చు. మీరు ప్లాన్ & బిల్లింగ్‌లో ఆటో-రిన్యూను కూడా ఆన్ చేయవచ్చు.'
    },
    {
      id: 'faq-7',
      category: 'బిల్లింగ్ & ఇన్వాయిస్‌లు',
      question: 'బిల్లింగ్ రశీదులు మరియు ఇన్వాయిస్‌లను ఎక్కడ చూడవచ్చు మరియు డౌన్‌లోడ్ చేయవచ్చు?',
      answer: 'మీ పూర్తి ఇన్వాయిస్ చరిత్రను వీక్షించడానికి "ప్లాన్ & బిల్లింగ్" విభాగానికి వెళ్లండి. ప్రతి ఇన్వాయిస్ అంశం రిఫరెన్స్ నంబర్, బిల్లింగ్ తేదీ, మొత్తం మరియు చెల్లింపు స్థితిని చూపుతుంది.'
    },
    {
      id: 'faq-8',
      category: 'రెఫర్ & సంపాదించండి',
      question: 'రెఫర్ & ఎర్న్ ప్రోగ్రామ్ ఎలా పనిచేస్తుంది మరియు రివార్డ్ ఏమిటి?',
      answer: 'ప్రతి అర్హత కలిగిన రెఫరల్ సైన్ అప్ అయిన వెంటనే బ్రోకర్లు నేరుగా తమ UPI కి ₹50 సంపాదిస్తారు. మీ ప్రత్యేక బ్రోకర్ రిఫెరల్ లింక్‌ను వాట్సాప్ ద్వారా షేర్ చేయండి లేదా రిఫర్ & ఎర్న్ స్క్రీన్ నుండి కాపీ చేయండి.'
    },
    {
      id: 'faq-9',
      category: 'బ్యాంక్ & UPI',
      question: 'రిఫరల్ రివార్డ్ చెల్లింపుల కోసం నా UPI ఐడిని ఎలా కాన్ఫిగర్ చేయాలి?',
      answer: 'నావిగేషన్ సైడ్‌బార్ నుండి "బ్యాంక్ & UPI సెట్టింగ్‌లు" ఎంచుకోండి. మీ ధృవీకరించబడిన UPI వర్చువల్ పేమెంట్ చిరునామాను (ఉదా. broker@upi) నమోదు చేయండి.'
    },
    {
      id: 'faq-10',
      category: 'డౌన్‌లోడ్‌లు & నిబంధనలు',
      question: 'పూర్తయిన ఒప్పందాలు మరియు సెక్షన్ 63 సర్టిఫికేట్‌లను ఎలా డౌన్‌లోడ్ చేయాలి?',
      answer: '"నా ఒప్పందాలు" స్క్రీన్‌లో, తుది లీగల్ పిడిఎఫ్ మరియు ఇ-స్టాంప్డ్ సర్టిఫికెట్ యాక్సెస్ చేయడానికి ఏదైనా పూర్తయిన ఒప్పందంపై "డౌన్‌లోడ్" బటన్‌ను క్లిక్ చేయండి.'
    }
  ],

  kn: [
    {
      id: 'faq-1',
      category: 'ಖಾತೆ & ಪ್ರವೇಶ',
      question: 'ನೋಂದಣಿ ಮತ್ತು ಲಾಗಿನ್ ಸಮಸ್ಯೆಗಳನ್ನು ಹೇಗೆ ಪರಿಹರಿಸುವುದು?',
      answer: 'ನಿಮ್ಮ ಬ್ರೋಕರ್ ಖಾತೆಯೊಂದಿಗೆ ನೋಂದಾಯಿಸಲಾದ ನಿಖರ ಇಮೇಲ್ ವಿಳಾಸ ಅಥವಾ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸುತ್ತಿದ್ದೀರಿ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ. ನೀವು ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದರೆ, ಲಾಗಿನ್ ಪುಟದಲ್ಲಿ "Forgot Password" ಲಿಂಕ್ ಬಳಸಿ ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ.'
    },
    {
      id: 'faq-2',
      category: 'ಒಪ್ಪಂದಗಳು',
      question: 'ಹೊಸ ಬಾಡಿಗೆ ಅಥವಾ ವಾಣಿಜ್ಯ ಒಪ್ಪಂದವನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?',
      answer: '"ನನ್ನ ಒಪ್ಪಂದಗಳು" ವಿಭಾಗಕ್ಕೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಿ ಮತ್ತು ಕರಾರು ರಚನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಅಥವಾ ಗ್ರಾಹಕರ ವಾಲ್ಟ್‌ನಿಂದ ನೇರವಾಗಿ "ಒಪ್ಪಂದ ರಚಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ. 11-ತಿಂಗಳ ವಸತಿ ಬಾಡಿಗೆ ಅಥವಾ ವಾಣಿಜ್ಯ ಗುತ್ತಿಗೆ ಒಪ್ಪಂದವನ್ನು ಆಯ್ಕೆಮಾಡಿ.'
    },
    {
      id: 'faq-3',
      category: 'ಇ-ಸಹಿ & ಇ-ಸ್ಟ್ಯಾಂಪ್',
      question: 'ZapDocs ನಲ್ಲಿ ಆಧಾರ್ ಇ-ಸಹಿ ಮತ್ತು ಇ-ಸ್ಟ್ಯಾಂಪಿಂಗ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?',
      answer: 'ಕರಾರು ಡ್ರಾಫ್ಟ್ ಸಿದ್ಧವಾದ ನಂತರ, ರಾಜ್ಯ ಮುದ್ರಾಂಕ ಶುಲ್ಕವನ್ನು ಡಿಜಿಟಲ್ ರೂಪದಲ್ಲಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತದೆ (ಇ-ಸ್ಟ್ಯಾಂಪ್ ನೀಡಲಾಗುತ್ತದೆ). ನಂತರ ಪ್ರಾಥಮಿಕ ಬಾಡಿಗೆದಾರರಿಗೆ OTP ಪರಿಶೀಲನೆಗಾಗಿ ಆಧಾರ್ ಇ-ಸಹಿ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.'
    },
    {
      id: 'faq-4',
      category: 'ಯೋಜನೆಗಳು & ಬೆಲೆ',
      question: 'ಬ್ರೋಕರ್‌ಗಳಿಗೆ ಲಭ್ಯವಿರುವ ಮಾಸಿಕ ಚಂದಾದಾರಿಕೆ ಯೋಜನೆಗಳು ಯಾವುವು?',
      answer: 'ZapDocs ತಿಂಗಳಿಗೆ ₹5,000 ದರದಲ್ಲಿ ಪ್ರೊಫೆಷನಲ್ ಪ್ಲಾನ್ ನೀಡುತ್ತದೆ, ಇದರಲ್ಲಿ 100 ಕಾನೂನುಬದ್ಧ ಕರಾರುಗಳು ಲಭ್ಯವಿರುತ್ತವೆ (ಪ್ರತಿ ಕರಾರಿಗೆ ₹50 ರಿಯಾಯಿತಿ ದರ). ಸಕ್ರಿಯ ಯೋಜನೆ ಇಲ್ಲದ ಬ್ರೋಕರ್‌ಗಳು ಪ್ರತಿ ಕರಾರಿಗೆ ₹99 ಪಾವತಿಸುವ ಮೂಲಕ ಪೇ-ಪರ್-ಡಾಕ್ ಅಡಿಯಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸಬಹುದು.'
    },
    {
      id: 'faq-5',
      category: 'ಕೋಟಾ & ಟಾಪ್-ಅಪ್',
      question: 'ದಾಖಲೆ ಕೋಟಾ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ ಮತ್ತು ಟಾಪ್-ಅಪ್‌ಗಳನ್ನು ಹೇಗೆ ಖರೀದಿಸುವುದು?',
      answer: 'ಸಕ್ರಿಯ ಪ್ರೊಫೆಷನಲ್ ಪ್ಲಾನ್ ಬಳಕೆದಾರರು ಪ್ರತಿ ಬಿಲ್ಲಿಂಗ್ ಚಕ್ರಕ್ಕೆ 100 ದಾಖಲೆಗಳ ಕೋಟಾವನ್ನು ಪಡೆಯುತ್ತಾರೆ. ನಿಮ್ಮ ಕೋಟಾ ಮುಗಿದಿದ್ದರೆ, ನೀವು ತ್ವರಿತ ಟಾಪ್-ಅಪ್‌ಗಳನ್ನು ಖರೀದಿಸಬಹುದು: ₹990 ಕ್ಕೆ 10 ದಾಖಲೆಗಳು ಅಥವಾ ₹1,875 ಕ್ಕೆ 25 ದಾಖಲೆಗಳು.'
    },
    {
      id: 'faq-6',
      category: 'ನವೀಕರಣ & ಮುಕ್ತಾಯ',
      question: 'ಮಾಸಿಕ ಯೋಜನೆ ಮುಕ್ತಾಯಗೊಂಡಾಗ ಏನಾಗುತ್ತದೆ ಮತ್ತು ನವೀಕರಿಸುವುದು ಹೇಗೆ?',
      answer: 'ಚಂದಾದಾರಿಕೆ ಮುಕ್ತಾಯಗೊಂಡಾಗ, ಕರಾರು ರಚನೆಯನ್ನು ತಾತ್ಕಾಲಿಕವಾಗಿ ನಿಲ್ಲಿಸಲಾಗುತ್ತದೆ. ನೀವು ₹5,000 ಪಾವತಿಸಿ ಯೋಜನೆಯನ್ನು ನವೀಕರಿಸಬಹುದು ಅಥವಾ ₹99 ಪೇ-ಪರ್-ಡಾಕ್ ಶ್ರೇಣಿಗೆ ಬದಲಾಯಿಸಬಹುದು.'
    },
    {
      id: 'faq-7',
      category: 'ಬಿಲ್ಲಿಂಗ್ & ಇನ್‌ವಾಯ್ಸ್',
      question: 'ನನ್ನ ಬಿಲ್ಲಿಂಗ್ ರಶೀದಿಗಳು ಮತ್ತು ಇನ್‌ವಾಯ್ಸ್‌ಗಳನ್ನು ಎಲ್ಲಿ ವೀಕ್ಷಿಸಬಹುದು ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು?',
      answer: 'ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಇನ್‌ವಾಯ್ಸ್ ಇತಿಹಾಸವನ್ನು ವೀಕ್ಷಿಸಲು "ಪ್ಲಾನ್ & ಬಿಲ್ಲಿಂಗ್" ವಿಭಾಗಕ್ಕೆ ಭೇಟಿ ನೀಡಿ. ಪ್ರತಿ ಐಟಂ ಇನ್‌ವಾಯ್ಸ್ ಸಂಖ್ಯೆ, ದಿನಾಂಕ, ಮೊತ್ತ ಮತ್ತು ಪಾವತಿ ಸ್ಥಿತಿಯನ್ನು ತೋರಿಸುತ್ತದೆ.'
    },
    {
      id: 'faq-8',
      category: 'ರೆಫರ್ ಮಾಡಿ ಗಳಿಸಿ',
      question: 'ರೆಫರ್ ಮತ್ತು ಗಳಿಕೆ ಕಾರ್ಯಕ್ರಮ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ ಮತ್ತು ಬಹುಮಾನವೇನು?',
      answer: 'ಪ್ರತಿ ಅರ್ಹ ರೆಫರಲ್ ನೋಂದಣಿಗೆ ಬ್ರೋಕರ್‌ಗಳು ನೇರವಾಗಿ ತಮ್ಮ UPI ಗೆ ₹50 ಗಳಿಸುತ್ತಾರೆ. ವಾಟ್ಸಾಪ್ ಮೂಲಕ ನಿಮ್ಮ ಅನನ್ಯ ಬ್ರೋಕರ್ ರೆಫರಲ್ ಲಿಂಕ್ ಅನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.'
    },
    {
      id: 'faq-9',
      category: 'ಬ್ಯಾಂಕ್ & UPI',
      question: 'ಬಹುಮಾನ ಪಾವತಿಗಳಿಗಾಗಿ ನನ್ನ UPI ಐಡಿಯನ್ನು ಹೇಗೆ ಕಾನ್ಫಿಗರ್ ಮಾಡುವುದು?',
      answer: 'ನ್ಯಾವಿಗೇಷನ್ ಸೈಡ್‌ಬಾರ್‌ನಿಂದ "ಬ್ಯಾಂಕ್ & UPI ಸೆಟ್ಟಿಂಗ್‌ಗಳು" ಆಯ್ಕೆಮಾಡಿ. ನಿಮ್ಮ ಪರಿಶೀಲಿಸಿದ UPI ಪಾವತಿ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ (ಉದಾ: broker@upi).'
    },
    {
      id: 'faq-10',
      category: 'ಡೌನ್‌ಲೋಡ್ & ಸಾಕ್ಷ್ಯ',
      question: 'ಪೂರ್ಣಗೊಂಡ ಕರಾರುಗಳು ಮತ್ತು ಸೆಕ್ಷನ್ 63 ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ಹೇಗೆ ಡೌನ್‌ಲೋಡ್ ಮಾಡುವುದು?',
      answer: '"ನನ್ನ ಒಪ್ಪಂದಗಳು" ಪರದೆಯಲ್ಲಿ, ಅಂತಿಮ ಕಾನೂನು ಪಿಡಿಎಫ್ ಮತ್ತು ಇ-ಸ್ಟ್ಯಾಂಪ್ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಪ್ರವೇಶಿಸಲು ಯಾವುದೇ ಪೂರ್ಣಗೊಂಡ ಕರಾರಿನ ಮೇಲೆ "ಡೌನ್‌ಲೋಡ್" ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.'
    }
  ],

  mr: [
    {
      id: 'faq-1',
      category: 'खाते आणि प्रवेश',
      question: 'नोंदणी आणि लॉगिन समस्यांचे निराकरण कसे करावे?',
      answer: 'तुमच्या ब्रोकर खात्यात नोंदणीकृत असलेला अचूक ईमेल किंवा 10-अंकी मोबाईल नंबर टाकत असल्याची खात्री करा. पासवर्ड तपासण्यासाठी शो/हाईड टॉगल वापरा. जर तुम्ही पासवर्ड विसरला असाल तर नवीन पासवर्ड सेट करण्यासाठी लॉगिन पेजवरील "Forgot Password" लिंक वापरा.'
    },
    {
      id: 'faq-2',
      category: 'करार',
      question: 'नवीन भाडे किंवा व्यावसायिक करार कसा तयार करावा?',
      answer: '"माझे करार" विभागामध्ये जाऊन करार मसुदा तयार करणे निवडा किंवा ग्राहक व्हॉल्टमधून थेट "करार तयार करा" वर क्लिक करा. 11-महिन्यांचा निवासी किंवा व्यावसायिक भाडे करार निवडा आणि मालमत्तेचे तपशील भरा.'
    },
    {
      id: 'faq-3',
      category: 'ई-स्वाक्षरी & मुद्रांक',
      question: 'ZapDocs वर आधार ई-स्वाक्षरी आणि ई-स्टॅम्पिंग कसे कार्य करते?',
      answer: 'कराराचा मसुदा तयार झाल्यावर राज्य मुद्रांक शुल्क डिजिटल पद्धतीने भरले जाते (ई-स्टॅम्प जारी होतो). त्यानंतर प्राथमिक भाडेकरूला OTP पडताळणीसाठी आधार ई-स्वाक्षरी लिंक पाठवली जाते.'
    },
    {
      id: 'faq-4',
      category: 'प्लॅन आणि किंमत',
      question: 'ब्रोकर्ससाठी कोणते मासिक सबस्क्रिप्शन प्लॅन उपलब्ध आहेत?',
      answer: 'ZapDocs दरमहा ₹5,000 मध्ये प्रोफेशनल प्लॅन ऑफर करते, ज्यामध्ये 100 कायदेशीर करार समाविष्ट आहेत (केवळ ₹50/करार). सक्रिय प्लॅन नसलेले ब्रोकर्स प्रति करार ₹99 दराने पे-पर-डॉक श्रेणीमध्ये काम करू शकतात.'
    },
    {
      id: 'faq-5',
      category: 'कोटा आणि टॉप-अप',
      question: 'दस्तऐवज कोटा कसा कार्य करतो आणि टॉप-अप कसे खरेदी करावे?',
      answer: 'प्रोफेशनल प्लॅन सदस्यांना दरमहा 100 दस्तऐवजांचा कोटा मिळतो. तुमचा कोटा संपल्यास तुम्ही त्वरित टॉप-अप खरेदी करू शकता: ₹990 मध्ये 10 दस्तऐवज किंवा ₹1,875 मध्ये 25 दस्तऐवज.'
    },
    {
      id: 'faq-6',
      category: 'नूतनीकरण आणि मुदत',
      question: 'मासिक योजना संपल्यावर काय होते आणि नूतनीकरण कसे करावे?',
      answer: 'सबस्क्रिप्शन संपल्यावर दस्तऐवज तयार करणे तात्पुरते थांबवले जाते. तुम्ही ₹5,000 भरून प्रोफेशनल प्लॅनचे नूतनीकरण करू शकता किंवा ₹99 पे-पर-डॉक श्रेणीवर स्विच करू शकता.'
    },
    {
      id: 'faq-7',
      category: 'बिलिंग आणि पावत्या',
      question: 'मी माझ्या बिलिंग पावत्या आणि इनव्हॉइस कुठे पाहू आणि डाउनलोड करू शकतो?',
      answer: 'तुमचा संपूर्ण इनव्हॉइस इतिहास पाहण्यासाठी "प्लॅन आणि बिलिंग" विभागात जा. प्रत्येक आयटम इनव्हॉइस संदर्भ क्रमांक, तारीख, रक्कम आणि पेमेंट स्थिती दर्शवतो.'
    },
    {
      id: 'faq-8',
      category: 'रेफर करा आणि मिळवा',
      question: 'रेफर आणि अर्न प्रोग्राम कसा कार्य करतो आणि काय बक्षीस आहे?',
      answer: 'प्रत्येक पात्र रेफरल साइन अप झाल्यावर ब्रोकर्स थेट त्यांच्या UPI वर ₹50 मिळवतात. व्हॉट्सअ‍ॅपद्वारे तुमची युनिक रेफरल लिंक शेअर करा.'
    },
    {
      id: 'faq-9',
      category: 'बँक आणि UPI',
      question: 'पेआउट्ससाठी माझा UPI आयडी कसा कॉन्फिगर करावा?',
      answer: 'नेव्हिगेशन साइडबारमधून "बँक आणि UPI सेटिंग्ज" निवडा. तुमचा सत्यापित UPI व्हर्च्युअल पेमेंट पत्ता (उदा. broker@upi) प्रविष्ट करा.'
    },
    {
      id: 'faq-10',
      category: 'डाउनलोड आणि प्रमाणपत्रे',
      question: 'पूर्ण झालेले करार आणि कलम 63 पुरावा प्रमाणपत्रे कशी डाउनलोड करावी?',
      answer: '"माझे करार" स्क्रीनवर, अंतिम कायदेशीर पीडीएफ आणि ई-स्टॅम्प केलेले प्रमाणपत्र मिळविण्यासाठी कोणत्याही पूर्ण झालेल्या करारावरील "डाउनलोड" बटणावर क्लिक करा.'
    }
  ]
};

export default UI_TRANSLATIONS;
