import React from 'react';
import { AlertTriangle, FileDown, MessageCircle, Clock, CircleCheck, User, Users, CheckCheck } from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';
import './DraftPdfWarningModal.css';

export default function DraftPdfWarningModal({ agreement }) {
  const { agreements, closeModal, downloadWatermarkedDraft, dispatchWhatsApp } = useBrokerState();

  // Resolve agreement if an ID string was passed, or find updated version in state
  const agr = typeof agreement === 'string'
    ? agreements.find((a) => a.id === agreement)
    : (agreement && agreement.id ? (agreements.find((a) => a.id === agreement.id) || agreement) : agreement);

  if (!agr || !agr.id) {
    return (
      <div className="modal-overlay active" id="modal-draft-pdf-warning">
        <div className="modal-card zd-glass-modal">
          <div className="modal-header">
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#d97706" />
              <span>Agreement Not Found</span>
            </div>
            <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">✕</button>
          </div>
          <div className="modal-body">
            <div style={{ background: '#fffbfa', border: '1px solid #fecdca', borderRadius: 'var(--radius-md, 10px)', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#b42318', marginBottom: '4px' }}>Invalid Agreement Data:</div>
              <div style={{ fontSize: '12.5px', color: '#7a271a', lineHeight: 1.4 }}>
                The agreement information could not be located. Please close this dialog and select a valid agreement from the table.
              </div>
            </div>
          </div>
          <div className="modal-footer draft-warning-footer">
            <button type="button" className="btn btn-outline" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Derive signing progress from badges and workflow state
  const badges = agr.badges || [];
  const tenantHasSigned = badges.includes('Tenant Signed') || badges.includes('Awaiting Landlord e-Sign');
  const signedCount = tenantHasSigned ? 1 : 0;
  const totalParties = 2;
  const progressPct = Math.round((signedCount / totalParties) * 100);

  return (
    <div className="modal-overlay active" id="modal-draft-pdf-warning">
      <div className="modal-card zd-glass-modal">
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#d97706" />
            <span>Agreement Awaiting Signatures</span>
          </div>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-body">
          {/* Notice Box */}
          <div style={{ background: '#fffbfa', border: '1px solid #fecdca', borderRadius: 'var(--radius-md, 10px)', padding: '14px', marginBottom: '14px' }}>
            <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#b42318', marginBottom: '4px' }}>Pending e-Sign Notice:</div>
            <div style={{ fontSize: '12.5px', color: '#7a271a', lineHeight: 1.4 }}>
              Agreement <strong id="draft-warn-id">{agr.id}</strong> ({agr.tenantName || 'Pending Parties'}) has not yet been signed by all parties. The court-admissible certificate copy is generated only upon final execution.
            </div>
          </div>

          {/* Signing Progress Indicator */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={13} color="#d97706" /> Signing Progress ({signedCount} of {totalParties} signed)
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: tenantHasSigned ? '#2563eb' : '#d97706' }}>
                {progressPct}%
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #d97706, #2563eb)',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Pending Parties Breakdown */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users size={12} /> Pending Parties Status
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Tenant Party */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={14} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{agr.tenantName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Primary Tenant • indiranagar</div>
                  </div>
                </div>
                {tenantHasSigned ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#15803d', background: '#dcfce7', border: '1px solid #86efac', padding: '2px 8px', borderRadius: '9999px' }}>
                    <CircleCheck size={11} /> Signed
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#b45309', background: '#fef3c7', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '9999px' }}>
                    <Clock size={11} /> Awaiting Sign
                  </span>
                )}
              </div>

              {/* Landlord Party */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={14} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{agr.ownerName || 'Property Owner'}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Property Owner / Landlord</div>
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#b45309', background: '#fef3c7', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '9999px' }}>
                  <Clock size={11} /> Awaiting Sign
                </span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', lineHeight: 1.4 }}>
            You may download an unexecuted draft copy with a security watermark, or resend the WhatsApp signature link to pending parties.
            {agr.whatsappDispatches > 0 && (
              <span style={{ display: 'block', marginTop: '4px', color: '#047857', fontWeight: 600 }}>
                Signature link previously dispatched {agr.whatsappDispatches} time(s).
              </span>
            )}
          </div>
        </div>
        <div className="modal-footer draft-warning-footer" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            id="btn-download-watermarked"
            onClick={() => downloadWatermarkedDraft(agr)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FileDown size={14} />
            <span>Download Watermarked Draft</span>
          </button>
          <button
            type="button"
            className="btn btn-sm zd-glass-wa-btn zd-glass-wa-btn--primary"
            id="btn-draft-resend-link"
            onClick={() => {
              closeModal();
              dispatchWhatsApp(agr.id);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '36px', padding: '0 14px' }}
          >
            <MessageCircle size={15} />
            <span>Resend WhatsApp Signature Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}
