/**
 * UserLoginPage — Phase 1 User/Owner authentication entry.
 * "User" and "Owner" are the same entity in Phase 1.
 */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { ZapDocsLogo } from "../../components/ZapDocsLogo";
import { sessionManager } from "../../auth/sessionManager";

export const UserLoginPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedId = identifier.trim();
    if (!trimmedId || !password) {
      setError("Please enter your email or mobile number and password.");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      sessionManager.setUserSession({ identifier: trimmedId });
      navigate("/user/dashboard", { replace: true });
    } catch {
      setError("Invalid credentials. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 60%, #eef6ff 100%)",
        padding: "24px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          boxShadow: "0 12px 36px rgba(37, 99, 235, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
          padding: "40px 36px",
        }}
      >
        {/* Brand */}
        <ZapDocsLogo size="md" badge="PORTAL" subtitle="Smart Loop | LegalTech" style={{ marginBottom: 26 }} />

        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 4,
          }}
        >
          Sign in
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            marginBottom: 24,
            lineHeight: 1.45,
          }}
        >
          Access your digital rental agreements and e-signed legal documents.
        </p>

        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 18,
              fontSize: 12.5,
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="user-identifier"
              style={{
                display: "block",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#334155",
                marginBottom: 5,
              }}
            >
              Email or Mobile Number
            </label>
            <input
              id="user-identifier"
              type="text"
              placeholder="you@example.com or 10-digit mobile"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                height: 40,
                padding: "0 12px",
                fontSize: 13.5,
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="user-password"
              style={{
                display: "block",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#334155",
                marginBottom: 5,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="user-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 38px 0 12px",
                  fontSize: 13.5,
                  color: "#0f172a",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 42,
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            }}
          >
            {loading ? (
              <Loader2 size={16} className="spinner" />
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: 22,
            textAlign: "center",
            fontSize: 12.5,
            color: "#64748b",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/user/signup"
            style={{
              color: "#2563eb",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
