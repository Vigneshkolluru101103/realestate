/**
 * BrokerLayout – React Router layout shell for the Broker Portal.
 *
 * Wraps all /broker/* routes. The sidebar nav items call useNavigate()
 * so every screen has its own bookmarkable URL, faithfully reproducing
 * all screens, interactions, and state from index copy.html.
 */
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useBrokerAuth } from "../hooks/useBrokerAuth";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "../components/layout/Header/Header";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import MobileDrawer from "../components/layout/MobileDrawer/MobileDrawer";
import { BrokerStateProvider } from "../contexts/BrokerStateContext";
import BrokerModalManager from "../components/broker/modals/BrokerModalManager";

import "../components/layout/AppLayout/AppLayout.css";
import "../components/layout/Header/Header.css";
import "../components/layout/Sidebar/Sidebar.css";
import "../components/layout/MobileDrawer/MobileDrawer.css";
import "../broker/brokerPrototype.css";

/** Map URL segment → nav item id */
const ROUTE_TO_NAV = {
  "dashboard": "home",
  "agreements": "agreements",
  "clients": "clients",
  "billing": "billing",
  "help": "help",
  "refer": "refer",
  "bank-upi": "bank-upi",
};

/** Map nav item id → URL path */
const NAV_TO_ROUTE = {
  "home": "/broker/dashboard",
  "agreements": "/broker/agreements",
  "clients": "/broker/clients",
  "billing": "/broker/billing",
  "help": "/broker/help",
  "refer": "/broker/refer",
  "bank-upi": "/broker/bank-upi",
};

export function BrokerLayout() {
  const { user, logout } = useBrokerAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derive the active nav ID from the current URL pathname
  const pathSegment = location.pathname.replace(/^\/broker\/?/, "").split("/")[0] || "dashboard";
  const activeNavId = ROUTE_TO_NAV[pathSegment] || "home";

  function handleNavigate(navId) {
    const path = NAV_TO_ROUTE[navId] || "/broker/dashboard";
    navigate(path);
    setIsMobileMenuOpen(false);
  }

  async function handleLogout() {
    try {
      sessionStorage.clear();
    } catch {}
    logout();
    navigate("/login");
  }

  const greeting = user
    ? `${t("header_greeting_prefix", "Hello")}, ${user.name} 👋`
    : `${t("header_greeting_prefix", "Hello")}, Broker 👋`;

  return (
    <BrokerStateProvider>
      <div className="zd-app-shell zd-broker-shell">
        {/* Mobile Drawer (for small viewports) */}
        <MobileDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activeNavId={activeNavId}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main View Area - 100% Full Width */}
        <div className="zd-main-wrapper">
          <Header
            greeting={greeting}
            activeNavId={activeNavId}
            onNavigate={handleNavigate}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            user={user}
            onLogout={handleLogout}
          />
          <main className="zd-content-viewport" id="main-content">
            <div className="zd-content-container">
              {/* React Router renders the matched child route here */}
              <Outlet />
            </div>
          </main>
        </div>

        {/* Universal Prototype Modals & Notifications Manager */}
        <BrokerModalManager />
      </div>
    </BrokerStateProvider>
  );
}

export default BrokerLayout;
