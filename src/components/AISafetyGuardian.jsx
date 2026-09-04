import React from 'react';
import { Shield, CheckCircle, AlertTriangle, CloudRain, Clock, PhoneCall, Radio, ChevronRight } from 'lucide-react';

export const AISafetyGuardian = ({
  safetyScore = 94,
  routeStatus = 'SAFE', // 'SAFE' | 'CAUTION' | 'REROUTED'
  transportStatus = 'ON_TIME', // 'ON_TIME' | 'DELAYED'
  weatherStatus = 'NORMAL', // 'NORMAL' | 'RAIN_ALERT'
  emergencyReady = true,
  onViewDetails = null,
  isCompact = false
}) => {
  const getScoreBadge = (score) => {
    if (score >= 90) return { bg: '#ecfdf5', color: '#059669', label: 'SAFE' };
    if (score >= 75) return { bg: '#eff6ff', color: '#2563eb', label: 'MONITORED' };
    if (score >= 60) return { bg: '#fffbeb', color: '#d97706', label: 'CAUTION' };
    return { bg: '#fef2f2', color: '#dc2626', label: 'RISK' };
  };

  const badge = getScoreBadge(safetyScore);

  if (isCompact) {
    return (
      <div 
        onClick={onViewDetails}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: '#ffffff',
          border: '1.5px solid #3b82f6',
          borderRadius: '9999px',
          padding: '0.35rem 0.9rem',
          boxShadow: '0 2px 8px rgba(37,99,235,0.12)',
          cursor: onViewDetails ? 'pointer' : 'default'
        }}
      >
        <Shield size={16} color="#2563eb" />
        <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>
          AI Guardian
        </span>
        <span style={{ 
          fontSize: '0.72rem', 
          fontWeight: '800', 
          backgroundColor: badge.bg, 
          color: badge.color, 
          padding: '0.15rem 0.45rem', 
          borderRadius: '6px' 
        }}>
          {safetyScore}/100 • {badge.label}
        </span>
      </div>
    );
  }

  return (
    <div 
      className="card"
      style={{
        borderLeft: '4px solid #2563eb',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        padding: '1.25rem',
        boxShadow: '0 4px 14px rgba(15,23,42,0.06)',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ 
            backgroundColor: '#eff6ff', 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#2563eb'
          }}>
            <Shield size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>
                🛡️ AI SAFETY GUARDIAN
              </strong>
              <span style={{ 
                fontSize: '0.65rem', 
                fontWeight: '800', 
                backgroundColor: '#dbeafe', 
                color: '#1d4ed8', 
                padding: '0.1rem 0.45rem', 
                borderRadius: '4px',
                letterSpacing: '0.04em'
              }}>
                ACTIVE
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Continuous real-time safety & route intelligence
            </div>
          </div>
        </div>

        {/* Live Safety Score Pill */}
        <div style={{ 
          textAlign: 'right',
          backgroundColor: badge.bg,
          border: `1px solid ${badge.color}33`,
          padding: '0.35rem 0.75rem',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            Safety Score
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: '900', color: badge.color, lineHeight: 1.1 }}>
            {safetyScore}<span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>/100</span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Live Status Indicators */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '0.65rem',
        marginBottom: '0.85rem'
      }}>
        {/* 1. Route Status */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '0.55rem 0.75rem' 
        }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            backgroundColor: routeStatus === 'SAFE' ? '#10b981' : (routeStatus === 'REROUTED' ? '#3b82f6' : '#f59e0b') 
          }} />
          <div style={{ fontSize: '0.78rem' }}>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Route Corridor</span>
            <strong style={{ color: '#0f172a' }}>
              {routeStatus === 'SAFE' ? '🟢 Route Safe' : (routeStatus === 'REROUTED' ? '🔵 Re-Routed Safe' : '🟡 Caution Advised')}
            </strong>
          </div>
        </div>

        {/* 2. Transport Status */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '0.55rem 0.75rem' 
        }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            backgroundColor: transportStatus === 'ON_TIME' ? '#10b981' : '#f59e0b' 
          }} />
          <div style={{ fontSize: '0.78rem' }}>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Transit Schedule</span>
            <strong style={{ color: '#0f172a' }}>
              {transportStatus === 'ON_TIME' ? '🟢 Transport On Time' : '🟡 25m Delay Alert'}
            </strong>
          </div>
        </div>

        {/* 3. Weather Status */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '0.55rem 0.75rem' 
        }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            backgroundColor: weatherStatus === 'NORMAL' ? '#10b981' : '#3b82f6' 
          }} />
          <div style={{ fontSize: '0.78rem' }}>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Weather Conditions</span>
            <strong style={{ color: '#0f172a' }}>
              {weatherStatus === 'NORMAL' ? '🟢 Weather Normal' : '🌧️ Rain Alert Detected'}
            </strong>
          </div>
        </div>

        {/* 4. Emergency Services */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '0.55rem 0.75rem' 
        }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            backgroundColor: emergencyReady ? '#10b981' : '#dc2626' 
          }} />
          <div style={{ fontSize: '0.78rem' }}>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Emergency Response</span>
            <strong style={{ color: '#0f172a' }}>
              {emergencyReady ? '🟢 Emergency Access Ready' : '🔴 Standby'}
            </strong>
          </div>
        </div>
      </div>

      {/* Footer info banner */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        fontSize: '0.72rem', 
        color: '#475569',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '0.65rem'
      }}>
        <span>📍 Actively monitoring corridor with GPS Geo-Fencing & Overpass GIS telemetry</span>
        {onViewDetails && (
          <button 
            type="button" 
            onClick={onViewDetails}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#2563eb', 
              fontWeight: '700', 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <span>Safety Details</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
