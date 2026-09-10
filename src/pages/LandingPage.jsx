import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { MAJOR_DESTINATIONS, HOTELS_DATABASE } from '../data/mockData';
import { 
  Shield, Compass, Layers, Navigation, PhoneCall, Building, 
  Radio, ArrowRight, CheckCircle2, Play, Activity, MapPin, 
  Star, Clock, DollarSign, Sparkles, Route, ChevronRight, AlertTriangle, 
  Check, Heart, Eye, ArrowUpRight, Lock, HelpCircle 
} from 'lucide-react';

export const LandingPage = ({ onOpenDemoModal, scrollTo }) => {
  const { isAuthenticated, currentUser, isDestinationSaved, toggleSaveDestination } = useAuth();
  const { setActiveTrip } = useTourist();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to section if specified
  useEffect(() => {
    if (scrollTo === 'how-it-works' || location.pathname === '/how-it-works' || location.hash === '#how-it-works') {
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [scrollTo, location.pathname, location.hash]);

  // Public Route Simulation State (Bengaluru -> Mysuru)
  const [analyzingDemo, setAnalyzingDemo] = useState(false);
  const [demoAnalysisResult, setDemoAnalysisResult] = useState(null);

  const handleRunPublicDemo = () => {
    setAnalyzingDemo(true);
    setTimeout(() => {
      setDemoAnalysisResult({
        corridor: 'Bengaluru (City Center) ➔ Mysuru (Palace Area)',
        distanceKm: 143.5,
        estimatedTime: '2 hrs 25 mins',
        safetyScore: 92,
        riskLevel: 'SAFE',
        riskBreakdown: {
          locationRisk: 0,
          movementRisk: 2,
          timeRisk: 0,
          routeRisk: 6,
          sosRisk: 0
        },
        fastestRoute: {
          name: 'NH-275 10-Lane Expressway',
          distance: '143.5 km',
          time: '2h 25m',
          riskScore: 18,
          status: 'Direct & Illuminated'
        },
        saferRoute: {
          name: 'Recommended Safer Corridor (Bypassing congested markets)',
          distance: '147.2 km',
          time: '2h 38m',
          riskScore: 8,
          status: 'Zero Hazard Zone Intersections'
        },
        dangerZonesAvoided: [
          'Devaraja Market South Congestion Bottleneck (Proximity Buffer)',
          'Chamundi Foothills Isolated Section (Night exclusion zone)'
        ],
        aiRecommendation: 'Recommended Safer Route selected. Continues along well-lit expressway corridor with 24/7 patrol stations.'
      });
      setAnalyzingDemo(false);
    }, 900);
  };

  const handleStartJourneyClick = () => {
    if (isAuthenticated) {
      navigate('/tourist');
    } else {
      navigate('/login?redirect=/tourist');
    }
  };

  const handlePlanTripTo = (destName) => {
    if (setActiveTrip) {
      setActiveTrip(prev => ({
        ...prev,
        journeyDestination: destName,
        journeyOrigin: prev?.journeyOrigin || 'Bengaluru City Center',
        selectedTransportModes: prev?.selectedTransportModes?.length ? prev.selectedTransportModes : ['train', 'walking']
      }));
    }
    navigate(`/plan-trip?destination=${encodeURIComponent(destName)}`);
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'DISCOVER',
      subtitle: 'Explore Destinations & Stays',
      desc: 'Browse verified destinations, heritage attractions, verified hotels, and local safety services without needing an account.'
    },
    {
      num: '02',
      title: 'PLAN',
      subtitle: 'Intelligent Multi-Modal Journey',
      desc: 'Build a personalized travel plan combining car, train, bus, cab, or walking with real-time costs, timings, and time-slot scheduling.'
    },
    {
      num: '03',
      title: 'PROTECT',
      subtitle: 'Safety-Aware Active Navigation',
      desc: 'Activate continuous GPS and predictive risk monitoring only when you start your journey. Get alerted before entering high-risk areas.'
    },
    {
      num: '04',
      title: 'RESPOND',
      subtitle: 'Connected Emergency SOS',
      desc: 'Instant one-tap SOS transmits precise coordinates directly to the Police & Tourism Command Center for live tracking and rapid dispatch.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #0a1128 0%, #101f42 55%, #182e5c 100%)',
        color: '#ffffff',
        padding: '5rem 0 4.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Spheres */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.28) 0%, rgba(37,99,235,0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0) 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none'
        }} />

        <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            {/* Left Hero Content */}
            <div>
              {/* SIH Hackathon Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(37, 99, 235, 0.25)',
                border: '1px solid rgba(59, 130, 246, 0.45)',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: '600',
                color: '#93c5fd',
                marginBottom: '1.5rem'
              }}>
                <span>🇮🇳 Smart India Hackathon (SIH) Prototype</span>
                <span style={{ opacity: 0.5 }}>•</span>
                <span>Tourism & Public Safety Ecosystem</span>
              </div>

              {/* Brand Tagline */}
              <div style={{
                fontSize: '0.95rem',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#38bdf8',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Shield size={18} color="#38bdf8" />
                <span>AI TOURISM GUARDIAN</span>
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: 'clamp(2.6rem, 5vw, 4rem)',
                fontWeight: '900',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#ffffff',
                marginBottom: '1.25rem'
              }}>
                Travel Freely.<br />
                <span style={{
                  background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  We Watch the Risks.
                </span>
              </h1>

              {/* Tagline */}
              <p style={{
                fontSize: '1.15rem',
                fontWeight: '600',
                color: '#93c5fd',
                marginBottom: '0.85rem'
              }}>
                "Plan Better. Travel Smarter. Stay Safer."
              </p>

              {/* Description */}
              <p style={{
                fontSize: '1.02rem',
                lineHeight: '1.65',
                color: '#cbd5e1',
                marginBottom: '2.25rem',
                maxWidth: '560px'
              }}>
                Discover destinations, plan smarter journeys, book your stay, and travel with intelligent safety protection. Public visitors can freely explore with zero initial login required.
              </p>

              {/* Hero Action CTA Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <Link
                  id="hero-plan-trip-btn"
                  to="/plan-trip"
                  className="btn btn-primary"
                  style={{
                    padding: '0.85rem 1.75rem',
                    fontSize: '1rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
                    fontWeight: '700'
                  }}
                >
                  <Sparkles size={18} />
                  <span>Plan Trip →</span>
                </Link>

                <Link
                  to="/destinations"
                  className="btn"
                  style={{
                    padding: '0.85rem 1.5rem',
                    fontSize: '1rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(8px)',
                    fontWeight: '600'
                  }}
                >
                  <span>🌍 Explore Destinations</span>
                </Link>

                <button
                  onClick={handleStartJourneyClick}
                  className="btn"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '0.85rem 1.6rem',
                    fontSize: '1rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <Lock size={16} color="#38bdf8" />
                  <span>🔐 Login / Start Journey</span>
                </button>

                <Link
                  to="/hotels"
                  className="btn"
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#94a3b8',
                    border: '1px solid #334155',
                    padding: '0.85rem 1.4rem',
                    fontSize: '0.95rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <Building size={16} />
                  <span>🏨 Find Hotels</span>
                </Link>

                <Link
                  id="hero-authority-command-btn"
                  to="/authority"
                  className="btn"
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    padding: '0.85rem 1.4rem',
                    fontSize: '0.95rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontWeight: '700'
                  }}
                >
                  <Radio size={16} color="#ef4444" />
                  <span>Authority Command</span>
                </Link>
              </div>

              {/* Trust Checkmarks */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> No Login Required to Explore
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Verified Hotels & Stays
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} color="#10b981" /> Real-time GPS & SOS Safety
                </span>
              </div>
            </div>

            {/* Right Hero Visual: PLATFORM PREVIEW */}
            <div>
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '1.25rem',
                padding: '1.75rem',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(16px)',
                position: 'relative'
              }}>
                {/* Header of Preview */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.06em', color: '#38bdf8' }}>
                      PLATFORM PREVIEW
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    padding: '0.15rem 0.6rem',
                    borderRadius: '999px',
                    letterSpacing: '0.04em'
                  }}>
                    Demo Preview
                  </span>
                </div>

                {/* Subtitle */}
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>LIVE JOURNEY PROTECTION</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#10b981' }}>Simulation</span>
                </div>

                {/* Status Items Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {/* Status 1: GPS */}
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>LOCATION STATUS</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={15} />
                      <span>GPS Active (±12m)</span>
                    </div>
                  </div>

                  {/* Status 2: Safety Level */}
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', padding: '0.85rem', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#a7f3d0', marginBottom: '0.2rem' }}>SAFETY STATUS</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                      <span>🟢 SAFE</span>
                    </div>
                  </div>

                  {/* Status 3: Risk Score */}
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>EXPLAINABLE RISK</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Shield size={15} color="#38bdf8" />
                      <span>Risk Score: 12/100</span>
                    </div>
                  </div>

                  {/* Status 4: Route */}
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>NAVIGATION CORRIDOR</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Route size={15} />
                      <span>🗺️ Safer Route</span>
                    </div>
                  </div>
                </div>

                {/* Booked Hotel & SOS Ready Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#93c5fd' }}>RESERVATION</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Building size={14} color="#38bdf8" />
                      <span>🏨 Hotel Booked</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Grand Mercure Mysuru</div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>EMERGENCY READY</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <PhoneCall size={14} />
                      <span>🚨 SOS Ready</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#fca5a5' }}>112 Dispatch Connected</div>
                  </div>
                </div>

                {/* Footer of Preview */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem' }}>
                  <span>Simulated traveler telemetry</span>
                  <button
                    onClick={onOpenDemoModal}
                    style={{ color: '#38bdf8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <span>Launch Scenarios</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE AMAZING DESTINATIONS SECTION */}
      <section id="destinations" style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container-custom">
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.75rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                DESTINATION DISCOVERY
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                Explore Amazing Destinations
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '600px' }}>
                Curated Indian travel hotspots featuring transparent safety ratings, heritage attractions, verified hotels, and local emergency centers.
              </p>
            </div>

            <Link
              to="/destinations"
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
            >
              <span>View All 7+ Destinations</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Destination Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.75rem' }}>
            {MAJOR_DESTINATIONS.slice(0, 6).map((dest) => (
              <div
                key={dest.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 16px 32px -8px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = '#93c5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {/* Destination Image with Badges */}
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '0.85rem',
                    right: '0.85rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(6px)',
                    color: '#10b981',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Shield size={13} />
                    <span>Safety Score: {dest.safetyScore}/100</span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: '0.85rem',
                    left: '0.85rem',
                    backgroundColor: 'rgba(37, 99, 235, 0.9)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px'
                  }}>
                    {dest.state}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                      {dest.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                      {dest.recommendedDuration}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700', marginBottom: '0.75rem' }}>
                    {dest.tagline}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem', flex: 1 }}>
                    {dest.description}
                  </p>

                  {/* Highlights pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    {dest.popularAttractions.slice(0, 3).map((attr, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.72rem',
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        {attr}
                      </span>
                    ))}
                  </div>

                  {/* Best Time & Budget */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.75rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    marginBottom: '1.25rem',
                    border: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Best Time:</span>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{dest.bestTimeToVisit.split('(')[0]}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Est. Budget:</span>
                      <div style={{ fontWeight: '700', color: '#059669' }}>{dest.estimatedBudget}</div>
                    </div>
                  </div>

                  {/* 3 Required Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <Link
                      to={`/destinations/${dest.id}`}
                      className="btn"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '0.45rem 0.2rem',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}
                    >
                      Explore
                    </Link>

                    <Link
                      to={`/hotels?destination=${dest.id}`}
                      className="btn"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: '#f8fafc',
                        color: '#334155',
                        border: '1px solid #e2e8f0',
                        padding: '0.45rem 0.2rem',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}
                    >
                      View Hotels
                    </Link>

                    <button
                      onClick={() => handlePlanTripTo(dest.name)}
                      className="btn"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '0.45rem 0.2rem',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}
                    >
                      Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED HOTELS PREVIEW SECTION */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container-custom">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                VERIFIED ACCOMMODATIONS
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                Featured Hotels & Stays
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
                Browse verified properties with transparent pricing, certified safety ratings, and instant demo bookings.
              </p>
            </div>

            <Link
              to="/hotels"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
            >
              <span>Explore All Hotels</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {HOTELS_DATABASE.slice(0, 3).map((hotel) => (
              <div
                key={hotel.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem'
                }}
              >
                <div style={{ height: '190px', position: 'relative' }}>
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.95)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Check size={12} />
                    <span>VERIFIED PROPERTY</span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px'
                  }}>
                    ₹{hotel.pricePerNight.toLocaleString()} <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>/ night</span>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                      {hotel.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.82rem', fontWeight: '800' }}>
                      <Star size={14} fill="#f59e0b" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
                    <MapPin size={13} color="#2563eb" />
                    <span>{hotel.distance}</span>
                  </div>

                  {/* Amenities Preview */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    {hotel.amenities.slice(0, 3).map((am, idx) => (
                      <span key={idx} style={{ fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>
                        {am}
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <Link
                      to={`/hotels/${hotel.id}`}
                      className="btn btn-secondary"
                      style={{ flex: 1, fontSize: '0.8rem', textAlign: 'center', padding: '0.45rem' }}
                    >
                      View Hotel
                    </Link>
                    <Link
                      to={`/hotels/${hotel.id}`}
                      className="btn btn-primary"
                      style={{ flex: 1, fontSize: '0.8rem', textAlign: 'center', padding: '0.45rem' }}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PUBLIC "HOW IT WORKS" (4-Step Section) */}
      <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              UNIFIED TOURISM LIFECYCLE
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
              From initial destination exploration to active journey protection and emergency dispatch coordination.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.75rem 1.5rem',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: '900',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  {step.num}
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                  {step.title}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.6rem' }}>
                  {step.subtitle}
                </h3>

                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.5' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PUBLIC SAFETY DEMO (Bengaluru -> Mysuru Journey Analysis) */}
      <section style={{ padding: '5rem 0', backgroundColor: '#0a1128', color: '#ffffff' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(37, 99, 235, 0.25)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#93c5fd',
              marginBottom: '1rem'
            }}>
              <span>SIMULATION / DEMO MODE</span>
              <span>•</span>
              <span>No Login Required</span>
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
              Try Sample AI Journey Analysis
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>
              Experience how our predictive safety engine contrasts the fastest highway route against the recommended safer route avoiding configured hazard corridors.
            </p>
          </div>

          <div style={{
            maxWidth: '850px',
            margin: '0 auto',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '1.25rem',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SAMPLE CORRIDOR</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
                  Bengaluru City Center ➔ Mysuru Palace
                </div>
              </div>

              <button
                onClick={handleRunPublicDemo}
                disabled={analyzingDemo}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem', borderRadius: '8px' }}
              >
                <Sparkles size={16} />
                <span>{analyzingDemo ? 'Analyzing Corridor...' : 'Analyze Sample Journey'}</span>
              </button>
            </div>

            {demoAnalysisResult ? (
              <div>
                {/* Result Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>DISTANCE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>{demoAnalysisResult.distanceKm} km</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ESTIMATED TIME</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#38bdf8' }}>{demoAnalysisResult.estimatedTime}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', padding: '0.85rem', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>SAFETY SCORE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>{demoAnalysisResult.safetyScore} / 100 (SAFE)</div>
                  </div>
                </div>

                {/* Dual Route Comparison Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: '700' }}>⚡ FASTEST ROUTE</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', margin: '0.25rem 0' }}>{demoAnalysisResult.fastestRoute.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Distance: {demoAnalysisResult.fastestRoute.distance} • Time: {demoAnalysisResult.fastestRoute.time}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>Risk Index: {demoAnalysisResult.fastestRoute.riskScore}/100</div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: '700' }}>🛡️ RECOMMENDED SAFER ROUTE</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', margin: '0.25rem 0' }}>{demoAnalysisResult.saferRoute.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Distance: {demoAnalysisResult.saferRoute.distance} • Time: {demoAnalysisResult.saferRoute.time}</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', marginTop: '0.35rem' }}>Risk Index: {demoAnalysisResult.saferRoute.riskScore}/100 • Zero Hazards</div>
                  </div>
                </div>

                {/* Explainable factors */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.85rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <div style={{ fontWeight: '700', color: '#38bdf8', marginBottom: '0.35rem' }}>Explainable AI Risk Factors:</div>
                  <div>Location: 0 • Movement: 2 • Time: 0 • Route: 6 • SOS: 0</div>
                  <div style={{ marginTop: '0.25rem', color: '#10b981' }}>{demoAnalysisResult.aiRecommendation}</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                <Compass size={36} color="#38bdf8" style={{ margin: '0 auto 0.75rem', opacity: 0.8 }} />
                <p style={{ fontSize: '0.95rem' }}>
                  Click <strong>"Analyze Sample Journey"</strong> above to simulate real-time road geometry and danger zone avoidance for the Bengaluru ➔ Mysuru travel corridor.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. PUBLIC SOS EXPLANATION SECTION */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              PUBLIC SAFETY INFRASTRUCTURE
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              See How Emergency Response Works
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
              When a verified emergency occurs, our closed-loop architecture connects the tourist directly to public safety authorities within seconds.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '2rem 1.5rem'
          }}>
            {[
              { step: '01', title: 'TOURIST', desc: 'Active journey tracking' },
              { step: '02', title: 'SOS TRIGGER', desc: 'One-tap emergency beacon' },
              { step: '03', title: 'LOCATION CAPTURED', desc: 'High-accuracy GPS locked' },
              { step: '04', title: 'INCIDENT CREATED', desc: 'Real-time alert broadcast' },
              { step: '05', title: 'AUTHORITY ALERT', desc: 'Police desk alerted' },
              { step: '06', title: 'OFFICER ACKNOWLEDGES', desc: 'Quick response initiated' },
              { step: '07', title: 'TRACK & RESOLVE', desc: 'Live dispatch tracking' }
            ].map((node, i, arr) => (
              <React.Fragment key={node.step}>
                <div style={{ textAlign: 'center', flex: '1 1 120px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: i === 1 ? '#dc2626' : (i >= 4 ? '#2563eb' : '#0f172a'),
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    margin: '0 auto 0.5rem'
                  }}>
                    {node.step}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>{node.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>{node.desc}</div>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight size={18} color="#94a3b8" style={{ display: 'none', minWidth: '18px' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
