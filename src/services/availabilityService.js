/**
 * Availability Service - AI Tourism Guardian
 * Manages live booking availability state and data transparency.
 * Clearly identifies verified live data vs simulated demo scenarios.
 */

export const availabilityService = {
  /**
   * Check if live enterprise booking API key is configured
   */
  isLiveApiConfigured() {
    return Boolean(
      import.meta.env.VITE_HOTEL_API_KEY &&
      import.meta.env.VITE_HOTEL_API_KEY !== 'placeholder' &&
      import.meta.env.VITE_HOTEL_API_KEY !== 'undefined'
    );
  },

  /**
   * Get availability status descriptor for a hotel or booking
   */
  getAvailabilityStatus(hotelId) {
    const isLive = this.isLiveApiConfigured();
    if (isLive) {
      return {
        isLive: true,
        badge: 'Live Availability',
        message: 'Direct live inventory from central reservation system.'
      };
    }

    return {
      isLive: false,
      badge: 'Live availability is currently unavailable',
      message: 'Direct reservations require connecting hotel booking engine. Contact property directly for instant reservations.',
      demoNotice: 'DEMO MODE: Availability and pricing shown in Demo Mode are simulated for demonstration purposes.'
    };
  },

  /**
   * Standardized demo notice string
   */
  getDemoDisclaimer() {
    return 'DEMO MODE: Some hotel inventory, pricing, and live room counts are shown for demonstration and academic evaluation purposes. Connect your live OTA/GDS API key for real-time rates.';
  }
};
