import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { MAJOR_DESTINATIONS, HOTELS_DATABASE } from '../data/mockData';
import { 
  MapPin, Calendar, Clock, Users, Sparkles, ArrowRight, CheckCircle2, 
  Route, Hotel, ShieldCheck, AlertCircle, Shield, Check, PhoneCall, 
  CloudSun, Car, Bus, Train, Plane, Lock, Compass, Building, Star,
  AlertTriangle, HeartHandshake, Eye, ExternalLink, RefreshCw
} from 'lucide-react';

export const PlanTripPage = () => {
  const { isAuthenticated, currentUser, login } = useAuth();
  const { activeTrip, setActiveTrip } = useTourist();
  const navigate = useNavigate();
  const location = useLocation();

  // Read URL search params (e.g. ?destination=Mysuru)
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialDestQuery = searchParams.get('destination') || '';

  // 1. Destination State
  const [destination, setDestination] = useState(
    initialDestQuery || activeTrip?.journeyDestination || 'Mysuru'
  );

  // 2. Travel Dates
  const [startDate, setStartDate] = useState(() => {
    if (activeTrip?.travelDate) return activeTrip.travelDate;
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });

  // Calculate duration in days
  const tripDurationDays = useMemo(() => {
    if (!startDate || !endDate) return 3;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [startDate, endDate]);

  // 3. Travelers State
  const [travelersCount, setTravelersCount] = useState(
    activeTrip?.travellersCount ? Number(activeTrip.travellersCount) : 2
  );
  const [travelerType, setTravelerType] = useState('Couple'); // Solo, Couple, Family, Group

  // 4. Transport State
  const [selectedTransport, setSelectedTransport] = useState(
    activeTrip?.selectedTransport || 'train'
  );

  // 5. Trip Style
  const [tripStyle, setTripStyle] = useState('Cultural'); // Relaxed, Adventure, Family, Cultural, Budget

  // 6. Hotel / Stay State
  const [hotelRequired, setHotelRequired] = useState(true);
  const [roomsCount, setRoomsCount] = useState(1);
  const [hotelCategory, setHotelCategory] = useState('Heritage Resort'); // Luxury 5-Star, Heritage Resort, Premium Boutique, Budget Friendly

  // 7. AI Plan Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planError, setPlanError] = useState('');

  // 8. Auth Protected Modal State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Sync destination if URL query changes
  useEffect(() => {
    const destParam = searchParams.get('destination');
    if (destParam) {
      setDestination(destParam);
    }
  }, [searchParams]);

  // Available Destination Quick Pills
  const popularDestinations = [
    'Mysuru', 'Bengaluru', 'Coorg', 'Hampi', 'Goa', 'Ooty', 'Chikkamagaluru'
  ];

  // Transport Options Definition
  const transportOptions = [
    {
      id: 'car',
      label: 'Car',
      icon: '🚗',
      description: 'Self-drive on monitored 10-lane expressway corridor',
      speed: '50-80 km/h',
      tag: 'Flexible & Direct'
    },
    {
      id: 'train',
      label: 'Train',
      icon: '🚆',
      description: 'Vande Bharat & Superfast Rail corridor',
      speed: '90-130 km/h',
      tag: 'Eco-Friendly & Safe'
    },
    {
      id: 'bus',
      label: 'Bus',
      icon: '🚌',
      description: 'AC Airavat Club Class & Tourist Sleeper coach',
      speed: '40-60 km/h',
      tag: 'Affordable'
    },
    {
      id: 'flight',
      label: 'Flight',
      icon: '✈️',
      description: 'Domestic airline connecting nearest airport terminal',
      speed: '550-700 km/h',
      tag: 'Fastest'
    }
  ];

  // Trip Style Options
  const styleOptions = [
    { id: 'Relaxed', icon: '🌿', label: 'Relaxed', desc: 'Leisurely pace, scenic viewpoints & wellness stays' },
    { id: 'Cultural', icon: '🏛️', label: 'Cultural', desc: 'Heritage palaces, temple architecture & local culinary trails' },
    { id: 'Family', icon: '👨‍👩‍👧‍👦', label: 'Family', desc: 'Kid-friendly parks, museums, safe stays & guided tours' },
    { id: 'Adventure', icon: '🧗', label: 'Adventure', desc: 'Trekking trails, outdoor camps & eco-adventures' },
    { id: 'Budget', icon: '💰', label: 'Budget', desc: 'Cost-efficient transit, backpacker hostels & verified public POIs' }
  ];

  // Hotel Category Options
  const hotelCategories = [
    { id: 'Luxury 5-Star', label: 'Luxury 5-Star', price: '₹6,500 – ₹14,000 / night' },
    { id: 'Heritage Resort', label: 'Heritage Resort', price: '₹4,200 – ₹8,500 / night' },
    { id: 'Premium Boutique', label: 'Premium Boutique', price: '₹3,000 – ₹5,500 / night' },
    { id: 'Budget Friendly', label: 'Budget Friendly', price: '₹1,500 – ₹2,800 / night' }
  ];

  // Handle Destination Quick Pill Click
  const handleSelectQuickDest = (name) => {
    setDestination(name);
    setPlanError('');
  };

  // Find destination details in mockData if available
  const matchedDestData = useMemo(() => {
    const q = (destination || '').toLowerCase().trim();
    return MAJOR_DESTINATIONS.find(d => 
      d.name.toLowerCase().includes(q) || q.includes(d.name.toLowerCase())
    ) || {
      name: destination || 'Mysuru',
      state: 'Karnataka',
      safetyScore: 94,
      riskLevel: 'LOW_RISK',
      recommendedRoute: 'NH-275 10-Lane Expressway with 24/7 Police Patrol Corridor'
    };
  }, [destination]);

  // Handle AI Trip Plan Generation (STEP 3 & 4)
  const handleGenerateAITripPlan = (e) => {
    if (e) e.preventDefault();

    if (!destination.trim()) {
      setPlanError('Please enter or select a destination.');
      return;
    }

    setPlanError('');
    setIsGenerating(true);

    setTimeout(() => {
      const destName = destination.trim();
      const days = tripDurationDays;
      const numTravelers = travelersCount;
      const tOption = transportOptions.find(t => t.id === selectedTransport) || transportOptions[1];

      // Estimated cost calculation based on days, travelers, and transport
      const transportCostPerPerson = selectedTransport === 'flight' ? 3800 : (selectedTransport === 'car' ? 1200 : (selectedTransport === 'train' ? 550 : 420));
      const stayCostPerNight = hotelRequired ? (hotelCategory === 'Luxury 5-Star' ? 7500 : (hotelCategory === 'Heritage Resort' ? 4800 : 2600)) : 0;
      const totalStayCost = (stayCostPerNight * (days - 1) * roomsCount);
      const totalPerPerson = Math.round((transportCostPerPerson * 2) + (totalStayCost / numTravelers) + (days * 600));

      // Build day-by-day dynamic itinerary based on destination and style
      const itineraryDays = [];
      for (let i = 1; i <= Math.min(days, 5); i++) {
        if (i === 1) {
          itineraryDays.push({
            day: 1,
            title: `Arrival & Heritage Welcome in ${destName}`,
            morning: `Depart via ${tOption.label}. Safe corridor transit with verified rest-stops.`,
            afternoon: hotelRequired 
              ? `Check into verified ${hotelCategory} accommodation. Unpack and rest.`
              : `Arrival at ${destName} central terminal. Refresh and orientation.`,
            evening: `Sunset stroll at iconic landmarks. Enjoy authentic local cuisine at verified family restaurants.`,
            safetyTip: `Keep offline maps downloaded. Verified tourist assistance desks available along main promenade.`
          });
        } else if (i === 2) {
          itineraryDays.push({
            day: 2,
            title: `${tripStyle} Immersion & Signature Attractions`,
            morning: `Early morning sightseeing at top-rated viewpoints and cultural architectural marvels.`,
            afternoon: `Guided tour of regional craft centers, spice gardens, and historic corridors.`,
            evening: `Illuminated night tour of landmark monuments. Safe tourist patrol presence active.`,
            safetyTip: `Stay along brightly lit primary tourist streets after 21:00. Guard your valuables in crowded bazaars.`
          });
        } else if (i === 3) {
          itineraryDays.push({
            day: 3,
            title: `Scenic Exploration & Local Artisan Markets`,
            morning: `Visit tranquil lakefront / gardens and heritage museum galleries.`,
            afternoon: `Traditional silk, sandalwood, and artisan souvenir market walk.`,
            evening: `Relaxing café hopping with scenic viewpoint panoramas.`,
            safetyTip: `Emergency call boxes (SOS beacons) situated every 2 km along key tourist avenues.`
          });
        } else {
          itineraryDays.push({
            day: i,
            title: `Hidden Gems & Safe Return Transit`,
            morning: `Scenic nature walk / leisurely brunch at historic heritage courtyard.`,
            afternoon: `Hotel checkout and preparation for return journey via ${tOption.label}.`,
            evening: `Safe return transit along monitored smart highway corridor. Complete trip logging.`,
            safetyTip: `Confirm vehicle battery / rail schedule 2 hours prior to scheduled departure.`
          });
        }
      }

      const planResult = {
        destination: destName,
        startDate,
        endDate,
        durationDays: days,
        travelersCount: numTravelers,
        travelerType,
        transport: tOption,
        tripStyle,
        hotelRequired,
        roomsCount: hotelRequired ? roomsCount : 0,
        hotelCategory: hotelRequired ? hotelCategory : 'None',
        estimatedBudgetPerPerson: totalPerPerson,
        estimatedTotalBudget: totalPerPerson * numTravelers,
        estimatedDistanceKm: selectedTransport === 'flight' ? 320 : 145,
        itinerary: itineraryDays,
        safetyOverview: {
          safetyScore: matchedDestData.safetyScore || 94,
          riskLevel: matchedDestData.riskLevel || 'LOW_RISK',
          recommendedRoute: matchedDestData.recommendedRoute || 'Monitored 10-Lane Expressway with 24/7 Police Patrols',
          emergencyServices: [
            { name: `${destName} Central Apollo Hospital & Trauma Center`, dist: '2.3 km', type: 'Hospital', phone: '0821-2566666' },
            { name: `Tourist Police Assistance Desk & Station`, dist: '1.2 km', type: 'Police', phone: '112 / 100' },
            { name: `District Tourism Emergency Response Unit`, dist: '0.9 km', type: 'Support Desk', phone: '1800-425-2244' }
          ],
          activeAlerts: [
            'All primary arterial corridors well-illuminated and active.',
            'Expressway speed-radar enforcement in operation for passenger safety.',
            'Night perimeter safety advisory: Restrict unguided forest trails after 20:00.'
          ],
          weatherForecast: {
            temp: '26°C',
            condition: 'Clear Sky & Pleasant',
            visibility: 'Excellent (10 km+)'
          }
        },
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setGeneratedPlan(planResult);
      setIsGenerating(false);

      // Smooth scroll to results
      setTimeout(() => {
        const resEl = document.getElementById('generated-plan-results');
        if (resEl) {
          resEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 850);
  };

  // STEP 5: Navigate to Hotels Page with selected destination & dates
  const handleFindHotelsClick = () => {
    const destParam = encodeURIComponent(destination.trim() || 'Mysuru');
    navigate(`/hotels?destination=${destParam}&checkIn=${startDate}&checkOut=${endDate}&guests=${travelersCount}`);
  };

  // STEP 7: Gated Actions (Protected Journey / Save Trip)
  const handleStartProtectedJourney = () => {
    if (!isAuthenticated) {
      setPendingAction('START_JOURNEY');
      setLoginModalOpen(true);
      return;
    }

    // Save into activeTrip in context and start trip
    setActiveTrip(prev => ({
      ...prev,
      journeyDestination: destination.trim(),
      journeyOrigin: 'Bengaluru City Center',
      travelDate: startDate,
      travelTime: '09:15',
      travellersCount: travelersCount,
      selectedTransport: selectedTransport,
      title: `Protected Journey to ${destination.trim()}`,
      status: 'PLANNING'
    }));

    navigate('/tourist');
  };

  const handleSaveTripToItinerary = () => {
    if (!isAuthenticated) {
      setPendingAction('SAVE_TRIP');
      setLoginModalOpen(true);
      return;
    }

    setActiveTrip(prev => ({
      ...prev,
      journeyDestination: destination.trim(),
      journeyOrigin: 'Bengaluru City Center',
      travelDate: startDate,
      travelTime: '09:15',
      travellersCount: travelersCount,
      selectedTransport: selectedTransport,
      title: `Trip to ${destination.trim()}`,
      status: 'CONFIRMED'
    }));

    navigate('/my-trips');
  };

  // 1-Click Demo Login for Hackathon Evaluators
  const handleDemoQuickLogin = async () => {
    await login('traveler@example.com', 'demo123');
    setLoginModalOpen(false);

    if (pendingAction === 'START_JOURNEY') {
      handleStartProtectedJourney();
    } else if (pendingAction === 'SAVE_TRIP') {
      handleSaveTripToItinerary();
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f8fafc', padding: '2.5rem 1rem 6rem' }}>
      <div className="container-custom" style={{ maxWidth: '980px' }}>

        {/* Page Header (STEP 3 Requirements) */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: '700',
            color: '#1d4ed8',
            marginBottom: '1rem'
          }}>
            <Sparkles size={16} color="#2563eb" />
            <span>AI TOURISM GUARDIAN • TRIP PLANNER</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: '900',
            color: '#0f172a',
            letterSpacing: '-0.02em',
            margin: '0 0 0.65rem'
          }}>
            Plan Your Trip
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#64748b',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Build a smarter journey with AI-powered planning and safety intelligence.
          </p>
        </div>

        {/* Hackathon Featured Demo Banner: Mysuru 2-Day Safe Trip */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '2px solid #3b82f6',
          borderRadius: '1rem',
          padding: '1.25rem',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 14px rgba(37,99,235,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '900', backgroundColor: '#2563eb', color: '#ffffff', padding: '0.2rem 0.55rem', borderRadius: '4px', letterSpacing: '0.04em' }}>
                🌟 HACKATHON FEATURED DEMO
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                2 Days • 1 Night
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: '0.2rem 0' }}>
              MYSURU 2-DAY SAFE TRIP
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
              Mysuru Palace • Mysuru Zoo (Official entry & timings) • Chamundi Hill • KRS / Brindavan Gardens
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Link
              to="/mysuru-demo"
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.1rem', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>Explore Demo Trip</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Main Planning Interactive Form Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <form onSubmit={handleGenerateAITripPlan}>

            {/* 1. DESTINATION */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                1. Destination
              </label>
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <MapPin size={20} color="#2563eb" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="destination-input"
                  type="text"
                  value={destination}
                  onChange={(e) => { setDestination(e.target.value); setPlanError(''); }}
                  placeholder="Where would you like to travel? (e.g. Mysuru, Coorg, Hampi...)"
                  style={{
                    width: '100%',
                    padding: '0.95rem 1rem 0.95rem 3rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              {/* Quick Select Destination Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Popular:</span>
                {popularDestinations.map(destName => (
                  <button
                    key={destName}
                    type="button"
                    onClick={() => handleSelectQuickDest(destName)}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '999px',
                      border: destination.toLowerCase() === destName.toLowerCase() ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: destination.toLowerCase() === destName.toLowerCase() ? '#eff6ff' : '#f8fafc',
                      color: destination.toLowerCase() === destName.toLowerCase() ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    📍 {destName}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. TRAVEL DATES & 3. TRAVELERS (Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              
              {/* 2. Travel Dates */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                  2. Travel Dates ({tripDurationDays} Days / {tripDurationDays > 1 ? tripDurationDays - 1 : 1} Nights)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '0.25rem' }}>Start Date</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '0.88rem',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '0.25rem' }}>End Date</span>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '0.88rem',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Travelers */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                  3. Travelers ({travelersCount} {travelersCount === 1 ? 'Traveler' : 'Travelers'} • {travelerType})
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { type: 'Solo', count: 1, label: '👤 Solo (1)' },
                    { type: 'Couple', count: 2, label: '👥 Couple (2)' },
                    { type: 'Family', count: 3, label: '👨‍👩‍👧 Family (3-4)' },
                    { type: 'Group', count: 5, label: '👥 Group (5+)' }
                  ].map(item => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => { setTravelerType(item.type); setTravelersCount(item.count); }}
                      style={{
                        flex: 1,
                        minWidth: '95px',
                        padding: '0.65rem 0.5rem',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        borderRadius: '8px',
                        border: travelerType === item.type ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: travelerType === item.type ? '#eff6ff' : '#ffffff',
                        color: travelerType === item.type ? '#1d4ed8' : '#334155',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* 4. TRANSPORT */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                4. Preferred Transport
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {transportOptions.map(t => {
                  const isSelected = selectedTransport === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTransport(t.id)}
                      style={{
                        border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        padding: '1rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.1)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: isSelected ? '#2563eb' : '#f1f5f9', color: isSelected ? '#ffffff' : '#64748b' }}>
                          {t.tag}
                        </span>
                      </div>
                      <strong style={{ fontSize: '0.95rem', color: isSelected ? '#1d4ed8' : '#0f172a', display: 'block' }}>
                        {t.label}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '0.2rem' }}>
                        {t.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. TRIP STYLE */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                5. Trip Style
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.65rem' }}>
                {styleOptions.map(s => {
                  const isSelected = tripStyle === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTripStyle(s.id)}
                      style={{
                        padding: '0.85rem 0.75rem',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                      <strong style={{ fontSize: '0.88rem', color: isSelected ? '#1d4ed8' : '#0f172a', display: 'block' }}>
                        {s.label}
                      </strong>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginTop: '0.15rem', lineHeight: 1.2 }}>
                        {s.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. HOTEL / STAY */}
            <div style={{ marginBottom: '2rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block' }}>
                    6. Hotel & Accommodation
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Select stay preferences and search verified accommodations.
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hotelRequired}
                      onChange={(e) => setHotelRequired(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span>Hotel Required</span>
                  </label>

                  <button
                    id="find-hotels-stay-btn"
                    type="button"
                    onClick={handleFindHotelsClick}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Building size={14} color="#2563eb" />
                    <span>Find Hotels ➔</span>
                  </button>
                </div>
              </div>

              {hotelRequired && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #cbd5e1' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>
                      Number of Rooms:
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[1, 2, 3].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRoomsCount(n)}
                          style={{
                            flex: 1,
                            padding: '0.45rem',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            borderRadius: '6px',
                            border: roomsCount === n ? '2px solid #2563eb' : '1px solid #cbd5e1',
                            backgroundColor: roomsCount === n ? '#eff6ff' : '#ffffff',
                            color: roomsCount === n ? '#1d4ed8' : '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          {n} {n === 1 ? 'Room' : 'Rooms'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>
                      Category:
                    </span>
                    <select
                      value={hotelCategory}
                      onChange={(e) => setHotelCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        fontSize: '0.84rem',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '6px',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      {hotelCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label} ({cat.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message if any */}
            {planError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1.5px solid #f87171', color: '#b91c1c', padding: '0.85rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', fontWeight: '600' }}>
                <AlertCircle size={20} color="#dc2626" />
                <span>{planError}</span>
              </div>
            )}

            {/* 7. AI TRIP PLAN BUTTON */}
            <button
              id="generate-plan-btn"
              type="submit"
              disabled={isGenerating}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1.1rem',
                fontSize: '1.12rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={22} />
              <span>{isGenerating ? 'Analyzing Corridor & Synthesizing AI Trip Plan...' : '✨ Generate AI Trip Plan'}</span>
            </button>
          </form>
        </div>

        {/* GENERATED ITINERARY & CONNECTED SAFETY INTELLIGENCE (STEP 3 & STEP 4) */}
        {generatedPlan && (
          <div id="generated-plan-results" style={{ marginTop: '3rem' }}>

            {/* Success Summary Header Bar */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #bfdbfe',
              boxShadow: '0 4px 16px rgba(37,99,235,0.08)',
              padding: '1.75rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800', color: '#166534', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={13} color="#15803d" />
                    <span>AI TRIP PLAN GENERATED</span>
                  </div>
                  <h2 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a', margin: '0 0 0.25rem' }}>
                    {generatedPlan.durationDays}-Day {generatedPlan.tripStyle} Tour to {generatedPlan.destination}
                  </h2>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    📅 {generatedPlan.startDate} to {generatedPlan.endDate} • {generatedPlan.travelersCount} {generatedPlan.travelersCount > 1 ? 'Travelers' : 'Traveler'} ({generatedPlan.travelerType})
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                    Estimated Total Budget
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#2563eb' }}>
                    ₹{generatedPlan.estimatedTotalBudget.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                    ~₹{generatedPlan.estimatedBudgetPerPerson.toLocaleString()} / person
                  </div>
                </div>
              </div>

              {/* Badges Corridor Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>TRANSPORT</span>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                    {generatedPlan.transport.icon} {generatedPlan.transport.label}
                  </strong>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>ACCOMMODATION</span>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                    🏨 {generatedPlan.hotelCategory} ({generatedPlan.roomsCount} {generatedPlan.roomsCount === 1 ? 'Room' : 'Rooms'})
                  </strong>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>STYLE / PACE</span>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                    ✨ {generatedPlan.tripStyle} Explorer
                  </strong>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>ESTIMATED CORRIDOR</span>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                    📍 ~{generatedPlan.estimatedDistanceKm} km Corridor
                  </strong>
                </div>
              </div>
            </div>

            {/* STEP 4: CONNECTED AI SAFETY OVERVIEW SECTION */}
            <div style={{
              backgroundColor: '#0a1128',
              color: '#ffffff',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '1.75rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 20px rgba(10,17,40,0.4)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Shield size={24} color="#38bdf8" />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                      AI Predictive Safety Intelligence Overview
                    </h3>
                    <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                      Derived from active geo-zones, historical incident models & tourist police corridors.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>SAFETY INDEX</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#10b981' }}>
                      {generatedPlan.safetyOverview.safetyScore}/100
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#34d399', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '800' }}>
                    SAFE ZONE
                  </div>
                </div>
              </div>

              {/* Safety Intelligence Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {/* Safer Route Recommendation */}
                <div style={{ backgroundColor: 'rgba(15,23,42,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Route size={14} />
                    <span>Recommended Safer Route</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
                    {generatedPlan.safetyOverview.recommendedRoute}
                  </p>
                </div>

                {/* Nearby Emergency Services */}
                <div style={{ backgroundColor: 'rgba(15,23,42,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#f87171', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <PhoneCall size={14} />
                    <span>Emergency Services Along Corridor</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    {generatedPlan.safetyOverview.emergencyServices.map((em, idx) => (
                      <li key={idx}>
                        <strong>{em.name}</strong> ({em.dist}) • 📞 {em.phone}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Active Alerts & Weather */}
                <div style={{ backgroundColor: 'rgba(15,23,42,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CloudSun size={14} />
                    <span>Live Weather & Safety Alerts</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginBottom: '0.4rem' }}>
                    🌡️ <strong>{generatedPlan.safetyOverview.weatherForecast.temp}</strong> — {generatedPlan.safetyOverview.weatherForecast.condition}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    • {generatedPlan.safetyOverview.activeAlerts[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Day-By-Day Itinerary Cards (STEP 3) */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="#2563eb" />
                <span>Day-by-Day Journey Itinerary</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {generatedPlan.itinerary.map((dayPlan) => (
                  <div
                    key={dayPlan.day}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '1.5rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.92rem', flexShrink: 0 }}>
                        {dayPlan.day}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          {dayPlan.title}
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Curated timeline for {generatedPlan.destination}</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase' }}>🌅 Morning</span>
                        <p style={{ fontSize: '0.82rem', color: '#334155', margin: '0.2rem 0 0', lineHeight: 1.4 }}>{dayPlan.morning}</p>
                      </div>
                      <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#d97706', textTransform: 'uppercase' }}>☀️ Afternoon</span>
                        <p style={{ fontSize: '0.82rem', color: '#334155', margin: '0.2rem 0 0', lineHeight: 1.4 }}>{dayPlan.afternoon}</p>
                      </div>
                      <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '3px solid #8b5cf6' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase' }}>🌙 Evening</span>
                        <p style={{ fontSize: '0.82rem', color: '#334155', margin: '0.2rem 0 0', lineHeight: 1.4 }}>{dayPlan.evening}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0fdf4', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.76rem', color: '#166534' }}>
                      <ShieldCheck size={14} color="#15803d" />
                      <span><strong>Smart Safety Advice:</strong> {dayPlan.safetyTip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prototype Notice */}
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.85rem 1.25rem', marginBottom: '2rem', fontSize: '0.8rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} color="#d97706" />
              <span>
                <strong>Hackathon Demo Prototype:</strong> This itinerary is synthesized using verified corridor models. No live financial transaction is triggered without your explicit confirmation.
              </span>
            </div>

            {/* Action Bar (STEP 5 & STEP 7) */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* STEP 5: Find Hotels button */}
                <button
                  id="find-hotels-results-btn"
                  type="button"
                  onClick={handleFindHotelsClick}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.75rem 1.25rem', fontSize: '0.9rem', fontWeight: '700' }}
                >
                  <Building size={16} color="#2563eb" />
                  <span>Find Hotels in {generatedPlan.destination}</span>
                </button>

                {/* Save Itinerary */}
                <button
                  id="save-trip-btn"
                  type="button"
                  onClick={handleSaveTripToItinerary}
                  className="btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    color: '#334155',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Calendar size={16} color="#475569" />
                  <span>Save to My Trips</span>
                </button>
              </div>

              {/* STEP 7: Start Protected Journey (Auth Gated) */}
              <button
                id="start-protected-journey-btn"
                type="button"
                onClick={handleStartProtectedJourney}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.75rem',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.25)'
                }}
              >
                <Shield size={18} />
                <span>Start Protected Journey ➔</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* STEP 7: AUTH REQUIRED MODAL FOR PROTECTED ACTIONS */}
      {loginModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Lock size={28} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              Tourist Login Required
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              {pendingAction === 'START_JOURNEY'
                ? 'Public exploration is unrestricted! However, activating live GPS telemetry, geofence danger zone monitoring, and 1-tap Police SOS requires an authenticated tourist profile.'
                : 'Saving and syncing this itinerary to your personal travel dashboard requires an authenticated tourist account.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                id="evaluator-login-btn"
                type="button"
                onClick={handleDemoQuickLogin}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Sparkles size={18} />
                <span>1-Click Demo Login (Evaluator Access)</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/login?redirect=/plan-trip')}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem', fontWeight: '700' }}
              >
                <span>Login with Email & Password</span>
              </button>

              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer', padding: '0.5rem' }}
              >
                Cancel & Continue Public Exploration
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
