import Button from '../common/Button/Button';
import './Dashboard.css';

export default function ReferEarnBanner({ onNavigate }) {
  return (
    <section className="zd-refer-banner" aria-label="Refer & Earn Promotion">
      <div className="zd-refer-banner__left">
        <div className="zd-refer-banner__icon-box" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
        </div>
        <div className="zd-refer-banner__content">
          <span className="zd-refer-banner__title">Partner Referral Program</span>
          <p className="zd-refer-banner__text">
            ₹50 per eligible referral after app download and signup
          </p>
        </div>
      </div>

      <Button
        variant="secondary"
        size="md"
        className="zd-refer-banner__btn"
        onClick={() => {
          if (onNavigate) {
            onNavigate('refer');
          }
        }}
      >
        Refer & Earn ₹50
      </Button>
    </section>
  );
}
