import { db, hasValidConfig } from './firebase';
import { 
  collection, doc, setDoc, getDoc, getDocs, updateDoc, onSnapshot, query, orderBy, limit, where 
} from 'firebase/firestore';
import { INITIAL_DEMO_TOURISTS, INITIAL_DANGER_ZONES, INITIAL_ALERTS, INITIAL_SERVICES } from '../data/mockData';

// BroadcastChannel for instant multi-tab zero-config synchronization in demo mode
const syncChannel = typeof window !== 'undefined' && window.BroadcastChannel 
  ? new BroadcastChannel('ai_tourism_guardian_sync_channel') 
  : null;

const STORAGE_KEYS = {
  TOURISTS: 'atg_tourists_v1',
  TRIPS: 'atg_trips_v1',
  EMERGENCIES: 'atg_emergencies_v1',
  DANGER_ZONES: 'atg_danger_zones_v1',
  ALERTS: 'atg_alerts_v1',
  SERVICES: 'atg_services_v1'
};

// Memory & LocalStorage fallback helpers
const getStoredData = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultVal;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (syncChannel) {
      syncChannel.postMessage({ type: 'DATA_UPDATED', key, timestamp: Date.now() });
    }
    window.dispatchEvent(new CustomEvent('atg_local_sync', { detail: { key } }));
  } catch (e) {
    console.error('Error storing data to localStorage:', e);
  }
};

// Initial default trips seed for demo
const INITIAL_TRIPS = [
  {
    tripId: 'trip-past-001',
    touristId: 'TG-2026-104921',
    touristTag: 'TG-2026-104921',
    title: 'Bengaluru to Mysuru Heritage Trail',
    startTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2 + 14400000).toISOString(),
    startLocation: { name: 'Bengaluru City Center', latitude: 12.9716, longitude: 77.5946 },
    destinations: [
      { name: 'Mysore Palace', location: 'Mysuru', category: 'Heritage Landmark' },
      { name: 'Chamundi Hills', location: 'Mysuru', category: 'Scenic Viewpoint' }
    ],
    selectedTransport: 'train',
    selectedTransportLabel: 'Train (Vande Bharat Express)',
    selectedRoute: 'Safer Route via NH275',
    tripStatus: 'COMPLETED',
    durationMins: 240,
    distanceKm: 145.2,
    maxRiskScore: 18,
    warningsCount: 0,
    emergencyEventsCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// Initialize default storage on first load
if (typeof window !== 'undefined') {
  if (!localStorage.getItem(STORAGE_KEYS.TOURISTS)) {
    localStorage.setItem(STORAGE_KEYS.TOURISTS, JSON.stringify(INITIAL_DEMO_TOURISTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRIPS)) {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(INITIAL_TRIPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DANGER_ZONES)) {
    localStorage.setItem(STORAGE_KEYS.DANGER_ZONES, JSON.stringify(INITIAL_DANGER_ZONES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  }
}

export const firebaseService = {
  // Check if using live Firebase or local sync
  isLiveFirebase() {
    return hasValidConfig && db !== null;
  },

  // 1. Subscribe to Tourists Stream
  subscribeTourists(callback) {
    if (this.isLiveFirebase()) {
      try {
        const q = collection(db, 'tourists');
        return onSnapshot(q, (snapshot) => {
          const tourists = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          callback(tourists.length > 0 ? tourists : getStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS));
        }, (err) => {
          console.warn('Firestore tourists subscription failed, fallback to local sync:', err);
          callback(getStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS));
        });
      } catch (e) {
        console.warn('Error creating Firestore listener:', e);
      }
    }

    const emit = () => {
      const data = getStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS);
      callback(data);
    };

    emit();

    const handleLocalSync = (e) => {
      if (!e.detail || e.detail.key === STORAGE_KEYS.TOURISTS) emit();
    };

    const handleBroadcast = (msg) => {
      if (msg.data?.type === 'DATA_UPDATED' && msg.data?.key === STORAGE_KEYS.TOURISTS) emit();
    };

    window.addEventListener('atg_local_sync', handleLocalSync);
    window.addEventListener('storage', emit);
    if (syncChannel) syncChannel.addEventListener('message', handleBroadcast);

    return () => {
      window.removeEventListener('atg_local_sync', handleLocalSync);
      window.removeEventListener('storage', emit);
      if (syncChannel) syncChannel.removeEventListener('message', handleBroadcast);
    };
  },

  // 2. Subscribe to Danger Zones
  subscribeDangerZones(callback) {
    if (this.isLiveFirebase()) {
      try {
        const q = collection(db, 'dangerZones');
        return onSnapshot(q, (snapshot) => {
          const zones = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          callback(zones.length > 0 ? zones : getStoredData(STORAGE_KEYS.DANGER_ZONES, INITIAL_DANGER_ZONES));
        });
      } catch (e) {}
    }

    const emit = () => {
      callback(getStoredData(STORAGE_KEYS.DANGER_ZONES, INITIAL_DANGER_ZONES));
    };

    emit();

    const handleSync = (e) => {
      if (!e.detail || e.detail.key === STORAGE_KEYS.DANGER_ZONES) emit();
    };

    window.addEventListener('atg_local_sync', handleSync);
    if (syncChannel) syncChannel.addEventListener('message', (msg) => {
      if (msg.data?.key === STORAGE_KEYS.DANGER_ZONES) emit();
    });

    return () => {
      window.removeEventListener('atg_local_sync', handleSync);
    };
  },

  // 3. Subscribe to Authority Alerts
  subscribeAlerts(callback) {
    if (this.isLiveFirebase()) {
      try {
        const q = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(50));
        return onSnapshot(q, (snapshot) => {
          const alerts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          callback(alerts.length > 0 ? alerts : getStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS));
        });
      } catch (e) {}
    }

    const emit = () => {
      const alerts = getStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
      alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      callback(alerts);
    };

    emit();

    const handleSync = (e) => {
      if (!e.detail || e.detail.key === STORAGE_KEYS.ALERTS) emit();
    };

    window.addEventListener('atg_local_sync', handleSync);
    if (syncChannel) syncChannel.addEventListener('message', (msg) => {
      if (msg.data?.key === STORAGE_KEYS.ALERTS) emit();
    });

    return () => {
      window.removeEventListener('atg_local_sync', handleSync);
    };
  },

  // 4. Save/Register New Tourist Profile
  async saveTouristProfile(profile) {
    const touristTag = profile.touristTag || profile.touristId;
    const touristDoc = {
      touristId: profile.touristId,
      touristTag: touristTag,
      name: profile.name,
      mobile: profile.mobile,
      email: profile.email || '',
      emergencyContact: profile.emergencyContact || 'Emergency Services',
      emergencyContactNumber: profile.emergencyContactNumber || '112',
      preferredLanguage: profile.preferredLanguage || 'English',
      createdAt: new Date().toISOString(),
      status: 'ONLINE',
      currentLocation: {
        latitude: profile.latitude || 12.3052,
        longitude: profile.longitude || 76.6552
      },
      latitude: profile.latitude || 12.3052,
      longitude: profile.longitude || 76.6552,
      gpsAccuracy: profile.gpsAccuracy || 10,
      riskScore: 0,
      riskLevel: 'SAFE',
      safetyStatus: 'SAFE',
      movementStatus: 'Active GPS Standby',
      speed: 0,
      heading: 0,
      routeDeviation: 'None',
      dangerDistance: 'Safe Distance (>1.5 km)',
      selectedTransport: profile.selectedTransport || 'NOT_SELECTED',
      tripStatus: 'NOT_STARTED',
      sosStatus: 'INACTIVE',
      sosActive: false,
      activeTrip: profile.activeTrip || 'Karnataka Exploration',
      lastUpdated: new Date().toISOString(),
      aiRiskFactors: ['Tourist registered and online', 'Standard baseline']
    };

    if (this.isLiveFirebase()) {
      try {
        await setDoc(doc(db, 'tourists', profile.touristId), touristDoc);
      } catch (e) {
        console.warn('Firestore profile save error:', e);
      }
    }

    // Save locally
    const current = getStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS);
    const existingIndex = current.findIndex(t => t.touristId === profile.touristId || t.touristTag === touristTag);
    if (existingIndex >= 0) {
      current[existingIndex] = { ...current[existingIndex], ...touristDoc };
    } else {
      current.unshift(touristDoc);
    }
    setStoredData(STORAGE_KEYS.TOURISTS, current);
    return touristDoc;
  },

  // 5. Existing Tourist Lookup (by Tourist Tag or Mobile Number)
  async getTouristByTagOrMobile(queryStr) {
    if (!queryStr) return null;
    const cleanQuery = queryStr.trim().toLowerCase();

    // 1. Try Firebase Firestore
    if (this.isLiveFirebase()) {
      try {
        const docRef = doc(db, 'tourists', queryStr.trim());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };

        // Search by mobile or touristTag field
        const qMobile = query(collection(db, 'tourists'), where('mobile', '==', queryStr.trim()));
        const snapMobile = await getDocs(qMobile);
        if (!snapMobile.empty) {
          return { id: snapMobile.docs[0].id, ...snapMobile.docs[0].data() };
        }
      } catch (e) {
        console.warn('Firestore lookup fallback to local storage:', e);
      }
    }

    // 2. LocalStorage lookup
    const allTourists = getStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS);
    return allTourists.find(t => 
      (t.touristId && t.touristId.toLowerCase() === cleanQuery) ||
      (t.touristTag && t.touristTag.toLowerCase() === cleanQuery) ||
      (t.mobile && t.mobile.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, '')))
    ) || null;
  },

  // 6. Update Real-time Location & Telemetry
  async updateTouristTelemetry(touristId, telemetry) {
    const current = getStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS);
    const idx = current.findIndex(t => t.touristId === touristId || t.touristTag === touristId);
    
    const updates = {
      currentLocation: {
        latitude: telemetry.latitude,
        longitude: telemetry.longitude
      },
      latitude: telemetry.latitude,
      longitude: telemetry.longitude,
      gpsAccuracy: telemetry.gpsAccuracy,
      speed: telemetry.speed ?? 0,
      heading: telemetry.heading ?? 0,
      movementStatus: telemetry.movementStatus || 'Moving',
      safetyStatus: telemetry.safetyStatus || (current[idx]?.safetyStatus || 'SAFE'),
      riskLevel: telemetry.safetyStatus || (current[idx]?.riskLevel || 'SAFE'),
      riskScore: telemetry.riskScore ?? (current[idx]?.riskScore || 0),
      dangerDistance: telemetry.dangerZoneDistance || current[idx]?.dangerDistance || 'Safe Distance (>1.5 km)',
      routeDeviation: telemetry.routeDeviation || current[idx]?.routeDeviation || 'None',
      selectedTransport: telemetry.selectedTransport || current[idx]?.selectedTransport || 'NOT_SELECTED',
      tripStatus: telemetry.tripStatus || current[idx]?.tripStatus || 'NOT_STARTED',
      aiRiskFactors: telemetry.aiRiskFactors || current[idx]?.aiRiskFactors || [],
      lastUpdated: new Date().toISOString()
    };

    if (idx >= 0) {
      current[idx] = { ...current[idx], ...updates };
      setStoredData(STORAGE_KEYS.TOURISTS, current);
    }

    if (this.isLiveFirebase()) {
      try {
        await updateDoc(doc(db, 'tourists', touristId), updates);
      } catch (e) {}
    }
  },

  // 7. Create & Start Trip Record
  async createTripRecord(tripData) {
    const tripRecord = {
      tripId: tripData.tripId || `trip-${Date.now()}`,
      touristId: tripData.touristId,
      touristTag: tripData.touristTag || tripData.touristId,
      title: tripData.title || 'Karnataka Heritage Excursion',
      startTime: new Date().toISOString(),
      startLocation: tripData.startLocation || { latitude: 12.3052, longitude: 76.6552 },
      destinations: tripData.destinations || [],
      selectedTransport: tripData.selectedTransport || 'train',
      selectedTransportLabel: tripData.selectedTransportLabel || 'Train (Vande Bharat)',
      selectedRoute: tripData.selectedRoute || 'Recommended Safer Route',
      tripStatus: 'ACTIVE',
      riskScore: tripData.riskScore || 0,
      maxRiskScore: tripData.riskScore || 0,
      warningsCount: 0,
      emergencyEventsCount: 0,
      createdAt: new Date().toISOString()
    };

    // Save in Trips Collection
    const trips = getStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    trips.unshift(tripRecord);
    setStoredData(STORAGE_KEYS.TRIPS, trips);

    // Update Tourist Record to tripStatus = 'ACTIVE'
    const tourists = getStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS);
    const tIdx = tourists.findIndex(t => t.touristId === tripData.touristId || t.touristTag === tripData.touristId);
    if (tIdx >= 0) {
      tourists[tIdx].tripStatus = 'ACTIVE';
      tourists[tIdx].selectedTransport = tripRecord.selectedTransport;
      tourists[tIdx].activeTrip = tripRecord.title;
      setStoredData(STORAGE_KEYS.TOURISTS, tourists);
    }

    if (this.isLiveFirebase()) {
      try {
        await setDoc(doc(db, 'trips', tripRecord.tripId), tripRecord);
        await updateDoc(doc(db, 'tourists', tripData.touristId), {
          tripStatus: 'ACTIVE',
          selectedTransport: tripRecord.selectedTransport,
          activeTrip: tripRecord.title
        });
      } catch (e) {}
    }

    return tripRecord;
  },

  // 8. Complete Trip Record & Generate Summary
  async completeTripRecord(tripId, summaryData = {}) {
    const trips = getStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const tripIdx = trips.findIndex(t => t.tripId === tripId);
    
    const completedAt = new Date().toISOString();
    let startTime = new Date(Date.now() - 3600000).toISOString();
    if (tripIdx >= 0 && trips[tripIdx].startTime) {
      startTime = trips[tripIdx].startTime;
    }

    const durationMins = Math.max(15, Math.round((new Date(completedAt) - new Date(startTime)) / 60000));
    
    const finalSummary = {
      completedAt,
      tripStatus: 'COMPLETED',
      durationMins: summaryData.durationMins || durationMins,
      distanceKm: summaryData.distanceKm || 12.8,
      maxRiskScore: summaryData.maxRiskScore || 22,
      warningsCount: summaryData.warningsCount || 0,
      emergencyEventsCount: summaryData.emergencyEventsCount || 0
    };

    if (tripIdx >= 0) {
      trips[tripIdx] = { ...trips[tripIdx], ...finalSummary };
      setStoredData(STORAGE_KEYS.TRIPS, trips);
    }

    // Update Tourist Record to tripStatus = 'COMPLETED'
    const touristId = tripIdx >= 0 ? trips[tripIdx].touristId : summaryData.touristId;
    if (touristId) {
      const tourists = getStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS);
      const tIdx = tourists.findIndex(t => t.touristId === touristId || t.touristTag === touristId);
      if (tIdx >= 0) {
        tourists[tIdx].tripStatus = 'COMPLETED';
        tourists[tIdx].riskScore = 0;
        tourists[tIdx].riskLevel = 'SAFE';
        tourists[tIdx].safetyStatus = 'SAFE';
        setStoredData(STORAGE_KEYS.TOURISTS, tourists);
      }

      if (this.isLiveFirebase()) {
        try {
          await updateDoc(doc(db, 'trips', tripId), finalSummary);
          await updateDoc(doc(db, 'tourists', touristId), {
            tripStatus: 'COMPLETED',
            riskScore: 0,
            riskLevel: 'SAFE'
          });
        } catch (e) {}
      }
    }

    return { ...(tripIdx >= 0 ? trips[tripIdx] : {}), ...finalSummary };
  },

  // 9. Get Tourist Trip History
  getTouristTripHistory(touristId) {
    const trips = getStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    return trips.filter(t => t.touristId === touristId || t.touristTag === touristId);
  },

  // 10. Trigger SOS Event with full Emergency Lifecycle
  async triggerSOS(sosPayload) {
    const emergencyId = `emg-${Date.now()}`;
    const sosEvent = {
      emergencyId,
      id: emergencyId,
      touristId: sosPayload.touristId,
      touristTag: sosPayload.touristTag || sosPayload.touristId,
      touristName: sosPayload.touristName,
      mobile: sosPayload.mobile,
      latitude: sosPayload.latitude,
      longitude: sosPayload.longitude,
      location: `${sosPayload.latitude.toFixed(5)}, ${sosPayload.longitude.toFixed(5)}`,
      gpsAccuracy: sosPayload.gpsAccuracy || 10,
      timestamp: new Date().toISOString(),
      status: 'SOS_RECEIVED', // 'SOS_RECEIVED' ➔ 'ACKNOWLEDGED' ➔ 'RESPONSE_INITIATED' ➔ 'HELP_DISPATCHED' ➔ 'RESOLVED'
      riskScore: 100,
      riskLevel: 'CRITICAL',
      message: sosPayload.message || '🚨 High-Priority Tourist Emergency SOS Broadcasted',
      assignedUnit: 'Mysuru City Police & Emergency Medical Quick Response Team',
      notes: 'Automated GNSS distress trigger lock'
    };

    // Save in Emergencies Collection
    const emergencies = getStoredData(STORAGE_KEYS.EMERGENCIES, []);
    emergencies.unshift(sosEvent);
    setStoredData(STORAGE_KEYS.EMERGENCIES, emergencies);

    // Update Tourist Record
    const currentTourists = getStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS);
    const tIndex = currentTourists.findIndex(t => t.touristId === sosPayload.touristId || t.touristTag === sosPayload.touristId);
    if (tIndex >= 0) {
      currentTourists[tIndex].sosActive = true;
      currentTourists[tIndex].sosStatus = 'ACTIVE';
      currentTourists[tIndex].safetyStatus = 'CRITICAL';
      currentTourists[tIndex].riskLevel = 'CRITICAL';
      currentTourists[tIndex].riskScore = 100;
      currentTourists[tIndex].sosEvent = sosEvent;
      currentTourists[tIndex].aiRiskFactors = [
        '🚨 ACTIVE SOS PANIC BEACON TRIGGERED BY TOURIST',
        'Emergency response protocol initiated automatically',
        'Direct live location streaming enabled for Authority Command Center'
      ];
      setStoredData(STORAGE_KEYS.TOURISTS, currentTourists);
    }

    // Create Alert for Authority Command Center
    const newAlert = {
      id: `alt-${Date.now()}`,
      emergencyId,
      touristId: sosPayload.touristId,
      touristTag: sosPayload.touristTag || sosPayload.touristId,
      touristName: sosPayload.touristName,
      severity: 'CRITICAL',
      type: 'SOS',
      title: '🚨 PRIORITY 1: TOURIST EMERGENCY SOS TRIGGERED',
      message: `${sosPayload.touristName} (${sosPayload.touristTag || sosPayload.touristId}) triggered emergency SOS. GPS coordinates locked.`,
      location: `${sosPayload.latitude.toFixed(5)}, ${sosPayload.longitude.toFixed(5)} (Accuracy: ${sosPayload.gpsAccuracy || 10}m)`,
      timestamp: new Date().toISOString(),
      status: 'SOS_RECEIVED',
      acknowledgedBy: null,
      acknowledgedAt: null
    };

    const currentAlerts = getStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    currentAlerts.unshift(newAlert);
    setStoredData(STORAGE_KEYS.ALERTS, currentAlerts);

    if (this.isLiveFirebase()) {
      try {
        await setDoc(doc(db, 'emergencies', emergencyId), sosEvent);
        await updateDoc(doc(db, 'tourists', sosPayload.touristId), {
          sosActive: true,
          sosStatus: 'ACTIVE',
          safetyStatus: 'CRITICAL',
          riskLevel: 'CRITICAL',
          riskScore: 100,
          sosEvent
        });
        await setDoc(doc(db, 'alerts', newAlert.id), newAlert);
      } catch (e) {}
    }

    return { sosEvent, alert: newAlert };
  },

  // 11. Update SOS Emergency Lifecycle Status
  async updateSOSStatus(touristId, status, notes = '', assignedUnit = null) {
    // Status can be: 'ACKNOWLEDGED' | 'RESPONSE_INITIATED' | 'HELP_DISPATCHED' | 'RESOLVED'
    const tourists = getStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS);
    const tIndex = tourists.findIndex(t => t.touristId === touristId || t.touristTag === touristId);
    
    if (tIndex >= 0) {
      if (tourists[tIndex].sosEvent) {
        tourists[tIndex].sosEvent.status = status;
        if (assignedUnit) tourists[tIndex].sosEvent.assignedUnit = assignedUnit;
        if (notes) tourists[tIndex].sosEvent.notes = notes;
      }
      if (status === 'RESOLVED') {
        tourists[tIndex].sosActive = false;
        tourists[tIndex].sosStatus = 'INACTIVE';
        tourists[tIndex].safetyStatus = 'SAFE';
        tourists[tIndex].riskLevel = 'SAFE';
        tourists[tIndex].riskScore = 15;
        tourists[tIndex].aiRiskFactors = ['Emergency resolved by Authority Command Center'];
      }
      setStoredData(STORAGE_KEYS.TOURISTS, tourists);
    }

    // Update Emergencies Collection
    const emergencies = getStoredData(STORAGE_KEYS.EMERGENCIES, []);
    emergencies.forEach(emg => {
      if (emg.touristId === touristId || emg.touristTag === touristId) {
        emg.status = status;
        if (assignedUnit) emg.assignedUnit = assignedUnit;
        if (notes) emg.notes = notes;
      }
    });
    setStoredData(STORAGE_KEYS.EMERGENCIES, emergencies);

    // Update Alerts Collection
    const alerts = getStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    alerts.forEach(a => {
      if (a.touristId === touristId && a.type === 'SOS') {
        a.status = status;
        if (status === 'ACKNOWLEDGED' || status === 'RESPONSE_INITIATED' || status === 'HELP_DISPATCHED') {
          a.acknowledgedBy = 'Command Officer on Duty';
          a.acknowledgedAt = new Date().toISOString();
        }
      }
    });
    setStoredData(STORAGE_KEYS.ALERTS, alerts);

    if (this.isLiveFirebase()) {
      try {
        await updateDoc(doc(db, 'tourists', touristId), {
          'sosEvent.status': status,
          sosActive: status !== 'RESOLVED',
          sosStatus: status !== 'RESOLVED' ? 'ACTIVE' : 'INACTIVE'
        });
      } catch (e) {}
    }
  },

  // 12. Update Alert Status (Acknowledge / Resolve)
  async updateAlertStatus(alertId, status, acknowledgedBy = 'Authority Dispatcher') {
    const alerts = getStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    const idx = alerts.findIndex(a => a.id === alertId);
    if (idx >= 0) {
      alerts[idx].status = status;
      alerts[idx].acknowledgedBy = acknowledgedBy;
      alerts[idx].acknowledgedAt = new Date().toISOString();
      setStoredData(STORAGE_KEYS.ALERTS, alerts);
    }
  },

  // 13. Danger Zone Management
  async saveDangerZone(zone) {
    const zones = getStoredData(STORAGE_KEYS.DANGER_ZONES, INITIAL_DANGER_ZONES);
    const idx = zones.findIndex(z => z.id === zone.id);
    if (idx >= 0) {
      zones[idx] = { ...zones[idx], ...zone };
    } else {
      zones.push({ ...zone, id: zone.id || `dz-${Date.now()}` });
    }
    setStoredData(STORAGE_KEYS.DANGER_ZONES, zones);
    return zone;
  },

  async deleteDangerZone(zoneId) {
    let zones = getStoredData(STORAGE_KEYS.DANGER_ZONES, INITIAL_DANGER_ZONES);
    zones = zones.filter(z => z.id !== zoneId);
    setStoredData(STORAGE_KEYS.DANGER_ZONES, zones);
  },

  // 14. Reset / Load Hackathon Demo Scenario
  resetToDemoScenario() {
    setStoredData(STORAGE_KEYS.TOURISTS, INITIAL_DEMO_TOURISTS);
    setStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    setStoredData(STORAGE_KEYS.DANGER_ZONES, INITIAL_DANGER_ZONES);
    setStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    setStoredData(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    return {
      tourists: INITIAL_DEMO_TOURISTS,
      trips: INITIAL_TRIPS,
      dangerZones: INITIAL_DANGER_ZONES,
      alerts: INITIAL_ALERTS,
      services: INITIAL_SERVICES
    };
  }
};
