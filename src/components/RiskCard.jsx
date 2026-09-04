import React from 'react';
import { Shield, AlertTriangle, Clock, Activity, Navigation, Info } from 'lucide-react';
import { getRiskLevelColor } from '../services/riskEngine';

export const RiskCard = ({
  score = 15,
  level = 'SAFE',
  subScores = {},
  reasons = [],
  nearestDangerZone = null,
  dangerZoneDistanceMeters = null,
  onSimulateHazard = null,
  onSimulateSafe = null
}) => {
  const colorMeta = getRiskLevelColor(level);

  // Subscores defaults
  const locationRisk = subScores?.locationRisk || 5;
  const timeRisk = subScores?.timeRisk || 0;
  const movementRisk = subScores?.movementRisk || 0;
  const routeRisk = subScores?.routeRisk || 0;
  const sosRisk = subScores?.sosRisk || 0;

  return (
    <div className="card" style={{ borderLeft: `5px solid ${colorMeta.text}` }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Shield size={20} color={colorMeta.text} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Predictive Safety Risk Score</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Calculated in real-time by AI Tourist Guardian explainable risk engine
          </p>
        </div>

        <div className={`badge ${colorMeta.badgeClass}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
          {level} ({score}/100)
        </div>
      </div>

      {/* Main Score Bar & Gauge */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
          <span>Overall Tourist Risk Index</span>
          <span style={{ color: colorMeta.text, fontWeight: '700' }}>{score} / 100</span>
        </div>

        {/* Progress Track */}
        <div style={{ width: '100%', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
          <div
            style={{
              width: `${Math.min(100, Math.max(5, score))}%`,
              backgroundColor: colorMeta.text,
              borderRadius: '999px',
              transition: 'width 0.4s ease-in-out, background-color 0.4s ease'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>
          <span>0 (Safe)</span>
          <span>25 (Caution)</span>
          <span>50 (High)</span>
          <span>75 (Critical)</span>
          <span>100</span>
        </div>
      </div>

      {/* 5-Factor Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>
            <AlertTriangle size={13} color="#f59e0b" />
            <span>Location / Zone</span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
            {locationRisk} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>pts</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>
            <Clock size={13} color="#3b82f6" />
            <span>Time of Day</span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
            {timeRisk} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>pts</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>
            <Activity size={13} color="#10b981" />
            <span>Movement</span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
            {movementRisk} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>pts</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>
            <Navigation size={13} color="#8b5cf6" />
            <span>Route Deviation</span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
            {routeRisk} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>pts</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '12px' }}>🚨</span>
            <span>SOS Override</span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: sosRisk > 0 ? '#ef4444' : '#0f172a' }}>
            {sosRisk} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>pts</span>
          </div>
        </div>
      </div>

      {/* Explainable AI: "Why this risk level?" */}
      <div style={{ backgroundColor: colorMeta.bg, border: `1px solid ${colorMeta.border}`, borderRadius: '8px', padding: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: colorMeta.text, marginBottom: '0.4rem' }}>
          <Info size={15} />
          <span>Why this risk level?</span>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {reasons && reasons.length > 0 ? (
            reasons.map((reason, idx) => (
              <li key={idx} style={{ fontSize: '0.8rem', color: '#334155', lineHeight: '1.4' }}>
                {reason}
              </li>
            ))
          ) : (
            <li style={{ fontSize: '0.8rem', color: '#334155' }}>
              Standard daylight movement within verified safe zone.
            </li>
          )}
        </ul>
      </div>

      {/* Demo Simulation Steppers for Hackathon Demo */}
      {(onSimulateHazard || onSimulateSafe) && (
        <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
            SIH Interactive Demo Triggers:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onSimulateHazard && (
              <button
                onClick={onSimulateHazard}
                style={{
                  backgroundColor: '#fff7ed',
                  color: '#c2410c',
                  border: '1px solid #fed7aa',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}
              >
                Simulate Entering Hazard Zone
              </button>
            )}
            {onSimulateSafe && (
              <button
                onClick={onSimulateSafe}
                style={{
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}
              >
                Reset to Safe Zone
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
