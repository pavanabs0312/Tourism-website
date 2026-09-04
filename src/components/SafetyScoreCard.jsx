import React, { useState } from 'react';
import { Shield, Info, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';

export const SafetyScoreCard = ({
  score = 94,
  breakdown = {
    routeSafety: 96,
    transportSafety: 93,
    emergencyAccess: 98,
    timeOfTravel: 92,
    weather: 91
  },
  reasoning = 'High safety score because the route uses monitored transit corridors, maintains direct emergency access, and avoids isolated late-night walking segments.'
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const getScoreColor = (val) => {
    if (val >= 90) return '#10b981'; // Green
    if (val >= 75) return '#2563eb'; // Blue
    if (val >= 60) return '#f59e0b'; // Amber
    return '#dc2626'; // Red
  };

  const getLevelLabel = (val) => {
    if (val >= 90) return 'EXCELLENT & SAFE';
    if (val >= 75) return 'MONITORED TRANSIT';
    if (val >= 60) return 'CAUTION ADVISED';
    return 'HIGH RISK';
  };

  const items = [
    { label: 'Route Safety', score: breakdown.routeSafety || 96, desc: 'Verified highway/railway corridor safety' },
    { label: 'Transport Safety', score: breakdown.transportSafety || 93, desc: 'Scheduled public transit safety index' },
    { label: 'Emergency Access', score: breakdown.emergencyAccess || 98, desc: 'Proximity to hospitals & police stations' },
    { label: 'Time of Travel', score: breakdown.timeOfTravel || 92, desc: 'Daylight visibility & corridor activity' },
    { label: 'Weather Index', score: breakdown.weather || 91, desc: 'Normal meteorological transit status' }
  ];

  return (
    <div className="card" style={{ padding: '1.25rem', border: '1px solid #e2e8f0', background: '#ffffff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ backgroundColor: '#ecfdf5', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                🛡️ Journey Safety Score
              </h3>
              <span style={{ fontSize: '0.65rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>
                Simulated Demo Data
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Multi-factor algorithmic safety index
            </div>
          </div>
        </div>

        {/* Big Score Display */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '900', color: getScoreColor(score), lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>/100</span>
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: '800', color: getScoreColor(score), textTransform: 'uppercase' }}>
            {getLevelLabel(score)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.2rem' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${Math.min(100, Math.max(10, score))}%`, 
            backgroundColor: getScoreColor(score), 
            borderRadius: '9999px',
            transition: 'width 0.6s ease'
          }} 
        />
      </div>

      {/* Sub-Score Indicators Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
        {items.map((item, idx) => (
          <div 
            key={idx} 
            style={{ 
              backgroundColor: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              padding: '0.6rem', 
              textAlign: 'center' 
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '600', marginBottom: '0.2rem' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: getScoreColor(item.score) }}>
              {item.score}
            </div>
            <div style={{ height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px', marginTop: '0.35rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${item.score}%`, backgroundColor: getScoreColor(item.score) }} />
            </div>
          </div>
        ))}
      </div>

      {/* Why is this score X button & expandable explanation */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
        <button
          type="button"
          onClick={() => setShowExplanation(!showExplanation)}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontWeight: '700',
            fontSize: '0.78rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <Info size={15} />
          <span>Why is this score {score}?</span>
          {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showExplanation && (
          <div 
            style={{ 
              marginTop: '0.6rem', 
              backgroundColor: '#eff6ff', 
              border: '1px solid #bfdbfe', 
              borderRadius: '8px', 
              padding: '0.75rem', 
              fontSize: '0.78rem', 
              color: '#1e3a8a', 
              lineHeight: 1.5 
            }}
          >
            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>AI Safety Audit Breakdown:</strong>
            <p style={{ margin: 0 }}>{reasoning}</p>
          </div>
        )}
      </div>
    </div>
  );
};
