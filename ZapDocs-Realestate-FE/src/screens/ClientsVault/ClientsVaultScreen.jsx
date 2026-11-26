import React, { useState } from 'react';
import { MessageCircle, UserPlus, Search, Phone, MapPin, Building, Users } from 'lucide-react';
import { useBrokerState } from '../../contexts/BrokerStateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './ClientsVault.css';

export default function ClientsVaultScreen() {
  const { clients, agreements = [], openModal, showToast, downloadLegalPdf } = useBrokerState();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Landlord' | 'Tenant'
  const [expandedClientId, setExpandedClientId] = useState(null);

  const filtered = clients.filter((c) => {
    const isLandlord = c.role === 'Landlord' || c.role === 'Landlord / Owner';
    const isTenant = c.role === 'Tenant';

    if (activeTab === 'Landlord' && !isLandlord) return false;
    if (activeTab === 'Tenant' && !isTenant) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.aadhaar || '').toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q)
    );
  });

  function handlePrefillAgreement(client) {
    openModal('generate-agreement', {
      type: client.role === 'Tenant' ? 'Residential Rental Agreement' : 'Residential Rental Agreement',
      cost: 0,
      prefill: client
    });
    showToast(`⚡ Pre-filled ${client.role} details for ${client.name}`);
  }

  function handleEditClient(clientOrId) {
    const client = typeof clientOrId === 'object' && clientOrId !== null
      ? clientOrId
      : clients.find((c) => c.id === clientOrId);
    if (!client) {
      showToast('⚠️ Client record not found.');
      return;
    }
    openModal('edit-client', client);
  }

  function handleChatWhatsApp(phone, name) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    window.open(
      `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`Hello ${name}, this is Rajesh Sharma from ZapDocs.`)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <section id="screen-3" className="view-screen active" style={{ display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main, #0f172a)' }}>
            {t('clients_title', 'Clients Vault')}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted, #64748b)' }}>
            {t('clients_subtitle', 'A centralized directory for repeat landlords and tenants to eliminate redundant typing.')}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          id="btn-add-new-client"
          onClick={() => openModal('add-client')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <UserPlus size={16} /> {t('btn_add_client', '+ Add New Client')}
        </button>
      </div>

      {/* Search & Category Tabs */}
      <div className="filter-search-bar">
        <div className="search-input-box">
          <span className="search-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Search size={15} />
          </span>
          <input
            type="text"
            id="clients-search-input"
            placeholder={t('search_clients_placeholder', 'Search by Client Name, Phone Number, or Aadhaar...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 8px' }}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-tabs-wrapper">
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${activeTab === 'All' ? 'active' : ''}`}
              id="client-tab-all"
              onClick={() => setActiveTab('All')}
            >
              {t('tab_all_clients', 'All')}
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'Landlord' ? 'active' : ''}`}
              id="client-tab-landlords"
              onClick={() => setActiveTab('Landlord')}
            >
              {t('tab_landlords', 'Landlords / Owners')}
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'Tenant' ? 'active' : ''}`}
              id="client-tab-tenants"
              onClick={() => setActiveTab('Tenant')}
            >
              {t('tab_tenants', 'Tenants')}
            </button>
          </div>
        </div>
      </div>

      {/* Client Contact Cards Grid */}
      <div className="clients-grid" id="clients-grid-container">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 16px' }}>
            <div className="empty-state-card">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <Users size={32} color="#94a3b8" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main, #0f172a)', marginBottom: '4px' }}>
                {t('empty_clients_title', 'No clients found in vault')} {searchQuery ? `matching "${searchQuery}"` : ''}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', marginBottom: '12px' }}>
                {t('empty_clients_desc', 'Try adjusting your query or filter tab.')}
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('All');
                }}
              >
                {t('btn_reset_filters', 'Reset Search & Filters')}
              </button>
            </div>
          </div>
        ) : (
          filtered.map((client) => {
            const initials = (client.name || 'C')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();

            const isOwner = client.role === 'Landlord' || client.role === 'Landlord / Owner';

            const clientAgreements = agreements.filter(
              (a) =>
                (a.tenantName && a.tenantName.toLowerCase().includes(client.name.toLowerCase())) ||
                (a.ownerName && a.ownerName.toLowerCase().includes(client.name.toLowerCase()))
            );
            const isExpanded = expandedClientId === client.id;

            return (
              <div key={client.id} className="client-card">
                <div>
                  <div className="client-card-header">
                    <div className="client-avatar-row">
                      <div className="avatar-circle">{initials}</div>
                      <div>
                        <div className="client-name">{client.name}</div>
                        <span className={`badge ${isOwner ? 'badge-primary' : 'badge-neutral'} client-role-badge`}>
                          {isOwner ? t('role_landlord', 'Landlord / Owner') : t('role_tenant', 'Tenant')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="client-info-list">
                    <div className="info-row">
                      <span className="info-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Phone size={13} />
                      </span>
                      <span>{client.phone}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', fontWeight: 600 }}>
                        ID
                      </span>
                      <span>
                        Aadhaar: <code style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11.5px' }}>{client.aadhaar}</code>
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <MapPin size={13} />
                      </span>
                      <span style={{ fontSize: '12px', lineHeight: 1.3 }}>{client.address}</span>
                    </div>
                    <div className="info-row" style={{ marginTop: '4px' }}>
                      <span className="info-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Building size={13} />
                      </span>
                      <span>
                        Linked Properties: <strong>{client.propertiesCount || 1} active</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="client-card-actions" style={{ flexWrap: 'wrap', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ flex: '1 1 120px' }}
                    onClick={() => handlePrefillAgreement(client)}
                  >
                    {t('btn_create_agreement', 'Create Agreement')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setExpandedClientId(isExpanded ? null : client.id)}
                    style={{
                      fontSize: '11.5px',
                      backgroundColor: isExpanded ? '#eff6ff' : 'transparent',
                      borderColor: isExpanded ? '#2563eb' : '#d0d5dd',
                      color: isExpanded ? '#2563eb' : 'inherit'
                    }}
                    title="View past executed agreements"
                  >
                    History ({clientAgreements.length})
                  </button>
                  <button
                    type="button"
                    id={`btn-edit-client-${client.id}`}
                    className="btn btn-outline btn-sm action-btn-edit-client"
                    onClick={() => handleEditClient(client)}
                    title={`Edit ${client.name}'s info`}
                  >
                    {t('btn_edit_client', 'Edit')}
                  </button>
                  <button
                    type="button"
                    id={`btn-client-wa-${client.id}`}
                    className="btn btn-sm zd-glass-wa-icon-btn"
                    onClick={() => handleChatWhatsApp(client.phone, client.name)}
                    title={`Chat with ${client.name} on WhatsApp`}
                    aria-label={`Chat with ${client.name} on WhatsApp`}
                  >
                    <MessageCircle size={15} />
                  </button>
                </div>

                {/* Expandable Past Agreements History */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '10px 12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Past Executed Agreements</span>
                      <span style={{ color: '#2563eb', fontWeight: 600 }}>{clientAgreements.length} found</span>
                    </div>
                    {clientAgreements.length === 0 ? (
                      <div style={{ color: '#64748b', fontStyle: 'italic', padding: '4px 0' }}>
                        No past agreements found for this client.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {clientAgreements.map((a) => (
                          <div
                            key={a.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: '#ffffff',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #edf2f7',
                              flexWrap: 'wrap',
                              gap: '6px'
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 600, color: '#0f172a' }}>{a.id}</span>
                              <span style={{ color: '#64748b', marginLeft: '6px' }}>• {a.date}</span>
                              <div style={{ fontSize: '11px', color: '#475467' }}>{a.type} • {a.propertyArea}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span className={`badge ${a.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                                {a.status}
                              </span>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{ padding: '2px 6px', fontSize: '11px', height: '24px' }}
                                onClick={() => downloadLegalPdf(a, a.shaHash)}
                                title="Download Final Legal PDF"
                              >
                                PDF
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
