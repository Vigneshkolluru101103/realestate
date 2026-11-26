import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import Button from '../common/Button/Button';
import AgreementCreationModal from '../agreements/AgreementCreationModal';
import './Dashboard.css';

export default function ActivePlanState({ user, onNavigate }) {
  const subscription = user?.subscription || {};

  // Read subscription data with fallback to mock defaults
  const tierName = subscription.tier || 'Professional Plan';
  const priceDisplay = subscription.price ? `₹${subscription.price.toLocaleString('en-IN')}/month` : '₹5,000/month';
  const totalQuota = subscription.totalQuota !== undefined ? subscription.totalQuota : 100;
  const usedQuota = subscription.usedQuota !== undefined ? subscription.usedQuota : 50;
  const remainingQuota = subscription.remainingQuota !== undefined ? subscription.remainingQuota : 50;

  // Auto-renew toggle state
  const [autoRenew, setAutoRenew] = useState(() => {
    return subscription.autoRenew !== undefined ? Boolean(subscription.autoRenew) : true;
  });

  // Modal & Feedback state
  const [creationModalType, setCreationModalType] = useState(null); // 'rental' | 'other' | null
  const [feedbackToast, setFeedbackToast] = useState(null);

  function showToast(message) {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3000);
  }

  function handleToggleAutoRenew() {
    const nextState = !autoRenew;
    setAutoRenew(nextState);
    showToast(`Auto-Renew turned ${nextState ? 'ON' : 'OFF'} (Prototype setting)`);
  }

  function handleActionClick(type) {
    setCreationModalType(type);
  }

  const usedPercentage = totalQuota > 0 ? Math.min(100, Math.round((usedQuota / totalQuota) * 100)) : 50;

  return (
    <div className="zd-dashboard">
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

      {/* 1. Active Subscription Card (Option A) */}
      <section className="zd-sub-card zd-sub-card--active" aria-label="Active Subscription Status">
        <div className="zd-sub-card__top">
          <div className="zd-sub-card__status-badge zd-sub-card__status-badge--success" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <CircleCheck size={13} style={{ color: 'var(--status-success)' }} aria-hidden="true" />
            <span>Professional Plan — Active</span>
          </div>
          <span className="zd-sub-card__price-tag">{priceDisplay}</span>
        </div>

        <div className="zd-sub-card__body">
          <h2 className="zd-sub-card__headline">
            {tierName} Active &amp; Ready for Document Drafting
          </h2>
          <p className="zd-sub-card__message">
            Your monthly subscription includes 100 fully compliant legal agreements with instant digital e-Stamp issuance, Aadhaar e-Signing, and Section 63 evidentiary certificate generation.
          </p>
        </div>

        {/* Visual Document Quota Progress Bar */}
        <div className="zd-quota-section">
          <div className="zd-quota-section__header">
            <span>Document Quota Utilization</span>
            <span>{usedQuota} / {totalQuota} Used ({usedPercentage}%)</span>
          </div>

          <div
            className="zd-quota-bar-track"
            role="progressbar"
            aria-valuenow={usedPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Document quota utilization"
          >
            <div
              className="zd-quota-bar-fill zd-quota-bar-fill--green"
              style={{ width: `${usedPercentage}%` }}
            />
          </div>

          <div className="zd-quota-stats-grid">
            <div>
              Total documents: <span className="zd-quota-stat-bold">{totalQuota}</span>
            </div>
            <div>
              Used documents: <span className="zd-quota-stat-bold">{usedQuota}</span>
            </div>
            <div>
              Remaining documents: <span className="zd-quota-stat-bold" style={{ color: 'var(--zd-color-success)' }}>
                {remainingQuota}
              </span>
            </div>
          </div>
        </div>

        {/* Auto-Renew Switch Control */}
        <div className="zd-dashboard-autorenew-row">
          <div>
            <strong>Subscription Auto-Renew:</strong>{' '}
            <span style={{ color: 'var(--zd-text-secondary)' }}>
              Automatically renews 100 documents on next monthly cycle
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={autoRenew}
            onClick={handleToggleAutoRenew}
            className="zd-autorenew-switch-btn"
            aria-label="Toggle subscription auto-renewal"
          >
            <span className={`zd-autorenew-track ${autoRenew ? 'zd-autorenew-track--active' : ''}`}>
              <span className="zd-autorenew-thumb" />
            </span>
            <span style={{ fontWeight: '600' }}>
              {autoRenew ? 'ON (Active)' : 'OFF (Manual)'}
            </span>
          </button>
        </div>

        <div className="zd-sub-card__actions">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate && onNavigate('billing')}
          >
            Manage Plan &amp; Quota
          </Button>
          <span style={{ fontSize: '11px', color: 'var(--zd-text-muted)' }}>
            Sample mock values shown for authenticated broker ({user?.name})
          </span>
        </div>
      </section>

      {/* 2. Agreement Actions Section */}
      <section className="zd-section" aria-label="Agreement Generation Actions">
        <div className="zd-section-header" style={{ marginBottom: 'var(--zd-space-4)' }}>
          <h3 className="zd-section-title">Create New Agreement</h3>
          <p className="zd-section-subtitle">
            Generate legally compliant agreements deducted directly from your 100-document active quota
          </p>
        </div>

        <div className="zd-agreement-actions-grid">
          {/* Action 1: Rental Agreement */}
          <div className="zd-action-card">
            <div className="zd-action-card__top">
              <div className="zd-action-card__icon-box" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="zd-action-card__rate zd-action-card__rate--quota">
                Included in Plan Quota
              </span>
            </div>

            <div className="zd-action-card__content">
              <h4 className="zd-action-card__title">Rental Agreement</h4>
              <p className="zd-action-card__desc">
                Residential &amp; commercial 11-month leases with integrated e-stamping and Aadhaar e-Sign for primary tenants.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              style={{ width: '100%' }}
              onClick={() => handleActionClick('rental')}
            >
              Generate Rental Agreement
            </Button>
          </div>

          {/* Action 2: Other Agreements */}
          <div className="zd-action-card">
            <div className="zd-action-card__top">
              <div className="zd-action-card__icon-box" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <span className="zd-action-card__rate zd-action-card__rate--quota">
                Included in Plan Quota
              </span>
            </div>

            <div className="zd-action-card__content">
              <h4 className="zd-action-card__title">Other Agreements</h4>
              <p className="zd-action-card__desc">
                Commercial leases, sale agreements, affidavits, NDAs, and customized broker legal documentation.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              style={{ width: '100%' }}
              onClick={() => handleActionClick('other')}
            >
              Generate Other Agreements
            </Button>
          </div>
        </div>
      </section>

      {/* Agreement Creation Modal */}
      {creationModalType && (
        <AgreementCreationModal
          isOpen={Boolean(creationModalType)}
          initialType={creationModalType}
          onClose={() => setCreationModalType(null)}
          onNavigate={onNavigate}
          onSuccess={(newAgreement) => {
            showToast(`Draft agreement ${newAgreement.id} created successfully!`);
          }}
        />
      )}
    </div>
  );
}
