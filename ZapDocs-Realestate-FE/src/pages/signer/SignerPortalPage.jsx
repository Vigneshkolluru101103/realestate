import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api/client";
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, Phone, Home, IndianRupee } from "lucide-react";

export function SignerPortalPage() {
  const { token } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [signing, setSigning] = useState(false);
  const [signSuccess, setSignSuccess] = useState(null);

  useEffect(() => {
    async function loadSession() {
      try {
        setLoading(true);
        const data = await api.get(`/signing-session/${token}`);
        setSession(data);
      } catch (err) {
        setError(err.message || "Invalid or expired e-signing link.");
      } finally {
        setLoading(false);
      }
    }
    if (token) loadSession();
  }, [token]);

  const handleSendOtp = async () => {
    try {
      setError("");
      await api.post(`/signing-session/${token}/send-otp`);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to dispatch WhatsApp OTP.");
    }
  };

  const handleSign = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }
    try {
      setSigning(true);
      setError("");
      const res = await api.post(`/signing-session/${token}/sign`, {
        otp_code: otpCode.trim(),
        signer_name: session?.party_name || "Signer",
      });
      setSignSuccess(res);
    } catch (err) {
      setError(err.message || "Failed to verify signature.");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f8fafc" }}>
        <p>Loading legal e-signing session...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div style={{ background: "#1e293b", border: "1px solid #ef4444", borderRadius: "1rem", padding: "2rem", maxWidth: "440px", textAlign: "center", color: "#f8fafc" }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: "0 auto 1rem" }} />
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Link Unavailable</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "1rem", padding: "2rem", maxWidth: "480px", width: "100%", color: "#f8fafc", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
        
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "#064e3b", color: "#34d399", fontSize: "0.75rem", fontWeight: 600, padding: "0.3rem 0.75rem", borderRadius: "9999px", marginBottom: "1rem" }}>
          <ShieldCheck size={14} /> Section 63 BSA 2023 Digital Execution
        </div>

        <h1 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.35rem" }}>Independent E-Signing Portal</h1>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1.5rem", lineHeight: 1.4 }}>
          Legally review and execute your residential rental agreement via direct WhatsApp verification.
        </p>

        {/* Document Details Card */}
        <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "0.75rem", padding: "1rem", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#64748b" }}>Reference ID</span>
            <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{session?.reference_id}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#64748b" }}>Signing Role</span>
            <span style={{ fontWeight: 600, color: "#38bdf8" }}>{session?.party_role === "LANDLORD" ? "Landlord / Lessor" : "Tenant / Lessee"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#64748b" }}>Signer Name</span>
            <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{session?.party_name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#64748b" }}>Mobile Number</span>
            <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{session?.party_phone_masked}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#64748b" }}>Monthly Rent</span>
            <span style={{ fontWeight: 600, color: "#e2e8f0" }}>₹{Number(session?.monthly_rent || 0).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {error && (
          <div style={{ background: "#450a0a", border: "1px solid #ef4444", borderRadius: "0.5rem", padding: "0.75rem", color: "#fca5a5", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {signSuccess ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <CheckCircle2 size={56} color="#10b981" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#34d399", marginBottom: "0.5rem" }}>Signature Successfully Executed!</h3>
            <p style={{ color: "#cbd5e1", fontSize: "0.875rem", marginBottom: "1.25rem" }}>{signSuccess.message}</p>
            {signSuccess.is_agreement_completed && signSuccess.final_document_id && (
              <a
                href={`/api/v1/storage/download/${signSuccess.final_document_id}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: "block", background: "#2563eb", color: "#fff", textDecoration: "none", padding: "0.85rem", borderRadius: "0.5rem", fontWeight: 600 }}
              >
                📥 Download Final Stamped Agreement
              </a>
            )}
          </div>
        ) : (
          <div>
            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", padding: "0.85rem", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.95rem", cursor: "pointer" }}
              >
                📲 Send OTP to WhatsApp ({session?.party_phone_masked})
              </button>
            ) : (
              <div>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", textAlign: "center", marginBottom: "0.75rem" }}>
                  Enter the 6-digit verification code sent to your WhatsApp:
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="------"
                  style={{ width: "100%", padding: "0.85rem", background: "#0f172a", border: "1px solid #475569", borderRadius: "0.5rem", color: "#f8fafc", fontSize: "1.25rem", fontWeight: 700, textAlign: "center", letterSpacing: "0.35rem", marginBottom: "1rem" }}
                />
                <button
                  onClick={handleSign}
                  disabled={signing}
                  style={{ width: "100%", background: "#059669", color: "#fff", border: "none", padding: "0.85rem", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.95rem", cursor: "pointer" }}
                >
                  {signing ? "Verifying & Signing..." : "✍️ Verify OTP & Legally Sign"}
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.75rem", color: "#64748b" }}>
          Karnataka Stamp Act, 1957 & Section 63 BSA 2023 Compliant · Secured by ZapDocs
        </div>
      </div>
    </div>
  );
}
