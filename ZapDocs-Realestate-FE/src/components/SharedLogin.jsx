import React, { useState } from "react";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff, AlertCircle, Mail, Lock, ArrowRight, KeyRound, CheckCircle2, X } from "lucide-react";
import { sendPasswordResetEmail } from "../firebase/auth";
import { checkLoginThrottle } from "../auth/loginThrottler";
import { useBrokerAuth } from "../hooks/useBrokerAuth";
import { sessionManager } from "../auth/sessionManager";
import { ZapDocsLogo } from "./ZapDocsLogo";
import { isValidEmail, isValidPhone, getClean10DigitPhone } from "../utils/validation";

export const SharedLogin = ({ defaultDestination, subtitle } = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isUserPath = location.pathname.startsWith("/user");
  const displaySubtitle = subtitle || (isUserPath 
    ? "Sign in to access your ZapDocs customer account." 
    : "Sign in to access your ZapDocs Broker Portal.");

  const { login: brokerLogin, brokers } = useBrokerAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset Password Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const openResetModal = () => {
    setResetEmail(identifier.includes("@") ? identifier.trim() : "");
    setResetError("");
    setResetSuccess(false);
    setResetLoading(false);
    setResetModalOpen(true);
  };

  const closeResetModal = () => {
    setResetModalOpen(false);
    setResetError("");
    setResetSuccess(false);
    setResetLoading(false);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");

    const trimmed = (resetEmail || "").trim();
    if (!trimmed) {
      setResetError("Please enter your registered email address.");
      return;
    }

    if (!isValidEmail(trimmed)) {
      setResetError("Please enter a valid email address.");
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(trimmed);
      setResetSuccess(true);
    } catch (err) {
      setResetError(err.message || "Unable to send password reset link. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const returnTo = location.state?.returnTo || searchParams.get("returnTo");

  const getBrokerDestination = () => {
    if (returnTo && returnTo.startsWith("/broker") && returnTo !== "/broker/login") {
      return returnTo;
    }
    return defaultDestination?.startsWith("/broker") ? defaultDestination : "/broker/dashboard";
  };

  const getUserDestination = () => {
    if (returnTo && returnTo.startsWith("/user") && returnTo !== "/user/login") {
      return returnTo;
    }
    return defaultDestination?.startsWith("/user") ? defaultDestination : "/user/dashboard";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const rawTrimmedId = identifier.trim().toLowerCase();
    if (!rawTrimmedId || !password) {
      setError("Please enter your registered email or mobile number and password.");
      return;
    }

    let trimmedId = rawTrimmedId;
    if (!rawTrimmedId.includes("@")) {
      const cleaned = getClean10DigitPhone(rawTrimmedId);
      if (cleaned) trimmedId = cleaned;
    }

    // Validation
    if (trimmedId.includes("@")) {
      if (!isValidEmail(trimmedId)) {
        setError("Please enter a valid email address.");
        return;
      }
    } else {
      if (!isValidPhone(trimmedId)) {
        setError("Please enter a valid 10-digit Indian mobile number or email address.");
        return;
      }
    }

    setLoading(true);

    try {
      // 1. BROKER AUTHENTICATION CHECK
      const cleanPhone = getClean10DigitPhone(trimmedId);
      const matchedBroker = brokers.find((b) => {
        const matchEmail = (b.identifier || "").toLowerCase() === trimmedId;
        const matchPhone = b.phone && cleanPhone && b.phone.replace(/\D/g, "").endsWith(cleanPhone);
        return matchEmail || matchPhone;
      });

      if (matchedBroker) {
        const brokerAliases = [matchedBroker.identifier, matchedBroker.phone].filter(Boolean);
        const brokerThrottleCheck = checkLoginThrottle("broker", trimmedId, brokerAliases);
        if (!brokerThrottleCheck.allowed) {
          setError(brokerThrottleCheck.error);
          setLoading(false);
          return;
        }

        const brokerResult = brokerLogin(trimmedId, password);
        if (brokerResult.success) {
          navigate(getBrokerDestination(), { replace: true });
          return;
        }

        setError(brokerResult.error || "Invalid credentials. Please verify your password.");
        setLoading(false);
        return;
      }

      // 2. USER / CUSTOMER AUTHENTICATION CHECK
      if (password.length >= 6) {
        sessionManager.setUserSession({ identifier: trimmedId });
        navigate(getUserDestination(), { replace: true });
        return;
      }

      setError("No broker account found with these credentials. Please check your details or register.");
    } catch (err) {
      setError(err.message || "Authentication service temporarily unavailable. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.08), transparent 70%),
          radial-gradient(#e2e8f0 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 24px 24px",
        padding: "32px 16px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      <div
        className="zd-login-card"
        style={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 20px 25px -5px rgba(15, 23, 42, 0.06)",
          padding: "36px 32px",
          position: "relative"
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <ZapDocsLogo size="md" variant="vertical" style={{ marginBottom: 12 }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginTop: 12, marginBottom: 6 }}>
            Sign In to ZapDocs Broker
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.45 }}>
            {displaySubtitle}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            data-testid="login-error"
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: "#b91c1c"
            }}
          >
            <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Broker Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="identifier"
              style={{
                display: "block",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#334155",
                marginBottom: 6
              }}
            >
              Email or Mobile Number
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="identifier"
                data-testid="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com or 10-digit mobile"
                autoComplete="username"
                disabled={loading}
                style={{
                  width: "100%",
                  height: 42,
                  padding: "0 12px 0 38px",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              <Mail
                size={16}
                color="#94a3b8"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6
              }}
            >
              <label
                htmlFor="password"
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#334155"
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={openResetModal}
                tabIndex={-1}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: "#2563eb",
                  cursor: "pointer",
                  textDecoration: "none"
                }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                data-testid="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                style={{
                  width: "100%",
                  height: 42,
                  padding: "0 40px 0 38px",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              <Lock
                size={16}
                color="#94a3b8"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#94a3b8"
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            data-testid="login-submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 44,
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
              transition: "background 150ms ease"
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="zd-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>Sign In to Broker Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Broker Registration Link */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #f1f5f9",
            textAlign: "center",
            fontSize: 13,
            color: "#64748b"
          }}
        >
          New real estate broker?{" "}
          <Link
            to="/broker/signup"
            style={{
              color: "#059669",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            Register as Broker →
          </Link>
        </div>
      </div>

      {/* Reset Password Modal */}
      {resetModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20
          }}
          onClick={closeResetModal}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              backgroundColor: "#ffffff",
              borderRadius: 14,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              border: "1px solid #e2e8f0",
              padding: "24px 28px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <KeyRound size={18} color="#2563eb" />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#0f172a"
                  }}
                >
                  Reset Password
                </h3>
              </div>
              <button
                type="button"
                onClick={closeResetModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: 4
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p
              style={{
                fontSize: 13.5,
                color: "#475569",
                lineHeight: 1.5,
                marginBottom: 18,
                marginTop: 0
              }}
            >
              Enter your registered broker email address and we&apos;ll send you a password reset link.
            </p>

            {resetSuccess ? (
              <div>
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 8,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginBottom: 20
                  }}
                >
                  <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>
                    If an account exists for this email, password reset instructions will be sent.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeResetModal}
                  style={{
                    width: "100%",
                    height: 40,
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit}>
                {resetError && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: 8,
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      marginBottom: 16
                    }}
                  >
                    <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: "#991b1b", lineHeight: 1.4 }}>
                      {resetError}
                    </span>
                  </div>
                )}

                <div style={{ marginBottom: 18 }}>
                  <label
                    htmlFor="reset-email"
                    style={{
                      display: "block",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: 6
                    }}
                  >
                    Registered Broker Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      disabled={resetLoading}
                      autoFocus
                      style={{
                        width: "100%",
                        height: 42,
                        padding: "0 12px 0 38px",
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        fontSize: 13.5,
                        color: "#0f172a",
                        backgroundColor: resetLoading ? "#f8fafc" : "#ffffff",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                    <Mail
                      size={16}
                      color="#94a3b8"
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)"
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    style={{
                      width: "100%",
                      height: 40,
                      backgroundColor: resetLoading ? "#93c5fd" : "#2563eb",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: resetLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      transition: "background 150ms ease"
                    }}
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 size={16} className="spinner" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={closeResetModal}
                    disabled={resetLoading}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "6px 0",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#64748b",
                      cursor: resetLoading ? "not-allowed" : "pointer",
                      textAlign: "center"
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedLogin;
