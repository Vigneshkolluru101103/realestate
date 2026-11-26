import React, { useState } from 'react';
import { ShieldCheck, User } from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';
import GlassSelect from '../../common/GlassSelect';

export default function AddClientModal() {
  const { closeModal, addClient, showToast } = useBrokerState();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Landlord');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [address, setAddress] = useState('');
  const [propsCount, setPropsCount] = useState(1);
  const [errors, setErrors] = useState({});

  function formatAadhaar(val) {
    let digits = val.replace(/[^0-9]/g, '');
    if (digits.length > 4) {
      digits = digits.substring(digits.length - 4);
    }
    if (digits.length === 4) {
      setAadhaar(`•••• •••• ${digits}`);
    } else {
      setAadhaar(digits);
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
    if (!aadhaar.trim() || aadhaar.replace(/[^0-9]/g, '').length < 4) {
      errs.aadhaar = 'Enter 4-12 digits. Last 4 digits are stored securely.';
    }
    if (!address.trim() || address.trim().length < 8) {
      errs.address = 'Address is required (min 8 characters).';
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
    if (rawAadhaar.length >= 4) rawAadhaar = rawAadhaar.substring(rawAadhaar.length - 4);
    const maskedAadhaar = `•••• •••• ${rawAadhaar || '9921'}`;

    addClient({
      name: name.trim(),
      role: role,
      phone: phone.trim(),
      aadhaar: maskedAadhaar,
      address: address.trim(),
      propertiesCount: Number(propsCount) || 1
    });
  }

  return (
    <div className="modal-overlay active" id="modal-add-client">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">Add New Client to Vault</div>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-body">
          <form id="add-client-form" onSubmit={handleSubmit}>
            <div className="bank-form-grid" style={{ marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="new-client-name"
                  required
                  placeholder="e.g. Naveen Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="field-error-msg visible" id="err-client-name">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Client Role *</label>
                <GlassSelect
                  id="new-client-role"
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
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  id="new-client-phone"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <div className="field-error-msg visible" id="err-client-phone">{errors.phone}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Aadhaar (Auto-Masked) *</label>
                <input
                  type="text"
                  className={`form-control ${errors.aadhaar ? 'is-invalid' : ''}`}
                  id="new-client-aadhaar"
                  required
                  placeholder="•••• •••• 9921"
                  maxLength="14"
                  value={aadhaar}
                  onChange={(e) => formatAadhaar(e.target.value)}
                />
                {errors.aadhaar && <div className="field-error-msg visible" id="err-client-aadhaar">{errors.aadhaar}</div>}
              </div>
            </div>

            <div style={{ marginBottom: '14px', fontSize: '11px', color: '#027a48', background: '#ecfdf3', padding: '6px 10px', borderRadius: 'var(--radius-sm, 6px)', border: '1px solid #abefc6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#027a48" />
              <span>UIDAI Privacy Compliant: Full 12-digit Aadhaar numbers are never stored in plain text.</span>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Permanent Address *</label>
              <input
                type="text"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                id="new-client-address"
                required
                placeholder="Permanent residential or commercial address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <div className="field-error-msg visible" id="err-client-address">{errors.address}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Active Linked Properties Count</label>
              <input
                type="number"
                className="form-control"
                id="new-client-props"
                value={propsCount}
                min="0"
                onChange={(e) => setPropsCount(e.target.value)}
              />
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -20px', padding: '16px 24px' }}>
              <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary" id="btn-save-client">
                Save Client to Vault
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
