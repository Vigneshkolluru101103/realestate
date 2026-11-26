import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BrokerAuthProvider } from "../contexts/BrokerAuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ProtectedBrokerRoute, ProtectedUserRoute } from "./ProtectedRoute";
import { BrokerLayout } from "../layouts/BrokerLayout";
import { LanguageProvider } from "../contexts/LanguageContext";
// ── Broker portal pages ───────────────────────────────────────
import { BrokerSignupPage } from "../pages/broker/BrokerSignupPage";
import {
	BrokerHomePage,
	BrokerAgreementsPage,
	BrokerClientsPage,
	BrokerBillingPage,
	BrokerHelpPage,
	BrokerReferPage,
	BrokerBankUpiPage,
} from "../pages/broker/brokerPages";
// ── User/Owner portal ────────────────────────────────────────
import { UserSignupPage } from "../pages/user/UserSignupPage";
import { UserDashboardPage } from "../pages/user/UserDashboardPage";
import { SignerPortalPage } from "../pages/signer/SignerPortalPage";
import { NotFoundPage } from "../pages/NotFoundPage";
// ─────────────────────────────────────────────────────────────


/** Broker section: protected by BrokerAuthContext (mock localStorage) */
const BrokerApp = () => (
	<ProtectedBrokerRoute>
		<BrokerLayout />
	</ProtectedBrokerRoute>
);

export const AppRouter = () => (
	<BrowserRouter>
		<ThemeProvider>
			<LanguageProvider>
				<BrokerAuthProvider>
					<Routes>
						{/* ── Direct entry: Redirect straight to Broker Dashboard ── */}
						<Route path="/" element={<Navigate to="/broker/dashboard" replace />} />

						{/* ── Login bypass: redirect straight to Broker Dashboard ── */}
						<Route path="/login" element={<Navigate to="/broker/dashboard" replace />} />
						<Route path="/broker/login" element={<Navigate to="/broker/dashboard" replace />} />
						<Route path="/broker/signup" element={<BrokerSignupPage />} />

						{/* Protected broker routes rendered inside BrokerLayout via Outlet */}
						<Route path="/broker" element={<BrokerApp />}>
							<Route index element={<Navigate to="dashboard" replace />} />
							<Route path="dashboard" element={<BrokerHomePage />} />
							<Route path="agreements" element={<BrokerAgreementsPage />} />
							<Route path="clients" element={<BrokerClientsPage />} />
							<Route path="billing" element={<BrokerBillingPage />} />
							<Route path="help" element={<BrokerHelpPage />} />
							<Route path="refer" element={<BrokerReferPage />} />
							<Route path="bank-upi" element={<BrokerBankUpiPage />} />
							<Route path="*" element={<Navigate to="dashboard" replace />} />
						</Route>

						{/* ── User/Owner Portal (login bypassed for direct preview) ── */}
						<Route path="/user/login" element={<Navigate to="/user/dashboard" replace />} />
						<Route path="/user/signup" element={<UserSignupPage />} />
						<Route path="/user/dashboard" element={<ProtectedUserRoute><UserDashboardPage /></ProtectedUserRoute>} />

						{/* Legacy owner paths → redirect to /user */}
						<Route path="/owner/login" element={<Navigate to="/owner/dashboard" replace />} />
						<Route path="/owner/signup" element={<UserSignupPage />} />
						<Route path="/owner/dashboard" element={<ProtectedUserRoute><UserDashboardPage /></ProtectedUserRoute>} />

						{/* ── Public Independent WhatsApp Signer Portal ── */}
						<Route path="/sign/:token" element={<SignerPortalPage />} />

						{/* ── 404 & Fallback ── */}
						<Route path="/404" element={<NotFoundPage />} />
						<Route path="*" element={<Navigate to="/broker/dashboard" replace />} />
					</Routes>
				</BrokerAuthProvider>
			</LanguageProvider>
		</ThemeProvider>
	</BrowserRouter>
);
