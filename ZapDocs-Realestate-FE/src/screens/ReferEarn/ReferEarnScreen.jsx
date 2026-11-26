import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { getReferralRecords } from '../../mock/referralData';
import { getSavedUPI } from '../../mock/bankUpiData';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import './ReferEarn.css';

export default function ReferEarnScreen({ onNavigate }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'eligible'

  // Fetch mock referral records strictly belonging to the authenticated broker
  const records = getReferralRecords(user?.id);
  const currentUpi = getSavedUPI(user?.id, user?.upiId);

  // Generate deterministic referral credentials
  const referrerId = user?.id || 'partner';
  const firstName = user?.name ? user.name.split(' ')[0].toUpperCase() : 'BROKER';
  const referralCode = `${firstName}50`;
  const referralLink = `https://zapdocs.mock/join?ref=${referrerId}`;

  // WhatsApp share link
  const shareMessage = `Hi! Join ZapDocs using my broker invite link to create rental and legal agreements: ${referralLink}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  // Copy link handler
  function handleCopy() {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(referralLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  }

  function fallbackCopy() {
    try {
      const input = document.getElementById('referral-link-input');
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // ignore
    }
  }

  // Calculate metrics dynamically from the underlying records
  const totalReferrals = records.length;

  // Successful signups: referrals whose app download & signup eligibility has been confirmed
  const successfulSignups = records.filter((r) =>
    ['Registered', 'Eligible', 'Reward Pending'].includes(r.status)
  ).length;

  // Total rewards earned from confirmed eligible referrals
  const totalRewardsEarned = records
    .filter((r) => r.status === 'Eligible' || r.payoutStatus === 'Credited to UPI')
    .reduce((sum, r) => sum + (r.rewardAmount || 0), 0);

  // Pending rewards: distinguish awaiting payout vs awaiting eligibility confirmation
  const pendingPayoutList = records.filter(
    (r) => r.payoutStatus === 'Awaiting Payout' || r.status === 'Reward Pending'
  );
  const pendingPayoutAmount = pendingPayoutList.reduce((sum, r) => sum + (r.rewardAmount || 0), 0);
  const pendingEligibilityCount = records.filter(
    (r) => r.payoutStatus === 'Pending Eligibility' || r.status === 'Registered'
  ).length;

  // Filter records
  const filteredRecords = records.filter((r) => {
    if (filter === 'eligible') {
      return r.status === 'Eligible' || r.payoutStatus === 'Credited to UPI';
    }
    if (filter === 'pending') {
      return (
        r.payoutStatus === 'Awaiting Payout' ||
        r.payoutStatus === 'Pending Eligibility' ||
        r.status === 'Reward Pending' ||
        r.status === 'Registered' ||
        r.status === 'Downloaded' ||
        r.status === 'Invited'
      );
    }
    return true; // 'all'
  });

  // Badge helpers for statuses
  function getReferralStatusBadge(status) {
    switch (status) {
      case 'Eligible':
        return <Badge variant="success" size="sm">Eligible</Badge>;
      case 'Reward Pending':
        return <Badge variant="warning" size="sm">Reward Pending</Badge>;
      case 'Registered':
        return <Badge variant="primary" size="sm">Registered</Badge>;
      case 'Downloaded':
        return <Badge variant="neutral" size="sm">Downloaded</Badge>;
      case 'Invited':
      default:
        return <Badge variant="neutral" size="sm">Invited</Badge>;
    }
  }

  function getPayoutStatusBadge(status) {
    switch (status) {
      case 'Credited to UPI':
        return <Badge variant="success" size="sm">Credited to UPI</Badge>;
      case 'Awaiting Payout':
        return <Badge variant="warning" size="sm">Awaiting Payout</Badge>;
      case 'Pending Eligibility':
      default:
        return <Badge variant="neutral" size="sm">Pending Eligibility</Badge>;
    }
  }

  return (
    <div className="zd-refer-page">
      {/* 1. Referral Reward Banner */}
      <section className="zd-refer-hero" aria-label="Referral Program Overview">
        <span className="zd-refer-hero__tag">{t('refer_badge', 'Broker Referral Program')}</span>
        <h1 className="zd-refer-hero__headline">
          {t('refer_page_title', 'Invite Fellow Brokers & Earn ₹50 Directly to UPI')}
        </h1>
        <p className="zd-refer-hero__desc">
          {t('refer_page_subtitle', 'Earn ₹50 per eligible referral after their app download and signup.')}
        </p>

        {/* Share Box with Link & Actions */}
        <div className="zd-refer-share-box">
          <div className="zd-refer-share-box__label">
            {t('refer_link_label', 'Your Unique Referral Link')} (Code: <code>{referralCode}</code>)
          </div>

          <div className="zd-refer-link-row">
            <input
              id="referral-link-input"
              type="text"
              readOnly
              value={referralLink}
              className="zd-refer-link-input"
              aria-label="Your unique referral link"
              onClick={(e) => e.target.select()}
            />
          </div>

          <div className="zd-refer-actions-row">
            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="zd-btn zd-btn--md zd-btn-whatsapp"
              style={{ textDecoration: 'none' }}
              aria-label="Open WhatsApp to share referral invite"
            >
              <MessageCircle size={17} />
              <span>{t('btn_share_whatsapp', 'Invite via WhatsApp')}</span>
            </a>

            {/* Copy Link Button */}
            <Button
              variant="secondary"
              size="md"
              onClick={handleCopy}
              aria-label="Copy referral link to clipboard"
            >
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--zd-color-success)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{t('refer_link_copied', 'Link Copied!')}</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>{t('btn_copy_link', 'Copy Referral Link')}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Linked UPI Reward Information Card */}
      <section className="zd-upi-card" aria-label="UPI Payout Account Status">
        <div className="zd-upi-card__info">
          <div className="zd-upi-card__icon-box" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="zd-upi-card__details">
            <span className="zd-upi-card__label">Direct UPI Payout Destination</span>
            {currentUpi ? (
              <div className="zd-upi-card__value-row">
                <span className="zd-upi-card__value">{currentUpi}</span>
                <Badge variant="success" size="sm">Configured</Badge>
              </div>
            ) : (
              <div className="zd-upi-card__value-row">
                <span style={{ fontSize: 'var(--zd-font-size-sm)', color: 'var(--zd-color-warning)', fontWeight: 'var(--zd-font-weight-medium)' }}>
                  No UPI ID linked yet
                </span>
                <Badge variant="warning" size="sm">Action Required</Badge>
              </div>
            )}
          </div>
        </div>

        <Button
          variant={currentUpi ? 'ghost' : 'primary'}
          size="sm"
          onClick={() => onNavigate && onNavigate('bank-upi')}
        >
          {currentUpi ? 'Change in Bank & UPI Settings' : 'Configure UPI in Settings'}
        </Button>
      </section>

      {/* 3. Referral Summary Metrics Cards */}
      <section className="zd-metrics-grid" aria-label="Referral Performance Metrics">
        {/* Total Referrals */}
        <div className="zd-metric-card">
          <div className="zd-metric-card__header">
            <span className="zd-metric-card__label">{t('refer_stat_total', 'Total Referrals')}</span>
            <div className="zd-metric-card__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="zd-metric-card__value">{totalReferrals}</div>
          <span className="zd-metric-card__subtext">Total partners invited</span>
        </div>

        {/* Successful Signups */}
        <div className="zd-metric-card">
          <div className="zd-metric-card__header">
            <span className="zd-metric-card__label">{t('refer_stat_converted', 'Successful Signups')}</span>
            <div className="zd-metric-card__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <div className="zd-metric-card__value zd-metric-card__value--highlight">{successfulSignups}</div>
          <span className="zd-metric-card__subtext">App downloaded &amp; registered</span>
        </div>

        {/* Total Rewards Earned */}
        <div className="zd-metric-card">
          <div className="zd-metric-card__header">
            <span className="zd-metric-card__label">{t('refer_stat_earnings', 'Total Rewards Earned')}</span>
            <div className="zd-metric-card__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
          </div>
          <div className="zd-metric-card__value zd-metric-card__value--success">₹{totalRewardsEarned}</div>
          <span className="zd-metric-card__subtext">Earned from eligible signups</span>
        </div>

        {/* Pending Rewards */}
        <div className="zd-metric-card">
          <div className="zd-metric-card__header">
            <span className="zd-metric-card__label">Pending Rewards</span>
            <div className="zd-metric-card__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="zd-metric-card__value">₹{pendingPayoutAmount}</div>
          <span className="zd-metric-card__subtext">
            {pendingPayoutList.length} awaiting payout • {pendingEligibilityCount} awaiting confirmation
          </span>
        </div>
      </section>

      {/* 4. Referral History Section */}
      <section className="zd-history-section" aria-label="Referral Activity Records">
        <div className="zd-history-header">
          <div className="zd-history-title-box">
            <h2 className="zd-history-title">Referral History</h2>
            <span className="zd-history-subtitle">
              Detailed tracking of your referred brokers and reward disbursements
            </span>
          </div>

          {/* Filters Toolbar */}
          <div className="zd-filters-toolbar" role="toolbar" aria-label="Filter referral history">
            <button
              type="button"
              className={`zd-filter-pill ${filter === 'all' ? 'zd-filter-pill--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({records.length})
            </button>
            <button
              type="button"
              className={`zd-filter-pill ${filter === 'pending' ? 'zd-filter-pill--active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({pendingPayoutList.length + pendingEligibilityCount})
            </button>
            <button
              type="button"
              className={`zd-filter-pill ${filter === 'eligible' ? 'zd-filter-pill--active' : ''}`}
              onClick={() => setFilter('eligible')}
            >
              Eligible ({records.filter((r) => r.status === 'Eligible' || r.payoutStatus === 'Credited to UPI').length})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 ? (
          <div className="zd-empty-history">
            <div className="zd-empty-history__icon-box" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <h3 className="zd-empty-history__title">No referrals found</h3>
            <p className="zd-empty-history__desc">
              {records.length === 0
                ? "You haven't referred any fellow brokers yet. Share your unique link via WhatsApp to begin earning ₹50 directly to UPI once they sign up."
                : `There are no referrals matching the "${filter}" filter.`}
            </p>
            {records.length === 0 && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="zd-btn zd-btn--md zd-btn-whatsapp"
                style={{ textDecoration: 'none', marginTop: 'var(--zd-space-2)' }}
              >
                Invite via WhatsApp
              </a>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="zd-table-wrapper">
              <table className="zd-history-table">
                <thead>
                  <tr>
                    <th>Referred Broker</th>
                    <th>Referral Date</th>
                    <th>Referral Status</th>
                    <th>Reward Amount</th>
                    <th>Payout Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => (
                    <tr key={r.id}>
                      <td className="zd-broker-name">{r.brokerName}</td>
                      <td>{r.date}</td>
                      <td>{getReferralStatusBadge(r.status)}</td>
                      <td className="zd-reward-amount">
                        {r.rewardAmount > 0 ? `₹${r.rewardAmount}` : '—'}
                      </td>
                      <td>{getPayoutStatusBadge(r.payoutStatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="zd-mobile-history-cards">
              {filteredRecords.map((r) => (
                <div key={r.id} className="zd-mobile-history-card">
                  <div className="zd-mobile-card-row">
                    <span className="zd-broker-name">{r.brokerName}</span>
                    <span style={{ fontSize: 'var(--zd-font-size-xs)', color: 'var(--zd-text-muted)' }}>{r.date}</span>
                  </div>
                  <div className="zd-mobile-card-row">
                    <span className="zd-mobile-card-label">Referral Status:</span>
                    <div>{getReferralStatusBadge(r.status)}</div>
                  </div>
                  <div className="zd-mobile-card-row">
                    <span className="zd-mobile-card-label">Reward Amount:</span>
                    <span className="zd-reward-amount">
                      {r.rewardAmount > 0 ? `₹${r.rewardAmount}` : '—'}
                    </span>
                  </div>
                  <div className="zd-mobile-card-row">
                    <span className="zd-mobile-card-label">Payout Status:</span>
                    <div>{getPayoutStatusBadge(r.payoutStatus)}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* 5. Prototype Compliance Notice */}

    </div>
  );
}
