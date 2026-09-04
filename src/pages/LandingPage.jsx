import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Compass, Layers, Navigation, PhoneCall, Building, 
  Radio, ArrowRight, CheckCircle2, Play, Activity, MapPin
} from 'lucide-react';

export const LandingPage = ({ onOpenDemoModal }) => {
  const { loginAsTourist, loginAsAuthority, setMode } = useAuth();
  const navigate = useNavigate();

  const handleStartTourist = () => {
    loginAsTourist();
    setMode('TOURIST');
    navigate('/tourist');
  };

  const handleStartAuthority = () => {
    loginAsAuthority();
    setMode('AUTHORITY');
    navigate('/authority');
  };

  const featureCards = [
    {
      icon: '🧳',
      title: 'AI Trip Planner',
      path: '/trip-planner',
      description: 'Search heritage attractions, temples, and landmarks with intelligent geo-spatial itinerary time-slot scheduling.'
    },
    {
      icon: '🚆',
      title: 'Smart Multi-Modal Travel',
      path: '/transport',
      description: 'Compare train, bus, metro, cab, and pedestrian corridors side-by-side with transparent cost, time, and safety indices.'
    },
    {
      icon: '🛡️',
      title: 'Predictive Tourist Safety',
      path: '/safety',
      description: 'Explainable multi-factor 0–100 risk intelligence factoring danger zone proximity, time-of-day, and route deviation.'
    },
    {
      icon: '🗺️',
      title: 'Safety-Aware Navigation',
      path: '/navigation',
      description: 'Dynamic comparative routing (Fastest Route vs Recommended Safer Route) with real-time hazard avoidance algorithms.'
    },
    {
      icon: '🚨',
      title: 'Emergency Response',
      path: '/emergency',
      description: 'One-tap hold SOS with instant high-accuracy GNSS broadcast, nearest police/hospital locator, and dispatch tracking.'
    },
    {
      icon: '🏨',
      title: 'Tourism Services',
      path: '/services',
      description: 'Curated directory of verified hotels, heritage dining, medical trauma care, and police tourist helpdesks nearby.'
    },
    {
      icon: '👮',
      title: 'Authority Command Center',
      path: '/authority',
      description: 'Real-time situational dashboard with live Leaflet tourist map, danger geo-fencing, and emergency alert triage.'
    }
  ];

  const workflowSteps = [
    { num: '01', title: 'Tourist Registration', desc: 'Generates secure TG-2026-XXXXXX ID & emergency contacts' },
    { num: '02', title: 'Trip Planning', desc: 'AI-assisted itinerary generator with POI sequencing' },
    { num: '03', title: 'Multi-Modal Transit', desc: 'Fastest vs Cheapest vs Safer transit options' },
    { num: '04', title: 'Safety Navigation', desc: 'Dual route comparison avoiding danger zones' },
    { num: '05', title: 'Predictive Risk Engine', desc: 'Continuous 0-100 real-time explainable risk index' },
    { num: '06', title: 'Emergency Dispatch', desc: 'Instant SOS broadcast with live coordinates' },
    { num: '07', title: 'Authority Command', desc: 'Real-time police & emergency coordination center' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0a1128 0%, #101f42 60%, #1c2e5c 100%)',
        color: '#ffffff',
        padding: '5rem 0 4.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Glows */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div className="container-custom" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '880px' }}>
          {/* SIH Hackathon Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: '600',
            color: '#93c5fd',
            marginBottom: '1.5rem'
          }}>
            <span>🇮🇳 Smart India Hackathon Prototype</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Problem Statement: Tourism Ecosystem & Safety</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            AI TOURISM GUARDIAN
          </h1>

          {/* Tagline */}
          <div style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
            fontWeight: '700',
            color: '#38bdf8',
            marginBottom: '1.25rem'
          }}>
            "Plan Better. Travel Smarter. Stay Safer."
          </div>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.05rem',
            lineHeight: '1.6',
            color: '#cbd5e1',
            marginBottom: '2.5rem',
            maxWidth: '720px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            An intelligent tourism ecosystem uniting AI-assisted trip planning, multi-modal travel comparison, predictive explainable risk analytics, safety-aware navigation, and real-time authority emergency response.
          </p>

          {/* Primary Action CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button
              onClick={handleStartTourist}
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', borderRadius: '10px' }}
            >
              <span>Start Your Journey</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={handleStartAuthority}
              className="btn"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                borderRadius: '10px'
              }}
            >
              <Radio size={18} color="#f87171" />
              <span>Authority Command Center</span>
            </button>

            <button
              onClick={onOpenDemoModal}
              className="btn"
              style={{
                backgroundColor: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #334155',
                padding: '0.85rem 1.5rem',
                fontSize: '0.95rem',
                borderRadius: '10px'
              }}
            >
              <Play size={16} />
              <span>Load Hackathon Demo Scenario</span>
            </button>
          </div>

          {/* Trust points */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="#10b981" /> High-Accuracy GNSS Telemetry
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="#10b981" /> Explainable 0–100 Risk Engine
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="#10b981" /> Real-time Cross-Platform Sync
            </span>
          </div>
        </div>
      </section>

      {/* Seven Core Features Grid */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              Integrated Tourism & Safety Ecosystem
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
              Seven interconnected modules engineered to empower travelers and provide instant situational awareness to public safety authorities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {featureCards.map((feat, idx) => (
              <Link
                key={idx}
                to={feat.path}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                  padding: '1.75rem',
                  borderRadius: '1rem',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(37,99,235,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.25rem', flex: 1 }}>
                  {feat.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: '700', color: '#2563eb' }}>
                  <span>Launch Module</span>
                  <ArrowRight size={15} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Architecture Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              Connected Tourist-to-Authority Journey
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
              How the platform links trip planning, movement analytics, dynamic risk prediction, and rapid emergency intervention in real time.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem'
                }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
