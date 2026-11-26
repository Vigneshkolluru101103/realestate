/**
* UserDashboardPage — Placeholder.
* "User" and "Owner" are the same entity in Phase 1.
* owner_profiles is the canonical backend table.
*/
import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ZapDocsLogo } from "../../components/ZapDocsLogo";
export const UserDashboardPage = () => {
	const navigate = useNavigate();
	return <div style={{
		minHeight: "100vh",
		background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		fontFamily: "var(--font-family)",
		padding: 24
	}}>
      <ZapDocsLogo size="xl" variant="vertical" subtitle="Smart Loop | LegalTech" style={{ marginBottom: 20 }} />
      <h1 style={{
		fontSize: 24,
		fontWeight: 700,
		color: "var(--color-text-primary)",
		marginBottom: 8
	}}>
        User Dashboard
      </h1>
      <p style={{
		fontSize: 14,
		color: "var(--color-text-secondary)",
		marginBottom: 32,
		textAlign: "center",
		maxWidth: 360,
		lineHeight: 1.6
	}}>
        You're now registered as a ZapDocs User / Owner.
        The full dashboard is coming soon.
      </p>
      <button type="button" onClick={() => navigate("/user/signup", { replace: true })} style={{
		display: "flex",
		alignItems: "center",
		gap: 8,
		height: 40,
		padding: "0 20px",
		border: "1px solid var(--color-border)",
		borderRadius: 8,
		background: "#fff",
		color: "var(--color-text-secondary)",
		fontSize: 13.5,
		fontWeight: 500,
		cursor: "pointer"
	}}>
        <LogOut size={14} /> Back to Signup
      </button>
    </div>;
};
