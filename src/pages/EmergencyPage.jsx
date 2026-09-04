import React, { useState } from 'react';
import { useTourist } from '../context/TouristContext';
import { useAuth } from '../context/AuthContext';
import { emergencyService } from '../services/emergencyService';
import { SOSButton } from '../components/SOSButton';
import { MapView } from '../components/MapView';
import { 
  PhoneCall, Shield, AlertOctagon, MapPin, 
  Navigation, Share2, HeartHandshake, CheckCircle2, Phone 
} from 'lucide-react';
import { INITIAL_SERVICES } from '../data/mockData';

export const EmergencyPage = () => {
  const { telemetry, sosActive, activeSOSEvent } = useTourist();
  const { currentUser } = useAuth();

  const [selectedFacility, setSelectedFacility] = useState(null);

  const emergencyData = emergencyService.findNearestEmergencyFacilities(
    telemetry.latitude,
    telemetry.longitude,
    INITIAL_SERVICES
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 0 4rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <div style={{ backgroundColor: '#fef2f2', padding: '0.4rem', borderRadius: '8px', color: '#dc2626' }}>
              <PhoneCall size={22} />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              Emergency Response & SOS Hub
            </h1>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Instant high-priority distress broadcast with automated nearest police and trauma hospital dispatch.
          </p>
        </div>

        {/* 2-Column Main Section: Left Giant SOS Trigger & Right Nearest Facilities */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Left Column: SOS Button Component */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <SOSButton />
          </div>

          {/* Right Column: Verified National Helplines & Emergency Contacts */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={18} color="#2563eb" />
              <span>National Public Safety Helplines (Toll-Free)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {emergencyData.primaryContactHelplines.map((item, idx) => (
                <a
                  key={idx}
                  href={`tel:${item.number}`}
                  style={{
                    textDecoration: 'none',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#dc2626' }}>{item.number}</div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.label}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Personal Emergency Contact */}
            <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '1rem' }}>
              <strong style={{ fontSize: '0.85rem', color: '#9a3412', display: 'block', marginBottom: '0.35rem' }}>
                Your Configured Emergency Contact:
              </strong>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                {currentUser?.emergencyContact || 'Pooja Sharma (Spouse)'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                📞 {currentUser?.emergencyContactNumber || '+91 98765 43211'}
              </div>
              <a
                href={`tel:${currentUser?.emergencyContactNumber || '+919876543211'}`}
                className="btn"
                style={{ backgroundColor: '#f97316', color: '#ffffff', fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
              >
                <Phone size={14} />
                <span>Call Primary Contact</span>
              </a>
            </div>
          </div>
        </div>

        {/* Nearest Police & Medical Trauma Facilities based on User's Actual GPS Location */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                Nearest Verified Emergency Facilities
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Calculated live from your coordinates ({telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)})
              </p>
            </div>
            <span className="badge badge-primary">GPS Location-Aware</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {emergencyData.all.map((facility) => (
              <div
                key={facility.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>{facility.category === 'police' ? '👮' : '🏥'}</span>
                    <span className="badge badge-safe" style={{ fontSize: '0.7rem' }}>
                      📍 {facility.distanceFormatted} away
                    </span>
                  </div>

                  <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                    {facility.name}
                  </strong>
                  <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '600', marginBottom: '0.3rem' }}>
                    {facility.categoryLabel}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.5rem' }}>
                    {facility.address}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600', marginBottom: '0.75rem' }}>
                    🟢 {facility.openStatus} • Est. Response: ~{facility.estimatedResponseMinutes} mins
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={`tel:${facility.phone.split('/')[0].trim()}`}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.78rem', padding: '0.4rem' }}
                  >
                    <Phone size={13} />
                    <span>Call Unit</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.78rem', padding: '0.4rem' }}
                  >
                    <Navigation size={13} />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
