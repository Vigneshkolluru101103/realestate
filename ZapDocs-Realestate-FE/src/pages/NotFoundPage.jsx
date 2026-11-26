/**
 * NotFoundPage — 404 page for unmatched routes.
 * Provides a clear message and navigation button back to the login page.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { ZapDocsLogo } from "../components/ZapDocsLogo";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 60%, #eef6ff 100%)",
        padding: "32px 20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        textAlign: "center",
      }}
    >
      <ZapDocsLogo size="md" variant="vertical" subtitle="Smart Loop | LegalTech" />

      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 32,
          marginBottom: 20,
        }}
      >
        <FileQuestion size={32} color="#94a3b8" />
      </div>

      <h1
        data-testid="not-found-title"
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 8,
          letterSpacing: "-0.5px",
        }}
      >
        404 — Page Not Found
      </h1>

      <p
        style={{
          fontSize: 14,
          color: "#64748b",
          maxWidth: 380,
          lineHeight: 1.6,
          marginBottom: 32,
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Please use the button
        below to return to the login page.
      </p>

      <button
        type="button"
        data-testid="not-found-go-home"
        onClick={() => navigate("/login", { replace: true })}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 42,
          padding: "0 24px",
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          color: "#ffffff",
          border: "none",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
          transition: "opacity 150ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <ArrowLeft size={16} />
        Back to Login
      </button>
    </div>
  );
};

export default NotFoundPage;
