import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { 
  Shield, User, Phone, Mail, Globe, HeartPulse, ArrowRight, 
  CheckCircle2, Radio, Users, Check, Layers, ArrowUp, ArrowDown, 
  Trash2, Plus, MapPin, Clock, Navigation, AlertCircle, Sparkles, Route
} from 'lucide-react';

export const RegisterPage = () => {
  const { registerTourist, setMode, loginAsAuthority } = useAuth();
  const { setActiveTrip } = useTourist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('TOURIST'); // 'TOURIST' | 'AUTHORITY'
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    travellersCount: '',
    emergencyContact: '',
    emergencyContactNumber: '',
    preferredLanguage: 'English'
  });

  // Overall Journey Origin & Destination Anchors
  const [journeyOrigin, setJourneyOrigin] = useState('');
  const [journeyDestination, setJourneyDestination] = useState('');

  const transportOptions = [
    { 
      id: 'car', 
      label: 'Own Car', 
      icon: '🚗',
      sublabel: 'Self-Drive Highway & City Road Routing', 
      type: 'ROAD',
      speed: '~50-80 km/h',
      flexibility: 'High (Door-to-door)',
      safetyCheck: 'OSRM Route Geometry & Danger Geo-Fences'
    },
    { 
      id: 'train', 
      label: 'Train', 
      icon: '🚆',
      sublabel: 'Express & Rail Transit Corridor', 
      type: 'RAIL',
      speed: '~90-130 km/h',
      flexibility: 'Fixed Railway Schedule',
      safetyCheck: 'Station CCTV & RPF Monitored'
    },
    { 
      id: 'flight', 
      label: 'Airplane', 
      icon: '✈️',
      sublabel: 'Domestic Airline Flight Corridor', 
      type: 'AIR',
      speed: '~550-700 km/h',
      flexibility: 'Airport Flight Schedule',
      safetyCheck: 'CISF Airport Terminal Security'
    },
    { 
      id: 'bus', 
      label: 'Bus', 
      icon: '🚌',
      sublabel: 'Public / Tourist Coach Transit', 
      type: 'ROAD_TRANSIT',
      speed: '~40-60 km/h',
      flexibility: 'Scheduled Route Stops',
      safetyCheck: 'Terminal Safety & GPS Tracking'
    },
    { 
      id: 'taxi', 
      label: 'Taxi / Cab', 
      icon: '🚕',
      sublabel: 'Verified Tourist Cab Fleet with Driver OTP', 
      type: 'ROAD_CAB',
      speed: '~45-70 km/h',
      flexibility: 'High (On-Demand)',
      safetyCheck: 'Police Background-Checked Driver'
    },
    { 
      id: 'walking', 
      label: 'Walking', 
      icon: '🚶',
      sublabel: 'Pedestrian Walking & Heritage Trail', 
      type: 'WALK',
      speed: '~4-5 km/h',
      flexibility: 'Local Promenade',
      safetyCheck: 'Daylight & Well-Lit Footpaths'
    }
  ];

  // Helper to create empty segment
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

  // Dynamic Multi-Modal Journey Segments (All selected modes become part of ONE connected journey)
  const [journeySegments, setJourneySegments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [registeredTag, setRegisteredTag] = useState(null);

  // Set of currently active modes across segments
  const selectedModeIds = Array.from(new Set(journeySegments.map(s => s.mode)));

  // Checkbox toggle handler
  const handleToggleModeCheckbox = (modeId) => {
    const isCurrentlySelected = selectedModeIds.includes(modeId);

    if (isCurrentlySelected) {
      // Unchecking: Remove all segments of this mode (if more than 1 total segment exists)
      if (journeySegments.length > 1) {
        const remaining = journeySegments.filter(s => s.mode !== modeId);
        if (remaining.length > 0) {
          setJourneySegments(remaining);
        }
      }
    } else {
      // Checking: Append a new journey segment of this mode
      const newSeg = createEmptySegment(modeId);
      setJourneySegments(prev => [...prev, newSeg]);
    }
  };

  // Add extra segment dynamically (e.g. adding a 2nd Taxi for Taxi -> Airplane -> Taxi)
  const handleAddSegment = (modeId) => {
    const newSeg = createEmptySegment(modeId);
    setJourneySegments(prev => [...prev, newSeg]);
  };

  // Remove specific segment
  const handleRemoveSegment = (segId) => {
    if (journeySegments.length <= 1) return;
    setJourneySegments(prev => prev.filter(s => s.id !== segId));
  };

  // Reorder: Move Up
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

  // Reorder: Move Down
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const modesList = Array.from(new Set(journeySegments.map(s => s.mode)));
      const journeySummary = journeySegments.map(s => s.modeLabel).join(' ➔ ');
      const finalMode = journeySegments[journeySegments.length - 1]?.mode || modesList[modesList.length - 1] || 'walking';

      const newTourist = await registerTourist({
        ...formData,
        groupSize: parseInt(formData.travellersCount, 10) || 1,
        journeyOrigin,
        journeyDestination,
        journeySegments,
        selectedTransportModes: modesList,
        selectedTransport: finalMode,
        selectedTransportLabel: journeySummary || 'Multi-Modal Journey'
      });

      setActiveTrip(prev => ({
        ...prev,
        journeyOrigin,
        journeyDestination,
        journeySegments,
        selectedTransportModes: modesList,
        selectedTransport: finalMode,
        selectedTransportLabel: journeySummary || 'Multi-Modal Journey'
      }));

      setRegisteredTag(newTourist.touristTag || newTourist.touristId);

      // Route directly to Destination Planning
      setTimeout(() => {
        navigate('/destination-planner');
      }, 1000);
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorityDirect = () => {
    loginAsAuthority();
    setMode('AUTHORITY');
    navigate('/authority');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '840px', width: '100%', padding: '2.25rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
            <Shield size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            AI TOURISM GUARDIAN
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#2563eb', fontWeight: '600' }}>
            “Plan Better. Travel Smarter. Stay Safer.”
          </p>
        </div>

        {/* First Screen — Mode Selection Tab */}
        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '1.75rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('TOURIST')}
            style={{
              flex: 1,
              padding: '0.7rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '800',
              color: activeTab === 'TOURIST' ? '#1d4ed8' : '#64748b',
              backgroundColor: activeTab === 'TOURIST' ? '#ffffff' : 'transparent',
              boxShadow: activeTab === 'TOURIST' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            🧭 TOURIST MODE (Step 1: Registration)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('AUTHORITY')}
            style={{
              flex: 1,
              padding: '0.7rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '800',
              color: activeTab === 'AUTHORITY' ? '#dc2626' : '#64748b',
              backgroundColor: activeTab === 'AUTHORITY' ? '#ffffff' : 'transparent',
              boxShadow: activeTab === 'AUTHORITY' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            🛡️ AUTHORITY MODE (Command Center)
          </button>
        </div>

        {registeredTag ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={40} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#065f46', marginBottom: '0.35rem' }}>
              Step 1 Complete: Tourist Profile Created!
            </h3>
            <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#2563eb', fontFamily: 'monospace', backgroundColor: '#eff6ff', border: '1px dashed #93c5fd', padding: '0.75rem', borderRadius: '8px', margin: '1rem 0' }}>
              {registeredTag}
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Multi-Modal Journey Configured: <strong>{journeySegments.map(s => s.modeLabel).join(' ➔ ')}</strong>. Proceeding to <strong>Step 2 — Plan Trip</strong>...
            </p>
          </div>
        ) : activeTab === 'TOURIST' ? (
          /* STEP 1: TOURIST REGISTRATION FORM WITH MULTI-MODAL JOURNEY PLANNING */
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {/* Leader Name */}
              <div className="form-group">
                <label className="form-label">Tourist / Group Leader Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="form-group">
                <label className="form-label">Mobile / Contact Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                  />
                </div>
              </div>

              {/* Number of People Travelling */}
              <div className="form-group">
                <label className="form-label">Number of People Travelling *</label>
                <div style={{ position: 'relative' }}>
                  <Users size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    name="travellersCount"
                    value={formData.travellersCount}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              {/* Emergency Contact Name */}
              <div className="form-group">
                <label className="form-label">Emergency Contact Name *</label>
                <div style={{ position: 'relative' }}>
                  <HeartPulse size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                  />
                </div>
              </div>

              {/* Emergency Contact Number */}
              <div className="form-group">
                <label className="form-label">Emergency Contact Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    name="emergencyContactNumber"
                    value={formData.emergencyContactNumber}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Preferred Language */}
            <div className="form-group" style={{ marginTop: '0.25rem' }}>
              <label className="form-label">Preferred Language</label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                </select>
              </div>
            </div>

            {/* MULTI-MODAL JOURNEY PLANNING SECTION */}
            <div style={{ marginTop: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.25rem' }}>
              {/* Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Route size={20} color="#2563eb" />
                  <div>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                      Multi-Modal Journey Planning
                    </strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      All selected transport modes form one continuous connected journey from start to finish.
                    </div>
                  </div>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                  {journeySegments.length} {journeySegments.length === 1 ? 'Segment' : 'Segments'} in Journey
                </span>
              </div>

              {/* Journey Anchors: Origin & Destination */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', margin: '1rem 0', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="#2563eb" />
                    <strong>Starting Location (Origin) *</strong>
                  </label>
                  <input
                    type="text"
                    value={journeyOrigin}
                    onChange={(e) => setJourneyOrigin(e.target.value)}
                    placeholder="e.g. Bengaluru City Center / Hotel / Home"
                    className="form-input"
                    style={{ fontSize: '0.85rem' }}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="#10b981" />
                    <strong>Final Destination *</strong>
                  </label>
                  <input
                    type="text"
                    value={journeyDestination}
                    onChange={(e) => setJourneyDestination(e.target.value)}
                    placeholder="e.g. Mysuru Palace / Heritage Destination"
                    className="form-input"
                    style={{ fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>

              {/* 1. Multi-Select Transport Mode Checkboxes */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', color: '#1e293b', marginBottom: '0.4rem' }}>
                  Select Transport Modes for this Journey (Multi-Select Available):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
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

              {/* 2. Connected Multi-Modal Journey Pipeline (Visual Flow Diagram) */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', boxShadow: '0 2px 6px rgba(37,99,235,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <Sparkles size={16} color="#2563eb" />
                  <strong style={{ fontSize: '0.88rem', color: '#1e40af' }}>
                    Connected Multi-Modal Journey Pipeline:
                  </strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem', padding: '0.5rem 0' }}>
                  {/* Start Point */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#1e40af' }}>
                    <MapPin size={13} color="#2563eb" />
                    <span>START: {journeyOrigin}</span>
                  </div>

                  {/* Connected Segments & Transition Points */}
                  {journeySegments.map((seg, idx) => (
                    <React.Fragment key={seg.id}>
                      <ArrowRight size={15} color="#94a3b8" />

                      {/* Mode Segment Pill */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#ffffff', border: '2px solid #2563eb', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', boxShadow: '0 1px 3px rgba(37,99,235,0.1)' }}>
                        <span>{seg.icon}</span>
                        <span>Leg {idx + 1}: {seg.modeLabel.replace(/^[^\s]+\s*/, '')}</span>
                      </div>

                      {/* Transition Point if not the last segment */}
                      {idx < journeySegments.length - 1 && (
                        <>
                          <ArrowRight size={15} color="#94a3b8" />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a', padding: '0.3rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', color: '#92400e', fontWeight: '700' }}>
                            <span>🔄 Transition: {seg.toLocation || (seg.mode === 'car' || seg.mode === 'taxi' ? 'Station / Airport' : 'Destination Station')}</span>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  ))}

                  {/* Final Destination */}
                  <ArrowRight size={15} color="#94a3b8" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#065f46' }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    <span>DESTINATION: {journeyDestination}</span>
                  </div>
                </div>
              </div>

              {/* AI Automated Multi-Modal Journey Guarantee */}
              <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem', boxShadow: '0 2px 8px rgba(16,185,129,0.08)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#166534', display: 'block', marginBottom: '0.2rem' }}>
                    Automated AI Multi-Modal Journey Integration Active
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#15803d', lineHeight: 1.4, display: 'block' }}>
                    No manual paperwork or segment logging required. The system automatically connects your selected transport modes into one continuous journey with schedule synchronization, safety corridor verification, and GPS tracking.
                  </span>
                </div>
              </div>

              {/* Add Additional Segment Dynamically */}
              <div style={{ backgroundColor: '#ffffff', border: '1px dashed #94a3b8', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Need multiple legs of the same mode? (e.g. <strong>Taxi ➔ Airplane ➔ Taxi</strong>)
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e40af' }}>+ Add Leg:</span>
                  {transportOptions.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleAddSegment(opt.id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '1.5rem' }}
            >
              <span>{loading ? 'Saving Multi-Modal Journey Profile...' : 'Next: Step 2 — Plan Trip (Real OSRM Route & On-The-Way POIs)'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
              Returning tourist?{' '}
              <Link to="/login" style={{ color: '#2563eb', fontWeight: '700' }}>
                Sign In with Tourist ID or Mobile
              </Link>
            </div>
          </form>
        ) : (
          /* AUTHORITY MODE ACCESS */
          <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Radio size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              Police & Tourism Safety Authority
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Open the complete Authority Command Center with access to all tourist parties, live geo-spatial surveillance, and emergency triage.
            </p>
            <button
              onClick={handleAuthorityDirect}
              className="btn"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', backgroundColor: '#dc2626', color: '#ffffff' }}
            >
              <Radio size={18} />
              <span>Launch Authority Command Center</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
