import { calculateDistanceInMeters } from './locationService';

/**
 * Smart Multi-Modal Transport Service
 * Compares multi-modal options: Walking, Bus, Train, Metro, Taxi, Flight.
 * Calculates Fastest, Cheapest, and Recommended Safer modes with transparent data indicators.
 */

export const transportService = {
  /**
   * Compare multi-modal options between origin and destination coordinates/names
   */
  compareTransportOptions({
    fromName = 'Bengaluru City Center',
    toName = 'Mysuru Palace',
    fromCoords = [12.9716, 77.5946],
    toCoords = [12.3052, 76.6552],
    departureDate = new Date().toISOString().split('T')[0],
    departureTime = '09:00'
  }) {
    const directDistanceMeters = calculateDistanceInMeters(
      fromCoords[0], fromCoords[1],
      toCoords[0], toCoords[1]
    );
    const distanceKm = Math.max(8, Math.round(directDistanceMeters / 1000));

    const isLongDistance = distanceKm > 150;
    const isMediumDistance = distanceKm > 30 && distanceKm <= 150;
    const isShortDistance = distanceKm <= 30;

    const options = [];

    // 1. Train / Vande Bharat / Superfast Express
    if (isMediumDistance || isLongDistance) {
      options.push({
        id: 'opt-train-1',
        mode: 'train',
        modeLabel: 'Train (Vande Bharat / Shatabdi)',
        icon: '🚆',
        provider: 'Indian Railways / SWR',
        durationHours: (distanceKm / 85).toFixed(1),
        durationFormatted: `${Math.floor(distanceKm / 85)}h ${Math.round(((distanceKm / 85) % 1) * 60)}m`,
        estimatedFare: isLongDistance ? 850 : 250,
        transfers: 0,
        safetyScore: 96,
        convenienceScore: 92,
        routeDetails: `${fromName} Railway Junction ➔ ${toName} Railway Station (Express Corridor)`,
        scheduleInfo: 'Daily at 06:00, 09:15, 14:20, 18:30',
        co2Emissions: 'Low (Eco-Friendly)',
        sampleDataBadge: 'Sample Timetable — Connectable to IRCTC / Live Rail API',
        tags: ['FASTEST INTER-CITY', 'SAFER']
      });
    }

    // 2. Bus / KSRTC Airavat Club Class
    options.push({
      id: 'opt-bus-1',
      mode: 'bus',
      modeLabel: 'Bus (KSRTC Airavat / Express)',
      icon: '🚌',
      provider: 'State Road Transport (KSRTC/BMTC)',
      durationHours: (distanceKm / 45).toFixed(1),
      durationFormatted: `${Math.floor(distanceKm / 45)}h ${Math.round(((distanceKm / 45) % 1) * 60)}m`,
      estimatedFare: isLongDistance ? 420 : (isMediumDistance ? 180 : 45),
      transfers: isShortDistance ? 1 : 0,
      safetyScore: 86,
      convenienceScore: 84,
      routeDetails: 'Main State Highway / Expressway Bus Stand Direct Service',
      scheduleInfo: 'Buses every 20 minutes from central bus terminal',
      co2Emissions: 'Medium-Low',
      sampleDataBadge: 'Sample Schedule — Ready for KSRTC/GTFS Integration',
      tags: ['CHEAPEST']
    });

    // 3. Taxi / Cab (Uber / Ola / Tourist Taxi)
    options.push({
      id: 'opt-taxi-1',
      mode: 'taxi',
      modeLabel: 'Private Cab / Taxi (Sedan / SUV)',
      icon: '🚕',
      provider: 'Tourist Fleet / App Cabs',
      durationHours: (distanceKm / 60).toFixed(1),
      durationFormatted: `${Math.floor(distanceKm / 60)}h ${Math.round(((distanceKm / 60) % 1) * 60)}m`,
      estimatedFare: Math.round(distanceKm * 16 + 200),
      transfers: 0,
      safetyScore: 89,
      convenienceScore: 98,
      routeDetails: 'Door-to-door direct via National Expressway with verified tourist driver',
      scheduleInfo: 'Instant on-demand pickup (5-10 mins ETA)',
      co2Emissions: 'High',
      sampleDataBadge: 'Sample Fare Calculator — Connectable to Uber/Ola Fleet APIs',
      tags: ['MOST CONVENIENT']
    });

    // 4. Metro (For intra-city routes)
    if (isShortDistance || distanceKm < 45) {
      options.push({
        id: 'opt-metro-1',
        mode: 'metro',
        modeLabel: 'Namma Metro / Rapid Transit',
        icon: '🚇',
        provider: 'Urban Metro Rail Corporation',
        durationHours: (distanceKm / 35).toFixed(1),
        durationFormatted: `${Math.round((distanceKm / 35) * 60)} mins`,
        estimatedFare: 40,
        transfers: 1,
        safetyScore: 98,
        convenienceScore: 90,
        routeDetails: 'Purple / Green Line Transit with CCTV surveillance & women-only coaches',
        scheduleInfo: 'Trains every 5-8 mins from 05:00 AM to 11:00 PM',
        co2Emissions: 'Zero Direct Emissions',
        sampleDataBadge: 'Sample Metro Feeder Data — GTFS Ready',
        tags: ['SAFEST INTRA-CITY']
      });
    }

    // 5. Flight (For long distances > 300km)
    if (isLongDistance && distanceKm > 300) {
      options.push({
        id: 'opt-flight-1',
        mode: 'flight',
        modeLabel: 'Commercial Flight (Economy)',
        icon: '✈️',
        provider: 'Regional Airlines',
        durationHours: '1.2',
        durationFormatted: '1h 15m (+ 1.5h airport check-in)',
        estimatedFare: 3400,
        transfers: 0,
        safetyScore: 94,
        convenienceScore: 80,
        routeDetails: 'Nearest International / Domestic Airport Direct Flight',
        scheduleInfo: '3 flights scheduled daily',
        co2Emissions: 'Very High',
        sampleDataBadge: 'Sample Flight Matrix — Connectable to Amadeus / Skyscanner API',
        tags: ['FASTEST OVER LONG DISTANCE']
      });
    }

    // 6. Walking / Cycling (For ultra-short distances < 6km)
    if (distanceKm <= 6) {
      options.push({
        id: 'opt-walk-1',
        mode: 'walking',
        modeLabel: 'Pedestrian Walk / Heritage Trail',
        icon: '🚶',
        provider: 'Self-guided Walking Path',
        durationHours: (distanceKm / 4.5).toFixed(1),
        durationFormatted: `${Math.round((distanceKm / 4.5) * 60)} mins`,
        estimatedFare: 0,
        transfers: 0,
        safetyScore: 85,
        convenienceScore: 78,
        routeDetails: 'Paved pedestrian sidewalks and tourist promenade',
        scheduleInfo: 'Anytime during daytime',
        co2Emissions: 'Zero',
        sampleDataBadge: 'Active Pedestrian Walkway Calculation',
        tags: ['ZERO COST', 'ECO-FRIENDLY']
      });
    }

    // Identify Highlights
    const fastest = [...options].sort((a, b) => parseFloat(a.durationHours) - parseFloat(b.durationHours))[0];
    const cheapest = [...options].sort((a, b) => a.estimatedFare - b.estimatedFare)[0];
    const safer = [...options].sort((a, b) => b.safetyScore - a.safetyScore)[0];

    return {
      options,
      highlights: {
        fastestId: fastest?.id,
        cheapestId: cheapest?.id,
        saferId: safer?.id
      },
      summary: {
        distanceKm,
        origin: fromName,
        destination: toName,
        date: departureDate,
        time: departureTime
      }
    };
  }
};
