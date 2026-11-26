import { CircleX } from 'lucide-react';
import Button from '../common/Button/Button';
import './Dashboard.css';

export default function ExpiredPlanState({ user, onNavigate }) {
  const tierName = user?.subscription?.tier || 'Professional Plan';

  return (
    <div className="zd-dashboard">
      {/* Expired Subscription Card */}
      <section className="zd-sub-card zd-sub-card--danger" aria-label="Expired Subscription Status">
        <div className="zd-sub-card__top">
          <div className="zd-sub-card__status-badge zd-sub-card__status-badge--danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <CircleX size={13} style={{ color: 'var(--status-error)' }} aria-hidden="true" />
            <span>Plan Expired</span>
          </div>
          <span className="zd-sub-card__tier-tag">Previous: {tierName} (₹5,000/mo)</span>
        </div>

        <div className="zd-sub-card__body">
          <h2 className="zd-sub-card__headline">
            Your Monthly Document Plan Has Expired
          </h2>
          <p className="zd-sub-card__message">
            Document quota drafting is currently paused. Renew your Professional Plan for 100 new documents, or continue generating agreements on-demand at ₹99 per document.
          </p>
        </div>

        <div className="zd-sub-card__actions">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate && onNavigate('billing')}
          >
            Renew Plan (₹5,000 / 100 Docs)
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => onNavigate && onNavigate('billing')}
          >
            Switch to Pay-Per-Doc (₹99)
          </Button>
        </div>
      </section>

      {/* Agreement Actions (Disabled / Expired Notice) */}
      <section className="zd-section" aria-label="Agreement Generation Actions">
        <div className="zd-section-header" style={{ marginBottom: 'var(--zd-space-4)' }}>
          <h3 className="zd-section-title">Create New Agreement</h3>
          <p className="zd-section-subtitle">
            Renew your plan or choose pay-per-document to draft new agreements
          </p>
        </div>

        <div className="zd-agreement-actions-grid">
          <div className="zd-action-card">
            <div className="zd-action-card__top">
              <div className="zd-action-card__icon-box" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              <span className="zd-action-card__rate">Plan Expired</span>
            </div>
            <div className="zd-action-card__content">
              <h4 className="zd-action-card__title">Rental Agreement</h4>
              <p className="zd-action-card__desc">
                Renew your monthly quota to resume unlimited drafting with integrated stamp duty and e-Sign.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              style={{ width: '100%' }}
              onClick={() => onNavigate && onNavigate('billing')}
            >
              Renew Plan to Generate
            </Button>
          </div>

          <div className="zd-action-card">
            <div className="zd-action-card__top">
              <div className="zd-action-card__icon-box" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                </svg>
              </div>
              <span className="zd-action-card__rate">Plan Expired</span>
            </div>
            <div className="zd-action-card__content">
              <h4 className="zd-action-card__title">Other Agreements</h4>
              <p className="zd-action-card__desc">
                Commercial and custom legal documentation can be drafted once your quota is renewed.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              style={{ width: '100%' }}
              onClick={() => onNavigate && onNavigate('billing')}
            >
              Renew Plan to Generate
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
