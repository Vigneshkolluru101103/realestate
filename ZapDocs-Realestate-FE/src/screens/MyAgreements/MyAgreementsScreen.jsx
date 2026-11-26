import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  CheckCheck,
  Bell,
  Clock,
  CircleCheck,
  AlertTriangle,
  FilePlus,
  FileText,
  Files,
  ChevronDown,
  Search,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useBrokerState } from '../../contexts/BrokerStateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { storage } from '../../utils/storage';
import {
  generateSection63Certificate,
  downloadSection63Certificate,
  migrateCertificateStore
} from '../../utils/section63Generator';
import { getComplianceCertificateState } from '../../utils/complianceVerification';
import './MyAgreements.css';

const SEC63_STORAGE_KEY = 'zd_sec63_certs';

export default function MyAgreementsScreen() {
  const {
    agreements,
    openModal,
    dispatchWhatsApp,
    downloadLegalPdf,
    downloadWatermarkedDraft,
    showToast
  } = useBrokerState();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Pending e-Sign' | 'Completed' | 'Expiring Soon'
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setAddMenuOpen(false);
      }
    }
    if (addMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [addMenuOpen]);

  // Per-agreement local certificate state: { [agrId]: { status: 'generating' | 'generated' | 'error', data, error, generatedAt } }
  const [certificates, setCertificates] = useState(() => {
    try {
      const { records, changed } = migrateCertificateStore(storage.get(SEC63_STORAGE_KEY, {}) || {});
      if (changed) storage.set(SEC63_STORAGE_KEY, records);
      return records;
    } catch {
      return {};
    }
  });

  // Live Status Counts for Filter Tabs
  const counts = {
    all: agreements.length,
    pending: agreements.filter((a) => a.status === 'Pending e-Sign').length,
    completed: agreements.filter((a) => a.status === 'Completed').length,
    expiring: agreements.filter((a) => a.status === 'Expiring Soon').length
  };

  // 1-Click Automated WhatsApp Renewal Reminder
  function handleSendRenewalReminder(agr) {
    const tenant = agr.tenantName || 'Tenant';
    const prop = agr.propertyArea || 'your property';
    const msg = `Hello ${tenant}, this is your broker regarding your rental agreement (${agr.id}) for ${prop}. It is scheduled to expire soon. Would you like us to prepare the 11-month lease renewal with instant e-Stamp and e-Sign on ZapDocs?`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  }

  // Generate / Download Section 63 Evidentiary Certificate for a specific agreement row
  function handleGenerateCertForAgreement(agr) {
    if (!agr || !agr.id) {
      if (typeof showToast === 'function') {
        showToast('⚠️ Unable to generate certificate: Invalid agreement record.');
      }
      return;
    }

    const agrId = agr.id;

    // If a local certificate record already exists, download it without creating a duplicate.
    if (certificates[agrId]?.status === 'generated' && certificates[agrId]?.data) {
      try {
        downloadSection63Certificate(certificates[agrId].data, agrId);
        if (typeof showToast === 'function') {
          showToast(`Certificate record already exists for ${agrId}. Downloading it.`);
        }
      } catch (err) {
        console.error(`Error downloading Section 63 certificate for ${agrId}:`, err);
        setCertificates((prev) => ({
          ...prev,
          [agrId]: { ...prev[agrId], status: 'error', error: err.message || 'Download failed' }
        }));
        if (typeof showToast === 'function') {
          showToast(`⚠️ Error downloading certificate record for ${agrId}: ${err.message || 'Failed'}`);
        }
      }
      return;
    }

    // Set loading state strictly for this specific agreement
    setCertificates((prev) => ({
      ...prev,
      [agrId]: { status: 'generating', data: null, error: null }
    }));

    setTimeout(() => {
      try {
        const certData = generateSection63Certificate(agr);
        const nextCertState = {
          status: 'generated',
          data: certData,
          error: null,
          generatedAt: certData.issuedAt
        };

        setCertificates((prev) => {
          const updated = {
            ...prev,
            [agrId]: nextCertState
          };
          try {
            storage.set(SEC63_STORAGE_KEY, updated);
          } catch (e) {
            console.warn('Failed to cache certificates:', e);
          }
          return updated;
        });

        downloadSection63Certificate(certData, agrId);
        if (typeof showToast === 'function') {
          showToast(`Certificate record generated and downloaded for ${agrId}. Verification is pending.`);
        }
      } catch (err) {
        console.error(`Error generating Section 63 certificate for ${agrId}:`, err);
        setCertificates((prev) => ({
          ...prev,
          [agrId]: {
            status: 'error',
            data: null,
            error: err.message || 'Generation failed'
          }
        }));
        if (typeof showToast === 'function') {
          showToast(`⚠️ Error generating certificate record for ${agrId}: ${err.message || 'Failed'}`);
        }
      }
    }, 450);
  }

  const filtered = agreements.filter((item) => {
    const matchesStatus = activeFilter === 'All' || item.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesSearch =
      (item.tenantName || '').toLowerCase().includes(q) ||
      (item.ownerName || '').toLowerCase().includes(q) ||
      (item.propertyArea || '').toLowerCase().includes(q) ||
      (item.id || '').toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  function handleResetSearch() {
    setSearchQuery('');
    setActiveFilter('All');
  }

  function handleDownloadAgreement(agr) {
    if (!agr || !agr.id) {
      if (typeof showToast === 'function') {
        showToast('Unable to download PDF: Invalid agreement record.');
      }
      return;
    }

    if (agr.status === 'Completed' || agr.status === 'Expiring Soon') {
      downloadLegalPdf(agr, agr.shaHash);
      return;
    }

    downloadWatermarkedDraft(agr);
  }

  return (
    <section id="screen-2" className="view-screen active" style={{ display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main, #0f172a)' }}>
            {t('agreements_title', 'My Agreements Section')}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted, #64748b)' }}>
            {t('agreements_subtitle', 'The centralized document management and tracking vault.')}
          </p>
        </div>
        <div className="zd-add-agreement-dropdown-wrap" ref={addMenuRef} style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', borderRadius: '10px', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)' }}>
            <button
              type="button"
              id="btn-add-agreement"
              className="btn btn-primary"
              onClick={() => openModal('generate-agreement', { type: 'Residential Rental Agreement', category: 'rental', term: 'Residential 11M', cost: 0, entryMode: 'choose' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
              <FilePlus size={15} />
              <span>{t('btn_gen_new', 'Generate New Agreement')}</span>
            </button>
            <button
              type="button"
              id="btn-add-agreement-toggle"
              className="btn btn-primary"
              onClick={() => setAddMenuOpen((prev) => !prev)}
              style={{
                borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '0 10px',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="More agreement options"
              aria-expanded={addMenuOpen}
            >
              <ChevronDown size={14} className={addMenuOpen ? 'rotate-180' : ''} />
            </button>
          </div>

          {addMenuOpen && (
            <div
              className="zd-add-agreement-menu"
              id="add-agreement-dropdown-menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(220, 232, 248, 0.95)',
                borderRadius: '12px',
                boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.15)',
                padding: '6px',
                minWidth: '220px'
              }}
            >
              <button
                type="button"
                id="btn-add-rental-agreement"
                className="zd-add-menu-item"
                onClick={() => {
                  setAddMenuOpen(false);
                  openModal('generate-agreement', {
                    type: 'Residential Rental Agreement',
                    category: 'rental',
                    term: 'Residential 11M',
                    cost: 0,
                    entryMode: 'choose'
                  });
                }}
              >
                <FileText size={15} color="#2563eb" />
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0f172a' }}>Rental Agreement</strong>
                  <small style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Standard 11-month lease</small>
                </div>
              </button>
              <button
                type="button"
                id="btn-add-other-agreement"
                className="zd-add-menu-item"
                onClick={() => {
                  setAddMenuOpen(false);
                  openModal('generate-agreement', {
                    type: 'Commercial / Other Agreement',
                    category: 'other',
                    term: 'Commercial / Other Agreement',
                    cost: 0,
                    entryMode: 'choose'
                  });
                }}
              >
                <Files size={15} color="#2563eb" />
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0f172a' }}>Other Agreements</strong>
                  <small style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Commercial lease, corporate, NDA</small>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top Filters & Search with Proper Visibility Horizontal Tab Wrapper */}
      <div className="filter-search-bar">
        {/* Search bar */}
        <div className="search-input-box" style={{ position: 'relative' }}>
          <Search size={15} className="search-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          <input
            type="text"
            id="agreements-search-input"
            placeholder={t('search_agreements_placeholder', 'Search by Tenant Name, Owner Name, or Property Area...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', paddingRight: searchQuery ? '36px' : '14px' }}
          />
          {searchQuery && (
            <button
              type="button"
              className="zd-search-clear-btn"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '4px',
                lineHeight: 1
              }}
              title="Clear search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="filter-tabs-wrapper">
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${activeFilter === 'All' ? 'active' : ''}`}
              id="tab-all"
              onClick={() => setActiveFilter('All')}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <span>{t('filter_all', 'All')}</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '18px',
                padding: '0 6px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                marginLeft: '6px',
                backgroundColor: activeFilter === 'All' ? '#2563eb' : '#e2e8f0',
                color: activeFilter === 'All' ? '#ffffff' : '#475569'
              }}>
                {counts.all}
              </span>
            </button>
            <button
              type="button"
              className={`filter-tab ${activeFilter === 'Pending e-Sign' ? 'active' : ''}`}
              id="tab-pending"
              onClick={() => setActiveFilter('Pending e-Sign')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Clock size={13} color={activeFilter === 'Pending e-Sign' ? '#ffffff' : '#f59e0b'} />
              <span>{t('filter_pending', 'Pending e-Sign')}</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '18px',
                padding: '0 6px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                marginLeft: '4px',
                backgroundColor: activeFilter === 'Pending e-Sign' ? '#f59e0b' : '#e2e8f0',
                color: activeFilter === 'Pending e-Sign' ? '#ffffff' : '#475569'
              }}>
                {counts.pending}
              </span>
            </button>
            <button
              type="button"
              className={`filter-tab ${activeFilter === 'Completed' ? 'active' : ''}`}
              id="tab-completed"
              onClick={() => setActiveFilter('Completed')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <CircleCheck size={13} color={activeFilter === 'Completed' ? '#ffffff' : '#16a34a'} />
              <span>{t('filter_completed', 'Completed')}</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '18px',
                padding: '0 6px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                marginLeft: '4px',
                backgroundColor: activeFilter === 'Completed' ? '#16a34a' : '#e2e8f0',
                color: activeFilter === 'Completed' ? '#ffffff' : '#475569'
              }}>
                {counts.completed}
              </span>
            </button>
            <button
              type="button"
              className={`filter-tab ${activeFilter === 'Expiring Soon' ? 'active' : ''}`}
              id="tab-expiring"
              onClick={() => setActiveFilter('Expiring Soon')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <AlertTriangle size={13} color={activeFilter === 'Expiring Soon' ? '#ffffff' : '#dc2626'} />
              <span>{t('filter_expiring', 'Expiring Soon')}</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '18px',
                padding: '0 6px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                marginLeft: '4px',
                backgroundColor: activeFilter === 'Expiring Soon' ? '#dc2626' : '#e2e8f0',
                color: activeFilter === 'Expiring Soon' ? '#ffffff' : '#475569'
              }}>
                {counts.expiring}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Master-Detail Table */}
      <div className="table-container">
        <table className="custom-table" id="agreements-master-table">
          <thead>
            <tr>
              <th>{t('th_execution_date', 'Execution Date')}</th>
              <th>{t('th_client_property_name', 'Client / Property Name')}</th>
              <th>{t('th_agreement_type', 'Agreement Type')}</th>
              <th>{t('th_real_time_status', 'Real-Time Status')}</th>
              <th className="doc-cell-actions">{t('th_universal_quick_actions', 'Universal Quick Actions')}</th>
            </tr>
          </thead>
          <tbody id="agreements-table-body">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '36px 16px' }}>
                  <div className="empty-state-card">
                    <Search size={32} color="#94a3b8" style={{ marginBottom: '6px' }} />
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main, #0f172a)', marginBottom: '4px' }}>
                      {t('empty_agreements_title', 'No Agreements Found')} {searchQuery || activeFilter !== 'All' ? `("${searchQuery || activeFilter}")` : ''}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', marginBottom: '12px' }}>
                      {t('empty_agreements_desc', 'Try adjusting your search terms or select the \'All\' filter.')}
                    </div>
                    <button type="button" className="btn btn-outline btn-sm" onClick={handleResetSearch}>
                      {t('btn_reset_filters', 'Reset Search & Filters')}
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((agr) => {
                const statusBadge =
                  agr.status === 'Completed'
                    ? 'badge-success'
                    : agr.status === 'Expiring Soon'
                    ? 'badge-danger'
                    : 'badge-warning';

                const dispatches = agr.whatsappDispatches || 0;
                const certState = certificates[agr.id];
                const certificateState = getComplianceCertificateState(certState);

                return (
                  <tr key={agr.id} className="doc-vault-card-row">
                    <td className="doc-cell-date">
                      <div style={{ fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>{agr.date}</div>
                      <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-muted, #64748b)' }}>
                        {agr.id}
                      </div>
                    </td>
                    <td className="doc-cell-client">
                      <div style={{ fontWeight: 700 }}>
                        {agr.tenantName}{' '}
                        <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', fontWeight: 'normal' }}>
                          (Tenant)
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475467' }}>
                        {agr.ownerName}{' '}
                        <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>(Owner)</span> •{' '}
                        {agr.propertyArea}
                      </div>
                    </td>
                    <td className="doc-cell-type">
                      <span className="badge badge-primary">{agr.type}</span>
                    </td>
                    <td className="doc-cell-status">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className={`badge ${statusBadge}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {agr.status === 'Completed' && <CircleCheck size={11} />}
                          {agr.status === 'Pending e-Sign' && <Clock size={11} />}
                          {agr.status === 'Expiring Soon' && <AlertTriangle size={11} />}
                          <span>{agr.status}</span>
                        </span>
                      </div>
                    </td>
                    <td className="doc-cell-actions">
                      <div className="table-quick-actions">
                        <button
                          type="button"
                          id={`btn-whatsapp-${agr.id}`}
                          className="btn btn-sm zd-glass-wa-btn action-btn-whatsapp"
                          title="One-Click WhatsApp Share via ZapDocs"
                          onClick={() => dispatchWhatsApp(agr.id)}
                        >
                          <MessageCircle size={14} />
                          <span>{dispatches > 1 ? t('btn_resend_wa', 'Resend WA') : t('btn_whatsapp', 'WhatsApp')}</span>
                          {dispatches > 0 && (
                            <span className="zd-glass-wa-count" title={`Delivered ${dispatches} times`}>
                              <CheckCheck size={11} /> {dispatches}x
                            </span>
                          )}
                        </button>
                        <button
                          type="button"
                          id={`btn-pdf-${agr.id}`}
                          className="btn btn-outline btn-sm action-btn-pdf"
                          title={`Download agreement PDF for ${agr.id}`}
                          aria-label={`Download agreement PDF for ${agr.id}`}
                          onClick={() => handleDownloadAgreement(agr)}
                        >
                          {t('btn_pdf', 'PDF')}
                        </button>
                        <button
                          type="button"
                          id={`btn-sec63-${agr.id}`}
                          className={`btn btn-sm action-btn-sec63 ${certificateState === 'generated' ? 'sec63-generated' : ''} ${certificateState === 'failed' ? 'sec63-error' : ''}`}
                          title={
                            certificateState === 'generated'
                              ? `Certificate generated for ${agr.id}; verification is pending. Click to download.`
                              : certificateState === 'generating'
                              ? `Generating certificate record for ${agr.id}...`
                              : certificateState === 'failed'
                              ? `Error: ${certState?.error || 'Failed'}. Click to retry.`
                              : `Generate certificate record for agreement ${agr.id}`
                          }
                          aria-label={`Certificate record for agreement ${agr.id}`}
                          disabled={certificateState === 'generating'}
                          onClick={() => handleGenerateCertForAgreement(agr)}
                        >
                          {certificateState === 'generating' ? (
                            <>
                              <Loader2 size={13} className="spin animate-spin" />
                              <span>{t('sec63_generating', 'Generating...')}</span>
                            </>
                          ) : certificateState === 'generated' ? (
                            <>
                              <FileText size={13} />
                              <span>Certificate Generated</span>
                            </>
                          ) : certificateState === 'failed' ? (
                            <>
                              <AlertTriangle size={13} color="#dc2626" />
                              <span>Retry Certificate</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={13} />
                              <span>Generate Certificate</span>
                            </>
                          )}
                        </button>
                        {agr.status === 'Expiring Soon' && (
                          <button
                            type="button"
                            id={`btn-remind-wa-${agr.id}`}
                            className="btn btn-sm zd-glass-wa-remind-btn action-btn-remind-wa"
                            title="Send 1-Click WhatsApp Renewal Reminder to Tenant"
                            onClick={() => handleSendRenewalReminder(agr)}
                          >
                            <Bell size={13} />
                            <span>{t('btn_remind_wa', 'Remind WA')}</span>
                          </button>
                        )}
                        {agr.status !== 'Expiring Soon' && (
                          <span className="action-btn-remind-wa-slot" aria-hidden="true" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted, #64748b)', flexWrap: 'wrap', gap: '8px' }}>
        <span id="agreements-counter-text">
          {t('showing_agreements_prefix', 'Showing')} {filtered.length} {t('showing_agreements_of', 'of')} {agreements.length} {t('agreements_unit', 'agreements')}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <ShieldCheck size={14} color="#059669" />
          <span>{t('nesl_uidai_backing', 'All agreements backed by NeSL e-Stamping & UIDAI e-Sign Certificate')}</span>
        </span>
      </div>
    </section>
  );
}
