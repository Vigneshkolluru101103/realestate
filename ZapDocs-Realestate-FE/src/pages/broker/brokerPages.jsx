/**
 * Broker page wrappers.
 *
 * Each component is a thin React Router route element that:
 *   1. Creates a router-aware onNavigate callback
 *   2. Passes it as a prop to the real PR-branch screen
 *
 * All UI lives in src/screens/* — nothing is duplicated here.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import HomeDashboardScreen from "../../screens/HomeDashboard/HomeDashboardScreen";
import MyAgreementsScreen from "../../screens/MyAgreements/MyAgreementsScreen";
import ClientsVaultScreen from "../../screens/ClientsVault/ClientsVaultScreen";
import PlanBillingScreen from "../../screens/PlanBilling/PlanBillingScreen";
import HelpSupportScreen from "../../screens/HelpSupport/HelpSupportScreen";
import ReferEarnScreen from "../../screens/ReferEarn/ReferEarnScreen";
import BankUpiSettingsScreen from "../../screens/BankUpiSettings/BankUpiSettingsScreen";

import ErrorBoundary from "../../components/common/ErrorBoundary";

/** Converts legacy nav-id strings to full broker URL paths */
const NAV_TO_ROUTE = {
  home: "/broker/dashboard",
  agreements: "/broker/agreements",
  clients: "/broker/clients",
  billing: "/broker/billing",
  help: "/broker/help",
  refer: "/broker/refer",
  "bank-upi": "/broker/bank-upi",
};

function useNavHandler() {
  const navigate = useNavigate();
  return (navId) => {
    const path = NAV_TO_ROUTE[navId] || "/broker/dashboard";
    navigate(path);
  };
}

export function BrokerHomePage() {
  const onNavigate = useNavHandler();
  return (
    <ErrorBoundary fallbackTitle="Unable to load Home Dashboard">
      <HomeDashboardScreen onNavigate={onNavigate} />
    </ErrorBoundary>
  );
}

export function BrokerAgreementsPage() {
  const onNavigate = useNavHandler();
  return (
    <ErrorBoundary fallbackTitle="Unable to load My Agreements">
      <MyAgreementsScreen onNavigate={onNavigate} />
    </ErrorBoundary>
  );
}

export function BrokerClientsPage() {
  const onNavigate = useNavHandler();
  return (
    <ErrorBoundary fallbackTitle="Unable to load Clients Vault">
      <ClientsVaultScreen onNavigate={onNavigate} />
    </ErrorBoundary>
  );
}

export function BrokerBillingPage() {
  const onNavigate = useNavHandler();
  return (
    <ErrorBoundary fallbackTitle="Unable to load Plan & Billing">
      <PlanBillingScreen onNavigate={onNavigate} />
    </ErrorBoundary>
  );
}

export function BrokerHelpPage() {
  return (
    <ErrorBoundary fallbackTitle="Unable to load Help & Support">
      <HelpSupportScreen />
    </ErrorBoundary>
  );
}

export function BrokerReferPage() {
  const onNavigate = useNavHandler();
  return (
    <ErrorBoundary fallbackTitle="Unable to load Refer & Earn">
      <ReferEarnScreen onNavigate={onNavigate} />
    </ErrorBoundary>
  );
}

export function BrokerBankUpiPage() {
  return (
    <ErrorBoundary fallbackTitle="Unable to load Bank & UPI Settings">
      <BankUpiSettingsScreen />
    </ErrorBoundary>
  );
}
