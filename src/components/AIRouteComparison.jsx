import React from 'react';
import { Award, Zap, DollarSign, Clock, ShieldCheck, Check, ArrowRight } from 'lucide-react';

export const AIRouteComparison = ({
  routes = [],
  selectedRouteId = 'recommended',
  onSelectRoute = () => {}
}) => {
  // Default alternatives if not provided
  const defaultRoutes = [
    {
      id: 'recommended',
      tag: '🥇 RECOMMENDED',
      tagColor: '#d97706',
      tagBg: '#fef3c7',
      title: 'Train + Walking Promenade',
      modes: ['🚆 Train', '🚶 Walking'],
      duration: '1h 50m',
      cost: '₹240',
      safetyScore: 94,
      transfers: '1 transfer',
      availability: 'High (Frequent Rail)',
      reasoning: 'Best balance of travel time, cost, and safety score using monitored rail corridors.',
      isRecommended: true
    },
    {
      id: 'fastest',
      tag: '⚡ FASTEST',
      tagColor: '#2563eb',
      tagBg: '#eff6ff',
      title: 'Express Train + Verified Cab',
      modes: ['🚆 Train', '🚕 Cab'],
      duration: '1h 35m',
      cost: '₹480',
      safetyScore: 91,
      transfers: '1 transfer',
      availability: 'Immediate on arrival',
      reasoning: 'Minimizes overall transit duration with door-to-door verified cab transfer.',
      isFastest: true
    },
    {
      id: 'budget',
      tag: '💰 BUDGET',
      tagColor: '#059669',
      tagBg: '#ecfdf5',
      title: 'State Bus + Heritage Walk',
      modes: ['🚌 Bus', '🚶 Walking'],
      duration: '3h 10m',
      cost: '₹120',
      safetyScore: 88,
      transfers: '1 transfer',
      availability: 'Regular Express',
      reasoning: 'Most economical option with verified public state transport.',
      isBudget: true
    }
  ];

  const displayRoutes = routes.length > 0 ? routes : defaultRoutes;

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span>🔄 AI Route Comparison</span>
          </h3>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Transparent algorithmic comparison across Time, Cost, Transfers & Safety
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {displayRoutes.map((route) => {
          const isSelected = selectedRouteId === route.id;

          return (
            <div
              key={route.id}
              className="card"
              style={{
                border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '1.15rem',
                backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                boxShadow: isSelected ? '0 4px 16px rgba(37,99,235,0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {/* Badge */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      backgroundColor: route.tagBg || '#f1f5f9',
                      color: route.tagColor || '#0f172a',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {route.tag}
                  </span>

                  {isSelected && (
                    <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Check size={13} /> Active
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                  {route.title}
                </h4>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  {route.modes?.map((m, i) => (
                    <span key={i} style={{ fontSize: '0.72rem', backgroundColor: '#e2e8f0', color: '#334155', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: '600' }}>
                      {m}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '0.5rem', marginBottom: '0.75rem', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>Travel Time</span>
                    <strong style={{ color: '#0f172a' }}>⏱️ {route.duration}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>Est. Cost</span>
                    <strong style={{ color: '#059669' }}>💵 {route.cost}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>Safety Score</span>
                    <strong style={{ color: '#10b981' }}>🛡️ {route.safetyScore}/100</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>Transfers</span>
                    <strong style={{ color: '#475569' }}>🔄 {route.transfers}</strong>
                  </div>
                </div>

                {/* Why recommended */}
                <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                  <strong style={{ color: '#0f172a' }}>Why: </strong>
                  {route.reasoning}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectRoute(route)}
                className={isSelected ? 'btn btn-success' : 'btn btn-secondary'}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                {isSelected ? (
                  <>
                    <Check size={14} />
                    <span>Selected Plan</span>
                  </>
                ) : (
                  <>
                    <span>Select Route</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
