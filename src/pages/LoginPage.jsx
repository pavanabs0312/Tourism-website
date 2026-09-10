import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth, FIXED_TOURIST_PRESETS } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { 
  Shield, User, Radio, ArrowRight, AlertCircle, CheckCircle2, 
  Zap, Lock, Mail, Compass, ChevronRight, Globe 
} from 'lucide-react';

export const LoginPage = () => {
  const { loginExistingTourist, loadPresetTourist, loginAsAuthority, loginAsDemoTourist, setMode } = useAuth();
  const { setActiveTrip } = useTourist();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/tourist';

  const [activeTab, setActiveTab] = useState('TOURIST'); // 'TOURIST' | 'AUTHORITY'
  const [emailOrTag, setEmailOrTag] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDemoTouristLogin = () => {
    const user = loginAsDemoTourist();
    if (setActiveTrip) {
      setActiveTrip(prev => ({
        ...prev,
        selectedTransport: user.selectedTransport,
        selectedTransportLabel: user.selectedTransportLabel
      }));
    }
    navigate(redirectTarget);
  };

  const handleSelectPreset = (presetIndex) => {
    const preset = loadPresetTourist(presetIndex);
    setActiveTrip(prev => ({
      ...prev,
      selectedTransport: preset.selectedTransport,
      selectedTransportLabel: preset.selectedTransportLabel
    }));
    navigate(redirectTarget);
  };

  const handleTouristLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const query = emailOrTag.trim();
    if (!query) {
      setErrorMsg('Please enter your email, mobile number, or Tourist Tag.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginExistingTourist(query, password);
      if (result.success) {
        navigate(redirectTarget);
      } else {
        setErrorMsg(result.error || 'No account found. You can select a quick demo preset below or create a new account.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please verify credentials or create a new account.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorityLogin = (e) => {
    if (e) e.preventDefault();
    loginAsAuthority();
    setMode('AUTHORITY');
    navigate('/authority');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f8fafc', padding: '3rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2.25rem', borderRadius: '1.25rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08)' }}>
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: activeTab === 'AUTHORITY' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(37, 99, 235, 0.1)',
            color: activeTab === 'AUTHORITY' ? '#dc2626' : '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.85rem'
          }}>
            {activeTab === 'AUTHORITY' ? <Radio size={28} /> : <Shield size={28} />}
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.35rem' }}>
            {activeTab === 'AUTHORITY' ? 'Authority Command Portal' : 'Welcome Back, Traveller 👋'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            {activeTab === 'AUTHORITY' 
              ? 'Public Safety, Tourism Police & Emergency Dispatch Desk' 
              : 'Sign in to continue your journey and access protected safety tracking.'}
          </p>
        </div>

        {/* Role Selector Tabs (Section 30) */}
        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('TOURIST'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: activeTab === 'TOURIST' ? '#1d4ed8' : '#64748b',
              backgroundColor: activeTab === 'TOURIST' ? '#ffffff' : 'transparent',
              boxShadow: activeTab === 'TOURIST' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Tourist Portal
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('AUTHORITY'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: activeTab === 'AUTHORITY' ? '#dc2626' : '#64748b',
              backgroundColor: activeTab === 'AUTHORITY' ? '#ffffff' : 'transparent',
              boxShadow: activeTab === 'AUTHORITY' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Authority Command
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'TOURIST' ? (
          <div>
            {/* Standard Tourist Login Form (Section 29) */}
            <form onSubmit={handleTouristLogin} style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Email or Tourist Tag
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. pavana@example.com or TG-2026-752019"
                    value={emailOrTag}
                    onChange={(e) => setEmailOrTag(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="Enter password (optional for demo presets)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.92rem', borderRadius: '8px' }}
                >
                  {loading ? 'Signing in...' : 'LOGIN'}
                </button>

                <Link
                  to="/register"
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.92rem', textAlign: 'center', borderRadius: '8px' }}
                >
                  CREATE ACCOUNT
                </Link>
              </div>

              {/* Continue Exploring CTA (Section 29) */}
              <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                <Link
                  to="/"
                  style={{
                    fontSize: '0.82rem',
                    color: '#64748b',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    textDecoration: 'none'
                  }}
                >
                  <Globe size={14} color="#2563eb" />
                  <span>Continue Exploring as Guest</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </form>

            {/* Quick 1-Click Preset Profiles for Fast Evaluation */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              {/* Primary 1-Click Evaluator Demo Login Button */}
              <button
                id="evaluator-demo-login-btn"
                type="button"
                onClick={handleDemoTouristLogin}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  backgroundColor: '#2563eb',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                  borderRadius: '10px'
                }}
              >
                <Zap size={18} />
                <span>1-Click Demo Login (Evaluator Access)</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                <Zap size={14} />
                <span>Or Select Demo Tourist Persona</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {FIXED_TOURIST_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(idx)}
                    style={{
                      textAlign: 'left',
                      padding: '0.6rem 0.75rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                      e.currentTarget.style.borderColor = '#93c5fd';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {preset.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {preset.selectedTransportLabel.split(':')[0]} ({preset.groupSize} {preset.groupSize === 1 ? 'person' : 'people'})
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Authority Login Form */
          <div>
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#991b1b' }}>
              <strong>Police & Tourism Dispatch Desk Access</strong>
              <div style={{ marginTop: '0.25rem', color: '#7f1d1d' }}>
                Authorized credential token for Officer K. Naik (Badge: KA-POL-MY-4402).
              </div>
            </div>

            <form onSubmit={handleAuthorityLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Officer Name & Badge Number
                </label>
                <input
                  type="text"
                  readOnly
                  value="Officer K. Naik (KA-POL-MY-4402)"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    backgroundColor: '#f1f5f9',
                    fontFamily: 'monospace',
                    fontWeight: '700'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Command Desk
                </label>
                <input
                  type="text"
                  readOnly
                  value="Mysuru Police & Tourism Public Safety Wing"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    backgroundColor: '#f1f5f9',
                    color: '#475569'
                  }}
                />
              </div>

              <button
                id="authority-demo-login-btn"
                type="submit"
                className="btn"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  borderRadius: '8px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(220,38,38,0.35)',
                  cursor: 'pointer'
                }}
              >
                <Radio size={18} />
                <span>Demo Authority Login (Officer K. Naik)</span>
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <Link to="/" style={{ fontSize: '0.82rem', color: '#64748b', textDecoration: 'none' }}>
                ← Return to Public Website
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
