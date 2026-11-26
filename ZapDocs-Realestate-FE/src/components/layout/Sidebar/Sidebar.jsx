import React from 'react';
import { User, LogOut, CircleCheck, Gift } from 'lucide-react';
import { ZapDocsLogo } from '../../ZapDocsLogo';
import { NAV_ITEMS } from '../navigationItems';
import NavIcon from '../NavIcon';
import { useBrokerState } from '../../../contexts/BrokerStateContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import './Sidebar.css';

export default function Sidebar({ activeNavId = 'home', onNavigate, user, onLogout }) {
  const { agreements, clients, openModal } = useBrokerState();
  const { t } = useLanguage();

  return (
    <aside className="zd-sidebar sidebar" aria-label="Main Navigation">
      {/* Brand Header */}
      <div className="zd-sidebar__brand sidebar-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
        <ZapDocsLogo size="md" variant="horizontal" badge="BROKER" />
      </div>

      {/* Mobile Profile Identity Chip */}
      <div className="mobile-profile-chip" style={{ margin: '0 12px 14px', padding: '8px 12px', background: '#f8fafc', border: '1px solid #eaecf0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          className="chip-avatar"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#2563eb',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '12px'
          }}
        >
          {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'RS'}
        </div>
        <div>
          <div className="chip-name" style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
            {user?.name || 'Rajesh Sharma'}
          </div>
          <div className="chip-tier" style={{ fontSize: '11px', color: '#175cd3', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CircleCheck size={12} color="#2563eb" />
            <span>{t('broker_verified', 'Licensed Broker')}</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="zd-sidebar__nav" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="sidebar-section-label" style={{ padding: '6px 14px 8px', fontSize: '11px', textTransform: 'uppercase', color: '#475569', fontWeight: 700, letterSpacing: '0.05em' }}>
          {t('nav_section_main', 'Main Navigation')}
        </div>
        <ul className="zd-sidebar__list" role="list">
          {NAV_ITEMS.slice(0, 3).map((item) => {
            const isActive = activeNavId === item.id;
            let countPill = null;
            if (item.id === 'agreements') countPill = agreements.length;
            if (item.id === 'clients') countPill = clients.length;
            const labelKey = 'nav_' + item.id.replace('-', '_');

            return (
              <li key={item.id} className="zd-sidebar__item">
                <button
                  type="button"
                  className={`zd-sidebar__link ${isActive ? 'zd-sidebar__link--active' : ''}`}
                  onClick={() => onNavigate && onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="zd-sidebar__icon" aria-hidden="true">
                      <NavIcon name={item.iconType} />
                    </span>
                    <span className="zd-sidebar__label">{t(labelKey, item.label)}</span>
                  </div>
                  {countPill !== null && (
                    <span
                      className="nav-pill"
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        borderRadius: '9999px',
                        fontWeight: 700
                      }}
                    >
                      {countPill}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-section-label" style={{ padding: '16px 14px 8px', fontSize: '11px', textTransform: 'uppercase', color: '#475569', fontWeight: 700, letterSpacing: '0.05em' }}>
          {t('nav_section_growth', 'Growth & Support')}
        </div>
        <ul className="zd-sidebar__list" role="list">
          {NAV_ITEMS.slice(3).map((item) => {
            const isActive = activeNavId === item.id;
            const labelKey = 'nav_' + item.id.replace('-', '_');
            return (
              <li key={item.id} className="zd-sidebar__item">
                <button
                  type="button"
                  className={`zd-sidebar__link ${isActive ? 'zd-sidebar__link--active' : ''}`}
                  onClick={() => {
                    if (onNavigate) onNavigate(item.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="zd-sidebar__icon" aria-hidden="true">
                      <NavIcon name={item.iconType} />
                    </span>
                    <span className="zd-sidebar__label">{t(labelKey, item.label)}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Persistent Sidebar Refer & Earn Entry Point matching prototype */}
      <div className="sidebar-footer" style={{ padding: '10px 12px 14px' }}>
        <div
          className="refer-mini-cta"
          id="btn-sidebar-refer"
          onClick={() => openModal('refer-earn')}
          style={{
            cursor: 'pointer',
            padding: '10px 12px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
            border: '1.5px solid #bfdbfe',
            borderRadius: '8px'
          }}
        >
          <div className="title" style={{ fontWeight: 800, fontSize: '12px', color: '#175cd3', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Gift size={13} />
            <span>Refer &amp; Earn ₹50</span>
          </div>
          <div className="desc" style={{ fontSize: '11px', color: '#475467', marginTop: '2px', lineHeight: 1.3 }}>
            Earn instant ₹50 per broker signup credited to your UPI ID.
          </div>
        </div>
      </div>

      {/* Footer Area: User details and sign out */}
      <div className="zd-sidebar__footer" style={{ padding: '12px 16px', borderTop: '1px solid #eaecf0' }}>
        {user ? (
          <div className="zd-sidebar__user-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="zd-sidebar__avatar">
                <User size={15} />
              </div>
              <div className="zd-sidebar__user-info">
                <span className="zd-sidebar__user-name" title={user.name}>{user.name}</span>
                <span className="zd-sidebar__user-id" style={{ fontSize: '11px', color: '#64748b' }}>Licensed Broker</span>
              </div>
            </div>
            <button
              type="button"
              id="broker-logout-btn"
              data-testid="broker-logout-btn"
              className="zd-sidebar__logout-btn"
              onClick={onLogout}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="zd-sidebar__status">
            <span className="zd-sidebar__status-dot" aria-hidden="true" />
            <span className="zd-sidebar__status-text">ZapDocs Network Active</span>
          </div>
        )}
      </div>
    </aside>
  );
}
