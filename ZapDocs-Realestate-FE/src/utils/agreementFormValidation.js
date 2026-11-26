export const AGREEMENT_FORM_RULES = Object.freeze({
  minimumPartyNameLength: 3,
  minimumAddressLength: 10,
  minimumRent: 1000,
  minimumDeposit: 1000
});

function isValidIsoDate(value) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/**
 * Existing broker agreements require two identifiable parties, a property,
 * rent and deposit. Title/type fields are retained by the model, while dates
 * remain optional because the current save flow supports agreements without
 * either date. When both dates are present their chronological order is enforced.
 */
export function validateAgreementForm(formData = {}) {
  const errors = {};
  const landlord = String(formData.landlord || '').trim();
  const tenant = String(formData.tenant || '').trim();
  const address = String(formData.address || '').trim();
  const title = String(formData.title || '').trim();
  const term = String(formData.term || '').trim();
  const effectiveDate = String(formData.effectiveDate || '').trim();
  const expiryDate = String(formData.expiryDate || '').trim();

  if (title.length < 3) {
    errors.title = 'Agreement title must be at least 3 characters.';
  }
  if (!term) {
    errors.term = 'Please select an agreement type.';
  }
  if (landlord.length < AGREEMENT_FORM_RULES.minimumPartyNameLength) {
    errors.landlord = 'Please enter a valid landlord name (min 3 characters).';
  }
  if (tenant.length < AGREEMENT_FORM_RULES.minimumPartyNameLength) {
    errors.tenant = 'Please enter a valid tenant name (min 3 characters).';
  } else if (tenant.toLowerCase() === landlord.toLowerCase()) {
    errors.tenant = 'Tenant name must differ from landlord name.';
  }
  if (address.length < AGREEMENT_FORM_RULES.minimumAddressLength) {
    errors.address = 'Please provide complete property address (min 10 characters).';
  }
  if (!formData.rent || Number(formData.rent) < AGREEMENT_FORM_RULES.minimumRent) {
    errors.rent = 'Monthly rent must be at least ₹1,000.';
  }
  if (!formData.deposit || Number(formData.deposit) < AGREEMENT_FORM_RULES.minimumDeposit) {
    errors.deposit = 'Security deposit must be at least ₹1,000.';
  }
  if (effectiveDate && !isValidIsoDate(effectiveDate)) {
    errors.effectiveDate = 'Enter a valid effective date.';
  }
  if (expiryDate && !isValidIsoDate(expiryDate)) {
    errors.expiryDate = 'Enter a valid expiry date.';
  }
  if (
    !errors.effectiveDate &&
    !errors.expiryDate &&
    effectiveDate &&
    expiryDate &&
    expiryDate < effectiveDate
  ) {
    errors.expiryDate = 'Expiry date must be on or after the effective date.';
  }

  return errors;
}
