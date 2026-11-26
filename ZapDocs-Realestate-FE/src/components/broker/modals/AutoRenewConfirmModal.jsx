import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';

export default function AutoRenewConfirmModal() {
  const { cancelAutoRenewToggle, confirmTurnOffAutoRenew } = useBrokerState();

  return (
    <div className="modal-overlay active" id="modal-auto-renew-confirm">
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#b42318" />
            <span>Disable Automatic Monthly Renewal?</span>
          </div>
          <button className="modal-close-btn" onClick={cancelAutoRenewToggle} aria-label="Cancel">✕</button>
        </div>
        <div className="modal-body">
          <div style={{ padding: '14px', background: 'rgba(255, 251, 250, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(254, 205, 202, 0.9)', borderRadius: 'var(--radius-md, 10px)', marginBottom: '14px' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#b42318', marginBottom: '4px' }}>Important Tier Consequences:</div>
            <div style={{ fontSize: '12.5px', color: '#7a271a', lineHeight: 1.5 }}>
              If auto-renew is paused, your Professional Tier quota will expire on <strong>15 Nov 2026</strong>. Any agreements generated after expiration will be charged at the Pay-Per-Doc rate of <strong>₹99 per agreement</strong> instead of your discounted <strong>₹50/doc</strong> rate.
            </div>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748b)', lineHeight: 1.4 }}>
            Are you sure you want to pause automatic billing? You can re-enable it at any time before the billing cycle ends.
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={cancelAutoRenewToggle} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} />
            <span>Keep Auto-Renew ON (Recommended)</span>
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ color: '#b42318', borderColor: '#fecdca' }}
            onClick={confirmTurnOffAutoRenew}
          >
            Turn Off Auto-Renew
          </button>
        </div>
      </div>
    </div>
  );
}
