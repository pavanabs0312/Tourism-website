import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { useAuthority } from '../context/AuthorityContext';
import { routingService } from '../services/routingService';
import { hotelService } from '../services/hotelService';
import { MapView } from './MapView';
import { MYSURU_2DAY_SAFE_TRIP, INITIAL_DANGER_ZONES } from '../data/mockData';
import { 
  Compass, MapPin, Shield, Clock, AlertTriangle, CheckCircle2, 
  Navigation, PhoneCall, Radio, Sparkles, Building, ChevronRight, 
  RotateCcw, ArrowRight, Info, AlertOctagon, Layers, ExternalLink,
  Car, Train, ShieldCheck, HeartHandshake, Eye
} from 'lucide-react';

export const MysuruTripDemoView = () => {
  const { loginAsTourist, loginAsAuthority, setMode } = useAuth();
  const { 
    telemetry, 
    setTelemetry,
    riskAssessment, 
    activeTrip, 
    setActiveTrip,
    startTrip, 
    completeTrip,
    sosActive,
    triggerSOS,
    resolveOrCancelSOS,
    simulateRouteDeviation,
    dangerZones
  } = useTourist();
  const { tourists } = useAuthority();
  const navigate = useNavigate();

  // Local state for simulation demo controls
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'DAY1' | 'DAY2'
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const [isApproachingHazard, setIsApproachingHazard] = useState(false);
  const [isRouteDeviated, setIsRouteDeviated] = useState(false);
  const [osrmRoute, setOsrmRoute] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [routeStats, setRouteStats] = useState({
    totalDistanceKm: '154.2',
    totalDurationMins: '185'
  });

  const tripData = MYSURU_2DAY_SAFE_TRIP;
  const allStops = useMemo(() => [
    ...tripData.day1.stops,
    ...tripData.day2.stops
  ], []);

  // Filtered verified Mysuru hotels from real database
  const mysuruHotels = useMemo(() => {
    const all = hotelService.getAllHotels();
    return all.filter(h => 
      (h.destinationId && h.destinationId.toLowerCase() === 'mysuru') ||
      (h.city && (h.city.toLowerCase() === 'mysuru' || h.city.toLowerCase() === 'mysore')) ||
      (h.destinationName && h.destinationName.toLowerCase().includes('mysur'))
    );
  }, []);

  // Fetch real OSRM road route between Bengaluru and Mysuru Palace
  useEffect(() => {
    let active = true;
    const fetchRoute = async () => {
      try {
        const start = [12.9716, 77.5946]; // Bengaluru
        const end = [12.3052, 76.6552];   // Mysuru Palace
        const waypoints = [
          [12.3385, 76.6575] // Mysuru Ring Road Entrance
        ];

        const result = await routingService.fetchOsrmRoute(start, end, waypoints);
        if (active && result && result.coordinates) {
          setOsrmRoute(result.coordinates);
          if (result.distanceMeters) {
            setRouteStats({
              totalDistanceKm: (result.distanceMeters / 1000).toFixed(1),
              totalDurationMins: Math.round(result.durationSeconds / 60).toString()
            });
          }
        }
      } catch (err) {
        console.warn('[MysuruDemo] Route fetch error:', err.message);
      }
    };

    fetchRoute();
    return () => { active = false; };
  }, []);

  // --- HACKATHON DEMO SIMULATION CONTROLS ---

  // 1. Start Demo Journey
  const handleStartDemoJourney = async () => {
    // Set active trip configuration
    await startTrip({
      title: 'MYSURU 2-DAY SAFE TRIP',
      destination: 'Mysuru, Karnataka, India',
      journeyOrigin: 'Bengaluru City Center',
      journeyDestination: 'Mysuru, Karnataka',
      selectedTransport: 'car',
      selectedTransportLabel: '🚗 Monitored NH-275 Expressway (Self-Drive)',
      routeCoordinates: osrmRoute || []
    });

    // Move telemetry to Bengaluru departure point
    if (setTelemetry) {
      setTelemetry(prev => ({
        ...prev,
        latitude: 12.9716,
        longitude: 77.5946,
        movementStatus: 'Departing Bengaluru (Expressway Safe Corridor)',
        speed: 55.0,
        accuracy: 10
      }));
    }
    setDemoStepIndex(0);
    setIsApproachingHazard(false);
    setIsRouteDeviated(false);
  };

  // 2. Step Through Itinerary Waypoints
  const handleStepToNextWaypoint = (stopIndex) => {
    const targetIndex = stopIndex !== undefined ? stopIndex : (demoStepIndex + 1) % allStops.length;
    const stop = allStops[targetIndex];
    if (!stop) return;

    setDemoStepIndex(targetIndex);
    setSelectedStop(stop);

    if (setTelemetry) {
      setTelemetry(prev => ({
        ...prev,
        latitude: stop.latitude,
        longitude: stop.longitude,
        movementStatus: `At ${stop.name}`,
        speed: stop.type === 'ATTRACTION' || stop.type === 'STAY' ? 0 : 42.0,
        accuracy: 8
      }));
    }
  };

  // 3. Simulate Approaching Monitored Safety Zone (Chamundi Foothills dz-1)
  const handleSimulateHazardCaution = () => {
    setIsApproachingHazard(true);
    if (setTelemetry) {
      // Coordinates near Chamundi Foothills Isolated Section (lat: 12.2850, lon: 76.6710, radius 450m)
      setTelemetry(prev => ({
        ...prev,
        latitude: 12.2852,
        longitude: 76.6708,
        movementStatus: 'Approaching Chamundi Foothills Monitored Zone',
        speed: 18.0,
        accuracy: 9
      }));
    }
  };

  // 4. Simulate Route Deviation
  const handleSimulateRouteDeviation = () => {
    setIsRouteDeviated(true);
    if (simulateRouteDeviation) {
      simulateRouteDeviation();
    }
    if (setActiveTrip) {
      setActiveTrip(prev => ({
        ...prev,
        routeDeviationMeters: 280,
        warningsCount: (prev?.warningsCount || 0) + 1
      }));
    }
  };

  // 5. Reset Demo to Safe State
  const handleResetDemo = async () => {
    setIsApproachingHazard(false);
    setIsRouteDeviated(false);
    if (setTelemetry) {
      setTelemetry(prev => ({
        ...prev,
        latitude: 12.3052,
        longitude: 76.6552,
        movementStatus: 'Stationary (Mysuru Palace Heritage Safe Corridor)',
        speed: 0,
        accuracy: 6
      }));
    }
    if (setActiveTrip) {
      setActiveTrip(prev => ({
        ...prev,
        routeDeviationMeters: 0,
        status: 'ACTIVE'
      }));
    }
    await resolveOrCancelSOS();
  };

  // 6. Launch Safe Navigation Page
  const handleViewSafeRoute = () => {
    // Load destination into activeTrip stops
    if (setActiveTrip) {
      setActiveTrip(prev => ({
        ...prev,
        journeyDestination: 'Mysore Palace (Amba Vilas)',
        selectedRouteType: 'safer'
      }));
    }
    navigate('/navigation');
  };

  // 7. Open Authority Command Center
  const handleOpenAuthorityCommand = () => {
    loginAsAuthority();
    setMode('AUTHORITY');
    navigate('/authority');
  };

  // 8. Trigger Demo SOS
  const handleTriggerDemoSOS = async () => {
    await triggerSOS('DEMO SOS: Simulated emergency beacon from Mysuru 2-Day Safe Trip');
    navigate('/emergency');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f8fafc', padding: '2rem 0 5rem' }}>
      <div className="container-custom">
        {/* ======================================================== */}
        {/* 1. TOP TRIP SUMMARY CARD (As Specified by User)           */}
        {/* ======================================================== */}
        <div className="card" style={{
          padding: '1.75rem',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  letterSpacing: '0.04em'
                }}>
                  ⭐ HACKATHON DEMO ITINERARY
                </span>

                <span style={{
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '800'
                }}>
                  2 Days • 1 Night
                </span>
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0f172a', margin: '0.25rem 0 0.5rem', letterSpacing: '-0.02em' }}>
                MYSURU 2-DAY SAFE TRIP
              </h1>

              {/* 4 Iconic Stops Highlights */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                {['Mysuru Palace', 'Mysuru Zoo', 'Chamundi Hill', 'KRS / Brindavan Gardens'].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      color: '#1e293b',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <CheckCircle2 size={13} color="#2563eb" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.85rem 1.25rem',
              borderRadius: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>DESTINATION</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>Mysuru, Karnataka</div>
              </div>
              <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>TOTAL STOPS</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#2563eb' }}>9 Safe Waypoints</div>
              </div>
              <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>SAFETY SCORE</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#10b981' }}>95/100 (Safe Corridor)</div>
              </div>
            </div>
          </div>

          {/* 4 PRIMARY ACTION BUTTONS (As Specified by User) */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '1.25rem'
          }}>
            <button
              onClick={handleStartDemoJourney}
              className="btn btn-primary"
              style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Navigation size={17} />
              <span>Start Demo Journey</span>
            </button>

            <button
              onClick={handleViewSafeRoute}
              className="btn btn-secondary"
              style={{ padding: '0.7rem 1.3rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ShieldCheck size={17} color="#2563eb" />
              <span>View Safe Route</span>
            </button>

            <button
              onClick={handleOpenAuthorityCommand}
              className="btn"
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '0.7rem 1.3rem',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Radio size={17} color="#38bdf8" />
              <span>Open Authority Command</span>
            </button>

            <button
              onClick={handleTriggerDemoSOS}
              className="btn btn-danger"
              style={{ padding: '0.7rem 1.3rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <PhoneCall size={17} />
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. LIVE SAFETY DEMO CONTROL PANEL (HACKATHON PRESENTATION)*/}
        {/* ======================================================== */}
        <div style={{
          backgroundColor: '#0a1128',
          color: '#ffffff',
          borderRadius: '1.25rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 30px -10px rgba(10,17,40,0.4)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ backgroundColor: 'rgba(56,189,248,0.15)', padding: '0.45rem', borderRadius: '8px', color: '#38bdf8' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Live Safety Demo Control Bar
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Demonstrate GPS tracking, real-time risk engine evaluation, danger zone caution alerts & SOS dispatch to judges.
                </span>
              </div>
            </div>

            <button
              onClick={handleResetDemo}
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#cbd5e1',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <RotateCcw size={13} />
              <span>Reset Demo State</span>
            </button>
          </div>

          {/* Real-time Status Indicators Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>GPS Coordinates</span>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'monospace' }}>
                {telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                Status: {telemetry.movementStatus || 'Active GPS Lock'}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>AI Risk Score</span>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: isApproachingHazard ? '#f87171' : '#34d399' }}>
                {isApproachingHazard ? '62 / 100 (HIGH RISK)' : `${riskAssessment.score} / 100 (${riskAssessment.level})`}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                {isApproachingHazard ? 'Near Chamundi monitored perimeter' : 'Optimal daylight & tourist corridor'}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Route Deviation</span>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: isRouteDeviated ? '#f87171' : '#34d399' }}>
                {isRouteDeviated ? '280m (OFF-CORRIDOR)' : '0m (On Safe Corridor)'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                {isRouteDeviated ? 'Cross-track alert active' : 'Tracking NH-275 / Palace route'}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Authority Dispatch Desk</span>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#38bdf8' }}>
                SYNCHRONIZED
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                Police & Tourism Command Live
              </div>
            </div>
          </div>

          {/* Interactive Trigger Buttons Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '700', marginRight: '0.25rem' }}>
              Simulate Stage:
            </span>

            <button
              onClick={() => handleStepToNextWaypoint()}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <ArrowRight size={14} />
              <span>Advance to Next Stop ({allStops[demoStepIndex]?.name.slice(0, 18)}...)</span>
            </button>

            <button
              onClick={handleSimulateHazardCaution}
              style={{
                backgroundColor: isApproachingHazard ? '#dc2626' : 'rgba(220,38,38,0.2)',
                color: '#ffffff',
                border: '1px solid #ef4444',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <AlertTriangle size={14} />
              <span>Simulate Hazard Approach</span>
            </button>

            <button
              onClick={handleSimulateRouteDeviation}
              style={{
                backgroundColor: isRouteDeviated ? '#d97706' : 'rgba(245,158,11,0.2)',
                color: '#ffffff',
                border: '1px solid #f59e0b',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <AlertOctagon size={14} />
              <span>Simulate Route Deviation</span>
            </button>

            <button
              onClick={handleOpenAuthorityCommand}
              style={{
                backgroundColor: 'rgba(56,189,248,0.15)',
                color: '#38bdf8',
                border: '1px solid #38bdf8',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Radio size={14} />
              <span>Verify Authority Sync</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* MANDATORY DEMO NOTIFICATION BANNERS (As Specified)        */}
          {/* ======================================================== */}

          {/* Hazard Caution Banner */}
          {isApproachingHazard && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '2px solid #ef4444',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              marginTop: '1.25rem',
              color: '#991b1b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              animation: 'pulse 2s infinite'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <AlertTriangle size={24} color="#dc2626" />
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: '900', color: '#b91c1c' }}>
                    CAUTION — Tourist approaching a monitored safety zone.
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#7f1d1d', fontWeight: '800', marginTop: '0.15rem' }}>
                    DEMO SIMULATION — NOT A REAL-TIME INCIDENT.
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetDemo}
                style={{
                  backgroundColor: '#b91c1c',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Clear Alert
              </button>
            </div>
          )}

          {/* Route Deviation Banner */}
          {isRouteDeviated && (
            <div style={{
              backgroundColor: '#fffbeb',
              border: '2px solid #f59e0b',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              marginTop: '1rem',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <AlertOctagon size={24} color="#d97706" />
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: '900', color: '#b45309' }}>
                    Route deviation detected.
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#78350f', fontWeight: '800', marginTop: '0.15rem' }}>
                    DEMO SIMULATION — NOT A REAL-TIME INCIDENT.
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetDemo}
                style={{
                  backgroundColor: '#b45309',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Re-Align Route
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 3. TWO-DAY ITINERARY TIMELINE (Day 1 & Day 2)             */}
        {/* ======================================================== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
          
          {/* ----------------- DAY 1 TIMELINE ----------------- */}
          <div className="card" style={{ padding: '1.5rem', borderTop: '5px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  DAY 1
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: '0.35rem 0 0' }}>
                  Arrival & Royal Heritage Corridor
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>5 Waypoints</span>
            </div>

            {/* Day 1 Stops List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
              {tripData.day1.stops.map((stop, idx) => {
                const isCurrent = telemetry.latitude.toFixed(3) === stop.latitude.toFixed(3);
                return (
                  <div
                    key={stop.id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      position: 'relative',
                      backgroundColor: isCurrent ? '#f0fdf4' : '#ffffff',
                      border: isCurrent ? '1px solid #86efac' : '1px solid #f1f5f9',
                      borderRadius: '10px',
                      padding: '1rem',
                      boxShadow: isCurrent ? '0 4px 12px rgba(16,185,129,0.1)' : 'none'
                    }}
                  >
                    {/* Step Number Circle */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? '#10b981' : '#2563eb',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.35rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          {stop.name}
                        </h4>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          {stop.safetyBadge}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>
                        📍 {stop.location}
                      </div>

                      {/* Official Information for Mysuru Zoo */}
                      {stop.id === 'day1-stop-4' && (
                        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.76rem', color: '#1e3a8a', marginBottom: '0.5rem' }}>
                          <strong>Official Zoo Details:</strong>
                          <div style={{ marginTop: '0.15rem' }}>
                            • Opening Hours: <strong>8:30 AM – 5:30 PM</strong><br />
                            • Weekly Holiday: <strong>Tuesday</strong><br />
                            • Official Adult Entry Ticket: <strong>₹120</strong>
                          </div>
                        </div>
                      )}

                      {/* Official Information for Mysore Palace */}
                      {stop.id === 'day1-stop-3' && (
                        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.76rem', color: '#1e3a8a', marginBottom: '0.5rem' }}>
                          <strong>Official Heritage Details:</strong>
                          <div style={{ marginTop: '0.15rem' }}>
                            • Visiting Hours: <strong>10:00 AM – 5:30 PM</strong> (All days)<br />
                            • Palace Lighting: <strong>Sundays & Public Holidays (7:00 PM – 8:00 PM)</strong>
                          </div>
                        </div>
                      )}

                      {/* Stop Metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.4rem', fontSize: '0.75rem', marginBottom: '0.6rem' }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '4px' }}>
                          <span style={{ color: '#64748b' }}>Route Distance:</span>{' '}
                          <strong>{stop.distanceKm} km</strong>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '4px' }}>
                          <span style={{ color: '#64748b' }}>Est. Travel Time:</span>{' '}
                          <strong>{stop.travelTimeMins} mins</strong>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '4px', gridColumn: 'span 2' }}>
                          <span style={{ color: '#64748b' }}>Suggested Duration:</span>{' '}
                          <span style={{ color: '#047857', fontWeight: '600' }}>{stop.suggestedDuration}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleStepToNextWaypoint(idx)}
                          style={{
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Set GPS Here
                        </button>

                        <button
                          onClick={() => {
                            if (setActiveTrip) {
                              setActiveTrip(prev => ({
                                ...prev,
                                journeyDestination: stop.name
                              }));
                            }
                            navigate('/navigation');
                          }}
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
                        >
                          <Navigation size={11} style={{ marginRight: '4px' }} />
                          <span>Navigate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ----------------- DAY 2 TIMELINE ----------------- */}
          <div className="card" style={{ padding: '1.5rem', borderTop: '5px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  DAY 2
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: '0.35rem 0 0' }}>
                  Hilltop Darshan & KRS Dam Reservoir Circuit
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>4 Waypoints</span>
            </div>

            {/* Day 2 Stops List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {tripData.day2.stops.map((stop, idx) => {
                const isCurrent = telemetry.latitude.toFixed(3) === stop.latitude.toFixed(3);
                return (
                  <div
                    key={stop.id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      position: 'relative',
                      backgroundColor: isCurrent ? '#f0fdf4' : '#ffffff',
                      border: isCurrent ? '1px solid #86efac' : '1px solid #f1f5f9',
                      borderRadius: '10px',
                      padding: '1rem',
                      boxShadow: isCurrent ? '0 4px 12px rgba(16,185,129,0.1)' : 'none'
                    }}
                  >
                    {/* Step Number Circle */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? '#10b981' : '#059669',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.35rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          {stop.name}
                        </h4>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          {stop.safetyBadge}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>
                        📍 {stop.location}
                      </div>

                      {/* KRS Dam / Brindavan Gardens Specific Note */}
                      {stop.id === 'day2-stop-3' && (
                        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.76rem', color: '#92400e', marginBottom: '0.5rem' }}>
                          <strong>Geographic Context:</strong>
                          <div style={{ marginTop: '0.15rem' }}>
                            • Destination area incorporates both the historic Krishnarajasagara dam reservoir on the Kaveri River and the adjacent terraced Brindavan Gardens.<br />
                            • Musical Fountain Display: <strong>7:00 PM – 8:00 PM</strong> (Daily)
                          </div>
                        </div>
                      )}

                      {/* Stop Metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.4rem', fontSize: '0.75rem', marginBottom: '0.6rem' }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '4px' }}>
                          <span style={{ color: '#64748b' }}>Route Distance:</span>{' '}
                          <strong>{stop.distanceKm} km</strong>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '4px' }}>
                          <span style={{ color: '#64748b' }}>Est. Travel Time:</span>{' '}
                          <strong>{stop.travelTimeMins} mins</strong>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '4px', gridColumn: 'span 2' }}>
                          <span style={{ color: '#64748b' }}>Suggested Duration:</span>{' '}
                          <span style={{ color: '#047857', fontWeight: '600' }}>{stop.suggestedDuration}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleStepToNextWaypoint(5 + idx)}
                          style={{
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Set GPS Here
                        </button>

                        <button
                          onClick={() => {
                            if (setActiveTrip) {
                              setActiveTrip(prev => ({
                                ...prev,
                                journeyDestination: stop.name
                              }));
                            }
                            navigate('/navigation');
                          }}
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
                        >
                          <Navigation size={11} style={{ marginRight: '4px' }} />
                          <span>Navigate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. INTERACTIVE ROUTE MAP & HAZARD ZONES                  */}
        {/* ======================================================== */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Bengaluru ➔ Mysuru Safe Highway & Heritage Corridor Map
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                OpenStreetMap & OSRM Road Polyline • Chamundi Foothills & KRS Safety Zones Plotted
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                Total Highway: ~{routeStats.totalDistanceKm} km
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                Drive Time: ~{routeStats.totalDurationMins} mins
              </span>
            </div>
          </div>

          <div style={{ height: '440px', borderRadius: '12px', overflow: 'hidden' }}>
            <MapView
              center={[12.3052, 76.6552]} // Mysuru Center
              zoom={12}
              tourists={[{
                touristId: 'tourist-demo-loc',
                name: 'Active Tourist Live Position',
                latitude: telemetry.latitude,
                longitude: telemetry.longitude,
                gpsAccuracy: telemetry.accuracy,
                safetyStatus: isApproachingHazard ? 'HIGH RISK' : riskAssessment.level,
                riskScore: isApproachingHazard ? 62 : riskAssessment.score,
                movementStatus: telemetry.movementStatus
              }]}
              dangerZones={dangerZones || INITIAL_DANGER_ZONES}
              destinations={allStops.map(s => ({
                name: s.name,
                location: s.location,
                latitude: s.latitude,
                longitude: s.longitude,
                category: s.type
              }))}
              saferRouteCoordinates={osrmRoute}
              height="100%"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. VERIFIED HOTELS DIRECTORY IN MYSURU                    */}
        {/* ======================================================== */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.8rem', fontWeight: '800' }}>
                <Building size={15} />
                <span>VERIFIED ACCOMMODATIONS IN MYSURU</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a', margin: '0.2rem 0' }}>
                Authentic Verified Stays for Day 1 Overnight
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Real properties connected to the Tourist Police safety corridor. No fabricated inventory.
              </p>
            </div>

            <Link
              to="/hotels?destination=mysuru"
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <span>Explore All Hotels</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {mysuruHotels.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {mysuruHotels.slice(0, 3).map((hotel) => (
                <div
                  key={hotel.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ height: '170px', position: 'relative' }}>
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      backgroundColor: 'rgba(15,23,42,0.85)',
                      color: '#10b981',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      {hotel.verificationBadge || 'Verified Safe Stay'}
                    </div>
                  </div>

                  <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
                      {hotel.name}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.6rem' }}>
                      📍 {hotel.location}
                    </div>

                    <div style={{ fontSize: '0.76rem', color: '#475569', lineHeight: '1.4', marginBottom: '0.85rem', flex: 1 }}>
                      {hotel.description}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>From</span>
                        <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#059669' }}>
                          ₹{hotel.pricePerNight?.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>/ night</span>
                        </div>
                      </div>

                      <Link
                        to={`/hotels?id=${hotel.id}`}
                        className="btn btn-primary"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
                      >
                        Book Stay
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
              <div style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                No verified hotel inventory available in demo mode.
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                Please connect property booking inventory API or explore other destinations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
