import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, FIXED_TOURIST_PRESETS } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { Shield, User, Radio, ArrowRight, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export const LoginPage = () => {
  const { loginExistingTourist, loadPresetTourist, loginAsAuthority, setMode } = useAuth();
  const { setActiveTrip } = useTourist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('TOURIST'); // 'TOURIST' | 'AUTHORITY'
  const [touristQueryInput, setTouristQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectPreset = (presetIndex) => {
    const preset = loadPresetTourist(presetIndex);
    setActiveTrip(prev => ({
      ...prev,
      selectedTransport: preset.selectedTransport,
      selectedTransportLabel: preset.selectedTransportLabel
    }));
    navigate('/destination-planner');
  };

  const handleTouristSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!touristQueryInput.trim()) {
      setErrorMsg('Please enter your Tourist Tag (e.g. TG-2026-752019) or registered mobile number.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginExistingTourist(touristQueryInput.trim());
      if (result.success) {
        navigate('/destination-planner');
      } else {
        setErrorMsg(result.error || 'Tourist Tag / Mobile not found. Please register.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please check credentials or register.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthoritySubmit = (e) => {
    e.preventDefault();
    loginAsAuthority();
    setMode('AUTHORITY');
    navigate('/authority');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f8fafc', padding: '3rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
            <Shield size={26} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
            AI Tourism Guardian Portal
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Select your access role to proceed to your safety workspace.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '4px', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('TOURIST'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: activeTab === 'TOURIST' ? '#1d4ed8' : '#64748b',
              backgroundColor: activeTab === 'TOURIST' ? '#ffffff' : 'transparent',
              boxShadow: activeTab === 'TOURIST' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            Tourist Portal
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('AUTHORITY'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: activeTab === 'AUTHORITY' ? '#dc2626' : '#64748b',
              backgroundColor: activeTab === 'AUTHORITY' ? '#ffffff' : 'transparent',
              boxShadow: activeTab === 'AUTHORITY' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            Authority Command
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'TOURIST' ? (
          <div>
            {/* 4 Fixed Tourist Preset Buttons */}
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <Zap size={15} color="#16a34a" />
                <strong style={{ fontSize: '0.85rem', color: '#166534' }}>
                  1-Click Login as Fixed Tourist:
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {FIXED_TOURIST_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.touristId}
                    type="button"
                    onClick={() => handleSelectPreset(idx)}
                    style={{
                      padding: '0.5rem 0.6rem',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #86efac',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>
                      {preset.selectedTransport === 'car' ? '🚗 1. Car (2p)' : (preset.selectedTransport === 'train' ? '🚆 2. Train (3p)' : (preset.selectedTransport === 'flight' ? '✈️ 3. Flight (4p)' : '🚌 4. Bus (5p)'))}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#166534' }}>
                      {preset.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tourist Login Form */}
            <form onSubmit={handleTouristSubmit}>
              <div className="form-group">
                <label className="form-label">Tourist ID or Registered Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={touristQueryInput}
                    onChange={(e) => setTouristQueryInput(e.target.value)}
                    placeholder="e.g. TG-2026-752019 or 9876543210"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Tourist Dashboard'}</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
                New tourist?{' '}
                <Link to="/register" style={{ color: '#2563eb', fontWeight: '700' }}>
                  Register New Tourist Safety Profile
                </Link>
              </div>
            </form>
          </div>
        ) : (
          /* Authority Command Form */
          <div>
            <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#9f1239' }}>
              <strong>Police & Public Safety Authority Desk</strong>
              <p style={{ margin: '0.25rem 0 0', opacity: 0.9 }}>
                Direct access to multi-tourist live tracking, alert triage, and emergency dispatch protocols.
              </p>
            </div>

            <form onSubmit={handleAuthoritySubmit}>
              <div className="form-group">
                <label className="form-label">Officer Badge / Station ID</label>
                <input
                  type="text"
                  defaultValue="KA-POL-MY-4402"
                  className="form-input"
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department / Jurisdiction</label>
                <input
                  type="text"
                  defaultValue="Mysuru City Police & Tourism Safety Wing"
                  className="form-input"
                  disabled
                />
              </div>

              <button
                type="submit"
                className="btn"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', backgroundColor: '#dc2626', color: '#ffffff' }}
              >
                <Radio size={16} />
                <span>Launch Authority Command Center</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
