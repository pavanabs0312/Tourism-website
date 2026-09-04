import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { useAuthority } from '../context/AuthorityContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, X, Shield, AlertTriangle, PhoneCall, 
  MapPin, CheckCircle2, RotateCcw, ArrowRight, Radio 
} from 'lucide-react';

export const DemoScenarioModal = ({ isOpen, onClose }) => {
  const { loginAsTourist, loginAsAuthority, setMode } = useAuth();
  const { 
    simulateMoveToHazard, 
    simulateSafeReturn, 
    simulateRouteDeviation, 
    triggerSOS, 
    resolveOrCancelSOS 
  } = useTourist();
  const { loadDemoScenario, updateEmergencyStatus } = useAuthority();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const scenarios = [
    {
      name: 'Aarav Sharma',
      tag: 'TG-2026-104921',
      status: 'SAFE',
      riskScore: 12,
      description: 'Exploring Mysore Palace in daylight',
      actionLabel: 'Test Profile',
      badgeClass: 'badge-safe',
      onActivate: async () => {
        loginAsTourist({
          touristId: 'TG-2026-104921',
          touristTag: 'TG-2026-104921',
          name: 'Aarav Sharma',
          mobile: '+91 98765 43210',
          role: 'tourist'
        });
        simulateSafeReturn();
        await resolveOrCancelSOS();
        onClose();
        navigate('/tourist');
      }
    },
    {
      name: 'Elena Rostova',
      tag: 'TG-2026-883912',
      status: 'CAUTION',
      riskScore: 42,
      description: 'Approaching Chamundi foothills',
      actionLabel: 'Hazard Warning',
      badgeClass: 'badge-caution',
      onActivate: () => {
        loginAsTourist({
          touristId: 'TG-2026-883912',
          touristTag: 'TG-2026-883912',
          name: 'Elena Rostova',
          mobile: '+91 98111 22334',
          role: 'tourist'
        });
        simulateMoveToHazard();
        onClose();
        navigate('/tourist');
      }
    },
    {
      name: 'Rahul & Meera Varma',
      tag: 'TG-2026-442109',
      status: 'HIGH RISK',
      riskScore: 68,
      description: '380m route deviation & stationary near surge canal',
      actionLabel: 'Deviation',
      badgeClass: 'badge-danger',
      onActivate: () => {
        loginAsTourist({
          touristId: 'TG-2026-442109',
          touristTag: 'TG-2026-442109',
          name: 'Rahul & Meera Varma',
          mobile: '+91 98222 33445',
          role: 'tourist'
        });
        simulateRouteDeviation();
        onClose();
        navigate('/tourist');
      }
    },
    {
      name: 'Kavita Sundaram',
      tag: 'TG-2026-990145',
      status: 'ACTIVE SOS',
      riskScore: 95,
      description: 'Emergency dispatch active in forest zone',
      actionLabel: 'View SOS',
      badgeClass: 'badge-danger',
      isSOS: true,
      onActivate: async () => {
        loginAsTourist({
          touristId: 'TG-2026-990145',
          touristTag: 'TG-2026-990145',
          name: 'Kavita Sundaram',
          mobile: '+91 98333 44556',
          role: 'tourist'
        });
        await triggerSOS('Simulated Emergency SOS panic beacon from Chamundi Forest Zone');
        onClose();
        navigate('/emergency');
      }
    }
  ];

  const handleResetScenario = () => {
    loadDemoScenario();
    simulateSafeReturn();
    resolveOrCancelSOS();
    onClose();
  };

  const handleOpenAuthority = () => {
    loginAsAuthority();
    setMode('AUTHORITY');
    onClose();
    navigate('/authority');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(10, 17, 40, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.4rem', borderRadius: '8px', color: '#2563eb' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                SIH Hackathon Demo Scenarios
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Activate realistic demo profiles to demonstrate live risk calculations & emergency response.
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 4 Demo Scenario Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {scenarios.map((sc, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: sc.isSOS ? '#fff5f5' : '#f8fafc',
                border: sc.isSOS ? '1px solid #fecaca' : '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{sc.name}</strong>
                  <span style={{ fontSize: '0.72rem', color: '#2563eb', fontFamily: 'monospace', fontWeight: '700' }}>
                    {sc.tag}
                  </span>
                  <span className={`badge ${sc.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                    {sc.status} ({sc.riskScore}/100)
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  "{sc.description}"
                </p>
              </div>

              <button
                onClick={sc.onActivate}
                className={sc.isSOS ? 'btn btn-danger' : 'btn btn-primary'}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              >
                <span>{sc.actionLabel}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          <button
            onClick={handleResetScenario}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            <RotateCcw size={14} />
            <span>Reset & Reload Complete Scenario</span>
          </button>

          <button
            onClick={handleOpenAuthority}
            className="btn btn-dark"
            style={{ fontSize: '0.82rem' }}
          >
            <Radio size={14} />
            <span>Open Authority Command Center</span>
          </button>
        </div>
      </div>
    </div>
  );
};
