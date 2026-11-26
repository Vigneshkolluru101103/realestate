// ============================================================
// Firebase Auth Service — Stub Authentication for Frontend Flow
//
// ⚠️  PREVIEW / STUB ONLY — Replace loginWithEmail / logout / onAuthChange
// with real Firebase SDK calls (firebase/auth) when backend auth is enabled.
// ============================================================
import { sessionManager } from "../auth/sessionManager.js";
import {
  checkLoginThrottle,
  recordFailedLogin,
} from "../auth/loginThrottler.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a non-guessable session identifier for the mock login session.
 *
 * Uses the Web Crypto API (crypto.randomUUID) when available — supported in
 * all modern browsers and Node ≥ 14.17.  Falls back to a timestamp + random
 * suffix for environments that do not expose randomUUID.
 *
 * ⚠️  This identifier is NOT a cryptographically verified token.  It is used
 * purely to make each mock session distinguishable in developer tools.  Do
 * not treat it as proof of authentication in any server-side context.
 */
export function generateMockSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: timestamp (ms) + 9 random base-36 characters.
  // This is NOT cryptographically secure — only used when randomUUID is absent.
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ---------------------------------------------------------------------------
// Mutable auth reference (mirrors the firebase/app Auth object shape)
// ---------------------------------------------------------------------------

// Safe mock auth reference to avoid live Identity Toolkit network errors.
export const auth = {
  currentUser: null,
};

// ---------------------------------------------------------------------------
// loginWithEmail
// ---------------------------------------------------------------------------

export const loginWithEmail = async (email) => {
  const trimmed = (email || "").trim().toLowerCase();

  // Check login throttle before attempting authentication
  const throttleCheck = checkLoginThrottle("admin", trimmed);
  if (!throttleCheck.allowed) {
    const error = new Error(throttleCheck.error);
    error.code = "auth/too-many-requests";
    throw error;
  }

  const throttleStatus = recordFailedLogin("admin", trimmed);
  const errorMessage = throttleStatus.locked
    ? throttleStatus.error
    : "Sign-in is not configured in this preview build.";

  const error = new Error(errorMessage);
  error.code = throttleStatus.locked ? "auth/too-many-requests" : "auth/invalid-credential";
  throw error;
};

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------

export const logout = async () => {
  auth.currentUser = null;
  sessionManager.clearAdminSession();
};

// ---------------------------------------------------------------------------
// onAuthChange
// ---------------------------------------------------------------------------

export const onAuthChange = (cb) => {
  const current = sessionManager.getAdminSession();
  if (current) {
    // Finding #6 fix: restore persisted session without re-using a static token.
    // The restored token is ephemeral (not persisted) and scoped to this page load.
    const restoredToken = `mock-admin-token-${generateMockSessionId()}`;

    auth.currentUser = {
      ...current,
      // ⚠️  getIdToken returns a mock bearer value — not a real Firebase JWT.
      getIdToken: async () => restoredToken,
    };
    cb(auth.currentUser);
  } else {
    auth.currentUser = null;
    cb(null);
  }
  return () => {};
};

// ---------------------------------------------------------------------------
// getAuthToken (Synchronous or eager token resolver)
// ---------------------------------------------------------------------------
export const getAuthToken = async () => {
  if (auth.currentUser && typeof auth.currentUser.getIdToken === "function") {
    return await auth.currentUser.getIdToken();
  }
  const current = sessionManager.getAdminSession();
  if (current) {
    const restoredToken = `mock-admin-token-${generateMockSessionId()}`;
    auth.currentUser = {
      ...current,
      getIdToken: async () => restoredToken,
    };
    return restoredToken;
  }
  return null;
};

// ---------------------------------------------------------------------------
// sendPasswordResetEmail
// ---------------------------------------------------------------------------

export const sendPasswordResetEmail = async (email) => {
  const trimmed = (email || "").trim().toLowerCase();

  if (!trimmed) {
    const error = new Error("Please enter your registered email address.");
    error.code = "auth/missing-email";
    throw error;
  }

  // Check login/reset throttle
  const throttleCheck = checkLoginThrottle("admin_reset", trimmed);
  if (!throttleCheck.allowed) {
    const error = new Error(throttleCheck.error);
    error.code = "auth/too-many-requests";
    throw error;
  }

  // Legacy prototype behaviour. The live Cognito password-reset flow is
  // implemented as part of the login-flow migration, not through Firebase.
  // Simulate network latency (400ms)
  await new Promise((r) => setTimeout(r, 400));

  // The existing service accepts the reset request
  return { success: true };
};

export default {
  auth,
  loginWithEmail,
  logout,
  onAuthChange,
  sendPasswordResetEmail,
};

