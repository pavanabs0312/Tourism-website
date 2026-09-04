import React, { useState } from 'react';
import { useAuthority } from '../context/AuthorityContext';
import { TouristDetailDrawer } from '../components/TouristDetailDrawer';
import { 
  Users, Search, Filter, ArrowUpDown, Eye, 
  MapPin, Shield, AlertTriangle, PhoneCall 
} from 'lucide-react';
import { getRiskLevelColor } from '../services/riskEngine';

export const TouristMonitoringPage = () => {
  const { 
    filteredTourists, 
    activeFilter, 
    setActiveFilter, 
    searchQuery, 
    setSearchQuery, 
    sortBy, 
    setSortBy, 
    selectedTourist, 
    setSelectedTourist,
    tourists 
  } = useAuthority();

  const filterTabs = [
    { id: 'ALL', label: `All (${tourists.length})` },
    { id: 'SAFE', label: `🟢 Safe (${tourists.filter(t => t.safetyStatus === 'SAFE' && !t.sosActive).length})` },
    { id: 'CAUTION', label: `🟡 Caution (${tourists.filter(t => t.safetyStatus === 'CAUTION' && !t.sosActive).length})` },
    { id: 'HIGH', label: `🟠 High Risk (${tourists.filter(t => t.safetyStatus === 'HIGH' && !t.sosActive).length})` },
    { id: 'CRITICAL', label: `🔴 Critical (${tourists.filter(t => t.safetyStatus === 'CRITICAL' || t.sosActive).length})` },
    { id: 'SOS', label: `🚨 Active SOS (${tourists.filter(t => t.sosActive).length})` }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 0 4rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.4rem', borderRadius: '8px', color: '#2563eb' }}>
              <Users size={22} />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              Live Tourist Monitoring Roster
            </h1>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Filterable, searchable census of all registered tourists with continuous GNSS accuracy and risk score analytics.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tourist name, Tag ID, or active trip..."
                className="form-input"
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
              />
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={16} color="#64748b" />
              <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748b' }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
              >
                <option value="RISK_DESC">Highest Risk First</option>
                <option value="TIME_DESC">Latest Telemetry Update</option>
                <option value="NAME_ASC">Alphabetical (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Status Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: activeFilter === tab.id ? '#1d4ed8' : '#475569',
                  backgroundColor: activeFilter === tab.id ? '#eff6ff' : '#f1f5f9',
                  border: activeFilter === tab.id ? '1px solid #bfdbfe' : '1px solid transparent',
                  transition: 'all 0.15s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tourist Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <tr>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Tourist & ID</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Safety Status</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Risk Score</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Coordinates & GPS</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Movement</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Deviation</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Last Update</th>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ divideY: '1px solid #f1f5f9' }}>
                {filteredTourists.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                      No tourists match the active filters or search query.
                    </td>
                  </tr>
                ) : (
                  filteredTourists.map((t) => {
                    const colorMeta = getRiskLevelColor(t.safetyStatus);
                    const isSOS = t.sosActive;

                    return (
                      <tr
                        key={t.touristId}
                        style={{
                          backgroundColor: isSOS ? '#fef2f2' : '#ffffff',
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.15s'
                        }}
                      >
                        {/* Tourist Info */}
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{t.name}</strong>
                            {isSOS && <span style={{ fontSize: '0.9rem', animation: 'pulse 1s infinite' }}>🚨</span>}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                            {t.touristId}
                          </div>
                        </td>

                        {/* Safety Status */}
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span className={`badge ${colorMeta.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                            {isSOS ? '🚨 SOS ACTIVE' : t.safetyStatus}
                          </span>
                        </td>

                        {/* Risk Score */}
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <strong style={{ fontSize: '0.95rem', color: colorMeta.text }}>
                              {t.riskScore}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/100</span>
                          </div>
                        </td>

                        {/* Coordinates & Accuracy */}
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#0f172a' }}>
                            {t.latitude?.toFixed(4)}, {t.longitude?.toFixed(4)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: t.gpsAccuracy <= 20 ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
                            ±{t.gpsAccuracy || 10}m accuracy
                          </div>
                        </td>

                        {/* Movement */}
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                            {t.movementStatus || 'Active'}
                          </span>
                        </td>

                        {/* Deviation */}
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{ fontSize: '0.78rem', color: t.routeDeviation?.includes('None') ? '#10b981' : '#ea580c', fontWeight: '600' }}>
                            {t.routeDeviation || 'None'}
                          </span>
                        </td>

                        {/* Last Update */}
                        <td style={{ padding: '0.9rem 1rem', fontSize: '0.75rem', color: '#64748b' }}>
                          {t.lastUpdated ? new Date(t.lastUpdated).toLocaleTimeString() : 'Just now'}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedTourist(t)}
                            className="btn btn-primary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                          >
                            <Eye size={13} />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-out Drawer */}
      <TouristDetailDrawer
        tourist={selectedTourist}
        onClose={() => setSelectedTourist(null)}
      />
    </div>
  );
};
