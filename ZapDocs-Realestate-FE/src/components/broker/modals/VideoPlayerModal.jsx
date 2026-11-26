import React from 'react';
import { PlayCircle, Play } from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';

export default function VideoPlayerModal({ title }) {
  const { closeModal } = useBrokerState();
  const guideTitle = title || 'How to resend signature link';

  return (
    <div className="modal-overlay active" id="modal-video-player">
      <div className="modal-card zd-glass-modal">
        <div className="modal-header">
          <div className="modal-title" id="video-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlayCircle size={18} color="#2563eb" />
            <span>{guideTitle} (30s Guide)</span>
          </div>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-body">
          <div
            style={{
              aspectRatio: '16/9',
              background: '#0f172a',
              borderRadius: 'var(--radius-md, 10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              padding: '20px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}
            >
              <Play size={24} color="#ffffff" fill="#ffffff" style={{ marginLeft: 2 }} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700 }} id="video-sim-name">
              {guideTitle}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Ultra-fast 30s screen-walkthrough optimized for high-pressure field usage.
            </div>
          </div>
          <div style={{ marginTop: '14px', fontSize: '13px', color: 'var(--text-muted, #64748b)', lineHeight: 1.5 }} id="video-sim-desc">
            Step 1: Open the client agreement row.<br />
            Step 2: Tap the WhatsApp icon to trigger instant OTP SMS and WhatsApp link reissue.<br />
            Step 3: Signature status updates to completed in real-time.
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={closeModal}>Got it</button>
        </div>
      </div>
    </div>
  );
}
