import { calculateDistanceInMeters, formatDistance } from './locationService';

/**
 * POI Service (OpenStreetMap & Overpass API)
 * Queries real-world verified Hotels, Restaurants, and Rest/Fuel Facilities
 * along actual OSRM road route geometry and around live GPS locations.
 */

export const poiService = {
  /**
   * Sample key coordinate points along an OSRM route polyline
   * (e.g. Origin, 25%, 50%, 75%, and Destination)
   */
  sampleRoutePoints(coordinates = [], sampleCount = 4) {
    if (!coordinates || coordinates.length === 0) return [];
    if (coordinates.length <= sampleCount) return coordinates;

    const sampled = [];
    const step = Math.floor(coordinates.length / (sampleCount + 1));

    // Always include origin
    sampled.push({
      coords: coordinates[0],
      label: '📍 Near Current Origin',
      segment: 'ORIGIN',
      ratio: 0
    });

    // Milestone points along highway
    for (let i = 1; i <= sampleCount; i++) {
      const idx = Math.min(coordinates.length - 1, i * step);
      const ratio = (idx / coordinates.length).toFixed(2);
      sampled.push({
        coords: coordinates[idx],
        label: `🛣️ Route Waypoint (~${Math.round(ratio * 100)}% of journey)`,
        segment: 'WAYPOINT',
        ratio: parseFloat(ratio)
      });
    }

    // Always include destination
    sampled.push({
      coords: coordinates[coordinates.length - 1],
      label: '🏁 Near Destination',
      segment: 'DESTINATION',
      ratio: 1
    });

    return sampled;
  },

  /**
   * Query Overpass API for real POIs around a coordinate within a radius
   */
  async fetchOverpassPoisAtCoordinate(latitude, longitude, radiusMeters = 5000) {
    const overpassQuery = `
      [out:json][timeout:8];
      (
        node["tourism"~"hotel|guest_house|motel|resort|chalet|hostel"](around:${radiusMeters},${latitude},${longitude});
        node["amenity"~"restaurant|fast_food|cafe|food_court"](around:${radiusMeters},${latitude},${longitude});
        node["amenity"~"fuel"](around:${radiusMeters},${latitude},${longitude});
      );
      out body 12;
    `;

    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(overpassQuery)}`,
          signal: AbortSignal.timeout(6000)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.elements && data.elements.length > 0) {
            return data.elements.map(el => {
              const tags = el.tags || {};
              const isHotel = Boolean(tags.tourism && /hotel|guest_house|motel|resort|chalet|hostel/i.test(tags.tourism));
              const isFood = Boolean(tags.amenity && /restaurant|fast_food|cafe|food_court/i.test(tags.amenity));
              const isFuel = Boolean(tags.amenity === 'fuel');

              let category = 'POI';
              let categoryLabel = 'Verified Facility';
              if (isHotel) {
                category = 'HOTEL';
                categoryLabel = '🏨 Hotel & Stay';
              } else if (isFood) {
                category = 'RESTAURANT';
                categoryLabel = '🍴 Restaurant & Dining';
              } else if (isFuel) {
                category = 'REST_STOP';
                categoryLabel = '⛽ Fuel & Highway Rest Stop';
              }

              const name = tags.name || tags['name:en'] || (isHotel ? 'Highway Traveler Hotel' : (isFood ? 'Highway Dining / Dhaba' : 'Highway Rest Stop'));
              const cuisine = tags.cuisine ? tags.cuisine.replace(/_/g, ' ') : (isFood ? 'Regional Cuisine' : null);
              const brand = tags.brand || tags.operator || null;

              return {
                id: `osm-${el.id}`,
                osmId: el.id,
                name,
                category,
                categoryLabel,
                latitude: el.lat,
                longitude: el.lon,
                cuisine,
                brand,
                address: tags['addr:street'] || tags['addr:city'] || 'Along route corridor',
                phone: tags.phone || tags['contact:phone'] || null,
                openingHours: tags.opening_hours || 'Standard Hours',
                source: 'OpenStreetMap Live'
              };
            });
          }
        }
      } catch (err) {
        console.warn(`[POI] Overpass API query failed at ${endpoint}:`, err.message);
      }
    }

    // Fallback: Query Nominatim if Overpass is temporarily unavailable
    return this.fetchNominatimFallbackPois(latitude, longitude);
  },

  /**
   * Fast Nominatim POI Fallback for coordinates
   */
  async fetchNominatimFallbackPois(latitude, longitude) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=hotel+restaurant&limit=8&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (response.ok) {
        const results = await response.json();
        return results.map(item => {
          const isHotel = /hotel|guest|motel|resort|lodge/i.test(item.display_name);
          return {
            id: `osm-nom-${item.place_id}`,
            osmId: item.place_id,
            name: item.name || item.display_name.split(',')[0],
            category: isHotel ? 'HOTEL' : 'RESTAURANT',
            categoryLabel: isHotel ? '🏨 Hotel & Stay' : '🍴 Restaurant & Food',
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            address: item.display_name.split(',').slice(0, 3).join(','),
            source: 'OpenStreetMap Nominatim'
          };
        });
      }
    } catch (e) {
      console.warn('[POI] Nominatim fallback failed:', e.message);
    }

    return [];
  },

  /**
   * Main Method: Fetch Real On-The-Way POIs along an OSRM route geometry
   * Queries real OSM data sampled across the actual driving route.
   */
  async fetchPoisAlongRoute(coordinates = [], sampleCount = 4) {
    if (!coordinates || coordinates.length === 0) return { hotels: [], restaurants: [], restStops: [] };

    const sampledPoints = this.sampleRoutePoints(coordinates, sampleCount);
    const allPois = [];

    // Query sampled points concurrently
    const queries = sampledPoints.map(async (sample) => {
      const pois = await this.fetchOverpassPoisAtCoordinate(sample.coords[0], sample.coords[1], 6000);
      return pois.map(p => {
        const distFromSample = calculateDistanceInMeters(
          sample.coords[0], sample.coords[1],
          p.latitude, p.longitude
        );
        return {
          ...p,
          routeSegmentLabel: sample.label,
          segmentType: sample.segment,
          routeRatio: sample.ratio,
          distanceFromRouteMeters: distFromSample,
          distanceFormatted: formatDistance(distFromSample)
        };
      });
    });

    const results = await Promise.allSettled(queries);
    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        allPois.push(...res.value);
      }
    });

    // Deduplicate by OSM ID or name
    const uniqueMap = new Map();
    allPois.forEach(p => {
      const key = p.name.toLowerCase().trim();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, p);
      }
    });

    const deduplicated = Array.from(uniqueMap.values());

    return {
      hotels: deduplicated.filter(p => p.category === 'HOTEL'),
      restaurants: deduplicated.filter(p => p.category === 'RESTAURANT'),
      restStops: deduplicated.filter(p => p.category === 'REST_STOP')
    };
  },

  /**
   * Fetch nearby POIs around the tourist's current real GPS location
   */
  async fetchPoisNearLocation(latitude, longitude, radiusMeters = 4000) {
    const pois = await this.fetchOverpassPoisAtCoordinate(latitude, longitude, radiusMeters);
    return pois.map(p => {
      const dist = calculateDistanceInMeters(latitude, longitude, p.latitude, p.longitude);
      return {
        ...p,
        distanceFromTouristMeters: dist,
        distanceFormatted: formatDistance(dist)
      };
    }).sort((a, b) => a.distanceFromTouristMeters - b.distanceFromTouristMeters);
  }
};
