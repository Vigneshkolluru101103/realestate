import React, { useState } from 'react';
import { Lock, CircleCheck, CircleX, Clock, Smartphone, CreditCard, RefreshCw, Landmark } from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';

export default function RazorpayCheckoutModal({ order }) {
  const { closeModal, handleRazorpaySuccess, bankDetails, addAgreement, showToast } = useBrokerState();

  const [subView, setSubView] = useState('methods'); // 'methods' | 'processing' | 'success' | 'failure' | 'pending'
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [successData, setSuccessData] = useState(null);

  const amount = order?.amount || 5000;
  const subtotal = (amount / 1.18).toFixed(2);
  const gst = (amount - subtotal).toFixed(2);

  function simulateOutcome(outcome) {
    setSubView('processing');
    setTimeout(() => {
      if (outcome === 'success') {
        const res = handleRazorpaySuccess(order);
        setSuccessData(res);
        setSubView('success');

        // If this was pay-per-doc agreement execution, add agreement directly
        if (order.type === 'paydoc' && order.agreementData) {
          addAgreement(order.agreementData);
        }
      } else if (outcome === 'failure') {
        setSubView('failure');
        showToast('Payment Failed: Bank declined transaction. No credits deducted.');
      } else if (outcome === 'pending') {
        setSubView('pending');
        showToast('Payment Pending: Awaiting NeSL / Bank webhook confirmation.');
      }
    }, 800);
  }

  function handlePayNow() {
    simulateOutcome('success');
  }

  return (
    <div className="modal-overlay active" id="modal-razorpay-checkout">
      <div className="modal-card razorpay-card" style={{ maxWidth: '520px', overflow: 'hidden', borderRadius: 'var(--radius-xl, 20px)' }}>
        {/* Razorpay Dark Header */}
        <div style={{ background: '#02042b', color: 'white', padding: '20px 24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  background: '#0c2340',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  color: '#528ff0',
                  fontSize: '16px',
                  border: '1px solid rgba(82, 143, 240, 0.3)'
                }}
              >
                ZD
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>ZapDocs Technologies Pvt Ltd</div>
                <div style={{ fontSize: '11.5px', color: '#94a3b8' }} id="rzp-order-title">
                  {order?.title || 'Professional Plan Renewal (100 Docs)'}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
              onClick={closeModal}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '18px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
                Total Payable
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#528ff0', fontFamily: 'var(--font-mono, monospace)' }} id="rzp-display-amount">
                ₹{Number(amount).toLocaleString('en-IN')}.00
              </div>
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#38bdf8',
                background: 'rgba(56,189,248,0.12)',
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(56,189,248,0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Lock size={12} />
              <span>Razorpay Secured • 256-bit SSL</span>
            </div>
          </div>
        </div>

        {/* Simulation State Testing Bar */}
        <div style={{ background: '#f1f5f9', padding: '10px 16px', borderBottom: '1px solid var(--border-color, #eaecf0)', fontSize: '11.5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, color: '#475467' }}>SIMULATE RAZORPAY GATEWAY RESPONSE:</span>
            <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '10px' }}>Verify all interaction branches</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: '6px' }}>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: '#ecfdf3', color: '#027a48', border: '1px solid #abefc6', padding: '4px 8px', fontSize: '11px', fontWeight: 700, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => simulateOutcome('success')}
            >
              <CircleCheck size={12} />
              <span>Success</span>
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: '#fef3f2', color: '#b42318', border: '1px solid #fecdca', padding: '4px 8px', fontSize: '11px', fontWeight: 700, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => simulateOutcome('failure')}
            >
              <CircleX size={12} />
              <span>Bank Failure</span>
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: '#fffaeb', color: '#b54708', border: '1px solid #fedf89', padding: '4px 8px', fontSize: '11px', fontWeight: 700, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => simulateOutcome('pending')}
            >
              <Clock size={12} />
              <span>Pending Webhook</span>
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '20px 24px' }}>
          {/* VIEW 1: Methods Selection View */}
          {subView === 'methods' && (
            <div id="rzp-view-methods">
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main, #0f172a)', marginBottom: '8px' }}>
                  Select Payment Method:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    className={`rzp-method-btn ${selectedMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setSelectedMethod('upi')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <Smartphone size={20} color="#2563eb" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>UPI (Google Pay, PhonePe, Paytm, QR)</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>
                        Auto-detected UPI: {bankDetails.upiId || 'rajesh@okaxis'}
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700 }}>FASTEST</span>
                  </button>

                  <button
                    type="button"
                    className={`rzp-method-btn ${selectedMethod === 'cards' ? 'active' : ''}`}
                    onClick={() => setSelectedMethod('cards')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <CreditCard size={20} color="#475467" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>Credit &amp; Debit Cards</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>Visa, MasterCard, RuPay, Corporate Cards</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`rzp-method-btn ${selectedMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setSelectedMethod('netbanking')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <Landmark size={20} color="#475467" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>NetBanking (All Indian Banks)</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>HDFC, ICICI, SBI, Axis, Kotak</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tax Invoice Preview within Checkout */}
              <div style={{ background: '#f8fafc', border: '1px solid #eaecf0', borderRadius: 'var(--radius-sm, 6px)', padding: '12px', fontSize: '12px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>Taxable Subtotal:</span>
                  <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>18% GST (9% CGST + 9% SGST):</span>
                  <span>₹{Number(gst).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed #cbd5e1', fontWeight: 800, fontSize: '13px' }}>
                  <span>Total Chargeable:</span>
                  <span style={{ color: '#2563eb' }}>₹{Number(amount).toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  id="btn-rzp-pay-now"
                  style={{ flex: 2, justifyContent: 'center', background: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={handlePayNow}
                >
                  <Lock size={14} />
                  <span>Pay Securely via Razorpay</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: Processing Spinner View */}
          {subView === 'processing' && (
            <div id="rzp-view-processing" style={{ textAlign: 'center', padding: '36px 12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #dbeafe',
                  borderTopColor: '#2563eb',
                  borderRadius: '50%',
                  animation: 'btnSpin 0.8s linear infinite',
                  margin: '0 auto 16px'
                }}
              />
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>Connecting with Issuing Bank...</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748b)', marginTop: '6px' }}>
                Authenticating transaction with Razorpay settlement engine. Do not press back or refresh.
              </div>
            </div>
          )}

          {/* VIEW 3: Payment Success View */}
          {subView === 'success' && (
            <div id="rzp-view-success" style={{ textAlign: 'center', padding: '20px 8px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#ecfdf3',
                  color: '#027a48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  margin: '0 auto 12px',
                  border: '2px solid #abefc6'
                }}
              >
                ✓
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#027a48' }}>Payment Verified Successfully!</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>
                Razorpay Payment ID: <strong style={{ fontFamily: 'var(--font-mono, monospace)' }}>{successData?.paymentId || 'pay_998412891'}</strong>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #eaecf0', borderRadius: 'var(--radius-sm, 6px)', padding: '12px', margin: '16px 0', textAlign: 'left', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>Credits Added:</span>
                  <strong style={{ color: '#027a48' }}>
                    {order?.type === 'plan' ? '+100 Pro Document Quota' : order?.type === 'topup' ? `+${order.docs} Document Credits` : 'Pay-Per-Doc Verified (1 Doc)'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>GST Tax Invoice:</span>
                  <strong style={{ fontFamily: 'var(--font-mono, monospace)' }}>{successData?.newInvoiceId || 'INV-2026-1003'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>Post-Payment Status:</span>
                  <span className="badge badge-success">Backend Verified &amp; Credited</span>
                </div>
              </div>

              <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeModal}>
                Done / Return to Platform
              </button>
            </div>
          )}

          {/* VIEW 4: Bank Failure View */}
          {subView === 'failure' && (
            <div id="rzp-view-failure" style={{ textAlign: 'center', padding: '20px 8px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#fef3f2',
                  color: '#b42318',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  margin: '0 auto 12px',
                  border: '2px solid #fecdca'
                }}
              >
                ✕
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#b42318' }}>Payment Failed</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>
                Bank Error: <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#b42318' }}>ISSUER_GATEWAY_TIMEOUT_OR_INSUFFICIENT_FUNDS</span>
              </div>

              <div style={{ background: '#fffbfa', border: '1px solid #fecdca', borderRadius: 'var(--radius-sm, 6px)', padding: '12px', margin: '16px 0', textAlign: 'left', fontSize: '12px', color: '#7a271a' }}>
                <strong>Safe State Maintained:</strong> No funds were captured. Quota was NOT credited. You can safely retry or use another payment method without risking duplicate charges.
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setSubView('methods')}>
                  <RefreshCw size={14} />
                  <span>Retry Payment</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 5: Pending Webhook View */}
          {subView === 'pending' && (
            <div id="rzp-view-pending" style={{ textAlign: 'center', padding: '20px 8px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: '#fffaeb',
                  color: '#b54708',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  border: '1px solid #fedf89'
                }}
              >
                <Clock size={28} color="#b54708" />
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#b54708' }}>Payment Verification Pending</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>
                Awaiting webhook settlement confirmation from issuing bank...
              </div>

              <div style={{ background: '#fffdf5', border: '1px solid #fedf89', borderRadius: 'var(--radius-sm, 6px)', padding: '12px', margin: '16px 0', textAlign: 'left', fontSize: '12px', color: '#78350f' }}>
                <strong>Duplicate Protection Guard:</strong> Per ZapDocs security specifications, credits and invoices are held until the backend webhook handshake finishes to prevent unverified crediting.
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={closeModal}>
                  Check Later
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  id="btn-rzp-verify-now"
                  style={{ flex: 2, justifyContent: 'center', background: '#b54708', borderColor: '#b54708' }}
                  onClick={() => simulateOutcome('success')}
                >
                  ⚡ Verify &amp; Credit Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
