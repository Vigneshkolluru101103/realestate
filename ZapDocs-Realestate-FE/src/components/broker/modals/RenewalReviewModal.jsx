import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';

export default function RenewalReviewModal({ agreement }) {
  const { closeModal, executeRenewal } = useBrokerState();

  const source = agreement || {
    id: 'ZD-8720',
    tenantName: 'Kavita Nair',
    ownerName: 'M. S. Murthy',
    propertyArea: 'Whitefield EPIP Zone',
    rent: 45000,
    deposit: 225000
  };

  const baseRent = source.rent || 45000;
  const [escalation, setEscalation] = useState(5);
  const [rent, setRent] = useState(Math.round(baseRent * 1.05));
  const [deposit, setDeposit] = useState(Math.round(baseRent * 1.05) * 5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleEscalationSelect(pct) {
    setEscalation(pct);
    const newRentVal = Math.round(baseRent * (1 + pct / 100));
    setRent(newRentVal);
    setDeposit(newRentVal * 5);
  }

  function handleRentChange(val) {
    const num = Number(val) || 0;
    setRent(num);
    setDeposit(num * 5);
  }

  function handleExecute() {
    setIsSubmitting(true);
    setTimeout(() => {
      executeRenewal(source, rent, deposit);
      setIsSubmitting(false);
    }, 700);
  }

  return (
    <div className="modal-overlay active" id="modal-renewal-review">
      <div className="modal-card" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div className="modal-title" id="renewal-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={18} />
            <span>Safe 1-Click Lease Renewal Review</span>
          </div>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-body">
          <div style={{ background: 'rgba(248, 250, 252, 0.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(220, 232, 248, 0.85)', borderRadius: 'var(--radius-md, 10px)', padding: '14px', marginBottom: '16px', fontSize: '12.5px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted, #64748b)', marginBottom: '6px' }}>
              Original Lease Reference
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Agreement ID:</span>
              <strong style={{ fontFamily: 'var(--font-mono, monospace)' }}>{source.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Tenant &amp; Landlord:</span>
              <strong>{source.tenantName} / {source.ownerName || 'Property Owner'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Property Location:</span>
              <span>{source.propertyArea}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Current Monthly Rent:</span>
              <strong>₹{Number(baseRent).toLocaleString('en-IN')} / month</strong>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>
              Select Standard Escalation for Renewed Term:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginBottom: '10px' }}>
              <button
                type="button"
                className={`btn btn-sm escalation-btn ${escalation === 0 ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'center', fontSize: '11.5px' }}
                onClick={() => handleEscalationSelect(0)}
              >
                0% (₹{Number(baseRent).toLocaleString('en-IN')})
              </button>
              <button
                type="button"
                className={`btn btn-sm escalation-btn ${escalation === 5 ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'center', fontSize: '11.5px' }}
                onClick={() => handleEscalationSelect(5)}
              >
                +5% (₹{Number(Math.round(baseRent * 1.05)).toLocaleString('en-IN')}) ⭐
              </button>
              <button
                type="button"
                className={`btn btn-sm escalation-btn ${escalation === 10 ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'center', fontSize: '11.5px' }}
                onClick={() => handleEscalationSelect(10)}
              >
                +10% (₹{Number(Math.round(baseRent * 1.1)).toLocaleString('en-IN')})
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Adjusted Monthly Rent (₹)</label>
              <input
                type="number"
                className="form-control"
                id="renewal-new-rent"
                value={rent}
                onChange={(e) => handleRentChange(e.target.value)}
              />
            </div>
          </div>

          <div className="bank-form-grid" style={{ marginBottom: '14px' }}>
            <div className="form-group">
              <label className="form-label">Adjusted Security Deposit (₹)</label>
              <input
                type="number"
                className="form-control"
                id="renewal-new-deposit"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value) || 0)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Term Duration</label>
              <input
                type="text"
                className="form-control"
                id="renewal-new-term"
                value="11 Months (Nov 2026 - Oct 2027)"
                readOnly
              />
            </div>
          </div>

          <div style={{ background: '#eff8ff', border: '1px solid #dbeafe', borderRadius: 'var(--radius-sm, 6px)', padding: '10px 14px', fontSize: '12px', color: '#175cd3' }}>
            ⚡ <strong>Quota Allocation:</strong> Renewing this lease will utilize <strong>1 Document Credit</strong> from your Professional Tier quota.
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={closeModal}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-primary ${isSubmitting ? 'btn-loading' : ''}`}
            id="btn-execute-renewal"
            onClick={handleExecute}
            disabled={isSubmitting}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} />
            <span>Execute Renewed Lease &amp; Send Links</span>
          </button>
        </div>
      </div>
    </div>
  );
}
