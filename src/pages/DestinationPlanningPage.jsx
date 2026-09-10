import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTourist } from '../context/TouristContext';
import { useAuth } from '../context/AuthContext';
import { 
  User, Phone, Mail, HeartHandshake, MapPin, Calendar, Clock, 
  Users, Route, ArrowRight, ArrowUp, ArrowDown, Check, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/mockData';
import { smartTransportSuggestionService } from '../services/smartTransportSuggestionService';
import { AIProcessingModal } from '../components/AIProcessingModal';

export const DestinationPlanningPage = () => {
  const { activeTrip, setActiveTrip, setTripStops } = useTourist();
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [targetStep, setTargetStep] = useState('PLANNER');

  // 1. Personal Details
  const [fullName, setFullName] = useState(activeTrip?.travelerDetails?.fullName || currentUser?.name || '');
  const [email, setEmail] = useState(activeTrip?.travelerDetails?.email || currentUser?.email || '');
  const [contactNumber, setContactNumber] = useState(activeTrip?.travelerDetails?.contactNumber || currentUser?.mobile || '');

  // 2. Emergency Details
  const [emergencyContactName, setEmergencyContactName] = useState(activeTrip?.travelerDetails?.emergencyContactName || currentUser?.emergencyContact || '');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(activeTrip?.travelerDetails?.emergencyContactNumber || currentUser?.emergencyContactNumber || '');
  const [emergencyRelationship, setEmergencyRelationship] = useState(activeTrip?.travelerDetails?.emergencyRelationship || currentUser?.emergencyRelationship || '');

  // 3. Destination & Travel Details
  const [startingLocation, setStartingLocation] = useState(activeTrip?.journeyOrigin || 'Bengaluru City Center');
  const [finalDestination, setFinalDestination] = useState(activeTrip?.journeyDestination || '');
  const [travelDate, setTravelDate] = useState(activeTrip?.travelDate || '');
  const [travelTime, setTravelTime] = useState(activeTrip?.travelTime || '09:15');
  const [travellersCount, setTravellersCount] = useState(
    activeTrip?.travellersCount ? String(activeTrip.travellersCount) : '2'
  );

  // 4. Transport Modes
  const [selectedModes, setSelectedModes] = useState(
    activeTrip?.selectedTransportModes?.length ? activeTrip.selectedTransportModes : ['train', 'walking']
  );

  // Read destination and origin from URL parameters and sync defaults
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destParam = params.get('destination');
    const originParam = params.get('origin');

    if (destParam) {
      setFinalDestination(destParam);
    }
    if (originParam) {
      setStartingLocation(originParam);
    }

    // Default travel date to tomorrow if not set
    if (!travelDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setTravelDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [location.search]);

  // Validation & Error States
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const transportOptions = [
    { 
      id: 'car', 
      label: 'Own Car', 
      icon: '🚗', 
      sublabel: 'Self-drive expressway & highway road corridor',
      speed: '~50-80 km/h'
    },
    { 
      id: 'train', 
      label: 'Train', 
      icon: '🚆', 
      sublabel: 'Express & high-speed rail transit corridor',
      speed: '~90-130 km/h'
    },
    { 
      id: 'flight', 
      label: 'Airplane', 
      icon: '✈️', 
      sublabel: 'Domestic airline flight corridor between airports',
      speed: '~550-700 km/h'
    },
    { 
      id: 'bus', 
      label: 'Bus', 
      icon: '🚌', 
      sublabel: 'State transport & AC tourist coach transit',
      speed: '~40-60 km/h'
    },
    { 
      id: 'taxi', 
      label: 'Taxi / Cab', 
      icon: '🚕', 
      sublabel: 'Verified on-demand tourist cab with driver check',
      speed: '~45-70 km/h'
    },
    { 
      id: 'walking', 
      label: 'Walking', 
      icon: '🚶', 
      sublabel: 'Pedestrian tourist promenade & heritage walking trail',
      speed: '~4-5 km/h'
    }
  ];

  // Toggle transport mode selection
  const handleToggleMode = (modeId) => {
    setErrors(prev => ({ ...prev, selectedModes: '' }));
    setGeneralError('');

    if (selectedModes.includes(modeId)) {
      setSelectedModes(selectedModes.filter(m => m !== modeId));
    } else {
      setSelectedModes([...selectedModes, modeId]);
    }
  };

  // Reorder transport modes in the journey chain
  const handleMoveModeUp = (idx, e) => {
    e.stopPropagation();
    if (idx <= 0) return;
    const copy = [...selectedModes];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setSelectedModes(copy);
  };

  const handleMoveModeDown = (idx, e) => {
    e.stopPropagation();
    if (idx >= selectedModes.length - 1) return;
    const copy = [...selectedModes];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setSelectedModes(copy);
  };

  // Quick Fill SIH Hackathon Demo Data
  const handleQuickFillDemoData = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    setFullName('Demo Traveler');
    setEmail('traveler@example.com');
    setContactNumber('+91 98765 43210');
    setEmergencyContactName('Jane Doe');
    setEmergencyContactNumber('+91 98765 43211');
    setEmergencyRelationship('Sister');
    setStartingLocation('Bengaluru City Center');
    setFinalDestination('Mysuru Palace');
    setTravelDate(tomorrowStr);
    setTravelTime('09:15');
    setTravellersCount('2');
    setSelectedModes(['train', 'walking']);
    setErrors({});
    setGeneralError('');
  };

  // Comprehensive Form Validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Traveler Details
    if (!fullName.trim()) newErrors.fullName = 'Please enter your full name.';
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!contactNumber.trim()) newErrors.contactNumber = 'Please enter your contact number.';

    // 2. Emergency Contact Details
    if (!emergencyContactName.trim()) newErrors.emergencyContactName = 'Please enter emergency contact name.';
    if (!emergencyContactNumber.trim()) newErrors.emergencyContactNumber = 'Please enter emergency contact number.';
    if (!emergencyRelationship.trim()) newErrors.emergencyRelationship = 'Please specify relationship (e.g. Sister, Parent, Friend).';

    // 3. Destination Details
    if (!startingLocation.trim()) newErrors.startingLocation = 'Please enter your starting location.';
    if (!finalDestination.trim()) newErrors.finalDestination = 'Please enter your final destination.';
    if (!travelDate.trim()) {
      newErrors.travelDate = 'Please select your travel date.';
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      if (travelDate < todayStr) {
        newErrors.travelDate = 'Travel date cannot be in the past.';
      }
    }
    if (!travelTime.trim()) newErrors.travelTime = 'Please select preferred departure time.';
    if (!travellersCount.trim() || parseInt(travellersCount, 10) < 1) {
      newErrors.travellersCount = 'Enter at least 1 traveler.';
    }

    // 4. Transport Modes
    if (selectedModes.length === 0) {
      newErrors.selectedModes = 'Please select at least one transport mode for your journey.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      setGeneralError(firstError);
      return false;
    }

    setGeneralError('');
    return true;
  };

  // Commit journey plan to state
  const commitJourneyPlan = () => {
    setIsProcessingAI(false);
    const effectiveDate = travelDate.trim() || new Date().toISOString().split('T')[0];
    const effectiveTime = travelTime.trim() || '09:15';
    const countNum = parseInt(travellersCount, 10) || 1;
    const origin = startingLocation.trim() || 'Bengaluru City Center';
    const dest = finalDestination.trim() || 'Mysuru Palace';
    const modes = selectedModes.length > 0 ? selectedModes : ['train', 'walking'];

    // Set trip stop for destination
    const destStop = {
      id: 'dest-' + Date.now(),
      name: dest,
      location: dest,
      category: 'Destination Landmark',
      latitude: null,
      longitude: null
    };

    setTripStops([destStop]);

    const travelerPayload = {
      fullName: fullName.trim() || currentUser?.name || 'Demo Traveler',
      email: email.trim() || currentUser?.email || 'traveler@example.com',
      contactNumber: contactNumber.trim() || currentUser?.mobile || '+91 98765 43210',
      emergencyContactName: emergencyContactName.trim() || currentUser?.emergencyContact || 'Jane Doe',
      emergencyContactNumber: emergencyContactNumber.trim() || currentUser?.emergencyContactNumber || '+91 98765 43211',
      emergencyRelationship: emergencyRelationship.trim() || currentUser?.emergencyRelationship || 'Sister',
      emergencyDisplay: emergencyContactName.trim()
        ? `${emergencyContactName.trim()} (${emergencyRelationship.trim() || 'Contact'}) • ${emergencyContactNumber.trim()}`
        : 'Jane Doe (Sister) • +91 98765 43211'
    };

    const journeyChain = smartTransportSuggestionService.buildConnectedMultiModalJourney({
      originLocation: origin,
      destinationLocation: dest,
      travelDate: effectiveDate,
      preferredTime: effectiveTime,
      selectedModes: modes,
      travellersCount: countNum
    });

    const finalMode = journeyChain.finalMode || modes[modes.length - 1] || 'walking';
    const journeySummary = journeyChain.journeySummary || modes.map(m => transportOptions.find(t => t.id === m)?.label || m).join(' ➔ ');

    // Save all parameters into activeTrip in TouristContext (status: 'PLANNING', not confirmed yet)
    setActiveTrip(prev => ({
      ...prev,
      travelerDetails: travelerPayload,
      journeyOrigin: origin,
      journeyDestination: dest,
      travelDate: effectiveDate,
      travelTime: effectiveTime,
      travellersCount: countNum,
      selectedTransportModes: modes,
      journeySegments: journeyChain.segments,
      selectedTransport: finalMode,
      selectedTransportLabel: journeySummary,
      title: `Multi-Modal Journey to ${dest}`,
      status: prev?.status === 'CONFIRMED' ? 'CONFIRMED' : 'PLANNING'
    }));

    // Also sync to currentUser profile if available
    if (updateProfile) {
      updateProfile({
        name: travelerPayload.fullName,
        email: travelerPayload.email,
        mobile: travelerPayload.contactNumber,
        emergencyContact: travelerPayload.emergencyContactName,
        emergencyContactNumber: travelerPayload.emergencyContactNumber,
        emergencyRelationship: travelerPayload.emergencyRelationship,
        journeyOrigin: origin,
        journeyDestination: dest,
        selectedTransportModes: modes,
        travellersCount: countNum
      });
    }

    navigate(`/trip-planner?step=${targetStep || 'PLANNER'}`);
  };

  // Handle Next button click: Open AI Processing Animation then navigate
  const handleProceedToTripPlanner = (e) => {
    if (e) e.preventDefault();

    const hasOrigin = Boolean(startingLocation.trim());
    const hasDest = Boolean(finalDestination.trim());
    const hasModes = selectedModes.length > 0;
    const hasName = Boolean(fullName.trim());

    // If any critical inputs are missing, smoothly auto-populate demo defaults and proceed
    if (!hasOrigin || !hasDest || !hasModes || !hasName) {
      handleStepClick('PLANNER');
      return;
    }

    setTargetStep('PLANNER');
    setIsProcessingAI(true);
  };

  // Direct Interactive Navigation for all 4 Step Buttons
  const handleStepClick = (step) => {
    if (step === 'DETAILS') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setTargetStep(step);

    const hasOrigin = Boolean(startingLocation.trim());
    const hasDest = Boolean(finalDestination.trim());
    const hasModes = selectedModes.length > 0;

    // If inputs are empty, auto-populate SIH hackathon demo data so the user can freely explore the full chain
    if (!hasOrigin || !hasDest || !hasModes) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const effectiveOrigin = startingLocation.trim() || 'Bengaluru City Center';
      const effectiveDest = finalDestination.trim() || 'Mysuru Palace';
      const effectiveDate = travelDate.trim() || tomorrowStr;
      const effectiveTime = travelTime.trim() || '09:15';
      const effectiveModes = hasModes ? selectedModes : ['train', 'walking'];
      const effectiveCount = parseInt(travellersCount, 10) || 2;

      const travelerPayload = {
        fullName: fullName.trim() || currentUser?.name || 'Demo Traveler',
        email: email.trim() || currentUser?.email || 'traveler@example.com',
        contactNumber: contactNumber.trim() || currentUser?.mobile || '+91 98765 43210',
        emergencyContactName: emergencyContactName.trim() || currentUser?.emergencyContact || 'Jane Doe',
        emergencyContactNumber: emergencyContactNumber.trim() || currentUser?.emergencyContactNumber || '+91 98765 43211',
        emergencyRelationship: emergencyRelationship.trim() || currentUser?.emergencyRelationship || 'Sister',
        emergencyDisplay: 'Jane Doe (Sister) • +91 98765 43211'
      };

      setFullName(travelerPayload.fullName);
      setEmail(travelerPayload.email);
      setContactNumber(travelerPayload.contactNumber);
      setEmergencyContactName(travelerPayload.emergencyContactName);
      setEmergencyContactNumber(travelerPayload.emergencyContactNumber);
      setEmergencyRelationship(travelerPayload.emergencyRelationship);
      setStartingLocation(effectiveOrigin);
      setFinalDestination(effectiveDest);
      setTravelDate(effectiveDate);
      setTravelTime(effectiveTime);
      setTravellersCount(String(effectiveCount));
      setSelectedModes(effectiveModes);

      const destStop = {
        id: 'dest-' + Date.now(),
        name: effectiveDest,
        location: effectiveDest,
        category: 'Destination Landmark',
        latitude: null,
        longitude: null
      };
      setTripStops([destStop]);

      const journeyChain = smartTransportSuggestionService.buildConnectedMultiModalJourney({
        originLocation: effectiveOrigin,
        destinationLocation: effectiveDest,
        travelDate: effectiveDate,
        preferredTime: effectiveTime,
        selectedModes: effectiveModes,
        travellersCount: effectiveCount
      });

      const finalMode = journeyChain.finalMode || effectiveModes[effectiveModes.length - 1] || 'walking';
      const journeySummary = journeyChain.journeySummary || effectiveModes.map(m => transportOptions.find(t => t.id === m)?.label || m).join(' ➔ ');

      setActiveTrip(prev => ({
        ...prev,
        travelerDetails: travelerPayload,
        journeyOrigin: effectiveOrigin,
        journeyDestination: effectiveDest,
        travelDate: effectiveDate,
        travelTime: effectiveTime,
        travellersCount: effectiveCount,
        selectedTransportModes: effectiveModes,
        journeySegments: journeyChain.segments,
        selectedTransport: finalMode,
        selectedTransportLabel: journeySummary,
        title: `Multi-Modal Journey to ${effectiveDest}`,
        status: prev?.status === 'CONFIRMED' ? 'CONFIRMED' : 'PLANNING'
      }));

      navigate(`/trip-planner?step=${step}`);
      return;
    }

    setIsProcessingAI(true);
  };

  // Helper to determine if dynamic journey preview is eligible
  const isChainPreviewReady = startingLocation.trim() && finalDestination.trim() && selectedModes.length > 0;

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2.5rem 1rem 5rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom" style={{ maxWidth: '860px' }}>
        
        {/* 4-Step Interactive Progression Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
          {/* 1. Trip Details (Active) */}
          <button
            type="button"
            onClick={() => handleStepClick('DETAILS')}
            title="Current step: Traveler Details & Trip Planning"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#eff6ff', 
              padding: '0.75rem 0.95rem', 
              borderRadius: '12px', 
              border: '2px solid #2563eb', 
              boxShadow: '0 4px 12px rgba(37,99,235,0.12)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', flexShrink: 0 }}>
              1
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '0.86rem', color: '#1d4ed8', display: 'block' }}>Trip Details</strong>
                <span style={{ fontSize: '0.62rem', backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>Active</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Traveler & destinations</span>
            </div>
          </button>

          {/* 2. AI Journey */}
          <button
            type="button"
            onClick={() => handleStepClick('PLANNER')}
            title="Click to view Step 2: AI Journey (Multi-modal chain)"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#ffffff', 
              padding: '0.75rem 0.95rem', 
              borderRadius: '12px', 
              border: '1.5px solid #cbd5e1', 
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', flexShrink: 0, border: '1.5px solid #bfdbfe' }}>
              2
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>AI Journey</strong>
                <span style={{ fontSize: '0.62rem', color: '#2563eb', fontWeight: '700' }}>Open ➔</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Multi-modal chain</span>
            </div>
          </button>

          {/* 3. Safety Check */}
          <button
            type="button"
            onClick={() => handleStepClick('SAFETY')}
            title="Click to view Step 3: Safety Check (Risk & route audit)"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#ffffff', 
              padding: '0.75rem 0.95rem', 
              borderRadius: '12px', 
              border: '1.5px solid #cbd5e1', 
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', flexShrink: 0, border: '1.5px solid #bfdbfe' }}>
              3
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>Safety Check</strong>
                <span style={{ fontSize: '0.62rem', color: '#2563eb', fontWeight: '700' }}>Audit ➔</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Risk & route audit</span>
            </div>
          </button>

          {/* 4. Confirmation */}
          <button
            type="button"
            onClick={() => handleStepClick('SUMMARY')}
            title="Click to view Step 4: Confirmation (Safety & stay dossier)"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#ffffff', 
              padding: '0.75rem 0.95rem', 
              borderRadius: '12px', 
              border: '1.5px solid #cbd5e1', 
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(16,185,129,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', flexShrink: 0, border: '1.5px solid #bbf7d0' }}>
              4
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>Confirmation</strong>
                <span style={{ fontSize: '0.62rem', color: '#059669', fontWeight: '700' }}>Review ➔</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Safety & stay dossier</span>
            </div>
          </button>
        </div>

        {/* Page Header with SIH Hackathon Demo Quick-Fill */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '0.45rem', borderRadius: '10px', color: '#2563eb' }}>
                <Shield size={24} />
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                Traveler Details & Trip Planning
              </h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
              Enter your personal and emergency details, specify your trip destination and timeline, and choose your transport modes.
            </p>
          </div>

          {/* SIH Hackathon Quick Demo Button */}
          <button
            type="button"
            onClick={handleQuickFillDemoData}
            className="btn"
            style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: '1.5px solid #f59e0b',
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(245,158,11,0.15)'
            }}
          >
            <span>⚡ Quick Fill SIH Demo Data</span>
          </button>
        </div>

        {/* Validation Error Alert Banner */}
        {generalError && (
          <div style={{ backgroundColor: '#fef2f2', border: '1.5px solid #f87171', color: '#b91c1c', padding: '0.85rem 1.25rem', borderRadius: '10px', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', fontWeight: '600', boxShadow: '0 2px 6px rgba(239,68,68,0.1)' }}>
            <AlertCircle size={20} color="#dc2626" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Pre-selected Destination Banner if routed from destination cards */}
        {finalDestination && (
          <div style={{ backgroundColor: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: '12px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#1d4ed8', display: 'block' }}>Destination Selected: {finalDestination}</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Ready to plan your multi-modal route and predictive safety audit.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleProceedToTripPlanner}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
            >
              <span>Instant AI Plan ➔</span>
            </button>
          </div>
        )}

        <form onSubmit={handleProceedToTripPlanner} noValidate>

          {/* ========================================================================= */}
          {/* STEP 2: TRAVELER DETAILS FORM                                             */}
          {/* ========================================================================= */}
          <div className="card" style={{ marginBottom: '1.75rem', padding: '1.5rem', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.6rem', borderBottom: '1px solid #f1f5f9' }}>
              <User size={20} color="#2563eb" />
              <span>Step 2: Traveler Details Form</span>
            </h3>

            {/* A. PERSONAL DETAILS */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
                Personal Details:
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {/* Full Name */}
                <div>
                  <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); setErrors(prev => ({ ...prev, fullName: '' })); }}
                      placeholder="Enter your full name"
                      className="form-input"
                      style={{ 
                        paddingLeft: '2.4rem',
                        border: errors.fullName ? '1.5px solid #ef4444' : undefined,
                        backgroundColor: errors.fullName ? '#fef2f2' : '#ffffff'
                      }}
                    />
                  </div>
                  {errors.fullName && (
                    <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                      placeholder="Enter your email address"
                      className="form-input"
                      style={{ 
                        paddingLeft: '2.4rem',
                        border: errors.email ? '1.5px solid #ef4444' : undefined,
                        backgroundColor: errors.email ? '#fef2f2' : '#ffffff'
                      }}
                    />
                  </div>
                  {errors.email && (
                    <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                    Contact Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => { setContactNumber(e.target.value); setErrors(prev => ({ ...prev, contactNumber: '' })); }}
                      placeholder="Enter your contact number"
                      className="form-input"
                      style={{ 
                        paddingLeft: '2.4rem',
                        border: errors.contactNumber ? '1.5px solid #ef4444' : undefined,
                        backgroundColor: errors.contactNumber ? '#fef2f2' : '#ffffff'
                      }}
                    />
                  </div>
                  {errors.contactNumber && (
                    <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                      {errors.contactNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* B. EMERGENCY DETAILS */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <HeartHandshake size={16} />
                <span>Emergency Details:</span>
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {/* Emergency Contact Name */}
                <div>
                  <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => { setEmergencyContactName(e.target.value); setErrors(prev => ({ ...prev, emergencyContactName: '' })); }}
                    placeholder="Enter emergency contact name"
                    className="form-input"
                    style={{ 
                      border: errors.emergencyContactName ? '1.5px solid #ef4444' : undefined,
                      backgroundColor: errors.emergencyContactName ? '#fef2f2' : '#ffffff'
                    }}
                  />
                  {errors.emergencyContactName && (
                    <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                      {errors.emergencyContactName}
                    </span>
                  )}
                </div>

                {/* Emergency Contact Number */}
                <div>
                  <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                    Emergency Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={emergencyContactNumber}
                    onChange={(e) => { setEmergencyContactNumber(e.target.value); setErrors(prev => ({ ...prev, emergencyContactNumber: '' })); }}
                    placeholder="Enter emergency contact number"
                    className="form-input"
                    style={{ 
                      border: errors.emergencyContactNumber ? '1.5px solid #ef4444' : undefined,
                      backgroundColor: errors.emergencyContactNumber ? '#fef2f2' : '#ffffff'
                    }}
                  />
                  {errors.emergencyContactNumber && (
                    <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                      {errors.emergencyContactNumber}
                    </span>
                  )}
                </div>

                {/* Relationship */}
                <div>
                  <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                    Relationship *
                  </label>
                  <input
                    type="text"
                    value={emergencyRelationship}
                    onChange={(e) => { setEmergencyRelationship(e.target.value); setErrors(prev => ({ ...prev, emergencyRelationship: '' })); }}
                    placeholder="Enter relationship"
                    className="form-input"
                    style={{ 
                      border: errors.emergencyRelationship ? '1.5px solid #ef4444' : undefined,
                      backgroundColor: errors.emergencyRelationship ? '#fef2f2' : '#ffffff'
                    }}
                  />
                  {errors.emergencyRelationship && (
                    <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                      {errors.emergencyRelationship}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 3: DESTINATION AND TRAVEL DETAILS                                    */}
          {/* ========================================================================= */}
          <div className="card" style={{ marginBottom: '1.75rem', padding: '1.5rem', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.6rem', borderBottom: '1px solid #f1f5f9' }}>
              <MapPin size={20} color="#2563eb" />
              <span>Step 3: Destination and Travel Details</span>
            </h3>

            {/* Starting Location and Final Destination */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                  Starting Location *
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="#2563eb" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={startingLocation}
                    onChange={(e) => { setStartingLocation(e.target.value); setErrors(prev => ({ ...prev, startingLocation: '' })); }}
                    placeholder="Enter your starting location"
                    className="form-input"
                    style={{ 
                      paddingLeft: '2.4rem',
                      border: errors.startingLocation ? '1.5px solid #ef4444' : undefined,
                      backgroundColor: errors.startingLocation ? '#fef2f2' : '#ffffff'
                    }}
                  />
                </div>
                {errors.startingLocation && (
                  <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                    {errors.startingLocation}
                  </span>
                )}
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                  Final Destination *
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="#10b981" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={finalDestination}
                    onChange={(e) => { setFinalDestination(e.target.value); setErrors(prev => ({ ...prev, finalDestination: '' })); }}
                    placeholder="Enter your final destination"
                    className="form-input"
                    style={{ 
                      paddingLeft: '2.4rem',
                      border: errors.finalDestination ? '1.5px solid #ef4444' : undefined,
                      backgroundColor: errors.finalDestination ? '#fef2f2' : '#ffffff'
                    }}
                  />
                </div>
                {errors.finalDestination && (
                  <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                    {errors.finalDestination}
                  </span>
                )}
              </div>
            </div>

            {/* Travel Date, Preferred Departure Time, Number of Travelers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                  Travel Date *
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="date"
                    value={travelDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => { setTravelDate(e.target.value); setErrors(prev => ({ ...prev, travelDate: '' })); }}
                    className="form-input"
                    style={{ 
                      paddingLeft: '2.4rem',
                      border: errors.travelDate ? '1.5px solid #ef4444' : undefined,
                      backgroundColor: errors.travelDate ? '#fef2f2' : '#ffffff'
                    }}
                  />
                </div>
                {errors.travelDate && (
                  <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                    {errors.travelDate}
                  </span>
                )}
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                  Preferred Departure Time *
                </label>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="time"
                    value={travelTime}
                    onChange={(e) => { setTravelTime(e.target.value); setErrors(prev => ({ ...prev, travelTime: '' })); }}
                    className="form-input"
                    style={{ 
                      paddingLeft: '2.4rem',
                      border: errors.travelTime ? '1.5px solid #ef4444' : undefined,
                      backgroundColor: errors.travelTime ? '#fef2f2' : '#ffffff'
                    }}
                  />
                </div>
                {errors.travelTime && (
                  <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                    {errors.travelTime}
                  </span>
                )}
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '700', color: '#0f172a' }}>
                  Number of People Traveling *
                </label>
                <div style={{ position: 'relative' }}>
                  <Users size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={travellersCount}
                    onChange={(e) => { setTravellersCount(e.target.value); setErrors(prev => ({ ...prev, travellersCount: '' })); }}
                    placeholder="Enter number of travelers"
                    className="form-input"
                    style={{ 
                      paddingLeft: '2.4rem',
                      border: errors.travellersCount ? '1.5px solid #ef4444' : undefined,
                      backgroundColor: errors.travellersCount ? '#fef2f2' : '#ffffff'
                    }}
                  />
                </div>
                {errors.travellersCount && (
                  <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                    {errors.travellersCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 4: SELECT TRANSPORT MODES                                            */}
          {/* ========================================================================= */}
          <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', border: errors.selectedModes ? '1.5px solid #ef4444' : '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Route size={20} color="#2563eb" />
                  <span>Step 4: Select Transport Modes *</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  Select one or more modes. All selected modes will be combined into one continuous multi-modal journey.
                </p>
              </div>

              {selectedModes.length > 0 ? (
                <span className="badge badge-primary" style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                  {selectedModes.length} Modes Selected
                </span>
              ) : (
                <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: '700', backgroundColor: '#fef2f2', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  No transport modes selected yet.
                </span>
              )}
            </div>

            {errors.selectedModes && (
              <div style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: '700', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                {errors.selectedModes}
              </div>
            )}

            {/* Transport Mode Selection Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
              {transportOptions.map(opt => {
                const isChecked = selectedModes.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleToggleMode(opt.id)}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: '10px',
                      border: isChecked ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: isChecked ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: isChecked ? '0 3px 10px rgba(37,99,235,0.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.65rem' }}>{opt.icon}</span>
                      <div>
                        <strong style={{ fontSize: '0.92rem', color: isChecked ? '#1d4ed8' : '#0f172a', display: 'block' }}>
                          {opt.label}
                        </strong>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', lineHeight: 1.2 }}>
                          {opt.speed}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '5px',
                      backgroundColor: isChecked ? '#2563eb' : '#ffffff',
                      border: isChecked ? 'none' : '1.5px solid #94a3b8',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isChecked && <Check size={15} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DYNAMIC CONNECTED MULTI-MODAL CHAIN PREVIEW (Only shown when inputs exist) */}
            {isChainPreviewReady ? (
              <div style={{ marginTop: '1.25rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: '800', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={14} color="#15803d" />
                    <span>Dynamic Connected Journey Chain:</span>
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#166534' }}>
                    Use arrows to adjust the order of legs
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>{startingLocation}</span>
                  {selectedModes.map((modeId, idx) => {
                    const opt = transportOptions.find(t => t.id === modeId);
                    return (
                      <React.Fragment key={modeId}>
                        <ArrowRight size={14} color="#15803d" />
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#ffffff', border: '1.5px solid #2563eb', padding: '0.25rem 0.55rem', borderRadius: '6px', fontWeight: '800', color: '#1d4ed8' }}>
                          <span>{opt?.icon}</span>
                          <span>{opt?.label}</span>
                          {/* Reorder arrows */}
                          <div style={{ display: 'inline-flex', gap: '0.15rem', marginLeft: '0.25rem' }}>
                            <button
                              type="button"
                              onClick={(e) => handleMoveModeUp(idx, e)}
                              disabled={idx === 0}
                              style={{ border: 'none', background: 'transparent', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1, padding: 0, display: 'flex' }}
                              title="Move mode earlier"
                            >
                              <ArrowUp size={12} color="#1d4ed8" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleMoveModeDown(idx, e)}
                              disabled={idx === selectedModes.length - 1}
                              style={{ border: 'none', background: 'transparent', cursor: idx === selectedModes.length - 1 ? 'default' : 'pointer', opacity: idx === selectedModes.length - 1 ? 0.3 : 1, padding: 0, display: 'flex' }}
                              title="Move mode later"
                            >
                              <ArrowDown size={12} color="#1d4ed8" />
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <ArrowRight size={14} color="#15803d" />
                  <span style={{ fontWeight: '800', color: '#15803d' }}>{finalDestination}</span>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '1rem', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#64748b' }}>
                💡 <em>Enter your Starting Location, Final Destination, and select transport modes above to generate your connected multi-modal journey chain.</em>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* STEP 5: NEXT BUTTON                                                       */}
          {/* ========================================================================= */}
          {generalError && (
            <div style={{ backgroundColor: '#fef2f2', border: '1.5px solid #ef4444', color: '#b91c1c', padding: '0.85rem 1.25rem', borderRadius: '10px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', fontWeight: '700' }}>
              <AlertCircle size={20} color="#dc2626" />
              <span>{generalError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleProceedToTripPlanner}
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              padding: '1.05rem', 
              fontSize: '1.08rem', 
              fontWeight: '800', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.65rem', 
              boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
              cursor: 'pointer'
            }}
          >
            <span>Next: Generate AI Journey & Open Smart Planner</span>
            <ArrowRight size={20} />
          </button>

          {/* Quick-Jump Step Buttons */}
          <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={15} color="#2563eb" />
              <span>Direct Jump to Journey Steps:</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => handleStepClick('PLANNER')}
                title="Open Step 2: AI Journey (Multi-modal chain)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#eff6ff',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '10px',
                  color: '#1d4ed8',
                  fontWeight: '700',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dbeafe'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span>2. AI Journey (Multi-Modal)</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleStepClick('SAFETY')}
                title="Open Step 3: Safety Check (Risk & route audit)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#eff6ff',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '10px',
                  color: '#1d4ed8',
                  fontWeight: '700',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dbeafe'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span>3. Safety Check (Risk Audit)</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleStepClick('SUMMARY')}
                title="Open Step 4: Confirmation (Safety & stay dossier)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #bbf7d0',
                  borderRadius: '10px',
                  color: '#15803d',
                  fontWeight: '700',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dcfce7'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span>4. Confirmation (Stay Dossier)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </form>

        {/* AI Analysis Processing Animation Modal */}
        <AIProcessingModal 
          isOpen={isProcessingAI} 
          onComplete={commitJourneyPlan} 
        />
      </div>
    </div>
  );
};
