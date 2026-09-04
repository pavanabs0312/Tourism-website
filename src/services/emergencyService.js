import { calculateDistanceInMeters, formatDistance } from './locationService';
import { INITIAL_SERVICES } from '../data/mockData';

/**
 * Emergency Response Service
 * Handles SOS beacon dispatch, status updates, emergency contact auto-alerts,
 * and nearest Police Station / Hospital locators using real coordinates.
 */

// Web Audio API emergency pulse sound generator
export const playEmergencyAlarmSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    // AudioContext autoplay restrictions safe bypass
  }
};

export const emergencyService = {
  /**
   * Find nearest emergency facilities (Police, Hospitals, Fire) relative to user coordinates
   */
  findNearestEmergencyFacilities(latitude, longitude, allServices = INITIAL_SERVICES) {
    const emergencyOnly = allServices.filter(s =>
      s.category === 'police' || s.category === 'hospital' || s.category === 'emergency'
    );

    const sorted = emergencyOnly.map(facility => {
      const distanceMeters = calculateDistanceInMeters(
        latitude, longitude,
        facility.latitude, facility.longitude
      );
      return {
        ...facility,
        distanceMeters,
        distanceFormatted: formatDistance(distanceMeters),
        estimatedResponseMinutes: Math.max(3, Math.round(distanceMeters / 600)) // ~36km/h emergency vehicle speed
      };
    }).sort((a, b) => a.distanceMeters - b.distanceMeters);

    const nearestPolice = sorted.find(s => s.category === 'police') || sorted[0];
    const nearestHospital = sorted.find(s => s.category === 'hospital') || sorted[1] || sorted[0];

    return {
      all: sorted,
      nearestPolice,
      nearestHospital,
      primaryContactHelplines: [
        { label: 'All India Emergency Unified Number', number: '112', icon: '🚨' },
        { label: 'Tourist Police Helpline', number: '1363', icon: '👮' },
        { label: 'Ambulance & Trauma Medical Care', number: '108', icon: '🏥' },
        { label: 'Women Safety Helpline', number: '1091', icon: '🛡️' }
      ]
    };
  },

  /**
   * Generate quick WhatsApp / SMS emergency dispatch text for family contact
   */
  generateEmergencyMessage(touristName, touristId, latitude, longitude, accuracy) {
    const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    return `🚨 EMERGENCY SOS ALERT: ${touristName} (${touristId}) has triggered an urgent distress signal on AI Tourist Guardian.
Current GPS Location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (Accuracy: ±${accuracy}m)
Live Map Location: ${mapLink}
Authority Command Center has been notified automatically.`;
  }
};
