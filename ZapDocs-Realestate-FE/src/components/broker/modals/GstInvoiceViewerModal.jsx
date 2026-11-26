import React from 'react';
import { CircleCheck, Printer, FileText } from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';

export default function GstInvoiceViewerModal({ invoiceId }) {
  const { invoices, closeModal } = useBrokerState();

  const inv = invoices.find((i) => i.id === invoiceId) || invoices[0] || {
    id: 'INV-2026-1002',
    date: '15 Oct 2026',
    desc: 'Professional Tier (100 Docs)',
    amount: 5000,
    status: 'Paid',
    paymentId: 'pay_1002891'
  };

  const amount = inv.amount || 5000;
  const subtotal = (amount / 1.18).toFixed(2);
  const cgst = ((amount - subtotal) / 2).toFixed(2);
  const sgst = cgst;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="modal-overlay active" id="modal-gst-invoice-viewer">
      <div className="modal-card" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} />
            <span>Official GST Tax Invoice</span>
          </div>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-body" id="invoice-printable-area">
          {/* Invoice Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '16px',
              borderBottom: '2px solid #0f172a',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                ZapDocs Technologies Pvt Ltd
              </div>
              <div style={{ fontSize: '11.5px', color: '#475467', lineHeight: 1.4, marginTop: '2px' }}>
                Tower B, 4th Floor, Sector 2, HSR Layout, Bengaluru, Karnataka 560102<br />
                <strong>GSTIN:</strong> 29AABCZ1234F1Z5 | <strong>PAN:</strong> AABCZ1234F<br />
                <strong>CIN:</strong> U72900KA2024PTC182910
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-success" style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CircleCheck size={12} />
                <span>TAX INVOICE - PAID</span>
              </span>
              <div style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)', marginTop: '6px' }}>
                {inv.id}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)' }}>Date: {inv.date}</div>
            </div>
          </div>

          {/* Bill To Section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              background: 'rgba(248, 250, 252, 0.82)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(220, 232, 248, 0.85)',
              borderRadius: 'var(--radius-sm, 6px)',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted, #64748b)' }}>
                Billed To (Broker):
              </div>
              <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>Rajesh Kumar Sharma</div>
              <div style={{ color: '#475467' }}>Broker Vault ID: ZD-BRK-4019</div>
              <div style={{ color: '#475467' }}>Place of Supply: Karnataka (Code: 29)</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted, #64748b)' }}>
                Payment Details:
              </div>
              <div><strong>Mode:</strong> Razorpay Gateway (Instant UPI / Cards)</div>
              <div><strong>Transaction Ref:</strong> <code style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px' }}>{inv.paymentId || 'pay_1002891'}</code></div>
              <div><strong>SAC Code:</strong> 998314 (Legal &amp; IT SaaS Solutions)</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '14px' }}>
            <table className="custom-table" style={{ fontSize: '12px', minWidth: '420px', margin: 0 }}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>SAC Code</th>
                  <th>Taxable Base</th>
                  <th>CGST (9%)</th>
                  <th>SGST (9%)</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{inv.desc}</strong></td>
                  <td>998314</td>
                  <td>₹{Number(subtotal).toLocaleString('en-IN')}</td>
                  <td>₹{Number(cgst).toLocaleString('en-IN')}</td>
                  <td>₹{Number(sgst).toLocaleString('en-IN')}</td>
                  <td style={{ textAlign: 'right', fontWeight: 800 }}>₹{Number(amount).toLocaleString('en-IN')}.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px', paddingTop: '10px', borderTop: '1px solid #eaecf0' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', maxWidth: '380px' }}>
              This is a computer-generated tax invoice verified under Section 31 of the CGST Act 2017. Valid for claiming Input Tax Credit (ITC).
            </div>
            <div style={{ textAlign: 'center', border: '1px dashed #cbd5e1', padding: '6px 14px', borderRadius: 'var(--radius-sm, 6px)', fontSize: '11px', background: '#fff' }}>
              <div style={{ color: '#027a48', fontWeight: 800 }}>✓ DIGITALLY SIGNED</div>
              <div style={{ color: '#64748b', fontSize: '10px' }}>ZapDocs Authority CA</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={closeModal}>Close</button>
          <button type="button" className="btn btn-primary" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={14} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
