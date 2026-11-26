import React, { useRef } from 'react';
import { Gift, MessageCircle } from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';
import { useNavigate } from 'react-router-dom';

export default function ReferEarnModal() {
  const { closeModal, referrals, bankDetails, showToast } = useBrokerState();
  const linkRef = useRef(null);
  const navigate = useNavigate();

  const totalEarned = referrals
    .filter((r) => r.status && r.status.includes('Paid'))
    .reduce((acc, r) => acc + (parseFloat(r.amount.replace(/[^0-9.]/g, '')) || 50), 0);

  function copyReferralLink() {
    if (linkRef.current) {
      linkRef.current.select();
      navigator.clipboard.writeText(linkRef.current.value);
      showToast('Referral link copied to clipboard!');
    }
  }

  function shareWhatsApp() {
    const text = `Join ZapDocs using my broker invite link: https://zapdocs.in/join?ref=RAJESH50 - Generate legally compliant rental agreements with instant e-Stamp & Aadhaar e-Sign in 2 minutes!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    showToast('Opening WhatsApp to share referral invite...');
  }

  function handleChangeUpi() {
    closeModal();
    navigate('/broker/bank-upi');
  }

  return (
    <div className="modal-overlay active" id="modal-refer-earn">
      <div className="modal-card zd-glass-modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gift size={18} color="#059669" />
            <span>Refer &amp; Earn ₹50 Instant Cash</span>
          </div>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              backdropFilter: 'blur(8px)'
            }}>
              <Gift size={26} color="#059669" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main, #0f172a)', letterSpacing: '-0.01em' }}>
              Earn ₹50 per Broker Referral
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748b)', maxWidth: '440px', margin: '4px auto 0' }}>
              Share ZapDocs with real estate brokers. The moment they download the app and register, ₹50 is directly credited to your UPI ID within 60 seconds.
            </p>
          </div>

          <div style={{ padding: '14px', background: '#f8fafc', border: '1px solid #eaecf0', borderRadius: 'var(--radius-md, 10px)', marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Your Unique Referral Link &amp; Code
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                ref={linkRef}
                type="text"
                className="form-control"
                id="referral-link-input"
                defaultValue="https://zapdocs.in/join?ref=RAJESH50"
                readOnly
                style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}
              />
              <button type="button" className="btn btn-primary" onClick={copyReferralLink}>
                Copy
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              border: '1.5px solid #abefc6',
              background: '#ecfdf3',
              borderRadius: 'var(--radius-md, 10px)',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#027a48' }}>Active UPI Destination:</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#065f46' }} id="refer-modal-upi-display">
                {bankDetails.upiId || 'rajesh@okaxis'}
              </div>
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleChangeUpi}>
              Change UPI
            </button>
          </div>

          {/* Live Referral Earnings Ledger Table */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                Recent Referral Payout Ledger
              </div>
              <span className="badge badge-success" id="referral-total-earned-badge">
                Total Earned: ₹{totalEarned.toFixed(2)}
              </span>
            </div>
            <div className="table-container" style={{ maxHeight: '160px', overflowY: 'auto' }}>
              <table className="custom-table" style={{ fontSize: '11.5px' }}>
                <thead>
                  <tr>
                    <th>Broker</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payout Status</th>
                  </tr>
                </thead>
                <tbody id="referral-ledger-body">
                  {referrals.map((ref, idx) => (
                    <tr key={idx}>
                      <td><strong>{ref.broker}</strong></td>
                      <td>{ref.date}</td>
                      <td><span style={{ fontWeight: 700, color: '#027a48' }}>{ref.amount}</span></td>
                      <td><span style={{ fontSize: '11px' }}>{ref.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-lg zd-glass-wa-btn zd-glass-wa-btn--primary"
            style={{ width: '100%', justifyContent: 'center', height: '46px', fontSize: '14px', gap: '8px' }}
            onClick={shareWhatsApp}
          >
            <MessageCircle size={18} />
            <span>Share via WhatsApp to Broker Groups</span>
          </button>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
}
