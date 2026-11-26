import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import BillingNavTabs from '../../components/BillingNavTabs';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  isValidIFSC,
  isValidAccountNumber,
  isValidUPI,
  maskAccountNumber,
  getSavedBankAccount,
  saveBankAccount,
  removeBankAccount,
  getSavedUPI,
  saveUPI,
  removeUPI
} from '../../mock/bankUpiData';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import './BankUpiSettings.css';

export default function BankUpiSettingsScreen() {
  const { user } = useAuth();
  const brokerId = user?.id || 'default_broker';
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Bank Account State
  const [savedBank, setSavedBank] = useState(() => getSavedBankAccount(brokerId));
  const [isEditingBank, setIsEditingBank] = useState(() => !getSavedBankAccount(brokerId));

  const [bankFormData, setBankFormData] = useState({
    accountHolderName: user?.name || '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: ''
  });
  const [bankErrors, setBankErrors] = useState({});

  // UPI State
  const [savedUpi, setSavedUpi] = useState(() => getSavedUPI(brokerId, user?.upiId || null));
  const [isEditingUpi, setIsEditingUpi] = useState(() => !getSavedUPI(brokerId, user?.upiId || null));
  const [upiInput, setUpiInput] = useState(() => getSavedUPI(brokerId, user?.upiId || '') || '');
  const [upiError, setUpiError] = useState('');

  // Toast State
  const [feedbackToast, setFeedbackToast] = useState(null);

  function showToast(message) {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3000);
  }

  // Validate Bank Form
  function validateBankForm() {
    const errors = {};

    if (!bankFormData.accountHolderName.trim()) {
      errors.accountHolderName = 'Account Holder Name is required';
    } else if (bankFormData.accountHolderName.trim().length < 2) {
      errors.accountHolderName = 'Name must be at least 2 characters';
    }

    const cleanAcc = bankFormData.accountNumber.replace(/\s+/g, '');
    if (!cleanAcc) {
      errors.accountNumber = 'Bank Account Number is required';
    } else if (!isValidAccountNumber(cleanAcc)) {
      errors.accountNumber = 'Please enter a valid 9 to 18 digit account number';
    }

    if (!bankFormData.confirmAccountNumber) {
      errors.confirmAccountNumber = 'Please confirm the bank account number';
    } else if (cleanAcc !== bankFormData.confirmAccountNumber.replace(/\s+/g, '')) {
      errors.confirmAccountNumber = 'Account numbers do not match';
    }

    const cleanIfsc = bankFormData.ifscCode.trim().toUpperCase();
    if (!cleanIfsc) {
      errors.ifscCode = 'IFSC Code is required';
    } else if (!isValidIFSC(cleanIfsc)) {
      errors.ifscCode = 'Invalid IFSC format (e.g., SBIN0001234, 11 alphanumeric characters)';
    }

    setBankErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Handle Bank Save
  function handleSaveBank(e) {
    e.preventDefault();
    if (!validateBankForm()) return;

    const newBankData = {
      accountHolderName: bankFormData.accountHolderName.trim(),
      accountNumber: bankFormData.accountNumber.replace(/\s+/g, ''),
      ifscCode: bankFormData.ifscCode.trim().toUpperCase(),
      updatedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    saveBankAccount(brokerId, newBankData);
    setSavedBank(newBankData);
    setIsEditingBank(false);
    setBankErrors({});
    showToast('Bank account details saved successfully (Prototype: local storage).');
  }

  // Handle Bank Edit Trigger
  function handleStartEditBank() {
    if (savedBank) {
      setBankFormData({
        accountHolderName: savedBank.accountHolderName,
        accountNumber: savedBank.accountNumber,
        confirmAccountNumber: savedBank.accountNumber,
        ifscCode: savedBank.ifscCode
      });
    }
    setBankErrors({});
    setIsEditingBank(true);
  }

  // Handle Bank Remove
  function handleRemoveBank() {
    removeBankAccount(brokerId);
    setSavedBank(null);
    setBankFormData({
      accountHolderName: user?.name || '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: ''
    });
    setBankErrors({});
    setIsEditingBank(true);
    showToast('Bank account details removed.');
  }

  // Validate UPI Input
  function validateUpi() {
    const clean = upiInput.trim();
    if (!clean) {
      setUpiError('UPI ID is required');
      return false;
    }
    if (!isValidUPI(clean)) {
      setUpiError('Invalid UPI format (e.g., username@bank, 9876543210@paytm)');
      return false;
    }
    setUpiError('');
    return true;
  }

  // Handle UPI Save
  function handleSaveUpi(e) {
    e.preventDefault();
    if (!validateUpi()) return;

    const clean = upiInput.trim();
    saveUPI(brokerId, clean);
    setSavedUpi(clean);
    setIsEditingUpi(false);
    showToast('UPI ID saved successfully for payouts.');
  }

  // Handle UPI Edit Trigger
  function handleStartEditUpi() {
    setUpiInput(savedUpi || '');
    setUpiError('');
    setIsEditingUpi(true);
  }

  // Handle UPI Remove
  function handleRemoveUpi() {
    removeUPI(brokerId);
    setSavedUpi(null);
    setUpiInput('');
    setUpiError('');
    setIsEditingUpi(true);
    showToast('UPI ID removed.');
  }

  return (
    <div className="zd-settings-page">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#16A34A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontWeight: '500',
          fontSize: '14px'
        }}>
          {feedbackToast}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <BillingNavTabs />

      {/* 1. Page Header */}
      <section className="zd-settings-header" aria-label="Bank and UPI Settings Header">
        <Button
          variant="ghost"
          size="sm"
          className="zd-settings-back-btn"
          onClick={() => navigate('/broker/refer')}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Earn &amp; Refer</span>
        </Button>
        <h1 className="zd-settings-header__title">{t('bank_upi_title', 'Bank & UPI Settings')}</h1>
        <p className="zd-settings-header__desc">
          {t('bank_upi_subtitle', 'Manage your verified settlement accounts. Configure your bank account and UPI handle for referral reward payouts and broker fee credits.')}
        </p>
      </section>

      {/* 2. Main Two-Column Grid */}
      <section className="zd-settings-grid" aria-label="Settlement Accounts Configuration">
        {/* Card 1: Bank Account Form & Display */}
        <div className="zd-settings-card">
          <div className="zd-settings-card__header">
            <div className="zd-settings-card__icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="21" x2="21" y2="21" />
                <line x1="6" y1="18" x2="6" y2="11" />
                <line x1="10" y1="18" x2="10" y2="11" />
                <line x1="14" y1="18" x2="14" y2="11" />
                <line x1="18" y1="18" x2="18" y2="11" />
                <polygon points="12 2 20 7 4 7" />
              </svg>
            </div>
            <div className="zd-settings-card__title-box">
              <h2 className="zd-settings-card__title">{t('bank_details_section', 'Bank Account')}</h2>
              <span className="zd-settings-card__desc">
                Direct NEFT/RTGS settlement account
              </span>
            </div>
          </div>

          {/* View Mode: Saved Bank Account Display */}
          {savedBank && !isEditingBank ? (
            <div className="zd-saved-box">
              <div className="zd-saved-box__top">
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--zd-text-muted)', fontWeight: 'bold' }}>
                    Account Holder
                  </span>
                  <div className="zd-saved-holder-name">{savedBank.accountHolderName}</div>
                </div>
                <Badge variant="success" size="sm">Configured</Badge>
              </div>

              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--zd-text-muted)', fontWeight: 'bold' }}>
                  Masked Account Number
                </span>
                <div className="zd-masked-acc-num">
                  {maskAccountNumber(savedBank.accountNumber)}
                </div>
              </div>

              <div className="zd-saved-meta-row">
                <div>
                  <strong>IFSC:</strong> <code>{savedBank.ifscCode}</code>
                </div>
                <div>
                  <span style={{ color: 'var(--zd-text-muted)' }}>Saved on: {savedBank.updatedAt}</span>
                </div>
              </div>

              <div className="zd-settings-actions-row">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartEditBank}
                >
                  {t('btn_edit_bank', 'Edit Bank Details')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRemoveBank}
                >
                  Remove Account
                </Button>
              </div>
            </div>
          ) : (
            /* Edit / Setup Mode: Bank Account Form */
            <form onSubmit={handleSaveBank} className="zd-settings-form">
              {/* Account Holder Name */}
              <div className="zd-settings-form-group">
                <label className="zd-settings-label" htmlFor="zd-bank-holder">
                  {t('account_holder_label', 'Account Holder Name')} <span className="req">*</span>
                </label>
                <input
                  id="zd-bank-holder"
                  type="text"
                  className="zd-settings-input"
                  placeholder="Name as registered with the bank"
                  value={bankFormData.accountHolderName}
                  onChange={(e) => setBankFormData({ ...bankFormData, accountHolderName: e.target.value })}
                />
                {bankErrors.accountHolderName && (
                  <span className="zd-settings-error">{bankErrors.accountHolderName}</span>
                )}
              </div>

              {/* Bank Account Number */}
              <div className="zd-settings-form-group">
                <label className="zd-settings-label" htmlFor="zd-bank-acc">
                  {t('account_number_label', 'Bank Account Number')} <span className="req">*</span>
                </label>
                <input
                  id="zd-bank-acc"
                  type="password"
                  className="zd-settings-input"
                  placeholder="Enter 9 to 18 digit account number"
                  value={bankFormData.accountNumber}
                  onChange={(e) => setBankFormData({ ...bankFormData, accountNumber: e.target.value })}
                  autoComplete="off"
                />
                {bankErrors.accountNumber && (
                  <span className="zd-settings-error">{bankErrors.accountNumber}</span>
                )}
              </div>

              {/* Confirm Bank Account Number */}
              <div className="zd-settings-form-group">
                <label className="zd-settings-label" htmlFor="zd-bank-acc-confirm">
                  {t('confirm_acc_number_label', 'Confirm Bank Account Number')} <span className="req">*</span>
                </label>
                <input
                  id="zd-bank-acc-confirm"
                  type="text"
                  className="zd-settings-input"
                  placeholder="Re-enter bank account number"
                  value={bankFormData.confirmAccountNumber}
                  onChange={(e) => setBankFormData({ ...bankFormData, confirmAccountNumber: e.target.value })}
                  autoComplete="off"
                />
                {bankErrors.confirmAccountNumber && (
                  <span className="zd-settings-error">{bankErrors.confirmAccountNumber}</span>
                )}
              </div>

              {/* IFSC Code */}
              <div className="zd-settings-form-group">
                <label className="zd-settings-label" htmlFor="zd-bank-ifsc">
                  {t('ifsc_code_label', 'IFSC Code')} <span className="req">*</span>
                </label>
                <input
                  id="zd-bank-ifsc"
                  type="text"
                  className="zd-settings-input"
                  placeholder="e.g. SBIN0001234, HDFC0000456"
                  maxLength={11}
                  value={bankFormData.ifscCode}
                  onChange={(e) => setBankFormData({ ...bankFormData, ifscCode: e.target.value.toUpperCase() })}
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                />
                <span className="zd-settings-hint">
                  11-character code printed on your bank chequebook or passbook
                </span>
                {bankErrors.ifscCode && (
                  <span className="zd-settings-error">{bankErrors.ifscCode}</span>
                )}
              </div>

              <div className="zd-settings-actions-row">
                <Button type="submit" variant="primary" size="md">
                  {savedBank ? 'Update Bank Account' : t('btn_save_bank', 'Save Bank Account')}
                </Button>
                {savedBank && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setIsEditingBank(false);
                      setBankErrors({});
                    }}
                  >
                    {t('cancel', 'Cancel')}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Card 2: UPI Form & Display */}
        <div className="zd-settings-card">
          <div className="zd-settings-card__header">
            <div className="zd-settings-card__icon-box" aria-hidden="true" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15h0M2 9.5h20" />
              </svg>
            </div>
            <div className="zd-settings-card__title-box">
              <h2 className="zd-settings-card__title">{t('upi_section', 'UPI Payment ID')}</h2>
              <span className="zd-settings-card__desc">
                Instant UPI handle for referral earnings and payouts
              </span>
            </div>
          </div>

          {/* View Mode: Saved UPI ID Display */}
          {savedUpi && !isEditingUpi ? (
            <div className="zd-saved-box">
              <div className="zd-saved-box__top">
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--zd-text-muted)', fontWeight: 'bold' }}>
                  Registered UPI Handle
                </span>
                <Badge variant="success" size="sm">Active for Payouts</Badge>
              </div>

              <div className="zd-saved-upi-display">
                <span className="zd-upi-handle-text">{savedUpi}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--zd-text-secondary)', lineHeight: 1.4 }}>
                Referral bonuses (₹50 per eligible signup) will be disbursed directly to this UPI address.
              </div>

              <div className="zd-settings-actions-row">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartEditUpi}
                >
                  Update UPI ID
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRemoveUpi}
                >
                  Remove UPI
                </Button>
              </div>
            </div>
          ) : (
            /* Edit / Setup Mode: UPI Form */
            <form onSubmit={handleSaveUpi} className="zd-settings-form">
              <div className="zd-settings-form-group">
                <label className="zd-settings-label" htmlFor="zd-upi-input">
                  {t('upi_input_label', 'Virtual Payment Address (VPA)')} <span className="req">*</span>
                </label>
                <input
                  id="zd-upi-input"
                  type="text"
                  className="zd-settings-input"
                  placeholder="e.g. yourname@okhdfcbank, mobile@paytm"
                  value={upiInput}
                  onChange={(e) => {
                    setUpiInput(e.target.value);
                    if (upiError) setUpiError('');
                  }}
                />
                <span className="zd-settings-hint">
                  Supports handles from BHIM, Google Pay, PhonePe, Paytm, and all Indian banks
                </span>
                {upiError && (
                  <span className="zd-settings-error">{upiError}</span>
                )}
              </div>

              <div className="zd-settings-actions-row">
                <Button type="submit" variant="primary" size="md">
                  {savedUpi ? 'Update UPI ID' : t('btn_verify_save_upi', 'Verify & Save UPI')}
                </Button>
                {savedUpi && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setIsEditingUpi(false);
                      setUpiError('');
                    }}
                  >
                    {t('cancel', 'Cancel')}
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* Helper Tips Box */}
          <div className="zd-settings-info-callout">
            <strong>Why configure UPI?</strong>
            <span>
              ₹50 referral rewards earned through fellow broker signups are disbursed automatically via instant UPI rails upon verification.
            </span>
          </div>
        </div>
      </section>

      {/* 3. Security & Prototype Notice Banner */}
      <section className="zd-settings-disclaimer" aria-label="Settlement Security Notice">
        <strong>Privacy &amp; Security Disclaimer:</strong> Bank account numbers and UPI identifiers entered in this interface are stored locally in client-side storage for prototype simulation. In production, payment instruments undergo automated penny-drop verification via NPCI / RBI-regulated banking partners. Full account numbers are never exposed in plaintext.
      </section>
    </div>
  );
}
