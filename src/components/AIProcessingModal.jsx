import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, Shield, Loader2, X, ArrowRight } from 'lucide-react';

export const AIProcessingModal = ({ isOpen = false, onComplete = () => {} }) => {
  const [completedSteps, setCompletedSteps] = useState(0);
  const timeoutRefs = useRef([]);

  const steps = [
    'Checking transport options & schedules',
    'Comparing multi-modal route corridors',
    'Evaluating algorithmic safety scores',
    'Checking transfer buffer connections',
    'Analyzing weather & environmental conditions',
    'Locating nearest emergency response services'
  ];

  const handleSkip = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Cancel all scheduled timers immediately
    if (timeoutRefs.current) {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    }
    setCompletedSteps(steps.length);
    if (onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCompletedSteps(0);
      if (timeoutRefs.current) {
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
      }
      return;
    }

    timeoutRefs.current = [];
    steps.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setCompletedSteps(idx + 1);
      }, (idx + 1) * 280);
      timeoutRefs.current.push(timer);
    });

    const finishTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, (steps.length + 1) * 300);
    timeoutRefs.current.push(finishTimer);

    return () => {
      if (timeoutRefs.current) {
        timeoutRefs.current.forEach(clearTimeout);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
      onClick={handleSkip}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2rem',
          borderRadius: '16px',
          border: '1.5px solid #3b82f6',
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
          backgroundColor: '#ffffff',
          textAlign: 'left',
          position: 'relative'
        }}
      >
        {/* Top-Right Quick Close / Skip Button */}
        <button
          type="button"
          onClick={handleSkip}
          aria-label="Close or Skip"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Skip animation & proceed"
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingRight: '2rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
              🤖 AI Tourism Guardian
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Analyzing your multi-modal journey in real-time...
            </p>
          </div>
        </div>

        {/* Steps Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
          {steps.map((text, idx) => {
            const isDone = completedSteps > idx;
            const isCurrent = completedSteps === idx;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.84rem',
                  color: isDone ? '#065f46' : (isCurrent ? '#1e40af' : '#94a3b8'),
                  fontWeight: isDone || isCurrent ? '700' : '500',
                  transition: 'all 0.25s ease'
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : isCurrent ? (
                  <Loader2 size={18} color="#2563eb" className="animate-spin" />
                ) : (
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1' }} />
                )}
                <span>{text}</span>
              </div>
            );
          })}
        </div>

        {/* Progress status bar & prominent Skip button */}
        <div
          style={{
            backgroundColor: completedSteps >= steps.length ? '#ecfdf5' : '#f8fafc',
            border: `1px solid ${completedSteps >= steps.length ? '#a7f3d0' : '#e2e8f0'}`,
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem'
          }}
        >
          <span style={{ fontWeight: '700', color: completedSteps >= steps.length ? '#059669' : '#475569' }}>
            {completedSteps >= steps.length ? '✨ Optimal journey found!' : `Processing step ${Math.min(steps.length, completedSteps + 1)} of ${steps.length}...`}
          </span>

          <button
            type="button"
            onClick={handleSkip}
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #2563eb',
              color: '#2563eb',
              fontWeight: '800',
              cursor: 'pointer',
              fontSize: '0.78rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 1px 3px rgba(37,99,235,0.1)'
            }}
          >
            <span>Skip</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
