import React, { useState } from 'react';
import { 
  Navigation, CheckCircle2, Clock, Shield, AlertTriangle, 
  CloudRain, ArrowRight, PhoneCall, RefreshCw, Car, Check
} from 'lucide-react';

export const ActiveJourneyView = ({
  origin = 'Bengaluru City Center',
  destination = 'Mysuru Palace',
  segments = [],
  safetyScore = 94,
  onTriggerSOS = () => {},
  onAcceptAlternativeCab = () => {},
  onBackToPlanner = () => {}
}) => {
  // Alert simulation states for hackathon judging
  const [activeAlert, setActiveAlert] = useState(null); // null | 'WEATHER' | 'DELAY'
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [alternativeAccepted, setAlternativeAccepted] = useState(false);

  // Fallback default segments if none provided
  const activeSegments = segments.length > 0 ? segments : [
    {
      id: 'seg-1',
      mode: 'train',
      modeLabel: 'Train',
      icon: '🚆',
      title: `Express Transit to ${destination}`,
      from: origin,
      to: `${destination} Transit Interchange`,
      departureTime: '09:00',
      arrivalTime: '10:30',
      durationFormatted: '1h 30m',
      status: 'ON_SCHEDULE'
    },
    {
      id: 'seg-2',
      mode: alternativeAccepted ? 'taxi' : 'walking',
      modeLabel: alternativeAccepted ? 'Verified Cab' : 'Walking',
      icon: alternativeAccepted ? '🚕' : '🚶',
      title: alternativeAccepted ? 'Verified Local Cab Transfer' : 'Pedestrian Promenade Walk',
      from: `${destination} Transit Interchange`,
      to: destination,
      departureTime: '10:42',
      arrivalTime: alternativeAccepted ? '10:52' : '11:02',
      durationFormatted: alternativeAccepted ? '10 mins' : '20 mins',
      status: 'UPCOMING'
    }
  ];

  const handleSimulateWeatherAlert = () => {
    setActiveAlert('WEATHER');
  };

  const handleSimulateDelayAlert = () => {
    setActiveAlert('DELAY');
  };

  const handleAcceptCab = () => {
    setAlternativeAccepted(true);
    setActiveAlert(null);
    onAcceptAlternativeCab();
  };

  const currentSeg = activeSegments[activeSegmentIndex] || activeSegments[0];
  const upcomingSeg = activeSegments[activeSegmentIndex + 1];

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Top Banner: JOURNEY ACTIVE */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(37,99,235,0.25)',
          marginBottom: '1.25rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backgroundColor: 'rgba(255,255,255,0.18)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span>JOURNEY ACTIVE • REAL-TIME AI COMPANION</span>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: '0 0 0.25rem' }}>
              {origin} <span style={{ color: '#93c5fd' }}>➔</span> {destination}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#bfdbfe' }}>
              Active Leg: {currentSeg.icon} {currentSeg.title} ({currentSeg.departureTime} ➔ {currentSeg.arrivalTime})
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '0.5rem 0.9rem', borderRadius: '10px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: '#bfdbfe', textTransform: 'uppercase', fontWeight: '700' }}>
                Safety Score
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#4ade80' }}>
                {alternativeAccepted ? 96 : safetyScore}<span style={{ fontSize: '0.78rem', color: '#e0e7ff' }}>/100</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onTriggerSOS}
              className="btn"
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '800',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(220,38,38,0.4)'
              }}
            >
              <PhoneCall size={16} />
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>

        {/* Live Segment Timeline with Progress Marker */}
        <div style={{ marginTop: '1.5rem', backgroundColor: 'rgba(255,255,255,0.12)', padding: '1rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem', color: '#e0e7ff' }}>
            <span>Departure: {currentSeg.departureTime}</span>
            <span style={{ fontWeight: '800', color: '#4ade80' }}>🟢 On Schedule (~45% Completed)</span>
            <span>Arrival: {currentSeg.arrivalTime}</span>
          </div>

          {/* Progress bar with pulsing traveler pin */}
          <div style={{ position: 'relative', height: '10px', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '9999px', margin: '0.6rem 0' }}>
            <div style={{ height: '100%', width: '45%', backgroundColor: '#4ade80', borderRadius: '9999px' }} />
            <div 
              style={{ 
                position: 'absolute', 
                left: '45%', 
                top: '50%', 
                transform: 'translate(-50%, -50%)', 
                width: '18px', 
                height: '18px', 
                borderRadius: '50%', 
                backgroundColor: '#ffffff', 
                border: '3px solid #1e3a8a', 
                boxShadow: '0 0 10px rgba(74,222,128,0.8)' 
              }} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#bfdbfe' }}>
            <span>📍 {currentSeg.from}</span>
            <span>🏁 {currentSeg.to}</span>
          </div>
        </div>

        {/* Upcoming Segment Preview */}
        {upcomingSeg && (
          <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#e0e7ff' }}>
            <span style={{ color: '#93c5fd' }}>Next upcoming segment:</span>
            <strong>{upcomingSeg.icon} {upcomingSeg.title} ({upcomingSeg.durationFormatted})</strong>
          </div>
        )}
      </div>

      {/* Dynamic Simulated Travel Alert Banner (Phase 8) */}
      {activeAlert === 'WEATHER' && (
        <div 
          className="card" 
          style={{ 
            border: '2px solid #3b82f6', 
            backgroundColor: '#eff6ff', 
            padding: '1.25rem', 
            marginBottom: '1.25rem',
            borderRadius: '12px',
            animation: 'pulse 2s infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CloudRain size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.98rem', color: '#1e3a8a' }}>
                  ⚠️ Dynamic Weather Alert (Demo Simulation)
                </strong>
                <span style={{ fontSize: '0.68rem', backgroundColor: '#bfdbfe', color: '#1e40af', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>
                  METEOROLOGICAL AI
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#1e40af', margin: '0 0 0.65rem' }}>
                Heavy rain detected near Mysuru destination corridor.
              </p>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #bfdbfe', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '0.85rem', fontSize: '0.8rem', color: '#0f172a' }}>
                <strong>🤖 AI Recommendation:</strong> Replace the walking segment with a verified tourist cab from Station Gate 2. Reduces exposure and boosts Safety Score to <strong>96/100</strong>.
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleAcceptCab}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#2563eb', fontSize: '0.82rem', fontWeight: '800', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Car size={15} />
                  <span>Accept Alternative (Switch to Cab)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAlert(null)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                >
                  Keep Current Walking Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeAlert === 'DELAY' && (
        <div 
          className="card" 
          style={{ 
            border: '2px solid #f59e0b', 
            backgroundColor: '#fffbeb', 
            padding: '1.25rem', 
            marginBottom: '1.25rem',
            borderRadius: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#fef3c7', color: '#d97706', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.98rem', color: '#92400e' }}>
                  ⚠️ Transit Schedule Advisory (Demo Simulation)
                </strong>
                <span style={{ fontSize: '0.68rem', backgroundColor: '#fde68a', color: '#78350f', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>
                  RAIL TELEMETRY
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#92400e', margin: '0 0 0.65rem' }}>
                Your selected train is delayed by ~25 minutes due to track maintenance near Mandya.
              </p>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #fde68a', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '0.85rem', fontSize: '0.8rem', color: '#0f172a' }}>
                <strong>🤖 AI Suggestion:</strong> Alternative Express Train #12007 is available from Platform 1 at 10:45 with verified on-time status.
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveAlert(null)}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#d97706', borderColor: '#d97706', fontSize: '0.82rem', fontWeight: '800', padding: '0.5rem 1rem' }}
                >
                  Acknowledge & Adjust Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIH Hackathon Simulation Quick Triggers */}
      <div 
        style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #cbd5e1', 
          borderRadius: '12px', 
          padding: '0.85rem 1.15rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '0.65rem' 
        }}
      >
        <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '700' }}>
          🧪 SIH Hackathon Demo Triggers:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleSimulateWeatherAlert}
            className="btn btn-secondary"
            style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <CloudRain size={13} color="#2563eb" />
            <span>Simulate Weather Alert</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateDelayAlert}
            className="btn btn-secondary"
            style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Clock size={13} color="#d97706" />
            <span>Simulate Transit Delay</span>
          </button>

          <button
            type="button"
            onClick={onTriggerSOS}
            className="btn btn-secondary"
            style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#dc2626' }}
          >
            <Shield size={13} color="#dc2626" />
            <span>Test Demo SOS</span>
          </button>

          <button
            type="button"
            onClick={onBackToPlanner}
            className="btn btn-secondary"
            style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
          >
            ← Back to Planner
          </button>
        </div>
      </div>
    </div>
  );
};
