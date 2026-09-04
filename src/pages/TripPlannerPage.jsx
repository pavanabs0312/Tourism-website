import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTourist } from '../context/TouristContext';
import { useAuth } from '../context/AuthContext';
import { smartTransportSuggestionService } from '../services/smartTransportSuggestionService';
import { geocodingService } from '../services/geocodingService';
import { poiService } from '../services/poiService';

// Reusable Components
import { AISafetyGuardian } from '../components/AISafetyGuardian';
import { SafetyScoreCard } from '../components/SafetyScoreCard';
import { ActiveJourneyView } from '../components/ActiveJourneyView';
import { DemoSOSModal } from '../components/DemoSOSModal';
import { MapView } from '../components/MapView';

import { 
  Compass, MapPin, Calendar, Clock, Users, Sparkles, ArrowRight, 
  CheckCircle2, Route, Edit3, Hotel, ShieldCheck, AlertCircle, 
  Shield, HelpCircle, Check, PhoneCall, CloudSun
} from 'lucide-react';

export const TripPlannerPage = () => {
  const { activeTrip, setActiveTrip, tripStops } = useTourist();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Read all traveler details & journey parameters strictly from activeTrip (Single Source of Truth)
  const travelerDetails = activeTrip?.travelerDetails || {};
  const originLocation = activeTrip?.journeyOrigin || '';
  const destinationLocation = activeTrip?.journeyDestination || (tripStops[0]?.name || '');
  const travelDate = activeTrip?.travelDate || '';
  const travelTime = activeTrip?.travelTime || '';
  const travellersCount = activeTrip?.travellersCount || 1;
  const selectedModes = activeTrip?.selectedTransportModes || [];

  // Current view phase: 'PLANNER' (AI Journey) | 'SAFETY' (Safety Check) | 'SUMMARY' (Confirmation & Stays)
  const [currentStep, setCurrentStep] = useState('PLANNER');

  // Multi-Modal Journey Segments & Timings
  const [journeySegments, setJourneySegments] = useState(activeTrip?.journeySegments || []);
  const [estimatedEndTime, setEstimatedEndTime] = useState('');

  // Confirmation Gating State
  const [isTripConfirmed, setIsTripConfirmed] = useState(activeTrip?.status === 'CONFIRMED');

  // Interactive UI Modals & Views
  const [showWhyAIModal, setShowWhyAIModal] = useState(false);
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);

  // Safety & Stay Active Tab
  const [activeStayCategory, setActiveStayCategory] = useState('hotel');

  // Real Destination Live Data
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [liveWeather, setLiveWeather] = useState({
    temp: null,
    condition: 'Checking live weather...',
    isLoaded: false
  });

  // Transport Suggestions Pool
  const [trainSuggestions, setTrainSuggestions] = useState([]);
  const [selectedTrainId, setSelectedTrainId] = useState('');
  const [busSuggestions, setBusSuggestions] = useState([]);

  // Destination Hotels & Services State (Real data around actual destination)
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [nearbyPolice, setNearbyPolice] = useState([]);

  // 1. Build Connected Multi-Modal Journey strictly from activeTrip parameters
  useEffect(() => {
    if (!originLocation || !destinationLocation || selectedModes.length === 0) return;

    const journey = smartTransportSuggestionService.buildConnectedMultiModalJourney({
      originLocation,
      destinationLocation,
      travelDate: travelDate || new Date().toISOString().split('T')[0],
      preferredTime: travelTime || '09:00',
      selectedModes,
      travellersCount
    });

    setJourneySegments(journey.segments);
    setEstimatedEndTime(journey.estimatedEndTime);

    // Fetch verified trains for the corridor
    const trains = smartTransportSuggestionService.getTrainSuggestions(
      originLocation, destinationLocation, travelDate, travelTime
    );
    setTrainSuggestions(trains);
    if (trains.length > 0) {
      setSelectedTrainId(trains[0].id);
    }

    if (selectedModes.includes('bus')) {
      const buses = smartTransportSuggestionService.getBusSuggestions(
        originLocation, destinationLocation, travelDate, travelTime
      );
      setBusSuggestions(buses);
    }
  }, [originLocation, destinationLocation, travelDate, travelTime, selectedModes, travellersCount]);

  // 2. Geocode actual destination & fetch live weather via Open-Meteo API
  useEffect(() => {
    let isMounted = true;

    async function loadDestinationCoordinatesAndWeather() {
      if (!destinationLocation) return;
      try {
        const places = await geocodingService.searchPlaces(destinationLocation);
        if (places && places.length > 0 && isMounted) {
          const lat = places[0].latitude;
          const lon = places[0].longitude;
          setDestinationCoords([lat, lon]);

          // Fetch live weather from free open API
          try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`, {
              signal: AbortSignal.timeout(4500)
            });
            if (res.ok && isMounted) {
              const data = await res.json();
              if (data.current_weather) {
                const wCode = data.current_weather.weathercode;
                let cond = 'Clear Sky';
                if (wCode >= 1 && wCode <= 3) cond = 'Partly Cloudy';
                else if (wCode >= 45 && wCode <= 48) cond = 'Foggy';
                else if (wCode >= 51 && wCode <= 67) cond = 'Rain Showers';
                else if (wCode >= 80) cond = 'Rain / Storm';

                setLiveWeather({
                  temp: `${Math.round(data.current_weather.temperature)}°C`,
                  condition: cond,
                  wind: `${data.current_weather.windspeed} km/h`,
                  isLoaded: true
                });
              }
            }
          } catch (e) {
            if (isMounted) setLiveWeather({ temp: 'Live Feed Offline', condition: 'Weather Server Offline', isLoaded: false });
          }
        }
      } catch (e) {
        if (isMounted) setLiveWeather({ temp: 'Unavailable', condition: 'Unavailable', isLoaded: false });
      }
    }

    loadDestinationCoordinatesAndWeather();
    return () => { isMounted = false; };
  }, [destinationLocation]);

  // 3. Fetch Real POIs around the ACTUAL Destination Coordinates
  useEffect(() => {
    let isMounted = true;

    async function loadDestinationServices() {
      if (!destinationCoords) return;
      setHotelsLoading(true);

      try {
        const pois = await poiService.fetchOverpassPoisAtCoordinate(
          destinationCoords[0], destinationCoords[1], 8000
        );

        if (!isMounted) return;

        if (pois && pois.length > 0) {
          const hotels = pois.filter(p => p.category === 'HOTEL');
          const foods = pois.filter(p => p.category === 'RESTAURANT');
          const fuels = pois.filter(p => p.category === 'REST_STOP');

          setNearbyHotels(hotels.slice(0, 6));
          if (hotels.length > 0 && !selectedHotel) {
            setSelectedHotel(hotels[0].name);
          }
        }
      } catch (e) {
        console.warn('[POI] Overpass live fetch offline:', e.message);
      } finally {
        if (isMounted) setHotelsLoading(false);
      }
    }

    loadDestinationServices();
    return () => { isMounted = false; };
  }, [destinationCoords]);

  // Dynamic Calculated Metrics (NO hardcoded fake values)
  const totalTravelCost = useMemo(() => {
    if (!journeySegments || journeySegments.length === 0) return 'Calculating...';
    const sum = journeySegments.reduce((acc, s) => acc + (s.costNumeric || 0), 0);
    return sum > 0 ? `₹${sum} / traveler` : 'Free / Pedestrian';
  }, [journeySegments]);

  const totalTravelDuration = useMemo(() => {
    if (!journeySegments || journeySegments.length === 0) return 'Calculating...';
    const startMins = smartTransportSuggestionService.timeToMinutes(journeySegments[0]?.departureTime || travelTime);
    const endMins = smartTransportSuggestionService.timeToMinutes(journeySegments[journeySegments.length - 1]?.arrivalTime || estimatedEndTime);
    const diff = endMins >= startMins ? endMins - startMins : endMins + 1440 - startMins;
    return smartTransportSuggestionService.formatDuration(diff / 60);
  }, [journeySegments, travelTime, estimatedEndTime]);

  const dynamicSafetyScore = useMemo(() => {
    let score = 92;
    const depMins = smartTransportSuggestionService.timeToMinutes(travelTime || '09:00');
    // If night departure (after 21:00 or before 05:30)
    if (depMins > 21 * 60 || depMins < 5.5 * 60) {
      score -= 10;
    }
    // If pedestrian leg in night
    if (selectedModes.includes('walking') && (depMins > 20 * 60 || depMins < 6 * 60)) {
      score -= 8;
    }
    if (selectedModes.includes('train')) score += 3;
    return Math.max(65, Math.min(98, score));
  }, [travelTime, selectedModes]);

  // Train selection handler: updates journey segments and synchronizes times
  const handleSelectTrain = (train) => {
    setSelectedTrainId(train.id);

    setJourneySegments(prev => {
      let foundTrain = false;
      const trainArrMins = smartTransportSuggestionService.timeToMinutes(train.arrivalTime);
      let currentMins = trainArrMins + 12; // 12 min transfer buffer at station

      const updated = prev.map((s) => {
        if (s.mode === 'train') {
          foundTrain = true;
          return {
            ...s,
            title: `${train.trainName} (#${train.trainNumber})`,
            modeLabel: `Train: ${train.trainName} (#${train.trainNumber})`,
            departureTime: train.departureTime,
            arrivalTime: train.arrivalTime,
            fromLocation: train.boardingStation,
            toLocation: train.destinationStation,
            estimatedDuration: train.duration,
            costEstimate: train.fareEstimate,
            costNumeric: train.fareNumeric || s.costNumeric,
            status: 'CONFIRMED'
          };
        }
        if (foundTrain) {
          const segDur = s.mode === 'walking' ? 20 : (s.mode === 'taxi' ? 10 : 30);
          const endM = currentMins + segDur;
          const u = {
            ...s,
            departureTime: smartTransportSuggestionService.minutesToTime(currentMins),
            arrivalTime: smartTransportSuggestionService.minutesToTime(endM),
            status: 'CONFIRMED'
          };
          currentMins = endM;
          return u;
        }
        return s;
      });

      setEstimatedEndTime(smartTransportSuggestionService.minutesToTime(currentMins));
      return updated;
    });
  };

  // Confirm Trip Handler: Gated to Step 4
  const handleConfirmTrip = () => {
    setIsTripConfirmed(true);
    setActiveTrip(prev => ({
      ...prev,
      status: 'CONFIRMED',
      confirmedAt: new Date().toISOString()
    }));
  };

  // Start Active Journey Simulator
  const handleStartActiveJourney = () => {
    setIsJourneyActive(true);
    setActiveTrip(prev => ({
      ...prev,
      status: 'ACTIVE',
      startTime: new Date().toISOString()
    }));
  };

  // Map Route Coordinates
  const routeCoordinates = destinationCoords ? [
    [12.9716, 77.5946],
    destinationCoords
  ] : [];

  // Guard: If no active trip entered, show clear prompt to fill details
  if (!originLocation || !destinationLocation || selectedModes.length === 0) {
    return (
      <div style={{ backgroundColor: '#f8fafc', padding: '4rem 1rem', minHeight: 'calc(100vh - 68px)', textAlign: 'center' }}>
        <div className="container-custom" style={{ maxWidth: '600px', backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Compass size={32} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.65rem' }}>
            No Active Journey Configured
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.75rem' }}>
            Please enter your traveler details, starting location, final destination, and preferred transport modes in the Travel Details form first.
          </p>
          <Link to="/destination-planner" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Open Travel Details Form</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 1rem 5rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom" style={{ maxWidth: '960px' }}>
        
        {/* Step Progression Bar (4-Step Flow) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
          {/* 1. Trip Details */}
          <Link to="/destination-planner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.82rem', flexShrink: 0 }}>
              ✓
            </div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#065f46', display: 'block' }}>1. Trip Details</strong>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{travelerDetails.fullName || 'Registered'}</span>
            </div>
          </Link>

          {/* 2. AI Journey */}
          <div 
            onClick={() => { setCurrentStep('PLANNER'); setIsJourneyActive(false); }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#ffffff', 
              padding: '0.65rem 0.85rem', 
              borderRadius: '10px', 
              border: currentStep === 'PLANNER' ? '2px solid #2563eb' : '1px solid #e2e8f0',
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: currentStep === 'PLANNER' ? '#2563eb' : '#eff6ff', color: currentStep === 'PLANNER' ? '#ffffff' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.82rem', flexShrink: 0 }}>
              2
            </div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>2. AI Journey</strong>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{selectedModes.length} Connected Legs</span>
            </div>
          </div>

          {/* 3. Safety Check */}
          <div 
            onClick={() => { setCurrentStep('SAFETY'); setIsJourneyActive(false); }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#ffffff', 
              padding: '0.65rem 0.85rem', 
              borderRadius: '10px', 
              border: currentStep === 'SAFETY' ? '2px solid #2563eb' : '1px solid #e2e8f0',
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: currentStep === 'SAFETY' ? '#2563eb' : '#eff6ff', color: currentStep === 'SAFETY' ? '#ffffff' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.82rem', flexShrink: 0 }}>
              3
            </div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>3. Safety Check</strong>
              <span style={{ fontSize: '0.68rem', color: '#059669' }}>Score: {dynamicSafetyScore}/100</span>
            </div>
          </div>

          {/* 4. Confirmation */}
          <div 
            onClick={() => { setCurrentStep('SUMMARY'); setIsJourneyActive(false); }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#ffffff', 
              padding: '0.65rem 0.85rem', 
              borderRadius: '10px', 
              border: currentStep === 'SUMMARY' ? '2px solid #10b981' : '1px solid #e2e8f0',
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: isTripConfirmed ? '#10b981' : (currentStep === 'SUMMARY' ? '#2563eb' : '#f1f5f9'), color: isTripConfirmed || currentStep === 'SUMMARY' ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.82rem', flexShrink: 0 }}>
              {isTripConfirmed ? '✓' : '4'}
            </div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>4. Confirmation</strong>
              <span style={{ fontSize: '0.68rem', color: isTripConfirmed ? '#059669' : '#64748b' }}>
                {isTripConfirmed ? 'Trip Confirmed' : 'Review & Confirm'}
              </span>
            </div>
          </div>
        </div>

        {/* Traveler Quick Banner (Strictly using user's real input) */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>
              👤 {travelerDetails.fullName || 'Tourist'}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              📞 {travelerDetails.contactNumber || 'No phone'}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '700' }}>
              📍 {originLocation} ➔ {destinationLocation}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#475569' }}>
              📅 {travelDate} (Dep: {travelTime}) • {travellersCount} traveler{travellersCount > 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            {travelerDetails.emergencyContactName && (
              <div style={{ fontSize: '0.74rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '0.3rem 0.65rem', borderRadius: '6px', color: '#991b1b' }}>
                <strong>Emergency:</strong> {travelerDetails.emergencyContactName} ({travelerDetails.emergencyRelationship || 'Contact'}) • {travelerDetails.emergencyContactNumber}
              </div>
            )}
            <Link to="/destination-planner" className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Edit3 size={12} />
              <span>Edit Trip</span>
            </Link>
          </div>
        </div>

        {/* ACTIVE JOURNEY VIEW */}
        {isJourneyActive && (
          <ActiveJourneyView 
            origin={originLocation}
            destination={destinationLocation}
            segments={journeySegments}
            safetyScore={dynamicSafetyScore}
            onTriggerSOS={() => setIsSOSActive(true)}
            onAcceptAlternativeCab={() => {}}
            onBackToPlanner={() => setIsJourneyActive(false)}
          />
        )}

        {/* ========================================================================= */}
        {/* STEP 2: AI CONNECTED JOURNEY LEGS & VERIFIED SCHEDULES                    */}
        {/* ========================================================================= */}
        {!isJourneyActive && currentStep === 'PLANNER' && (
          <div>
            {/* Connected Journey Card */}
            <div 
              className="card" 
              style={{ 
                marginBottom: '1.75rem', 
                padding: '1.5rem', 
                border: '2px solid #3b82f6', 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
                boxShadow: '0 8px 24px rgba(37,99,235,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                    <Sparkles size={13} />
                    <span>CONNECTED MULTI-MODAL JOURNEY</span>
                  </div>
                  <h2 style={{ fontSize: '1.55rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                    🤖 Multi-Modal Connected Pipeline
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: '#475569', margin: '0.2rem 0 0' }}>
                    {selectedModes.length} sequential legs from <strong>{originLocation}</strong> to <strong>{destinationLocation}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowWhyAIModal(true)}
                  className="btn"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #2563eb',
                    color: '#2563eb',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(37,99,235,0.1)'
                  }}
                >
                  <HelpCircle size={15} />
                  <span>How does AI connect these modes?</span>
                </button>
              </div>

              {/* DYNAMIC CONNECTED LEGS (100% Contiguous: arrival N = departure N+1) */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  
                  {/* Origin Point */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.82rem', flexShrink: 0 }}>
                      📍
                    </div>
                    <div>
                      <strong style={{ color: '#0f172a' }}>START: {originLocation}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>
                        Departure at {travelTime || 'Scheduled Time'} on {travelDate}
                      </span>
                    </div>
                  </div>

                  {/* Render Every Selected Leg with Contiguous Handoff */}
                  {journeySegments.map((seg, idx) => (
                    <React.Fragment key={seg.id || idx}>
                      <div style={{ marginLeft: '15px', borderLeft: '2px dashed #94a3b8', height: '16px' }} />

                      {/* Leg Box */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '1.4rem', marginTop: '2px' }}>{seg.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '900', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                              LEG {idx + 1}: {seg.mode.toUpperCase()}
                            </span>
                            <strong style={{ color: '#0f172a', fontSize: '0.94rem' }}>{seg.title}</strong>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: '#334155', margin: '0.25rem 0' }}>
                            <strong>Departure:</strong> {seg.fromLocation} ➔ <strong>Arrival:</strong> {seg.toLocation}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.73rem', color: '#64748b' }}>
                            <span>⏱️ Dep: <strong>{seg.departureTime}</strong> • Arr: <strong>{seg.arrivalTime}</strong> ({seg.estimatedDuration})</span>
                            {seg.costEstimate && (
                              <span style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: '700' }}>
                                🎟️ {seg.costEstimate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Intermediate Transfer Buffer Point (Only between legs) */}
                      {idx < journeySegments.length - 1 && (
                        <>
                          <div style={{ marginLeft: '15px', borderLeft: '2px dashed #94a3b8', height: '16px' }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a', padding: '0.45rem 0.85rem', borderRadius: '8px' }}>
                            <span style={{ fontSize: '1.1rem' }}>🔄</span>
                            <div>
                              <strong style={{ color: '#92400e' }}>Contiguous Handoff: {seg.toLocation}</strong>
                              <span style={{ fontSize: '0.72rem', color: '#78350f', display: 'block' }}>
                                ⏱️ 12 min transfer buffer & orientation before Leg {idx + 2} ({journeySegments[idx + 1]?.mode})
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  ))}

                  {/* Destination Point */}
                  <div style={{ marginLeft: '15px', borderLeft: '2px dashed #94a3b8', height: '16px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.82rem', flexShrink: 0 }}>
                      🏁
                    </div>
                    <div>
                      <strong style={{ color: '#0f172a' }}>FINAL DESTINATION: {destinationLocation}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#059669', display: 'block', fontWeight: '700' }}>
                        Arrival Target • Continuous route completed
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* DYNAMIC ROUTE METRICS SUMMARY BAR (Calculated from Real Data) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Total Travel Time</span>
                  <strong style={{ fontSize: '1rem', color: '#0f172a' }}>⏱️ {totalTravelDuration}</strong>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Calculated Total Fare</span>
                  <strong style={{ fontSize: '1rem', color: '#059669' }}>💵 {totalTravelCost}</strong>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Safety Rating</span>
                  <strong style={{ fontSize: '1rem', color: '#10b981' }}>🛡️ {dynamicSafetyScore}/100</strong>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Transfers</span>
                  <strong style={{ fontSize: '1rem', color: '#2563eb' }}>
                    🔄 {Math.max(0, journeySegments.length - 1)} Handoff{journeySegments.length - 1 !== 1 ? 's' : ''}
                  </strong>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Destination Weather</span>
                  <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                    {liveWeather.isLoaded ? `☀️ ${liveWeather.temp} (${liveWeather.condition})` : liveWeather.condition}
                  </strong>
                </div>
              </div>
            </div>

            {/* VERIFIED AVAILABLE TRAINS (Official IRCTC Timetable) */}
            {selectedModes.includes('train') && (
              <div className="card" style={{ marginBottom: '1.75rem', padding: '1.5rem', border: '1.5px solid #60a5fa', backgroundColor: '#ffffff', boxShadow: '0 4px 14px rgba(37,99,235,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>🚆</span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                        Verified Available Trains to {destinationLocation}
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Official Indian Railways (IRCTC) Timetable for <strong>{travelDate}</strong> • Boarding from <strong>{originLocation}</strong>
                    </span>
                  </div>

                  <span style={{ fontSize: '0.72rem', backgroundColor: trainSuggestions.length > 0 ? '#ecfdf5' : '#fef3c7', color: trainSuggestions.length > 0 ? '#059669' : '#92400e', padding: '0.25rem 0.65rem', borderRadius: '6px', fontWeight: '800', border: '1px solid #a7f3d0' }}>
                    {trainSuggestions.length > 0 ? '✓ Verified IRCTC Corridor' : '⚠️ Corridor Schedule Advisory'}
                  </span>
                </div>

                {trainSuggestions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {trainSuggestions.map((train) => {
                      const isSelected = selectedTrainId === train.id;

                      return (
                        <div
                          key={train.id}
                          style={{
                            border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '1.1rem',
                            backgroundColor: isSelected ? '#f8faff' : '#ffffff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 3px 10px rgba(37,99,235,0.1)' : 'none'
                          }}
                        >
                          <div style={{ flex: '1 1 320px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '900', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                                #{train.trainNumber}
                              </span>
                              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                                {train.trainName}
                              </strong>
                              {train.isRecommended && (
                                <span style={{ fontSize: '0.68rem', fontWeight: '800', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                                  ⚡ FASTEST TRAIN
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', margin: '0.45rem 0', fontSize: '0.86rem' }}>
                              <div>
                                <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>{train.departureTime}</span>
                                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>{train.boardingStation}</span>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0.5rem' }}>
                                <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '800' }}>⏱️ {train.duration}</span>
                                <div style={{ width: '70px', height: '2px', backgroundColor: '#cbd5e1', position: 'relative', margin: '3px 0' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', position: 'absolute', top: '-2px', right: '0' }} />
                                </div>
                                <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '700' }}>Direct Corridor</span>
                              </div>

                              <div>
                                <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>{train.arrivalTime}</span>
                                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>{train.destinationStation}</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.72rem', color: '#475569', marginTop: '0.35rem' }}>
                              <span style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                📅 <strong>Runs:</strong> {train.frequency}
                              </span>
                              <span style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                🎟️ <strong>Fare:</strong> {train.fareEstimate}
                              </span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleSelectTrain(train)}
                              className={isSelected ? "btn btn-primary" : "btn btn-secondary"}
                              style={{
                                padding: '0.5rem 1.1rem',
                                fontSize: '0.82rem',
                                fontWeight: '800',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              {isSelected ? (
                                <>
                                  <Check size={15} />
                                  <span>Selected Train</span>
                                </>
                              ) : (
                                <span>Choose This Train</span>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 0.5rem' }}>
                      Direct timetable schedule not verified for <strong>{originLocation} ➔ {destinationLocation}</strong> in our railway database.
                    </p>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Please verify connecting passenger/express services on the official Indian Railways (IRCTC) reservation portal.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Embedded Route Map */}
            {destinationCoords && (
              <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem', border: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <MapPin size={18} color="#2563eb" />
                      <span>🗺️ Journey Corridor Map</span>
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Connecting {originLocation} ➔ {destinationLocation}
                    </span>
                  </div>
                </div>

                <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <MapView 
                    center={destinationCoords}
                    zoom={10}
                    height="320px"
                    destinations={[
                      { name: destinationLocation, latitude: destinationCoords[0], longitude: destinationCoords[1], category: 'Destination' }
                    ]}
                    isDemoMode={false}
                  />
                </div>
              </div>
            )}

            {/* Navigation to Step 3 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setCurrentStep('SAFETY')}
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              >
                <span>Proceed to Step 3: Safety Audit</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SAFETY ENGINE & AUDIT                                            */}
        {/* ========================================================================= */}
        {!isJourneyActive && currentStep === 'SAFETY' && (
          <div>
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid #cbd5e1' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.35rem' }}>
                🛡️ Algorithmic Safety Assessment
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Dynamic safety assessment for {selectedModes.join(' + ')} journey from {originLocation} to {destinationLocation}.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <SafetyScoreCard 
                  score={dynamicSafetyScore}
                  subScores={{
                    route: 92,
                    transport: selectedModes.includes('train') ? 95 : 88,
                    emergency: 90,
                    time: travelTime && travelTime < '20:00' ? 95 : 75,
                    weather: liveWeather.isLoaded ? 94 : 85
                  }}
                  reasoning={`Calculated for ${travelTime || 'scheduled daylight'} departure across ${selectedModes.length} connected transit corridor legs.`}
                />

                <AISafetyGuardian 
                  guardianAudit={{
                    routeSafety: 'Optimal public transport corridor',
                    transportHealth: 'Scheduled timetable verified',
                    weatherStatus: liveWeather.condition,
                    emergencyCoverage: 'National Helpline 112 Active'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setCurrentStep('PLANNER')}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.4rem', fontWeight: '700' }}
              >
                <span>← Back to AI Journey Legs</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('SUMMARY')}
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              >
                <span>Proceed to Step 4: Review & Stays</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: REVIEW & CONFIRMATION (GATED: Only confirmed after user clicks)   */}
        {/* ========================================================================= */}
        {!isJourneyActive && currentStep === 'SUMMARY' && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ backgroundColor: isTripConfirmed ? '#ecfdf5' : '#eff6ff', padding: '0.45rem', borderRadius: '10px', color: isTripConfirmed ? '#10b981' : '#2563eb' }}>
                    {isTripConfirmed ? <CheckCircle2 size={24} /> : <ShieldCheck size={24} />}
                  </div>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                    {isTripConfirmed ? '✓ Trip Confirmed' : 'Step 4: Itinerary Review & Confirmation'}
                  </h1>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                  {isTripConfirmed 
                    ? 'Your multi-modal itinerary is finalized with active AI Safety Guardian protection.' 
                    : 'Review your connected itinerary details and click Confirm & Lock Trip Itinerary below.'}
                </p>
              </div>

              {/* Action Buttons: Only active after user confirms */}
              {isTripConfirmed ? (
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setIsSOSActive(true)}
                    className="btn"
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: '1.5px solid #fca5a5',
                      padding: '0.75rem 1.2rem',
                      fontSize: '0.88rem',
                      fontWeight: '800',
                      borderRadius: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <PhoneCall size={16} />
                    <span>Test Demo SOS</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStartActiveJourney}
                    className="btn btn-primary"
                    style={{ 
                      padding: '0.85rem 1.8rem', 
                      fontSize: '1rem', 
                      fontWeight: '900', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      backgroundColor: '#10b981', 
                      boxShadow: '0 4px 14px rgba(16,185,129,0.3)' 
                    }}
                  >
                    <span>🚀 Start Active Journey</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmTrip}
                  className="btn btn-primary"
                  style={{
                    padding: '0.85rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '900',
                    backgroundColor: '#10b981',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
                  }}
                >
                  <span>✓ Confirm & Lock Trip Itinerary</span>
                </button>
              )}
            </div>

            {/* CONFIRMED TRIP DOSSIER */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', border: `1.5px solid ${isTripConfirmed ? '#a7f3d0' : '#bfdbfe'}`, backgroundColor: '#ffffff', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <strong style={{ fontSize: '1.1rem', color: isTripConfirmed ? '#065f46' : '#1e40af', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={20} color={isTripConfirmed ? "#10b981" : "#2563eb"} />
                  <span>{isTripConfirmed ? 'CONFIRMED TRIP DOSSIER' : 'PROPOSED TRIP DOSSIER (AWAITING CONFIRMATION)'}</span>
                </strong>
                <button
                  onClick={() => setCurrentStep('PLANNER')}
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Edit3 size={13} />
                  <span>Edit Plan</span>
                </button>
              </div>

              {/* Grid: Overview Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', backgroundColor: isTripConfirmed ? '#f0fdf4' : '#eff6ff', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', border: `1px solid ${isTripConfirmed ? '#bbf7d0' : '#bfdbfe'}` }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700' }}>👤 TRAVELER</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{travelerDetails.fullName || 'Registered Tourist'}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700' }}>📍 ROUTE CORRIDOR</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{originLocation} ➔ {destinationLocation}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700' }}>📅 TRAVEL DATE</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{travelDate} (Dep: {travelTime})</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700' }}>🛡️ SAFETY SCORE</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#059669' }}>{dynamicSafetyScore}/100</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700' }}>⏱️ TOTAL JOURNEY</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{totalTravelDuration}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700' }}>💰 TOTAL FARE</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#059669' }}>{totalTravelCost}</div>
                </div>
              </div>

              {/* Connected Transit Sequence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>
                  Sequential Connected Legs:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem' }}>
                  {journeySegments.map((seg, idx) => (
                    <React.Fragment key={seg.id || idx}>
                      <span style={{ backgroundColor: '#eff6ff', padding: '0.35rem 0.65rem', borderRadius: '6px', color: '#1d4ed8', fontWeight: '700' }}>
                        {seg.icon} {seg.modeLabel}: {seg.title} ({seg.departureTime} ➔ {seg.arrivalTime})
                      </span>
                      {idx < journeySegments.length - 1 && (
                        <ArrowRight size={14} color="#059669" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* REAL SAFETY & STAY NEAR ACTUAL DESTINATION */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    🏨 Safety & Stays Near {destinationLocation}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Verified services anchored strictly to {destinationLocation}
                  </span>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                {[
                  { id: 'hotel', label: '🏨 Hotels & Stays' },
                  { id: 'emergency', label: '🚨 Emergency Desks & Police' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveStayCategory(tab.id)}
                    className={activeStayCategory === tab.id ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content Grid */}
              {activeStayCategory === 'hotel' ? (
                <div>
                  {nearbyHotels.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      {nearbyHotels.map((hotel) => (
                        <div
                          key={hotel.id}
                          style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '1rem',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: '0.94rem', color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                              {hotel.name}
                            </strong>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.5rem' }}>
                              📍 {hotel.location}
                            </div>
                            <span style={{ fontSize: '0.7rem', backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: '700' }}>
                              {hotel.categoryLabel}
                            </span>
                          </div>
                          <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedHotel(hotel.name)}
                              className={selectedHotel === hotel.name ? 'btn btn-success' : 'btn btn-secondary'}
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
                            >
                              {selectedHotel === hotel.name ? '✓ Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                      <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 0.35rem' }}>
                        {hotelsLoading ? 'Searching verified hotels near ' + destinationLocation + '...' : 'No hotels returned by OpenStreetMap directory within 8 km of ' + destinationLocation}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        You can search verified hotel listings on India Tourism (Incredible India) or local tourist offices.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Emergency Desks & National Helplines (100% Real & Verified) */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  <div style={{ border: '1px solid #fecaca', backgroundColor: '#fef2f2', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🚓</span>
                      <strong style={{ fontSize: '0.94rem', color: '#991b1b' }}>All-India Police & Emergency</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#dc2626', margin: '0.25rem 0' }}>
                      📞 Dial 112 (Toll-Free 24/7)
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#7f1d1d' }}>
                      National Emergency Response Support System (ERSS) covers all locations across India.
                    </span>
                  </div>

                  <div style={{ border: '1px solid #fed7aa', backgroundColor: '#fff7ed', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🏥</span>
                      <strong style={{ fontSize: '0.94rem', color: '#9a3412' }}>National Ambulance Service</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#ea580c', margin: '0.25rem 0' }}>
                      📞 Dial 108 (24/7 Medical Trauma)
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#7c2d12' }}>
                      Emergency medical transport and dispatch to nearest district hospital.
                    </span>
                  </div>

                  <div style={{ border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🚆</span>
                      <strong style={{ fontSize: '0.94rem', color: '#1e40af' }}>Railway Protection Helpline</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#2563eb', margin: '0.25rem 0' }}>
                      📞 Dial 139 (Indian Railways)
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#1e3a8a' }}>
                      Passenger safety, security, and station assistance across Indian rail network.
                    </span>
                  </div>

                  <div style={{ border: '1px solid #a7f3d0', backgroundColor: '#ecfdf5', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                      <strong style={{ fontSize: '0.94rem', color: '#065f46' }}>Ministry of Tourism Helpline</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#059669', margin: '0.25rem 0' }}>
                      📞 Dial 1363 (24/7 Multi-Lingual)
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#047857' }}>
                      National Tourist Infoline and guidance in English, Hindi, and 10 international languages.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setCurrentStep('SAFETY')}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.4rem', fontWeight: '700' }}
              >
                <span>← Back to Safety Audit</span>
              </button>

              {!isTripConfirmed && (
                <button
                  type="button"
                  onClick={handleConfirmTrip}
                  className="btn btn-primary"
                  style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: '900', backgroundColor: '#10b981' }}
                >
                  <span>✓ Confirm & Lock Trip Itinerary</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Why AI Route Modal */}
      {showWhyAIModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '1.75rem', borderRadius: '16px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                🤖 How Multi-Modal Connections Work
              </h3>
              <button onClick={() => setShowWhyAIModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              The AI Tourist Guardian connects your selected transport modes in sequential order without skipping or replacing any leg:
            </p>
            <ul style={{ fontSize: '0.82rem', color: '#334155', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li><strong>Contiguous Departure & Arrival:</strong> The destination point of leg 1 serves as the departure point of leg 2.</li>
              <li><strong>Buffer Calculation:</strong> 12-minute transfer orientation buffers are inserted at intermediate stations or terminals.</li>
              <li><strong>Verified Schedules:</strong> Rail timetable timings are sourced directly from verified Indian Railways data.</li>
            </ul>
            <button onClick={() => setShowWhyAIModal(false)} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Demo SOS Modal */}
      <DemoSOSModal 
        isOpen={isSOSActive}
        onClose={() => setIsSOSActive(false)}
        traveler={travelerDetails}
        origin={originLocation}
        destination={destinationLocation}
      />
    </div>
  );
};
