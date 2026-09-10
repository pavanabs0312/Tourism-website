import React, { useState, useEffect } from 'react';
import { useAuthority } from '../context/AuthorityContext';
import { useAuth } from '../context/AuthContext';
import { MapView } from '../components/MapView';
import { TouristDetailDrawer } from '../components/TouristDetailDrawer';
import { DemoScenarioModal } from '../components/DemoScenarioModal';
import { 
  Radio, Shield, AlertTriangle, PhoneCall, Users, CheckCircle2, 
  Search, Eye, Filter, RefreshCw, Layers, Compass, ArrowUpRight, Crosshair 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AuthorityCommandCenter = () => {
  const { isAuthority, loginAsAuthority } = useAuth();
  const { 
    tourists, 
    dangerZones, 
    alerts, 
    kpiStats, 
    selectedTourist, 
    setSelectedTourist, 
    loadDemoScenario 
  } = useAuthority();
  const navigate = useNavigate();

  // Ensure authority session is active on direct route access or refresh
  useEffect(() => {
    if (!isAuthority) {
      loginAsAuthority();
    }
  }, [isAuthority]);

  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState([12.3052, 76.6552]);
  const [mapZoom, setMapZoom] = useState(13);

  // Sort tourists for the Priority Triage Feed: 1. SOS -> 2. Critical -> 3. High -> 4. Caution -> 5. Safe
  const triageTourists = [...tourists].sort((a, b) => {
    const isSOS_A = a.sosActive || a.sosStatus === 'ACTIVE';
    const isSOS_B = b.sosStatus === 'ACTIVE' || b.sosActive;
    if (isSOS_A && !isSOS_B) return -1;
    if (!isSOS_A && isSOS_B) return 1;

    const rankLevel = (t) => {
      const level = (t.safetyStatus || t.riskLevel || 'SAFE').toUpperCase();
      if (level === 'CRITICAL') return 4;
      if (level === 'HIGH' || level === 'HIGH RISK') return 3;
      if (level === 'CAUTION') return 2;
      return 1;
    };

    const rankDiff = rankLevel(b) - rankLevel(a);
    if (rankDiff !== 0) return rankDiff;
    return (b.riskScore || 0) - (a.riskScore || 0);
  });

  const handleTrackMap = (t) => {
    if (t.latitude && t.longitude) {
      setMapCenter([t.latitude, t.longitude]);
      setMapZoom(16);
      setSelectedTourist(t);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem 0 3.5rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <div style={{ backgroundColor: '#fef2f2', padding: '0.4rem', borderRadius: '8px', color: '#dc2626' }}>
                <Radio size={22} />
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
                Authority Command Center
              </h1>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Real-time tourist safety monitoring, geo-spatial hazard tracking, and predictive risk intelligence.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setDemoModalOpen(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <Compass size={15} />
              <span>Simulate SIH Scenarios</span>
            </button>

            <Link
              to="/authority/alerts"
              className="btn"
              style={{
                backgroundColor: kpiStats.activeSOS > 0 ? '#dc2626' : '#0f172a',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            >
              <PhoneCall size={15} />
              <span>Alert Queue ({kpiStats.activeSOS})</span>
            </Link>
          </div>
        </div>

        {/* 6 DYNAMIC STATISTICS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {/* Total */}
          <div className="card" style={{ padding: '1.1rem', borderLeft: '4px solid #2563eb' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.25rem' }}>
              TOTAL TOURISTS
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a' }}>
              {kpiStats.totalTourists}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '600', marginTop: '0.2rem' }}>
              Active in surveillance zone
            </div>
          </div>

          {/* Safe */}
          <div className="card" style={{ padding: '1.1rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.25rem' }}>
              SAFE TOURISTS
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#10b981' }}>
              {kpiStats.safe}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '600', marginTop: '0.2rem' }}>
              Risk Index 0–24
            </div>
          </div>

          {/* Caution */}
          <div className="card" style={{ padding: '1.1rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.25rem' }}>
              CAUTION LEVEL
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#d97706' }}>
              {kpiStats.caution}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: '600', marginTop: '0.2rem' }}>
              Risk Index 25–49
            </div>
          </div>

          {/* High */}
          <div className="card" style={{ padding: '1.1rem', borderLeft: '4px solid #ea580c' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.25rem' }}>
              HIGH RISK
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ea580c' }}>
              {kpiStats.highRisk}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#c2410c', fontWeight: '600', marginTop: '0.2rem' }}>
              Risk Index 50–74
            </div>
          </div>

          {/* Critical */}
          <div className="card" style={{ padding: '1.1rem', borderLeft: '4px solid #dc2626' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.25rem' }}>
              CRITICAL RISK
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#dc2626' }}>
              {kpiStats.critical}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: '600', marginTop: '0.2rem' }}>
              Risk Index 75–100
            </div>
          </div>

          {/* Active SOS */}
          <div className="card" style={{ padding: '1.1rem', borderLeft: '4px solid #dc2626', backgroundColor: kpiStats.activeSOS > 0 ? '#fef2f2' : '#ffffff' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: kpiStats.activeSOS > 0 ? '#991b1b' : '#64748b', marginBottom: '0.25rem' }}>
              ACTIVE SOS BEACONS
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>{kpiStats.activeSOS}</span>
              {kpiStats.activeSOS > 0 && <span style={{ fontSize: '1rem', animation: 'ping 1.2s infinite' }}>🚨</span>}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: '700', marginTop: '0.2rem' }}>
              Immediate Dispatch Lock
            </div>
          </div>
        </div>

        {/* 2-Column Main Command Layout: Left Map & Right Priority Triage Feed */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(360px, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left: Live Geo-Spatial Surveillance Map */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} color="#2563eb" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                  Live Geo-Spatial Surveillance Map
                </h3>
              </div>
              <span className="badge badge-demo">Real-Time Leaflet Engine</span>
            </div>

            <div style={{ height: '540px' }}>
              <MapView
                center={mapCenter}
                zoom={mapZoom}
                tourists={tourists}
                dangerZones={dangerZones}
                highlightTouristId={selectedTourist?.touristId || selectedTourist?.touristTag}
                onTouristClick={(t) => setSelectedTourist(t)}
                height="100%"
              />
            </div>

            {/* Map Legend */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.85rem', fontSize: '0.75rem', color: '#64748b' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span>🟢 Safe</span>
                <span>🟠 Caution</span>
                <span>🔴 High Risk</span>
                <span>🚨 Active SOS</span>
                <span>⭕ Hazard Geo-Fence</span>
              </div>
              <span>Click any tourist pin or <strong>Track Map</strong> to recenter.</span>
            </div>
          </div>

          {/* Right: Priority Tourist Triage Feed */}
          <div className="card" style={{ padding: '1.25rem', maxHeight: '640px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                  Priority Tourist Triage Feed
                </h3>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                  {triageTourists.length} Tracked
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                Sorted automatically by risk severity & emergency distress
              </p>
            </div>

            {/* Scrollable Feed List */}
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px' }}>
              {triageTourists.map((t) => {
                const isSOS = t.sosActive || t.sosStatus === 'ACTIVE';
                const level = (t.safetyStatus || t.riskLevel || 'SAFE').toUpperCase();
                const riskScore = t.riskScore || 0;
                const accuracy = Math.round(t.gpsAccuracy || 12);

                let badgeColor = '#10b981';
                let badgeBg = '#ecfdf5';
                let cardBorder = '#e2e8f0';

                if (isSOS) {
                  badgeColor = '#dc2626';
                  badgeBg = '#fef2f2';
                  cardBorder = '#fecaca';
                } else if (level === 'CRITICAL') {
                  badgeColor = '#dc2626';
                  badgeBg = '#fef2f2';
                  cardBorder = '#fca5a5';
                } else if (level === 'HIGH' || level === 'HIGH RISK') {
                  badgeColor = '#ea580c';
                  badgeBg = '#fff7ed';
                  cardBorder = '#fed7aa';
                } else if (level === 'CAUTION') {
                  badgeColor = '#d97706';
                  badgeBg = '#fffbeb';
                  cardBorder = '#fde68a';
                }

                const primaryReason = (t.aiRiskFactors && t.aiRiskFactors[0]) || t.dangerZoneDistance || 'Optimal daylight baseline';

                return (
                  <div
                    key={t.touristId}
                    style={{
                      backgroundColor: isSOS ? '#fff5f5' : '#ffffff',
                      border: `1px solid ${cardBorder}`,
                      borderRadius: '10px',
                      padding: '0.85rem',
                      boxShadow: isSOS ? '0 2px 8px rgba(220,38,38,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{t.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#2563eb', fontFamily: 'monospace', fontWeight: '700' }}>
                          {t.touristTag || t.touristId}
                        </div>
                      </div>

                      <span
                        style={{
                          backgroundColor: badgeBg,
                          color: badgeColor,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: '800'
                        }}
                      >
                        {isSOS ? '🚨 ACTIVE SOS (100)' : `${level} (${riskScore}/100)`}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace', marginBottom: '0.35rem' }}>
                      📍 {t.latitude?.toFixed(4)}, {t.longitude?.toFixed(4)} • ±{accuracy}m accuracy
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.65rem', lineHeight: '1.35' }}>
                      "{primaryReason}"
                    </p>

                    {/* Action Buttons: [Inspect Tourist] & [Track Map] */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setSelectedTourist(t)}
                        className="btn btn-secondary"
                        style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem' }}
                      >
                        <Eye size={13} />
                        <span>Inspect Tourist</span>
                      </button>

                      <button
                        onClick={() => handleTrackMap(t)}
                        className="btn btn-primary"
                        style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem' }}
                      >
                        <Crosshair size={13} />
                        <span>Track Map</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Tourist Detail Drawer */}
      <TouristDetailDrawer
        tourist={selectedTourist}
        onClose={() => setSelectedTourist(null)}
        onCenterMap={(coords) => {
          if (coords) {
            setMapCenter(coords);
            setMapZoom(16);
          }
        }}
      />

      {/* SIH Hackathon Demo Scenarios Modal */}
      <DemoScenarioModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  );
};
