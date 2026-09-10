import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { useAuthority } from '../context/AuthorityContext';
import { 
  Shield, Compass, Navigation, AlertTriangle, PhoneCall, 
  MapPin, User, LogOut, Radio, Layers, Bell, Building, Sparkles, Route, LogIn, Globe 
} from 'lucide-react';

export const Navbar = ({ onOpenDemoModal }) => {
  const { currentUser, isAuthenticated, isAuthority, logout } = useAuth();
  const { sosActive } = useTourist();
  const { kpiStats } = useAuthority();
  const location = useLocation();
  const navigate = useNavigate();

  // Public Navigation Links (for all public visitors)
  const publicNavLinks = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/mysuru-demo', label: 'Mysuru Demo', icon: Sparkles },
    { path: '/destinations', label: 'Destinations', icon: MapPin },
    { path: '/hotels', label: 'Hotels', icon: Building },
    { path: '/plan-trip', label: 'Plan Trip', icon: Sparkles },
    { path: '/safety', label: 'Safety', icon: Shield },
    { path: '/services', label: 'Services', icon: Layers },
    { path: '/how-it-works', label: 'How It Works', icon: Globe },
    { path: '/authority', label: 'Authority Command', icon: Radio }
  ];

  // Tourist Navigation Links (strictly authenticated tourist journey)
  const touristNavLinks = [
    { path: '/tourist', label: 'Dashboard', icon: Compass },
    { path: '/mysuru-demo', label: 'Mysuru Demo', icon: Sparkles },
    { path: '/destinations', label: 'Destinations', icon: MapPin },
    { path: '/hotels', label: 'Hotels', icon: Building },
    { path: '/my-trips', label: 'My Trips', icon: Route },
    { path: '/plan-trip', label: 'Plan Trip', icon: Sparkles },
    { path: '/navigation', label: 'Navigation', icon: Navigation },
    { path: '/safety', label: 'Safety', icon: Shield },
    { path: '/services', label: 'Services', icon: Layers },
    { path: '/authority', label: 'Authority Command', icon: Radio },
    { path: '/emergency', label: 'Emergency SOS', icon: PhoneCall, isEmergency: true }
  ];

  // Authority Navigation Links (strictly command center)
  const authorityNavLinks = [
    { path: '/authority', label: 'Command Center', icon: Radio },
    { path: '/authority/tourists', label: 'Live Tourists', icon: User, badge: kpiStats?.totalTourists || 0 },
    { path: '/authority/alerts', label: 'Alert Center', icon: Bell, badge: kpiStats?.activeSOS > 0 ? kpiStats.activeSOS : null, badgeColor: 'bg-red-600' },
    { path: '/authority/danger-zones', label: 'Danger Zones', icon: AlertTriangle },
    { path: '/authority/analytics', label: 'Analytics', icon: Layers }
  ];

  const currentLinks = isAuthority ? authorityNavLinks : (isAuthenticated ? touristNavLinks : publicNavLinks);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = isAuthority ? (currentUser?.name || 'Officer K. Naik') : (currentUser?.name || 'Pavana Sharma');
  const displayTag = isAuthority ? (currentUser?.badgeNumber || 'KA-POL-MY-4402') : (currentUser?.touristTag || currentUser?.touristId || 'TG-2026-752019');

  const handleNavClick = (link, e) => {
    if (link.isHash) {
      if (location.pathname !== '/') {
        navigate('/#how-it-works');
      } else {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header style={{ backgroundColor: '#0a1128', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* Top Notification Bar if SOS is active */}
      {sosActive && !isAuthority && (
        <div style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ animation: 'pulse 1s infinite' }}>🚨</span>
            <span>ACTIVE EMERGENCY SOS BEACON BROADCASTING TO COMMAND CENTER</span>
          </div>
          <Link to="/emergency" style={{ backgroundColor: '#ffffff', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: '800' }}>
            View Emergency Response
          </Link>
        </div>
      )}

      {/* Main Navigation Header */}
      <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', padding: '0 1rem' }}>
        {/* Brand & Logo */}
        <Link to={isAuthority ? '/authority' : (isAuthenticated ? '/tourist' : '/')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: isAuthority ? 'linear-gradient(135deg, #dc2626, #f87171)' : 'linear-gradient(135deg, #2563eb, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: isAuthority ? '0 2px 8px rgba(220,38,38,0.4)' : '0 2px 8px rgba(37,99,235,0.4)' }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                {isAuthority ? 'POLICE & TOURISM COMMAND' : 'AI TOURISM GUARDIAN'}
              </div>
              <span style={{ fontSize: '0.62rem', fontWeight: '800', backgroundColor: '#f59e0b', color: '#000000', padding: '0.1rem 0.4rem', borderRadius: '4px', letterSpacing: '0.04em' }}>
                DEMO MODE
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: isAuthority ? '#fca5a5' : '#93c5fd', fontWeight: '500', letterSpacing: '0.02em' }}>
              {isAuthority ? 'Public Safety & Emergency Dispatch Desk' : 'Plan Better. Travel Smarter. Stay Safer.'}
            </div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = !link.isHash && (location.pathname === link.path || 
              (link.path === '/plan-trip' && (location.pathname === '/destination-planner' || location.pathname === '/trip-planner')));
            const isSOS = link.isEmergency;

            if (link.isHash) {
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNavClick(link, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '500',
                    color: '#cbd5e1',
                    border: '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{link.label}</span>
                </a>
              );
            }

            return (
              <Link
                key={link.path}
                id={`nav-${link.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-link`}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isSOS ? '#f87171' : (isActive ? '#ffffff' : '#cbd5e1'),
                  backgroundColor: isActive 
                    ? (isSOS ? 'rgba(239, 68, 68, 0.2)' : (isAuthority ? 'rgba(220, 38, 38, 0.25)' : 'rgba(37, 99, 235, 0.25)')) 
                    : (isSOS ? 'rgba(239, 68, 68, 0.08)' : 'transparent'),
                  border: isSOS ? '1px solid rgba(239, 68, 68, 0.4)' : (isActive ? (isAuthority ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(59, 130, 246, 0.3)') : '1px solid transparent'),
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} />
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge !== null && (
                  <span style={{ backgroundColor: '#ef4444', color: '#ffffff', fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '999px', fontWeight: '700' }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls: Public CTA vs Authenticated User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {!isAuthenticated ? (
            /* Public Visitor Right CTAs */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to="/destinations"
                className="btn"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '0.82rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Globe size={14} color="#38bdf8" />
                <span>Explore</span>
              </Link>

              <Link
                to="/login"
                className="btn btn-primary"
                style={{
                  fontSize: '0.82rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 10px rgba(37,99,235,0.3)'
                }}
              >
                <LogIn size={14} />
                <span>Login</span>
              </Link>
            </div>
          ) : (
            /* Authenticated User / Authority Controls */
            <>
              {/* SIH Demo Scenarios Trigger */}
              <button
                onClick={onOpenDemoModal}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.18)' }}
                title="Launch SIH Demo Scenarios"
              >
                <Sparkles size={14} />
                <span>Scenarios</span>
              </button>

              {/* User / Officer Profile Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.6rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: isAuthority ? '#dc2626' : '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800' }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ffffff', lineHeight: 1.1 }}>
                    {displayName}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: isAuthority ? '#fca5a5' : '#93c5fd', fontFamily: 'monospace' }}>
                    {displayTag}
                  </div>
                </div>
              </div>

              {/* Exit / Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                title="Exit / Logout"
              >
                <LogOut size={13} />
                <span>Exit</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
