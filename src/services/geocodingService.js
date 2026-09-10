import { destinationService } from './destinationService';

/**
 * Geocoding and Place Search Service
 * Connects to OpenStreetMap Nominatim for India (countrycodes=in)
 * with instant comprehensive Pan-India curated database integration.
 */

export const geocodingService = {
  /**
   * Search places by text query across India
   */
  async searchPlaces(query) {
    if (!query || query.trim().length < 2) return [];

    const cleanQuery = query.trim().toLowerCase();

    // 1. First search comprehensive curated Pan-India destination database
    const localMatches = destinationService.searchCuratedDestinations(cleanQuery);

    // 2. Query OpenStreetMap Nominatim API limited to India
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=6&addressdetails=1`;
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
        signal: AbortSignal.timeout(4500)
      });

      if (response.ok) {
        const results = await response.json();
        const apiPlaces = results.map((item, idx) => ({
          id: `osm-${item.place_id || idx}`,
          name: item.name || item.display_name.split(',')[0],
          location: item.display_name,
          category: item.type ? item.type.replace(/_/g, ' ').toUpperCase() : 'Attraction / Place',
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
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

    // Return exact matches or empty array if nothing found (NO fake fallbacks)
    return localMatches;
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
