import React, { useState } from 'react';
import { useAuthority } from '../context/AuthorityContext';
import { TouristDetailDrawer } from '../components/TouristDetailDrawer';
import { 
  Bell, AlertTriangle, PhoneCall, CheckCircle2, 
  Clock, MapPin, Eye, Filter, ShieldAlert 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AlertCenterPage = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    resolveAlert, 
    selectedTourist, 
    setSelectedTourist, 
    tourists 
  } = useAuthority();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'SOS' | 'HIGH' | 'PENDING'

  const filteredAlerts = alerts.filter(a => {
    if (activeTab === 'SOS' && a.type !== 'SOS') return false;
    if (activeTab === 'HIGH' && a.severity !== 'HIGH' && a.severity !== 'CRITICAL') return false;
    if (activeTab === 'PENDING' && a.status === 'RESOLVED') return false;
    return true;
  });

  const handleInspectTourist = (touristId) => {
    const t = tourists.find(item => item.touristId === touristId);
    if (t) setSelectedTourist(t);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 0 4rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <div style={{ backgroundColor: '#fef2f2', padding: '0.4rem', borderRadius: '8px', color: '#dc2626' }}>
              <Bell size={22} />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              Authority Emergency & Risk Alert Feed
            </h1>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Live triage inbox for active SOS distress beacons, hazard zone entries, and severe route deviation alerts.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '0.75rem 1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('ALL')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: activeTab === 'ALL' ? '#1d4ed8' : '#475569',
                backgroundColor: activeTab === 'ALL' ? '#eff6ff' : '#f1f5f9',
                border: activeTab === 'ALL' ? '1px solid #bfdbfe' : '1px solid transparent'
              }}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab('SOS')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: activeTab === 'SOS' ? '#dc2626' : '#475569',
                backgroundColor: activeTab === 'SOS' ? '#fef2f2' : '#f1f5f9',
                border: activeTab === 'SOS' ? '1px solid #fecaca' : '1px solid transparent'
              }}
            >
              🚨 Priority SOS ({alerts.filter(a => a.type === 'SOS').length})
            </button>
            <button
              onClick={() => setActiveTab('PENDING')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: activeTab === 'PENDING' ? '#ea580c' : '#475569',
                backgroundColor: activeTab === 'PENDING' ? '#fff7ed' : '#f1f5f9',
                border: activeTab === 'PENDING' ? '1px solid #fed7aa' : '1px solid transparent'
              }}
            >
              ⚠️ Unresolved Triage ({alerts.filter(a => a.status !== 'RESOLVED').length})
            </button>
          </div>
        </div>

        {/* Alert Cards Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAlerts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
              <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                All Clear — Zero Active Emergency Alerts
              </h3>
              <p style={{ fontSize: '0.85rem' }}>
                No hazard triggers or distress beacons match the selected filter.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSOS = alert.type === 'SOS';
              const isCritical = alert.severity === 'CRITICAL';
              const isHigh = alert.severity === 'HIGH';
              const isResolved = alert.status === 'RESOLVED';

              let borderColor = '#e2e8f0';
              let badgeColor = 'badge-caution';

              if (isSOS || isCritical) {
                borderColor = '#fca5a5';
                badgeColor = 'badge-critical';
              } else if (isHigh) {
                borderColor = '#fdba74';
                badgeColor = 'badge-high';
              }

              return (
                <div
                  key={alert.id}
                  className="card"
                  style={{
                    border: isResolved ? '1px solid #e2e8f0' : `2px solid ${borderColor}`,
                    backgroundColor: isResolved ? '#f8fafc' : (isSOS ? '#fff5f5' : '#ffffff'),
                    padding: '1.25rem',
                    boxShadow: isSOS && !isResolved ? '0 8px 20px rgba(239,68,68,0.12)' : 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{isSOS ? '🚨' : (isCritical ? '🔴' : '⚠️')}</span>
                      <div>
                        <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{alert.title}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                          <span>Tourist: <strong>{alert.touristName}</strong> ({alert.touristId})</span>
                          <span>•</span>
                          <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${badgeColor}`} style={{ fontSize: '0.72rem' }}>
                        {alert.severity}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: isResolved ? '#ecfdf5' : '#fff7ed',
                        color: isResolved ? '#059669' : '#c2410c',
                        border: isResolved ? '1px solid #a7f3d0' : '1px solid #fed7aa'
                      }}>
                        {alert.status}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.5', margin: '0.4rem 0 0.85rem' }}>
                    {alert.message}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="#2563eb" />
                    <span>GPS Lock: {alert.location}</span>
                  </div>

                  {/* Action Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {alert.acknowledgedBy ? (
                        <span>✓ Acknowledged by <strong>{alert.acknowledgedBy}</strong></span>
                      ) : (
                        <span style={{ color: '#dc2626', fontWeight: 'bold' }}>● Pending Command Acknowledgment</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleInspectTourist(alert.touristId)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                      >
                        <Eye size={13} />
                        <span>Inspect Tourist</span>
                      </button>

                      {!isResolved && (
                        <>
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="btn btn-primary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                          >
                            <span>Acknowledge</span>
                          </button>

                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="btn btn-success"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                          >
                            <CheckCircle2 size={13} />
                            <span>Resolve</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
