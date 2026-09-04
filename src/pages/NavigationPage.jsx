import React, { useState, useEffect } from 'react';
import { useTourist } from '../context/TouristContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { routingService } from '../services/routingService';
import { MapView } from '../components/MapView';
import { 
  Navigation, Shield, Clock, MapPin, AlertTriangle, 
  CheckCircle2, Compass, ArrowRight, Zap, RefreshCw, 
  Layers, AlertOctagon, Award, Share2, RotateCcw, Building, Hotel, Utensils, Route 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_SERVICES } from '../data/mockData';

export const NavigationPage = () => {
  const { 
    telemetry, 
    tripStops, 
    dangerZones, 
    activeTrip, 
    setActiveTrip,
    startTrip,
    completeTrip,
    lastCompletedTripSummary,
    riskAssessment,
    simulateMoveToHazard,
    simulateSafeReturn,
    simulateRouteDeviation
  } = useTourist();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(tripStops[0] || {
    name: 'Mysore Palace (Amba Vilas)',
    latitude: 12.3052,
    longitude: 76.6552,
    category: 'Heritage Palace'
  });

  const [routeOptions, setRouteOptions] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState('safer'); // 'fastest' | 'safer'
  const [calculating, setCalculating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [completedSummary, setCompletedSummary] = useState(null);

  useEffect(() => {
    if (tripStops.length > 0) {
      setDestination(tripStops[0]);
    }
  }, [tripStops]);

  useEffect(() => {
    calculateRoutes();
  }, [telemetry.latitude, telemetry.longitude, destination.latitude, destination.longitude, dangerZones]);

  const calculateRoutes = async () => {
    setCalculating(true);
    try {
      const start = [telemetry.latitude, telemetry.longitude];
      const end = [destination.latitude, destination.longitude];

      const routes = await routingService.calculateSafetyAwareRoutes(start, end, dangerZones);
      setRouteOptions(routes);
    } catch (err) {
      console.error('Error calculating routes:', err);
    } finally {
      setCalculating(false);
    }
  };

  const handleStartTrip = async () => {
    setValidationError('');

    if (!destination || !destination.name) {
      setValidationError('Please select at least one destination in Step 2: Plan Trip.');
      return;
    }

    const chosenRoute = routeOptions ? routeOptions[selectedRouteId] : null;

    await startTrip({
      title: `Trip to ${destination.name}`,
      selectedTransport: activeTrip.selectedTransport || currentUser?.selectedTransport || (activeTrip.journeySegments?.length > 0 ? activeTrip.journeySegments[activeTrip.journeySegments.length - 1].mode : 'walking'),
      selectedTransportLabel: activeTrip.selectedTransportLabel || 'Multi-Modal Journey',
      journeySegments: activeTrip.journeySegments || currentUser?.journeySegments || [],
      journeyOrigin: activeTrip.journeyOrigin || currentUser?.journeyOrigin || 'Origin',
      journeyDestination: activeTrip.journeyDestination || currentUser?.journeyDestination || destination.name,
      selectedRouteType: selectedRouteId,
      selectedRouteLabel: chosenRoute?.name || 'Recommended Safer Route',
      routeCoordinates: chosenRoute?.coordinates || []
    });
  };

  const handleEndTrip = async () => {
    const summary = await completeTrip();
    setCompletedSummary(summary);
    setShowSummaryModal(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  const handleStartNewTrip = () => {
    setShowSummaryModal(false);
    navigate('/trip-planner');
  };

  const isTripActive = activeTrip.status === 'ACTIVE';
  const selectedMode = activeTrip.selectedTransport || currentUser?.selectedTransport || (activeTrip.journeySegments?.length > 0 ? activeTrip.journeySegments[activeTrip.journeySegments.length - 1].mode : 'walking');

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 0 4rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '0.4rem', borderRadius: '8px', color: '#2563eb' }}>
                <Navigation size={22} />
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
                Safety-Aware Navigation & Real GPS Tracking
              </h1>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Dynamic OSRM route comparison: Fastest available corridor vs Recommended Safer Route bypassing hazard geo-fences.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={calculateRoutes}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              <RefreshCw size={15} />
              <span>Recalculate Route</span>
            </button>

            {!isTripActive ? (
              <button
                onClick={handleStartTrip}
                className="btn btn-primary"
                style={{ fontSize: '0.88rem', padding: '0.6rem 1.4rem' }}
              >
                <Compass size={16} />
                <span>START TRIP</span>
              </button>
            ) : (
              <button
                onClick={handleEndTrip}
                className="btn btn-danger"
                style={{ fontSize: '0.88rem', padding: '0.6rem 1.4rem' }}
              >
                <AlertOctagon size={16} />
                <span>END TRIP</span>
              </button>
            )}
          </div>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            {validationError}
          </div>
        )}

        {/* Multi-Modal Journey Pipeline Strip */}
        {((activeTrip.journeySegments && activeTrip.journeySegments.length > 0) || (currentUser?.journeySegments && currentUser.journeySegments.length > 0)) && (
          <div className="card" style={{ marginBottom: '1.5rem', padding: '0.85rem 1.25rem', backgroundColor: '#ffffff', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e40af', fontSize: '0.85rem', fontWeight: '800' }}>
                <Route size={16} />
                <span>Multi-Modal Journey Plan</span>
              </div>
              <Link to="/transport" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>
                View & Edit Transport Legs ➔
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.78rem' }}>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>
                {activeTrip.journeyOrigin || currentUser?.journeyOrigin || 'Start'}
              </span>
              {(activeTrip.journeySegments || currentUser?.journeySegments || []).map((seg, idx) => (
                <React.Fragment key={seg.id || idx}>
                  <ArrowRight size={13} color="#94a3b8" />
                  <span style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '700' }}>
                    {seg.modeLabel}
                  </span>
                </React.Fragment>
              ))}
              <ArrowRight size={13} color="#94a3b8" />
              <span style={{ fontWeight: '700', color: '#10b981' }}>
                {activeTrip.journeyDestination || currentUser?.journeyDestination || destination.name}
              </span>
            </div>
          </div>
        )}

        {/* Active Trip Telemetry Status Banner */}
        {isTripActive && (
          <div style={{
            backgroundColor: '#0a1128',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            marginBottom: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 1.2s infinite' }} />
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#38bdf8' }}>LIVE TRIP ACTIVE: {activeTrip.title}</strong>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Transport: {activeTrip.selectedTransportLabel || 'Own Car'} • Telemetry streaming continuously to Authority Command Center
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Speed:</span>
                <div style={{ fontWeight: '700', color: '#ffffff' }}>{telemetry.speed || 0} km/h</div>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>GPS Accuracy:</span>
                <div style={{ fontWeight: '700', color: telemetry.accuracy <= 30 ? '#10b981' : '#f59e0b' }}>
                  ±{telemetry.accuracy}m
                </div>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Risk Index:</span>
                <div style={{ fontWeight: '700', color: riskAssessment.score <= 20 ? '#10b981' : (riskAssessment.score <= 40 ? '#0284c7' : '#f59e0b') }}>
                  {riskAssessment.score}/100 ({riskAssessment.level})
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hazard Zone Proximity & Route Deviation Alerts */}
        {riskAssessment.nearestDangerZone && riskAssessment.dangerZoneDistanceMeters && riskAssessment.dangerZoneDistanceMeters <= (riskAssessment.nearestDangerZone.radius + 300) && (
          <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', borderRadius: '10px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} color="#ea580c" />
            <div style={{ fontSize: '0.85rem' }}>
              <strong>⚠️ DANGER ZONE DETECTED:</strong> Tourist is near "{riskAssessment.nearestDangerZone.name}" ({riskAssessment.nearestDangerZone.reason}). Recommended Safer route automatically diverts around this sector.
            </div>
          </div>
        )}

        {/* Route Comparison Selector Cards (FASTEST vs SAFER) */}
        {routeOptions && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
            {/* 1. Fastest Route */}
            <div
              onClick={() => setSelectedRouteId('fastest')}
              className="card"
              style={{
                cursor: 'pointer',
                border: selectedRouteId === 'fastest' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: selectedRouteId === 'fastest' ? '#eff6ff' : '#ffffff',
                boxShadow: selectedRouteId === 'fastest' ? '0 6px 16px rgba(37,99,235,0.15)' : 'var(--shadow-sm)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={18} color="#2563eb" />
                  <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>Fastest Route</strong>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Direct Corridor</span>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.88rem', margin: '0.5rem 0 0.75rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Distance:</span>
                  <div style={{ fontWeight: '700' }}>{routeOptions.fastest.distanceKm} km</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Travel Time:</span>
                  <div style={{ fontWeight: '700' }}>{routeOptions.fastest.durationMins} mins</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Route Risk:</span>
                  <div style={{ fontWeight: '700', color: routeOptions.fastest.riskScore <= 20 ? '#10b981' : '#f59e0b' }}>
                    {routeOptions.fastest.riskScore}/100 ({routeOptions.fastest.riskLevel})
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: '1.4' }}>
                {routeOptions.fastest.summary}
              </p>
            </div>

            {/* 2. Recommended Safer Route */}
            <div
              onClick={() => setSelectedRouteId('safer')}
              className="card"
              style={{
                cursor: 'pointer',
                border: selectedRouteId === 'safer' ? '2px solid #10b981' : '1px solid #e2e8f0',
                backgroundColor: selectedRouteId === 'safer' ? '#ecfdf5' : '#ffffff',
                boxShadow: selectedRouteId === 'safer' ? '0 6px 16px rgba(16,185,129,0.15)' : 'var(--shadow-sm)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={18} color="#10b981" />
                  <strong style={{ fontSize: '1.05rem', color: '#065f46' }}>Recommended Safer Route</strong>
                </div>
                <span className="badge badge-safe" style={{ fontSize: '0.7rem' }}>🛡️ RECOMMENDED</span>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.88rem', margin: '0.5rem 0 0.75rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Distance:</span>
                  <div style={{ fontWeight: '700' }}>{routeOptions.safer.distanceKm} km</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Travel Time:</span>
                  <div style={{ fontWeight: '700' }}>{routeOptions.safer.durationMins} mins</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Safety Score:</span>
                  <div style={{ fontWeight: '700', color: '#10b981' }}>
                    {routeOptions.safer.safetyScore}/100 (🟢 SAFE)
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#047857', margin: 0, lineHeight: '1.4' }}>
                {routeOptions.safer.detourExplanation}
              </p>
            </div>
          </div>
        )}

        {/* Live Navigation Leaflet Map */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>
                Navigation Map: Current Position ➔ {destination.name}
              </span>
              <span className="badge badge-demo">OSRM Live Engine</span>
            </div>

            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Active Path: <strong style={{ color: selectedRouteId === 'safer' ? '#10b981' : '#2563eb' }}>{selectedRouteId === 'safer' ? 'Safer Route' : 'Fastest Route'}</strong>
            </span>
          </div>

          <div style={{ height: '480px' }}>
            <MapView
              center={[telemetry.latitude, telemetry.longitude]}
              zoom={13}
              tourists={[{
                touristId: currentUser?.touristTag || 'my-loc',
                name: 'Your Real-Time Location',
                latitude: telemetry.latitude,
                longitude: telemetry.longitude,
                gpsAccuracy: telemetry.accuracy,
                safetyStatus: riskAssessment.level,
                riskScore: riskAssessment.score,
                movementStatus: telemetry.movementStatus
              }]}
              dangerZones={dangerZones}
              destinations={tripStops}
              fastestRouteCoordinates={selectedRouteId === 'fastest' ? routeOptions?.fastest?.coordinates : null}
              saferRouteCoordinates={selectedRouteId === 'safer' ? routeOptions?.safer?.coordinates : null}
              height="100%"
            />
          </div>

          {/* Interactive Demo Triggers during Navigation */}
          {isTripActive && (
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>
                Interactive Demo Navigation Scenarios:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={simulateMoveToHazard}
                  style={{ backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Simulate Approaching Hazard Zone
                </button>
                <button
                  onClick={simulateRouteDeviation}
                  style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Simulate 280m Route Deviation
                </button>
                <button
                  onClick={simulateSafeReturn}
                  style={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Reset to Safe Route
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 10. TRIP COMPLETED SUMMARY MODAL */}
        {showSummaryModal && completedSummary && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(10, 17, 40, 0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: '540px', width: '100%', textAlign: 'center', padding: '2rem', borderTop: '6px solid #10b981' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Award size={38} />
              </div>

              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#065f46', marginBottom: '0.25rem' }}>
                🎉 Trip Completed Safely!
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Your complete journey summary has been securely recorded to Firebase Firestore.
              </p>

              {/* Trip Summary Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Travel Time:</span>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>{completedSummary.durationMins} mins</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Total Distance:</span>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>{completedSummary.distanceKm} km</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Transport Mode:</span>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a', textTransform: 'capitalize' }}>
                    {activeTrip.selectedTransportLabel || selectedMode}
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Safety Summary:</span>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#10b981' }}>
                    Max Risk: {completedSummary.maxRiskScore}/100 (Safe)
                  </div>
                </div>
              </div>

              {/* Places Visited */}
              <div style={{ backgroundColor: '#f0fdf4', padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                <strong style={{ color: '#166534', display: 'block', marginBottom: '0.3rem' }}>Places Visited:</strong>
                <div style={{ color: '#15803d' }}>
                  {tripStops.map(s => s.name).join(' ➔ ') || 'Mysore Palace ➔ Chamundi Hills'}
                </div>
              </div>

              {/* Buttons: Start New Trip & Return to Dashboard */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleStartNewTrip}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.88rem' }}
                >
                  <span>Start New Trip</span>
                  <Plus size={15} />
                </button>

                <button
                  onClick={() => { setShowSummaryModal(false); navigate('/tourist'); }}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.88rem' }}
                >
                  <span>Return to Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
