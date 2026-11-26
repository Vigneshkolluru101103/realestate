import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../common/Button/Button';
import './Dashboard.css';

export default function QuotaExhaustedState({ user, onNavigate }) {
  const subscription = user?.subscription || {};
  const priceDisplay = subscription.price ? `₹${subscription.price.toLocaleString('en-IN')}/month` : '₹5,000/month';
  const totalQuota = subscription.totalQuota || 100;
  const usedQuota = subscription.usedQuota || 100;
  const remainingQuota = 0;

  const [autoRenew, setAutoRenew] = useState(() => {
    return subscription.autoRenew !== undefined ? Boolean(subscription.autoRenew) : true;
  });
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

      {/* Quota Exhausted Card */}
      <section className="zd-sub-card zd-sub-card--danger" aria-label="Quota Exhausted Status">
        <div className="zd-sub-card__top">
          <div className="zd-sub-card__status-badge zd-sub-card__status-badge--danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <AlertCircle size={13} style={{ color: 'var(--status-error)' }} aria-hidden="true" />
            <span>Professional Plan — Quota Exhausted</span>
          </div>
          <span className="zd-sub-card__price-tag">{priceDisplay}</span>
        </div>

        <div className="zd-sub-card__body">
          <h2 className="zd-sub-card__headline">
            QUOTA EXHAUSTED: 100 of 100 Documents Used
          </h2>
          <p className="zd-sub-card__message">
            You have drafted all 100 documents included in your active Professional Plan cycle. Add an instant 10 or 25 top-up pack, renew early, or use the ₹99 pay-per-document tier to continue creating agreements.
          </p>
        </div>

        {/* Visual Quota Progress Bar (Red, 100%) */}
        <div className="zd-quota-section">
          <div className="zd-quota-section__header">
            <span>Document Quota Utilization</span>
            <span style={{ color: 'var(--zd-color-danger)' }}>100 / 100 Used (100%)</span>
          </div>

          <div
            className="zd-quota-bar-track"
            role="progressbar"
            aria-valuenow={100}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Document quota exhausted"
          >
            <div
              className="zd-quota-bar-fill zd-quota-bar-fill--red"
              style={{ width: '100%' }}
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
              Remaining documents:{' '}
              <span className="zd-quota-stat-bold" style={{ color: 'var(--zd-color-danger)' }}>
                {remainingQuota} (Exhausted)
              </span>
            </div>
          </div>
        </div>

        {/* Auto-Renew Switch Control */}
        <div className="zd-dashboard-autorenew-row">
          <div>
            <strong>Subscription Auto-Renew:</strong>{' '}
            <span style={{ color: 'var(--zd-text-secondary)' }}>
              {autoRenew ? 'Will replenish 100 documents on next cycle' : 'Manual renewal required'}
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
            Buy Top-Up (10 Docs / ₹990)
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate && onNavigate('billing')}
          >
            Pay-Per-Doc (₹99)
          </Button>
        </div>
      </section>

      {/* Agreement Actions Section */}
      <section className="zd-section" aria-label="Agreement Generation Actions">
        <div className="zd-section-header" style={{ marginBottom: 'var(--zd-space-4)' }}>
          <h3 className="zd-section-title">Create New Agreement</h3>
          <p className="zd-section-subtitle">
            Purchase top-up credits or use pay-per-document to draft new agreements
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
              <span className="zd-action-card__rate" style={{ color: 'var(--zd-color-danger)' }}>
                0 Quota Left
              </span>
            </div>
            <div className="zd-action-card__content">
              <h4 className="zd-action-card__title">Rental Agreement</h4>
              <p className="zd-action-card__desc">
                Your monthly quota is exhausted. Top up 10 documents for ₹990 or renew early to generate new rental agreements.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              style={{ width: '100%' }}
              onClick={() => onNavigate && onNavigate('billing')}
            >
              Get Top-Up to Generate
            </Button>
          </div>

          <div className="zd-action-card">
            <div className="zd-action-card__top">
              <div className="zd-action-card__icon-box" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                </svg>
              </div>
              <span className="zd-action-card__rate" style={{ color: 'var(--zd-color-danger)' }}>
                0 Quota Left
              </span>
            </div>
            <div className="zd-action-card__content">
              <h4 className="zd-action-card__title">Other Agreements</h4>
              <p className="zd-action-card__desc">
                Commercial leases and customized broker legal documentation can be drafted after adding quota credits.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              style={{ width: '100%' }}
              onClick={() => onNavigate && onNavigate('billing')}
            >
              Get Top-Up to Generate
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
