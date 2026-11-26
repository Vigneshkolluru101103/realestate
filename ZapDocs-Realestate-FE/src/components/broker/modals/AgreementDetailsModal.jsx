import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CircleCheck,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileDown,
  Building,
  User,
  Calendar,
  Hash,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';
import './AgreementDetailsModal.css';

export default function AgreementDetailsModal({ agreement }) {
  const { agreements, closeModal, downloadLegalPdf, downloadWatermarkedDraft } = useBrokerState();
  const navigate = useNavigate();

  // Resolve agreement if an ID string was passed, or find updated version in state
  const agr = typeof agreement === 'string'
    ? agreements.find((a) => a.id === agreement)
    : (agreement && agreement.id ? (agreements.find((a) => a.id === agreement.id) || agreement) : agreement);

  if (!agr || !agr.id) {
    return (
      <div className="modal-overlay active" id="modal-agreement-details">
        <div className="modal-card zd-glass-modal" style={{ maxWidth: '480px' }}>
          <div className="modal-header">
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#d97706" />
              <span>Agreement Record Not Found</span>
            </div>
            <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">✕</button>
          </div>
          <div className="modal-body">
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Unable to locate the agreement record details. Please select a valid agreement from the table.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = agr.status === 'Completed';
  const isExpiring = agr.status === 'Expiring Soon';
  const isPending = agr.status === 'Pending e-Sign';
  const isDraft = agr.status === 'Draft';

  function formatCurrency(val) {
    if (!val) return '₹0';
    const str = String(val).trim();
    if (str.startsWith('₹')) return str;
    const num = Number(str.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? str : `₹${num.toLocaleString('en-IN')}`;
  }

  function handleVaultNavigation() {
    closeModal();
    navigate('/broker/agreements');
  }

  return (
    <div className="modal-overlay active" id="modal-agreement-details">
      <div className="modal-card zd-glass-modal zd-details-modal-card">
        {/* Modal Header */}
        <div className="modal-header zd-details-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div className="zd-details-icon-box">
              <FileText size={18} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                Agreement Details &amp; Preview
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                ID: <strong style={{ color: '#2563eb' }}>{agr.id}</strong> • {agr.type}
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">✕</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body zd-details-body">
          {/* Status Banner */}
          <div className="zd-details-banner">
            <div className="zd-details-banner__status">
              <span
                className={`zd-recent-status-badge ${
                  isCompleted
                    ? 'zd-recent-status-badge--completed'
                    : isExpiring
                    ? 'zd-recent-status-badge--expiring'
                    : isDraft
                    ? 'zd-recent-status-badge--draft'
                    : 'zd-recent-status-badge--pending'
                }`}
                style={{ fontSize: '13px', padding: '4px 11px' }}
              >
                {isCompleted && <CircleCheck size={14} />}
                {isExpiring && <AlertTriangle size={14} />}
                {isDraft && <FileText size={14} />}
                {!isCompleted && !isExpiring && !isDraft && <Clock size={14} />}
                <span>{agr.status}</span>
              </span>
              <span className="zd-details-badge-date">
                <Calendar size={13} /> {agr.date}
              </span>
            </div>
            <div className="zd-details-type-pill">{agr.type}</div>
          </div>

          {/* Two-Column Details Grid */}
          <div className="zd-details-grid">
            {/* Left Card: Customer & Parties */}
            <div className="zd-details-section-box">
              <div className="zd-details-section-title">
                <User size={14} color="#2563eb" />
                <span>Contracting Parties</span>
              </div>
              <div className="zd-details-row">
                <span className="zd-details-label">Tenant:</span>
                <span className="zd-details-val" id="details-tenant-name">
                  <strong>{agr.tenantName}</strong> <span className="zd-client-tag">(Tenant)</span>
                </span>
              </div>
              <div className="zd-details-row">
                <span className="zd-details-label">Owner / Landlord:</span>
                <span className="zd-details-val" id="details-owner-name">
                  <strong>{agr.ownerName || 'Property Owner'}</strong> <span className="zd-client-subtag">(Owner)</span>
                </span>
              </div>
              <div className="zd-details-row">
                <span className="zd-details-label">Premises:</span>
                <span className="zd-details-val" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Building size={13} color="#64748b" /> {agr.propertyArea}
                </span>
              </div>
            </div>

            {/* Right Card: Financial & Terms */}
            <div className="zd-details-section-box">
              <div className="zd-details-section-title">
                <ShieldCheck size={14} color="#059669" />
                <span>Commercial Terms</span>
              </div>
              <div className="zd-details-row">
                <span className="zd-details-label">Monthly Rent:</span>
                <span className="zd-details-val" style={{ color: '#15803d', fontWeight: 700 }}>
                  {formatCurrency(agr.rent)} / month
                </span>
              </div>
              <div className="zd-details-row">
                <span className="zd-details-label">Security Deposit:</span>
                <span className="zd-details-val" style={{ fontWeight: 700 }}>
                  {formatCurrency(agr.deposit)}
                </span>
              </div>
              <div className="zd-details-row">
                <span className="zd-details-label">Execution Date:</span>
                <span className="zd-details-val">{agr.date}</span>
              </div>
            </div>
          </div>

          {/* Legal Execution & Tamper-Evident Security Box */}
          <div className="zd-details-security-box">
            <div className="zd-details-security-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#059669" />
                <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#0f172a' }}>
                  Legal Validity &amp; Execution Security
                </span>
              </div>
              <span className="zd-security-pill">BSA 2023 Compliant</span>
            </div>
            <div className="zd-details-security-body">
              <div className="zd-security-row">
                <span className="zd-security-label">SHA-256 Hash:</span>
                <code className="zd-security-hash">{agr.shaHash || 'e102bc3a718c9f...41a2'}</code>
              </div>
              <div className="zd-security-row">
                <span className="zd-security-label">Evidentiary Standard:</span>
                <span style={{ fontSize: '11.5px', color: '#334155' }}>
                  Admissible in Court under Section 63 of Bharatiya Sakshya Adhiniyam, 2023.
                </span>
              </div>
            </div>
          </div>

          {/* Workflow Milestones (Preserved from existing application data) */}
          {agr.badges && agr.badges.length > 0 && (
            <div className="zd-details-milestones-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                <Layers size={13} color="#64748b" />
                <span>Workflow Progress &amp; Audit Milestones</span>
              </div>
              <div className="zd-details-milestones-list">
                {agr.badges.map((milestone, idx) => (
                  <span key={idx} className="zd-milestone-pill">
                    <CircleCheck size={12} color="#059669" />
                    <span>{milestone}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer zd-details-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleVaultNavigation}
            title="Open in My Agreements document vault"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ExternalLink size={14} />
            <span>Open in Agreements Vault</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(isCompleted || isExpiring) && (
              <button
                type="button"
                className="btn btn-primary"
                id="btn-modal-download-executed-pdf"
                onClick={() => {
                  closeModal();
                  downloadLegalPdf(agr, agr.shaHash);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FileDown size={14} />
                <span>Download Executed PDF</span>
              </button>
            )}

            {(isPending || isDraft) && (
              <button
                type="button"
                className="btn btn-primary"
                id="btn-modal-download-draft-pdf"
                onClick={() => {
                  closeModal();
                  downloadWatermarkedDraft(agr);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FileDown size={14} />
                <span>Download Watermarked Draft</span>
              </button>
            )}

            <button type="button" className="btn btn-outline" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
