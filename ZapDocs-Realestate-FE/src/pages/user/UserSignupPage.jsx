/**
 * UserSignupPage — Phase 1 User/Owner account creation.
 *
 * Terminology: "User" and "Owner" are the same entity in Phase 1.
 * owner_profiles is the canonical backend table.
 *
 * Supports two entry contexts:
 *   A. Direct user signup     → /user/signup
 *   B. Broker invitation      → /user/signup?invitation_id=XYZ
 *      Shows broker banner + pre-fills fields from invitation.
 *
 * Uses the unified OnboardingForm (same component as broker signup).
 *
 * Steps:
 *   1. OnboardingForm
 *   2. OTP verification (mobile)
 *   3. Account Created → user dashboard
 */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { AlertCircle, Loader2, CheckCircle2, ChevronLeft, UserCheck, Lock, Smartphone } from "lucide-react";
import { ZapDocsLogo } from "../../components/ZapDocsLogo";
import { OnboardingForm, EMPTY_ONBOARDING_FORM, validateOnboardingForm } from "../../components/onboarding/OnboardingForm";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

function resolveInvitation(id) {
  if (!id) return null;
  return {
    invitationId: id,
    brokerName: "ABC Broker",
    prefill: {
      email: "rahul@example.com",
      mobile: "9876543210",
      firstName: "Rahul",
    },
    lockedFields: ["email", "mobile"],
  };
}

export const UserSignupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("invitation_id");
  const invitation = resolveInvitation(invitationId);

  // ── Form ──────────────────────────────────────────────────
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    ...EMPTY_ONBOARDING_FORM,
    ...(invitation?.prefill ?? {}),
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [formApiError, setFormApiError] = useState("");

  const handleFormContinue = async () => {
    setFormApiError("");
    const errs = validateOnboardingForm(formData);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setFormLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setStep("otp");
      setResendCountdown(RESEND_COOLDOWN);
    } catch {
      setFormApiError("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // ── OTP ───────────────────────────────────────────────────
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN);
  const [resendLoading, setResendLoading] = useState(false);
  const otpRefs = useRef(Array(OTP_LENGTH).fill(null));

  useEffect(() => {
    if (step !== "otp" || resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown, step]);

  const handleOtpChange = (idx, val) => {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = char;
    setOtp(next);
    setOtpError("");
    if (char && idx < OTP_LENGTH - 1) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowLeft" && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }
    setOtpLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setStep("success");
    } catch {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      setResendCountdown(RESEND_COOLDOWN);
    } finally {
      setResendLoading(false);
    }
  };

  // ── Shared UI helpers ─────────────────────────────────────
  const pageWrap = (center = false) => ({
    minHeight: "100vh",
    background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#eef6ff 100%)",
    display: "flex",
    alignItems: center ? "center" : "flex-start",
    justifyContent: "center",
    padding: center ? "40px 20px" : "40px 20px 60px",
    fontFamily: "var(--font-family)",
  });

  const card = {
    width: "100%",
    maxWidth: 520,
    background: "#ffffff",
    border: "1px solid var(--color-border)",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(37,99,235,0.07), 0 2px 8px rgba(0,0,0,0.04)",
    padding: "36px 36px 32px",
  };

  const logoMark = (subtitle) => (
    <ZapDocsLogo size="md" badge={subtitle} subtitle="Smart Loop | LegalTech" style={{ marginBottom: 24 }} />
  );

  const primaryBtn = (label, onClick, disabled, id) => (
    <button
      type="button"
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: 46,
        background: disabled ? "var(--color-border)" : "linear-gradient(135deg,#2563eb,#1d4ed8)",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxShadow: disabled ? "none" : "0 2px 10px rgba(37,99,235,0.25)",
        transition: "all 150ms ease",
      }}
    >
      {label}
    </button>
  );

  const Spin = () => <Loader2 size={16} className="spinner" />;

  const otpBox = (idx) => (
    <input
      key={idx}
      ref={(el) => {
        otpRefs.current[idx] = el;
      }}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={otp[idx]}
      onChange={(e) => handleOtpChange(idx, e.target.value)}
      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
      id={`user-otp-${idx}`}
      disabled={otpLoading}
      style={{
        width: 48,
        height: 56,
        textAlign: "center",
        fontSize: 22,
        fontWeight: 700,
        border: `2px solid ${otpError ? "var(--status-error)" : otp[idx] ? "var(--color-brand)" : "var(--color-border)"}`,
        borderRadius: 10,
        outline: "none",
        color: "var(--color-text-primary)",
        backgroundColor: otpLoading ? "var(--color-surface-subtle)" : "#fff",
        transition: "border-color 120ms ease, box-shadow 120ms ease",
        boxShadow: otp[idx] && !otpError ? "0 0 0 3px rgba(37,99,235,0.1)" : undefined,
        fontFamily: "var(--font-family)",
      }}
    />
  );

  // ── STEP 1: Form ──────────────────────────────────────────
  if (step === "form") {
    return (
      <div style={pageWrap(false)}>
        <div style={card}>
          {logoMark("User Registration")}

          {/* Invitation banner (Exact single match for ABC Broker) */}
          {invitation && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--color-brand-light)",
                border: "1px solid var(--color-brand-subtle)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--color-brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <UserCheck size={15} color="#fff" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--color-brand)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Broker Invitation
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                  }}
                >
                  Invited to ZapDocs by <strong>{invitation.brokerName}</strong>
                </div>
              </div>
            </div>
          )}

          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: 4,
            }}
          >
            Create Your Account
          </h1>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--color-text-secondary)",
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            {invitation
              ? "Confirm your details below to complete account setup."
              : "Fill in your details to create a ZapDocs user account."}
          </p>

          {formApiError && (
            <div
              style={{
                background: "var(--status-error-bg)",
                border: "1px solid var(--status-error-border)",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 20,
                fontSize: 13,
                color: "var(--status-error)",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <AlertCircle size={15} />
              {formApiError}
            </div>
          )}

          <OnboardingForm
            data={formData}
            onChange={(d) => {
              setFormData(d);
              setFormErrors({});
            }}
            errors={formErrors}
            disabled={formLoading}
            lockedFields={invitation?.lockedFields ?? []}
          />

          {invitation && (invitation.lockedFields?.length ?? 0) > 0 && (
            <p
              style={{
                fontSize: 11.5,
                color: "var(--color-text-muted)",
                marginBottom: 16,
                marginTop: -8,
                lineHeight: 1.6,
                display: "flex",
                alignItems: "center",
                gap: 5
              }}
            >
              <Lock size={12} style={{ flexShrink: 0 }} />
              <span>Some fields are pre-filled from your invitation. Contact your broker if there&apos;s an error.</span>
            </p>
          )}

          <div style={{ marginTop: 8 }}>
            {primaryBtn(
              formLoading ? (
                <>
                  <Spin /> Processing…
                </>
              ) : (
                "Continue"
              ),
              handleFormContinue,
              formLoading,
              "user-signup-continue-btn"
            )}
          </div>

          <p
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 13,
              color: "var(--color-text-secondary)",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/user/login"
              style={{
                color: "var(--color-brand)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── STEP 2: OTP ──────────────────────────────────────────
  if (step === "otp") {
    return (
      <div style={pageWrap(true)}>
        <div
          style={{
            ...card,
            maxWidth: 420,
            textAlign: "center",
          }}
        >
          {logoMark("User Registration")}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "var(--color-brand-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: "var(--color-brand)"
            }}
          >
            <Smartphone size={32} />
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: 8,
            }}
          >
            Enter Verification Code
          </h1>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--color-text-secondary)",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            We sent a 6-digit OTP to{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>+91 {formData.mobile}</strong>
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginBottom: 16,
            }}
            onPaste={handleOtpPaste}
          >
            {Array.from({ length: OTP_LENGTH }, (_, i) => otpBox(i))}
          </div>

          {otpError && (
            <p
              style={{
                fontSize: 12.5,
                color: "var(--status-error)",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <AlertCircle size={13} />
              {otpError}
            </p>
          )}

          <div style={{ marginBottom: 20 }}>
            {primaryBtn(
              otpLoading ? (
                <>
                  <Spin /> Verifying…
                </>
              ) : (
                "Verify OTP"
              ),
              handleVerifyOtp,
              otpLoading || otp.join("").length < OTP_LENGTH,
              "user-verify-otp-btn"
            )}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "var(--color-text-secondary)",
            }}
          >
            {resendCountdown > 0 ? (
              <span>
                Resend OTP in{" "}
                <strong
                  style={{
                    color: "var(--color-text-primary)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {resendCountdown}s
                </strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                style={{
                  background: "none",
                  border: "none",
                  cursor: resendLoading ? "not-allowed" : "pointer",
                  color: resendLoading ? "var(--color-text-muted)" : "var(--color-brand)",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: 0,
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
              >
                {resendLoading ? "Sending…" : "Resend OTP"}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setStep("form")}
            disabled={otpLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              fontSize: 12.5,
              marginTop: 20,
              padding: 0,
              justifyContent: "center",
              width: "100%",
            }}
          >
            <ChevronLeft size={14} /> Change mobile number
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 3: Success ───────────────────────────────────────
  return (
    <div style={pageWrap(true)}>
      <div
        style={{
          ...card,
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        {logoMark("User Registration")}
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            backgroundColor: "var(--status-success-bg)",
            border: "2px solid var(--status-success-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <CheckCircle2 size={32} color="var(--status-success)" />
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            marginBottom: 8,
          }}
        >
          Account Created Successfully
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-secondary)",
            marginBottom: 32,
            lineHeight: 1.7,
          }}
        >
          Welcome, <strong style={{ color: "var(--color-text-primary)" }}>{formData.firstName} {formData.lastName}</strong>!<br />
          {invitation ? `Your account is linked with ${invitation.brokerName}.` : "Your ZapDocs user account is now active."}
        </p>
        {primaryBtn("Go to Dashboard →", () => navigate("/user/dashboard", { replace: true }), false, "user-go-to-dashboard-btn")}
      </div>
    </div>
  );
};

export default UserSignupPage;
