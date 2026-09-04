import React from 'react';
import { useTourist } from '../context/TouristContext';
import { RiskCard } from '../components/RiskCard';
import { 
  Shield, Activity, AlertTriangle, Clock, Navigation, 
  MapPin, CheckCircle2, Radio, Info, Eye 
} from 'lucide-react';
import { getRiskLevelColor } from '../services/riskEngine';

export const SafetyEnginePage = () => {
  const { 
    riskAssessment, 
    telemetry, 
    dangerZones, 
    simulateMoveToHazard, 
    simulateSafeReturn 
  } = useTourist();

  const colorMeta = getRiskLevelColor(riskAssessment.level);

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 0 4rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.4rem', borderRadius: '8px', color: '#2563eb' }}>
              <Shield size={22} />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              Predictive Tourist Safety Engine
            </h1>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Explainable AI risk scoring fusing continuous GNSS telemetry, geo-fenced hazard buffers, and temporal indicators.
          </p>
        </div>

        {/* 2-Column Grid: Left In-Depth Risk Card & Right Mathematical Weighting Formula */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Left Column: Live Risk Card with interactive test triggers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <RiskCard
              score={riskAssessment.score}
              level={riskAssessment.level}
              subScores={riskAssessment.subScores}
              reasons={riskAssessment.reasons}
              nearestDangerZone={riskAssessment.nearestDangerZone}
              dangerZoneDistanceMeters={riskAssessment.dangerZoneDistanceMeters}
              onSimulateHazard={simulateMoveToHazard}
              onSimulateSafe={simulateSafeReturn}
            />

            {/* Configured Geo-Fence Danger Zones List */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={18} color="#f59e0b" />
                <span>Active Geo-Fence Hazard Buffers ({dangerZones.length})</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dangerZones.map((zone) => {
                  const isCritical = zone.severity === 'CRITICAL';
                  const isHigh = zone.severity === 'HIGH';
                  const zoneColor = isCritical ? '#ef4444' : (isHigh ? '#f97316' : '#f59e0b');

                  return (
                    <div
                      key={zone.id}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        borderLeft: `4px solid ${zoneColor}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{zone.name}</strong>
                        <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: zoneColor, textTransform: 'uppercase' }}>
                          {zone.severity} ({zone.radius}m Radius)
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                        {zone.reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Explainability Model & Verification Rules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Info size={18} color="#2563eb" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                  Risk Architecture & Mathematical Formulation
                </h3>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                The predictive engine avoids opaque "black-box" outputs. Instead, it evaluates continuous physical indicators through calibrated spatial formulas:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                    1. Spatial Danger-Zone Incursion (0–45 pts)
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Computes spherical Haversine distance <code style={{ color: '#2563eb' }}>d(x, y)</code> to all active danger centroids. Triggered if <code style={{ color: '#2563eb' }}>d &le; radius + 300m</code>.
                  </span>
                </div>

                <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                    2. Time-of-Day Visibility Multiplier (0–18 pts)
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Elevates risk index during late night corridors (23:00 to 04:00) when public transit and rapid emergency triage density decrease.
                  </span>
                </div>

                <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                    3. Cross-Track Route Deviation (0–22 pts)
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Calculates perpendicular offset distance from planned OSRM route polyline. Triggers warnings at &gt;100m and &gt;300m drifts.
                  </span>
                </div>

                <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                    4. Movement & Stillness Dynamics (0–15 pts)
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Detects prolonged stationary inactivity (&gt;25 mins) inside caution zones without false-flagging normal tourist museum stops.
                  </span>
                </div>

                <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                    5. SOS Panic Beacon (Immediate 100/100 Override)
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Sets critical priority 1 override, bypassing heuristic weights to guarantee immediate command center dispatch.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
