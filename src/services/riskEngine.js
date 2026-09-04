import { calculateDistanceInMeters } from './locationService';

/**
 * AI Tourist Guardian - Predictive Tourist Safety Engine
 * Transparent, explainable safety risk score from 0 to 100 based on multi-factor indicators:
 * - Location / Danger Zone: 0–30 pts
 * - Time of Day: 0–15 pts
 * - Movement: 0–15 pts
 * - Route Deviation: 0–25 pts
 * - Location Confidence: 0–5 pts
 * - SOS Override: 100 pts
 *
 * SIH 2026 Calibrated Risk Tiers:
 * 0–20 = SAFE (Green)
 * 21–40 = LOW (Light Green / Cyan)
 * 41–60 = CAUTION (Amber / Yellow)
 * 61–80 = HIGH (Orange)
 * 81–100 = CRITICAL (Red)
 */

export const calculateRiskScore = ({
  touristLat,
  touristLng,
  dangerZones = [],
  routeDeviationMeters = 0,
  movementStatus = 'Moving',
  speed = 0,
  stationaryMinutes = 0,
  sosActive = false,
  gpsAccuracy = 10,
  currentTime = new Date()
}) => {
  // If active SOS panic beacon is confirmed, immediate CRITICAL override
  if (sosActive) {
    return {
      score: 100,
      level: 'CRITICAL',
      subScores: {
        locationRisk: 30,
        timeRisk: 15,
        movementRisk: 15,
        routeRisk: 25,
        locationConfidenceRisk: 5,
        sosRisk: 100
      },
      reasons: [
        '🚨 Active SOS Panic Beacon triggered by tourist',
        'Emergency response protocol initiated automatically',
        'Direct live location streaming enabled for Authority Command Center'
      ],
      nearestDangerZone: null,
      dangerZoneDistanceMeters: null
    };
  }

  let locationRisk = 0;
  let timeRisk = 0;
  let movementRisk = 0;
  let routeRisk = 0;
  let locationConfidenceRisk = 0;
  let sosRisk = 0;
  const reasons = [];

  // 1. Danger Zone Proximity Analysis (0–30 pts)
  let nearestDangerZone = null;
  let minDistanceMeters = Infinity;

  const activeDangerZones = dangerZones.filter(z => z.active !== false);

  for (const zone of activeDangerZones) {
    const dist = calculateDistanceInMeters(touristLat, touristLng, zone.latitude, zone.longitude);
    if (dist < minDistanceMeters) {
      minDistanceMeters = dist;
      nearestDangerZone = zone;
    }
  }

  if (nearestDangerZone) {
    const radius = nearestDangerZone.radius || 400;
    if (minDistanceMeters <= radius) {
      // Inside danger zone
      locationRisk = nearestDangerZone.severity === 'CRITICAL' ? 30 : (nearestDangerZone.severity === 'HIGH' ? 24 : 16);
      reasons.push(`⚠️ Inside configured danger zone: "${nearestDangerZone.name}" (${nearestDangerZone.reason || 'Hazard perimeter'})`);
    } else if (minDistanceMeters <= radius + 300) {
      // Approaching danger zone perimeter
      locationRisk = nearestDangerZone.severity === 'CRITICAL' ? 18 : (nearestDangerZone.severity === 'HIGH' ? 14 : 8);
      reasons.push(`⚠️ Within ${Math.round(minDistanceMeters)}m proximity of "${nearestDangerZone.name}"`);
    } else {
      locationRisk = 0;
    }
  }

  // 2. Time-of-Day Risk Analysis (0–15 pts)
  const hour = currentTime instanceof Date ? currentTime.getHours() : new Date().getHours();
  if (hour >= 23 || hour < 4) {
    timeRisk = 15;
    reasons.push('🌙 Late-night hours (23:00 - 04:00) with minimal public transit & emergency coverage');
  } else if (hour >= 20 || hour < 6) {
    timeRisk = 8;
    reasons.push('🌆 Post-dusk hours with reduced daylight and lower visibility');
  } else {
    timeRisk = 0;
  }

  // 3. Movement & Stationary Pattern Analysis (0–15 pts)
  if (stationaryMinutes > 25 && locationRisk > 10) {
    movementRisk = 15;
    reasons.push(`⚠️ Prolonged stationary inactivity (${stationaryMinutes} mins) in elevated caution area`);
  } else if (speed > 110) {
    movementRisk = 10;
    reasons.push('🚗 Unusually high transit velocity detected on secondary arterial roads');
  } else if (movementStatus.toLowerCase().includes('stationary') && locationRisk > 15) {
    movementRisk = 8;
    reasons.push('⚠️ Stationary position sustained near hazard zone perimeter');
  } else {
    movementRisk = 0;
  }

  // 4. Route Deviation Analysis (0–25 pts)
  if (routeDeviationMeters > 300) {
    routeRisk = 25;
    reasons.push(`⚠️ Significant route deviation (${Math.round(routeDeviationMeters)}m off planned itinerary course)`);
  } else if (routeDeviationMeters > 100) {
    routeRisk = 12;
    reasons.push(`⚡ Minor route deviation (${Math.round(routeDeviationMeters)}m from expected trajectory)`);
  } else {
    routeRisk = 0;
  }

  // 5. GPS / Location Confidence (0–5 pts)
  if (gpsAccuracy > 100) {
    locationConfidenceRisk = 5;
    reasons.push(`📡 Low GPS accuracy (±${Math.round(gpsAccuracy)}m): Positioning confidence reduced`);
  } else if (gpsAccuracy > 30) {
    locationConfidenceRisk = 2;
  } else {
    locationConfidenceRisk = 0;
  }

  // Calculate Total Risk Score (Bounded 0 to 100)
  const totalScore = Math.min(100, Math.max(0, locationRisk + timeRisk + movementRisk + routeRisk + locationConfidenceRisk + sosRisk));

  // Determine SIH Tier: 0–20 SAFE, 21–40 LOW, 41–60 CAUTION, 61–80 HIGH, 81–100 CRITICAL
  let level = 'SAFE';
  if (totalScore >= 81) {
    level = 'CRITICAL';
  } else if (totalScore >= 61) {
    level = 'HIGH';
  } else if (totalScore >= 41) {
    level = 'CAUTION';
  } else if (totalScore >= 21) {
    level = 'LOW';
  } else {
    level = 'SAFE';
  }

  if (reasons.length === 0) {
    reasons.push('✅ No immediate risk indicators detected. Optimal daylight & navigation conditions.');
  }

  return {
    score: Math.round(totalScore),
    level,
    subScores: {
      locationRisk,
      timeRisk,
      movementRisk,
      routeRisk,
      locationConfidenceRisk,
      sosRisk
    },
    reasons,
    nearestDangerZone,
    dangerZoneDistanceMeters: minDistanceMeters === Infinity ? null : minDistanceMeters
  };
};

export const getRiskLevelColor = (level) => {
  const norm = (level || '').toUpperCase();
  if (norm.includes('CRITICAL')) {
    return { text: '#dc2626', bg: '#fef2f2', border: '#fecaca', badgeClass: 'badge-critical' };
  } else if (norm.includes('HIGH')) {
    return { text: '#ea580c', bg: '#fff7ed', border: '#fed7aa', badgeClass: 'badge-danger' };
  } else if (norm.includes('CAUTION')) {
    return { text: '#d97706', bg: '#fffbeb', border: '#fde68a', badgeClass: 'badge-caution' };
  } else if (norm.includes('LOW')) {
    return { text: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', badgeClass: 'badge-primary' };
  }
  return { text: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', badgeClass: 'badge-safe' };
};
