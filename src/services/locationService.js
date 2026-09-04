/**
 * Location Service
 * Handles browser Geolocation API, GPS accuracy categorization, distance math,
 * speed calculations, and movement status classification.
 */

// Haversine formula to compute distance between two coordinates in meters
export const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Format distance nicely
export const formatDistance = (meters) => {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
};

// Classify GPS Accuracy
export const classifyGpsAccuracy = (accuracyMeters) => {
  if (!accuracyMeters && accuracyMeters !== 0) {
    return {
      category: 'UNKNOWN',
      label: 'GPS Pending...',
      isHighPrecision: false,
      note: 'Acquiring satellite lock...'
    };
  }

  if (accuracyMeters <= 20) {
    return {
      category: 'HIGH',
      label: `GPS Accuracy: ±${Math.round(accuracyMeters)}m (High Precision)`,
      isHighPrecision: true,
      note: 'Satellite GNSS lock active'
    };
  } else if (accuracyMeters <= 100) {
    return {
      category: 'MEDIUM',
      label: `GPS Accuracy: ±${Math.round(accuracyMeters)}m (Medium)`,
      isHighPrecision: false,
      note: 'Cell tower / Assisted GPS assisted'
    };
  } else if (accuracyMeters <= 1000) {
    return {
      category: 'LOW',
      label: `GPS Accuracy: ±${Math.round(accuracyMeters)}m (Low)`,
      isHighPrecision: false,
      note: 'Wi-Fi / Network triangular estimate'
    };
  } else {
    return {
      category: 'VERY_LOW',
      label: `GPS Accuracy: ±${Math.round(accuracyMeters / 1000)}km (IP/Laptop Estimate)`,
      isHighPrecision: false,
      note: 'Laptop location is estimated via Wi-Fi/IP. For high precision live GNSS, test on an HTTPS mobile device.'
    };
  }
};

export const locationService = {
  watchId: null,
  lastPosition: null,
  lastTimestamp: null,
  stationaryStartTime: null,

  // Start real-time GPS tracking using browser Geolocation
  startWatching(onLocationUpdate, onError) {
    if (!navigator.geolocation) {
      if (onError) onError(new Error('Geolocation is not supported by your browser.'));
      return null;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20000
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, heading } = position.coords;
        const now = Date.now();

        let calculatedSpeed = speed ? speed * 3.6 : 0; // m/s to km/h
        let distanceMoved = 0;

        if (this.lastPosition) {
          distanceMoved = calculateDistanceInMeters(
            this.lastPosition.latitude,
            this.lastPosition.longitude,
            latitude,
            longitude
          );

          // If device does not provide hardware speed, calculate via delta
          if (speed === null || speed === undefined) {
            const timeDiffHours = (now - this.lastTimestamp) / (1000 * 3600);
            if (timeDiffHours > 0 && distanceMoved > 5) {
              calculatedSpeed = (distanceMoved / 1000) / timeDiffHours;
            }
          }
        }

        // Determine movement status
        let movementStatus = 'Stationary';
        if (calculatedSpeed > 25) {
          movementStatus = 'Moving (Vehicle / Transit)';
          this.stationaryStartTime = null;
        } else if (calculatedSpeed > 1.5) {
          movementStatus = 'Moving (Walking / Jogging)';
          this.stationaryStartTime = null;
        } else if (calculatedSpeed > 0.3) {
          movementStatus = 'Slow Movement';
          this.stationaryStartTime = null;
        } else {
          if (!this.stationaryStartTime) this.stationaryStartTime = now;
          const stationaryMinutes = Math.round((now - this.stationaryStartTime) / 60000);
          movementStatus = stationaryMinutes > 15 
            ? `Stationary (${stationaryMinutes} mins)` 
            : 'Stationary';
        }

        this.lastPosition = { latitude, longitude };
        this.lastTimestamp = now;

        const telemetry = {
          latitude,
          longitude,
          accuracy: accuracy ? Math.round(accuracy) : 15,
          speed: Math.round(calculatedSpeed * 10) / 10,
          heading: heading || 0,
          distanceMoved,
          movementStatus,
          timestamp: new Date().toISOString(),
          accuracyInfo: classifyGpsAccuracy(accuracy)
        };

        if (onLocationUpdate) onLocationUpdate(telemetry);
      },
      (err) => {
        console.warn('Geolocation watch error:', err.message);
        if (onError) onError(err);
      },
      options
    );

    return this.watchId;
  },

  // Stop watching GPS
  stopWatching() {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  },

  // Single GPS position retrieval
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 15,
            timestamp: new Date().toISOString()
          });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  }
};
