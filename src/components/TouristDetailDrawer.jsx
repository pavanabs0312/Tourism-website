import React from 'react';
import { 
  X, Shield, Phone, AlertTriangle, MapPin, Navigation, 
  Activity, CheckCircle2, User, Clock, Radio, Compass, Users, Smartphone, Map, Flag, CheckSquare 
} from 'lucide-react';
import { getRiskLevelColor } from '../services/riskEngine';
import { useAuthority } from '../context/AuthorityContext';
import { calculateDistanceInMeters, formatDistance } from '../services/locationService';
import { POPULAR_DESTINATIONS } from '../data/mockData';

export const TouristDetailDrawer = ({ tourist, onClose, onCenterMap }) => {
  const { updateEmergencyStatus } = useAuthority();

  if (!tourist) return null;

  const colorMeta = getRiskLevelColor(tourist.safetyStatus || tourist.riskLevel);
  const isSOS = tourist.sosActive || tourist.sosStatus === 'ACTIVE';

  const handleUpdateStatus = (newStatus) => {
    updateEmergencyStatus(tourist.touristId, newStatus, `Updated by Officer`, 'Mysuru Police Unit #04');
  };

  const groupMembers = tourist.groupMembers || [
    { name: `${tourist.name} (Lead)`, mobile: tourist.mobile, status: 'GPS Active', isLead: true }
  ];

  // Planned destinations for this tourist (use assigned or fallback to circuit stops)
  const destinations = tourist.destinations || [
    { name: 'Mysore Palace (Amba Vilas)', category: 'Heritage Palace', latitude: 12.3052, longitude: 76.6552, location: 'Sayyaji Rao Rd' },
    { name: 'Chamundi Hills Temple', category: 'Scenic Hilltop', latitude: 12.2753, longitude: 76.6705, location: 'Chamundi Hill Rd' },
    { name: 'KRS Brindavan Gardens', category: 'Botanical Park', latitude: 12.4244, longitude: 76.5742, location: 'Mandya/Mysuru' }
  ];

  // Calculate 1st destination arrival status
  const firstDest = destinations[0];
  const distToFirstMeters = firstDest && tourist.latitude && tourist.longitude
    ? calculateDistanceInMeters(tourist.latitude, tourist.longitude, firstDest.latitude, firstDest.longitude)
    : 1200;

  // Threshold: <= 250m considered Reached / On-Site
  const hasReachedFirst = distToFirstMeters <= 250;
  const etaMinsFirst = Math.max(2, Math.round((distToFirstMeters / 1000) / 35 * 60));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      maxWidth: '480px',
      height: '100vh',
      backgroundColor: '#ffffff',
      boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.15)',
      zIndex: 9000,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        backgroundColor: '#0a1128',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <User size={20} color="#38bdf8" />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.2 }}>
              {tourist.name}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              {tourist.touristTag || tourist.touristId} • {tourist.selectedTransportLabel || tourist.selectedTransport || 'Multi-Modal Journey'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ color: '#94a3b8', padding: '0.25rem', borderRadius: '4px', border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* SOS Alert Banner */}
      {isSOS && (
        <div style={{
          backgroundColor: '#ef4444',
          color: '#ffffff',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem', animation: 'pulse 1s infinite' }}>🚨</span>
            <div>
              <strong style={{ fontSize: '0.9rem' }}>CRITICAL EMERGENCY SOS ACTIVE</strong>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                Status: {tourist.sosEvent?.status || 'SOS RECEIVED'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Safety & Risk Status Banner */}
        <div style={{
          backgroundColor: colorMeta.bg,
          border: `1px solid ${colorMeta.border}`,
          borderRadius: '10px',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>SAFETY STATUS</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: colorMeta.text }}>
              {tourist.safetyStatus || tourist.riskLevel || 'SAFE'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>RISK SCORE</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: colorMeta.text }}>
              {tourist.riskScore || 0} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#64748b' }}>/ 100</span>
            </div>
          </div>
        </div>

        {/* 1ST DESTINATION ARRIVAL & TRIP PROGRESS CARD */}
        <div className="card" style={{ padding: '1rem', borderLeft: hasReachedFirst ? '4px solid #10b981' : '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Flag size={16} color={hasReachedFirst ? '#10b981' : '#2563eb'} />
              <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                1st Destination Arrival Status
              </strong>
            </div>

            <span
              style={{
                backgroundColor: hasReachedFirst ? '#ecfdf5' : '#eff6ff',
                color: hasReachedFirst ? '#059669' : '#1d4ed8',
                border: hasReachedFirst ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '800'
              }}
            >
              {hasReachedFirst ? '✅ REACHED 1ST STOP' : '🚗 EN ROUTE'}
            </span>
          </div>

          {/* 1st Destination Metrics */}
          <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.88rem' }}>
              1st Destination: {firstDest?.name || 'Mysore Palace'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
              {hasReachedFirst ? (
                <span style={{ color: '#059669', fontWeight: '700' }}>
                  ✓ Tourist has arrived on-site ({formatDistance(distToFirstMeters)} from center). Sightseeing active.
                </span>
              ) : (
                <span style={{ color: '#2563eb', fontWeight: '700' }}>
                  ⏳ Currently travelling: {formatDistance(distToFirstMeters)} remaining (~{etaMinsFirst} mins ETA).
                </span>
              )}
            </div>
          </div>

          {/* Sequential Planned Destinations Checklist */}
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
            Planned Destinations Itinerary ({destinations.length} Stops):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {destinations.map((dest, idx) => {
              const dMeters = tourist.latitude && tourist.longitude
                ? calculateDistanceInMeters(tourist.latitude, tourist.longitude, dest.latitude, dest.longitude)
                : (idx + 1) * 1200;
              const isReached = dMeters <= 250;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: isReached ? '#f0fdf4' : '#ffffff',
                    border: isReached ? '1px solid #86efac' : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: '800', color: isReached ? '#16a34a' : '#2563eb', minWidth: '18px' }}>
                      #{idx + 1}
                    </span>
                    <div>
                      <strong style={{ color: '#0f172a' }}>{dest.name}</strong>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                        {formatDistance(dMeters)} from live GPS
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      color: isReached ? '#16a34a' : (idx === 0 ? '#2563eb' : '#64748b')
                    }}
                  >
                    {isReached ? '✅ Reached' : (idx === 0 ? '🚗 En Route' : '⏳ Upcoming')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live GPS Telemetry */}
        <div className="card" style={{ padding: '1rem' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} color="#2563eb" />
            <span>Live GPS Telemetry</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: '#64748b' }}>Latitude:</span>
              <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>{tourist.latitude?.toFixed(5)}</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Longitude:</span>
              <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>{tourist.longitude?.toFixed(5)}</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>GPS Accuracy:</span>
              <div style={{ fontWeight: '600', color: tourist.gpsAccuracy <= 30 ? '#10b981' : (tourist.gpsAccuracy <= 100 ? '#0284c7' : '#f59e0b') }}>
                ±{tourist.gpsAccuracy || 10}m ({tourist.gpsAccuracy <= 30 ? 'High' : (tourist.gpsAccuracy <= 100 ? 'Good' : 'Low Confidence')})
              </div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Movement:</span>
              <div style={{ fontWeight: '600' }}>{tourist.movementStatus || 'Moving'}</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Speed:</span>
              <div style={{ fontWeight: '600' }}>{tourist.speed || 0} km/h</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Last Updated:</span>
              <div style={{ fontWeight: '600' }}>
                {tourist.lastUpdated ? new Date(tourist.lastUpdated).toLocaleTimeString() : 'Just now'}
              </div>
            </div>
          </div>

          {onCenterMap && (
            <button
              onClick={() => onCenterMap([tourist.latitude, tourist.longitude])}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.4rem' }}
            >
              <Compass size={14} />
              <span>Center on Map</span>
            </button>
          )}
        </div>

        {/* Group Members & Fallback Tracking Numbers */}
        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid #10b981' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={16} color="#10b981" />
            <span>Travelling Party Members ({groupMembers.length})</span>
          </h4>

          <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.5rem' }}>
            🛡️ Fallback tracking contact numbers if lead traveler's GPS is weak:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {groupMembers.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Smartphone size={12} color="#2563eb" />
                  <strong>{m.name}</strong>
                  <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                    ({m.mobile})
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: m.isLead ? '#10b981' : '#0284c7', fontWeight: '700' }}>
                  {m.isLead ? 'Lead' : 'Anchor'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spatial & Route Risk Indicators */}
        <div className="card" style={{ padding: '1rem' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Navigation size={16} color="#8b5cf6" />
            <span>Spatial & Hazard Indicators</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#64748b' }}>Active Trip:</span>
              <span style={{ fontWeight: '600' }}>{tourist.activeTrip || 'Karnataka Heritage'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#64748b' }}>Route Deviation:</span>
              <span style={{ fontWeight: '600', color: tourist.routeDeviation?.includes('None') ? '#10b981' : '#ea580c' }}>
                {tourist.routeDeviation || 'None'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Nearest Hazard:</span>
              <span style={{ fontWeight: '600', textAlign: 'right', maxWidth: '200px' }}>
                {tourist.dangerZoneDistance || 'Safe (>1.5 km)'}
              </span>
            </div>
          </div>
        </div>

        {/* AI Explainable Risk Factors */}
        <div className="card" style={{ padding: '1rem', backgroundColor: '#f8fafc' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={16} color="#3b82f6" />
            <span>AI Risk Intelligence Factors</span>
          </h4>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {tourist.aiRiskFactors && tourist.aiRiskFactors.length > 0 ? (
              tourist.aiRiskFactors.map((factor, idx) => (
                <li key={idx} style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                  • {factor}
                </li>
              ))
            ) : (
              <li style={{ fontSize: '0.78rem', color: '#64748b' }}>No adverse safety indicators detected.</li>
            )}
          </ul>
        </div>

        {/* Emergency Contact */}
        <div className="card" style={{ padding: '1rem' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={16} color="#10b981" />
            <span>Emergency Contact</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: '#64748b' }}>Mobile:</span>
              <div style={{ fontWeight: '600' }}>{tourist.mobile}</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Emergency Contact:</span>
              <div style={{ fontWeight: '600' }}>
                {tourist.emergencyContact} ({tourist.emergencyContactNumber})
              </div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Preferred Language:</span>
              <div style={{ fontWeight: '600' }}>{tourist.preferredLanguage || 'English'}</div>
            </div>
          </div>
        </div>

        {/* Authority Emergency Dispatch Controls */}
        {isSOS && (
          <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#9f1239', marginBottom: '0.75rem' }}>
              Authority Dispatch Protocol
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => handleUpdateStatus('RESPONSE_INITIATED')}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.45rem' }}
              >
                1. Acknowledge & Initiate Response
              </button>

              <button
                onClick={() => handleUpdateStatus('HELP_DISPATCHED')}
                className="btn"
                style={{ backgroundColor: '#f97316', color: '#ffffff', fontSize: '0.8rem', padding: '0.45rem' }}
              >
                2. Dispatch PCR Police / Medical Van
              </button>

              <button
                onClick={() => handleUpdateStatus('RESOLVED')}
                className="btn btn-success"
                style={{ fontSize: '0.8rem', padding: '0.45rem' }}
              >
                3. Mark Emergency Resolved
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
