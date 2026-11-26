import React from "react";

// ── Broker route guard ────────────────────────────────────────
// Bypassed: Direct access to broker dashboard without login
export const ProtectedBrokerRoute = ({ children }) => {
	return <>{children}</>;
};

// ── User/Owner route guard ────────────────────────────────────
// Bypassed: Direct access to user/owner dashboard without login credentials
export const ProtectedUserRoute = ({ children }) => {
	return <>{children}</>;
};
