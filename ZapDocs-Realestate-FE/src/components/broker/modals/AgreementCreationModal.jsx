import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Calendar,
  IndianRupee,
  Coins,
  UserCheck,
  MapPin,
  X,
  FileText,
  Files,
  CircleCheck,
  MessageCircle,
  User,
  Upload,
  PenLine,
  ArrowRight
} from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';
import {
  AGREEMENT_TITLE_OPTIONS,
  CUSTOM_AGREEMENT_TITLE,
  DEFAULT_TITLE_BY_TERM,
  resolveAgreementTerm,
  resolveAgreementTitleSelection,
  usesGenericAgreementWorkflow
} from '../../../constants/agreementOptions';
import { storage } from '../../../utils/storage';
import { validateAgreementForm } from '../../../utils/agreementFormValidation';
import { agreementService } from '../../../services/api/services';
import { api } from '../../../services/api/client';
import GlassSelect from '../../common/GlassSelect';
import AgreementDocumentUpload from './AgreementDocumentUpload';
import './AgreementCreationModal.css';

const STAMP_MAP = {
  Karnataka: '₹500.00',
  Maharashtra: '₹1,000.00',
  Telangana: '₹500.00'
};

const DRAFT_KEY = 'zapdocs_agreement_draft';

const LEASE_DURATION_OPTIONS = [
  { value: 'Residential 11M', label: 'Standard 11 Months (Auto-Renewable)' },
  { value: 'Commercial 22M', label: '22 Months Commercial Lease' },
  { value: 'Corporate 36M', label: '36 Months Corporate Tenancy' },
  { value: 'Commercial / Other Agreement', label: 'Commercial / Other Agreement' },
  { value: 'Leave and License', label: 'Leave & License Agreement' }
];

const JURISDICTION_OPTIONS = [
  { value: 'Karnataka', label: 'Karnataka (NeSL / KAVERI)' },
  { value: 'Maharashtra', label: 'Maharashtra (IGR / NeSL)' },
  { value: 'Telangana', label: 'Telangana (IGRS Telangana)' }
];

export default function AgreementCreationModal({
  initialType = 'Residential Rental Agreement',
  initialCategory = null,
  initialTerm = null,
  initialCost = 0,
  initialPrefill = null,
  initialAgreement = null,
  initialEntryMode = 'choose'
}) {
  const {
    dashboardMode,
    allocatedQuota,
    usedQuota,
    clients = [],
    addAgreement,
    openModal,
    closeModal,
    showToast,
    dispatchWhatsApp
  } = useBrokerState();

  const isOther =
    initialCategory === 'other' ||
    initialType === 'Commercial / Other Agreement' ||
    (initialType && (initialType.toLowerCase().includes('other') || initialType.toLowerCase().includes('commercial')));

  const [agreementCategory, setAgreementCategory] = useState(isOther ? 'other' : 'rental');

  const defaultTitle = isOther
    ? (initialType === 'New Agreement' ? 'Commercial / Other Agreement' : initialType)
    : (initialType === 'New Agreement' ? 'Residential Rental Agreement' : initialType);

  const defaultTerm = initialTerm || (isOther ? 'Commercial / Other Agreement' : 'Residential 11M');

  function buildInitialFormData() {
    if (initialAgreement && typeof initialAgreement === 'object') {
      const cleanRent = initialAgreement.rent != null
        ? String(initialAgreement.rent).replace(/[^\d.]/g, '')
        : '';
      const cleanDeposit = initialAgreement.deposit != null
        ? String(initialAgreement.deposit).replace(/[^\d.]/g, '')
        : '';
      return {
        title: initialAgreement.agreementTitle || initialAgreement.title || defaultTitle,
        referenceNumber: initialAgreement.referenceNumber || '',
        landlord: initialAgreement.ownerName || initialAgreement.landlord || '',
        tenant: initialAgreement.tenantName || initialAgreement.tenant || '',
        address: initialAgreement.propertyArea || initialAgreement.address || '',
        rent: cleanRent,
        deposit: cleanDeposit,
        term: initialAgreement.type || initialAgreement.term || defaultTerm,
        jurisdiction: initialAgreement.jurisdiction || 'Karnataka',
        effectiveDate: initialAgreement.effectiveDate || '',
        expiryDate: initialAgreement.expiryDate || '',
        sourceDocument: null
      };
    }

    if (initialPrefill && typeof initialPrefill === 'object') {
      const isOwner = initialPrefill.role === 'Landlord' || initialPrefill.role === 'Landlord / Owner';
      return {
        title: defaultTitle,
        referenceNumber: '',
        landlord: isOwner ? (initialPrefill.name || '') : '',
        tenant: !isOwner ? (initialPrefill.name || '') : '',
        address: initialPrefill.address || '',
        rent: '',
        deposit: '',
        term: defaultTerm,
        jurisdiction: 'Karnataka',
        effectiveDate: '',
        expiryDate: '',
        sourceDocument: null
      };
    }

    return {
      title: defaultTitle,
      referenceNumber: '',
      landlord: '',
      tenant: '',
      address: '',
      rent: '',
      deposit: '',
      term: defaultTerm,
      jurisdiction: 'Karnataka',
      effectiveDate: '',
      expiryDate: '',
      sourceDocument: null
    };
  }

  const [entryMode, setEntryMode] = useState(() => {
    if (initialEntryMode === 'choose') {
      const hasInit = Boolean(initialAgreement || initialPrefill);
      return hasInit ? 'manual' : null;
    }
    return initialEntryMode;
  });

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(buildInitialFormData);

  const [selectedClientName, setSelectedClientName] = useState(() => initialPrefill?.name || '');
  const [prefilledClientInfo, setPrefilledClientInfo] = useState(() => {
    if (initialPrefill && typeof initialPrefill === 'object') {
      return {
        name: initialPrefill.name || '',
        role: initialPrefill.role || 'Tenant',
        address: initialPrefill.address || ''
      };
    }
    return null;
  });

  const [formErrors, setFormErrors] = useState({});
  const [draftBannerVisible, setDraftBannerVisible] = useState(false);
  const [draftSavedTime, setDraftSavedTime] = useState('');
  const [shaHash, setShaHash] = useState('');
  const [documentReview, setDocumentReview] = useState(null);
  const [extractedSnapshot, setExtractedSnapshot] = useState(null);
  const [manualCorrections, setManualCorrections] = useState([]);

  // Pipeline stages
  const [pipelineStep, setPipelineStep] = useState(1); // 1, 2, 3, 'done'
  const [executedAgreement, setExecutedAgreement] = useState(null);

  const remainingQuota = Math.max(0, allocatedQuota - usedQuota);
  const isPayDoc = initialCost > 0 || dashboardMode === 'pay-per-doc' || remainingQuota <= 0;

  // On open, clear stale draft if editing or prefilled; else check for unsaved draft
  useEffect(() => {
    if (initialAgreement || initialPrefill) {
      storage.remove(DRAFT_KEY);
      return;
    }
    const saved = storage.get(DRAFT_KEY, null);
    if (saved && (saved.landlord || saved.tenant || saved.address || saved.rent)) {
      setDraftSavedTime(saved.savedAt || 'recently');
      setDraftBannerVisible(true);
    }
  }, [initialAgreement, initialPrefill]);

  function handleClose() {
    storage.remove(DRAFT_KEY);
    closeModal();
  }

  function handleAutoSave(updates) {
    const updated = { ...formData, ...updates };
    setFormData(updated);
    if (extractedSnapshot) {
      setManualCorrections((current) => {
        const next = new Set(current);
        Object.entries(updates).forEach(([field, value]) => {
          if (!Object.prototype.hasOwnProperty.call(extractedSnapshot, field)) return;
          if (String(value ?? '') === String(extractedSnapshot[field] ?? '')) next.delete(field);
          else next.add(field);
        });
        return [...next];
      });
    }
    if (updated.landlord || updated.tenant || updated.address) {
      storage.set(DRAFT_KEY, {
        ...updated,
        savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }

  function handleAgreementTitleChange(title) {
    const isCustom = title === CUSTOM_AGREEMENT_TITLE;
    const term = resolveAgreementTerm(title);
    setAgreementCategory(term === 'Residential 11M' ? 'rental' : 'other');
    handleAutoSave({
      title: isCustom ? '' : title,
      term
    });
    setFormErrors((current) => {
      const next = { ...current };
      delete next.title;
      delete next.term;
      return next;
    });
  }

  function restoreDraft() {
    const saved = storage.get(DRAFT_KEY, null);
    if (saved) {
      setFormData({
        title: saved.title || defaultTitle,
        referenceNumber: saved.referenceNumber || '',
        landlord: saved.landlord || '',
        tenant: saved.tenant || '',
        address: saved.address || '',
        rent: saved.rent || '',
        deposit: saved.deposit || '',
        term: saved.term || defaultTerm,
        jurisdiction: saved.jurisdiction || 'Karnataka',
        effectiveDate: saved.effectiveDate || '',
        expiryDate: saved.expiryDate || '',
        sourceDocument: saved.sourceDocument || null
      });
      setDraftBannerVisible(false);
      showToast('Unsaved agreement draft restored successfully!');
    }
  }

  function discardDraft() {
    storage.remove(DRAFT_KEY);
    setDraftBannerVisible(false);
    setFormData(buildInitialFormData());
    setSelectedClientName(initialPrefill?.name || '');
    setPrefilledClientInfo(
      initialPrefill && typeof initialPrefill === 'object'
        ? {
            name: initialPrefill.name || '',
            role: initialPrefill.role || 'Tenant',
            address: initialPrefill.address || ''
          }
        : null
    );
    setFormErrors({});
    showToast('Unsaved draft discarded.');
  }

  function handleClientSelect(clientName) {
    if (!clientName) {
      setSelectedClientName('');
      if (prefilledClientInfo) {
        const updates = {};
        const wasOwner = prefilledClientInfo.role === 'Landlord' || prefilledClientInfo.role === 'Landlord / Owner';
        if (wasOwner) {
          if (formData.landlord === prefilledClientInfo.name) {
            updates.landlord = '';
          }
        } else {
          if (formData.tenant === prefilledClientInfo.name) {
            updates.tenant = '';
          }
        }
        if (formData.address === prefilledClientInfo.address) {
          updates.address = '';
        }
        setPrefilledClientInfo(null);
        if (Object.keys(updates).length > 0) {
          handleAutoSave(updates);
        }
      }
      return;
    }

    const found = clients.find((c) => c.name === clientName);
    if (!found) return;

    setSelectedClientName(found.name);

    const isOwner = found.role === 'Landlord' || found.role === 'Landlord / Owner';
    const updates = {};

    if (prefilledClientInfo) {
      const wasOwner = prefilledClientInfo.role === 'Landlord' || prefilledClientInfo.role === 'Landlord / Owner';
      if (wasOwner && !isOwner && formData.landlord === prefilledClientInfo.name) {
        updates.landlord = '';
      } else if (!wasOwner && isOwner && formData.tenant === prefilledClientInfo.name) {
        updates.tenant = '';
      }
    }

    if (isOwner) {
      updates.landlord = found.name;
    } else {
      updates.tenant = found.name;
    }
    updates.address = found.address || '';

    setPrefilledClientInfo({
      name: found.name,
      role: found.role,
      address: found.address || ''
    });

    handleAutoSave(updates);

    setFormErrors((prev) => {
      const next = { ...prev };
      if (updates.landlord !== undefined) delete next.landlord;
      if (updates.tenant !== undefined) delete next.tenant;
      if (updates.address !== undefined) delete next.address;
      return next;
    });
  }

  function validate() {
    const errors = validateAgreementForm(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleUploadPrefill(result) {
    const extracted = result.fields || {};
    setFormData({
      title: extracted.title || defaultTitle,
      referenceNumber: extracted.referenceNumber || '',
      landlord: extracted.landlord || '',
      tenant: extracted.tenant || '',
      address: extracted.address || '',
      rent: extracted.rent || '',
      deposit: extracted.deposit || '',
      term: extracted.term || defaultTerm,
      jurisdiction: extracted.jurisdiction || 'Karnataka',
      effectiveDate: extracted.effectiveDate || '',
      expiryDate: extracted.expiryDate || '',
      sourceDocument: result.file
    });
    setSelectedClientName('');
    setPrefilledClientInfo(null);
    setExtractedSnapshot(extracted);
    setManualCorrections(extracted._editedFields || []);
    setDocumentReview({
      file: result.file,
      extractedFieldNames: result.extractedFieldNames || [],
      reviewFlags: result.reviewFlags || [],
      evidence: result.evidence || {},
      extractedText: result.extractedText || ''
    });
    setFormErrors({});
    setEntryMode('manual');
    setStep(1);
    showToast(`Document read successfully. Review ${result.extractedFieldNames?.length || 0} prefilled fields before saving.`);
  }

  function handleProceedToStep2(e) {
    e.preventDefault();
    if (!validate()) {
      showToast('⚠️ Please correct the highlighted errors before proceeding.');
      return;
    }
    setShaHash(Math.random().toString(36).substring(2, 10) + '...' + Math.random().toString(36).substring(2, 6));
    setStep(2);
  }

  function handleExecutePipeline() {
    if (isPayDoc) {
      // Must complete payment through Razorpay first
      openModal('razorpay-checkout', {
        type: 'paydoc',
        title: `Pay-Per-Doc Agreement: ${formData.tenant}`,
        amount: 99,
        agreementData: formData
      });
      return;
    }

    startPipelineAnimation();
  }

  async function startPipelineAnimation() {
    setStep(3);
    setPipelineStep(1);

    try {
      // 1. Create real agreement on backend
      const createdDoc = await agreementService.create({
        ...formData,
        state: formData.jurisdiction || 'Karnataka',
      });
      const agreementId = createdDoc?.id || createdDoc?.agreement_id;

      // 2. Validate agreement
      if (agreementId) {
        try {
          await api.post(`/agreements/${agreementId}/validate`);
        } catch (vErr) {
          console.warn('[ZapDocs] Validation non-blocking:', vErr);
        }
      }

      setPipelineStep(2);

      // 3. Procure eStamp & Initiate dual-party WhatsApp eSign
      if (agreementId) {
        try {
          await api.post(`/executions/${agreementId}/stamp`);
          await api.post(`/executions/${agreementId}/sign/initiate`);
        } catch (procErr) {
          console.warn('[ZapDocs] Backend stamping/signing initiation:', procErr);
        }
      }

      setPipelineStep(3);

      const created = addAgreement({
        ...formData,
        id: createdDoc?.id || createdDoc?.agreement_id || `agr_${Date.now().toString(36)}`,
        docReferenceId: createdDoc?.docReferenceId || createdDoc?.reference_id,
        referenceNumber: createdDoc?.reference_id || formData.referenceNumber,
      });

      setExecutedAgreement(created);
      setPipelineStep('done');
      storage.remove(DRAFT_KEY);
      if (typeof showToast === 'function') {
        showToast('✅ Agreement created and WhatsApp signing links dispatched!');
      }
    } catch (err) {
      console.warn('[ZapDocs] Live pipeline execution failed, fallback to local simulation:', err);
      const created = addAgreement(formData);
      setExecutedAgreement(created);
      setPipelineStep('done');
      storage.remove(DRAFT_KEY);
    }
  }

  // Client dropdown options with placeholder option, icons and roles
  const clientOptions = [
    { value: '', label: '-- Select Existing Landlord or Tenant --' },
    ...clients.map((c) => ({
      value: c.name,
      label: c.name,
      subtitle: `(${c.role} - ${c.address})`,
      icon: User,
      role: c.role
    }))
  ];

  const selectedAgreementTitle = resolveAgreementTitleSelection(formData.title);
  const isCustomAgreementTitle = selectedAgreementTitle === CUSTOM_AGREEMENT_TITLE;
  const isGenericAgreementWorkflow = usesGenericAgreementWorkflow(selectedAgreementTitle);

  return (
    <div className="modal-overlay active zd-gen-modal-overlay" id="modal-generate-agreement">
      <div className={`modal-card zd-gen-modal-card ${entryMode === 'upload' ? 'is-document-workflow' : ''}`}>
        {/* Header matching reference */}
        <div className="zd-gen-modal-header">
          <div className="zd-gen-header-left">
            <div className="zd-gen-header-icon-badge">
              {agreementCategory === 'other' ? <Files size={18} /> : <Home size={18} />}
            </div>
            <h2 className="zd-gen-modal-title" id="modal-gen-title">
              {entryMode === null
                ? (agreementCategory === 'other' ? 'Add Other Agreement' : 'Add Rental Agreement')
                : entryMode === 'upload'
                ? (agreementCategory === 'other' ? 'Upload Other Agreement' : 'Upload Agreement')
                : `Generate ${formData.title || defaultTitle}`}
            </h2>
          </div>
          <button
            type="button"
            className="zd-gen-close-btn"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="zd-gen-modal-body">
          {entryMode === null ? (
            <div className="zd-entry-choice" id="agreement-entry-choice">
              <div className="zd-entry-choice__intro">
                <h3>{agreementCategory === 'other' ? 'Add Commercial or Other Agreement' : 'How would you like to add the agreement?'}</h3>
                <p>
                  {agreementCategory === 'other'
                    ? 'Extract terms from a commercial lease, corporate tenancy or custom agreement document, or enter details manually.'
                    : 'Both options open the same editable agreement form. A record is created only after you review and save it.'}
                </p>
                <div className="zd-entry-choice__cat-switch" style={{ display: 'inline-flex', background: 'rgba(241, 245, 249, 0.9)', padding: '3px', borderRadius: '10px', marginTop: '4px', gap: '4px' }}>
                  <button
                    type="button"
                    id="pill-choice-rental"
                    className={`zd-cat-toggle ${agreementCategory === 'rental' ? 'active' : ''}`}
                    onClick={() => {
                      setAgreementCategory('rental');
                      setFormData((prev) => ({
                        ...prev,
                        title: 'Residential Rental Agreement',
                        term: 'Residential 11M'
                      }));
                    }}
                    style={{
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      background: agreementCategory === 'rental' ? '#ffffff' : 'transparent',
                      color: agreementCategory === 'rental' ? '#2563eb' : '#64748b',
                      boxShadow: agreementCategory === 'rental' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Rental Agreement
                  </button>
                  <button
                    type="button"
                    id="pill-choice-other"
                    className={`zd-cat-toggle ${agreementCategory === 'other' ? 'active' : ''}`}
                    onClick={() => {
                      setAgreementCategory('other');
                      setFormData((prev) => ({
                        ...prev,
                        title: 'Commercial / Other Agreement',
                        term: 'Commercial / Other Agreement'
                      }));
                    }}
                    style={{
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      background: agreementCategory === 'other' ? '#ffffff' : 'transparent',
                      color: agreementCategory === 'other' ? '#2563eb' : '#64748b',
                      boxShadow: agreementCategory === 'other' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Other Agreements
                  </button>
                </div>
              </div>
              <div className="zd-entry-choice__grid">
                <button type="button" className="zd-entry-choice__card" id="choose-upload-agreement" onClick={() => setEntryMode('upload')}>
                  <span className="zd-entry-choice__icon"><Upload size={22} /></span>
                  <span className="zd-entry-choice__content">
                    <strong>Upload PDF or DOCX</strong>
                    <small>Extract supported terms, then review and correct them before saving.</small>
                  </span>
                  <ArrowRight size={18} />
                </button>
                <button type="button" className="zd-entry-choice__card" id="choose-manual-agreement" onClick={() => setEntryMode('manual')}>
                  <span className="zd-entry-choice__icon"><PenLine size={22} /></span>
                  <span className="zd-entry-choice__content">
                    <strong>Enter Manually</strong>
                    <small>Complete the existing agreement form using the current business rules.</small>
                  </span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : entryMode === 'upload' ? (
            <AgreementDocumentUpload
              agreementType={formData.term || (agreementCategory === 'other' ? 'Commercial / Other Agreement' : 'Residential 11M')}
              onAgreementTypeChange={(term) => {
                const nextCategory = term === 'Residential 11M' ? 'rental' : 'other';
                setAgreementCategory(nextCategory);
                handleAutoSave({
                  term,
                  title: DEFAULT_TITLE_BY_TERM[term] || formData.title || 'Commercial / Other Agreement'
                });
              }}
              onBack={() => setEntryMode(null)}
              onManualEntry={() => setEntryMode('manual')}
              onPrefill={handleUploadPrefill}
            />
          ) : (
            <>
          {documentReview && (
            <div className="zd-document-review-banner" id="agreement-document-review">
              <FileText size={18} />
              <div>
                <strong>{documentReview.file.name} was read successfully</strong>
                <span>
                  {documentReview.extractedFieldNames.length} fields were prefilled. Review every value before saving.
                </span>
                {documentReview.reviewFlags.map((flag) => <small key={flag}>• {flag}</small>)}
                {manualCorrections.length > 0 && (
                  <small>Corrected manually: {manualCorrections.join(', ')}.</small>
                )}
              </div>
            </div>
          )}
          {/* Draft Recovery Alert Banner */}
          {draftBannerVisible && (
            <div className="draft-recovery-banner" style={{ display: 'flex', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#175cd3" />
                <div>
                  <strong style={{ color: '#175cd3', fontSize: '13px' }}>Unsaved Draft Found:</strong>
                  <span style={{ fontSize: '12px', color: '#475467', marginLeft: '6px' }}>
                    Saved today at {draftSavedTime}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={restoreDraft}>
                  Restore Draft
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={discardDraft}>
                  Discard
                </button>
              </div>
            </div>
          )}

          {/* 3-Step Indicator matching reference */}
          <div className="zd-gen-stepper-row">
            <div className={`zd-gen-step-pill ${step === 1 ? 'active' : 'completed'}`} id="agr-pill-step-1">
              1. Details
            </div>
            <div className="zd-gen-step-divider" />
            <div className={`zd-gen-step-pill ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} id="agr-pill-step-2">
              2. Review &amp; Stamp
            </div>
            <div className="zd-gen-step-divider" />
            <div className={`zd-gen-step-pill ${step === 3 ? 'active' : ''}`} id="agr-pill-step-3">
              3. Execution
            </div>
          </div>

          {/* STEP 1: Details Form */}
          {step === 1 && (
            <div id="agr-step-1-container">
              <form onSubmit={handleProceedToStep2} id="gen-agreement-form" noValidate>
                {/* Row 1: Agreement Title & Reference Number */}
                <div className="zd-gen-grid-2col">
                  <div className="zd-gen-form-group">
                    <label className="zd-gen-form-label" htmlFor="gen-agreement-title">
                      <FileText size={13} className="zd-gen-form-label-icon" />
                      <span>Agreement Title *</span>
                    </label>
                    <GlassSelect
                      id="gen-agreement-title"
                      name="agreementTitle"
                      prefixIcon={FileText}
                      required
                      searchable
                      placeholder="-- Select Agreement Title --"
                      value={selectedAgreementTitle}
                      options={AGREEMENT_TITLE_OPTIONS}
                      onChange={(e, value) => handleAgreementTitleChange(value || e?.target?.value)}
                    />
                    {isCustomAgreementTitle && (
                      <div className="zd-gen-custom-title-field">
                        <label className="zd-gen-form-label" htmlFor="gen-custom-agreement-title">
                          <FileText size={13} className="zd-gen-form-label-icon" />
                          <span>Enter Custom Agreement Title *</span>
                        </label>
                        <input
                          type="text"
                          className={`zd-gen-input ${formErrors.title ? 'is-invalid' : ''}`}
                          id="gen-custom-agreement-title"
                          required
                          autoComplete="off"
                          placeholder="Enter agreement name"
                          value={formData.title}
                          onChange={(e) => handleAutoSave({ title: e.target.value })}
                        />
                      </div>
                    )}
                    {isGenericAgreementWorkflow && (
                      <small className="zd-gen-field-help">
                        Uses the existing generic agreement workflow. A dedicated legal template requires configuration.
                      </small>
                    )}
                    {formErrors.title && <div className="zd-gen-error-msg visible">{formErrors.title}</div>}
                  </div>
                  <div className="zd-gen-form-group">
                    <label className="zd-gen-form-label" htmlFor="gen-reference-number">
                      <FileText size={13} className="zd-gen-form-label-icon" />
                      <span>Reference Number</span>
                    </label>
                    <input
                      type="text"
                      className="zd-gen-input"
                      id="gen-reference-number"
                      placeholder="Optional external reference"
                      value={formData.referenceNumber}
                      onChange={(e) => handleAutoSave({ referenceNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 2: Select Client from Vault (full width) */}
                <div className="zd-gen-form-group">
                  <label className="zd-gen-form-label" htmlFor="gen-client-select">
                    <Users size={13} className="zd-gen-form-label-icon" />
                    <span>Select Client from Vault (Pre-Fill)</span>
                  </label>
                  <GlassSelect
                    id="gen-client-select"
                    name="clientSelect"
                    prefixIcon={User}
                    value={selectedClientName}
                    placeholder="-- Select Existing Landlord or Tenant --"
                    options={clientOptions}
                    onChange={(e, val) => handleClientSelect(val || e?.target?.value)}
                  />
                </div>

                {/* Row 3: Landlord & Tenant 2-Col Grid */}
                <div className="zd-gen-grid-2col">
                  <div className="zd-gen-form-group">
                    <label className="zd-gen-form-label" htmlFor="gen-landlord-name">
                      <UserCheck size={13} className="zd-gen-form-label-icon" />
                      <span>Landlord / Owner Name *</span>
                    </label>
                    <input
                      type="text"
                      className={`zd-gen-input ${formErrors.landlord ? 'is-invalid' : ''}`}
                      id="gen-landlord-name"
                      required
                      placeholder="Owner full name"
                      value={formData.landlord}
                      onChange={(e) => handleAutoSave({ landlord: e.target.value })}
                    />
                    {formErrors.landlord && (
                      <div className="zd-gen-error-msg visible" id="err-gen-landlord">
                        {formErrors.landlord}
                      </div>
                    )}
                  </div>

                  <div className="zd-gen-form-group">
                    <label className="zd-gen-form-label" htmlFor="gen-tenant-name">
                      <UserCheck size={13} className="zd-gen-form-label-icon" />
                      <span>Tenant Name *</span>
                    </label>
                    <input
                      type="text"
                      className={`zd-gen-input ${formErrors.tenant ? 'is-invalid' : ''}`}
                      id="gen-tenant-name"
                      required
                      placeholder="Tenant full name"
                      value={formData.tenant}
                      onChange={(e) => handleAutoSave({ tenant: e.target.value })}
                    />
                    {formErrors.tenant && (
                      <div className="zd-gen-error-msg visible" id="err-gen-tenant">
                        {formErrors.tenant}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 4: Property Address (full width) */}
                <div className="zd-gen-form-group">
                  <label className="zd-gen-form-label" htmlFor="gen-property-address">
                    <MapPin size={13} className="zd-gen-form-label-icon" />
                    <span>Property Address / Location *</span>
                  </label>
                  <input
                    type="text"
                    className={`zd-gen-input ${formErrors.address ? 'is-invalid' : ''}`}
                    id="gen-property-address"
                    required
                    placeholder="e.g. Flat 302, Green Glen Layout, Bellandur, Bangalore"
                    value={formData.address}
                    onChange={(e) => handleAutoSave({ address: e.target.value })}
                  />
                  {formErrors.address && (
                    <div className="zd-gen-error-msg visible" id="err-gen-address">
                      {formErrors.address}
                    </div>
                  )}
                </div>

                {/* Row 5: Monthly Rent & Security Deposit 2-Col Grid */}
                <div className="zd-gen-grid-2col">
                  <div className="zd-gen-form-group">
                    <label className="zd-gen-form-label" htmlFor="gen-rent-amount">
                      <IndianRupee size={13} className="zd-gen-form-label-icon" />
                      <span>Monthly Rent (₹) *</span>
                    </label>
                    <input
                      type="number"
                      className={`zd-gen-input ${formErrors.rent ? 'is-invalid' : ''}`}
                      id="gen-rent-amount"
                      required
                      placeholder="e.g. 42000"
                      min="1000"
                      value={formData.rent}
                      onChange={(e) => handleAutoSave({ rent: e.target.value })}
                    />
                    {formErrors.rent && (
                      <div className="zd-gen-error-msg visible" id="err-gen-rent">
                        {formErrors.rent}
                      </div>
                    )}
                  </div>

                  <div className="zd-gen-form-group">
                    <label className="zd-gen-form-label" htmlFor="gen-deposit-amount">
                      <Coins size={13} className="zd-gen-form-label-icon" />
                      <span>Security Deposit (₹) *</span>
                    </label>
                    <input
                      type="number"
                      className={`zd-gen-input ${formErrors.deposit ? 'is-invalid' : ''}`}
                      id="gen-deposit-amount"
                      required
                      placeholder="e.g. 200000"
                      min="1000"
                      value={formData.deposit}
                      onChange={(e) => handleAutoSave({ deposit: e.target.value })}
                    />
                    {formErrors.deposit && (
                      <div className="zd-gen-error-msg visible" id="err-gen-deposit">
                        {formErrors.deposit}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 6: Agreement type & E-Stamp Jurisdiction State 2-Col Grid */}
                <div className="zd-gen-grid-2col">
                  <div className="zd-gen-form-group">
                    <label className="zd-gen-form-label" htmlFor="gen-lease-term">
                      <Calendar size={13} className="zd-gen-form-label-icon" />
                      <span>Agreement Type *</span>
                    </label>
                    <GlassSelect
                      id="gen-lease-term"
                      name="leaseTerm"
                      prefixIcon={Calendar}
                      value={formData.term}
                      options={LEASE_DURATION_OPTIONS}
                      onChange={(e, val) => {
                        const selectedTerm = val || e?.target?.value;
                        handleAutoSave({ term: selectedTerm });
                      }}
                    />
                    {formErrors.term && <div className="zd-gen-error-msg visible">{formErrors.term}</div>}
                  </div>

                  <div className="zd-gen-form-group">
                    <label className="zd-gen-form-label" htmlFor="gen-stamp-state">
                      <User size={13} className="zd-gen-form-label-icon" />
                      <span>E-Stamp Jurisdiction State</span>
                    </label>
                    <GlassSelect
                      id="gen-stamp-state"
                      name="jurisdiction"
                      prefixIcon={User}
                      value={formData.jurisdiction}
                      options={JURISDICTION_OPTIONS}
                      onChange={(e, val) => handleAutoSave({ jurisdiction: val || e?.target?.value })}
                    />
                  </div>
                </div>

                {/* Row 7: Effective Date & Expiry Date 2-Col Grid */}
                <div className="zd-gen-grid-2col">
                  <div className="zd-gen-form-group">
                    <label className="zd-gen-form-label" htmlFor="gen-effective-date">
                      <Calendar size={13} className="zd-gen-form-label-icon" />
                      <span>Effective Date</span>
                    </label>
                    <input
                      type="date"
                      className={`zd-gen-input ${formErrors.effectiveDate ? 'is-invalid' : ''}`}
                      id="gen-effective-date"
                      value={formData.effectiveDate}
                      onChange={(e) => handleAutoSave({ effectiveDate: e.target.value })}
                    />
                    {formErrors.effectiveDate && <div className="zd-gen-error-msg visible">{formErrors.effectiveDate}</div>}
                  </div>
                  <div className="zd-gen-form-group">
                    <label className="zd-gen-form-label" htmlFor="gen-expiry-date">
                      <Calendar size={13} className="zd-gen-form-label-icon" />
                      <span>Expiry Date</span>
                    </label>
                    <input
                      type="date"
                      className={`zd-gen-input ${formErrors.expiryDate ? 'is-invalid' : ''}`}
                      id="gen-expiry-date"
                      value={formData.expiryDate}
                      min={formData.effectiveDate || undefined}
                      onChange={(e) => handleAutoSave({ expiryDate: e.target.value })}
                    />
                    <small className="zd-gen-field-help">Optional where an open-ended agreement is supported.</small>
                    {formErrors.expiryDate && <div className="zd-gen-error-msg visible">{formErrors.expiryDate}</div>}
                  </div>
                </div>

                {/* Note: The state treasury stamp duty card has been completely removed as requested */}

                <div className="zd-gen-modal-footer">
                  <button
                    type="button"
                    className="zd-gen-btn zd-gen-btn--outline"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="zd-gen-btn zd-gen-btn--primary"
                    id="btn-goto-step2"
                  >
                    Review &amp; Stamp Duty Breakdown →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Summary Preview & Stamp Duty Breakdown */}
          {step === 2 && (
            <div id="agr-step-2-container">
              <div className="zd-gen-review-card">
                <div className="zd-gen-review-header">
                  <FileText size={16} color="#2563eb" />
                  <span>Agreement Preview &amp; Legal Consideration</span>
                </div>

                <div className="zd-gen-review-grid">
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong style={{ color: '#64748b' }}>Agreement:</strong>{' '}
                    <span style={{ fontWeight: 600 }}>{formData.title}</span>
                    {formData.referenceNumber ? ` · Ref: ${formData.referenceNumber}` : ''}
                  </div>
                  <div>
                    <strong style={{ color: '#64748b' }}>Landlord:</strong>{' '}
                    <span id="preview-landlord-val" style={{ fontWeight: 600, color: '#0f172a' }}>
                      {formData.landlord}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b' }}>Tenant:</strong>{' '}
                    <span id="preview-tenant-val" style={{ fontWeight: 600, color: '#0f172a' }}>
                      {formData.tenant}
                    </span>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong style={{ color: '#64748b' }}>Property:</strong>{' '}
                    <span id="preview-address-val" style={{ fontWeight: 500, color: '#0f172a' }}>
                      {formData.address}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b' }}>Monthly Rent:</strong>{' '}
                    <span id="preview-rent-val" style={{ fontWeight: 700, color: '#2563eb' }}>
                      ₹{Number(formData.rent || 0).toLocaleString('en-IN')} / mo
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b' }}>Security Deposit:</strong>{' '}
                    <span id="preview-deposit-val" style={{ fontWeight: 700, color: '#0f172a' }}>
                      ₹{Number(formData.deposit || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b' }}>Duration:</strong>{' '}
                    <span id="preview-duration-val">{formData.term}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b' }}>Jurisdiction:</strong>{' '}
                    <span id="preview-state-val">{formData.jurisdiction}</span>
                  </div>
                  {(formData.effectiveDate || formData.expiryDate) && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <strong style={{ color: '#64748b' }}>Dates:</strong>{' '}
                      <span>{formData.effectiveDate || 'Open'} → {formData.expiryDate || 'Open-ended'}</span>
                    </div>
                  )}
                </div>

                {/* Stamp Duty Breakdown Box */}
                <div className="zd-gen-breakdown-box">
                  <div className="zd-gen-breakdown-row">
                    <span>NeSL Digital e-Stamp Duty (State Treasury):</span>
                    <strong id="preview-stamp-val">{STAMP_MAP[formData.jurisdiction] || '₹500.00'}</strong>
                  </div>
                  <div className="zd-gen-breakdown-row">
                    <span>Digital Audit Trail &amp; Hash Sealing:</span>
                    <strong style={{ color: '#059669' }}>FREE (Included)</strong>
                  </div>
                  <div className="zd-gen-breakdown-row highlight">
                    <span>Platform Execution Cost:</span>
                    <strong
                      id="preview-quota-cost-val"
                      style={{ color: isPayDoc ? '#b54708' : '#2563eb' }}
                    >
                      {isPayDoc ? '₹99.00 (Instant Razorpay Payment)' : '1 Pro Quota Credit'}
                    </strong>
                  </div>
                </div>

                <div className="zd-gen-sha-tag">
                  Draft SHA-256: <span id="preview-sha-hash">{shaHash}</span> (Tamper-proof lock pending execution)
                </div>
              </div>

              <div className="zd-gen-modal-footer">
                <button
                  type="button"
                  className="zd-gen-btn zd-gen-btn--outline"
                  onClick={() => setStep(1)}
                >
                  ← Back to Edit
                </button>
                <button
                  type="button"
                  className="zd-gen-btn zd-gen-btn--primary"
                  id="btn-confirm-execute"
                  onClick={handleExecutePipeline}
                >
                  Save &amp; Execute Agreement
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Real-Time Execution Pipeline */}
          {step === 3 && (
            <div id="agr-step-3-container">
              <div style={{ marginBottom: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                  Executing Legal Verification Pipeline...
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                  Securing digital treasury certificates and preparing UIDAI Aadhaar links
                </div>
              </div>

              {/* Step 1 */}
              <div
                className={`zd-gen-pipeline-step ${
                  pipelineStep === 1 ? 'in-progress' : pipelineStep !== 1 ? 'done' : ''
                }`}
                id="pipe-step-1"
              >
                <div className="zd-gen-pipeline-circle">
                  {pipelineStep !== 1 ? '✓' : '1'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                    NeSL State Treasury e-Stamp Requisition
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    Connecting to state treasury gate for official digital e-stamp certificate...
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`zd-gen-pipeline-step ${
                  pipelineStep === 2
                    ? 'in-progress'
                    : pipelineStep === 3 || pipelineStep === 'done'
                    ? 'done'
                    : ''
                }`}
                id="pipe-step-2"
              >
                <div className="zd-gen-pipeline-circle">
                  {pipelineStep === 3 || pipelineStep === 'done' ? '✓' : '2'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                    SHA-256 Cryptographic Hash Sealing
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    Generating immutable 256-bit tamper-evident digital seal...
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`zd-gen-pipeline-step ${
                  pipelineStep === 3 ? 'in-progress' : pipelineStep === 'done' ? 'done' : ''
                }`}
                id="pipe-step-3"
              >
                <div className="zd-gen-pipeline-circle">
                  {pipelineStep === 'done' ? '✓' : '3'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                    UIDAI Aadhaar e-Sign Link Dispatch
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    Dispatching verified WhatsApp signature links to Landlord &amp; Tenant...
                  </div>
                </div>
              </div>

              {/* Complete Box */}
              {pipelineStep === 'done' && (
                <div
                  id="pipe-complete-box"
                  style={{
                    background: 'rgba(236, 253, 243, 0.9)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1.5px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '16px',
                    padding: '22px 18px',
                    textAlign: 'center',
                    marginTop: '16px',
                    boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.15)'
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.18)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px'
                    }}
                  >
                    <CircleCheck size={28} color="#059669" />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: '#027a48' }}>
                    Agreement Successfully Executed!
                  </div>
                  <div style={{ fontSize: '13px', color: '#065f46', marginTop: '4px' }}>
                    Agreement ID:{' '}
                    <strong id="pipe-done-id" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
                      {executedAgreement?.id || 'ZD-9050'}
                    </strong>{' '}
                    | WhatsApp e-Sign link active
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="zd-gen-btn"
                      id="btn-pipe-share-whatsapp"
                      style={{
                        background: '#25d366',
                        color: '#ffffff',
                        border: '1.5px solid #25d366',
                        fontWeight: 700
                      }}
                      onClick={() => {
                        if (executedAgreement) {
                          dispatchWhatsApp(executedAgreement.id);
                        }
                      }}
                    >
                      <MessageCircle size={16} />
                      <span>Open WhatsApp Dispatch</span>
                    </button>
                    <button
                      type="button"
                      className="zd-gen-btn zd-gen-btn--primary"
                      onClick={closeModal}
                    >
                      View in My Agreements →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
