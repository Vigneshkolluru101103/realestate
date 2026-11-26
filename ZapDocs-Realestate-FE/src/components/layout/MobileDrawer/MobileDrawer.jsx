import React, { useEffect } from 'react';
import { User, LogOut, X, CircleCheck } from 'lucide-react';
import { ZapDocsLogo } from '../../ZapDocsLogo';
import { NAV_ITEMS } from '../navigationItems';
import NavIcon from '../NavIcon';
import { useLanguage } from '../../../contexts/LanguageContext';
import './MobileDrawer.css';

export default function MobileDrawer({
  isOpen,
  onClose,
  activeNavId = 'home',
  onNavigate,
  user,
  onLogout
}) {
  const { t } = useLanguage();

  // Close drawer on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="zd-drawer-portal">
      {/* Backdrop overlay */}
      <div
        className="zd-drawer__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer surface */}
      <aside
        className="zd-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        <div className="zd-drawer__header">
          <ZapDocsLogo size="md" variant="horizontal" />
          <button
            type="button"
            className="zd-drawer__close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="zd-drawer__nav">
          <div
            className="zd-drawer__section-label"
            style={{ padding: '6px 12px 8px', fontSize: '11px', textTransform: 'uppercase', color: '#475569', fontWeight: 700, letterSpacing: '0.05em' }}
          >
            {t('nav_section_main', 'Main Navigation')}
          </div>
          <ul className="zd-drawer__list" role="list">
            {NAV_ITEMS.slice(0, 3).map((item) => {
              const isActive = activeNavId === item.id;
              const labelKey = 'nav_' + item.id.replace('-', '_');
              return (
                <li key={item.id} className="zd-drawer__item">
                  <button
                    type="button"
                    className={`zd-drawer__link ${isActive ? 'zd-drawer__link--active' : ''}`}
                    onClick={() => {
                      if (onNavigate) onNavigate(item.id);
                      onClose();
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="zd-drawer__icon" aria-hidden="true">
                      <NavIcon name={item.iconType} />
                    </span>
                    <span className="zd-drawer__label">{t(labelKey, item.label)}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div
            className="zd-drawer__section-label zd-drawer__section-label--growth"
            style={{ padding: '16px 12px 8px', fontSize: '11px', textTransform: 'uppercase', color: '#475569', fontWeight: 700, letterSpacing: '0.05em' }}
          >
            {t('nav_section_growth', 'Growth & Support')}
          </div>
          <ul className="zd-drawer__list" role="list">
            {NAV_ITEMS.slice(3).map((item) => {
              const isActive = activeNavId === item.id;
              const labelKey = 'nav_' + item.id.replace('-', '_');
              const isRefer = item.id === 'refer';
              return (
                <li key={item.id} className="zd-drawer__item">
                  <button
                    type="button"
                    className={`zd-drawer__link ${isActive ? 'zd-drawer__link--active' : ''}`}
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(item.id);
                      }
                      onClose();
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="zd-drawer__icon" aria-hidden="true">
                      <NavIcon name={item.iconType} />
                    </span>
                    <span className="zd-drawer__label">
                      {isRefer ? t('nav_refer', 'Earn & Refer') : t(labelKey, item.label)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="zd-drawer__footer">
          {user ? (
            <div className="zd-drawer__user-card">
              <div className="sidebar-avatar" style={{ width: 32, height: 32, borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-brand-light)', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={15} />
              </div>
              <div className="zd-drawer__user-info">
                <span className="zd-drawer__user-name">{user.name}</span>
                <span className="zd-drawer__user-id">Licensed Broker</span>
              </div>
              <button
                type="button"
                className="zd-drawer__logout-btn"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="zd-drawer__status">
              <CircleCheck size={13} color="var(--zd-color-success)" aria-hidden="true" />
              <span className="zd-drawer__status-text">ZapDocs Network Active</span>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
