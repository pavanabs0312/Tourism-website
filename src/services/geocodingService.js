import { POPULAR_DESTINATIONS } from '../data/mockData';

/**
 * Geocoding and Place Search Service
 * Connects to OpenStreetMap Nominatim / Photon API with instant curated fallback catalog.
 */

export const geocodingService = {
  /**
   * Search places by text query
   */
  async searchPlaces(query) {
    if (!query || query.trim().length < 2) return [];

    const cleanQuery = query.trim().toLowerCase();

    // 1. First check instant local curated database
    const localMatches = POPULAR_DESTINATIONS.filter(dest =>
      dest.name.toLowerCase().includes(cleanQuery) ||
      dest.location.toLowerCase().includes(cleanQuery) ||
      dest.category.toLowerCase().includes(cleanQuery)
    );

    // 2. Query OpenStreetMap Nominatim API (with countrycode limit to in / global search)
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`;
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
        signal: AbortSignal.timeout(4500)
      });

      if (response.ok) {
        const results = await response.json();
        const apiPlaces = results.map((item, idx) => ({
          id: `osm-${item.place_id || idx}-${Date.now()}`,
          name: item.name || item.display_name.split(',')[0],
          location: item.display_name,
          category: item.type ? item.type.replace('_', ' ').toUpperCase() : 'Attraction / Place',
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          rating: 4.5,
          reviews: 1200,
          description: `Location in ${item.display_name.split(',').slice(-3, -1).join(', ')}.`
        }));

        // Merge without duplicates
        const combined = [...localMatches];
        for (const p of apiPlaces) {
          if (!combined.some(c => c.name.toLowerCase() === p.name.toLowerCase())) {
            combined.push(p);
          }
        }
        return combined.slice(0, 10);
      }
    } catch (e) {
      console.warn('[Geocoding] Nominatim live search offline, using local database:', e.message);
    }

    return localMatches.length > 0 ? localMatches : POPULAR_DESTINATIONS.slice(0, 4);
  },

  /**
   * Reverse Geocode coordinates to address string
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`;
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
        signal: AbortSignal.timeout(4000)
      });
      if (response.ok) {
        const data = await response.json();
        return data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
    } catch (e) {}
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
};
