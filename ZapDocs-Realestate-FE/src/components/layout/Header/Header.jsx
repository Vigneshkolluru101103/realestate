import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  User,
  LogOut,
  CreditCard,
  Landmark,
  Home,
  FileText,
  Users,
  Gift,
  HelpCircle,
  Check,
  Globe,
  ChevronDown,
  BarChart2,
  X
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useBrokerAuth } from '../../../hooks/useBrokerAuth';
import './Header.css';

export default function Header({
  greeting,
  activeNavId = 'home',
  onNavigate,
  onOpenMobileMenu,
  user: propUser,
  onLogout: propOnLogout
}) {
  const { setLanguage, t, language, availableLanguages = [] } = useLanguage();
  const { user: authUser, logout: authLogout } = useBrokerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const user = propUser || authUser;

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns on outside click and Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setLangDropdownOpen(false);
        if (!isLoggingOut) {
          setShowLogoutDialog(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoggingOut]);

  // Close dropdowns on route changes
  useEffect(() => {
    setProfileDropdownOpen(false);
    setLangDropdownOpen(false);
  }, [location.pathname]);

  async function handleConfirmLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      if (propOnLogout) {
        await propOnLogout();
      } else {
        try {
          sessionStorage.clear();
        } catch {}
        if (authLogout) authLogout();
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  }

  // Broker avatar initials
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'RS';

  const currentLangUpper = (language || 'EN').toUpperCase();

  return (
    <header className="zd-header topbar">
      <div className="zd-header__nav-row">
        <div className="zd-header__nav-left">
          {/* Mobile menu trigger */}
          <button
            type="button"
            className="topbar-menu-btn zd-header__menu-btn"
            id="btn-mobile-menu"
            onClick={onOpenMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Desktop Brand Logo matching screenshot: Icon + ZapDocs + Broker Portal */}
          <div
            className="zd-header__brand-block"
            onClick={() => (onNavigate ? onNavigate('home') : navigate('/broker/dashboard'))}
            title="ZapDocs Broker Portal"
          >
            <img
              src="/zapdocs-emblem.png"
              alt="ZapDocs"
              style={{ height: '30px', width: 'auto', display: 'block' }}
            />
            <div className="zd-header__brand-titles">
              <span className="zd-header__brand-name">ZapDocs</span>
              <span className="zd-header__brand-sub">Smart Loop | LegalTech</span>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="zd-header__brand-divider" aria-hidden="true" />

          {/* Center Navigation Bar across Desktop */}
          <nav className="zd-header__desktop-nav" aria-label="Main Navigation">
            {/* 1. Dashboard */}
            <button
              type="button"
              id="nav-tab-home"
              className={`zd-nav-tab ${activeNavId === 'home' ? 'active' : ''}`}
              onClick={() => (onNavigate ? onNavigate('home') : navigate('/broker/dashboard'))}
            >
              <Home size={15} />
              <span>{t('nav_home', 'Dashboard')}</span>
            </button>

            {/* 2. My Agreements */}
            <button
              type="button"
              id="nav-tab-agreements"
              className={`zd-nav-tab ${activeNavId === 'agreements' ? 'active' : ''}`}
              onClick={() => (onNavigate ? onNavigate('agreements') : navigate('/broker/agreements'))}
            >
              <FileText size={15} />
              <span>{t('nav_agreements', 'My Agreements')}</span>
            </button>

            {/* 3. Clients Vault */}
            <button
              type="button"
              id="nav-tab-clients"
              className={`zd-nav-tab ${activeNavId === 'clients' ? 'active' : ''}`}
              onClick={() => (onNavigate ? onNavigate('clients') : navigate('/broker/clients'))}
            >
              <Users size={15} />
              <span>{t('nav_clients_vault', 'Clients Vault')}</span>
            </button>

            {/* 4. Earn & Refer (Green Pill - Fully Functional) */}
            <button
              type="button"
              id="nav-tab-refer"
              className={`zd-nav-tab zd-nav-tab--refer ${activeNavId === 'refer' ? 'active' : ''}`}
              onClick={() => (onNavigate ? onNavigate('refer') : navigate('/broker/refer'))}
              title={t('nav_refer', 'Earn & Refer')}
              aria-label={t('nav_refer', 'Earn & Refer')}
            >
              <Gift size={15} color={activeNavId === 'refer' ? '#ffffff' : '#047857'} />
              <span>{t('nav_refer', 'Earn & Refer')}</span>
            </button>

            {/* 5. Help & Support */}
            <button
              type="button"
              id="nav-tab-help"
              className={`zd-nav-tab ${activeNavId === 'help' ? 'active' : ''}`}
              onClick={() => (onNavigate ? onNavigate('help') : navigate('/broker/help'))}
            >
              <HelpCircle size={15} />
              <span>{t('nav_help', 'Help & Support')}</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Language Selector and Profile Avatar */}
        <div className="zd-header__nav-right">
          {/* Language Selector Pill: 🌐 EN ˅ */}
          <div className="zd-header__lang-wrap" style={{ position: 'relative' }} ref={langRef}>
            <button
              type="button"
              className="zd-lang-pill-btn"
              id="btn-header-lang-toggle"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              aria-label="Language Selector"
            >
              <span aria-hidden="true">🌐</span>
              <span id="header-current-lang-code">{currentLangUpper}</span>
              <ChevronDown size={13} />
            </button>

            {/* Language Menu Dropdown */}
            {langDropdownOpen && (
              <div
                className="zd-lang-menu-dropdown"
                id="header-lang-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  minWidth: '180px',
                  background: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(220, 232, 248, 0.85)',
                  borderRadius: '14px',
                  boxShadow: '0 16px 36px -4px rgba(15, 23, 42, 0.1), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
                  zIndex: 1100,
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                {availableLanguages.map((item) => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      id={`btn-lang-${item.code}`}
                      onClick={() => {
                        setLanguage(item.code, true);
                        setLangDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        fontSize: '12.5px',
                        borderRadius: '6px',
                        border: 'none',
                        background: isSelected ? '#eff6ff' : 'transparent',
                        color: isSelected ? '#1d4ed8' : '#334155',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit'
                      }}
                    >
                      <span>{item.fullLabel}</span>
                      {isSelected && <Check size={14} color="#1d4ed8" strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile User Icon */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              type="button"
              className="zd-icon-round-btn zd-icon-round-btn--user profile-avatar-btn"
              id="btn-broker-profile"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setLangDropdownOpen(false);
              }}
              title="Broker Account & Profile"
              aria-label="Broker Account & Profile"
            >
              <User size={16} />
            </button>

            {profileDropdownOpen && (
              <div
                className="profile-dropdown show"
                id="broker-profile-dropdown"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: 'min(300px, calc(100vw - 20px))',
                  background: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(220, 232, 248, 0.85)',
                  borderRadius: '14px',
                  boxShadow: '0 20px 40px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
                  zIndex: 1100,
                  padding: '14px',
                  fontSize: '12px',
                  textAlign: 'left'
                }}
              >
                {/* Profile Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #eaecf0' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13px',
                      flexShrink: 0
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.name || 'Rajesh Sharma'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.identifier || 'rajesh.sharma@zapdocs.com'}
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div style={{ padding: '10px 0', borderBottom: '1px solid #eaecf0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{t('profile_id_label', 'Broker ID')}:</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{user?.id || 'BRK-9042'}</span>
                  </div>
                </div>

                {/* Quick Nav Links */}
                <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    type="button"
                    id="btn-profile-bank"
                    onClick={() => {
                      navigate('/broker/bank-upi');
                      setProfileDropdownOpen(false);
                    }}
                    className="profile-dropdown-item"
                  >
                    <Landmark size={14} />
                    <span>{t('profile_manage_bank', t('profile_view_bank', 'Manage Bank & Settlement UPI'))}</span>
                  </button>
                </div>

                {/* Logout */}
                <div style={{ paddingTop: '8px', borderTop: '1px solid #eaecf0' }}>
                  <button
                    type="button"
                    id="btn-profile-logout"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setShowLogoutDialog(true);
                    }}
                    className="profile-dropdown-logout"
                  >
                    <LogOut size={14} />
                    <span>{t('logout', 'Log Out')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && typeof document !== 'undefined' && createPortal(
        <div
          className="modal-overlay active"
          id="logout-confirmation-modal"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
            opacity: 1,
            pointerEvents: 'auto'
          }}
          onClick={() => {
            if (!isLoggingOut) setShowLogoutDialog(false);
          }}
        >
          <div
            className="modal-card logout-modal-card"
            style={{
              maxWidth: '440px',
              width: '100%',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(220, 232, 248, 0.9)',
              boxShadow: '0 20px 40px -4px rgba(15, 23, 42, 0.16), 0 8px 16px -2px rgba(15, 23, 42, 0.08)',
              padding: '24px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 id="logout-dialog-title" style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                Confirm Logout
              </h3>
              <button
                type="button"
                id="btn-close-logout-modal"
                onClick={() => {
                  if (!isLoggingOut) setShowLogoutDialog(false);
                }}
                disabled={isLoggingOut}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to log out of your ZapDocs Broker account?
            </p>
            <div className="logout-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                id="btn-cancel-logout"
                className="btn btn-secondary"
                onClick={() => setShowLogoutDialog(false)}
                disabled={isLoggingOut}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: isLoggingOut ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-logout"
                className="btn btn-primary"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                  opacity: isLoggingOut ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isLoggingOut ? 'Logging out...' : 'Yes, Log Out'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
