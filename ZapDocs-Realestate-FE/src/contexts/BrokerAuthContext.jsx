/**
 * BrokerAuthContext – client-side mock authentication for the Broker Portal.
 *
 * Intentionally separated from AdminAuthContext (src/contexts/AuthContext.jsx)
 * so that admin and broker sessions cannot interfere with one another.
 *
 * ⚠️  MOCK PROTOTYPE ONLY – Authentication is simulated client-side for prototype
 * evaluation. Plaintext passwords are NEVER persisted to localStorage or stored
 * in broker account records.
 * Real authentication must be handled by a secure backend service.
 */
import React, { createContext, useState, useEffect } from 'react';
import {
  getStoredBrokers,
  saveStoredBrokers,
  getStoredActiveUser,
  saveStoredActiveUser,
  checkBrokerPassword,
  setBrokerInMemoryPassword,
  INITIAL_MOCK_BROKERS,
} from '../mock/brokerAccounts';
import {
  isValidEmail,
  isValidPhone,
  getClean10DigitPhone,
  formatIndianPhoneNumber,
} from '../utils/validation';
import {
  checkLoginThrottle,
  recordFailedLogin,
  clearLoginThrottle,
} from '../auth/loginThrottler';

export const BrokerAuthContext = createContext(null);

export function BrokerAuthProvider({ children }) {
  const [brokers, setBrokers] = useState(() => getStoredBrokers());
  const [user, setUser] = useState(() => getStoredActiveUser() || INITIAL_MOCK_BROKERS[0]);
  const [loading, setLoading] = useState(false);

  // Keep localStorage in sync (saveStoredBrokers sanitizes and strips passwords)
  useEffect(() => { saveStoredBrokers(brokers); }, [brokers]);
  useEffect(() => { saveStoredActiveUser(user); }, [user]);

  /** Login by email OR 10-digit mobile number */
  function login(identifier, password) {
    const trimmedId = (identifier || '').trim().toLowerCase();
    if (!trimmedId) {
      return { success: false, error: 'Please enter your registered email or mobile number.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Input format validation
    if (trimmedId.includes('@')) {
      if (!isValidEmail(trimmedId)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
    } else {
      if (!isValidPhone(trimmedId)) {
        return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
      }
    }

    // Check login throttle before attempting authentication
    const throttleCheck = checkLoginThrottle('broker', trimmedId);
    if (!throttleCheck.allowed) {
      return { success: false, error: throttleCheck.error };
    }

    const cleanPhone = getClean10DigitPhone(trimmedId);

    const found = brokers.find((b) => {
      const matchEmail = (b.identifier || '').toLowerCase() === trimmedId;
      const matchPhone = b.phone && cleanPhone && b.phone.replace(/\D/g, '').endsWith(cleanPhone);
      return matchEmail || matchPhone;
    });

    const aliases = found ? [found.identifier, found.phone].filter(Boolean) : [];

    if (found) {
      const accountThrottle = checkLoginThrottle('broker', trimmedId, aliases);
      if (!accountThrottle.allowed) {
        return { success: false, error: accountThrottle.error };
      }
    }

    if (!found) {
      const throttleStatus = recordFailedLogin('broker', trimmedId);
      if (throttleStatus.locked) {
        return { success: false, error: throttleStatus.error };
      }
      return { success: false, error: 'No broker account found with this email or mobile number.' };
    }

    const authCheck = checkBrokerPassword(found, password);
    if (!authCheck.valid) {
      const throttleStatus = recordFailedLogin('broker', trimmedId, aliases);
      if (throttleStatus.locked) {
        return { success: false, error: throttleStatus.error };
      }
      return { success: false, error: authCheck.error };
    }

    // Clear failed login attempts upon successful login
    clearLoginThrottle('broker', trimmedId, aliases);

    const sessionUser = {
      id: found.id,
      name: found.name,
      identifier: found.identifier,
      phone: found.phone || '',
      upiId: found.upiId || null,
      subscription: found.subscription,
      role: 'broker',
    };
    setUser(sessionUser);
    return { success: true, user: sessionUser };
  }

  /** Self-registration (creates a Pay-Per-Doc account with no active plan) */
  function register(rawParams = {}) {
    if (!rawParams || typeof rawParams !== 'object') {
      return { success: false, error: 'Registration parameters are required.' };
    }
    const { name, identifier, email, phone, password } = rawParams;
    const trimmedName = (name || '').trim();
    if (!trimmedName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Resolve email and phone inputs
    const rawEmail = (email || (identifier && identifier.includes('@') ? identifier : '') || '').trim().toLowerCase();
    const rawPhone = (phone || (identifier && !identifier.includes('@') ? identifier : '') || '').trim();

    if (!rawEmail && !rawPhone) {
      return { success: false, error: 'Please enter a valid email address or 10-digit mobile number.' };
    }

    if (rawEmail && !isValidEmail(rawEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (rawPhone && !isValidPhone(rawPhone)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    const cleanPhone = getClean10DigitPhone(rawPhone);
    const formattedPhone = cleanPhone ? formatIndianPhoneNumber(cleanPhone) : '';

    const existing = brokers.find((b) => {
      const matchEmail = rawEmail && (b.identifier || '').toLowerCase() === rawEmail;
      const matchPhone = cleanPhone && b.phone && b.phone.replace(/\D/g, '').endsWith(cleanPhone);
      return matchEmail || matchPhone;
    });

    if (existing) {
      return { success: false, error: 'An account with this email or mobile number already exists.' };
    }

    const newBrokerId = `brk_${Date.now()}`;

    // Retain credential in in-memory registry for runtime session — NEVER persist in localStorage
    setBrokerInMemoryPassword(newBrokerId, password);

    const newBroker = {
      id: newBrokerId,
      name: trimmedName,
      identifier: rawEmail || `${cleanPhone}@zapdocs.mock`,
      phone: formattedPhone,
      upiId: null,
      subscription: { status: 'none' },
      hasCustomPassword: true,
    };

    const updated = [...brokers, newBroker];
    setBrokers(updated);

    const sessionUser = {
      id: newBroker.id,
      name: newBroker.name,
      identifier: newBroker.identifier,
      phone: newBroker.phone,
      upiId: null,
      subscription: newBroker.subscription,
      role: 'broker',
    };
    setUser(sessionUser);
    return { success: true, user: sessionUser };
  }

  /** Mock password reset (client-side only) */
  function resetPassword(identifier, newPassword) {
    const trimmedId = (identifier || '').trim().toLowerCase();
    if (!trimmedId) {
      return { success: false, error: 'Please enter your registered email or mobile number.' };
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (trimmedId.includes('@')) {
      if (!isValidEmail(trimmedId)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
    } else {
      if (!isValidPhone(trimmedId)) {
        return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
      }
    }

    const cleanPhone = getClean10DigitPhone(trimmedId);

    const foundIndex = brokers.findIndex((b) => {
      const matchEmail = (b.identifier || '').toLowerCase() === trimmedId;
      const matchPhone = b.phone && cleanPhone && b.phone.replace(/\D/g, '').endsWith(cleanPhone);
      return matchEmail || matchPhone;
    });

    if (foundIndex === -1) {
      return { success: false, error: 'Account not found. Please verify your email or mobile number.' };
    }

    const targetBroker = brokers[foundIndex];

    // Update in-memory credential for this session — NEVER write password to persisted broker record
    setBrokerInMemoryPassword(targetBroker.id, newPassword);

    // Track that custom password was set so demo default password does not resurrect
    if (!targetBroker.hasCustomPassword) {
      const updatedBrokers = [...brokers];
      updatedBrokers[foundIndex] = { ...targetBroker, hasCustomPassword: true };
      saveStoredBrokers(updatedBrokers);
      setBrokers(updatedBrokers);
    }

    // Clear failed login throttle for this account upon successful password reset
    const aliases = [targetBroker.identifier, targetBroker.phone].filter(Boolean);
    clearLoginThrottle('broker', trimmedId, aliases);

    return { success: true };
  }

  function logout() {
    saveStoredActiveUser(null);
    setUser(INITIAL_MOCK_BROKERS[0]);
  }

  return (
    <BrokerAuthContext.Provider value={{ user, loading, brokers, login, register, resetPassword, logout }}>
      {children}
    </BrokerAuthContext.Provider>
  );
}
