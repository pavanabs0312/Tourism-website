import React, { useState, useEffect, useRef } from 'react';
import { PhoneCall, AlertOctagon, CheckCircle2, XCircle, Share2, ShieldAlert } from 'lucide-react';
import { useTourist } from '../context/TouristContext';
import { useAuth } from '../context/AuthContext';
import { emergencyService } from '../services/emergencyService';

export const SOSButton = () => {
  const { sosActive, activeSOSEvent, triggerSOS, resolveOrCancelSOS, telemetry } = useTourist();
  const { currentUser } = useAuth();

  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const holdIntervalRef = useRef(null);

  const startHold = () => {
    if (sosActive) return;
    setHolding(true);
    setHoldProgress(0);

    const step = 50; // ms
    const totalDuration = 2000; // 2 seconds hold to trigger
    let elapsed = 0;

    holdIntervalRef.current = setInterval(() => {
      elapsed += step;
      const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setHoldProgress(progress);

      if (elapsed >= totalDuration) {
        clearInterval(holdIntervalRef.current);
        setHolding(false);
        setHoldProgress(0);
        handleTriggerInstantSOS();
      }
    }, step);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setHolding(false);
    setHoldProgress(0);
  };

  const handleTriggerInstantSOS = async () => {
    await triggerSOS('Urgent Panic SOS triggered by tourist');
  };

  // Generate WhatsApp Direct Alert Link
  const handleShareToEmergencyContact = () => {
    const contactNumber = currentUser?.emergencyContactNumber?.replace(/[^0-9]/g, '') || '';
    const message = emergencyService.generateEmergencyMessage(
      currentUser?.name || 'Tourist',
      currentUser?.touristId || 'TG-2026-104921',
      telemetry.latitude,
      telemetry.longitude,
      telemetry.accuracy
    );
    const whatsappUrl = `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Active SOS Panel */}
      {sosActive ? (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)',
          textAlign: 'center',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)'
          }}>
            <ShieldAlert size={34} />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#991b1b', marginBottom: '0.4rem' }}>
            🚨 EMERGENCY SOS ACTIVE
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#7f1d1d', maxWidth: '420px', margin: '0 auto 1rem', lineHeight: '1.5' }}>
            Your live GPS location (<span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)}</span>) has been securely dispatched to the Authority Command Center.
          </p>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-around', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: '#64748b' }}>Dispatch Status:</span>
              <div style={{ fontWeight: '700', color: '#dc2626' }}>
                {activeSOSEvent?.status || 'RESPONSE INITIATED'}
              </div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Assigned Unit:</span>
              <div style={{ fontWeight: '700', color: '#1e3a8a' }}>
                {activeSOSEvent?.assignedUnit || 'Mysuru PCR Team #04'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleShareToEmergencyContact}
              className="btn"
              style={{ backgroundColor: '#10b981', color: '#ffffff', fontSize: '0.85rem' }}
            >
              <Share2 size={16} />
              <span>WhatsApp Emergency Contact</span>
            </button>

            <button
              onClick={resolveOrCancelSOS}
              className="btn"
              style={{ backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            >
              <CheckCircle2 size={16} />
              <span>I am Safe / Cancel SOS</span>
            </button>
          </div>
        </div>
      ) : (
        /* Standby Hold-to-Activate SOS Button */
        <div style={{ textAlign: 'center' }}>
          <div
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              margin: '0 auto',
              borderRadius: '50%',
              backgroundColor: holding ? '#b91c1c' : '#dc2626',
              boxShadow: holding 
                ? '0 0 35px rgba(220, 38, 38, 0.8)' 
                : '0 10px 25px rgba(220, 38, 38, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'transform 0.15s ease, background-color 0.2s',
              transform: holding ? 'scale(0.96)' : 'scale(1)',
              border: '6px solid #ffffff'
            }}
          >
            {/* Circular Progress Overlay */}
            {holding && (
              <div style={{
                position: 'absolute',
                top: -8,
                left: -8,
                right: -8,
                bottom: -8,
                borderRadius: '50%',
                border: '4px solid #f87171',
                clipPath: `inset(0 0 ${100 - holdProgress}% 0)`
              }} />
            )}

            <PhoneCall size={42} color="#ffffff" style={{ marginBottom: '0.35rem' }} />
            <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ffffff', letterSpacing: '0.05em' }}>
              SOS
            </span>
            <span style={{ fontSize: '0.68rem', color: '#fecaca', fontWeight: '600', textTransform: 'uppercase' }}>
              {holding ? `HOLDING... ${holdProgress}%` : 'HOLD 2S TO TRIGGER'}
            </span>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b' }}>
            Press and hold for 2 seconds to broadcast instant emergency signal
          </div>

          {/* Quick Double-Tap Alternative */}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              onClick={() => setShowConfirmModal(true)}
              style={{ fontSize: '0.75rem', color: '#ef4444', textDecoration: 'underline', fontWeight: '600' }}
            >
              Or click here to confirm SOS via dialog
            </button>
          </div>

          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem'
            }}>
              <div className="card" style={{ maxWidth: '420px', width: '100%', textAlign: 'center', borderTop: '6px solid #ef4444' }}>
                <AlertOctagon size={48} color="#ef4444" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                  Trigger Emergency SOS?
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  This will broadcast your live coordinates (<span style={{ fontFamily: 'monospace' }}>{telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)}</span>) to the Authority Command Center and initiate emergency response.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmModal(false);
                      handleTriggerInstantSOS();
                    }}
                    className="btn btn-danger"
                  >
                    Yes, Send SOS Beacon
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
