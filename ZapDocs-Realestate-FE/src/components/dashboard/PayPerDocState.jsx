import { useState } from 'react';
import { Info } from 'lucide-react';
import Button from '../common/Button/Button';
import AgreementCreationModal from '../agreements/AgreementCreationModal';
import './Dashboard.css';

export default function PayPerDocState({ onNavigate }) {
  const [creationModalType, setCreationModalType] = useState(null); // 'rental' | 'other' | null

  function handleActionClick(type) {
    setCreationModalType(type);
  }

  return (
    <div className="zd-dashboard">
      {/* 1. Subscription Card */}
      <section className="zd-sub-card" aria-label="Subscription Status">
        <div className="zd-sub-card__top">
          <div className="zd-sub-card__status-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Info size={13} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
            <span>Pay-Per-Document Active (No Monthly Plan)</span>
          </div>
          <span className="zd-sub-card__tier-tag">Standard Rate: ₹99 / Document</span>
        </div>

        <div className="zd-sub-card__body">
          <h2 className="zd-sub-card__headline">
            Pay ₹99 per agreement with instant e-Sign &amp; e-Stamp.
          </h2>
          <p className="zd-sub-card__message">
            No monthly subscription is currently active on your account. You can generate legally verified rental and commercial agreements on-demand with pay-as-you-go pricing.
          </p>
          <p className="zd-sub-card__disclaimer">
            Zero fixed monthly commitment. Top up or upgrade whenever your document volume increases.
          </p>
        </div>

        <div className="zd-sub-card__actions">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate && onNavigate('billing')}
          >
            Upgrade to Pro Plan (₹5,000 / 100 Docs)
          </Button>
        </div>
      </section>

      {/* 2. Agreement Actions Section */}
      <section className="zd-section" aria-label="Agreement Generation Actions">
        <div className="zd-section-header" style={{ marginBottom: 'var(--zd-space-4)' }}>
          <h3 className="zd-section-title">Create New Agreement</h3>
          <p className="zd-section-subtitle">
            Select an agreement type to begin instant drafting, stamping, and execution
          </p>
        </div>

        <div className="zd-agreement-actions-grid">
          {/* Card 1: Rental Agreement */}
          <div className="zd-action-card">
            <div className="zd-action-card__top">
              <div className="zd-action-card__icon-box" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="zd-action-card__rate">₹99 / Doc</span>
            </div>

            <div className="zd-action-card__content">
              <h4 className="zd-action-card__title">Rental Agreement</h4>
              <p className="zd-action-card__desc">
                Residential &amp; commercial tenant agreements with state-compliant stamp duty and biometric/OTP e-Signing.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              style={{ width: '100%' }}
              onClick={() => handleActionClick('rental')}
            >
              Generate Rental Agreement (₹99)
            </Button>
          </div>

          {/* Card 2: Other Agreements */}
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
              <span className="zd-action-card__rate">₹99 / Doc</span>
            </div>

            <div className="zd-action-card__content">
              <h4 className="zd-action-card__title">Other Agreements</h4>
              <p className="zd-action-card__desc">
                Commercial leases, sale agreements, affidavits, NDAs, and customized broker documentation.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              style={{ width: '100%' }}
              onClick={() => handleActionClick('other')}
            >
              Generate Other Agreements (₹99)
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
        />
      )}
    </div>
  );
}
