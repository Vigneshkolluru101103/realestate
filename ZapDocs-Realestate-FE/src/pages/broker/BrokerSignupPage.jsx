/**
 * BrokerSignupPage — Phase 1 Broker Onboarding Notice.
 *
 * Requirements:
 * Phase 1 onboarding: Broker creation must be admin-only.
 * Keep public broker signup disabled until explicitly approved.
 * Integrate with Firebase Authentication and backend profile APIs.
 */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowRight, ArrowLeft, Mail, PhoneCall } from "lucide-react";
import { ZapDocsLogo } from "../../components/ZapDocsLogo";

export const BrokerSignupPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.08), transparent 70%),
          radial-gradient(#e2e8f0 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 24px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          backgroundColor: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 20px 25px -5px rgba(15, 23, 42, 0.06)",
          padding: "36px 32px",
          textAlign: "center"
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <ZapDocsLogo size="md" variant="vertical" badge="PARTNER NETWORK" />
        </div>

        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            backgroundColor: "rgba(234, 88, 12, 0.1)",
            color: "#ea580c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}
        >
          <ShieldAlert size={26} />
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
          Phase 1: Admin-Only Onboarding
        </h2>

        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
          Public broker self-registration is disabled in Phase 1. Broker accounts are provisioned exclusively by ZapDocs platform administrators.
        </p>

        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "16px",
            textAlign: "left",
            marginBottom: 24,
            fontSize: 13,
            color: "#475569",
            lineHeight: 1.5
          }}
        >
          <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>
            Are you an authorized real estate broker?
          </div>
          <div>
            Please contact your ZapDocs onboarding representative or administrator. Once verified, you will receive your login credentials to access the shared portal.
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#64748b" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Mail size={14} color="#2563eb" />
              <span>support@zapdocs.in</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <PhoneCall size={14} color="#059669" />
              <span>Regional Support Desk: 1800-ZAP-DOCS</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate("/login?portal=broker")}
            style={{
              width: "100%",
              height: 42,
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 150ms ease"
            }}
          >
            <span>Proceed to Shared Login</span>
            <ArrowRight size={16} />
          </button>

          <Link
            to="/login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "#64748b",
              textDecoration: "none",
              padding: "8px"
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
