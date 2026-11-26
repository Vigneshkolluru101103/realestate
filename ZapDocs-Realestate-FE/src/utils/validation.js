/**
 * ZapDocs Centralized Validation Utilities
 * Pure JavaScript validation functions for email and Indian mobile phone numbers.
 * No external libraries.
 */

/**
 * Validates standard email address format (RFC-5322 compatible basic pattern).
 * Requires non-whitespace characters, single @, domain, dot, and a valid TLD of at least 2 characters.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Standard pattern consistent with OnboardingForm.jsx
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

/**
 * Extracts the clean 10-digit Indian mobile number from various input formats:
 * - 10 digits starting with 6, 7, 8, 9 (e.g. "9845012345")
 * - 11 digits with leading 0 (e.g. "09845012345")
 * - 12 digits with 91 country code (e.g. "919845012345" or "+91 98450 12345")
 * Returns empty string if invalid.
 * @param {string} phone
 * @returns {string} 10-digit clean mobile string or empty string
 */
export function getClean10DigitPhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return digits;
  }
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]\d{9}$/.test(digits.slice(1))) {
    return digits.slice(1);
  }
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]\d{9}$/.test(digits.slice(2))) {
    return digits.slice(2);
  }
  return '';
}

/**
 * Validates if the given string represents a valid 10-digit Indian mobile number.
 * Accepts formats: 9845012345, +91 98450 12345, +91-98450-12345, 09845012345.
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  return getClean10DigitPhone(phone) !== '';
}

/**
 * Standardizes an Indian phone number into the canonical format: "+91 XXXXX XXXXX"
 * @param {string} phone
 * @returns {string}
 */
export function formatIndianPhoneNumber(phone) {
  const clean10 = getClean10DigitPhone(phone);
  if (!clean10) return phone || '';
  return `+91 ${clean10.slice(0, 5)} ${clean10.slice(5)}`;
}
