import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { locationService, classifyGpsAccuracy, calculateDistanceInMeters } from '../services/locationService';
import { calculateRiskScore } from '../services/riskEngine';
import { firebaseService } from '../services/firebaseService';
import { POPULAR_DESTINATIONS, INITIAL_DANGER_ZONES } from '../data/mockData';
import { playEmergencyAlarmSound } from '../services/emergencyService';

const TouristContext = createContext(null);

export const TouristProvider = ({ children }) => {
  const { currentUser, isTourist } = useAuth();

  // 1. Live GPS Telemetry
  const [telemetry, setTelemetry] = useState({
    latitude: 12.3052,
    longitude: 76.6552,
    accuracy: 12,
    speed: 0,
    heading: 0,
    movementStatus: 'GPS Standby',
    timestamp: new Date().toISOString(),
    accuracyInfo: classifyGpsAccuracy(12)
  });

  const [gpsActive, setGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  // 2. Danger Zones
  const [dangerZones, setDangerZones] = useState(INITIAL_DANGER_ZONES);

  // 3. Dynamic Risk Score & Explainable AI State
  const [riskAssessment, setRiskAssessment] = useState({
    score: 0,
    level: 'SAFE',
    subScores: { locationRisk: 0, timeRisk: 0, movementRisk: 0, routeRisk: 0, sosRisk: 0 },
    reasons: ['Optimal daylight baseline in designated tourist area'],
    nearestDangerZone: null,
    dangerZoneDistanceMeters: null
  });

  const [maxRiskScoreReached, setMaxRiskScoreReached] = useState(0);

  // 4. Trip Destinations & Active Trip State (Empty by default)
  const [tripStops, setTripStops] = useState([]);

  const [activeTrip, setActiveTrip] = useState({
    tripId: 'trip-active-001',
    title: 'Custom Multi-Modal Journey',
    status: 'NOT_STARTED', // 'NOT_STARTED' | 'ACTIVE' | 'COMPLETED'
    startTime: null,
    completedAt: null,
    travelerDetails: {
      fullName: '',
      email: '',
      contactNumber: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      emergencyRelationship: ''
    },
    journeyOrigin: '',
    journeyDestination: '',
    travelDate: '',
    travelTime: '',
    travellersCount: '',
    journeySegments: [],
    selectedTransportModes: [],
    selectedTransport: '',
    selectedTransportLabel: '',
    selectedRouteType: 'safer', // 'fastest' | 'safer'
    selectedRouteLabel: 'Recommended Safer Route',
    routeCoordinates: [],
    routeDeviationMeters: 0,
    warningsCount: 0
  });

  // Sync multi-modal journey from currentUser profile when available
  useEffect(() => {
    if (currentUser?.journeySegments && currentUser.journeySegments.length > 0) {
      setActiveTrip(prev => ({
        ...prev,
        journeySegments: currentUser.journeySegments,
        selectedTransportModes: currentUser.selectedTransportModes || prev.selectedTransportModes,
        journeyOrigin: currentUser.journeyOrigin || prev.journeyOrigin,
        journeyDestination: currentUser.journeyDestination || prev.journeyDestination,
        selectedTransport: currentUser.selectedTransport || prev.selectedTransport,
        selectedTransportLabel: currentUser.selectedTransportLabel || prev.selectedTransportLabel
      }));
    }
  }, [currentUser]);

  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [tripHistory, setTripHistory] = useState([]);
  const [lastCompletedTripSummary, setLastCompletedTripSummary] = useState(null);

  // 5. Emergency SOS State
  const [sosActive, setSosActive] = useState(false);
  const [activeSOSEvent, setActiveSOSEvent] = useState(null);

  // Load trip history when tourist changes
  useEffect(() => {
    if (currentUser?.touristId) {
      const history = firebaseService.getTouristTripHistory(currentUser.touristId);
      setTripHistory(history);
    }
  }, [currentUser?.touristId]);

  // Subscribe to Danger Zones
  useEffect(() => {
    const unsub = firebaseService.subscribeDangerZones((zones) => {
      setDangerZones(zones);
    });
    return () => unsub();
  }, []);

  // Sync SOS status with current tourist profile
  useEffect(() => {
    if (currentUser?.touristId) {
      const unsub = firebaseService.subscribeTourists((tourists) => {
        const me = tourists.find(t => t.touristId === currentUser.touristId || t.touristTag === currentUser.touristTag);
        if (me) {
          if (me.sosActive !== sosActive) {
            setSosActive(Boolean(me.sosActive));
            setActiveSOSEvent(me.sosEvent || null);
          }
          if (me.tripStatus && me.tripStatus !== activeTrip.status) {
            setActiveTrip(prev => ({ ...prev, status: me.tripStatus }));
          }
        }
      });
      return () => unsub();
    }
  }, [currentUser?.touristId, sosActive, activeTrip.status]);

  // Start Real-Time GPS Tracking
  useEffect(() => {
    if (!isTourist) return;

    setGpsActive(true);
    const watchId = locationService.startWatching(
      (newTelemetry) => {
        setTelemetry(newTelemetry);
        setGpsError(null);
      },
      (err) => {
        setGpsError(err.message);
      }
    );

    return () => {
      locationService.stopWatching();
      setGpsActive(false);
    };
  }, [isTourist]);

  // Calculate Route Deviation (Cross-Track Distance to planned route geometry)
  const calculateRouteDeviation = (lat, lng, routeCoords) => {
    if (!routeCoords || routeCoords.length < 2) return 0;
    let minDistanceToRoute = Infinity;
    for (const pt of routeCoords) {
      const d = calculateDistanceInMeters(lat, lng, pt[0], pt[1]);
      if (d < minDistanceToRoute) minDistanceToRoute = d;
    }
    return minDistanceToRoute === Infinity ? 0 : Math.round(minDistanceToRoute);
  };

  // Re-calculate Risk Score when telemetry, danger zones, or SOS changes
  useEffect(() => {
    const currentDeviation = activeTrip.status === 'ACTIVE' && activeTrip.routeCoordinates.length > 0
      ? calculateRouteDeviation(telemetry.latitude, telemetry.longitude, activeTrip.routeCoordinates)
      : activeTrip.routeDeviationMeters || 0;

    const assessment = calculateRiskScore({
      touristLat: telemetry.latitude,
      touristLng: telemetry.longitude,
      dangerZones,
      routeDeviationMeters: currentDeviation,
      movementStatus: telemetry.movementStatus,
      speed: telemetry.speed,
      sosActive,
      gpsAccuracy: telemetry.accuracy,
      currentTime: new Date()
    });

    setRiskAssessment(assessment);

    // Track Maximum Risk Score
    if (assessment.score > maxRiskScoreReached) {
      setMaxRiskScoreReached(assessment.score);
    }

    // Sync updated telemetry to Firebase Firestore & Authority stream
    if (currentUser?.touristId && currentUser.role === 'tourist') {
      firebaseService.updateTouristTelemetry(currentUser.touristId, {
        latitude: telemetry.latitude,
        longitude: telemetry.longitude,
        gpsAccuracy: telemetry.accuracy,
        speed: telemetry.speed,
        heading: telemetry.heading,
        movementStatus: telemetry.movementStatus,
        safetyStatus: assessment.level,
        riskScore: assessment.score,
        dangerZoneDistance: assessment.nearestDangerZone 
          ? `${Math.round(assessment.dangerZoneDistanceMeters || 0)}m to ${assessment.nearestDangerZone.name}`
          : 'Safe Distance (>1.5 km)',
        routeDeviation: currentDeviation > 50 ? `${currentDeviation}m deviation` : 'None',
        selectedTransport: activeTrip.selectedTransport || 'NOT_SELECTED',
        tripStatus: activeTrip.status || 'NOT_STARTED',
        aiRiskFactors: assessment.reasons
      });
    }
  }, [
    telemetry.latitude,
    telemetry.longitude,
    telemetry.speed,
    telemetry.movementStatus,
    dangerZones,
    sosActive,
    activeTrip.status,
    activeTrip.routeCoordinates,
    activeTrip.selectedTransport,
    currentUser?.touristId
  ]);

  // 6. Trip Itinerary Actions
  const addStopToTrip = (place) => {
    if (!tripStops.some(s => s.name.toLowerCase() === place.name.toLowerCase())) {
      setTripStops(prev => [...prev, place]);
    }
  };

  const removeStopFromTrip = (index) => {
    setTripStops(prev => prev.filter((_, i) => i !== index));
  };

  const moveStopOrder = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= tripStops.length) return;
    const updated = [...tripStops];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setTripStops(updated);
  };

  const clearTripStops = () => {
    setTripStops([]);
    setGeneratedItinerary(null);
  };

  const generateAIItinerary = () => {
    if (tripStops.length === 0) return null;

    const startTimeHour = 9; // 09:00 AM
    let currentHour = startTimeHour;
    const scheduleItems = [];

    tripStops.forEach((stop, index) => {
      const timeString = `${String(Math.floor(currentHour)).padStart(2, '0')}:${currentHour % 1 !== 0 ? '30' : '00'}`;
      scheduleItems.push({
        time: timeString,
        title: stop.name,
        category: stop.category,
        location: stop.location,
        type: 'VISIT',
        durationHours: 1.5,
        notes: stop.description || 'Sightseeing & heritage exploration'
      });

      currentHour += 1.5;

      // Add lunch break around 1:00 PM
      if (index === 1 && currentHour >= 12.5 && currentHour <= 14) {
        scheduleItems.push({
          time: '13:00',
          title: 'Lunch & Rest (Mylari Heritage Dining)',
          category: 'Dining & Relaxation',
          location: 'City Center Dining Hub',
          type: 'DINING',
          durationHours: 1.0,
          notes: 'Authentic regional meal & hydration rest'
        });
        currentHour += 1.0;
      }

      // Add transit leg
      if (index < tripStops.length - 1) {
        scheduleItems.push({
          time: `${String(Math.floor(currentHour)).padStart(2, '0')}:${currentHour % 1 !== 0 ? '30' : '00'}`,
          title: `Scenic Transit to ${tripStops[index + 1].name}`,
          category: 'Safety-Monitored Travel',
          location: 'Optimized Illuminated Corridor',
          type: 'TRANSIT',
          durationHours: 0.5,
          notes: 'AI-monitored safe transit corridor'
        });
        currentHour += 0.5;
      }
    });

    const itinerary = {
      generatedAt: new Date().toISOString(),
      stopsCount: tripStops.length,
      estimatedTotalHours: (currentHour - startTimeHour).toFixed(1),
      schedule: scheduleItems,
      label: 'AI-assisted itinerary recommendation'
    };

    setGeneratedItinerary(itinerary);
    return itinerary;
  };

  // 7. START TRIP Action (Validates, creates Firestore trip record, starts active tracking)
  const startTrip = async (tripConfig = {}) => {
    const tripId = `trip-${Date.now()}`;
    const newTrip = {
      tripId,
      touristId: currentUser?.touristId || 'TG-2026-104921',
      touristTag: currentUser?.touristTag || currentUser?.touristId || 'TG-2026-104921',
      title: tripConfig.title || (tripStops[0] ? `Trip to ${tripStops[0].name}` : 'Karnataka Tour'),
      startTime: new Date().toISOString(),
      startLocation: {
        name: 'Current Live GPS Location',
        latitude: telemetry.latitude,
        longitude: telemetry.longitude
      },
      destinations: tripStops,
      journeyOrigin: tripConfig.journeyOrigin || activeTrip.journeyOrigin || currentUser?.journeyOrigin || 'Bengaluru City Center',
      journeyDestination: tripConfig.journeyDestination || activeTrip.journeyDestination || currentUser?.journeyDestination || 'Mysuru Palace',
      journeySegments: tripConfig.journeySegments || activeTrip.journeySegments || currentUser?.journeySegments || [],
      selectedTransportModes: tripConfig.selectedTransportModes || activeTrip.selectedTransportModes || currentUser?.selectedTransportModes || [],
      selectedTransport: tripConfig.selectedTransport || activeTrip.selectedTransport || (tripConfig.journeySegments?.length > 0 ? tripConfig.journeySegments[tripConfig.journeySegments.length - 1].mode : 'walking'),
      selectedTransportLabel: tripConfig.selectedTransportLabel || activeTrip.selectedTransportLabel || 'Multi-Modal Journey',
      selectedRoute: tripConfig.selectedRouteLabel || 'Recommended Safer Route',
      selectedRouteType: tripConfig.selectedRouteType || 'safer',
      routeCoordinates: tripConfig.routeCoordinates || [],
      tripStatus: 'ACTIVE',
      riskScore: riskAssessment.score,
      maxRiskScore: riskAssessment.score
    };

    const savedTrip = await firebaseService.createTripRecord(newTrip);
    setActiveTrip({
      ...newTrip,
      status: 'ACTIVE',
      routeDeviationMeters: 0,
      warningsCount: 0
    });
    setMaxRiskScoreReached(riskAssessment.score);

    return savedTrip;
  };

  // 8. COMPLETE TRIP Action (Stops active tracking, generates summary, saves to Firestore)
  const completeTrip = async () => {
    const summary = await firebaseService.completeTripRecord(activeTrip.tripId, {
      touristId: currentUser?.touristId,
      maxRiskScore: maxRiskScoreReached,
      warningsCount: activeTrip.warningsCount || 0,
      emergencyEventsCount: sosActive ? 1 : 0
    });

    setActiveTrip(prev => ({
      ...prev,
      status: 'COMPLETED',
      completedAt: new Date().toISOString()
    }));

    setLastCompletedTripSummary(summary);
    if (currentUser?.touristId) {
      const updatedHistory = firebaseService.getTouristTripHistory(currentUser.touristId);
      setTripHistory(updatedHistory);
    }

    return summary;
  };

  // 9. SOS Emergency Trigger & Resolve
  const triggerSOS = async (customMessage = '') => {
    playEmergencyAlarmSound();
    setSosActive(true);

    const payload = {
      touristId: currentUser?.touristId || 'TG-2026-104921',
      touristTag: currentUser?.touristTag || currentUser?.touristId || 'TG-2026-104921',
      touristName: currentUser?.name || 'Aarav Sharma',
      mobile: currentUser?.mobile || '+91 98765 43210',
      latitude: telemetry.latitude,
      longitude: telemetry.longitude,
      gpsAccuracy: telemetry.accuracy,
      message: customMessage || 'Urgent SOS triggered from Tourist Safety interface'
    };

    const { sosEvent } = await firebaseService.triggerSOS(payload);
    setActiveSOSEvent(sosEvent);
  };

  const resolveOrCancelSOS = async () => {
    if (currentUser?.touristId) {
      await firebaseService.updateSOSStatus(currentUser.touristId, 'RESOLVED', 'Cancelled by tourist');
    }
    setSosActive(false);
    setActiveSOSEvent(null);
  };

  // 10. Demo Simulator Triggers
  const simulateMoveToHazard = () => {
    setTelemetry(prev => ({
      ...prev,
      latitude: 12.2852,
      longitude: 76.6708,
      movementStatus: 'Moving (Approaching Hazard)',
      speed: 18.5,
      accuracy: 8
    }));
  };

  const simulateSafeReturn = () => {
    setTelemetry(prev => ({
      ...prev,
      latitude: 12.3052,
      longitude: 76.6552,
      movementStatus: 'Moving (Heritage Safe Zone)',
      speed: 3.8,
      accuracy: 6
    }));
  };

  const simulateRouteDeviation = () => {
    setActiveTrip(prev => ({
      ...prev,
      routeDeviationMeters: 280,
      warningsCount: (prev.warningsCount || 0) + 1
    }));
  };

  return (
    <TouristContext.Provider
      value={{
        telemetry,
        gpsActive,
        gpsError,
        dangerZones,
        riskAssessment,
        tripStops,
        addStopToTrip,
        removeStopFromTrip,
        moveStopOrder,
        clearTripStops,
        activeTrip,
        setActiveTrip,
        startTrip,
        completeTrip,
        tripHistory,
        lastCompletedTripSummary,
        generatedItinerary,
        generateAIItinerary,
        sosActive,
        activeSOSEvent,
        triggerSOS,
        resolveOrCancelSOS,
        simulateMoveToHazard,
        simulateSafeReturn,
        simulateRouteDeviation
      }}
    >
      {children}
    </TouristContext.Provider>
  );
};

export const useTourist = () => {
  const context = useContext(TouristContext);
  if (!context) throw new Error('useTourist must be used within a TouristProvider');
  return context;
};
