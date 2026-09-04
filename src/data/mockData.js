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
    name: 'KRS Brindavan Gardens',
    location: 'Krishnarajasagara, Mandya/Mysuru, Karnataka',
    category: 'Botanical Garden & Waterbody',
    latitude: 12.4244,
    longitude: 76.5742,
    rating: 4.5,
    reviews: 110000,
    timings: '06:30 AM - 09:00 PM (Musical Fountain at 07:00 PM)',
    entryFee: '₹50 per person',
    description: 'Famous terraced garden laid out across the Krishna Raja Sagara dam with illuminated musical fountains.'
  },
  {
    id: 'dest-4',
    name: 'Sri Chamarajendra Zoological Gardens (Mysore Zoo)',
    location: 'Indiranagar, Ittige Gudu, Mysuru, Karnataka',
    category: 'Wildlife Sanctuary & Zoo',
    latitude: 12.3025,
    longitude: 76.6644,
    rating: 4.6,
    reviews: 95000,
    timings: '08:30 AM - 05:30 PM (Closed Tuesdays)',
    entryFee: '₹100 (Adults), ₹50 (Children)',
    description: 'One of the oldest and most popular zoos in India, home to hundreds of rare animal and avian species.'
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
