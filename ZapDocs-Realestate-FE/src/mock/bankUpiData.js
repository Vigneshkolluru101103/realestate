/**
 * ZapDocs Bank & UPI Settings Store
 * Manages per-broker banking and UPI configuration for prototype evaluation.
 * NOTE: All data is saved in local browser storage.
 * Full bank account numbers are never exposed in UI summaries (masked to last 4 digits).
 * No penny-drop verification, NPCI routing, or real fund transfers are executed.
 */

import { storage } from '../utils/storage.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';

const BANK_STORAGE_PREFIX = STORAGE_KEYS.BANK_ACCOUNT_PREFIX || 'zapdocs_bank_account_';
const UPI_STORAGE_PREFIX = STORAGE_KEYS.UPI_ID_PREFIX || 'zapdocs_upi_id_';

/**
 * Validates Indian Financial System Code (IFSC)
 * Exactly 11 characters: 4 letters, 5th character '0', 6 alphanumeric characters
 */
export function isValidIFSC(code) {
  if (!code) return false;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(code.trim().toUpperCase());
}

/**
 * Validates Indian Bank Account Number
 * Typically 9 to 18 numeric digits
 */
export function isValidAccountNumber(accNum) {
  if (!accNum) return false;
  const clean = accNum.replace(/\s+/g, '');
  const accRegex = /^\d{9,18}$/;
  return accRegex.test(clean);
}

/**
 * Validates Virtual Payment Address (UPI ID)
 * Contains username, @ symbol, and bank/PSP handle (e.g. name@oksbi, 9876543210@paytm)
 */
export function isValidUPI(upiId) {
  if (!upiId) return false;
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(upiId.trim());
}

/**
 * Masks bank account number to show only last 4 digits
 * Example: 123456789012 -> •••• •••• •••• 9012
 */
export function maskAccountNumber(accNum) {
  if (!accNum) return '•••• •••• •••• ••••';
  const clean = String(accNum).replace(/\s+/g, '');
  if (clean.length < 4) return '•••• ••••';
  const last4 = clean.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

/**
 * Retrieve saved bank account for a given broker ID
 */
export function getSavedBankAccount(brokerId) {
  if (!brokerId) return null;
  return storage.get(`${BANK_STORAGE_PREFIX}${brokerId}`, null);
}

/**
 * Save bank account for a given broker ID
 */
export function saveBankAccount(brokerId, bankData) {
  if (!brokerId) return;
  storage.set(`${BANK_STORAGE_PREFIX}${brokerId}`, bankData);
}

/**
 * Remove saved bank account for a given broker ID
 */
export function removeBankAccount(brokerId) {
  if (!brokerId) return;
  storage.remove(`${BANK_STORAGE_PREFIX}${brokerId}`);
}

/**
 * Retrieve saved UPI ID for a given broker ID (with fallback to broker's account upiId)
 */
export function getSavedUPI(brokerId, defaultUpi = null) {
  if (!brokerId) return defaultUpi;
  const stored = storage.get(`${UPI_STORAGE_PREFIX}${brokerId}`, null);
  return stored !== null && stored !== undefined ? stored : defaultUpi;
}

/**
 * Save UPI ID for a given broker ID
 */
export function saveUPI(brokerId, upiId) {
  if (!brokerId) return;
  storage.set(`${UPI_STORAGE_PREFIX}${brokerId}`, (upiId || '').trim());
}

/**
 * Remove saved UPI ID for a given broker ID
 */
export function removeUPI(brokerId) {
  if (!brokerId) return;
  storage.remove(`${UPI_STORAGE_PREFIX}${brokerId}`);
}
