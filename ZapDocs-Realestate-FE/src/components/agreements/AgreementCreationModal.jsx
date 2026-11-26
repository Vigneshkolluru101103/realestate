import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { getAgreements, saveAgreements } from '../../mock/agreementsData';
import { getClients, saveClients } from '../../mock/clientsData';
import { locationService } from '../../services/api/locationService';
import { brokerStorage } from '../../broker/brokerStorage';
import Button from '../common/Button/Button';
import Badge from '../common/Badge/Badge';
import './AgreementCreationModal.css';

const RENTAL_TYPES = [
  '11-Month Residential Rental',
  'Commercial Lease Agreement',
  'Leave & License Agreement'
];

const OTHER_TYPES = [
  'Affidavit / Declaration',
  'Non-Disclosure Agreement (NDA)',
  'Commercial Lease Agreement',
  'Leave & License Agreement'
];

function getDefaultStartDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  d.setDate(1);
  return d.toISOString().split('T')[0];
}

export default function AgreementCreationModal({
  isOpen,
  onClose,
  initialType = 'rental',
  onNavigate,
  prefillClient = null,
  onSuccess
}) {
  const { user } = useAuth();
  const brokerId = user?.id || 'default_broker';
  const subscription = user?.subscription || { status: 'none' };

  // Fetch broker-scoped clients from Vault
  const brokerClients = useMemo(() => {
    return getClients(brokerId);
  }, [brokerId]);

  const landlords = useMemo(() => {
    return brokerClients.filter((c) => c.role === 'Landlord / Owner');
  }, [brokerClients]);

  const tenants = useMemo(() => {
    return brokerClients.filter((c) => c.role === 'Tenant');
  }, [brokerClients]);

  // Quota & Billing state
  const isPlanActive = subscription.status === 'active';
  const remainingQuota = subscription.remainingQuota !== undefined ? subscription.remainingQuota : 0;
  const isZeroQuota = isPlanActive && remainingQuota === 0;
  const isExpired = subscription.status === 'expired';
  const isNoPlan = subscription.status === 'none' || !subscription.status;

  // Selected billing option: 'plan' or 'pay-per-doc'
  const defaultBillingMode = isPlanActive && !isZeroQuota ? 'plan' : 'pay-per-doc';
  const [billingMode, setBillingMode] = useState(defaultBillingMode);

  // Form states
  const isOther = initialType === 'other';
  const [agreementType, setAgreementType] = useState(() => {
    if (initialType === 'other') return 'Commercial Lease Agreement';
    return '11-Month Residential Rental';
  });

  // Owner state
  const [ownerMode, setOwnerMode] = useState(() => {
    if (prefillClient && prefillClient.role === 'Landlord / Owner') return 'existing';
    return landlords.length > 0 ? 'existing' : 'new';
  });
  const [selectedOwnerId, setSelectedOwnerId] = useState(() => {
    if (prefillClient && prefillClient.role === 'Landlord / Owner') return prefillClient.id;
    return landlords.length > 0 ? landlords[0].id : '';
  });
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');

  // Selected linked property for owner
  const selectedOwner = useMemo(() => {
    return landlords.find((l) => l.id === selectedOwnerId) || null;
  }, [landlords, selectedOwnerId]);

  const [selectedPropertyId, setSelectedPropertyId] = useState('');

  // Tenant state
  const [tenantMode, setTenantMode] = useState(() => {
    if (prefillClient && prefillClient.role === 'Tenant') return 'existing';
    return tenants.length > 0 ? 'existing' : 'new';
  });
  const [selectedTenantId, setSelectedTenantId] = useState(() => {
    if (prefillClient && prefillClient.role === 'Tenant') return prefillClient.id;
    return tenants.length > 0 ? tenants[0].id : '';
  });
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('');
  const savedDraft = brokerStorage.getDraft('agreement_creation') || {};
  const [coOccupantsText, setCoOccupantsText] = useState(savedDraft.coOccupantsText || '');

  // Property Details & Location Jurisdiction (Separate from Broker Address)
  const [propertyArea, setPropertyArea] = useState(savedDraft.propertyArea || '');
  const [propertyAddress, setPropertyAddress] = useState(savedDraft.propertyAddress || '');
  const [propertyState, setPropertyState] = useState(savedDraft.propertyState || 'Karnataka');
  const [supportedJurisdictions, setSupportedJurisdictions] = useState([
    { code: 'KA', name: 'Karnataka', status: 'active' },
    { code: 'MH', name: 'Maharashtra', status: 'active' },
    { code: 'TG', name: 'Telangana', status: 'active' }
  ]);

  useEffect(() => {
    let mounted = true;
    locationService.getSupportedStates().then((states) => {
      if (mounted && Array.isArray(states) && states.length > 0) {
        setSupportedJurisdictions(states);
        if (!propertyState) setPropertyState(states[0].name);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Autosave non-sensitive draft form data (zd_bd)
  useEffect(() => {
    if (isOpen) {
      brokerStorage.setDraft('agreement_creation', {
        propertyArea,
        propertyAddress,
        propertyState,
        monthlyRent,
        securityDeposit,
        coOccupantsText
      });
    }
  }, [isOpen, propertyArea, propertyAddress, propertyState, monthlyRent, securityDeposit, coOccupantsText]);

  // Financials & Dates
  const [monthlyRent, setMonthlyRent] = useState(savedDraft.monthlyRent || '');
  const [securityDeposit, setSecurityDeposit] = useState(savedDraft.securityDeposit || '');
  const [leaseDuration, setLeaseDuration] = useState('11'); // Months

  // Default start date to 1st of next month
  const [leaseStartDate, setLeaseStartDate] = useState(() => getDefaultStartDate());

  // Validation errors
  const [errors, setErrors] = useState({});

  // Auto-fill property fields when a linked property is picked
  function handleSelectProperty(propId) {
    setSelectedPropertyId(propId);
    if (!propId || !selectedOwner?.linkedProperties) return;

    const prop = selectedOwner.linkedProperties.find((p) => p.id === propId);
    if (prop) {
      setPropertyArea(prop.propertyArea || '');
      setPropertyAddress(prop.address || '');
      if (prop.monthlyRent) setMonthlyRent(String(prop.monthlyRent));
      if (prop.securityDeposit) setSecurityDeposit(String(prop.securityDeposit));
    }
  }

  // Calculate End Date
  const calculatedEndDate = useMemo(() => {
    if (!leaseStartDate) return '—';
    try {
      const d = new Date(leaseStartDate);
      d.setMonth(d.getMonth() + parseInt(leaseDuration, 10));
      d.setDate(d.getDate() - 1);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '—';
    }
  }, [leaseStartDate, leaseDuration]);

  if (!isOpen) return null;

  // Form Validation
  function validateForm() {
    const newErrors = {};

    // 1. Quota Validation
    if (billingMode === 'plan' && (!isPlanActive || isZeroQuota)) {
      newErrors.billing = 'Cannot use monthly plan quota. Please select Pay-Per-Document or renew your plan.';
    }

    // 2. Owner validation
    if (ownerMode === 'existing') {
      if (!selectedOwnerId) {
        newErrors.owner = 'Please select a Property Owner / Landlord.';
      }
    } else {
      if (!newOwnerName.trim()) {
        newErrors.ownerName = 'Owner / Landlord Name is required.';
      }
      const cleanPhone = newOwnerPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        newErrors.ownerPhone = 'Please enter a valid 10-digit mobile number.';
      }
    }

    // 3. Tenant validation
    if (tenantMode === 'existing') {
      if (!selectedTenantId) {
        newErrors.tenant = 'Please select a Tenant.';
      }
    } else {
      if (!newTenantName.trim()) {
        newErrors.tenantName = 'Tenant / Party Name is required.';
      }
      const cleanPhone = newTenantPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        newErrors.tenantPhone = 'Please enter a valid 10-digit mobile number.';
      }
    }

    // 4. Property Area, Address, and Jurisdiction State
    if (!propertyArea.trim()) {
      newErrors.propertyArea = 'Property Area / Locality is required (e.g., Indiranagar, Bengaluru).';
    }
    if (!propertyAddress.trim()) {
      newErrors.propertyAddress = 'Full Property Address is required.';
    }
    const allowedJurisdictions = ['karnataka', 'maharashtra', 'telangana'];
    if (!propertyState) {
      newErrors.propertyState = 'Agreement jurisdiction state is required.';
    } else if (!allowedJurisdictions.includes(propertyState.toLowerCase())) {
      newErrors.propertyState = 'Only Karnataka, Maharashtra, and Telangana jurisdictions are supported.';
    }

    // 5. Rent & Deposit
    const rentNum = Number(monthlyRent);
    if (!monthlyRent || isNaN(rentNum) || rentNum <= 0) {
      newErrors.monthlyRent = 'Please enter a valid monthly rent amount.';
    }
    if (securityDeposit !== '' && (isNaN(Number(securityDeposit)) || Number(securityDeposit) < 0)) {
      newErrors.securityDeposit = 'Security deposit must be a valid positive amount.';
    }

    // 6. Start date
    if (!leaseStartDate) {
      newErrors.leaseStartDate = 'Please select a lease start date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle Form Submit
  function handleCreateAgreement(e) {
    e.preventDefault();
    if (!validateForm()) return;

    // Resolve Owner info
    let finalOwnerName = '';
    let finalOwnerPhone = '';
    if (ownerMode === 'existing') {
      const o = landlords.find((l) => l.id === selectedOwnerId);
      finalOwnerName = o ? o.name : 'Owner';
      finalOwnerPhone = o ? o.phone : '+91 98000 00000';
    } else {
      finalOwnerName = newOwnerName.trim();
      const rawDigits = newOwnerPhone.replace(/\D/g, '').slice(-10);
      finalOwnerPhone = `+91 ${rawDigits.slice(0, 5)} ${rawDigits.slice(5)}`;

      // Save new landlord client to Vault
      const newLandlordClient = {
        id: `CLI-BLR-${Math.floor(1000 + Math.random() * 9000)}`,
        brokerId,
        name: finalOwnerName,
        role: 'Landlord / Owner',
        phone: finalOwnerPhone,
        maskedAadhaar: 'XXXX-XXXX-0000',
        permanentAddress: newOwnerAddress.trim() || propertyAddress.trim(),
        linkedProperties: [
          {
            id: `PROP-BLR-${Math.floor(10 + Math.random() * 90)}`,
            propertyArea: propertyArea.trim(),
            address: propertyAddress.trim(),
            monthlyRent: Number(monthlyRent),
            securityDeposit: Number(securityDeposit) || 0,
            status: 'Vacant'
          }
        ]
      };
      saveClients([newLandlordClient, ...brokerClients], brokerId);
    }

    // Resolve Tenant info
    let finalTenantName = '';
    let finalTenantPhone = '';
    if (tenantMode === 'existing') {
      const t = tenants.find((item) => item.id === selectedTenantId);
      finalTenantName = t ? t.name : 'Tenant';
      finalTenantPhone = t ? t.phone : '+91 98000 00000';
    } else {
      finalTenantName = newTenantName.trim();
      const rawDigits = newTenantPhone.replace(/\D/g, '').slice(-10);
      finalTenantPhone = `+91 ${rawDigits.slice(0, 5)} ${rawDigits.slice(5)}`;

      // Save new tenant client to Vault
      const newTenantClient = {
        id: `CLI-BLR-${Math.floor(1000 + Math.random() * 9000)}`,
        brokerId,
        name: finalTenantName,
        role: 'Tenant',
        phone: finalTenantPhone,
        maskedAadhaar: 'XXXX-XXXX-0000',
        permanentAddress: propertyAddress.trim(),
        linkedProperties: []
      };
      saveClients([newTenantClient, ...brokerClients], brokerId);
    }

    // Parse Co-occupants
    const coOccupantsList = coOccupantsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Calculate actual ISO end date string for storage
    let calculatedIsoEndDate = '';
    try {
      const d = new Date(leaseStartDate);
      d.setMonth(d.getMonth() + parseInt(leaseDuration, 10));
      d.setDate(d.getDate() - 1);
      calculatedIsoEndDate = d.toISOString().split('T')[0];
    } catch {
      calculatedIsoEndDate = leaseStartDate;
    }

    // Generate unique draft agreement ID
    const newId = `ZD-${new Date().getFullYear()}-BLR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAgreement = {
      id: newId,
      brokerId: brokerId,
      isSample: false,
      sha256Hash: `usr_${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 14)}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      agreementType,
      tenantName: finalTenantName,
      tenantPhone: finalTenantPhone,
      coOccupants: coOccupantsList,
      ownerName: finalOwnerName,
      ownerPhone: finalOwnerPhone,
      propertyArea: propertyArea.trim(),
      propertyAddress: propertyAddress.trim(),
      propertyState: propertyState,
      state: propertyState,
      jurisdiction: propertyState,
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit) || 0,
      leaseStartDate: leaseStartDate,
      leaseEndDate: calculatedIsoEndDate,
      status: 'Pending e-Sign',
      eStampIssued: true,
      eStampNumber: `IN-KA${Math.floor(100000000000 + Math.random() * 900000000000)}R`,
      tenantSigned: false,
      ownerSigned: false,
      eSignLink: `https://zapdocs.mock/esign/${newId}`,
      billingTier: billingMode === 'plan' ? 'Active Plan Quota' : 'Pay-Per-Document (₹99)'
    };

    // Save into broker-scoped session storage
    const currentAgreements = getAgreements(brokerId);
    const updatedAgreements = [newAgreement, ...currentAgreements];
    saveAgreements(brokerId, updatedAgreements);

    // Clear persisted draft
    brokerStorage.clearDraft('agreement_creation');

    // Call success handler if provided
    if (onSuccess) {
      onSuccess(newAgreement);
    }

    // Close modal and navigate immediately to agreements screen
    onClose();
    if (onNavigate) {
      onNavigate('agreements');
    }
  }

  return (
    <div className="zd-agreement-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="zd-agreement-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="zd-agreement-modal-header">
          <div className="zd-agreement-modal-title-group">
            <span className="zd-agreement-modal-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>{isOther ? 'Other Legal Agreements' : 'Residential & Commercial Rental'}</span>
            </span>
            <h2 className="zd-agreement-modal-title">
              {isOther ? 'Generate Other Agreement' : 'Generate Rental Agreement'}
            </h2>
            <p className="zd-agreement-modal-subtitle">
              Draft, e-stamp, and dispatch digital signature links to all executing parties.
            </p>
          </div>
          <button
            type="button"
            className="zd-agreement-modal-close-btn"
            onClick={onClose}
            aria-label="Close agreement creation modal"
          >
            ✓
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleCreateAgreement} className="zd-agreement-modal-body">
          {/* 1. Subscription & Quota Status Indicator */}
          {isPlanActive && !isZeroQuota && (
            <div className="zd-agreement-quota-banner zd-agreement-quota-banner--plan">
              <div className="zd-quota-banner-head">
                <span className="zd-quota-banner-title">
                  <Badge variant="success" size="sm">Active Plan Quota</Badge>
                  <span>Included in Professional Plan</span>
                </span>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  {remainingQuota} Docs Remaining
                </span>
              </div>
              <p className="zd-quota-banner-desc">
                Generating this agreement will debit 1 document credit from your active monthly quota. No payment required.
              </p>
            </div>
          )}

          {isPlanActive && isZeroQuota && (
            <div className="zd-agreement-quota-banner zd-agreement-quota-banner--danger">
              <div className="zd-quota-banner-head">
                <span className="zd-quota-banner-title">
                  <Badge variant="danger" size="sm">Monthly Quota Exhausted</Badge>
                  <span>0 Documents Remaining</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('billing');
                  }}
                >
                  Top-Up in Billing
                </Button>
              </div>
              <p className="zd-quota-banner-desc">
                Your monthly plan quota is fully utilized. To draft this agreement, proceed using the ₹99 pay-per-document tier (prototype billing simulation).
              </p>
              <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="billingChoice"
                    checked={billingMode === 'pay-per-doc'}
                    onChange={() => setBillingMode('pay-per-doc')}
                  />
                  <span>Proceed with <strong>Pay-Per-Document (₹99 / Doc)</strong></span>
                </label>
              </div>
            </div>
          )}

          {isExpired && (
            <div className="zd-agreement-quota-banner zd-agreement-quota-banner--warning">
              <div className="zd-quota-banner-head">
                <span className="zd-quota-banner-title">
                  <Badge variant="warning" size="sm">Plan Expired</Badge>
                  <span>Quota Inactive</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('billing');
                  }}
                >
                  Renew Plan
                </Button>
              </div>
              <p className="zd-quota-banner-desc">
                Your monthly subscription has expired. You can renew your subscription or proceed with Pay-Per-Document at ₹99 per agreement.
              </p>
              <div style={{ marginTop: '4px' }}>
                <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="billingChoice"
                    checked={billingMode === 'pay-per-doc'}
                    onChange={() => setBillingMode('pay-per-doc')}
                  />
                  <span>Proceed with <strong>Pay-Per-Document (₹99)</strong></span>
                </label>
              </div>
            </div>
          )}

          {isNoPlan && (
            <div className="zd-agreement-quota-banner zd-agreement-quota-banner--payperdoc">
              <div className="zd-quota-banner-head">
                <span className="zd-quota-banner-title">
                  <Badge variant="neutral" size="sm">Pay-Per-Document Tier</Badge>
                  <span>Standard Rate: ₹99 / Agreement</span>
                </span>
              </div>
              <p className="zd-quota-banner-desc">
                No active monthly commitment. Instant e-Stamp and digital signature generation are billed on demand (prototype simulation — no real payment charged).
              </p>
            </div>
          )}

          {errors.billing && <div className="zd-form-error-msg">{errors.billing}</div>}

          {/* 2. Agreement Type Selector */}
          {/* <div className="zd-form-group">
            <label className="zd-form-label" htmlFor="zd-ag-type">
              Agreement Type <span className="zd-form-label-required">*</span>
            </label>
            <select
              id="zd-ag-type"
              className="zd-form-select"
              value={agreementType}
              onChange={(e) => setAgreementType(e.target.value)}
            >
              {(isOther ? OTHER_TYPES : RENTAL_TYPES).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div> */}

          {/* 3. Section: Property Owner / Landlord */}
          <div className="zd-client-picker-card">
            <div className="zd-client-picker-head">
              <span className="zd-form-section-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                Party 1: Property Owner / Landlord
              </span>
              <button
                type="button"
                className="zd-client-mode-btn"
                onClick={() => setOwnerMode(ownerMode === 'existing' ? 'new' : 'existing')}
              >
                {ownerMode === 'existing' ? '+ Add New Owner' : '← Select from Vault'}
              </button>
            </div>

            {ownerMode === 'existing' ? (
              <div className="zd-form-group">
                <label className="zd-form-label" htmlFor="zd-owner-select">
                  Select Landlord from Clients Vault
                </label>
                {landlords.length > 0 ? (
                  <select
                    id="zd-owner-select"
                    className={`zd-form-select ${errors.owner ? 'zd-form-select--error' : ''}`}
                    value={selectedOwnerId}
                    onChange={(e) => {
                      setSelectedOwnerId(e.target.value);
                      setSelectedPropertyId('');
                    }}
                  >
                    {landlords.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.phone})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--zd-text-secondary)', padding: '8px 0' }}>
                    No landlords saved in Clients Vault yet.{' '}
                    <button
                      type="button"
                      className="zd-client-mode-btn"
                      onClick={() => setOwnerMode('new')}
                    >
                      Enter owner details manually
                    </button>
                  </div>
                )}
                {errors.owner && <span className="zd-form-error-msg">{errors.owner}</span>}

                {/* If owner has linked properties, offer quick selection */}
                {selectedOwner && selectedOwner.linkedProperties && selectedOwner.linkedProperties.length > 0 && (
                  <div className="zd-form-group" style={{ marginTop: '8px' }}>
                    <label className="zd-form-label" htmlFor="zd-linked-prop-select">
                      Auto-fill from Owner&apos;s Linked Property Assets
                      <span className="zd-form-label-subtext">Optional</span>
                    </label>
                    <select
                      id="zd-linked-prop-select"
                      className="zd-form-select"
                      value={selectedPropertyId}
                      onChange={(e) => handleSelectProperty(e.target.value)}
                    >
                      <option value="">-- Choose a property to auto-fill address &amp; rent --</option>
                      {selectedOwner.linkedProperties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.propertyArea} — {p.address.slice(0, 35)}... (₹{p.monthlyRent?.toLocaleString('en-IN')}/mo)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="zd-form-row">
                  <div className="zd-form-group">
                    <label className="zd-form-label" htmlFor="zd-new-owner-name">
                      Owner Full Name <span className="zd-form-label-required">*</span>
                    </label>
                    <input
                      id="zd-new-owner-name"
                      type="text"
                      className={`zd-form-input ${errors.ownerName ? 'zd-form-input--error' : ''}`}
                      placeholder="e.g. Suresh Kumar Hegde"
                      value={newOwnerName}
                      onChange={(e) => setNewOwnerName(e.target.value)}
                    />
                    {errors.ownerName && <span className="zd-form-error-msg">{errors.ownerName}</span>}
                  </div>

                  <div className="zd-form-group">
                    <label className="zd-form-label" htmlFor="zd-new-owner-phone">
                      Mobile Number <span className="zd-form-label-required">*</span>
                    </label>
                    <input
                      id="zd-new-owner-phone"
                      type="tel"
                      className={`zd-form-input ${errors.ownerPhone ? 'zd-form-input--error' : ''}`}
                      placeholder="e.g. 9811122334"
                      value={newOwnerPhone}
                      onChange={(e) => setNewOwnerPhone(e.target.value)}
                    />
                    {errors.ownerPhone && <span className="zd-form-error-msg">{errors.ownerPhone}</span>}
                  </div>
                </div>

                <div className="zd-form-group">
                  <label className="zd-form-label" htmlFor="zd-new-owner-addr">
                    Permanent Address
                    <span className="zd-form-label-subtext">Will be saved to Clients Vault</span>
                  </label>
                  <input
                    id="zd-new-owner-addr"
                    type="text"
                    className="zd-form-input"
                    placeholder="e.g. No. 42, Sri Rama Nilaya, 3rd Main, Bengaluru"
                    value={newOwnerAddress}
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Section: Tenant / Second Party */}
          <div className="zd-client-picker-card">
            <div className="zd-client-picker-head">
              <span className="zd-form-section-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                Party 2: Primary Tenant
              </span>
              <button
                type="button"
                className="zd-client-mode-btn"
                onClick={() => setTenantMode(tenantMode === 'existing' ? 'new' : 'existing')}
              >
                {tenantMode === 'existing' ? '+ Add New Tenant' : '← Select from Vault'}
              </button>
            </div>

            {tenantMode === 'existing' ? (
              <div className="zd-form-group">
                <label className="zd-form-label" htmlFor="zd-tenant-select">
                  Select Tenant from Clients Vault
                </label>
                {tenants.length > 0 ? (
                  <select
                    id="zd-tenant-select"
                    className={`zd-form-select ${errors.tenant ? 'zd-form-select--error' : ''}`}
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.phone})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--zd-text-secondary)', padding: '8px 0' }}>
                    No tenants saved in Clients Vault yet.{' '}
                    <button
                      type="button"
                      className="zd-client-mode-btn"
                      onClick={() => setTenantMode('new')}
                    >
                      Enter tenant details manually
                    </button>
                  </div>
                )}
                {errors.tenant && <span className="zd-form-error-msg">{errors.tenant}</span>}
              </div>
            ) : (
              <div className="zd-form-row">
                <div className="zd-form-group">
                  <label className="zd-form-label" htmlFor="zd-new-tenant-name">
                    Tenant Full Name <span className="zd-form-label-required">*</span>
                  </label>
                  <input
                    id="zd-new-tenant-name"
                    type="text"
                    className={`zd-form-input ${errors.tenantName ? 'zd-form-input--error' : ''}`}
                    placeholder="e.g. Rahul Verma"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                  />
                  {errors.tenantName && <span className="zd-form-error-msg">{errors.tenantName}</span>}
                </div>

                <div className="zd-form-group">
                  <label className="zd-form-label" htmlFor="zd-new-tenant-phone">
                    Mobile Number <span className="zd-form-label-required">*</span>
                  </label>
                  <input
                    id="zd-new-tenant-phone"
                    type="tel"
                    className={`zd-form-input ${errors.tenantPhone ? 'zd-form-input--error' : ''}`}
                    placeholder="e.g. 9876543210"
                    value={newTenantPhone}
                    onChange={(e) => setNewTenantPhone(e.target.value)}
                  />
                  {errors.tenantPhone && <span className="zd-form-error-msg">{errors.tenantPhone}</span>}
                </div>
              </div>
            )}

            {/* Co-occupants field */}
            <div className="zd-form-group" style={{ marginTop: '4px' }}>
              <label className="zd-form-label" htmlFor="zd-co-occupants">
                Co-Occupants
                <span className="zd-form-label-subtext">Optional (comma separated)</span>
              </label>
              <input
                id="zd-co-occupants"
                type="text"
                className="zd-form-input"
                placeholder="e.g. Pooja Verma (Spouse), Aarav Verma (Child)"
                value={coOccupantsText}
                onChange={(e) => setCoOccupantsText(e.target.value)}
              />
              <span style={{ fontSize: '11px', color: 'var(--zd-text-muted)' }}>
                Recorded under lease occupancy covenants. e-Sign links are dispatched exclusively to the primary tenant.
              </span>
            </div>
          </div>

          {/* 5. Property Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="zd-form-section-title">Property Details</span>

            <div className="zd-form-group">
              <label className="zd-form-label" htmlFor="zd-prop-area">
                Property Area / Locality <span className="zd-form-label-required">*</span>
              </label>
              <input
                id="zd-prop-area"
                type="text"
                className={`zd-form-input ${errors.propertyArea ? 'zd-form-input--error' : ''}`}
                placeholder="e.g. Indiranagar, Bengaluru"
                value={propertyArea}
                onChange={(e) => setPropertyArea(e.target.value)}
              />
              {errors.propertyArea && <span className="zd-form-error-msg">{errors.propertyArea}</span>}
            </div>

            <div className="zd-form-group">
              <label className="zd-form-label" htmlFor="zd-prop-address">
                Full Property Address <span className="zd-form-label-required">*</span>
              </label>
              <textarea
                id="zd-prop-address"
                rows={2}
                className={`zd-form-textarea ${errors.propertyAddress ? 'zd-form-textarea--error' : ''}`}
                placeholder="e.g. Flat 402, Shanti Vihar, 12th Main, Indiranagar, Bengaluru - 560038"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
              />
              {errors.propertyAddress && <span className="zd-form-error-msg">{errors.propertyAddress}</span>}
            </div>

            <div className="zd-form-group">
              <label className="zd-form-label" htmlFor="zd-prop-state">
                Property / Agreement State (Jurisdiction) <span className="zd-form-label-required">*</span>
                <span className="zd-form-label-subtext">Determines applicable template clauses &amp; stamp duty</span>
              </label>
              <select
                id="zd-prop-state"
                className={`zd-form-select ${errors.propertyState ? 'zd-form-select--error' : ''}`}
                value={propertyState}
                onChange={(e) => setPropertyState(e.target.value)}
              >
                {supportedJurisdictions.map((s) => (
                  <option key={s.code || s.name} value={s.name}>
                    {s.name} {s.status === 'active' ? '(Active - Phase 1)' : ''}
                  </option>
                ))}
              </select>
              {errors.propertyState && <span className="zd-form-error-msg">{errors.propertyState}</span>}
              <span style={{ fontSize: '11.5px', color: 'var(--zd-text-muted)', marginTop: '4px', display: 'block' }}>
                State jurisdiction is validated by backend APIs and kept separate from broker&apos;s registered address. Supported jurisdictions: Karnataka, Maharashtra, and Telangana.
              </span>
            </div>
          </div>

          {/* 6. Financials & Duration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="zd-form-section-title">Financial Terms &amp; Lease Timeline</span>

            <div className="zd-form-row">
              <div className="zd-form-group">
                <label className="zd-form-label" htmlFor="zd-rent">
                  Monthly Rent (₹) <span className="zd-form-label-required">*</span>
                </label>
                <input
                  id="zd-rent"
                  type="number"
                  min="1"
                  step="500"
                  className={`zd-form-input ${errors.monthlyRent ? 'zd-form-input--error' : ''}`}
                  placeholder="e.g. 38000"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                />
                {errors.monthlyRent && <span className="zd-form-error-msg">{errors.monthlyRent}</span>}
              </div>

              <div className="zd-form-group">
                <label className="zd-form-label" htmlFor="zd-deposit">
                  Security Deposit (₹)
                </label>
                <input
                  id="zd-deposit"
                  type="number"
                  min="0"
                  step="1000"
                  className={`zd-form-input ${errors.securityDeposit ? 'zd-form-input--error' : ''}`}
                  placeholder="e.g. 190000"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                />
                {errors.securityDeposit && <span className="zd-form-error-msg">{errors.securityDeposit}</span>}
              </div>
            </div>

            <div className="zd-form-row">
              <div className="zd-form-group">
                <label className="zd-form-label" htmlFor="zd-start-date">
                  Lease Start Date <span className="zd-form-label-required">*</span>
                </label>
                <input
                  id="zd-start-date"
                  type="date"
                  className={`zd-form-input ${errors.leaseStartDate ? 'zd-form-input--error' : ''}`}
                  value={leaseStartDate}
                  onChange={(e) => setLeaseStartDate(e.target.value)}
                />
                {errors.leaseStartDate && <span className="zd-form-error-msg">{errors.leaseStartDate}</span>}
              </div>

              <div className="zd-form-group">
                <label className="zd-form-label" htmlFor="zd-duration">
                  Agreement Duration
                </label>
                <select
                  id="zd-duration"
                  className="zd-form-select"
                  value={leaseDuration}
                  onChange={(e) => setLeaseDuration(e.target.value)}
                >
                  <option value="11">11 Months (Standard)</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                </select>
              </div>
            </div>

            {/* Calculated Preview Box */}
            <div className="zd-agreement-preview-box">
              <div className="zd-preview-item">
                <span className="zd-preview-item__label">Calculated Lease End Date</span>
                <span className="zd-preview-item__val">{calculatedEndDate}</span>
              </div>
              <div className="zd-preview-item">
                <span className="zd-preview-item__label">e-Stamp Duty Status</span>
                <span className="zd-preview-item__val" style={{ color: 'var(--zd-color-success)' }}>
                  State-Compliant (NeSL/IGR)
                </span>
              </div>
              <div className="zd-preview-item">
                <span className="zd-preview-item__label">Signature Method</span>
                <span className="zd-preview-item__val">Aadhaar OTP e-Sign</span>
              </div>
              <div className="zd-preview-item">
                <span className="zd-preview-item__label">Evidentiary Compliance</span>
                <span className="zd-preview-item__val">Section 63 BSA, 2023</span>
              </div>
            </div>
          </div>

          {/* Prototype Disclosure */}
          <div className="zd-agreement-disclaimer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <strong>Prototype Demonstration:</strong> This workflow demonstrates agreement creation, client linkage, and data persistence in your broker account. In accordance with platform guidelines, no actual financial charge, legal drafting binding, or live Aadhaar signature is executed.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="zd-agreement-modal-footer">
            <Button variant="ghost" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>

            <Button variant="primary" size="md" type="submit">
              {isPlanActive && !isZeroQuota
                ? 'Create & Debit 1 Plan Quota'
                : 'Create Draft Agreement (₹99)'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
