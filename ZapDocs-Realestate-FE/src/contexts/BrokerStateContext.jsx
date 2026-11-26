import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { downloadAgreementPdf } from '../utils/pdfGenerator';

const BrokerStateContext = createContext(null);

const STORAGE_KEY_STATE = 'zd_broker_prototype_state';

const DEFAULT_AGREEMENTS = [
  {
    id: 'ZD-9042',
    date: '12 Oct 2026',
    tenantName: 'Siddharth Rao',
    ownerName: 'Sunita Mehra',
    propertyArea: 'Indiranagar 100ft Rd',
    type: 'Residential 11M',
    status: 'Pending e-Sign',
    badges: ['Tenant Signed'],
    shaHash: '8f43a9b...41a2',
    whatsappDispatches: 1,
    lastDispatched: '12 Oct 2026, 14:30',
    rent: 42000,
    deposit: 200000
  },
  {
    id: 'ZD-8991',
    date: '10 Oct 2026',
    tenantName: 'Vikram Joshi',
    ownerName: 'Prakash Rao',
    propertyArea: 'HSR Layout Sector 2',
    type: 'Residential 11M',
    status: 'Completed',
    badges: ['e-Stamp Issued', 'Completed'],
    shaHash: 'e102bc3...9891',
    whatsappDispatches: 2,
    lastDispatched: '10 Oct 2026, 18:15',
    rent: 38000,
    deposit: 190000
  },
  {
    id: 'ZD-8845',
    date: '04 Oct 2026',
    tenantName: 'Rohit Khandelwal',
    ownerName: 'Balaji Towers LLC',
    propertyArea: 'Koramangala 4th Block',
    type: 'Commercial Office',
    status: 'Completed',
    badges: ['e-Stamp Issued', 'NeSL Registered'],
    shaHash: '39c087d...120f',
    whatsappDispatches: 2,
    lastDispatched: '04 Oct 2026, 11:20',
    rent: 75000,
    deposit: 450000
  },
  {
    id: 'ZD-8720',
    date: '28 Sep 2026',
    tenantName: 'Kavita Nair',
    ownerName: 'M. S. Murthy',
    propertyArea: 'Whitefield EPIP Zone',
    type: 'Residential 11M',
    status: 'Expiring Soon',
    badges: ['Expiring Soon (14 Days)'],
    shaHash: '91d542a...ee31',
    whatsappDispatches: 3,
    lastDispatched: '28 Sep 2026, 16:45',
    rent: 45000,
    deposit: 225000
  },
  {
    id: 'ZD-8650',
    date: '22 Sep 2026',
    tenantName: 'Arjun Dasgupta',
    ownerName: 'Suresh Reddy',
    propertyArea: 'Brigade Gateway #402',
    type: 'Residential 11M',
    status: 'Pending e-Sign',
    badges: ['Awaiting Landlord e-Sign'],
    shaHash: '43fb129...55c2',
    whatsappDispatches: 1,
    lastDispatched: '22 Sep 2026, 09:10',
    rent: 32000,
    deposit: 160000
  }
];

const DEFAULT_CLIENTS = [
  {
    id: 'CL-101',
    name: 'Suresh Reddy',
    role: 'Landlord',
    phone: '+91 98450 11223',
    aadhaar: '•••• •••• 8821',
    address: '402 Brigade Gateway, Rajajinagar, Bangalore',
    propertiesCount: 4
  },
  {
    id: 'CL-102',
    name: 'Pooja Hegde',
    role: 'Tenant',
    phone: '+91 99001 44556',
    aadhaar: '•••• •••• 3349',
    address: 'Flat 1204, Prestige Falcon City, Kanakapura Rd',
    propertiesCount: 1
  },
  {
    id: 'CL-103',
    name: 'Vikram Malhotra',
    role: 'Landlord',
    phone: '+91 98110 99887',
    aadhaar: '•••• •••• 7712',
    address: 'Villa 18, Palm Meadows, Whitefield, Bangalore',
    propertiesCount: 6
  },
  {
    id: 'CL-104',
    name: 'Ananya Deshmukh',
    role: 'Tenant',
    phone: '+91 97412 88331',
    aadhaar: '•••• •••• 5590',
    address: 'Tower 3, Sobha Dream Acres, Panathur',
    propertiesCount: 1
  },
  {
    id: 'CL-105',
    name: 'Col. K. V. Sharma',
    role: 'Landlord',
    phone: '+91 94480 33221',
    aadhaar: '•••• •••• 1104',
    address: 'Defence Colony, Indiranagar, Bangalore',
    propertiesCount: 3
  }
];

const DEFAULT_INVOICES = [
  {
    id: 'INV-2026-1002',
    date: '15 Oct 2026',
    desc: 'Professional Tier (100 Docs)',
    amount: 5000,
    status: 'Paid',
    paymentId: 'pay_1002891'
  },
  {
    id: 'INV-2026-0901',
    date: '15 Sep 2026',
    desc: 'Professional Tier (100 Docs)',
    amount: 5000,
    status: 'Paid',
    paymentId: 'pay_0901723'
  },
  {
    id: 'INV-2026-0814',
    date: '28 Aug 2026',
    desc: 'Instant Top-Up Pack (10 Docs)',
    amount: 990,
    status: 'Paid',
    paymentId: 'pay_0814912'
  }
];

const DEFAULT_REFERRALS = [
  {
    broker: 'Ramesh Patel (Indiranagar)',
    date: '11 Oct 2026',
    amount: '₹50.00',
    status: 'Paid to UPI (UPI-849182)'
  },
  {
    broker: 'Amit Verma (HSR Layout)',
    date: '09 Oct 2026',
    amount: '₹50.00',
    status: 'Paid to UPI (UPI-773120)'
  },
  {
    broker: 'Sunita Gowda (Whitefield)',
    date: '03 Oct 2026',
    amount: '₹50.00',
    status: 'Paid to UPI (UPI-661209)'
  },
  {
    broker: 'Kishore Kumar (Koramangala)',
    date: '12 Oct 2026',
    amount: '₹50.00',
    status: 'Pending (Awaiting App Signup)'
  }
];

function generateUniqueId(prefix, existingList, minNum = 1000, maxNum = 9999) {
  const existingIds = new Set(
    (Array.isArray(existingList) ? existingList : []).map((item) => item && item.id).filter(Boolean)
  );
  for (let i = 0; i < 50; i++) {
    const candidate = `${prefix}${Math.floor(minNum + Math.random() * (maxNum - minNum + 1))}`;
    if (!existingIds.has(candidate)) {
      return candidate;
    }
  }
  const entropy = Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}${entropy}`;
}

export function BrokerStateProvider({ children }) {
  // Load persisted state defensively
  const rawState = storage.get(STORAGE_KEY_STATE, {});
  const savedState = (rawState && typeof rawState === 'object' && !Array.isArray(rawState)) ? rawState : {};

  const validModes = ['sub-active', 'pay-per-doc', 'sub-expired'];
  const initialMode = validModes.includes(savedState.dashboardMode) ? savedState.dashboardMode : 'sub-active';
  const [dashboardMode, setDashboardModeState] = useState(initialMode);

  const [allocatedQuota, setAllocatedQuota] = useState(
    typeof savedState.allocatedQuota === 'number' && !isNaN(savedState.allocatedQuota) && savedState.allocatedQuota >= 0
      ? savedState.allocatedQuota
      : 100
  );
  const [usedQuota, setUsedQuota] = useState(() => {
    if (typeof savedState.usedQuota === 'number' && !isNaN(savedState.usedQuota) && savedState.usedQuota >= 0) {
      return savedState.usedQuota;
    }
    return 30;
  });
  const [autoRenew, setAutoRenew] = useState(
    typeof savedState.autoRenew === 'boolean' ? savedState.autoRenew : true
  );

  const [bankDetails, setBankDetails] = useState(() => {
    if (savedState.bankDetails && typeof savedState.bankDetails === 'object') {
      return {
        holderName: savedState.bankDetails.holderName || 'Rajesh Kumar Sharma',
        upiId: savedState.bankDetails.upiId || 'rajesh@okaxis',
        accountNo: savedState.bankDetails.accountNo || '50100492819201',
        ifsc: savedState.bankDetails.ifsc || 'HDFC0001248'
      };
    }
    return {
      holderName: 'Rajesh Kumar Sharma',
      upiId: 'rajesh@okaxis',
      accountNo: '50100492819201',
      ifsc: 'HDFC0001248'
    };
  });

  const [agreements, setAgreements] = useState(Array.isArray(savedState.agreements) ? savedState.agreements : DEFAULT_AGREEMENTS);
  const [clients, setClients] = useState(Array.isArray(savedState.clients) ? savedState.clients : DEFAULT_CLIENTS);
  const [invoices, setInvoices] = useState(Array.isArray(savedState.invoices) ? savedState.invoices : DEFAULT_INVOICES);
  const [referrals, setReferrals] = useState(Array.isArray(savedState.referrals) ? savedState.referrals : DEFAULT_REFERRALS);

  // Active modal management
  const [activeModal, setActiveModal] = useState(null); // { name: 'generate-agreement' | 'add-client' | 'refer-earn' | 'razorpay' | ... , payload: any }
  const [toastMessage, setToastMessage] = useState(null);

  // Synchronize state changes to localStorage
  useEffect(() => {
    storage.set(STORAGE_KEY_STATE, {
      dashboardMode,
      allocatedQuota,
      usedQuota,
      autoRenew,
      bankDetails,
      agreements,
      clients,
      invoices,
      referrals
    });
  }, [dashboardMode, allocatedQuota, usedQuota, autoRenew, bankDetails, agreements, clients, invoices, referrals]);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  }

  function setDashboardMode(mode) {
    setDashboardModeState(mode);
    if (mode === 'sub-active') {
      setAllocatedQuota(100);
      setUsedQuota(30);
    } else if (mode === 'sub-zero') {
      setAllocatedQuota(100);
      setUsedQuota(100);
    }
    showToast(`Switched Dashboard simulation: ${mode}`);
  }

  function toggleAutoRenew(isChecked) {
    if (!isChecked) {
      setActiveModal({ name: 'auto-renew-confirm' });
    } else {
      setAutoRenew(true);
      showToast('Auto-Renew preference updated: Enabled');
    }
  }

  function confirmTurnOffAutoRenew() {
    setAutoRenew(false);
    setActiveModal(null);
    showToast('Auto-Renew turned OFF. Plan expires on 15 Nov 2026.');
  }

  function cancelAutoRenewToggle() {
    setActiveModal(null);
  }

  function openModal(name, payload = null) {
    const modalOpenId = 'modal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const enrichedPayload = payload && typeof payload === 'object'
      ? { ...payload, modalOpenId: payload.modalOpenId || modalOpenId }
      : payload;
    setActiveModal({ name, payload: enrichedPayload, modalOpenId });
  }

  function closeModal() {
    setActiveModal(null);
  }

  // Attach helpers to window for automated responsive testing and external triggers
  useEffect(() => {
    window.__zdOpenModal = openModal;
    window.__zdCloseModal = closeModal;
    return () => {
      delete window.__zdOpenModal;
      delete window.__zdCloseModal;
    };
  }, []);

  function addClient(clientData) {
    if (!clientData || typeof clientData !== 'object') {
      showToast('⚠️ Unable to add client: Invalid client data provided.');
      return null;
    }
    const trimmedName = (clientData.name || '').trim();
    if (!trimmedName) {
      showToast('⚠️ Client name is required.');
      return null;
    }
    const newClient = {
      id: generateUniqueId('CL-', clients, 106, 9999),
      name: trimmedName,
      role: clientData.role || 'Landlord',
      phone: clientData.phone || '',
      aadhaar: clientData.aadhaar || '',
      address: clientData.address || '',
      propertiesCount: Number(clientData.propertiesCount) || 1
    };
    setClients((prev) => [newClient, ...prev]);
    showToast(`Client ${newClient.name} successfully saved with UIDAI masked Aadhaar!`);
    closeModal();
    return newClient;
  }

  function updateClient(updatedClient) {
    if (!updatedClient || typeof updatedClient !== 'object' || !updatedClient.id) return;
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? { ...c, ...updatedClient } : c))
    );
    showToast(`✓ Client ${updatedClient.name || 'details'} updated successfully!`);
    closeModal();
  }

  function addAgreement(agreementData) {
    if (!agreementData || typeof agreementData !== 'object') {
      showToast('⚠️ Unable to create agreement: Invalid agreement details.');
      return null;
    }
    const newId = generateUniqueId('ZD-', agreements, 9050, 9999);
    const tenant = (agreementData.tenant || agreementData.tenantName || 'Tenant').trim() || 'Tenant';
    const landlord = (agreementData.landlord || agreementData.ownerName || 'Property Owner').trim() || 'Property Owner';
    const address = (agreementData.address || agreementData.propertyArea || 'Residential Premises').trim() || 'Residential Premises';
    const newAgr = {
      id: newId,
      date: 'Today',
      agreementTitle: agreementData.title || agreementData.term || 'Residential Rental Agreement',
      referenceNumber: agreementData.referenceNumber || '',
      tenantName: tenant,
      ownerName: landlord,
      propertyArea: address,
      type: agreementData.term || agreementData.type || 'Residential 11M',
      status: 'Pending e-Sign',
      badges: ['Link Dispatched', 'NeSL Ready'],
      shaHash: 'a718c9f...' + Math.random().toString(36).substring(2, 6),
      whatsappDispatches: 1,
      lastDispatched: 'Just now',
      rent: agreementData.rent != null ? String(agreementData.rent) : '₹0',
      deposit: agreementData.deposit != null ? String(agreementData.deposit) : '₹0',
      effectiveDate: agreementData.effectiveDate || '',
      expiryDate: agreementData.expiryDate || '',
      sourceDocument: agreementData.sourceDocument || null
    };

    setAgreements((prev) => [newAgr, ...prev]);
    if (dashboardMode !== 'pay-per-doc') {
      setUsedQuota((prev) => Math.min(allocatedQuota, prev + 1));
    }
    showToast(`Agreement #${newId} executed! WhatsApp signature links dispatched.`);
    return newAgr;
  }

  function dispatchWhatsApp(agreementId) {
    const agr = agreements.find((a) => a && a.id === agreementId);
    if (!agr) {
      showToast('Agreement not found.');
      return;
    }
    const tenantName = (agr.tenantName || 'Client').trim() || 'Client';

    setAgreements((prev) =>
      prev.map((a) => {
        if (a && a.id === agreementId) {
          const count = (a.whatsappDispatches || 0) + 1;
          return {
            ...a,
            whatsappDispatches: count,
            lastDispatched: 'Just now'
          };
        }
        return a;
      })
    );

    const msg = `*ZapDocs e-Sign Link Dispatch*\nHello ${tenantName}, your lease agreement #${agr.id} is ready for Aadhaar e-Sign & e-Stamp verification.\nLink: https://zapdocs.in/sign/${agr.id}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    showToast(`WhatsApp signature link dispatched to ${tenantName} (Dispatch #${(agr.whatsappDispatches || 0) + 1})!`);
  }

  function downloadLegalPdf(agreementOrId, hash) {
    if (!agreementOrId) {
      showToast('Unable to download PDF: Agreement reference is missing.');
      return;
    }

    const agr = typeof agreementOrId === 'object' && agreementOrId !== null
      ? (agreementOrId.id ? agreements.find((a) => a.id === agreementOrId.id) || agreementOrId : agreementOrId)
      : agreements.find((a) => a.id === agreementOrId);

    if (!agr || !agr.id) {
      showToast('Unable to download PDF: Agreement record not found.');
      return;
    }

    if (agr.status === 'Completed' || agr.status === 'Expiring Soon') {
      try {
        const effectiveHash = hash || agr.shaHash || 'a718c9f...41a2';
        showToast(`Downloading SHA-256 locked Legal PDF: ${agr.id} [Hash: ${effectiveHash}]`);
        downloadAgreementPdf(agr, { isDraft: false, shaHash: effectiveHash });
      } catch (err) {
        console.error('Failed to download legal PDF:', err);
        showToast(`Error generating PDF for ${agr.id}: ${err.message || 'Generation failed'}`);
      }
    } else {
      openModal('draft-pdf-warning', agr);
    }
  }

  function downloadWatermarkedDraft(agreementOrId) {
    if (!agreementOrId) {
      showToast('Unable to download draft: Agreement reference is missing.');
      return;
    }

    const agr = typeof agreementOrId === 'object' && agreementOrId !== null
      ? (agreementOrId.id ? agreements.find((a) => a.id === agreementOrId.id) || agreementOrId : agreementOrId)
      : agreements.find((a) => a.id === agreementOrId);

    if (!agr || !agr.id) {
      showToast('Unable to download draft: Agreement record not found.');
      return;
    }

    closeModal();
    try {
      showToast(`Downloading Watermarked Draft Copy: ${agr.id}`);
      downloadAgreementPdf(agr, { isDraft: true });
    } catch (err) {
      console.error('Failed to download draft PDF:', err);
      showToast(`Error generating draft PDF for ${agr.id}: ${err.message || 'Generation failed'}`);
    }
  }

  function executeRenewal(sourceAgreement, newRent, newDeposit) {
    if (!sourceAgreement || typeof sourceAgreement !== 'object') {
      showToast('Unable to execute renewal: Source agreement is missing.');
      return;
    }
    const newId = generateUniqueId('ZD-', agreements, 9100, 9999);
    const renewedAgr = {
      id: newId,
      date: 'Today',
      tenantName: (sourceAgreement.tenantName || 'Tenant').trim() || 'Tenant',
      ownerName: (sourceAgreement.ownerName || 'Property Owner').trim() || 'Property Owner',
      propertyArea: (sourceAgreement.propertyArea || 'Residential Premises').trim() || 'Residential Premises',
      type: 'Residential 11M (Renewed)',
      status: 'Pending e-Sign',
      badges: ['Lease Renewed', 'Awaiting Signatures'],
      shaHash: '91d542a...' + Math.random().toString(36).substring(2, 6),
      whatsappDispatches: 1,
      lastDispatched: 'Just now',
      rent: newRent || sourceAgreement.rent || '₹0',
      deposit: newDeposit || sourceAgreement.deposit || '₹0'
    };

    setAgreements((prev) => [renewedAgr, ...prev]);
    if (dashboardMode !== 'pay-per-doc') {
      setUsedQuota((prev) => Math.min(allocatedQuota, prev + 1));
    }
    closeModal();
    showToast(`Renewal Lease #${newId} created! WhatsApp e-Sign link dispatched.`);
  }

  function updateBankDetails(details) {
    if (!details || typeof details !== 'object') return;
    setBankDetails((prev) => ({ ...prev, ...details }));
    const upiLabel = details.upiId ? ` [${details.upiId}]` : '';
    showToast(`Bank details & UPI${upiLabel} verified and saved!`);
  }

  function handleRazorpaySuccess(order) {
    const paymentId = 'pay_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
    const safeOrder = order && typeof order === 'object' ? order : {};

    if (safeOrder.type === 'plan') {
      setAllocatedQuota((prev) => prev + 100);
      setUsedQuota(0);
      setDashboardModeState('sub-active');
    } else if (safeOrder.type === 'topup') {
      setAllocatedQuota((prev) => prev + (safeOrder.docs || 10));
    }

    const newInvoiceId = generateUniqueId('INV-2026-', invoices, 1005, 9999);
    const newInvoice = {
      id: newInvoiceId,
      date: 'Today',
      desc: safeOrder.title || 'Plan / Top-Up Purchase',
      amount: safeOrder.amount || 0,
      status: 'Paid',
      paymentId: paymentId
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    showToast(`Payment Verified! ₹${safeOrder.amount || 0} credited via Razorpay.`);
    return { paymentId, newInvoiceId };
  }

  function renewPlanAction() {
    openModal('razorpay-checkout', {
      type: 'plan',
      title: 'Professional Plan Renewal (100 Docs)',
      amount: 5000,
      docs: 100
    });
  }

  function purchaseTopUp(docs, price) {
    openModal('razorpay-checkout', {
      type: 'topup',
      title: `Instant Top-Up Pack (${docs} Docs)`,
      amount: price,
      docs: docs
    });
  }

  const remainingQuota = Math.max(0, allocatedQuota - usedQuota);

  return (
    <BrokerStateContext.Provider
      value={{
        dashboardMode,
        setDashboardMode,
        allocatedQuota,
        usedQuota,
        remainingQuota,
        autoRenew,
        toggleAutoRenew,
        confirmTurnOffAutoRenew,
        cancelAutoRenewToggle,
        bankDetails,
        updateBankDetails,
        agreements,
        clients,
        invoices,
        referrals,
        activeModal,
        openModal,
        closeModal,
        toastMessage,
        showToast,
        addClient,
        updateClient,
        addAgreement,
        dispatchWhatsApp,
        downloadLegalPdf,
        downloadWatermarkedDraft,
        executeRenewal,
        handleRazorpaySuccess,
        renewPlanAction,
        purchaseTopUp
      }}
    >
      {children}
    </BrokerStateContext.Provider>
  );
}

export function useBrokerState() {
  const context = useContext(BrokerStateContext);
  if (!context) {
    throw new Error('useBrokerState must be used within a BrokerStateProvider');
  }
  return context;
}
