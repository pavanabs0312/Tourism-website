/**
 * Trip Service - AI Tourism Guardian
 * Dynamic Date-Driven Trip Planning & Dynamic Itinerary Engine
 * Generates tailored day-by-day itineraries based on real dates, duration,
 * and actual attractions of any destination across India.
 */

import { destinationService } from './destinationService';
import { calculateDistanceKm } from './hotelService';

export const tripService = {
  /**
   * Calculate real trip duration between two calendar dates.
   * Specification:
   * - 10 Sep to 13 Sep = 3 Days / 2 Nights (diffDays = 3)
   * - 10 Sep to 15 Sep = 5 Days / 4 Nights (diffDays = 5)
   * - 10 Sep to 20 Sep = 10 Days / 9 Nights (diffDays = 10)
   * - 10 Sep to 10 Sep = 1 Day (Day Trip) (diffDays = 0)
   */
  calculateTripDuration(startDateStr, endDateStr) {
    if (!startDateStr) {
      return {
        days: 1,
        nights: 0,
        label: '1 Day (Day Trip)',
        diffDays: 0,
        isDayTrip: true,
        isValid: false,
        error: 'Start date is required'
      };
    }

    const start = new Date(startDateStr);
    const end = endDateStr ? new Date(endDateStr) : new Date(startDateStr);

    // Normalize to midnight UTC to prevent daylight-saving / timezone shifting issues
    const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    const diffMs = endUtc - startUtc;
    const diffDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

    if (diffDays === 0) {
      return {
        days: 1,
        nights: 0,
        label: '1 Day (Day Trip)',
        diffDays: 0,
        isDayTrip: true,
        isValid: true
      };
    }

    const days = diffDays;
    const nights = Math.max(1, diffDays - 1);
    const label = `${days} Days / ${nights} Night${nights > 1 ? 's' : ''}`;

    return {
      days,
      nights,
      label,
      diffDays,
      isDayTrip: false,
      isValid: true
    };
  },

  /**
   * Format a date string into readable Indian format: e.g. "12 Sep 2026"
   */
  formatDateReadable(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  },

  /**
   * Generate dynamic day-by-day itinerary tailored to exact days and destination's real attractions
   */
  generateItinerary({
    destination,
    days = 3,
    startDate = '',
    travelStyle = 'Culture & Heritage',
    pace = 'Balanced',
    travelersCount = 2
  }) {
    // 1. Resolve destination details
    let destObj = null;
    if (typeof destination === 'object' && destination !== null) {
      destObj = destination;
    } else if (typeof destination === 'string') {
      destObj = destinationService.getDestinationById(destination) ||
                destinationService.getCuratedDestinations().find(d =>
                  d.name.toLowerCase() === destination.toLowerCase() ||
                  destination.toLowerCase().includes(d.name.toLowerCase())
                );
    }

    const destName = destObj ? destObj.name : (typeof destination === 'string' ? destination : 'Destination');
    const destState = destObj ? destObj.state : 'India';
    const attractions = (destObj && destObj.popularAttractions && destObj.popularAttractions.length > 0)
      ? destObj.popularAttractions
      : [
          `${destName} City Center & Historic Quarter`,
          `${destName} Heritage Museum & Memorial`,
          `${destName} Cultural Promenade & Local Bazaar`,
          `${destName} Scenic Panorama & Sunset Viewpoint`,
          `${destName} Traditional Artisan Village`
        ];

    const thingsToDo = (destObj && destObj.thingsToDo && destObj.thingsToDo.length > 0)
      ? destObj.thingsToDo
      : [
          `Morning walking tour of historical landmarks in ${destName}`,
          `Sample authentic regional street food and specialties`,
          `Explore vibrant local craft markets with certified guides`,
          `Photography walk along heritage corridors during golden hour`
        ];

    const itineraryDays = [];
    const baseDate = startDate ? new Date(startDate) : new Date();

    for (let dayNum = 1; dayNum <= days; dayNum++) {
      const dayDate = new Date(baseDate);
      dayDate.setDate(baseDate.getDate() + (dayNum - 1));
      const formattedDate = dayDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });

      // Distribute real attractions across the days
      const morningAttraction = attractions[(dayNum * 2 - 2) % attractions.length];
      const afternoonAttraction = attractions[(dayNum * 2 - 1) % attractions.length];
      const activityTip = thingsToDo[(dayNum - 1) % thingsToDo.length];

      let dayTheme = '';
      if (dayNum === 1) {
        dayTheme = `Arrival, Monument Orientation & Heritage First Impressions`;
      } else if (dayNum === days && days > 1) {
        dayTheme = `Artisan Trails, Local Cuisine & Fond Farewell`;
      } else if (dayNum === 2) {
        dayTheme = `Deep Cultural Immersion & Architectural Highlights`;
      } else if (dayNum === 3) {
        dayTheme = `Excursions, Nature Walk & Panoramic Sunset Viewpoints`;
      } else {
        dayTheme = `Hidden Gems, Cultural Neighborhoods & Leisure Exploration`;
      }

      itineraryDays.push({
        dayNumber: dayNum,
        date: formattedDate,
        title: `Day ${dayNum}: ${dayTheme}`,
        morning: {
          time: '08:00 AM – 12:00 PM',
          activity: `Guided visit to ${morningAttraction}`,
          details: `Arrive early to experience optimal morning light and skip peak tourist queues. Pre-booked certified guide recommended.`,
          attraction: morningAttraction
        },
        afternoon: {
          time: '01:00 PM – 04:30 PM',
          activity: `Explore ${afternoonAttraction} & Regional Lunch`,
          details: `Savor authentic local delicacies at a verified heritage diner, followed by in-depth tour of the site courtyards and exhibition galleries.`,
          attraction: afternoonAttraction
        },
        evening: {
          time: '05:30 PM – 08:30 PM',
          activity: activityTip,
          details: `Enjoy ambient evening lighting, sunset photography, and a leisurely stroll along the safety-patrolled tourist corridor.`
        },
        meals: {
          breakfast: 'Included at Hotel / Traditional Breakfast',
          lunch: 'Regional Specialties at Verified Restaurant',
          dinner: 'Authentic Local Dinner & Cultural Music'
        },
        safetyTip: 'Tourist Police kiosks are active at major monument gates. Keep official digital tickets and emergency contacts saved on your phone.'
      });
    }

    return {
      destination: destName,
      state: destState,
      totalDays: days,
      travelStyle,
      pace,
      travelersCount,
      itineraryDays,
      budgetEstimate: destObj ? destObj.estimatedBudget : '₹3,000 – ₹6,000 / day',
      safetyOverview: destObj ? destObj.safetyOverview : 'Tourist Police 24/7 patrol in central heritage zones.',
      transportTips: destObj ? destObj.transportOptions : ['Official prepaid taxi / auto-rickshaw', 'Rail connectivity to central station']
    };
  },

  /**
   * Estimate transit options and approximate travel distance between coordinates
   */
  estimateTransit(originCoords, destCoords) {
    if (!originCoords || !destCoords) return null;
    const distanceKm = calculateDistanceKm(originCoords[0], originCoords[1], destCoords[0], destCoords[1]);
    if (!distanceKm) return null;

    let mode = 'Car / Highway Drive';
    let duration = `${Math.round(distanceKm / 55)} - ${Math.round(distanceKm / 45)} hrs`;
    if (distanceKm > 600) {
      mode = 'Flight / Express Rail';
      duration = `Flight: ~2 hrs | Train: ~12-16 hrs`;
    } else if (distanceKm > 250) {
      mode = 'Vande Bharat / Express Train or Highway';
      duration = `Train: ~4-6 hrs | Road: ~${Math.round(distanceKm / 50)} hrs`;
    }

    return {
      distanceKm,
      recommendedMode: mode,
      estimatedDuration: duration
    };
  }
};
