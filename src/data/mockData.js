// Initial configured Danger Zones (Geo-fence safety indicators)
export const INITIAL_DANGER_ZONES = [
  {
    id: 'dz-1',
    name: 'Chamundi Foothills Isolated Section',
    latitude: 12.2850,
    longitude: 76.6710,
    radius: 450, // in meters
    severity: 'HIGH',
    reason: 'Unlit forested corridor, limited cell reception & wildlife activity after dusk',
    active: true
  },
  {
    id: 'dz-2',
    name: 'KRS Dam North Canal Spillway Area',
    latitude: 12.4280,
    longitude: 76.5720,
    radius: 600,
    severity: 'CRITICAL',
    reason: 'Active water surge channel, steep slippery embankments, restricted swimming zone',
    active: true
  },
  {
    id: 'dz-3',
    name: 'Devaraja Market South Congestion Bottleneck',
    latitude: 12.3085,
    longitude: 76.6505,
    radius: 350,
    severity: 'CAUTION',
    reason: 'Heavy tourist pedestrian density, pickpocketing alerts during festival hours',
    active: true
  },
  {
    id: 'dz-4',
    name: 'Kabini Riverbank Outer Silt Bed',
    latitude: 12.0120,
    longitude: 76.4430,
    radius: 500,
    severity: 'HIGH',
    reason: 'Soft silt sink hazard, flash water discharge warning from upstream barrage',
    active: true
  }
];

// Initial Curated Destinations for AI Trip Planner & Geocoding fallback
export const POPULAR_DESTINATIONS = [
  {
    id: 'dest-1',
    name: 'Mysore Palace (Amba Vilas)',
    location: 'Sayyaji Rao Rd, Mysuru, Karnataka',
    category: 'Heritage Landmark',
    latitude: 12.3052,
    longitude: 76.6552,
    rating: 4.8,
    reviews: 142000,
    timings: '10:00 AM - 05:30 PM',
    entryFee: '₹100 (Adults), ₹50 (Children)',
    description: 'Iconic historical palace and royal residence of the Wadiyar dynasty featuring grand Indo-Saracenic architecture.'
  },
  {
    id: 'dest-2',
    name: 'Chamundeshwari Temple & Chamundi Hills',
    location: 'Chamundi Hill Rd, Mysuru, Karnataka',
    category: 'Temple & Scenic Viewpoint',
    latitude: 12.2753,
    longitude: 76.6705,
    rating: 4.7,
    reviews: 89000,
    timings: '07:30 AM - 02:00 PM, 03:30 PM - 09:00 PM',
    entryFee: 'Free entry (Special darshan ₹100)',
    description: 'Ancient hilltop Hindu temple dedicated to Goddess Chamundeshwari, offering panoramic valley views of Mysore.'
  },
  {
    id: 'dest-3',
    name: 'KRS Dam / Brindavan Gardens Destination Area',
    location: 'Krishnarajasagara, Mandya/Mysuru, Karnataka',
    category: 'Reservoir & Botanical Gardens',
    latitude: 12.4244,
    longitude: 76.5742,
    rating: 4.5,
    reviews: 110000,
    timings: '06:30 AM - 09:00 PM (Musical Fountain at 07:00 PM)',
    entryFee: '₹50 per person',
    description: 'Prominent destination area comprising the historic Krishnarajasagara dam on Kaveri River and the adjoining illuminated terraced Brindavan Gardens.'
  },
  {
    id: 'dest-4',
    name: 'Sri Chamarajendra Zoological Gardens (Mysuru Zoo)',
    location: 'Indiranagar, Ittige Gudu, Mysuru, Karnataka',
    category: 'Wildlife Sanctuary & Zoo',
    latitude: 12.3025,
    longitude: 76.6644,
    rating: 4.6,
    reviews: 95000,
    timings: '08:30 AM - 05:30 PM (Weekly holiday: Tuesday)',
    entryFee: '₹120 (Adults), ₹60 (Children)',
    officialInfo: {
      openingHours: '8:30 AM – 5:30 PM',
      weeklyHoliday: 'Tuesday',
      adultEntry: '₹120',
      source: 'Official Mysore Zoo Authority'
    },
    description: 'Founded in 1892, one of the oldest and best-maintained zoos in India. Features spacious natural habitats, cheetah sanctuary, white tigers, and serene walk-through pathways.'
  },
  {
    id: 'dest-5',
    name: 'Karanji Lake & Nature Park',
    location: 'Jockey Quarters, Mysuru, Karnataka',
    category: 'Eco-Tourism & Lake',
    latitude: 12.3022,
    longitude: 76.6750,
    rating: 4.5,
    reviews: 28000,
    timings: '08:30 AM - 05:30 PM (Closed Tuesdays)',
    entryFee: '₹50 per adult',
    description: 'Picturesque freshwater lake surrounded by a butterfly park and India’s largest walk-through aviary.'
  }
];

// Initial Tourism & Emergency Services Directory
export const INITIAL_SERVICES = [
  {
    id: 'srv-1',
    name: 'Mysuru City Central Police Station',
    category: 'police',
    categoryLabel: 'Police Station',
    latitude: 12.3090,
    longitude: 76.6515,
    phone: '112 / 0821-2418100',
    address: 'Near K.R. Circle, Ashoka Road, Mysuru',
    rating: 4.7,
    openStatus: 'Open 24/7 (Emergency Response Unit Active)'
  },
  {
    id: 'srv-2',
    name: 'K.R. Hospital & Emergency Trauma Care',
    category: 'hospital',
    categoryLabel: 'Hospital & Emergency Trauma',
    latitude: 12.3130,
    longitude: 76.6500,
    phone: '108 / 0821-2520512',
    address: 'Sayyaji Rao Road, Opp Government Medical College, Mysuru',
    rating: 4.5,
    openStatus: 'Open 24/7 (Level 1 Trauma Care)'
  },
  {
    id: 'srv-3',
    name: 'Grand Mercure Mysuru',
    category: 'hotel',
    categoryLabel: 'Luxury Hotel & Suites',
    latitude: 12.3275,
    longitude: 76.6340,
    phone: '+91 821 402 1212',
    address: 'Nelson Mandela Road, New Sayyaji Rao Rd, Mysuru',
    rating: 4.6,
    openStatus: 'Check-in: 2:00 PM | 24/7 Reception'
  },
  {
    id: 'srv-4',
    name: 'Hotel Radisson Blu Plaza',
    category: 'hotel',
    categoryLabel: 'Hotel & Resort',
    latitude: 12.3000,
    longitude: 76.6660,
    phone: '+91 821 710 1234',
    address: '1 MG Road, Ittige Gudu, Mysuru',
    rating: 4.7,
    openStatus: '24/7 Front Desk'
  },
  {
    id: 'srv-5',
    name: 'Mylari Dosa Heritage Restaurant',
    category: 'restaurant',
    categoryLabel: 'Traditional South Indian Dining',
    latitude: 12.3070,
    longitude: 76.6590,
    phone: '+91 94486 08710',
    address: 'Nazarbad Main Rd, Near Police Station, Mysuru',
    rating: 4.8,
    openStatus: 'Open: 06:30 AM - 01:30 PM, 03:00 PM - 08:30 PM'
  },
  {
    id: 'srv-6',
    name: 'Mysuru Junction Railway Station & Tourist Helpdesk',
    category: 'transport',
    categoryLabel: 'Railway Transit & Tourist Information',
    latitude: 12.3155,
    longitude: 76.6432,
    phone: '139 (Indian Railways) / 0821-2420103',
    address: 'Station Rd, Medar Block, Yadavagiri, Mysuru',
    rating: 4.3,
    openStatus: 'Open 24/7'
  }
];

// 4 FIXED MULTI-MODAL TOURISTS WITH INCREASING PARTY SIZES (2, 3, 4, 5)
export const INITIAL_DEMO_TOURISTS = [
  // 1st Person: Own Car (2 People)
  {
    touristId: 'TG-2026-752019',
    touristTag: 'TG-2026-752019',
    name: 'Pavana Sharma',
    mobile: '+91 98765 43210',
    email: 'pavana.sharma@example.com',
    emergencyContact: 'Suresh Sharma (Father)',
    emergencyContactNumber: '+91 98765 43211',
    preferredLanguage: 'Kannada / English',
    selectedTransport: 'car',
    selectedTransportLabel: '🚗 Own Car (Self-Drive)',
    travellersCount: 2,
    groupSize: 2,
    groupMembers: [
      { name: 'Pavana Sharma (Lead)', mobile: '+91 98765 43210', status: 'GPS Active', isLead: true },
      { name: 'Megha Sharma (Co-Traveler)', mobile: '+91 98765 43211', status: 'Anchor Connected', isLead: false }
    ],
    status: 'ACTIVE',
    safetyStatus: 'SAFE',
    riskScore: 12,
    movementStatus: 'Moving (Driving)',
    speed: 48.5,
    heading: 90,
    gpsAccuracy: 12,
    latitude: 12.3055,
    longitude: 76.6558,
    activeTrip: 'Mysore Palace & Expressway Tour',
    routeDeviation: 'None (0m deviation)',
    dangerZoneDistance: '1,420m from Chamundi corridor',
    lastUpdated: new Date().toISOString(),
    sosActive: false,
    aiRiskFactors: [
      'Normal expressway driving within designated safety corridor',
      'Broad daylight (optimal visibility window)',
      'Clear high-precision GNSS lock'
    ]
  },

  // 2nd Person: Train (3 People)
  {
    touristId: 'TG-2026-819402',
    touristTag: 'TG-2026-819402',
    name: 'Rajesh Kumar',
    mobile: '+91 98450 12345',
    email: 'rajesh.kumar@expressrail.in',
    emergencyContact: 'Deepa Kumar (Spouse)',
    emergencyContactNumber: '+91 98450 12346',
    preferredLanguage: 'English / Hindi',
    selectedTransport: 'train',
    selectedTransportLabel: '🚆 Train (Vande Bharat Express)',
    travellersCount: 3,
    groupSize: 3,
    groupMembers: [
      { name: 'Rajesh Kumar (Lead)', mobile: '+91 98450 12345', status: 'GPS Active', isLead: true },
      { name: 'Deepa Kumar', mobile: '+91 98450 12346', status: 'Anchor Connected', isLead: false },
      { name: 'Aarav Kumar (Child)', mobile: '+91 98450 12347', status: 'Anchor Connected', isLead: false }
    ],
    status: 'ACTIVE',
    safetyStatus: 'LOW',
    riskScore: 28,
    movementStatus: 'Moving (Rail Transit)',
    speed: 72.0,
    heading: 180,
    gpsAccuracy: 18,
    latitude: 12.3155,
    longitude: 76.6432,
    activeTrip: 'Mysuru Rail Junction Heritage Route',
    routeDeviation: 'None (Track Corridor)',
    dangerZoneDistance: 'Safe (>2.1 km)',
    lastUpdated: new Date(Date.now() - 40000).toISOString(),
    sosActive: false,
    aiRiskFactors: [
      'Verified railway transit monitored by RPF',
      'Timetable on schedule (DEMO DATA)',
      'Station CCTV coverage verified'
    ]
  },

  // 3rd Person: Flight / Airplane (4 People)
  {
    touristId: 'TG-2026-932104',
    touristTag: 'TG-2026-932104',
    name: 'Ananya Desai',
    mobile: '+91 99001 56789',
    email: 'ananya.desai@aeroadventures.com',
    emergencyContact: 'Kiran Desai (Brother)',
    emergencyContactNumber: '+91 99001 56780',
    preferredLanguage: 'English',
    selectedTransport: 'flight',
    selectedTransportLabel: '✈️ Airplane (Domestic Flight)',
    travellersCount: 4,
    groupSize: 4,
    groupMembers: [
      { name: 'Ananya Desai (Lead)', mobile: '+91 99001 56789', status: 'GPS Active', isLead: true },
      { name: 'Kiran Desai', mobile: '+91 99001 56780', status: 'Anchor Connected', isLead: false },
      { name: 'Siddharth Roy', mobile: '+91 99001 56781', status: 'Anchor Connected', isLead: false },
      { name: 'Neha Roy', mobile: '+91 99001 56782', status: 'Anchor Connected', isLead: false }
    ],
    status: 'ACTIVE',
    safetyStatus: 'SAFE',
    riskScore: 16,
    movementStatus: 'Airport Terminal Transit',
    speed: 3.5,
    heading: 45,
    gpsAccuracy: 8,
    latitude: 12.2285,
    longitude: 76.6540,
    activeTrip: 'Mandakalli Airport & Palace Link',
    routeDeviation: 'None',
    dangerZoneDistance: 'Safe (>3.5 km)',
    lastUpdated: new Date(Date.now() - 80000).toISOString(),
    sosActive: false,
    aiRiskFactors: [
      'CISF secured airport corridor checkpoint',
      'Baggage status scanned and cleared',
      'High-confidence indoor/outdoor GPS'
    ]
  },

  // 4th Person: Bus / Taxi (5 People)
  {
    touristId: 'TG-2026-641920',
    touristTag: 'TG-2026-641920',
    name: 'Vikram Patel',
    mobile: '+91 97120 44556',
    email: 'vikram.patel@touristbus.org',
    emergencyContact: 'Sunita Patel (Spouse)',
    emergencyContactNumber: '+91 97120 44557',
    preferredLanguage: 'Gujarati / English',
    selectedTransport: 'bus',
    selectedTransportLabel: '🚌 Bus (KSRTC Airavat Club Class)',
    travellersCount: 5,
    groupSize: 5,
    groupMembers: [
      { name: 'Vikram Patel (Lead)', mobile: '+91 97120 44556', status: 'GPS Active', isLead: true },
      { name: 'Sunita Patel', mobile: '+91 97120 44557', status: 'Anchor Connected', isLead: false },
      { name: 'Harsh Patel', mobile: '+91 97120 44558', status: 'Anchor Connected', isLead: false },
      { name: 'Kavita Patel', mobile: '+91 97120 44559', status: 'Anchor Connected', isLead: false },
      { name: 'Devendra Patel (Senior)', mobile: '+91 97120 44560', status: 'Anchor Connected', isLead: false }
    ],
    status: 'ACTIVE',
    safetyStatus: 'CAUTION',
    riskScore: 45,
    movementStatus: 'Moving (Tour Coach)',
    speed: 38.0,
    heading: 135,
    gpsAccuracy: 15,
    latitude: 12.2882,
    longitude: 76.6698,
    activeTrip: 'Chamundi Hills Bus Circuit',
    routeDeviation: 'Minor (45m off-route)',
    dangerZoneDistance: 'Approaching Chamundi Foothills Isolated Section (180m away)',
    lastUpdated: new Date(Date.now() - 60000).toISOString(),
    sosActive: false,
    aiRiskFactors: [
      'Tourist party is within 200m buffer of configured High-Risk zone (Chamundi Foothills)',
      '5 party members travelling together in tourist coach',
      'Minor route deviation recorded'
    ]
  }
];

// Initial Alerts for Authority Center
export const INITIAL_ALERTS = [
  {
    id: 'alt-101',
    touristId: 'TG-2026-641920',
    touristName: 'Vikram Patel (5 Travellers)',
    severity: 'CAUTION',
    type: 'DANGER_ZONE_PROXIMITY',
    title: '⚠️ Group Danger Zone Proximity Warning',
    message: 'Tourist coach with 5 passengers approaching Chamundi Foothills Isolated Section (180m away).',
    location: '12.2882, 76.6698 (Accuracy: 15m)',
    timestamp: new Date().toISOString(),
    status: 'PENDING',
    acknowledgedBy: null,
    acknowledgedAt: null
  },
  {
    id: 'alt-102',
    touristId: 'TG-2026-752019',
    touristName: 'Pavana Sharma (2 Travellers)',
    severity: 'SAFE',
    type: 'ROUTE_CHECK',
    title: '🟢 Normal Highway Corridor Monitoring',
    message: 'Own Car driving smoothly on NH-275 Expressway corridor towards Mysore Palace.',
    location: '12.3055, 76.6558 (Accuracy: 12m)',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: 'ACKNOWLEDGED',
    acknowledgedBy: 'System AI Auto-Triage',
    acknowledgedAt: new Date(Date.now() - 280000).toISOString()
  }
];

// Curated Major Indian Destinations for Public Exploration & Planning
export const MAJOR_DESTINATIONS = [
  {
    id: 'mysuru',
    name: 'Mysuru',
    state: 'Karnataka',
    tagline: 'The Cultural & Royal Capital of Karnataka',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    description: 'Famed for its royal heritage, opulent palaces, vibrant silk markets, and aromatic sandalwood. Mysuru offers a rich blend of history and serenity.',
    popularAttractions: ['Mysore Palace (Amba Vilas)', 'Chamundeshwari Temple', 'Brindavan Gardens', 'Mysore Zoo', 'St. Philomena’s Cathedral'],
    safetyScore: 94,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March (Dasara Season)',
    estimatedBudget: '₹4,500 – ₹8,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 12.3052,
    longitude: 76.6552,
    highlights: ['Indo-Saracenic royal architecture', 'Illuminated evening palace lightings', 'Heritage culinary hotspots'],
    thingsToDo: ['Explore Mysore Palace Durbar Hall', 'Drive up Chamundi Hill viewpoint', 'Watch Brindavan musical fountains', 'Taste authentic Mylari benne masala dosa'],
    transportOptions: ['🚆 Vande Bharat / Shatabdi Express from Bengaluru (2 hrs)', '🚗 NH-275 10-Lane Expressway (2.5 hrs)', '🚌 KSRTC Airavat Club Class Coach'],
    safetyOverview: 'Consistently rated one of the safest tourist destinations in Southern India with dedicated 24/7 Tourist Police Desks and high-coverage CCTV surveillance.',
    nearbyHospitals: [
      { name: 'K.R. Hospital & Trauma Care', distance: '1.2 km', phone: '108 / 0821-2520512' },
      { name: 'Apollo BGS Hospital', distance: '3.5 km', phone: '0821-2568888' }
    ],
    nearbyPolice: [
      { name: 'Mysuru City Tourist Police Station', distance: '800 m', phone: '112 / 0821-2418100' },
      { name: 'Lashkar Police Station', distance: '1.5 km', phone: '0821-2418306' }
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    tagline: 'Silicon Valley & Garden City of India',
    category: 'Urban & Culture',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    description: 'A vibrant cosmopolitan metropolis blending tech innovation, verdant gardens, colonial landmarks, artisanal microbreweries, and arts centers.',
    popularAttractions: ['Bangalore Palace', 'Lalbagh Botanical Garden', 'Cubbon Park', 'Vidhana Soudha', 'ISKCON Temple'],
    safetyScore: 90,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'Year-round (Pleasant temperate climate)',
    estimatedBudget: '₹5,500 – ₹10,000 / day',
    recommendedDuration: '2 - 4 Days',
    latitude: 12.9716,
    longitude: 77.5946,
    highlights: ['Lush 240-acre botanical gardens', 'Lively cafe and craft culinary scene', 'Modern rapid Namma Metro transit'],
    thingsToDo: ['Walk through Lalbagh Glass House', 'Explore Tudor-style Bangalore Palace', 'Stroll along Church Street & MG Road', 'Visit the Aerospace Museum'],
    transportOptions: ['✈️ Kempegowda International Airport (BLR)', '🚆 KSR Bengaluru City Junction', '🚇 Namma Metro Purple & Green Lines'],
    safetyOverview: 'Well-policed metropolitan jurisdiction with active 112 emergency response dispatchers and pink hoysala women-safety patrols.',
    nearbyHospitals: [
      { name: 'Manipal Hospital Old Airport Rd', distance: '2.8 km', phone: '080-25024444' },
      { name: 'Bowring and Lady Curzon Hospital', distance: '1.5 km', phone: '080-25591325' }
    ],
    nearbyPolice: [
      { name: 'Cubbon Park Police Helpdesk', distance: '600 m', phone: '112 / 080-22942222' },
      { name: 'Ashok Nagar Police Station', distance: '1.8 km', phone: '080-22942540' }
    ]
  },
  {
    id: 'coorg',
    name: 'Coorg (Kodagu)',
    state: 'Karnataka',
    tagline: 'The Scotland of India & Coffee Hills',
    category: 'Hill Station',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    description: 'Misty green valleys, rolling coffee and cardamom plantations, thundering waterfalls, and authentic Kodava hospitality.',
    popularAttractions: ['Abbey Falls', 'Raja’s Seat', 'Dubare Elephant Camp', 'Namdroling Golden Temple (Bylakuppe)', 'Talakaveri'],
    safetyScore: 92,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to May',
    estimatedBudget: '₹6,000 – ₹12,000 / day',
    recommendedDuration: '3 - 4 Days',
    latitude: 12.4244,
    longitude: 75.7382,
    highlights: ['Coffee plantation homestays', 'Mist-shrouded viewpoints', 'Tibetan monastic golden temples'],
    thingsToDo: ['Tour an organic coffee & spice estate', 'River rafting in Barapole River', 'Sunset photography at Raja’s Seat', 'Visit the Dubare riverfront camp'],
    transportOptions: ['🚗 Scenic Western Ghats road drive via Mysuru or Mangaluru', '🚌 KSRTC AC Deluxe sleepers', '✈️ Nearest Airport: Kannur (CNN) or Mangaluru (IXE)'],
    safetyOverview: 'Tranquil eco-tourism hill zone with proactive forest range safety teams and well-marked scenic tourist driving corridors.',
    nearbyHospitals: [
      { name: 'Madikeri District Civil Hospital', distance: '2.0 km', phone: '08272-228344' },
      { name: 'Ashwini Hospital Madikeri', distance: '1.8 km', phone: '08272-225217' }
    ],
    nearbyPolice: [
      { name: 'Madikeri Town Police Station', distance: '1.1 km', phone: '112 / 08272-228333' }
    ]
  },
  {
    id: 'hampi',
    name: 'Hampi',
    state: 'Karnataka',
    tagline: 'UNESCO World Heritage City of Ruins',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b763?auto=format&fit=crop&w=1000&q=80',
    description: 'An open-air museum of giant boulder-strewn hills and awe-inspiring ruins of the 14th-century Vijayanagara Empire along the Tungabhadra river.',
    popularAttractions: ['Virupaksha Temple', 'Vijaya Vittala Temple & Stone Chariot', 'Lotus Mahal & Elephant Stables', 'Matanga Hill', 'Coracle Ride on Tungabhadra'],
    safetyScore: 89,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'November to February',
    estimatedBudget: '₹3,500 – ₹7,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 15.3350,
    longitude: 76.4600,
    highlights: ['Architectural marvel Stone Chariot', 'Musical stone pillars', 'Sunrise trek to Matanga Hill'],
    thingsToDo: ['Cycle around royal enclosure monuments', 'Take a traditional circular coracle ride', 'Climb Anjanadri Hill', 'Explore the ancient bazaars'],
    transportOptions: ['🚆 Nearest Railhead: Hosapete Junction (HPT - 13 km)', '🚗 NH-50 highway drive from Bengaluru (6 hrs)', '🚌 KSRTC Rajahamsa/Airavat'],
    safetyOverview: 'UNESCO protected archaeological zone with dedicated ASI guards, daytime tourist security kiosks, and illuminated monument zones.',
    nearbyHospitals: [
      { name: 'Hosapete Government 100-Bed Hospital', distance: '12.5 km', phone: '08394-228222' }
    ],
    nearbyPolice: [
      { name: 'Hampi Tourist Police Outpost', distance: '400 m', phone: '112 / 08394-241241' }
    ]
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    tagline: 'Sun, Sand, Susegad & Portuguese Heritage',
    category: 'Coastal',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    description: 'Golden sandy coastlines, azure Arabian waters, whitewashed Portuguese churches, spice plantations, and vibrant beach shacks.',
    popularAttractions: ['Fort Aguada', 'Basilica of Bom Jesus', 'Palolem Beach', 'Dudhsagar Waterfalls', 'Anjuna Flea Market'],
    safetyScore: 91,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'November to March',
    estimatedBudget: '₹5,000 – ₹12,000 / day',
    recommendedDuration: '3 - 5 Days',
    latitude: 15.2993,
    longitude: 74.1240,
    highlights: ['Pristine South Goa coastlines', 'UNESCO Old Goa cathedrals', 'Sunset cruises on Mandovi River'],
    thingsToDo: ['Water sports at Calangute & Baga', 'Heritage walking tour in Fontainhas', 'Trek to Dudhsagar waterfall viewpoint', 'Dine at seaside beach shacks'],
    transportOptions: ['✈️ Dabolim Airport (GOI) or Mopa Airport (GOX)', '🚆 Madgaon (MAO) / Thivim (THVM) Railway Stations', '🚗 NH-66 Coastal Highway'],
    safetyOverview: 'Active coastal tourist police patrols, certified beach lifeguards along public swimming zones, and high-frequency emergency assistance.',
    nearbyHospitals: [
      { name: 'Goa Medical College Hospital (Bambolim)', distance: '4.5 km', phone: '0832-2458727' }
    ],
    nearbyPolice: [
      { name: 'Goa Tourist Police Central Unit', distance: '1.2 km', phone: '112 / 0832-2426868' }
    ]
  },
  {
    id: 'ooty',
    name: 'Ooty (Udhagamandalam)',
    state: 'Tamil Nadu',
    tagline: 'Queen of the Nilgiris',
    category: 'Hill Station',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    description: 'Nestled in the Nilgiri Blue Mountains with pine forests, sweeping tea estates, botanical gardens, and the iconic UNESCO heritage toy train.',
    popularAttractions: ['Nilgiri Mountain Railway (Toy Train)', 'Ooty Botanical Gardens', 'Ooty Lake & Boathouse', 'Doddabetta Peak', 'Pykara Waterfalls'],
    safetyScore: 93,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'March to June & September to November',
    estimatedBudget: '₹4,500 – ₹9,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 11.4102,
    longitude: 76.6950,
    highlights: ['UNESCO Steam Heritage Toy Train', 'Sweeping vistas from Doddabetta (2,637m)', 'Tea factory tours and tastings'],
    thingsToDo: ['Ride the Nilgiri Mountain Toy Train', 'Boating on Pykara Lake', 'Stroll through Italian rose gardens', 'Taste handmade Nilgiri chocolates'],
    transportOptions: ['🚗 Scenic Bandipur/Mudumalai wildlife drive from Mysuru (3.5 hrs)', '🚆 Toy train from Mettupalayam', '✈️ Nearest Airport: Coimbatore (CJB - 88 km)'],
    safetyOverview: 'Serene mountain district with strict wildlife sanctuary corridors, tourist check-posts, and continuous emergency highway patrol units.',
    nearbyHospitals: [
      { name: 'Ooty Government District Headquarters Hospital', distance: '1.5 km', phone: '0423-2442212' }
    ],
    nearbyPolice: [
      { name: 'Ooty Town Central Police Station', distance: '800 m', phone: '112 / 0423-2442333' }
    ]
  },
  {
    id: 'chikkamagaluru',
    name: 'Chikkamagaluru',
    state: 'Karnataka',
    tagline: 'The Coffee Cradle of India',
    category: 'Hill Station & Nature',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80',
    description: 'Known for Mullayanagiri (the highest peak in Karnataka), fragrant coffee hills, secluded cascading streams, and trekker trails.',
    popularAttractions: ['Mullayanagiri Peak', 'Baba Budangiri & Manikyadhara', 'Hebbe Falls', 'Bhadra Wildlife Sanctuary', 'Z Point (Kemmangundi)'],
    safetyScore: 90,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'September to March',
    estimatedBudget: '₹4,000 – ₹8,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 13.3161,
    longitude: 75.7720,
    highlights: ['Karnataka’s highest summit (1,930m)', 'Untouched Western Ghats rain forest', 'Arabica & Robusta coffee harvest experience'],
    thingsToDo: ['Trek to Mullayanagiri temple summit', 'Off-road jeep ride to Hebbe Falls', 'Explore Baba Budangiri caves', 'Camp in wilderness homestays'],
    transportOptions: ['🚗 Smooth 4-lane highway drive from Bengaluru via Hassan (4.5 hrs)', '🚌 KSRTC Non-stop Airavat service', '🚆 Nearest Railhead: Kadur (40 km)'],
    safetyOverview: 'Designated hill tourism safety district with clear summit warning beacons and local certified mountain guide associations.',
    nearbyHospitals: [
      { name: 'Chikkamagaluru District Civil Hospital', distance: '1.9 km', phone: '08262-230441' }
    ],
    nearbyPolice: [
      { name: 'Chikkamagaluru City Police Station', distance: '1.2 km', phone: '112 / 08262-230333' }
    ]
  },
  {
    id: 'mangaluru',
    name: 'Mangaluru',
    state: 'Karnataka',
    tagline: 'Gateway to Coastal Karnataka & Pristine Beaches',
    category: 'Coastal & Heritage',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    description: 'A vibrant port city famous for golden beaches, ancient temples, coastal Tuluva culture, and legendary seafood.',
    popularAttractions: ['Panambur Beach', 'Kadri Manjunath Temple', 'St. Aloysius Chapel', 'Tannirbhavi Beach', 'Kudroli Gokarnath Temple'],
    safetyScore: 92,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to February',
    estimatedBudget: '₹3,500 – ₹7,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 12.9141,
    longitude: 74.8560,
    highlights: ['Golden sand beaches & watersports', 'Century-old St. Aloysius fresco murals', 'Authentic coastal seafood & ghee roast'],
    thingsToDo: ['Sunset walk and jet-skiing at Panambur Beach', 'View historic frescoes at St. Aloysius', 'Visit Kadri Manjunatha cave temple', 'Taste authentic coastal fish curry'],
    transportOptions: ['✈️ Mangaluru International Airport (IXE)', '🚆 Mangaluru Central & Junction Stations', '🚌 KSRTC Coastal Express Services'],
    safetyOverview: 'Peaceful coastal district with active coastal police units, beach lifeguards, and dedicated 24/7 tourist helpline.',
    nearbyHospitals: [
      { name: 'KMC Hospital Mangaluru', distance: '1.2 km', phone: '0824-2444590' }
    ],
    nearbyPolice: [
      { name: 'Mangaluru North Tourist Police Station', distance: '900 m', phone: '112 / 0824-2220800' }
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    tagline: 'City of Pearls & Royal Nizami Splendor',
    category: 'Heritage & Urban',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1000&q=80',
    description: 'A grand metropolis where historic royal Nizami heritage meets futuristic cyber tech corridors. World-renowned for authentic Hyderabadi Biryani.',
    popularAttractions: ['Charminar', 'Golconda Fort', 'Qutb Shahi Tombs', 'Hussain Sagar Lake & Buddha Statue', 'Salar Jung Museum'],
    safetyScore: 91,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹4,000 – ₹8,500 / day',
    recommendedDuration: '2 - 4 Days',
    latitude: 17.3850,
    longitude: 78.4867,
    highlights: ['Acoustic engineering at Golconda Fort', '16th-century Charminar monument', 'World-famous authentic Dum Biryani'],
    thingsToDo: ['Sound & light show at Golconda Fort', 'Sunset boat cruise on Hussain Sagar', 'Shop for pearls in the Old City Laad Bazaar', 'Tour antique treasures at Salar Jung Museum'],
    transportOptions: ['✈️ Rajiv Gandhi International Airport (HYD)', '🚆 Secunderabad & Hyderabad Deccan (Nampally) Stations', '🚇 Hyderabad Rapid Metro Transit'],
    safetyOverview: 'SHE Teams women safety units active across public transit with continuous 24/7 CCTV surveillance.',
    nearbyHospitals: [
      { name: 'Apollo Hospitals Jubilee Hills', distance: '3.0 km', phone: '040-23607777' }
    ],
    nearbyPolice: [
      { name: 'Hyderabad Central Police Control Room', distance: '1.0 km', phone: '112 / 040-27852435' }
    ]
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    tagline: 'Gateway to South Indian Art, Music & Heritage',
    category: 'Coastal & Heritage',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    description: 'The cultural capital of South India, celebrated for Dravidian temple architecture, classical Carnatic music, the world’s second-longest natural urban beach, and rich culinary heritage.',
    popularAttractions: ['Marina Beach', 'Kapaleeshwarar Temple', 'San Thome Cathedral Basilica', 'Fort St. George', 'DakshinaChitra Heritage Museum'],
    safetyScore: 92,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'November to February',
    estimatedBudget: '₹3,500 – ₹8,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 13.0827,
    longitude: 80.2707,
    highlights: ['Iconic 13 km long Marina Beach promenade', 'Ancient 7th-century Kapaleeshwarar temple gopuram', 'Classical Carnatic music & dance sabhas'],
    thingsToDo: ['Evening breeze and sundal snack at Marina Beach', 'Marvel at Dravidian architecture at Kapaleeshwarar Temple', 'Visit historic St. Thomas Mount', 'Sip authentic Kumbakonam degree filter coffee'],
    transportOptions: ['✈️ Chennai International Airport (MAA)', '🚆 Chennai Central (MAS) & Chennai Egmore', '🚇 Chennai Metro Rail Network'],
    safetyOverview: 'Special Tourist Police booths along Marina and Besant Nagar beaches with continuous mobile highway patrol units.',
    nearbyHospitals: [
      { name: 'Apollo Hospital Greams Road', distance: '2.5 km', phone: '044-28290200' }
    ],
    nearbyPolice: [
      { name: 'Marina Beach Police Outpost', distance: '300 m', phone: '112 / 044-28442222' }
    ]
  }
];

// City & Destination Alias Normalization Map for Search & Filters
export const CITY_ALIASES = {
  mysore: 'mysuru',
  mysuru: 'mysuru',
  mysooru: 'mysuru',
  bangalore: 'bengaluru',
  bengaluru: 'bengaluru',
  blr: 'bengaluru',
  coorg: 'coorg',
  kodagu: 'coorg',
  madikeri: 'coorg',
  mangalore: 'mangaluru',
  mangaluru: 'mangaluru',
  ixe: 'mangaluru',
  hyderabad: 'hyderabad',
  secunderabad: 'hyderabad',
  hyd: 'hyderabad',
  chennai: 'chennai',
  madras: 'chennai',
  maa: 'chennai',
  hampi: 'hampi',
  hosapete: 'hampi',
  hospet: 'hampi',
  goa: 'goa',
  panaji: 'goa',
  ooty: 'ooty',
  udhagamandalam: 'ooty',
  chikkamagaluru: 'chikkamagaluru',
  chikmagalur: 'chikkamagaluru'
};

// Rich Curated Real Hotels Database for Browsing & Verified Bookings
export const HOTELS_DATABASE = [
  // MYSURU / MYSORE
  {
    id: 'htl-mys-zostel',
    name: 'Zostel Mysore',
    destinationId: 'mysuru',
    destinationName: 'Mysuru, Karnataka',
    city: 'Mysuru',
    area: 'Gokulam 2nd Stage',
    location: 'Gokulam 2nd Stage, Vani Vilas Mohalla, Mysuru',
    aliases: ['mysore', 'mysuru', 'gokulam', 'zostel', 'backpacker', 'budget'],
    rating: 4.6,
    reviewsCount: 1920,
    pricePerNight: 999,
    currency: '₹',
    taxesIncluded: true,
    taxNote: 'Taxes included',
    verified: true,
    verificationBadge: 'Verified Budget Stay',
    distance: '4.2 km from Mysore Palace & Yoga Hub',
    distanceKm: 4.2,
    safetyRating: '98% Verified Safe Stay',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['High-Speed Wi-Fi', 'Common Lounge & Rooftop', 'Community Kitchen', '24/7 Reception', 'CCTV Security', 'Luggage Lockers', 'Clean Bedding', 'Travel Desk'],
    roomTypes: [
      { type: 'DORM_BED', name: 'Superior Mixed Dorm Bed', price: 999, capacity: '1 Adult', beds: '1 Single Bed', size: '20 sqm', available: 8 },
      { type: 'PRIVATE_ROOM', name: 'Standard Private Room with Ensuite', price: 1850, capacity: '2 Adults', beds: '1 Queen Bed', size: '24 sqm', available: 3 }
    ],
    contact: '+91 80 4716 7011',
    coordinates: [12.3300, 76.6200],
    cancellation: 'Free cancellation up to 48 hours prior',
    description: 'Top-rated verified budget accommodation in vibrant Gokulam. Features clean private rooms and dorms, traveler common room, high-speed Wi-Fi, and rooftop cafe.'
  },
  {
    id: 'htl-mys-kstdc',
    name: 'KSTDC Hotel Mayura Hoysala Mysuru',
    destinationId: 'mysuru',
    destinationName: 'Mysuru, Karnataka',
    city: 'Mysuru',
    area: 'Jhansi Rani Lakshmi Bai Road, Chamarajapuram',
    location: '2 Jhansi Rani Lakshmi Bai Road, Chamarajapuram, Mysuru',
    aliases: ['mysore', 'mysuru', 'kstdc', 'hoysala', 'chamarajapuram', 'railway station', 'budget'],
    rating: 4.2,
    reviewsCount: 1480,
    pricePerNight: 1650,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'KSTDC State Tourism Verified',
    distance: '1.1 km from Mysore Palace & 600m from Mysuru Jn',
    distanceKm: 1.1,
    safetyRating: '99% Government Verified Corridor',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Free Wi-Fi', 'KSTDC Tour Booking Desk', 'Restaurant (Vegetarian & Non-Veg)', 'Ample Car Parking', '24/7 Front Desk', 'AC Rooms', 'Power Backup'],
    roomTypes: [
      { type: 'STANDARD_AC', name: 'Standard AC Double Room', price: 1650, capacity: '2 Adults', beds: '1 Double Bed', size: '28 sqm', available: 6 },
      { type: 'DELUXE_AC', name: 'Deluxe Heritage Room', price: 2400, capacity: '2 Adults, 1 Child', beds: '1 King Bed', size: '35 sqm', available: 4 }
    ],
    contact: '+91 821 242 5349',
    coordinates: [12.3120, 76.6450],
    cancellation: 'Free cancellation up to 24 hours before check-in',
    description: 'Official Karnataka State Tourism Development Corporation heritage hotel. Set in sprawling green gardens near Mysuru Railway Station and the royal palace.'
  },
  {
    id: 'htl-mys-roopa',
    name: 'Hotel Roopa Mysuru',
    destinationId: 'mysuru',
    destinationName: 'Mysuru, Karnataka',
    city: 'Mysuru',
    area: 'B.N. Road, Lashkar Mohalla',
    location: '2724/C, B.N. Road, Lashkar Mohalla, Mysuru',
    aliases: ['mysore', 'mysuru', 'roopa', 'lashkar mohalla', 'bus stand', 'budget'],
    rating: 4.0,
    reviewsCount: 2150,
    pricePerNight: 1850,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'Verified Property',
    distance: '700 m from Mysore Palace & KSRTC Suburb Bus Stand',
    distanceKm: 0.7,
    safetyRating: '97% Verified Safe Corridor',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Free Wi-Fi', 'Rooftop Infinit Restaurant', 'Travel Desk', '24/7 Hot Water', 'Lift Access', 'Secure Parking', 'Air Conditioning'],
    roomTypes: [
      { type: 'COMFORT_DOUBLE', name: 'Executive AC Comfort Room', price: 1850, capacity: '2 Adults', beds: '1 Queen Bed', size: '25 sqm', available: 7 },
      { type: 'FAMILY_ROOM', name: 'Four-Bed Family Suite', price: 2900, capacity: '4 Adults', beds: '2 Queen Beds', size: '40 sqm', available: 2 }
    ],
    contact: '+91 821 244 3624',
    coordinates: [12.3110, 76.6570],
    cancellation: 'Free cancellation up to 24 hours prior',
    description: 'Affordable, well-maintained hotel in central Mysuru. Steps away from the Palace and city bus terminal, featuring the popular rooftop Infinit restaurant.'
  },
  {
    id: 'htl-mys-1',
    name: 'Grand Mercure Mysuru',
    destinationId: 'mysuru',
    destinationName: 'Mysuru, Karnataka',
    city: 'Mysuru',
    area: 'Nelson Mandela Road, New Sayyaji Rao Rd',
    location: 'Nelson Mandela Road, New Sayyaji Rao Rd, Mysuru',
    aliases: ['mysore', 'mysuru', 'mercure', 'grand mercure', 'sayyaji rao'],
    rating: 4.7,
    reviewsCount: 3420,
    pricePerNight: 5800,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 18% GST)',
    verified: true,
    verificationBadge: 'Verified Luxury Hotel',
    distance: '2.5 km from Mysore Palace',
    distanceKm: 2.5,
    safetyRating: '99% Verified Safe Corridor',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['High-Speed Wi-Fi', 'Free Valet Parking', 'Rooftop Swimming Pool', 'Multi-Cuisine Restaurant', '24/7 Front Desk', 'Fitness Center', 'Power Backup', 'Tourist Travel Desk'],
    roomTypes: [
      { type: 'DELUXE_KING', name: 'Deluxe King Room', price: 5800, capacity: '2 Adults, 1 Child', beds: '1 King Bed', size: '36 sqm', available: 5 },
      { type: 'EXECUTIVE_SUITE', name: 'Royal Heritage Suite', price: 9200, capacity: '3 Adults', beds: '1 King Bed + Sofa Bed', size: '58 sqm', available: 2 }
    ],
    contact: '+91 821 402 1212',
    coordinates: [12.3275, 76.6340],
    cancellation: 'Free cancellation up to 24 hours before check-in',
    description: 'Experience upscale heritage elegance in the heart of Mysuru. Features lavish rooms, rooftop pool with Chamundi Hill views, and celebrated North & South Indian dining.'
  },
  {
    id: 'htl-mys-2',
    name: 'Radisson Blu Plaza Hotel Mysuru',
    destinationId: 'mysuru',
    destinationName: 'Mysuru, Karnataka',
    city: 'Mysuru',
    area: '1 MG Road, Ittige Gudu',
    location: '1 MG Road, Ittige Gudu, Mysuru',
    aliases: ['mysore', 'mysuru', 'radisson', 'radisson blu', 'mg road', 'zoo'],
    rating: 4.8,
    reviewsCount: 4890,
    pricePerNight: 6400,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 18% GST)',
    verified: true,
    verificationBadge: 'Verified Luxury Hotel',
    distance: '1.2 km from Mysore Zoo & Palace',
    distanceKm: 1.2,
    safetyRating: '98% Verified Safe Corridor',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Free High-Speed Wi-Fi', 'Outdoor Swimming Pool', 'Spa & Wellness Sanctuary', 'Spring Multi-Cuisine Restaurant', '24/7 Room Service', 'EV Charging Station', 'Airport Shuttle'],
    roomTypes: [
      { type: 'SUPERIOR_ROOM', name: 'Superior City View Room', price: 6400, capacity: '2 Adults', beds: '1 King or 2 Twin Beds', size: '38 sqm', available: 8 },
      { type: 'CHAMUNDI_SUITE', name: 'Chamundi View Premium Suite', price: 10500, capacity: '2 Adults, 2 Children', beds: '1 King Bed', size: '64 sqm', available: 3 }
    ],
    contact: '+91 821 710 1234',
    coordinates: [12.3000, 76.6660],
    cancellation: 'Free cancellation up to 48 hours prior',
    description: 'Nestled beneath the scenic backdrop of Chamundi Hills, Radisson Blu Plaza combines world-class international hospitality with authentic royal heritage charm.'
  },

  // BENGALURU
  {
    id: 'htl-blr-treebo',
    name: 'Treebo Trend Royal Serenity, Bengaluru',
    destinationId: 'bengaluru',
    destinationName: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    area: 'Kalyan Nagar, HRBR Layout',
    location: '416 5th A Cross, HRBR Layout 2nd Block, Kalyan Nagar, Bengaluru',
    aliases: ['bangalore', 'bengaluru', 'blr', 'kalyan nagar', 'hrbr', 'treebo', 'budget'],
    rating: 4.3,
    reviewsCount: 1840,
    pricePerNight: 1750,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'Verified Property',
    distance: '3.5 km from Manyata Tech Park',
    distanceKm: 3.5,
    safetyRating: '98% Verified Safe Corridor',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Free High-Speed Wi-Fi', 'Complimentary Breakfast', 'Air Conditioning', 'Elevator', '24/7 Security', 'Daily Housekeeping', 'Electric Kettle'],
    roomTypes: [
      { type: 'STANDARD_ROOM', name: 'Oak Standard Queen Room', price: 1750, capacity: '2 Adults', beds: '1 Queen Bed', size: '22 sqm', available: 8 }
    ],
    contact: '+91 93228 00100',
    coordinates: [13.0180, 77.6450],
    cancellation: 'Free cancellation up to 24 hours before check-in',
    description: 'Comfortable budget stay with complimentary breakfast, high-speed Wi-Fi, air conditioning, and prompt hospitality in North Bengaluru.'
  },
  {
    id: 'htl-blr-kstdc',
    name: 'KSTDC Hotel Mayura Pine Top, Nandi Hills',
    destinationId: 'bengaluru',
    destinationName: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    area: 'Nandi Hills, Bengaluru Rural',
    location: 'Nandi Hills Summit, Chikkaballapur / Bengaluru Rural',
    aliases: ['bangalore', 'bengaluru', 'nandi hills', 'kstdc', 'pine top', 'budget'],
    rating: 4.1,
    reviewsCount: 1230,
    pricePerNight: 1800,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'KSTDC State Tourism Verified',
    distance: '100 m from Nandi Hills Sunrise Viewpoint',
    distanceKm: 0.1,
    safetyRating: '99% Government Hill Reserve',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['KSTDC Canteen', 'Panoramic Hill View', 'Free Parking', 'Tourist Security Patrol', 'Hot Water', 'Garden Walks'],
    roomTypes: [
      { type: 'PINE_ROOM', name: 'Pine View Double Room', price: 1800, capacity: '2 Adults', beds: '1 Double Bed', size: '26 sqm', available: 5 }
    ],
    contact: '+91 8156 250901',
    coordinates: [13.3702, 77.6835],
    cancellation: 'Free cancellation up to 48 hours prior',
    description: 'Situated on the mountain summit of historic Nandi Hills. Perfect for waking up right at sunrise above the clouds without traffic queues.'
  },
  {
    id: 'htl-blr-chancery',
    name: 'The Chancery Pavilion, Bengaluru',
    destinationId: 'bengaluru',
    destinationName: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    area: 'Residency Road, Ashok Nagar',
    location: '135 Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru',
    aliases: ['bangalore', 'bengaluru', 'blr', 'residency road', 'chancery', 'mg road'],
    rating: 4.4,
    reviewsCount: 3540,
    pricePerNight: 4200,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 18% GST)',
    verified: true,
    verificationBadge: 'Verified Property',
    distance: '1.2 km from Brigade Road & MG Road',
    distanceKm: 1.2,
    safetyRating: '99% Central Business District Patrol',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Swimming Pool', 'Health Club & Spa', 'Multiple In-House Diners', 'High-Speed Wi-Fi', 'Valet Parking', '24/7 Concierge'],
    roomTypes: [
      { type: 'SUPERIOR_ROOM', name: 'Superior King Room', price: 4200, capacity: '2 Adults', beds: '1 King Bed', size: '34 sqm', available: 9 }
    ],
    contact: '+91 80 4141 4141',
    coordinates: [12.9660, 77.6010],
    cancellation: 'Free cancellation up to 24 hours prior',
    description: 'Contemporary business hotel in central Bengaluru with outdoor pool, multiple fine dining options, fitness center, and prime connectivity.'
  },
  {
    id: 'htl-blr-1',
    name: 'ITC Gardenia, a Luxury Collection Hotel',
    destinationId: 'bengaluru',
    destinationName: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    area: '1 Residency Road, Ashok Nagar',
    location: '1 Residency Road, Ashok Nagar, Bengaluru',
    aliases: ['bangalore', 'bengaluru', 'blr', 'itc', 'gardenia', 'cubbon park', 'ub city'],
    rating: 4.9,
    reviewsCount: 6120,
    pricePerNight: 9800,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 18% GST)',
    verified: true,
    verificationBadge: 'Verified Luxury Collection',
    distance: '800 m from UB City & Cubbon Park',
    distanceKm: 0.8,
    safetyRating: '100% Diplomatic Security Rating',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['LEED Platinum Certified Green Hotel', 'Kaya Kalp Royal Spa', 'Heated Indoor & Outdoor Pools', 'Award-Winning Japanese & Indian Dining', 'High-Speed Wi-Fi', '24/7 Concierge'],
    roomTypes: [
      { type: 'TOWER_ROOM', name: 'Tower Executive King Room', price: 9800, capacity: '2 Adults', beds: '1 King Bed', size: '41 sqm', available: 6 },
      { type: 'FLAMINGO_SUITE', name: 'Flamingo Luxury Balcony Suite', price: 16500, capacity: '3 Adults', beds: '1 King Bed', size: '75 sqm', available: 2 }
    ],
    contact: '+91 80 2211 9898',
    coordinates: [12.9670, 77.5980],
    cancellation: 'Free cancellation up to 24 hours before check-in',
    description: 'Inspired by nature, ITC Gardenia is a breathtaking architectural jewel in the heart of Bengaluru offering unrivaled luxury, sustainability, and gastronomical excellence.'
  },

  // COORG (KODAGU)
  {
    id: 'htl-crg-zostel',
    name: 'Zostel Coorg (Madikeri)',
    destinationId: 'coorg',
    destinationName: 'Coorg, Karnataka',
    city: 'Coorg',
    area: 'Siddapur Road, Madikeri',
    location: 'Siddapur Road, Near Madikeri Club, Madikeri, Kodagu',
    aliases: ['coorg', 'kodagu', 'madikeri', 'zostel', 'backpacker', 'budget'],
    rating: 4.5,
    reviewsCount: 2100,
    pricePerNight: 1200,
    currency: '₹',
    taxesIncluded: true,
    taxNote: 'Taxes included',
    verified: true,
    verificationBadge: 'Verified Eco Stay',
    distance: '3.8 km from Madikeri Town Center',
    distanceKm: 3.8,
    safetyRating: '98% Verified Hill Corridor',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Estate Trail Walks', 'High-Speed Wi-Fi', 'Cafe & Bonfire Area', 'CCTV Security', '24/7 Reception', 'Indoor Games'],
    roomTypes: [
      { type: 'MIXED_DORM', name: 'Standard 6-Bed Mixed Dorm', price: 1200, capacity: '1 Adult', beds: '1 Bunk Bed', size: '22 sqm', available: 10 },
      { type: 'PRIVATE_COTTAGE', name: 'Private Coffee Valley Cottage', price: 2600, capacity: '2 Adults', beds: '1 King Bed', size: '32 sqm', available: 3 }
    ],
    contact: '+91 80 4716 7011',
    coordinates: [12.4150, 75.7420],
    cancellation: 'Free cancellation up to 48 hours prior',
    description: 'Surrounded by coffee trees, Zostel Coorg features vibrant community spaces, bonfire area, cafe, and organized Western Ghats trekking trails.'
  },
  {
    id: 'htl-crg-kstdc',
    name: 'KSTDC Hotel Mayura Valley View, Madikeri',
    destinationId: 'coorg',
    destinationName: 'Coorg, Karnataka',
    city: 'Coorg',
    area: 'Stuart Hill, Madikeri',
    location: 'Stuart Hill, Madikeri, Kodagu, Karnataka',
    aliases: ['coorg', 'kodagu', 'madikeri', 'kstdc', 'valley view', 'rajas seat', 'budget'],
    rating: 4.1,
    reviewsCount: 1620,
    pricePerNight: 2200,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'KSTDC State Tourism Verified',
    distance: '600 m from Raja’s Seat & Madikeri Fort',
    distanceKm: 0.6,
    safetyRating: '99% Government Verified Zone',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Hilltop Valley View Deck', 'KSTDC Multi-Cuisine Restaurant', 'Free Parking', 'Travel Information Desk', 'Hot Water', 'Children Play Area'],
    roomTypes: [
      { type: 'DELUXE_VALLEY', name: 'Deluxe Valley View AC Room', price: 2200, capacity: '2 Adults', beds: '1 King Bed', size: '30 sqm', available: 6 }
    ],
    contact: '+91 8272 228387',
    coordinates: [12.4200, 75.7360],
    cancellation: 'Free cancellation up to 24 hours prior',
    description: 'Perched along a mountain edge overlooking the rolling hills of Madikeri. Unobstructed valley views, KSTDC dining restaurant, and peaceful gardens.'
  },
  {
    id: 'htl-crg-1',
    name: 'The Tamara Coorg (Luxury Eco Resort)',
    destinationId: 'coorg',
    destinationName: 'Coorg, Karnataka',
    city: 'Coorg',
    area: 'Kabbinakad Estate, Yevakapadi, Napoklu',
    location: 'Kabbinakad Estate, Yevakapadi, Napoklu, Coorg',
    aliases: ['coorg', 'kodagu', 'tamara', 'luxury', 'eco resort', 'napoklu'],
    rating: 4.8,
    reviewsCount: 2980,
    pricePerNight: 12500,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 18% GST)',
    verified: true,
    verificationBadge: 'Verified Eco Sanctuary',
    distance: 'In lush coffee plantation sanctuary',
    distanceKm: 22.0,
    safetyRating: '97% Verified Eco Sanctuary',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Elevated Wooden Stilted Cottages', 'Plantation Trail Walks', 'Infinity Valley Pool', 'Deck Restaurant over Waterfalls', 'Yoga & Meditation Pavilion', 'Ayurvedic Wellness Spa'],
    roomTypes: [
      { type: 'LUXURY_COTTAGE', name: 'Luxury Wooden Valley Cottage', price: 12500, capacity: '2 Adults', beds: '1 King Bed', size: '52 sqm', available: 4 },
      { type: 'SUITE_COTTAGE', name: 'Eden Lotus Private Jacuzzi Suite', price: 19800, capacity: '2 Adults', beds: '1 King Bed', size: '88 sqm', available: 1 }
    ],
    contact: '+91 8272 238000',
    coordinates: [12.2400, 75.7100],
    cancellation: 'Free cancellation up to 7 days prior',
    description: 'A secluded eco-luxury paradise elevated over 180 acres of pristine organic coffee, cardamom, and pepper plantations.'
  },

  // MANGALURU (MANGALORE)
  {
    id: 'htl-mng-kstdc',
    name: 'KSTDC Hotel Mayura Netravathi, Mangaluru',
    destinationId: 'mangaluru',
    destinationName: 'Mangaluru, Karnataka',
    city: 'Mangaluru',
    area: 'Kadri Hills, Mangaluru',
    location: 'Kadri Hills, Circuit House Road, Mangaluru',
    aliases: ['mangaluru', 'mangalore', 'ixe', 'kstdc', 'netravathi', 'kadri', 'budget'],
    rating: 4.0,
    reviewsCount: 1150,
    pricePerNight: 1650,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'KSTDC State Tourism Verified',
    distance: '1.5 km from Kadri Manjunath Temple & 3 km from Mangaluru Central',
    distanceKm: 1.5,
    safetyRating: '99% Government Verified Corridor',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Air Conditioned Rooms', 'Restaurant serving Mangalorean Cuisine', 'Ample Parking', 'Tourist Police Corridor', 'Free Wi-Fi', '24/7 Front Desk'],
    roomTypes: [
      { type: 'AC_DOUBLE', name: 'Executive AC Double Room', price: 1650, capacity: '2 Adults', beds: '1 Double Bed', size: '26 sqm', available: 7 }
    ],
    contact: '+91 824 221 4166',
    coordinates: [12.8850, 74.8580],
    cancellation: 'Free cancellation up to 24 hours prior',
    description: 'Government verified tourist hotel nestled in scenic Kadri Hills. Clean air-conditioned rooms and in-house coastal kitchen serving authentic Mangalorean delicacies.'
  },
  {
    id: 'htl-mng-pearl',
    name: 'The Ocean Pearl, Mangaluru',
    destinationId: 'mangaluru',
    destinationName: 'Mangaluru, Karnataka',
    city: 'Mangaluru',
    area: 'K.S. Rao Road, Navabharath Circle, Kodialbail',
    location: 'K.S. Rao Road, Navabharath Circle, Kodialbail, Mangaluru',
    aliases: ['mangaluru', 'mangalore', 'ixe', 'ocean pearl', 'kodialbail'],
    rating: 4.5,
    reviewsCount: 4200,
    pricePerNight: 3200,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'Verified Property',
    distance: '1.8 km from Mangaluru Central Station',
    distanceKm: 1.8,
    safetyRating: '98% Verified Safe Corridor',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Coral Multi-Cuisine Restaurant', 'Fitness Center', 'Conference Facilities', 'Free Valet Parking', 'High-Speed Wi-Fi', 'Bar & Lounge'],
    roomTypes: [
      { type: 'EXECUTIVE_ROOM', name: 'Executive Premium Room', price: 3200, capacity: '2 Adults', beds: '1 King or 2 Twin Beds', size: '32 sqm', available: 8 }
    ],
    contact: '+91 824 249 1011',
    coordinates: [12.8720, 74.8420],
    cancellation: 'Free cancellation up to 24 hours prior',
    description: 'Renowned 4-star hotel in the commercial heart of Mangaluru with acclaimed multi-cuisine dining at Coral, fitness studio, and prompt service.'
  },

  // HYDERABAD
  {
    id: 'htl-hyd-treebo',
    name: 'Treebo Trend Grand Continental, Hyderabad',
    destinationId: 'hyderabad',
    destinationName: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    area: 'Chirag Ali Lane, Abids',
    location: '4-1-898, Tilak Road, Chirag Ali Lane, Abids, Hyderabad',
    aliases: ['hyderabad', 'secunderabad', 'hyd', 'abids', 'nampally', 'treebo', 'budget'],
    rating: 4.2,
    reviewsCount: 2310,
    pricePerNight: 1800,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'Verified Property',
    distance: '2.2 km from Nampally Station & 3.8 km from Charminar',
    distanceKm: 2.2,
    safetyRating: '98% Verified Safe Zone',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Free Breakfast', 'High-Speed Wi-Fi', 'AC Rooms', 'Elevator', '24/7 Front Desk', 'Room Service', 'Security Guard'],
    roomTypes: [
      { type: 'DELUXE_ROOM', name: 'Deluxe AC Room with Breakfast', price: 1800, capacity: '2 Adults', beds: '1 Queen Bed', size: '24 sqm', available: 8 }
    ],
    contact: '+91 93228 00100',
    coordinates: [17.3910, 78.4740],
    cancellation: 'Free cancellation up to 24 hours prior',
    description: 'Affordable hotel in historic Abids shopping quarter. Fast transit to Nampally Station, Charminar, and Salar Jung Museum.'
  },
  {
    id: 'htl-hyd-ginger',
    name: 'Ginger Hotel Hyderabad, HITEC City',
    destinationId: 'hyderabad',
    destinationName: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    area: 'Hitech City, Madhapur',
    location: '1-60/30/1, Old Mumbai Highway, Telecom Nagar, Gachibowli / HITEC City, Hyderabad',
    aliases: ['hyderabad', 'secunderabad', 'hyd', 'hitec city', 'madhapur', 'gachibowli', 'ginger'],
    rating: 4.3,
    reviewsCount: 3890,
    pricePerNight: 2600,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'IHCL Verified Property',
    distance: '1.0 km from HITEC City Metro Station',
    distanceKm: 1.0,
    safetyRating: '99% Tech Corridor Police Patrol',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Square Meal Multi-Cuisine Diner', 'Fitness Center', 'Meeting Rooms', 'High-Speed Wi-Fi', '24/7 Security', 'Electronic Safe'],
    roomTypes: [
      { type: 'LUXE_TWIN', name: 'Ginger Luxe Queen Room', price: 2600, capacity: '2 Adults', beds: '1 Queen Bed', size: '24 sqm', available: 12 }
    ],
    contact: '+91 40 6636 3333',
    coordinates: [17.4430, 78.3750],
    cancellation: 'Free cancellation up to 24 hours prior',
    description: 'Smart, vibrant, and reliable hospitality by IHCL (Tata Group). Features Square Meal restaurant, high-speed Wi-Fi, and fitness center in Cyberabad.'
  },
  {
    id: 'htl-hyd-taj',
    name: 'Taj Krishna, Hyderabad',
    destinationId: 'hyderabad',
    destinationName: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    area: 'Road No. 1, Banjara Hills',
    location: 'Road No. 1, Banjara Hills, Hyderabad',
    aliases: ['hyderabad', 'secunderabad', 'hyd', 'banjara hills', 'taj', 'krishna'],
    rating: 4.8,
    reviewsCount: 5120,
    pricePerNight: 7800,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 18% GST)',
    verified: true,
    verificationBadge: 'Verified 5-Star Luxury',
    distance: '4.5 km from Hussain Sagar Lake',
    distanceKm: 4.5,
    safetyRating: '100% Diplomatic Security Corridor',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Landscaped Gardens & Swimming Pool', 'Firdaus Authentic Hyderabadi Cuisine', 'Jiva Spa', 'Luxury Concierge', 'High-Speed Wi-Fi'],
    roomTypes: [
      { type: 'DELUXE_CITY', name: 'Deluxe City View King Room', price: 7800, capacity: '2 Adults', beds: '1 King Bed', size: '42 sqm', available: 5 }
    ],
    contact: '+91 40 6666 2323',
    coordinates: [17.4180, 78.4480],
    cancellation: 'Free cancellation up to 48 hours prior',
    description: 'Set in 13 acres of terraced gardens in prestigious Banjara Hills. Celebrated fine dining at Firdaus, Jiva Spa, and royal hospitality.'
  },

  // CHENNAI
  {
    id: 'htl-chn-heera',
    name: 'Hotel Mount Heera / Saravana, Chennai',
    destinationId: 'chennai',
    destinationName: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    area: 'Alandur, Near Guindy & Chennai Airport',
    location: '287 M.K.N Road, Alandur, Near Guindy & Kathipara, Chennai',
    aliases: ['chennai', 'madras', 'maa', 'alandur', 'guindy', 'kathipara', 'airport', 'budget'],
    rating: 4.1,
    reviewsCount: 1870,
    pricePerNight: 1600,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'Verified Budget Stay',
    distance: '3.5 km from Chennai Airport & 800m from Guindy Metro',
    distanceKm: 3.5,
    safetyRating: '98% Verified Safe Corridor',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Free Wi-Fi', 'South Indian Vegetarian Dining', 'AC Rooms', 'Airport Transit Desk', '24/7 Front Desk', 'Elevator'],
    roomTypes: [
      { type: 'DELUXE_AC', name: 'Deluxe AC Double Room', price: 1600, capacity: '2 Adults', beds: '1 Double Bed', size: '24 sqm', available: 9 }
    ],
    contact: '+91 44 2234 1122',
    coordinates: [13.0030, 80.2010],
    cancellation: 'Free cancellation up to 24 hours prior',
    description: 'Clean and practical budget hotel located near Kathipara junction and Chennai International Airport. South Indian vegetarian dining and airport transit desk.'
  },
  {
    id: 'htl-chn-ginger',
    name: 'Ginger Hotel Chennai (IITM Research Park)',
    destinationId: 'chennai',
    destinationName: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    area: 'Taramani, OMR IT Corridor',
    location: 'IITM Research Park, Kanagam Road, Taramani, Chennai',
    aliases: ['chennai', 'madras', 'maa', 'taramani', 'omr', 'ginger', 'iit'],
    rating: 4.3,
    reviewsCount: 2750,
    pricePerNight: 2400,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'IHCL Verified Property',
    distance: '1.2 km from Tidel Park & 4 km from Besant Nagar Beach',
    distanceKm: 1.2,
    safetyRating: '99% IT Corridor Police Patrol',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Square Meal Cafe', 'Free High-Speed Wi-Fi', 'Gym', 'EV Charging Point', 'Safe Transit Corridor', 'Electronic Key Card'],
    roomTypes: [
      { type: 'SMART_ROOM', name: 'Smart Queen Room', price: 2400, capacity: '2 Adults', beds: '1 Queen Bed', size: '23 sqm', available: 10 }
    ],
    contact: '+91 44 6666 3333',
    coordinates: [12.9900, 80.2440],
    cancellation: 'Free cancellation up to 24 hours prior',
    description: 'Sleek, tech-enabled stay inside the secure IITM Research Park on the OMR corridor. Features Cafe Square Meal, gym, and swift access to East Coast Road.'
  },
  {
    id: 'htl-chn-taj',
    name: 'Taj Coromandel, Chennai',
    destinationId: 'chennai',
    destinationName: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    area: 'Mahatma Gandhi Road, Nungambakkam',
    location: '37 Mahatma Gandhi Road, Nungambakkam, Chennai',
    aliases: ['chennai', 'madras', 'maa', 'nungambakkam', 'taj', 'coromandel'],
    rating: 4.8,
    reviewsCount: 4950,
    pricePerNight: 8900,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 18% GST)',
    verified: true,
    verificationBadge: 'Verified 5-Star Luxury',
    distance: '4 km from Marina Beach & Kapaleeshwarar Temple',
    distanceKm: 4.0,
    safetyRating: '100% Diplomatic Security Corridor',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Southern Spice Fine Dining', 'Outdoor Pool & Spa', '24/7 Butler Service', 'Diplomatic Security Rating', 'High-Speed Wi-Fi'],
    roomTypes: [
      { type: 'SUPERIOR_KING', name: 'Superior King Room', price: 8900, capacity: '2 Adults', beds: '1 King Bed', size: '40 sqm', available: 6 }
    ],
    contact: '+91 44 6600 2827',
    coordinates: [13.0600, 80.2460],
    cancellation: 'Free cancellation up to 48 hours prior',
    description: 'An iconic landmark of luxury in Nungambakkam. Blends traditional South Indian design with European elegance, celebrated Southern Spice dining, and Jiva Spa.'
  },

  // HAMPI
  {
    id: 'htl-hmp-1',
    name: 'Heritage Resort Hampi',
    destinationId: 'hampi',
    destinationName: 'Hampi, Karnataka',
    city: 'Hampi',
    area: 'Hosamalapanagudi, Hampi Road, Hosapete',
    location: 'Hosamalapanagudi, Hampi Road, Hosapete',
    aliases: ['hampi', 'hospet', 'hosapete', 'heritage resort'],
    rating: 4.6,
    reviewsCount: 1850,
    pricePerNight: 4900,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 12% GST)',
    verified: true,
    verificationBadge: 'Verified Heritage Zone',
    distance: '6 km from Virupaksha Temple & Monuments',
    distanceKm: 6.0,
    safetyRating: '96% Verified Safe Heritage Zone',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Eco-friendly Cottages with Jacuzzi', 'Swimming Pool', 'Organic Herb Garden Dining', 'Cycling Rentals', 'Ayurvedic Massage Spa', '24/7 Security'],
    roomTypes: [
      { type: 'DELUXE_VILLA', name: 'Deluxe Heritage Villa', price: 4900, capacity: '2 Adults', beds: '1 King or 2 Queen Beds', size: '42 sqm', available: 7 },
      { type: 'JACUZZI_VILLA', name: 'Royal Jacuzzi Villa', price: 7400, capacity: '2 Adults, 1 Child', beds: '1 King Bed', size: '55 sqm', available: 3 }
    ],
    contact: '+91 8394 241500',
    coordinates: [15.3120, 76.4480],
    cancellation: 'Free cancellation up to 48 hours before check-in',
    description: 'Designed in harmony with nature and historic Vijayanagara architectural idioms, offering tranquil garden views and quick access to the UNESCO monuments.'
  },

  // GOA
  {
    id: 'htl-goa-1',
    name: 'Taj Fort Aguada Resort & Spa, Goa',
    destinationId: 'goa',
    destinationName: 'Goa',
    city: 'Goa',
    area: 'Sinquerim, Candolim, North Goa',
    location: 'Sinquerim, Candolim, North Goa',
    aliases: ['goa', 'candolim', 'sinquerim', 'panaji', 'fort aguada', 'taj'],
    rating: 4.9,
    reviewsCount: 5200,
    pricePerNight: 11200,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 18% GST)',
    verified: true,
    verificationBadge: 'Certified Beach Lifeguard Zone',
    distance: 'Direct beachfront under historic 16th-century Portuguese fort',
    distanceKm: 0.1,
    safetyRating: '99% Certified Beach Lifeguard Zone',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Direct Beach Access', 'J Wellness Circle Spa', 'Seaside Infinity Pool', 'Water Sports Desk', 'Authentic Goan Seafood Morisco', 'Tennis Courts'],
    roomTypes: [
      { type: 'SEA_VIEW_ROOM', name: 'Superior Sea View Portuguese Room', price: 11200, capacity: '2 Adults', beds: '1 King Bed', size: '44 sqm', available: 5 },
      { type: 'GARDEN_VILLA', name: 'Heritage Portuguese Sea-Facing Villa', price: 18500, capacity: '3 Adults', beds: '1 King Bed', size: '72 sqm', available: 2 }
    ],
    contact: '+91 832 664 5858',
    coordinates: [15.4980, 73.7710],
    cancellation: 'Free cancellation up to 72 hours prior',
    description: 'India’s legendary first luxury beach resort. Perched directly above Sinquerim Beach, radiating romantic Portuguese style and unmatched Arabian Sea vistas.'
  },

  // OOTY
  {
    id: 'htl-ooty-1',
    name: 'Savoy - IHCL SeleQtions Ooty',
    destinationId: 'ooty',
    destinationName: 'Ooty, Tamil Nadu',
    city: 'Ooty',
    area: '77 Sylks Road, Udhagamandalam',
    location: '77 Sylks Road, Udhagamandalam, Ooty',
    aliases: ['ooty', 'udhagamandalam', 'savoy', 'nilgiris', 'toy train'],
    rating: 4.8,
    reviewsCount: 3100,
    pricePerNight: 8500,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 18% GST)',
    verified: true,
    verificationBadge: 'Verified Mountain Safe Zone',
    distance: '1.5 km from Ooty Botanical Garden',
    distanceKm: 1.5,
    safetyRating: '98% Verified Mountain Safe Zone',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Colonial Fireplace in Every Cottage', 'High Tea Lawn Service', 'Historic Dining Hall', 'Bicycle Tours', 'Indoor Billiards Room', 'High-Speed Wi-Fi'],
    roomTypes: [
      { type: 'HERITAGE_ROOM', name: 'Colonial Heritage King Room', price: 8500, capacity: '2 Adults', beds: '1 Four-Poster King Bed', size: '40 sqm', available: 6 },
      { type: 'SAVOY_SUITE', name: 'Savoy Executive Fireplace Suite', price: 14000, capacity: '2 Adults, 2 Children', beds: '1 King Bed + Living Area', size: '68 sqm', available: 2 }
    ],
    contact: '+91 423 222 5500',
    coordinates: [11.4080, 76.6970],
    cancellation: 'Free cancellation up to 48 hours prior',
    description: 'A 180-year-old historic colonial estate spread across 6 lush acres. Reminiscent of a vintage English countryside manor complete with cozy crackling fireplaces.'
  },

  // CHIKKAMAGALURU
  {
    id: 'htl-ckm-1',
    name: 'The Serai Chikmagalur (Luxury Pool Villas)',
    destinationId: 'chikkamagaluru',
    destinationName: 'Chikkamagaluru, Karnataka',
    city: 'Chikkamagaluru',
    area: 'Mugthihalli Post, KM Road, Chikmagalur',
    location: 'Mugthihalli Post, KM Road, Chikmagalur',
    aliases: ['chikkamagaluru', 'chikmagalur', 'serai', 'coffee', 'mullayanagiri'],
    rating: 4.8,
    reviewsCount: 2750,
    pricePerNight: 11900,
    currency: '₹',
    taxesIncluded: false,
    taxNote: '+ taxes & fees (approx. 18% GST)',
    verified: true,
    verificationBadge: 'Verified Resort Reserve',
    distance: '7 km from Chikmagalur town center',
    distanceKm: 7.0,
    safetyRating: '98% Verified Resort Reserve',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Private Personal Plunge Pools', 'Estate Coffee Tasting Lounge', 'Oma Ayurvedic Luxury Spa', 'Blue Sky Lounge Bar', 'Plantation Biking', 'Free Wi-Fi'],
    roomTypes: [
      { type: 'ESTATE_VILLA', name: 'Estate Villa with Private Pool', price: 11900, capacity: '2 Adults', beds: '1 King Bed', size: '65 sqm', available: 5 },
      { type: 'RESIDENCE_VILLA', name: 'Two-Bedroom Family Residence Villa', price: 21500, capacity: '4 Adults', beds: '2 King Beds', size: '120 sqm', available: 1 }
    ],
    contact: '+91 8262 224903',
    coordinates: [13.2840, 75.8120],
    cancellation: 'Free cancellation up to 5 days prior',
    description: 'Inspired by coffee, crafted for supreme relaxation. Luxury villas featuring private plunge pools situated amidst 70 acres of aromatic coffee plantations.'
  }
];

// Initial Demo Bookings linked to preset tourists
export const INITIAL_BOOKINGS = [
  {
    bookingId: 'BK-2026-90412',
    touristId: 'TG-2026-752019',
    touristName: 'Pavana Sharma',
    hotelId: 'htl-mys-1',
    hotelName: 'Grand Mercure Mysuru',
    destination: 'Mysuru',
    destinationId: 'mysuru',
    checkInDate: '2026-09-10',
    checkOutDate: '2026-09-12',
    nights: 2,
    guestsCount: 2,
    roomType: 'Deluxe King Room',
    pricePerNight: 5800,
    totalAmount: 11600,
    currency: '₹',
    status: 'CONFIRMED',
    contactNumber: '+91 98765 43210',
    hotelImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    hotelAddress: 'Nelson Mandela Road, New Sayyaji Rao Rd, Mysuru',
    hotelPhone: '+91 821 402 1212',
    bookedAt: new Date(Date.now() - 86400000).toISOString(),
    isDemoBooking: true
  }
];

// Demo-Ready "Mysuru 2-Day Safe Trip" Specification
export const MYSURU_2DAY_SAFE_TRIP = {
  id: 'trip-mys-2day-safe',
  title: 'MYSURU 2-DAY SAFE TRIP',
  destination: 'Mysuru, Karnataka, India',
  duration: '2 Days • 1 Night',
  durationDays: 2,
  durationNights: 1,
  origin: 'Bengaluru, Karnataka',
  highlights: [
    'Mysuru Palace',
    'Mysuru Zoo',
    'Chamundi Hill',
    'KRS / Brindavan Gardens'
  ],
  day1: {
    dayNumber: 1,
    title: 'Arrival & Royal Heritage Corridor',
    dateLabel: 'Day 1',
    stops: [
      {
        id: 'day1-stop-1',
        name: 'Bengaluru (Departure Point)',
        location: 'Bengaluru City Center, Karnataka',
        latitude: 12.9716,
        longitude: 77.5946,
        type: 'ORIGIN',
        timeWindow: '07:30 AM',
        suggestedDuration: 'Departure Point',
        safetyStatus: 'Urban Transit Hub • Hoysala Patrol Monitored',
        safetyBadge: 'SAFE CORRIDOR',
        safetyScore: 92,
        routeSegmentNote: 'Depart via NH-275 Bengaluru-Mysuru Expressway (10-lane monitored access-controlled corridor)',
        distanceKm: 0,
        travelTimeMins: 0,
        instructions: 'Begin journey on NH-275 10-Lane Expressway toward Mysuru.'
      },
      {
        id: 'day1-stop-2',
        name: 'Mysuru City Entrance',
        location: 'Columbia Asia Junction / NH-275 Ring Road, Mysuru',
        latitude: 12.3385,
        longitude: 76.6575,
        type: 'TRANSIT',
        timeWindow: '10:00 AM',
        suggestedDuration: '15 mins (Entry & Toll Waypoint)',
        safetyStatus: 'Tourist Police Check-Post Active',
        safetyBadge: 'CHECKED ENTRY',
        safetyScore: 95,
        routeSegmentNote: 'Smooth Expressway transition to Sayyaji Rao Road',
        distanceKm: 138,
        travelTimeMins: 145,
        instructions: 'Follow Sayyaji Rao Road straight into the central heritage zone.'
      },
      {
        id: 'day1-stop-3',
        name: 'Mysuru Palace (Amba Vilas)',
        location: 'Sayyaji Rao Rd, Agrahara, Chamrajpura, Mysuru, Karnataka 570001',
        latitude: 12.3052,
        longitude: 76.6552,
        type: 'ATTRACTION',
        timeWindow: '10:30 AM – 12:45 PM',
        suggestedDuration: 'Suggested: 2 hours (Recommended duration, not official requirement)',
        officialTimings: '10:00 AM – 5:30 PM (All days)',
        entryNote: 'Source-backed timing: 10:00 AM – 5:30 PM',
        safetyStatus: 'Tourist Police Perimeter & 24/7 CCTV Kiosk',
        safetyBadge: 'HIGH SECURITY HERITAGE ZONE',
        safetyScore: 98,
        distanceKm: 4.8,
        travelTimeMins: 12,
        instructions: 'Proceed 4.8 km south on Sayyaji Rao Road to Palace North Gate.'
      },
      {
        id: 'day1-stop-4',
        name: 'Sri Chamarajendra Zoological Gardens (Mysuru Zoo)',
        location: 'Indiranagar, Ittige Gudu, Mysuru, Karnataka 570010',
        latitude: 12.3025,
        longitude: 76.6644,
        type: 'ATTRACTION',
        timeWindow: '02:00 PM – 05:00 PM',
        suggestedDuration: 'Suggested: 2.5 – 3 hours (Recommended duration, not official requirement)',
        officialTimings: '8:30 AM – 5:30 PM (Weekly holiday: Tuesday)',
        entryFeeOfficial: 'Adult Entry: ₹120 (Current official entry ticket)',
        safetyStatus: 'Monitored Family Safety Zone • Dedicated First Aid Station',
        safetyBadge: 'FAMILY SAFE ZONE',
        safetyScore: 96,
        distanceKm: 1.6,
        travelTimeMins: 6,
        instructions: 'Head east via Shalivahana Road for 1.6 km directly to Mysuru Zoo parking.'
      },
      {
        id: 'day1-stop-5',
        name: 'Overnight Stay in Mysuru (Verified Hotel)',
        location: 'Radisson Blu Plaza Hotel Mysuru, 1 MG Road / Grand Mercure Mysuru',
        latitude: 12.3000,
        longitude: 76.6660,
        type: 'STAY',
        timeWindow: '05:30 PM Onwards',
        suggestedDuration: 'Overnight Stay (Rest & Recharge)',
        safetyStatus: 'Verified Property • Linked to Tourist Police Security Network',
        safetyBadge: 'VERIFIED STAY',
        safetyScore: 99,
        distanceKm: 1.1,
        travelTimeMins: 4,
        instructions: 'Proceed 1.1 km south along MG Road to hotel check-in.'
      }
    ]
  },
  day2: {
    dayNumber: 2,
    title: 'Hilltop Darshan & KRS Dam Reservoir Circuit',
    dateLabel: 'Day 2',
    stops: [
      {
        id: 'day2-stop-1',
        name: 'Mysuru Hotel (Morning Departure)',
        location: 'Central Mysuru Hotel Corridor',
        latitude: 12.3000,
        longitude: 76.6660,
        type: 'ORIGIN',
        timeWindow: '07:45 AM',
        suggestedDuration: 'Morning Departure',
        safetyStatus: 'Safe City Departure Corridor',
        safetyBadge: 'SAFE CORRIDOR',
        safetyScore: 97,
        distanceKm: 0,
        travelTimeMins: 0,
        instructions: 'Depart hotel heading south toward Chamundi Hill Road.'
      },
      {
        id: 'day2-stop-2',
        name: 'Chamundi Hill / Chamundeshwari Temple',
        location: 'Chamundi Hill Road, Mysuru, Karnataka 570010',
        latitude: 12.2753,
        longitude: 76.6705,
        type: 'ATTRACTION',
        timeWindow: '08:15 AM – 10:30 AM',
        suggestedDuration: 'Suggested: 1.5 – 2 hours (Recommended duration, not official requirement)',
        officialTimings: '07:30 AM – 02:00 PM & 03:30 PM – 09:00 PM',
        safetyStatus: 'Hill Highway Patrol Active • Monitored Ghat Road',
        safetyBadge: 'MONITORED HILL ZONE',
        safetyScore: 91,
        distanceKm: 11.2,
        travelTimeMins: 22,
        instructions: 'Ascend via Chamundi Hill Road with panoramic valley views of Mysuru city.'
      },
      {
        id: 'day2-stop-3',
        name: 'KRS Dam / Brindavan Gardens Destination Area',
        location: 'Krishnarajasagara, Mandya/Mysuru District, Karnataka 571607',
        latitude: 12.4244,
        longitude: 76.5742,
        type: 'ATTRACTION',
        timeWindow: '01:30 PM – 04:30 PM',
        suggestedDuration: 'Suggested: 2 – 2.5 hours (Recommended duration, not official requirement)',
        descriptionNote: 'Destination area encompassing the Krishnarajasagara dam reservoir on the Kaveri River and the adjoining terraced Brindavan Gardens.',
        safetyStatus: 'Irrigation & Security Post Active • Guarded Embankment Zone',
        safetyBadge: 'REGULATED RESERVOIR AREA',
        safetyScore: 89,
        distanceKm: 27.4,
        travelTimeMins: 42,
        instructions: 'Descend hill and take Outer Ring Road north to KRS Road directly to Brindavan Gardens entry gate.'
      },
      {
        id: 'day2-stop-4',
        name: 'Return Journey to Bengaluru',
        location: 'Bengaluru City Center via NH-275 Expressway',
        latitude: 12.9716,
        longitude: 77.5946,
        type: 'DESTINATION',
        timeWindow: '04:45 PM – 07:30 PM',
        suggestedDuration: 'Return Journey (~2.5 hrs via Expressway)',
        safetyStatus: 'Continuous Highway Patrol • Emergency Call Boxes every 2 km',
        safetyBadge: 'EXPRESSWAY CORRIDOR',
        safetyScore: 94,
        distanceKm: 146,
        travelTimeMins: 155,
        instructions: 'Connect via Srirangapatna bypass directly to NH-275 10-Lane Expressway back to Bengaluru.'
      }
    ]
  }
};


