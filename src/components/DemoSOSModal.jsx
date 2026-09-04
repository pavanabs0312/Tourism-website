import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, MapPin, User, Building, Radio, Check, AlertCircle, X, Volume2 } from 'lucide-react';
import { playEmergencyAlarmSound } from '../services/emergencyService';

export const DemoSOSModal = ({
  isOpen = false,
  onClose = () => {},
  currentLocation = { name: 'Bengaluru City Center / NH-275', lat: 12.9716, lng: 77.5946 },
  emergencyContact = { name: 'Jane Doe', relation: 'Sister', phone: '+91 98765 43211' },
  nearestHospital = { name: 'Apollo BGS Hospital & Trauma Center', distance: '1.4 km', phone: '+91 821 256 8888' },
  nearestPolice = { name: 'Mysuru City Central Police Station', distance: '850 meters', phone: '112 / +91 821 241 8100' }
}) => {
  const [alarmPlayed, setAlarmPlayed] = useState(false);

  if (!isOpen) return null;

  const handleTestAlarm = () => {
    playEmergencyAlarmSound();
    setAlarmPlayed(true);
    setTimeout(() => setAlarmPlayed(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '580px',
          width: '100%',
          padding: '1.75rem',
          borderRadius: '16px',
          border: '2px solid #ef4444',
          boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.35)',
          backgroundColor: '#ffffff',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid #fee2e2', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldAlert size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#dc2626', margin: 0 }}>
                  🚨 EMERGENCY SOS ACTIVE
                </h3>
                <span style={{ fontSize: '0.65rem', backgroundColor: '#dc2626', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: '800' }}>
                  DEMO MODE
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                High-priority tourist distress workflow simulation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Demo Mode Notice */}
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            color: '#b45309',
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}
        >
          <AlertCircle size={18} color="#d97706" />
          <span>
            <strong>Hackathon Simulation:</strong> Demo Mode — no real emergency notification has been sent to actual emergency lines.
          </span>
        </div>

        {/* 6-Step Automated Workflow Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {/* 1. GPS Coordinates */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ backgroundColor: '#10b981', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 }}>
              ✓
            </div>
            <div style={{ fontSize: '0.78rem' }}>
              <strong style={{ color: '#0f172a', display: 'block' }}>1. 📍 Current Location Captured</strong>
              <span style={{ color: '#475569' }}>
                {currentLocation.name || 'Bengaluru-Mysuru Corridor'} ({currentLocation.lat?.toFixed(4)}, {currentLocation.lng?.toFixed(4)}) • GNSS ±5m Accuracy
              </span>
            </div>
          </div>

          {/* 2. Emergency Contact */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ backgroundColor: '#10b981', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 }}>
              ✓
            </div>
            <div style={{ fontSize: '0.78rem' }}>
              <strong style={{ color: '#0f172a', display: 'block' }}>2. 👤 Emergency Contact Notified (Simulated)</strong>
              <span style={{ color: '#475569' }}>
                SMS & Automated Voice Ping sent to {emergencyContact.name} ({emergencyContact.relation}) at {emergencyContact.phone}
              </span>
            </div>
          </div>

          {/* 3. Nearest Hospital */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ backgroundColor: '#10b981', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 }}>
              ✓
            </div>
            <div style={{ fontSize: '0.78rem' }}>
              <strong style={{ color: '#0f172a', display: 'block' }}>3. 🏥 Nearest Hospital Identified</strong>
              <span style={{ color: '#475569' }}>
                {nearestHospital.name} • 📏 {nearestHospital.distance} • Hotline: {nearestHospital.phone}
              </span>
            </div>
          </div>

          {/* 4. Nearest Police */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ backgroundColor: '#10b981', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 }}>
              ✓
            </div>
            <div style={{ fontSize: '0.78rem' }}>
              <strong style={{ color: '#0f172a', display: 'block' }}>4. 🚓 Nearest Police Desk Identified</strong>
              <span style={{ color: '#475569' }}>
                {nearestPolice.name} • 📏 {nearestPolice.distance} • Control: {nearestPolice.phone}
              </span>
            </div>
          </div>

          {/* 5. Route Shared */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ backgroundColor: '#10b981', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 }}>
              ✓
            </div>
            <div style={{ fontSize: '0.78rem' }}>
              <strong style={{ color: '#0f172a', display: 'block' }}>5. 🗺️ Current Corridor & Waypoints Shared</strong>
              <span style={{ color: '#475569' }}>
                Live GPS corridor telemetries routed to Authority Command Center Dispatch Desk
              </span>
            </div>
          </div>

          {/* 6. Direct Assistance */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ backgroundColor: '#10b981', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 }}>
              ✓
            </div>
            <div style={{ fontSize: '0.78rem' }}>
              <strong style={{ color: '#0f172a', display: 'block' }}>6. 📞 Emergency Assistance Options Displayed</strong>
              <span style={{ color: '#475569' }}>
                112 National Helpline & 1363 Ministry of Tourism Tourist Police hotlines active
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
          <button
            type="button"
            onClick={handleTestAlarm}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem' }}
          >
            <Volume2 size={15} color="#dc2626" />
            <span>{alarmPlayed ? 'Pulse Sounding...' : 'Test Siren Tone'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary"
            style={{ backgroundColor: '#059669', borderColor: '#059669', fontSize: '0.85rem', fontWeight: '800', padding: '0.55rem 1.25rem' }}
          >
            <span>✓ Safe / Dismiss SOS Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
