/**
 * useBrokerAuth – hook for Broker Portal components.
 *
 * Mirrors the shape expected by screens extracted from origin/BrokerDashboardFresh,
 * which import from '../../context/useAuth'.
 *
 * All broker screens have been repointed to import from this file via their
 * updated import paths in the dev branch integration.
 */
import { useContext } from 'react';
import { BrokerAuthContext } from '../contexts/BrokerAuthContext';

export function useBrokerAuth() {
  const ctx = useContext(BrokerAuthContext);
  if (!ctx) {
    throw new Error('useBrokerAuth must be used inside <BrokerAuthProvider>');
  }
  return ctx;
}
