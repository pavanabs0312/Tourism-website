import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTourist } from '../context/TouristContext';
import { useAuth } from '../context/AuthContext';
import { 
  Layers, MapPin, Calendar, Clock, ArrowRight, 
  Shield, CheckCircle2, Navigation, Route, Sparkles, 
  ArrowUp, ArrowDown, Trash2, Plus, Check, Info
} from 'lucide-react';

export const TransportPage = () => {
  const { activeTrip, setActiveTrip, tripStops } = useTourist();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const transportOptions = [
    { 
      id: 'car', 
      label: 'Own Car', 
      icon: '🚗',
      sublabel: 'Self-Drive Highway & City Road Routing', 
      speed: '~50-80 km/h'
    },
    { 
      id: 'train', 
      label: 'Train', 
      icon: '🚆',
      sublabel: 'Express & Rail Transit Corridor', 
      speed: '~90-130 km/h'
    },
    { 
      id: 'flight', 
      label: 'Airplane', 
      icon: '✈️',
      sublabel: 'Domestic Airline Flight Corridor', 
      speed: '~550-700 km/h'
    },
    { 
      id: 'bus', 
      label: 'Bus', 
      icon: '🚌',
      sublabel: 'Public / Tourist Coach Transit', 
      speed: '~40-60 km/h'
    },
    { 
      id: 'taxi', 
      label: 'Taxi / Cab', 
      icon: '🚕',
      sublabel: 'Verified Tourist Cab Fleet with Driver OTP', 
      speed: '~45-70 km/h'
    },
    { 
      id: 'walking', 
      label: 'Walking', 
      icon: '🚶',
      sublabel: 'Pedestrian Walking & Heritage Trail', 
      speed: '~4-5 km/h'
    }
  ];

  const createEmptySegment = (modeId, customId = null) => {
    const opt = transportOptions.find(t => t.id === modeId) || transportOptions[0];
    return {
      id: customId || `seg-${modeId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      mode: modeId,
      modeLabel: `${opt.icon} ${opt.label}`,
      icon: opt.icon,
      fromLocation: '',
      toLocation: ''
    };
  };

  const [fromLocation, setFromLocation] = useState(
    activeTrip?.journeyOrigin || currentUser?.journeyOrigin || 'Bengaluru City Center'
  );
  const [toLocation, setToLocation] = useState(
    activeTrip?.journeyDestination || currentUser?.journeyDestination || (tripStops[0]?.name || 'Mysuru Palace')
  );

  const [journeySegments, setJourneySegments] = useState(() => {
    if (activeTrip?.journeySegments && activeTrip.journeySegments.length > 0) {
      return activeTrip.journeySegments;
    }
    if (currentUser?.journeySegments && currentUser.journeySegments.length > 0) {
      return currentUser.journeySegments;
    }
    return [
      createEmptySegment('car')
    ];
  });

  const selectedModeIds = Array.from(new Set(journeySegments.map(s => s.mode)));

  // Keep activeTrip in sync
  useEffect(() => {
    const modesList = Array.from(new Set(journeySegments.map(s => s.mode)));
    const journeySummary = journeySegments.map(s => s.modeLabel).join(' ➔ ');

    const finalMode = journeySegments[journeySegments.length - 1]?.mode || modesList[modesList.length - 1] || 'walking';

    setActiveTrip(prev => ({
      ...prev,
      journeyOrigin: fromLocation,
      journeyDestination: toLocation,
      journeySegments,
      selectedTransportModes: modesList,
      selectedTransport: finalMode,
      selectedTransportLabel: journeySummary || 'Multi-Modal Journey'
    }));
  }, [journeySegments, fromLocation, toLocation]);

  const handleToggleModeCheckbox = (modeId) => {
    const isCurrentlySelected = selectedModeIds.includes(modeId);

    if (isCurrentlySelected) {
      if (journeySegments.length > 1) {
        const remaining = journeySegments.filter(s => s.mode !== modeId);
        if (remaining.length > 0) {
          setJourneySegments(remaining);
        }
      }
    } else {
      const newSeg = createEmptySegment(modeId);
      setJourneySegments(prev => [...prev, newSeg]);
    }
  };

  const handleAddSegment = (modeId) => {
    const newSeg = createEmptySegment(modeId);
    setJourneySegments(prev => [...prev, newSeg]);
  };

  const handleRemoveSegment = (segId) => {
    if (journeySegments.length <= 1) return;
    setJourneySegments(prev => prev.filter(s => s.id !== segId));
  };

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    setJourneySegments(prev => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleMoveDown = (index) => {
    if (index >= journeySegments.length - 1) return;
    setJourneySegments(prev => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleProceedToNavigation = () => {
    navigate('/navigation');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 0 4rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '0.4rem', borderRadius: '8px', color: '#2563eb' }}>
                <Route size={22} />
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
                Multi-Modal Journey Planning
              </h1>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              All selected transport modes are combined into one unified, logically connected travel plan from origin to destination.
            </p>
          </div>

          <button
            onClick={handleProceedToNavigation}
            className="btn btn-primary"
            style={{ fontSize: '0.88rem' }}
          >
            <Navigation size={16} />
            <span>Proceed to Navigation</span>
          </button>
        </div>

        {/* Origin and Destination Anchors */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="#2563eb" />
                <span>Starting Location (Origin)</span>
              </label>
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="#10b981" />
                <span>Final Destination</span>
              </label>
              <input
                type="text"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        {/* 1. Multi-Select Transport Mode Checkboxes */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={18} color="#2563eb" />
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                Transport Modes (Multi-Select Available)
              </strong>
            </div>
            <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
              {journeySegments.length} Segments Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
            {transportOptions.map(opt => {
              const isChecked = selectedModeIds.includes(opt.id);

              return (
                <div
                  key={opt.id}
                  onClick={() => handleToggleModeCheckbox(opt.id)}
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    border: isChecked ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: isChecked ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isChecked ? '0 1px 4px rgba(37,99,235,0.12)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: isChecked ? '#1d4ed8' : '#0f172a', display: 'block' }}>
                        {opt.label}
                      </strong>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                        {opt.speed}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: isChecked ? '#2563eb' : '#ffffff',
                    border: isChecked ? 'none' : '1px solid #94a3b8',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isChecked && <Check size={14} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Connected Journey Pipeline Flow Diagram */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Sparkles size={16} color="#2563eb" />
            <strong style={{ fontSize: '0.9rem', color: '#1e40af' }}>
              Connected Journey Flow (START ➔ ALL MODES ➔ FINAL DESTINATION)
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem', padding: '0.5rem 0' }}>
            {/* Origin Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', color: '#1e40af' }}>
              <MapPin size={13} color="#2563eb" />
              <span>START: {fromLocation}</span>
            </div>

            {/* Segments and Transition Points */}
            {journeySegments.map((seg, idx) => (
              <React.Fragment key={seg.id}>
                <ArrowRight size={15} color="#94a3b8" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ffffff', border: '2px solid #2563eb', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', boxShadow: '0 1px 3px rgba(37,99,235,0.1)' }}>
                  <span>{seg.icon}</span>
                  <span>Leg {idx + 1}: {seg.modeLabel.replace(/^[^\s]+\s*/, '')}</span>
                </div>
              </React.Fragment>
            ))}

            {/* Destination Pill */}
            <ArrowRight size={15} color="#94a3b8" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', color: '#065f46' }}>
              <CheckCircle2 size={13} color="#10b981" />
              <span>DESTINATION: {toLocation}</span>
            </div>
          </div>
        </div>

        {/* Automated AI Journey Note */}
        <div className="card" style={{ padding: '1.25rem', border: '1.5px solid #86efac', backgroundColor: '#f0fdf4', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '0.95rem', color: '#166534', display: 'block', marginBottom: '0.2rem' }}>
              Automated AI Multi-Modal Schedule & Safety Tracking Active
            </strong>
            <span style={{ fontSize: '0.8rem', color: '#15803d', lineHeight: 1.4, display: 'block' }}>
              Manual segment entry has been completely deleted. All selected transport modes are automatically scheduled, corridor-verified, and live-monitored by the AI Tourism Guardian.
            </span>
          </div>
        </div>

        {/* Add Leg Dynamically */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1rem', border: '1px dashed #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#475569' }}>
            Need to add more legs to this journey? (e.g. <strong>Taxi ➔ Airplane ➔ Taxi</strong>)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e40af' }}>+ Add Leg:</span>
            {transportOptions.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleAddSegment(opt.id)}
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Save & Proceed */}
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleProceedToNavigation}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
          >
            <span>Proceed to Navigation</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
