import React from 'react';
import { Shield, Phone, AlertCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0a1128', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem 0 1.5rem', marginTop: 'auto' }}>
      <div className="container-custom">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              <Shield size={20} color="#38bdf8" />
              <span>AI TOURISM GUARDIAN</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#cbd5e1', marginBottom: '1rem' }}>
              Smart India Hackathon (SIH) prototype engineered to boost tourism safety, intelligent multi-modal mobility, and emergency coordination.
            </p>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#93c5fd' }}>
              🇮🇳 Smart India Hackathon 2026 Edition
            </div>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.85rem' }}>
              National Emergency Helplines
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🚨 112:</span> Unified National Emergency (Police/Fire/Ambulance)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>👮 1363:</span> Ministry of Tourism 24/7 Multi-Lingual Tourist Infoline
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>🏥 108:</span> Emergency Medical Trauma & Ambulance Response
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>🛡️ 1091:</span> Women Safety & Assistance Dispatch
              </li>
            </ul>
          </div>

          {/* Compliance & Data Transparency */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.85rem' }}>
              Safety & Data Protocol
            </h4>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.5', color: '#94a3b8', marginBottom: '0.5rem' }}>
              • GPS Telemetry captured via W3C Geolocation API with high-accuracy GNSS.
            </p>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.5', color: '#94a3b8', marginBottom: '0.5rem' }}>
              • Route analysis computed via OSRM open road engine and geo-fenced hazard buffers.
            </p>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.5', color: '#94a3b8' }}>
              • Sample transport timetables clearly labeled for future open GTFS & IRCTC integration.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem' }}>
          <div>
            © 2026 AI Tourism Guardian. "Plan Better. Travel Smarter. Stay Safer."
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Dual-Mode Tourist & Authority Architecture</span>
            <span>Zero-Trust Real-Time Sync</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
