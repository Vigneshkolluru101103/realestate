/**
* Minimal Broker Dashboard placeholder.
* Replace with the real dashboard when the broker portal is built out.
*/
import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ZapDocsLogo } from "../../components/ZapDocsLogo";
export const BrokerDashboardPage = () => {
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
        Broker Dashboard
      </h1>
      <p style={{
		fontSize: 14,
		color: "var(--color-text-secondary)",
		marginBottom: 32,
		textAlign: "center",
		maxWidth: 360,
		lineHeight: 1.6
	}}>
        You're now logged in as a ZapDocs Broker.
        The full dashboard is coming soon.
      </p>
      <button type="button" onClick={() => navigate("/broker/login", { replace: true })} style={{
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
        <LogOut size={14} /> Back to Login
      </button>
    </div>;
};
