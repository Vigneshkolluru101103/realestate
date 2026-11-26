/**
 * ZapDocs OTP Service
 * 
 * Production-ready interface for Mobile SMS and Email OTP verification.
 * 
 * Security Architecture:
 * - OTP generation, expiry, verification, and rate-limiting are strictly
 *   enforced by the backend service (FastAPI / SMS Gateway provider).
 * - Client-side code NEVER generates, stores, or validates OTPs in JavaScript.
 * - If the backend service is offline or unconfigured, requests fail gracefully
 *   with an explicit error reporting the missing backend dependency.
 */

import { api, ApiError } from "./client.js";

export const otpService = {
  /**
   * Request SMS OTP generation and dispatch to mobile number from backend.
   * @param {string} mobile - 10-digit Indian mobile number
   * @returns {Promise<{ success: boolean, message?: string, expiresIn?: number }>}
   */
  sendMobileOtp: async (mobile) => {
    const cleanMobile = (mobile || "").replace(/\D/g, "").slice(-10);
    if (!cleanMobile || cleanMobile.length !== 10) {
      throw new Error("Please enter a valid 10-digit Indian mobile number.");
    }

    try {
      const response = await api.post("/auth/otp/send", {
        mobile: `+91${cleanMobile}`,
        channel: "sms"
      });
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.message || "Failed to send mobile OTP.");
      }
      throw new Error(
        "Backend SMS OTP service is currently offline (POST /api/v1/auth/otp/send). A live backend SMS gateway (e.g. Twilio, MSG91, or Fast2SMS) is required to dispatch real mobile verification codes."
      );
    }
  },

  /**
   * Verify a mobile SMS OTP against the backend service.
   * @param {string} mobile - 10-digit Indian mobile number
   * @param {string} code - 6-digit OTP entered by the user
   * @returns {Promise<{ verified: boolean, token?: string }>}
   */
  verifyMobileOtp: async (mobile, code) => {
    const cleanMobile = (mobile || "").replace(/\D/g, "").slice(-10);
    const trimmedCode = (code || "").trim();

    if (!trimmedCode || trimmedCode.length < 6) {
      throw new Error("Please enter the complete 6-digit verification code.");
    }

    try {
      const response = await api.post("/auth/otp/verify", {
        mobile: `+91${cleanMobile}`,
        otp: trimmedCode,
        channel: "sms"
      });
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.message || "Invalid or expired verification code.");
      }
      throw new Error(
        "Backend SMS OTP service is currently offline. Mobile OTP verification cannot be performed without a trusted backend service."
      );
    }
  },

  /**
   * Resend mobile SMS OTP request.
   * @param {string} mobile - 10-digit Indian mobile number
   */
  resendMobileOtp: async (mobile) => {
    return otpService.sendMobileOtp(mobile);
  },

  /**
   * Legacy email OTP methods (maintained for API compatibility)
   */
  sendEmailOtp: async (email) => {
    const trimmed = (email || "").trim().toLowerCase();
    try {
      return await api.post("/auth/otp/send", { email: trimmed, channel: "email" });
    } catch (err) {
      throw new Error("Backend email OTP service is currently offline.");
    }
  },

  verifyEmailOtp: async (email, code) => {
    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedCode = (code || "").trim();
    try {
      return await api.post("/auth/otp/verify", { email: trimmedEmail, otp: trimmedCode, channel: "email" });
    } catch (err) {
      throw new Error("Backend email OTP service is currently offline.");
    }
  }
};

export default otpService;
