import React, { useState, useEffect } from 'react';
import { ShieldCheck, User } from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';
import GlassSelect from '../../common/GlassSelect';

export default function EditClientModal({ client }) {
  const { closeModal, updateClient, showToast } = useBrokerState();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Landlord');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [address, setAddress] = useState('');
  const [propsCount, setPropsCount] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (client) {
      setName(client.name || '');
      // Normalize role to match select options
      const isOwner = client.role === 'Landlord' || client.role === 'Landlord / Owner';
      setRole(isOwner ? 'Landlord' : 'Tenant');
      setPhone(client.phone || '');
      setAadhaar(client.aadhaar || '');
      setAddress(client.address || '');
      setPropsCount(client.propertiesCount !== undefined ? client.propertiesCount : 1);
      setErrors({});
    }
  }, [client]);

  // Handle escape key to close modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  if (!client) return null;

  function formatAadhaar(val) {
    let digits = val.replace(/[^0-9]/g, '');
    if (digits.length > 4) {
      digits = digits.substring(digits.length - 4);
    }
    if (digits.length === 4) {
      setAadhaar(`•••• •••• ${digits}`);
    } else {
      setAadhaar(val);
    }
  }

  function validate() {
    const errs = {};
    if (!name.trim() || name.trim().length < 3) {
      errs.name = 'Full name is required (min 3 characters).';
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      errs.phone = 'Enter valid 10-digit Indian mobile number (+91).';
    }
    const cleanAadhaar = aadhaar.replace(/[^0-9]/g, '');
    if (!aadhaar.trim() || cleanAadhaar.length < 4) {
      errs.aadhaar = 'Enter 4-12 digits. Last 4 digits are stored securely.';
    }
    if (!address.trim() || address.trim().length < 8) {
      errs.address = 'Address is required (min 8 characters).';
    }
    if (propsCount < 0 || isNaN(Number(propsCount))) {
      errs.propsCount = 'Linked properties count must be 0 or greater.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      showToast('⚠️ Please correct form errors before saving.');
      return;
    }

    let rawAadhaar = aadhaar.replace(/[^0-9]/g, '');
    if (rawAadhaar.length >= 4) {
      rawAadhaar = rawAadhaar.substring(rawAadhaar.length - 4);
    }
    const maskedAadhaar = `•••• •••• ${rawAadhaar || '9921'}`;

    updateClient({
      id: client.id,
      name: name.trim(),
      role: role,
      phone: phone.trim(),
      aadhaar: maskedAadhaar,
      address: address.trim(),
      propertiesCount: Math.max(0, parseInt(propsCount, 10) || 0)
    });
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }

  return (
    <div className="modal-overlay active" id="modal-edit-client" onClick={handleOverlayClick}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">✏️ Edit Client Information</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>
              Updating Client #{client.id}
            </div>
          </div>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-body">
          <form id="edit-client-form" onSubmit={handleSubmit}>
            <div className="bank-form-grid" style={{ marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-client-name">Full Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="edit-client-name"
                  required
                  placeholder="e.g. Suresh Reddy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="field-error-msg visible" id="err-edit-client-name">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-client-role">Client Role *</label>
                <GlassSelect
                  id="edit-client-role"
                  name="role"
                  value={role}
                  prefixIcon={User}
                  onChange={(e, val) => setRole(val || e.target.value)}
                  options={[
                    { value: 'Landlord', label: 'Landlord / Owner', role: 'Landlord' },
                    { value: 'Tenant', label: 'Tenant', role: 'Tenant' }
                  ]}
                  required
                />
              </div>
            </div>

            <div className="bank-form-grid" style={{ marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-client-phone">Phone Number *</label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  id="edit-client-phone"
                  required
                  placeholder="+91 98450 11223"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <div className="field-error-msg visible" id="err-edit-client-phone">{errors.phone}</div>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-client-aadhaar">Aadhaar (Auto-Masked) *</label>
                <input
                  type="text"
                  className={`form-control ${errors.aadhaar ? 'is-invalid' : ''}`}
                  id="edit-client-aadhaar"
                  required
                  placeholder="•••• •••• 8821"
                  maxLength="16"
                  value={aadhaar}
                  onChange={(e) => formatAadhaar(e.target.value)}
                />
                {errors.aadhaar && <div className="field-error-msg visible" id="err-edit-client-aadhaar">{errors.aadhaar}</div>}
              </div>
            </div>

            <div style={{ marginBottom: '14px', fontSize: '11px', color: '#027a48', background: '#ecfdf3', padding: '6px 10px', borderRadius: 'var(--radius-sm, 6px)', border: '1px solid #abefc6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#027a48" />
              <span>UIDAI Privacy Compliant: Full 12-digit Aadhaar numbers are never stored in plain text.</span>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" htmlFor="edit-client-address">Permanent Address *</label>
              <input
                type="text"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                id="edit-client-address"
                required
                placeholder="Residential or commercial address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <div className="field-error-msg visible" id="err-edit-client-address">{errors.address}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" htmlFor="edit-client-props">Active Linked Properties Count</label>
              <input
                type="number"
                className={`form-control ${errors.propsCount ? 'is-invalid' : ''}`}
                id="edit-client-props"
                value={propsCount}
                min="0"
                onChange={(e) => setPropsCount(e.target.value)}
              />
              {errors.propsCount && <div className="field-error-msg visible" id="err-edit-client-props">{errors.propsCount}</div>}
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -20px', padding: '16px 24px' }}>
              <button
                type="button"
                className="btn btn-outline"
                id="btn-cancel-edit-client"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                id="btn-save-edit-client"
              >
                Update Client
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
