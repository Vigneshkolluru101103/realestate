/**
 * Compatibility adapter for screens expecting '../../context/useAuth'.
 * Re-exports useBrokerAuth as useAuth.
 */
import { useBrokerAuth } from '../hooks/useBrokerAuth';

export const useAuth = useBrokerAuth;
export default useAuth;
