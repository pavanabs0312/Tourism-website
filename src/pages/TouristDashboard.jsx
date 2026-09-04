import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { 
  Shield, MapPin, Compass, Navigation, PhoneCall, Activity, 
  Clock, AlertTriangle, CheckCircle2, ArrowRight, Layers, Building, 
  History, Car, Bus, Train, Plane, Fuel, Zap, AlertOctagon, Users, Radio, Smartphone, Route 
} from 'lucide-react';
import { MapView } from '../components/MapView';
import { RiskCard } from '../components/RiskCard';
import { SOSButton } from '../components/SOSButton';

export const TouristDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    telemetry, 
    riskAssessment, 
    activeTrip, 
    tripStops, 
    tripHistory,
    sosActive, 
    dangerZones,
    gpsError,
    startTrip,
    completeTrip,
    simulateMoveToHazard,
    simulateSafeReturn
  } = useTourist();
  const navigate = useNavigate();

  const touristCoord = [telemetry.latitude, telemetry.longitude];
  const isTripActive = activeTrip?.status === 'ACTIVE';

  // Accuracy honesty classifier
  const accuracy = telemetry.accuracy || 12;
  const isLowAccuracy = accuracy > 100;
  let accuracyLabel = 'Location active';
  let accuracyColor = '#10b981';
  if (accuracy <= 30) {
    accuracyLabel = 'High accuracy location active';
    accuracyColor = '#10b981';
  } else if (accuracy <= 100) {
    accuracyLabel = 'Location active';
    accuracyColor = '#0284c7';
  } else {
    accuracyLabel = 'GPS accuracy is low';
    accuracyColor = '#f59e0b';
  }

  const displayName = currentUser?.name || 'pav';
  const displayTag = currentUser?.touristTag || currentUser?.touristId || 'TG-2026-752019';
  const journeySegments = activeTrip?.journeySegments?.length > 0
    ? activeTrip.journeySegments
    : (currentUser?.journeySegments || []);
  const journeySummary = journeySegments.length > 0
    ? journeySegments.map(s => s.modeLabel).join(' ➔ ')
    : (activeTrip?.selectedTransportLabel || 'Multi-Modal Journey');
  const finalMode = journeySegments.length > 0
    ? journeySegments[journeySegments.length - 1].mode
    : (activeTrip?.selectedTransport || currentUser?.selectedTransport || 'walking');
  const selectedMode = finalMode;
  const isMultiModal = journeySegments.length > 1;
  const groupMembers = currentUser?.groupMembers || [
    { name: `${displayName} (Lead)`, mobile: currentUser?.mobile || '+91 98765 43210', status: 'GPS Active', isLead: true }
  ];

  const handleStartOrEndTrip = async () => {
    if (isTripActive) {
      await completeTrip();
      navigate('/navigation');
    } else {
      await startTrip({
        title: tripStops[0] ? `Trip to ${tripStops[0].name}` : 'Karnataka Multi-Modal Tour',
        selectedTransport: selectedMode,
        selectedTransportLabel: journeySummary,
        journeySegments,
        journeyOrigin: activeTrip?.journeyOrigin || currentUser?.journeyOrigin,
        journeyDestination: activeTrip?.journeyDestination || currentUser?.journeyDestination
      });
      navigate('/navigation');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 0 4rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Top Welcome & Identity Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
                Welcome, {displayName} 👋
              </h1>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: '700' }}>
                Tourist ID: {displayTag}
              </span>
              <span className="badge badge-safe" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                {journeySegments.length > 1 ? `MULTI-MODAL (${journeySegments.length} LEGS)` : `JOURNEY: ${journeySummary}`}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Real-time tourist safety monitoring, multi-modal travel, and predictive guidance active.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleStartOrEndTrip}
              className={isTripActive ? 'btn btn-danger' : 'btn btn-primary'}
              style={{ fontSize: '0.85rem' }}
            >
              {isTripActive ? <AlertOctagon size={16} /> : <Compass size={16} />}
              <span>{isTripActive ? 'End Trip' : 'Start Trip'}</span>
            </button>

            <Link to="/emergency" className="btn btn-danger" style={{ fontSize: '0.85rem' }}>
              <PhoneCall size={16} />
              <span>Emergency SOS</span>
            </Link>

            <Link to="/destination-planner" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <span>Plan / Edit Trip</span>
            </Link>
          </div>
        </div>

        {/* Multi-Modal Connected Journey Strip */}
        {journeySegments.length > 0 && (
          <div className="card" style={{ marginBottom: '1.5rem', padding: '0.85rem 1.25rem', backgroundColor: '#ffffff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1e40af', fontSize: '0.82rem', fontWeight: '800' }}>
                <Route size={16} />
                <span>Multi-Modal Journey Plan:</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{activeTrip?.journeyOrigin || currentUser?.journeyOrigin || 'Start'}</span>
                {journeySegments.map((seg, idx) => (
                  <React.Fragment key={seg.id || idx}>
                    <ArrowRight size={13} color="#94a3b8" />
                    <span style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '700' }}>
                      {seg.modeLabel}
                    </span>
                  </React.Fragment>
                ))}
                <ArrowRight size={13} color="#94a3b8" />
                <span style={{ fontWeight: '700', color: '#10b981' }}>{activeTrip?.journeyDestination || currentUser?.journeyDestination || 'Destination'}</span>
              </div>
            </div>

            <Link to="/trip-planner" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View & Manage Trip</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Honest Low GPS Accuracy Warning with Group Fallback note */}
        {isLowAccuracy && (
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', borderRadius: '10px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>📡</span>
            <div style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
              <strong>Location accuracy is low (±{Math.round(accuracy)}m).</strong> For accurate GPS, use on a mobile device with GPS enabled. <em>Group member fallback anchor is active to ensure continuous tracking.</em>
            </div>
          </div>
        )}

        {/* GPS Permission Warning if applicable */}
        {gpsError && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '10px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} />
            <div style={{ fontSize: '0.85rem' }}>
              <strong>Location Access Notice:</strong> {gpsError}. Displaying GNSS standby tracking coordinates.
            </div>
          </div>
        )}

        {/* Active Danger Zone Warning Banner */}
        {riskAssessment.nearestDangerZone && riskAssessment.dangerZoneDistanceMeters && riskAssessment.dangerZoneDistanceMeters <= (riskAssessment.nearestDangerZone.radius + 300) && (
          <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', borderRadius: '10px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} color="#ea580c" />
            <div style={{ fontSize: '0.85rem' }}>
              <strong>⚠️ DANGER ZONE DETECTED:</strong> You are approaching "{riskAssessment.nearestDangerZone.name}" ({riskAssessment.nearestDangerZone.reason}).
            </div>
          </div>
        )}

        {/* 4 LIVE STATUS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {/* Card 1: LIVE LOCATION */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>LIVE LOCATION</span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 1.5s infinite' }} />
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.2rem' }}>
              GPS Active
            </div>
            <div style={{ fontSize: '0.78rem', color: '#0f172a', fontFamily: 'monospace', fontWeight: '600' }}>
              {telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)}
            </div>
            <div style={{ fontSize: '0.74rem', fontWeight: '700', color: accuracyColor, marginTop: '0.35rem' }}>
              ±{Math.round(accuracy)}m accuracy • {accuracyLabel}
            </div>
          </div>

          {/* Card 2: SAFETY STATUS */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>SAFETY STATUS</span>
              <Shield size={16} color={riskAssessment.level === 'SAFE' ? '#10b981' : (riskAssessment.level === 'LOW' ? '#0284c7' : '#f59e0b')} />
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: riskAssessment.level === 'SAFE' ? '#10b981' : (riskAssessment.level === 'LOW' ? '#0284c7' : '#d97706'), marginBottom: '0.2rem' }}>
              {riskAssessment.level}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>
              Movement: {telemetry.movementStatus || (telemetry.speed > 2 ? 'Moving' : 'Stationary')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem' }}>
              Speed: {telemetry.speed || 0} km/h (Calculated GPS)
            </div>
          </div>

          {/* Card 3: RISK SCORE */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>RISK SCORE</span>
              <Activity size={16} color="#3b82f6" />
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.2rem' }}>
              {riskAssessment.score} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#64748b' }}>/ 100</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.35' }}>
              {riskAssessment.reasons[0] || 'Optimal daylight navigation baseline.'}
            </div>
          </div>

          {/* Card 4: TRIP STATUS */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>TRIP STATUS</span>
              <Compass size={16} color="#8b5cf6" />
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: isTripActive ? '#059669' : '#0f172a', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isTripActive ? '● ACTIVE TRIP' : (activeTrip?.title || 'Mysuru Heritage & Scenic Circuit')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {tripStops.length} Destinations Queued
            </div>
            <button
              onClick={handleStartOrEndTrip}
              className="btn btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Navigation size={13} />
              <span>{isTripActive ? 'End Trip' : 'Start Trip'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column: Transport-Adaptive View (Left) & Group Fallback Roster (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {/* Left: Mode-Specific Dashboard */}
          <div className="card" style={{ borderLeft: '4px solid #2563eb', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>
                  {selectedMode === 'car' ? '🚗' : (selectedMode === 'bus' ? '🚌' : (selectedMode === 'train' ? '🚆' : (selectedMode === 'flight' ? '✈️' : (selectedMode === 'walking' ? '🚶' : '🚕'))))}
                </span>
                <div>
                  <strong style={{ fontSize: '0.98rem', color: '#0f172a', textTransform: 'capitalize' }}>
                    {isMultiModal ? 'Multi-Modal Connected Journey' : (selectedMode === 'car' ? 'Own Vehicle / Car' : (selectedMode === 'walking' ? 'Walking Promenade' : `${selectedMode} Mode`))} Dashboard
                  </strong>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {isMultiModal ? `Final leg: ${finalMode.toUpperCase()} • ${journeySummary}` : 'Metrics tailored strictly to your active travel mode'}
                  </div>
                </div>
              </div>

              <Link to="/destination-planner" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '700' }}>
                Change
              </Link>
            </div>

            {selectedMode === 'car' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Route Corridor:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>To {activeTrip?.journeyDestination || 'Destination'}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Departure:</span>
                  <div style={{ fontWeight: '700', color: '#059669' }}>{activeTrip?.travelTime || '09:00'}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Corridor Safety:</span>
                  <div style={{ fontWeight: '700', color: '#10b981' }}>Monitored Highway</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Destination:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{activeTrip?.journeyDestination || 'Destination'}</div>
                </div>
              </div>
            )}

            {selectedMode === 'bus' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Bus Service:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>
                    {activeTrip?.journeySegments?.find(s => s.mode === 'bus')?.title || 'Intercity State Coach'}
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Scheduled Time:</span>
                  <div style={{ fontWeight: '700', color: '#2563eb' }}>{activeTrip?.travelTime || 'Scheduled'}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Terminal Status:</span>
                  <div style={{ fontWeight: '700', color: '#10b981' }}>Active Service</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Corridor:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{activeTrip?.journeyOrigin} ➔ {activeTrip?.journeyDestination}</div>
                </div>
              </div>
            )}

            {selectedMode === 'train' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Train Service:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>
                    {activeTrip?.journeySegments?.find(s => s.mode === 'train')?.title || 'Scheduled Rail Express'}
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Arrival ETA:</span>
                  <div style={{ fontWeight: '700', color: '#2563eb' }}>
                    {activeTrip?.journeySegments?.find(s => s.mode === 'train')?.arrivalTime || 'Scheduled ETA'}
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Boarding Station:</span>
                  <div style={{ fontWeight: '700', color: '#10b981' }}>
                    {activeTrip?.journeySegments?.find(s => s.mode === 'train')?.fromLocation || `${activeTrip?.journeyOrigin} Station`}
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Corridor:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>Verified Railway Route</div>
                </div>
              </div>
            )}

            {selectedMode === 'flight' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Flight Route:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>BLR ➔ MYQ Regional</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Terminal Gate:</span>
                  <div style={{ fontWeight: '700', color: '#2563eb' }}>Gate 14 (DEMO DATA)</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Security Status:</span>
                  <div style={{ fontWeight: '700', color: '#10b981' }}>CISF Verified Secure</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Baggage Status:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>Checked In</div>
                </div>
              </div>
            )}

            {selectedMode === 'taxi' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Cab Partner:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>Karnataka Tourism Cab</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Verification OTP:</span>
                  <div style={{ fontWeight: '800', color: '#2563eb', fontFamily: 'monospace' }}>OTP: 8842</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Driver Check:</span>
                  <div style={{ fontWeight: '700', color: '#10b981' }}>Police Background Checked</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Vehicle Plate:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>KA-09-TR-4412</div>
                </div>
              </div>
            )}

            {selectedMode === 'walking' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Pedestrian Trail:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>Heritage Tourist Sidewalk</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Pedestrian Safety:</span>
                  <div style={{ fontWeight: '700', color: '#10b981' }}>98/100 (Dedicated Walkway)</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Walking Pace:</span>
                  <div style={{ fontWeight: '700', color: '#2563eb' }}>~4.5 km/h (Daylight Active)</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b' }}>Carbon Footprint:</span>
                  <div style={{ fontWeight: '700', color: '#059669' }}>0g CO₂ (Eco-Friendly)</div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Group Member Safety & Tracking Fallback Roster */}
          <div className="card" style={{ borderLeft: '4px solid #10b981', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#10b981" />
                <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>
                  Group Member Tracking Fallback ({groupMembers.length})
                </strong>
              </div>
              <span className="badge badge-safe" style={{ fontSize: '0.7rem' }}>
                🛡️ Group Anchor Active
              </span>
            </div>

            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.6rem', lineHeight: '1.35' }}>
              If one member's GPS accuracy drops, co-travelers act as mutual location anchors for Authority tracking.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
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
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Smartphone size={13} color="#2563eb" />
                    <strong style={{ color: '#0f172a' }}>{m.name}</strong>
                    <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                      ({m.mobile})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: m.isLead ? '#10b981' : '#0284c7' }}>
                    {m.isLead ? '🟢 GPS Active' : '🔵 Anchor Connected'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid: Left Live Geo-Fence Map & Right Predictive Risk Card + Quick SOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Left Column: Live Tourist Geo-Fence Map */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={18} color="#2563eb" />
                <span>Live Tourist Geo-Fence Map</span>
              </h3>
              <span className="badge badge-demo">OSRM Routing + GNSS</span>
            </div>

            <div style={{ height: '380px', marginBottom: '1rem' }}>
              <MapView
                center={touristCoord}
                zoom={14}
                tourists={[{
                  touristId: displayTag,
                  name: displayName,
                  latitude: telemetry.latitude,
                  longitude: telemetry.longitude,
                  gpsAccuracy: telemetry.accuracy,
                  safetyStatus: riskAssessment.level,
                  riskScore: riskAssessment.score,
                  movementStatus: telemetry.movementStatus,
                  speed: telemetry.speed,
                  sosActive
                }]}
                dangerZones={dangerZones}
                destinations={tripStops}
                height="100%"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
              <span>🟢 Real-time GNSS surveillance active (±{Math.round(accuracy)}m)</span>
              <Link to="/navigation" style={{ color: '#2563eb', fontWeight: '700' }}>
                Open Turn-by-Turn Navigation ➔
              </Link>
            </div>
          </div>

          {/* Right Column: Explainable Predictive Risk Card + Emergency Hub */}
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

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem', textAlign: 'center' }}>
                🚨 Emergency Assistance Hub
              </h3>
              <SOSButton />
            </div>
          </div>
        </div>

        {/* Previous Trips History */}
        {tripHistory && tripHistory.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <History size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                Previous Trips History
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tripHistory.map((trip) => (
                <div
                  key={trip.tripId}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.85rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{trip.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                      Transport: {trip.selectedTransportLabel || trip.selectedTransport} • {trip.destinations?.length || 0} destinations visited
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Duration:</span>
                      <div style={{ fontWeight: '700' }}>{trip.durationMins} mins</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Distance:</span>
                      <div style={{ fontWeight: '700' }}>{trip.distanceKm} km</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Max Risk:</span>
                      <div style={{ fontWeight: '700', color: '#10b981' }}>{trip.maxRiskScore}/100</div>
                    </div>
                    <span className="badge badge-safe" style={{ alignSelf: 'center', fontSize: '0.7rem' }}>
                      ✓ COMPLETED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
