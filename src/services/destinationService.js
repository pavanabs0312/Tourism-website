/**
 * Destination Service - AI Tourism Guardian
 * Comprehensive Pan-India Destination Catalog & Real-World Geocoding
 * Supports all 28 States and 8 Union Territories of India.
 */

// Comprehensive Curated Catalog of Top Indian Destinations across all States & UTs
export const ALL_INDIAN_DESTINATIONS = [
  // --- UTTAR PRADESH ---
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    category: 'Heritage',
    tagline: 'Home of the Iconic Taj Mahal & Mughal Splendor',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
    description: 'A globally renowned historic city on the banks of the Yamuna River, celebrated for its sublime Mughal architecture, UNESCO World Heritage monuments, and rich artisan crafts.',
    popularAttractions: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh', 'Itmad-ud-Daulah (Baby Taj)', 'Akbar’s Tomb (Sikandra)'],
    safetyScore: 88,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March (Pleasant winter climate)',
    estimatedBudget: '₹3,500 – ₹7,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 27.1767,
    longitude: 78.0081,
    highlights: ['Marble inlay craftsmanship (Pietra Dura)', 'Sunrise over the Taj Mahal', 'Mughlai culinary heritage and Petha'],
    thingsToDo: ['Watch sunrise over the Taj Mahal', 'Explore the royal courtyards of Agra Fort', 'Day excursion to Fatehpur Sikri', 'Sunset photography from Mehtab Bagh'],
    transportOptions: ['✈️ Agra Airport (AGR) & Jewar Airport', '🚆 Agra Cantt Railway Station (Gatimaan & Vande Bharat Express)', '🚗 Yamuna Expressway from Delhi (3 hrs)'],
    safetyOverview: 'Special Tourist Police units patrol the Taj Mahal perimeter and monument corridors 24/7 with dedicated complaint kiosks.',
    nearbyHospitals: [
      { name: 'S.N. Medical College & Hospital Agra', distance: '2.5 km', phone: '0562-2260353' },
      { name: 'Pushpanjali Hospital & Research Centre', distance: '3.8 km', phone: '0562-4034000' }
    ],
    nearbyPolice: [
      { name: 'Taj Mahal Tourist Police Station', distance: '400 m', phone: '112 / 0562-2421204' },
      { name: 'Agra Cantt GRP Police Station', distance: '1.2 km', phone: '0562-2421200' }
    ]
  },
  {
    id: 'varanasi',
    name: 'Varanasi (Kashi)',
    state: 'Uttar Pradesh',
    category: 'Spiritual',
    tagline: 'The Spiritual Capital of India on the Holy Ganga',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
    description: 'One of the world’s oldest continuously inhabited cities, renowned for holy Ganga ghats, devotional evening aartis, ancient silk weaving, and deep philosophical heritage.',
    popularAttractions: ['Kashi Vishwanath Temple', 'Dashashwamedh Ghat', 'Assi Ghat', 'Manikarnika Ghat', 'Sarnath (Buddha’s First Sermon)', 'Ramnagar Fort'],
    safetyScore: 89,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹2,500 – ₹6,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 25.3176,
    longitude: 82.9739,
    highlights: ['Grand evening Ganga Aarti at Dashashwamedh', 'Dawn boat ride on the sacred river', 'Banarasi silk sarees and street gastronomy'],
    thingsToDo: ['Sunrise rowing boat along the ghats', 'Attend the grand Ganga Aarti', 'Explore the Kashi Vishwanath Corridor', 'Day trip to Dhamek Stupa in Sarnath'],
    transportOptions: ['✈️ Lal Bahadur Shastri International Airport (VNS)', '🚆 Varanasi Junction & Banaras Rail Terminal', '🚌 National Highway 19 Corridor'],
    safetyOverview: 'Dedicated river police patrols with rescue boats along the ghats and high-density CCTV monitoring in temple corridors.',
    nearbyHospitals: [
      { name: 'Sir Sunderlal Hospital (BHU)', distance: '3.0 km', phone: '0542-2307500' }
    ],
    nearbyPolice: [
      { name: 'Dashashwamedh Tourist Police Booth', distance: '200 m', phone: '112 / 0542-2451000' }
    ]
  },
  {
    id: 'ayodhya',
    name: 'Ayodhya',
    state: 'Uttar Pradesh',
    category: 'Spiritual',
    tagline: 'The Sacred City of Lord Rama on the Saryu River',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1000&q=80',
    description: 'Ancient holy city revered as the birthplace of Lord Rama, featuring majestic newly built temple architecture, sacred Saryu river ghats, and spiritual trails.',
    popularAttractions: ['Shri Ram Janmabhoomi Mandir', 'Hanuman Garhi', 'Kanak Bhawan', 'Ram Ki Paidi (Saryu Ghats)', 'Nageshwarnath Temple'],
    safetyScore: 93,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹2,500 – ₹5,500 / day',
    recommendedDuration: '1 - 2 Days',
    latitude: 26.7922,
    longitude: 82.1998,
    highlights: ['Grand Ram Janmabhoomi temple complex', 'Evening Saryu Aarti & laser water shows', 'Sacred Hanuman Garhi fort temple'],
    thingsToDo: ['Darshan at Ram Mandir', 'Climb the 76 steps of Hanuman Garhi', 'Watch evening Saryu laser show', 'Stroll along Ram Ki Paidi'],
    transportOptions: ['✈️ Maharishi Valmiki International Airport (AYJ)', '🚆 Ayodhya Dham Junction', '🚗 4-Lane Express Corridor from Lucknow (2.5 hrs)'],
    safetyOverview: 'High-security pilgrim protection zone with specialized tourist crowd control and medical aid kiosks.',
    nearbyHospitals: [{ name: 'District Hospital Ayodhya', distance: '1.5 km', phone: '05278-222123' }],
    nearbyPolice: [{ name: 'Ram Janmabhoomi Security Control Room', distance: '300 m', phone: '112' }]
  },

  // --- MAHARASHTRA ---
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    category: 'Urban & Culture',
    tagline: 'The City of Dreams & Financial Capital of India',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    description: 'A bustling coastal mega-city blending Victorian Gothic architecture, Bollywood glamour, historical sea forts, and an unstoppable culinary spirit.',
    popularAttractions: ['Gateway of India', 'Marine Drive (Queen’s Necklace)', 'Elephanta Caves (UNESCO)', 'Chhatrapati Shivaji Maharaj Terminus', 'Colaba Causeway', 'Sanjay Gandhi National Park'],
    safetyScore: 91,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'November to February',
    estimatedBudget: '₹4,500 – ₹10,000 / day',
    recommendedDuration: '3 - 4 Days',
    latitude: 18.9220,
    longitude: 72.8347,
    highlights: ['Victorian Gothic & Art Deco ensembles', 'Sunset promenade along Marine Drive', 'Historic Elephanta island rock-cut caves'],
    thingsToDo: ['Ferry ride to Elephanta Caves', 'Walk the Marine Drive promenade at sunset', 'Street shopping in Colaba', 'Sample iconic Mumbai street food (Vada Pav, Pav Bhaji)'],
    transportOptions: ['✈️ Chhatrapati Shivaji Maharaj International Airport (BOM)', '🚆 CSMT & Mumbai Central Terminus', '🚇 Mumbai Metro & Western/Central Suburban Rail'],
    safetyOverview: 'Extensively monitored metropolis with active Mumbai Police Nirbhaya patrols and 24/7 coastal security.',
    nearbyHospitals: [{ name: 'Bombay Hospital & Medical Research Centre', distance: '1.8 km', phone: '022-22067676' }],
    nearbyPolice: [{ name: 'Colaba Tourist Police Outpost', distance: '400 m', phone: '112 / 022-22852885' }]
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    category: 'Heritage & Urban',
    tagline: 'Oxford of the East & Cultural Capital of Maharashtra',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    description: 'A green educational and IT powerhouse brimming with Maratha history, majestic hill forts, serene ashrams, and youthful cafes.',
    popularAttractions: ['Shaniwar Wada', 'Aga Khan Palace', 'Sinhagad Fort', 'Osho International Meditation Resort', 'Dagdusheth Halwai Ganpati Temple'],
    safetyScore: 92,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'July to March (Lush monsoon and pleasant winter)',
    estimatedBudget: '₹3,000 – ₹7,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 18.5204,
    longitude: 73.8567,
    highlights: ['Peshwa historic fortresses', 'Mahatma Gandhi memorial at Aga Khan Palace', 'Scenic Western Ghats trekking'],
    thingsToDo: ['Trek to Sinhagad Fort', 'Explore the ruins of Shaniwar Wada', 'Visit Aga Khan Palace', 'Taste authentic Puneri Misal'],
    transportOptions: ['✈️ Pune International Airport (PNQ)', '🚆 Pune Junction', '🚗 Mumbai-Pune Expressway (2.5 hrs)'],
    safetyOverview: 'Well-regulated university and tech hub with active city police patrol vehicles.',
    nearbyHospitals: [{ name: 'Ruby Hall Clinic Pune', distance: '1.2 km', phone: '020-66455100' }],
    nearbyPolice: [{ name: 'Pune Central Police Station', distance: '800 m', phone: '112 / 020-26123349' }]
  },

  // --- DELHI (NCT) ---
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi (NCT)',
    category: 'Heritage & Urban',
    tagline: 'The Historic & Political Heart of India',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    description: 'A majestic capital city spanning millennia of empires. From grand Mughal forts and Sufi shrines to sprawling colonial boulevards and Michelin-standard cuisine.',
    popularAttractions: ['Qutub Minar', 'Red Fort', 'Humayun’s Tomb', 'India Gate', 'Lotus Temple', 'Chandni Chowk', 'Akshardham Temple'],
    safetyScore: 87,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹4,000 – ₹9,000 / day',
    recommendedDuration: '3 - 5 Days',
    latitude: 28.6139,
    longitude: 77.2090,
    highlights: ['Three UNESCO World Heritage sites', 'Sensory bazaars of Old Delhi', 'World-class air-conditioned Delhi Metro network'],
    thingsToDo: ['Heritage walk through Humayun’s Tomb gardens', 'Rickshaw ride in Chandni Chowk', 'Witness evening lights at India Gate', 'Explore Qutub Minar complex'],
    transportOptions: ['✈️ Indira Gandhi International Airport (DEL)', '🚆 New Delhi (NDLS), Old Delhi (DLI) & Hazrat Nizamuddin', '🚇 Delhi Metro Rail'],
    safetyOverview: 'Dedicated Delhi Tourist Police vans deployed at all major monuments and metro hubs.',
    nearbyHospitals: [{ name: 'AIIMS New Delhi', distance: '3.5 km', phone: '011-26588500' }],
    nearbyPolice: [{ name: 'India Gate Tourist Police Station', distance: '300 m', phone: '112 / 011-23384000' }]
  },

  // --- RAJASTHAN ---
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    category: 'Heritage',
    tagline: 'The Pink City of Forts, Palaces & Royal Grandeur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    description: 'The UNESCO-listed capital of Rajasthan, celebrated for terracotta-pink palaces, hilltop Rajput fortresses, royal astronomy observatories, and vibrant handicrafts.',
    popularAttractions: ['Hawa Mahal (Palace of Winds)', 'Amer Fort', 'City Palace Jaipur', 'Jantar Mantar (UNESCO)', 'Nahargarh Fort', 'Jal Mahal'],
    safetyScore: 90,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹3,500 – ₹8,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 26.9124,
    longitude: 75.7873,
    highlights: ['Intricate pink sandstone facade of Hawa Mahal', 'Jeep ascent to Amer Fort', 'Royal jewelry and block-print textiles'],
    thingsToDo: ['Explore the mirror halls of Amer Fort', 'Photograph Hawa Mahal at morning light', 'Tour City Palace royal museum', 'Sunset view over city from Nahargarh Fort'],
    transportOptions: ['✈️ Jaipur International Airport (JAI)', '🚆 Jaipur Junction', '🚗 NH-48 6-lane expressway from Delhi (4 hrs)'],
    safetyOverview: 'Active Rajasthan Tourist Assistance Force (TAF) stationed at all major palaces.',
    nearbyHospitals: [{ name: 'SMS Hospital Jaipur', distance: '2.0 km', phone: '0141-2518224' }],
    nearbyPolice: [{ name: 'Amer Tourist Police Station', distance: '500 m', phone: '112 / 0141-2530100' }]
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    category: 'Heritage',
    tagline: 'The City of Lakes & Venice of the East',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80',
    description: 'A romantic fairytale oasis set amidst tranquil shimmering lakes and the rugged Aravalli Hills, famous for floating marble palaces and regal heritage.',
    popularAttractions: ['City Palace Udaipur', 'Lake Pichola', 'Jag Mandir', 'Saheliyon-ki-Bari', 'Monsoon Palace (Sajjangarh)', 'Fateh Sagar Lake'],
    safetyScore: 93,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹4,000 – ₹9,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 24.5854,
    longitude: 73.7125,
    highlights: ['Romantic sunset boat cruises on Lake Pichola', 'Labyrinthine courtyards of City Palace', 'Rooftop dining overlooking floating palaces'],
    thingsToDo: ['Boat cruise to Jag Mandir on Lake Pichola', 'Tour the expansive City Palace complex', 'Sunset watch from Monsoon Palace', 'Cultural evening at Bagore Ki Haveli'],
    transportOptions: ['✈️ Maharana Pratap Airport (UDR)', '🚆 Udaipur City Railway Station', '🚗 NH-58 scenic road corridor'],
    safetyOverview: 'Consistently ranked one of the safest and most hospitable destinations in Western India.',
    nearbyHospitals: [{ name: 'Geetanjali Hospital Udaipur', distance: '3.5 km', phone: '0294-2500000' }],
    nearbyPolice: [{ name: 'Lake Patrol & Tourist Police Desk', distance: '400 m', phone: '112 / 0294-2410100' }]
  },
  {
    id: 'jaisalmer',
    name: 'Jaisalmer',
    state: 'Rajasthan',
    category: 'Heritage & Nature',
    tagline: 'The Golden City & Thar Desert Gateway',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    description: 'Rising from the golden sands of the Thar Desert, boasting a living medieval fortress made of yellow sandstone, ornate Jain temples, and camel desert safaris.',
    popularAttractions: ['Jaisalmer Fort (Sonar Qila)', 'Sam Sand Dunes', 'Patwon Ki Haveli', 'Gadisar Lake', 'Desert National Park'],
    safetyScore: 91,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'November to February',
    estimatedBudget: '₹3,500 – ₹7,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 26.9157,
    longitude: 70.9083,
    highlights: ['Living medieval fort with resident communities', 'Sunset camel trek across Thar dunes', 'Intricately carved sandstone havelis'],
    thingsToDo: ['Desert safari and glamping at Sam Dunes', 'Walk through the narrow alleys of Sonar Qila', 'Boating on Gadisar Lake', 'Stargazing in the Thar desert'],
    transportOptions: ['✈️ Jaisalmer Airport (JSA)', '🚆 Jaisalmer Railway Station', '🚗 Jodhpur to Jaisalmer Highway (4.5 hrs)'],
    safetyOverview: 'Dedicated desert tourism patrols and border security guidance units.',
    nearbyHospitals: [{ name: 'Jaisalmer District Civil Hospital', distance: '1.2 km', phone: '02992-252343' }],
    nearbyPolice: [{ name: 'Jaisalmer Fort Police Post', distance: '200 m', phone: '112 / 02992-252233' }]
  },

  // --- HIMACHAL PRADESH ---
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    category: 'Hill Station',
    tagline: 'Queen of Hill Stations & Former British Summer Capital',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=80',
    description: 'Surrounded by pine and deodar forests with snow-capped Himalayan panoramas, colonial heritage buildings, pedestrian-only Mall Road, and the UNESCO Toy Train.',
    popularAttractions: ['The Ridge & Christ Church', 'Mall Road', 'Jakhoo Temple & Giant Hanuman Statue', 'Kalka-Shimla Toy Train (UNESCO)', 'Kufri Snow Point', 'Viceregal Lodge'],
    safetyScore: 94,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'March to June (Summer) & December to February (Snowfall)',
    estimatedBudget: '₹3,500 – ₹8,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 31.1048,
    longitude: 77.1734,
    highlights: ['UNESCO Kalka-Shimla Toy Train journey', 'Snow activities in Kufri', 'Stroll on traffic-free Mall Road'],
    thingsToDo: ['Ride the Kalka-Shimla narrow gauge train', 'Take the Jakhoo Ropeway to summit', 'Walk along The Ridge', 'Snow skiing in Kufri during winter'],
    transportOptions: ['🚗 NH-5 4-lane expressway from Chandigarh (3 hrs)', '🚆 UNESCO Toy Train from Kalka', '✈️ Shimla Airport (Jubbarhatti - SLV)'],
    safetyOverview: 'Extremely peaceful mountain station with continuous tourist assistance kiosks and hill safety monitoring.',
    nearbyHospitals: [{ name: 'Indira Gandhi Medical College (IGMC) Shimla', distance: '1.8 km', phone: '0177-2804251' }],
    nearbyPolice: [{ name: 'The Mall Police Assistance Booth', distance: '200 m', phone: '112 / 0177-2652123' }]
  },
  {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    category: 'Hill Station & Adventure',
    tagline: 'Valley of the Gods & Adventure Hub of the Himalayas',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    description: 'Nestled along the rushing Beas River beneath soaring snow peaks. The gateway to Rohtang Pass, Solang Valley adventures, and high-altitude Himalayan road trips.',
    popularAttractions: ['Solang Valley', 'Rohtang Pass (Snow Point)', 'Hadimba Temple', 'Atal Tunnel', 'Old Manali Cafes', 'Jogini Waterfalls'],
    safetyScore: 91,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to June',
    estimatedBudget: '₹3,500 – ₹8,500 / day',
    recommendedDuration: '3 - 4 Days',
    latitude: 32.2432,
    longitude: 77.1892,
    highlights: ['Atal Tunnel engineering marvel', 'Paragliding & skiing in Solang Valley', 'Tranquil cedar woods around Hadimba Temple'],
    thingsToDo: ['Drive through Atal Tunnel into Lahaul', 'Paragliding and zorbing at Solang', 'Trek to Jogini Waterfalls', 'Relax in Old Manali live-music cafes'],
    transportOptions: ['✈️ Kullu-Manali Airport (Bhuntar - KUU - 50 km)', '🚗 Scenic highway via Chandigarh & Mandi', '🚌 Volvo AC sleeper coaches from Delhi'],
    safetyOverview: 'Active Mountain Rescue Units and daily weather/avalanche status advisories at tourist outposts.',
    nearbyHospitals: [{ name: 'Civil Hospital Manali', distance: '1.0 km', phone: '01902-252327' }],
    nearbyPolice: [{ name: 'Manali Tourist Police Station', distance: '500 m', phone: '112 / 01902-252322' }]
  },

  // --- UTTARAKHAND ---
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    category: 'Spiritual & Adventure',
    tagline: 'Yoga Capital of the World & River Rafting Hub',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    description: 'Set in the foothills of the Himalayas along the emerald Ganges. Famed for ancient ashrams, Beatles heritage, world-class white water rafting, and cliff jumping.',
    popularAttractions: ['Ram Jhula & Laxman Jhula', 'Triveni Ghat Evening Aarti', 'Beatles Ashram (Chaurasi Kutia)', 'Shivpuri River Rafting', 'Neelkanth Mahadev Temple'],
    safetyScore: 93,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'September to May',
    estimatedBudget: '₹2,500 – ₹6,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 30.0869,
    longitude: 78.2676,
    highlights: ['Grade III & IV white water river rafting', 'Ganga Aarti at Triveni Ghat', 'Meditation and yoga retreats'],
    thingsToDo: ['River rafting down the Ganges from Shivpuri', 'Attend evening Triveni Aarti', 'Explore the Beatles graffiti ashram', 'Bungee jumping at Mohan Chatti'],
    transportOptions: ['✈️ Dehradun Jolly Grant Airport (DED - 20 km)', '🚆 Yog Nagari Rishikesh Railway Station', '🚗 Delhi to Rishikesh Highway (5 hrs)'],
    safetyOverview: 'Certified river rafting safety marshals and 24/7 tourist assistance desks.',
    nearbyHospitals: [{ name: 'AIIMS Rishikesh', distance: '3.0 km', phone: '0135-2462929' }],
    nearbyPolice: [{ name: 'Muni Ki Reti Police Station', distance: '600 m', phone: '112 / 0135-2430030' }]
  },
  {
    id: 'haridwar',
    name: 'Haridwar',
    state: 'Uttarakhand',
    category: 'Spiritual',
    tagline: 'Gateway to the Gods & Sacred Kumbh Destination',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
    description: 'Where the sacred Ganges emerges from the Himalayas onto the plains of North India. Revering millions with the celestial evening Aarti at Har Ki Pauri.',
    popularAttractions: ['Har Ki Pauri', 'Mansa Devi Temple', 'Chandi Devi Temple', 'Maya Devi Temple', 'Shanti Kunj'],
    safetyScore: 92,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to April',
    estimatedBudget: '₹2,000 – ₹5,000 / day',
    recommendedDuration: '1 - 2 Days',
    latitude: 29.9457,
    longitude: 78.1642,
    highlights: ['Mesmerizing floating diyas during Ganga Aarti', 'Ropeway ride to hilltop Mansa Devi', 'Ancient holy ghats'],
    thingsToDo: ['Witness Har Ki Pauri evening Aarti', 'Ropeway car up to Mansa Devi', 'Take holy dip at Brahmakund', 'Visit Ayurvedic pharmacies'],
    transportOptions: ['🚆 Haridwar Junction (Direct Vande Bharat & Shatabdi)', '✈️ Dehradun Airport (35 km)', '🚗 NH-334 from Delhi (4 hrs)'],
    safetyOverview: 'Comprehensive crowd safety corridors and river safety diver units along all main ghats.',
    nearbyHospitals: [{ name: 'District Hospital Haridwar', distance: '1.2 km', phone: '01334-226066' }],
    nearbyPolice: [{ name: 'Har Ki Pauri Police Post', distance: '100 m', phone: '112 / 01334-227222' }]
  },

  // --- JAMMU & KASHMIR ---
  {
    id: 'srinagar',
    name: 'Srinagar',
    state: 'Jammu and Kashmir',
    category: 'Hill Station & Nature',
    tagline: 'Paradise on Earth & Jewel of the Kashmir Valley',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    description: 'Famed for peaceful wooden houseboats floating on serene Dal Lake, Mughal terraced gardens, vibrant Shikara water markets, and saffron fields.',
    popularAttractions: ['Dal Lake & Shikara Rides', 'Mughal Gardens (Nishat & Shalimar)', 'Shankaracharya Temple', 'Pari Mahal', 'Nigeen Lake', 'Tulip Garden'],
    safetyScore: 89,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'April to October (Spring/Summer) & December to February (Snowfall)',
    estimatedBudget: '₹4,000 – ₹9,000 / day',
    recommendedDuration: '3 - 5 Days',
    latitude: 34.0837,
    longitude: 74.7973,
    highlights: ['Stay in an ornate cedar wood houseboat', 'Floating vegetable market at dawn', 'Asia’s largest Tulip Garden in bloom'],
    thingsToDo: ['Shikara sunset ride on Dal Lake', 'Stroll through Shalimar Bagh', 'Visit Shankaracharya hilltop temple', 'Day trips to Gulmarg and Pahalgam'],
    transportOptions: ['✈️ Sheikh ul-Alam International Airport Srinagar (SXR)', '🚆 Udhampur-Srinagar-Baramulla Rail Link (USBRL)', '🚗 NH-44 highway corridor'],
    safetyOverview: 'Specialized Jammu & Kashmir Tourist Police with 24/7 tourist reception centers at TRC Srinagar and airport desks.',
    nearbyHospitals: [{ name: 'SMHS Hospital Srinagar', distance: '2.5 km', phone: '0194-2504114' }],
    nearbyPolice: [{ name: 'Tourist Police Station TRC Srinagar', distance: '300 m', phone: '112 / 0194-2450045' }]
  },

  // --- LADAKH ---
  {
    id: 'leh',
    name: 'Leh & Ladakh',
    state: 'Ladakh',
    category: 'Hill Station & Adventure',
    tagline: 'The Land of High Mountain Passes & Buddhist Monasteries',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    description: 'High-altitude desert wonderland featuring crystal-clear azure lakes, ancient cliffside Tibetan Buddhist gompas, and world’s highest motorable mountain passes.',
    popularAttractions: ['Pangong Tso Lake', 'Nubra Valley & Hunder Sand Dunes', 'Khardung La Pass (5,359m)', 'Thiksey Monastery', 'Leh Palace', 'Magnetic Hill'],
    safetyScore: 92,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'May to September',
    estimatedBudget: '₹4,500 – ₹10,000 / day',
    recommendedDuration: '5 - 7 Days',
    latitude: 34.1526,
    longitude: 77.5771,
    highlights: ['Color-shifting waters of Pangong Lake', 'Double-humped Bactrian camel ride in Nubra', 'Sunrise prayers at Thiksey Monastery'],
    thingsToDo: ['Drive across Khardung La', 'Camp under starry skies at Pangong Tso', 'Explore ancient Leh Palace', 'Visit Magnetic Hill optical anomaly'],
    transportOptions: ['✈️ Kushok Bakula Rimpochee Airport Leh (IXL)', '🚗 Manali-Leh Highway (Scenic 2-day pass drive)', '🚗 Srinagar-Leh Highway via Kargil'],
    safetyOverview: 'Mandatory altitude acclimatization guidelines enforced. Medical oxygen kiosks stationed along high passes.',
    nearbyHospitals: [{ name: 'SNM District Hospital Leh', distance: '1.2 km', phone: '01982-252014' }],
    nearbyPolice: [{ name: 'Leh Tourist Police Outpost', distance: '400 m', phone: '112 / 01982-252018' }]
  },

  // --- PUNJAB ---
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    category: 'Heritage & Spiritual',
    tagline: 'Home of the Golden Temple & Soul of Punjab',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b763?auto=format&fit=crop&w=1000&q=80',
    description: 'The spiritual heart of Sikhism, celebrated worldwide for the glittering Golden Temple, the patriotic Wagah Border retreat ceremony, and legendary Punjabi hospitality.',
    popularAttractions: ['Golden Temple (Harmandir Sahib)', 'Jallianwala Bagh Memorial', 'Wagah Border Beating Retreat Ceremony', 'Gobindgarh Fort', 'Partition Museum'],
    safetyScore: 94,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹2,500 – ₹6,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 31.6200,
    longitude: 74.8765,
    highlights: ['Gleaming sanctum of Harmandir Sahib reflected in the holy Sarovar', 'World’s largest community kitchen (Langar) serving 100,000 daily', 'Electric patriotic energy at Wagah Border'],
    thingsToDo: ['Voluntary service and Langar at Golden Temple', 'Watch evening Palki Sahib ceremony', 'Attend Wagah Border Beating Retreat', 'Sample authentic Amritsari Kulcha & Lassi'],
    transportOptions: ['✈️ Sri Guru Ram Dass Jee International Airport (ATQ)', '🚆 Amritsar Junction (Vande Bharat & Shatabdi)', '🚗 Grand Trunk Road (NH-44)'],
    safetyOverview: 'Dedicated 24/7 pilgrim assistance booths with high civic safety ratings.',
    nearbyHospitals: [{ name: 'Guru Nanak Dev Hospital Amritsar', distance: '2.5 km', phone: '0183-2573210' }],
    nearbyPolice: [{ name: 'Golden Temple Tourist Police Post', distance: '150 m', phone: '112 / 0183-2557999' }]
  },

  // --- WEST BENGAL ---
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    category: 'Urban & Culture',
    tagline: 'The City of Joy & Cultural Capital of Modern India',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1000&q=80',
    description: 'A deeply intellectual and artistic metropolis famed for colonial British landmarks, yellow taxis, tramcars, Rabindra Sangeet, Durga Puja, and legendary Bengali sweets.',
    popularAttractions: ['Victoria Memorial', 'Howrah Bridge', 'Dakshineswar Kali Temple', 'Indian Museum', 'Park Street', 'Belur Math'],
    safetyScore: 90,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March (Durga Puja & Winter season)',
    estimatedBudget: '₹3,000 – ₹7,500 / day',
    recommendedDuration: '3 - 4 Days',
    latitude: 22.5726,
    longitude: 88.3639,
    highlights: ['Majestic white marble Victoria Memorial', 'Historic cantilever Howrah Bridge over Hooghly river', 'Iconic century-old yellow ambassador taxis and trams'],
    thingsToDo: ['Explore Victoria Memorial gardens & gallery', 'Ferry ride across Hooghly from Howrah to Babu Ghat', 'Taste authentic Roshogolla and Sandesh', 'Evening walk down illuminated Park Street'],
    transportOptions: ['✈️ Netaji Subhash Chandra Bose International Airport (CCU)', '🚆 Howrah (HWH) & Sealdah (SDAH) Terminals', '🚇 Kolkata Metro (including India’s first underwater metro)'],
    safetyOverview: 'Active Kolkata Police commissionerate with round-the-clock tourist help desks.',
    nearbyHospitals: [{ name: 'SSKM Government Hospital Kolkata', distance: '2.0 km', phone: '033-22231589' }],
    nearbyPolice: [{ name: 'Maidan Tourist Police Kiosk', distance: '400 m', phone: '112 / 033-22143000' }]
  },
  {
    id: 'darjeeling',
    name: 'Darjeeling',
    state: 'West Bengal',
    category: 'Hill Station',
    tagline: 'Queen of the Hills & Home of Champagne Tea',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    description: 'Perched along the emerald Himalayan slopes facing Mt. Kanchenjunga (world’s 3rd highest peak). Renowned for the UNESCO Toy Train and world-celebrated orthodox black tea.',
    popularAttractions: ['Tiger Hill (Kanchenjunga Sunrise)', 'Darjeeling Himalayan Railway (UNESCO Toy Train)', 'Batasia Loop', 'Happy Valley Tea Estate', 'Himalayan Mountaineering Institute'],
    safetyScore: 93,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'March to May & October to December',
    estimatedBudget: '₹3,000 – ₹7,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 27.0410,
    longitude: 88.2663,
    highlights: ['Golden sunrise over Kanchenjunga peak from Tiger Hill', 'Historic steam locomotive Toy Train ride', 'Aromatic tea estate walking tours'],
    thingsToDo: ['Early morning drive to Tiger Hill for sunrise', 'Ride the heritage steam toy train around Batasia Loop', 'Tea tasting tour at Happy Valley', 'Stroll through Chowrasta Mall'],
    transportOptions: ['✈️ Bagdogra Airport (IXB - 68 km)', '🚆 New Jalpaiguri Railway Station (NJP - 72 km)', '🚗 Hill road drive via Kurseong (3 hrs)'],
    safetyOverview: 'Peaceful mountain district with dedicated Hill Police monitoring and mountain tourist guides.',
    nearbyHospitals: [{ name: 'Darjeeling District Hospital', distance: '1.2 km', phone: '0354-2254218' }],
    nearbyPolice: [{ name: 'Chowrasta Police Post', distance: '200 m', phone: '112 / 0354-2252222' }]
  },

  // --- SIKKIM ---
  {
    id: 'gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    category: 'Hill Station & Nature',
    tagline: 'Capital of the Organic Himalayan Kingdom',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    description: 'A spotless, progressive mountain capital overlooking Mt. Kanchenjunga. Featuring vibrant Buddhist monasteries, alpine glacial lakes, cable cars, and flower shows.',
    popularAttractions: ['Tsomgo Glacial Lake', 'Nathula Pass (Indo-China Border)', 'Rumtek Monastery', 'MG Marg Pedestrian Boulevard', 'Ban Jhakri Waterfalls'],
    safetyScore: 96,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'March to June & September to December',
    estimatedBudget: '₹3,500 – ₹8,000 / day',
    recommendedDuration: '3 - 4 Days',
    latitude: 27.3389,
    longitude: 88.6065,
    highlights: ['High-altitude frozen Tsomgo Lake at 3,753m', 'Litter-free, vehicle-free MG Marg promenade', 'Grand architecture of Rumtek Monastery'],
    thingsToDo: ['Yak ride at Tsomgo Lake', 'Excursion to historic Silk Route at Nathula', 'Ropeway ride across Gangtok valley', 'Evening café hopping on MG Marg'],
    transportOptions: ['✈️ Pakyong Airport (PYG - 30 km) or Bagdogra (IXB - 120 km)', '🚗 Scenic highway drive along Teesta River (4 hrs)', '🚆 Nearest Railhead: NJP (115 km)'],
    safetyOverview: 'Ranked India’s safest state with zero-tolerance littering and highly courteous tourist police units.',
    nearbyHospitals: [{ name: 'STNM Central Hospital Gangtok', distance: '2.0 km', phone: '03592-202944' }],
    nearbyPolice: [{ name: 'MG Marg Tourist Police Assistance Booth', distance: '100 m', phone: '112 / 03592-202022' }]
  },

  // --- MEGHALAYA ---
  {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    category: 'Hill Station & Nature',
    tagline: 'The Scotland of the East & Rock Music Capital',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80',
    description: 'Misty pine hills, cascading tiered waterfalls, crystal-clear Dawki river, living root bridges, and a thriving indie music culture.',
    popularAttractions: ['Elephant Falls', 'Umiam Lake (Barapani)', 'Laitlum Canyons', 'Shillong Peak', 'Cherrapunji (Sohra)', 'Dawki River'],
    safetyScore: 93,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'September to May',
    estimatedBudget: '₹3,500 – ₹7,500 / day',
    recommendedDuration: '3 - 4 Days',
    latitude: 25.5788,
    longitude: 91.8933,
    highlights: ['Living Root Bridges of Meghalaya', 'Glass-clear waters of Umngot River in Dawki', 'Breathtaking gorges of Laitlum Canyons'],
    thingsToDo: ['Boating on Umiam Lake', 'Day trek to Double Decker Living Root Bridge', 'Boat ride over transparent waters of Dawki', 'Photography at Elephant Falls'],
    transportOptions: ['✈️ Shillong Airport (Umroi - SHL) or Guwahati Airport (GAU - 120 km)', '🚗 Scenic 4-lane expressway from Guwahati (3 hrs)', '🚆 Nearest Railhead: Guwahati (GHY)'],
    safetyOverview: 'Welcoming matrilineal society with proactive tourism information officers.',
    nearbyHospitals: [{ name: 'NEIGRIHMS Shillong', distance: '4.5 km', phone: '0364-2538025' }],
    nearbyPolice: [{ name: 'Police Bazaar Tourist Helpdesk', distance: '300 m', phone: '112 / 0364-2222214' }]
  },

  // --- KERALA ---
  {
    id: 'kochi',
    name: 'Kochi (Cochin)',
    state: 'Kerala',
    category: 'Coastal & Heritage',
    tagline: 'Queen of the Arabian Sea & Historic Spice Port',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    description: 'A cosmopolitan coastal port blending 600 years of Portuguese, Dutch, British, and Jewish heritage with cantilevered Chinese fishing nets and modern art biennales.',
    popularAttractions: ['Fort Kochi Chinese Fishing Nets', 'Mattancherry Palace (Dutch Palace)', 'Jew Town & Paradesi Synagogue', 'St. Francis Church', 'Marine Drive Kochi'],
    safetyScore: 93,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'September to March',
    estimatedBudget: '₹3,500 – ₹8,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 9.9312,
    longitude: 76.2673,
    highlights: ['Iconic cantilever Chinese fishing nets at sunset', 'Historic 16th-century Jew Town spice markets', 'Water Metro ferry transit across Arabian backwaters'],
    thingsToDo: ['Watch fishermen operate Chinese fishing nets', 'Heritage bicycle tour in Fort Kochi', 'Attend a traditional Kathakali dance performance', 'Ride the modern Kochi Water Metro'],
    transportOptions: ['✈️ Cochin International Airport (COK - World’s first solar airport)', '🚆 Ernakulam Junction (ERS) & Town (ERN)', '🚇 Kochi Metro Rail & Water Metro'],
    safetyOverview: 'Dedicated Kerala Tourist Police desk stationed directly in Fort Kochi promenade.',
    nearbyHospitals: [{ name: 'Aster Medcity Kochi', distance: '5.0 km', phone: '0484-6699999' }],
    nearbyPolice: [{ name: 'Fort Kochi Tourist Police Station', distance: '200 m', phone: '112 / 0484-2215055' }]
  },
  {
    id: 'munnar',
    name: 'Munnar',
    state: 'Kerala',
    category: 'Hill Station & Nature',
    tagline: 'Emerald Tea Hills & The Kashmir of South India',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    description: 'Sprawling carpet of manicured green tea plantations, misty valleys, endangered Nilgiri Tahr mountain goats, and refreshing Western Ghats climate.',
    popularAttractions: ['Eravikulam National Park (Nilgiri Tahr)', 'Mattupetty Dam & Lake', 'Tea Museum Munnar', 'Anamudi Peak (Highest in South India)', 'Top Station', 'Attukal Waterfalls'],
    safetyScore: 94,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'September to May',
    estimatedBudget: '₹3,500 – ₹8,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 10.0889,
    longitude: 77.0595,
    highlights: ['Endangered Nilgiri Tahr in Eravikulam', 'Endless undulating green tea carpet valleys', 'Panoramic views over Tamil Nadu plains from Top Station'],
    thingsToDo: ['Safari in Eravikulam National Park', 'Speedboat ride at Mattupetty Lake', 'Learn tea processing at KDHP Tea Museum', 'Trek to Anamudi viewpoint'],
    transportOptions: ['🚗 Scenic hill highway drive from Kochi (3.5 hrs)', '✈️ Nearest Airport: Kochi (COK - 110 km)', '🚆 Nearest Railhead: Aluva (105 km)'],
    safetyOverview: 'Strict eco-tourism protection rules with Forest Range officer safety checkpoints.',
    nearbyHospitals: [{ name: 'Tata General Hospital Munnar', distance: '1.5 km', phone: '04865-230222' }],
    nearbyPolice: [{ name: 'Munnar Police Station', distance: '800 m', phone: '112 / 04865-230321' }]
  },

  // --- GOA ---
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    category: 'Coastal & Heritage',
    tagline: 'Sun, Golden Sands, Susegad & Portuguese Heritage',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    description: 'India’s premier beach haven, offering golden sands, UNESCO Old Goa cathedrals, Portuguese colonial architecture in Fontainhas, spice plantations, and fresh seafood.',
    popularAttractions: ['Fort Aguada', 'Basilica of Bom Jesus (UNESCO)', 'Palolem Beach', 'Dudhsagar Waterfalls', 'Anjuna Flea Market', 'Fontainhas Latin Quarter'],
    safetyScore: 91,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'November to March',
    estimatedBudget: '₹4,500 – ₹11,000 / day',
    recommendedDuration: '3 - 5 Days',
    latitude: 15.2993,
    longitude: 74.1240,
    highlights: ['Pristine South Goa coastlines', 'UNESCO 16th-century Old Goa churches', 'Sunset cruises on Mandovi River'],
    thingsToDo: ['Water sports at Calangute & Baga', 'Heritage walking tour in Fontainhas', 'Trek to Dudhsagar waterfall viewpoint', 'Dine on authentic Goan fish curry at seaside shacks'],
    transportOptions: ['✈️ Dabolim Airport (GOI) & Mopa Airport (GOX)', '🚆 Madgaon (MAO) & Thivim (THVM) Railway Stations', '🚗 NH-66 Coastal Highway'],
    safetyOverview: 'Active coastal tourist police patrols and certified beach lifeguards across public zones.',
    nearbyHospitals: [{ name: 'Goa Medical College Hospital (Bambolim)', distance: '4.5 km', phone: '0832-2458727' }],
    nearbyPolice: [{ name: 'Goa Tourist Police Central Unit', distance: '1.2 km', phone: '112 / 0832-2426868' }]
  },

  // --- KARNATAKA ---
  {
    id: 'mysuru',
    name: 'Mysuru (Mysore)',
    state: 'Karnataka',
    category: 'Heritage',
    tagline: 'The Cultural & Royal Capital of Karnataka',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    description: 'Famed for its royal heritage, opulent palaces, vibrant silk markets, and aromatic sandalwood. Mysuru offers a rich blend of history and serenity.',
    popularAttractions: ['Mysore Palace (Amba Vilas)', 'Chamundeshwari Temple', 'Brindavan Gardens', 'Mysore Zoo', 'St. Philomena’s Cathedral'],
    safetyScore: 94,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March (Dasara Season)',
    estimatedBudget: '₹3,500 – ₹7,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 12.3052,
    longitude: 76.6552,
    highlights: ['Indo-Saracenic royal architecture', 'Illuminated evening palace lightings', 'Heritage culinary hotspots (Mylari Dosa)'],
    thingsToDo: ['Explore Mysore Palace Durbar Hall', 'Drive up Chamundi Hill viewpoint', 'Watch Brindavan musical fountains', 'Taste authentic Mylari benne masala dosa'],
    transportOptions: ['🚆 Vande Bharat / Shatabdi Express from Bengaluru (2 hrs)', '🚗 NH-275 10-Lane Expressway (2.5 hrs)', '🚌 KSRTC Airavat Club Class Coach'],
    safetyOverview: 'Consistently rated one of the safest tourist destinations in Southern India with dedicated 24/7 Tourist Police Desks.',
    nearbyHospitals: [{ name: 'Apollo BGS Hospital', distance: '3.5 km', phone: '0821-2568888' }],
    nearbyPolice: [{ name: 'Mysuru City Tourist Police Station', distance: '800 m', phone: '112 / 0821-2418100' }]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    category: 'Urban & Culture',
    tagline: 'Silicon Valley & Garden City of India',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    description: 'A vibrant cosmopolitan metropolis blending tech innovation, verdant gardens, colonial landmarks, artisanal microbreweries, and arts centers.',
    popularAttractions: ['Bangalore Palace', 'Lalbagh Botanical Garden', 'Cubbon Park', 'Vidhana Soudha', 'ISKCON Temple'],
    safetyScore: 90,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'Year-round (Pleasant temperate climate)',
    estimatedBudget: '₹4,500 – ₹9,500 / day',
    recommendedDuration: '2 - 4 Days',
    latitude: 12.9716,
    longitude: 77.5946,
    highlights: ['Lush 240-acre botanical gardens', 'Lively cafe and craft culinary scene', 'Modern rapid Namma Metro transit'],
    thingsToDo: ['Walk through Lalbagh Glass House', 'Explore Tudor-style Bangalore Palace', 'Stroll along Church Street & MG Road', 'Visit the Aerospace Museum'],
    transportOptions: ['✈️ Kempegowda International Airport (BLR)', '🚆 KSR Bengaluru City Junction', '🚇 Namma Metro Purple & Green Lines'],
    safetyOverview: 'Well-policed metropolitan jurisdiction with active 112 emergency response dispatchers and pink hoysala patrols.',
    nearbyHospitals: [{ name: 'Manipal Hospital Old Airport Rd', distance: '2.8 km', phone: '080-25024444' }],
    nearbyPolice: [{ name: 'Cubbon Park Police Helpdesk', distance: '600 m', phone: '112 / 080-22942222' }]
  },
  {
    id: 'coorg',
    name: 'Coorg (Kodagu)',
    state: 'Karnataka',
    category: 'Hill Station',
    tagline: 'The Scotland of India & Coffee Hills',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    description: 'Misty green valleys, rolling coffee and cardamom plantations, thundering waterfalls, and authentic Kodava hospitality.',
    popularAttractions: ['Abbey Falls', 'Raja’s Seat', 'Dubare Elephant Camp', 'Namdroling Golden Temple (Bylakuppe)', 'Talakaveri'],
    safetyScore: 92,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to May',
    estimatedBudget: '₹4,000 – ₹9,000 / day',
    recommendedDuration: '3 - 4 Days',
    latitude: 12.4244,
    longitude: 75.7382,
    highlights: ['Coffee plantation homestays', 'Mist-shrouded viewpoints', 'Tibetan monastic golden temples'],
    thingsToDo: ['Tour an organic coffee & spice estate', 'River rafting in Barapole River', 'Sunset photography at Raja’s Seat', 'Visit Dubare riverfront camp'],
    transportOptions: ['🚗 Scenic Western Ghats road drive via Mysuru (3 hrs)', '🚌 KSRTC AC Deluxe sleepers', '✈️ Nearest Airport: Kannur (CNN) or Mangaluru (IXE)'],
    safetyOverview: 'Tranquil eco-tourism hill zone with proactive forest range safety teams.',
    nearbyHospitals: [{ name: 'Madikeri District Civil Hospital', distance: '2.0 km', phone: '08272-228344' }],
    nearbyPolice: [{ name: 'Madikeri Town Police Station', distance: '1.1 km', phone: '112 / 08272-228333' }]
  },
  {
    id: 'hampi',
    name: 'Hampi',
    state: 'Karnataka',
    category: 'Heritage',
    tagline: 'UNESCO World Heritage City of Ruins',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b763?auto=format&fit=crop&w=1000&q=80',
    description: 'An open-air museum of giant boulder-strewn hills and awe-inspiring ruins of the 14th-century Vijayanagara Empire along the Tungabhadra river.',
    popularAttractions: ['Virupaksha Temple', 'Vijaya Vittala Temple & Stone Chariot', 'Lotus Mahal & Elephant Stables', 'Matanga Hill', 'Coracle Ride on Tungabhadra'],
    safetyScore: 89,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'November to February',
    estimatedBudget: '₹3,000 – ₹6,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 15.3350,
    longitude: 76.4600,
    highlights: ['Architectural marvel Stone Chariot', 'Musical stone pillars', 'Sunrise trek to Matanga Hill'],
    thingsToDo: ['Cycle around royal enclosure monuments', 'Take a traditional circular coracle ride', 'Climb Anjanadri Hill', 'Explore ancient bazaars'],
    transportOptions: ['🚆 Nearest Railhead: Hosapete Junction (HPT - 13 km)', '🚗 NH-50 highway drive from Bengaluru (6 hrs)', '🚌 KSRTC Rajahamsa/Airavat'],
    safetyOverview: 'UNESCO protected archaeological zone with dedicated ASI guards and illuminated monument corridors.',
    nearbyHospitals: [{ name: 'Hosapete Government Hospital', distance: '12.5 km', phone: '08394-228222' }],
    nearbyPolice: [{ name: 'Hampi Tourist Police Outpost', distance: '400 m', phone: '112 / 08394-241241' }]
  },
  {
    id: 'mangaluru',
    name: 'Mangaluru (Mangalore)',
    state: 'Karnataka',
    category: 'Coastal & Heritage',
    tagline: 'Gateway to Coastal Karnataka & Pristine Beaches',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    description: 'A vibrant port city famous for golden beaches, ancient temples, coastal Tuluva culture, and legendary seafood.',
    popularAttractions: ['Panambur Beach', 'Kadri Manjunath Temple', 'St. Aloysius Chapel', 'Tannirbhavi Beach', 'Kudroli Gokarnath Temple'],
    safetyScore: 92,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to February',
    estimatedBudget: '₹3,000 – ₹6,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 12.9141,
    longitude: 74.8560,
    highlights: ['Golden sand beaches & watersports', 'Century-old St. Aloysius fresco murals', 'Authentic coastal seafood & ghee roast'],
    thingsToDo: ['Sunset walk and jet-skiing at Panambur Beach', 'View historic frescoes at St. Aloysius', 'Visit Kadri Manjunatha cave temple', 'Taste coastal fish curry'],
    transportOptions: ['✈️ Mangaluru International Airport (IXE)', '🚆 Mangaluru Central & Junction Stations', '🚌 KSRTC Coastal Express'],
    safetyOverview: 'Peaceful coastal district with active coastal police units and beach lifeguards.',
    nearbyHospitals: [{ name: 'KMC Hospital Mangaluru', distance: '1.2 km', phone: '0824-2444590' }],
    nearbyPolice: [{ name: 'Mangaluru North Tourist Police Station', distance: '900 m', phone: '112 / 0824-2220800' }]
  },

  // --- TAMIL NADU ---
  {
    id: 'chennai',
    name: 'Chennai (Madras)',
    state: 'Tamil Nadu',
    category: 'Coastal & Heritage',
    tagline: 'Gateway to South Indian Art, Music & Heritage',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    description: 'The cultural capital of South India, celebrated for Dravidian temple architecture, classical Carnatic music, the world’s second-longest natural urban beach, and filter coffee.',
    popularAttractions: ['Marina Beach', 'Kapaleeshwarar Temple', 'San Thome Cathedral Basilica', 'Fort St. George', 'DakshinaChitra Heritage Museum'],
    safetyScore: 92,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'November to February',
    estimatedBudget: '₹3,500 – ₹7,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 13.0827,
    longitude: 80.2707,
    highlights: ['Iconic 13 km long Marina Beach promenade', 'Ancient 7th-century Kapaleeshwarar temple gopuram', 'Classical Carnatic music sabhas'],
    thingsToDo: ['Evening breeze and sundal at Marina Beach', 'Marvel at Dravidian architecture at Kapaleeshwarar Temple', 'Visit historic St. Thomas Mount', 'Sip authentic degree filter coffee'],
    transportOptions: ['✈️ Chennai International Airport (MAA)', '🚆 Chennai Central (MAS) & Chennai Egmore', '🚇 Chennai Metro Rail Network'],
    safetyOverview: 'Special Tourist Police booths along Marina and Besant Nagar beaches.',
    nearbyHospitals: [{ name: 'Apollo Hospital Greams Road', distance: '2.5 km', phone: '044-28290200' }],
    nearbyPolice: [{ name: 'Marina Beach Police Outpost', distance: '300 m', phone: '112 / 044-28442222' }]
  },
  {
    id: 'ooty',
    name: 'Ooty (Udhagamandalam)',
    state: 'Tamil Nadu',
    category: 'Hill Station',
    tagline: 'Queen of the Nilgiris & Mountain Toy Train',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    description: 'Nestled in the Nilgiri Blue Mountains with pine forests, sweeping tea estates, botanical gardens, and the iconic UNESCO heritage toy train.',
    popularAttractions: ['Nilgiri Mountain Railway (Toy Train)', 'Ooty Botanical Gardens', 'Ooty Lake & Boathouse', 'Doddabetta Peak', 'Pykara Waterfalls'],
    safetyScore: 93,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'March to June & September to November',
    estimatedBudget: '₹3,500 – ₹8,000 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 11.4102,
    longitude: 76.6950,
    highlights: ['UNESCO Steam Heritage Toy Train', 'Sweeping vistas from Doddabetta (2,637m)', 'Tea factory tours and tastings'],
    thingsToDo: ['Ride the Nilgiri Mountain Toy Train', 'Boating on Pykara Lake', 'Stroll through rose gardens', 'Taste handmade Nilgiri chocolates'],
    transportOptions: ['🚗 Scenic wildlife drive via Bandipur/Mudumalai from Mysuru (3.5 hrs)', '🚆 Toy train from Mettupalayam', '✈️ Nearest Airport: Coimbatore (CJB - 88 km)'],
    safetyOverview: 'Serene mountain district with strict wildlife sanctuary corridors.',
    nearbyHospitals: [{ name: 'Ooty District Hospital', distance: '1.5 km', phone: '0423-2442212' }],
    nearbyPolice: [{ name: 'Ooty Town Central Police Station', distance: '800 m', phone: '112 / 0423-2442333' }]
  },
  {
    id: 'madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    category: 'Heritage & Spiritual',
    tagline: 'The Temple City & Athens of the East',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    description: 'An ancient city on the Vaigai River, constructed in the shape of a lotus around the magnificent Meenakshi Amman Temple with towering multi-colored sculpted gopurams.',
    popularAttractions: ['Meenakshi Amman Temple', 'Thirumalai Nayakkar Mahal', 'Gandhi Memorial Museum', 'Koodal Azhagar Temple', 'Vandiyur Mariamman Teppakulam'],
    safetyScore: 93,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹2,500 – ₹6,000 / day',
    recommendedDuration: '2 Days',
    latitude: 9.9252,
    longitude: 78.1198,
    highlights: ['14 soaring gopurams of Meenakshi Temple', 'Historic Nayakkar Palace light & sound show', 'Famous Madurai Jigarthanda and Kari Dosa'],
    thingsToDo: ['Explore Meenakshi Temple Hall of Thousand Pillars', 'Night ceremony (Palliyarai Pooja)', 'Taste original Famous Jigarthanda', 'Visit Gandhi Memorial Museum'],
    transportOptions: ['✈️ Madurai International Airport (IXM)', '🚆 Madurai Junction', '🚗 NH-44 highway from Chennai / Bengaluru'],
    safetyOverview: 'High-security temple corridor with dedicated tourist police escort desks.',
    nearbyHospitals: [{ name: 'Government Rajaji Hospital Madurai', distance: '1.5 km', phone: '0452-2532535' }],
    nearbyPolice: [{ name: 'Meenakshi Amman Temple Police Post', distance: '100 m', phone: '112 / 0452-2336300' }]
  },

  // --- TELANGANA ---
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    category: 'Heritage & Urban',
    tagline: 'City of Pearls & Royal Nizami Splendor',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1000&q=80',
    description: 'A grand metropolis where historic royal Nizami heritage meets futuristic cyber tech corridors. World-renowned for authentic Hyderabadi Biryani.',
    popularAttractions: ['Charminar', 'Golconda Fort', 'Qutb Shahi Tombs', 'Hussain Sagar Lake & Buddha Statue', 'Salar Jung Museum', 'Ramoji Film City'],
    safetyScore: 91,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹3,500 – ₹8,000 / day',
    recommendedDuration: '2 - 4 Days',
    latitude: 17.3850,
    longitude: 78.4867,
    highlights: ['Acoustic engineering at Golconda Fort', '16th-century Charminar monument', 'World-famous authentic Dum Biryani'],
    thingsToDo: ['Sound & light show at Golconda Fort', 'Sunset boat cruise on Hussain Sagar', 'Shop for pearls in Laad Bazaar', 'Tour antique treasures at Salar Jung Museum'],
    transportOptions: ['✈️ Rajiv Gandhi International Airport (HYD)', '🚆 Secunderabad & Hyderabad Deccan (Nampally) Stations', '🚇 Hyderabad Rapid Metro Transit'],
    safetyOverview: 'SHE Teams women safety units active across public transit with continuous 24/7 CCTV surveillance.',
    nearbyHospitals: [{ name: 'Apollo Hospitals Jubilee Hills', distance: '3.0 km', phone: '040-23607777' }],
    nearbyPolice: [{ name: 'Hyderabad Central Police Control Room', distance: '1.0 km', phone: '112 / 040-27852435' }]
  },

  // --- ANDHRA PRADESH ---
  {
    id: 'tirupati',
    name: 'Tirupati',
    state: 'Andhra Pradesh',
    category: 'Spiritual',
    tagline: 'Spiritual Capital & Abode of Lord Venkateswara',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b763?auto=format&fit=crop&w=1000&q=80',
    description: 'World’s most-visited pilgrimage destination situated in the holy Seshachalam Hills. Famed for the ancient Tirumala Venkateswara Temple and divine prasadam.',
    popularAttractions: ['Tirumala Venkateswara Temple', 'Sri Padmavathi Ammavari Temple', 'Kapila Theertham', 'Silathoranam (Natural Rock Arch)', 'Chandragiri Fort'],
    safetyScore: 95,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'September to March',
    estimatedBudget: '₹2,500 – ₹6,000 / day',
    recommendedDuration: '2 Days',
    latitude: 13.6288,
    longitude: 79.4192,
    highlights: ['Darshan of Lord Balaji in golden sanctum', 'World-famous Tirupati Laddu Prasadam', 'Scenic 7-hills ghat road drive'],
    thingsToDo: ['Darshan at Tirumala Temple', 'Trek the sacred Alipiri foot-steps path', 'Visit geological wonder Silathoranam', 'Explore historic Chandragiri Fort'],
    transportOptions: ['✈️ Tirupati International Airport (TIR)', '🚆 Tirupati Main Railway Station (TPTY)', '🚗 4-Lane Highway from Chennai (3 hrs) / Bengaluru (4 hrs)'],
    safetyOverview: 'TTD Vigilance and Security along with Andhra Pradesh Police operate comprehensive safety monitoring.',
    nearbyHospitals: [{ name: 'SVIMS Super Speciality Hospital Tirupati', distance: '2.0 km', phone: '0877-2287777' }],
    nearbyPolice: [{ name: 'Tirumala Police Station', distance: '500 m', phone: '112 / 0877-2263433' }]
  },

  // --- ODISHA ---
  {
    id: 'puri',
    name: 'Puri & Konark',
    state: 'Odisha',
    category: 'Spiritual & Coastal',
    tagline: 'Abode of Lord Jagannath & Black Pagoda Sun Temple',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    description: 'Historic coastal spiritual sanctuary famous for the sacred 12th-century Jagannath Temple, the grand annual Ratha Yatra festival, and the architectural wonder Konark Sun Temple.',
    popularAttractions: ['Jagannath Temple Puri', 'Konark Sun Temple (UNESCO)', 'Golden Beach Puri (Blue Flag Certified)', 'Chilika Lake (Dolphin Sanctuary)', 'Raghurajpur Heritage Craft Village'],
    safetyScore: 92,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹2,500 – ₹6,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 19.8135,
    longitude: 85.8312,
    highlights: ['UNESCO Sun Temple colossal stone chariot wheels', 'Certified clean Blue Flag Golden Beach', 'Irrawaddy dolphin boat cruise at Chilika'],
    thingsToDo: ['Darshan at Jagannath Temple', 'Explore Konark Sun Temple stone sculptures', 'Boat safari in Chilika Lake', 'Pattachitra painting workshop in Raghurajpur'],
    transportOptions: ['✈️ Biju Patnaik Airport Bhubaneswar (BBI - 60 km)', '🚆 Puri Railway Station', '🚗 Marine Drive highway between Puri and Konark'],
    safetyOverview: 'Odisha Tourist Police units deployed along the Blue Flag beach and temple plaza.',
    nearbyHospitals: [{ name: 'District Headquarters Hospital Puri', distance: '1.0 km', phone: '06752-222026' }],
    nearbyPolice: [{ name: 'Puri Sea Beach Police Station', distance: '300 m', phone: '112 / 06752-222073' }]
  },

  // --- ANDAMAN & NICOBAR ISLANDS ---
  {
    id: 'andaman',
    name: 'Andaman & Nicobar Islands (Port Blair / Havelock)',
    state: 'Andaman and Nicobar Islands',
    category: 'Coastal & Nature',
    tagline: 'Tropical Archipelago of White Sands & Coral Reefs',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    description: 'A pristine tropical archipelago in the Bay of Bengal, featuring turquoise waters, Radhanagar Beach, scuba diving amongst vibrant coral reefs, and Cellular Jail history.',
    popularAttractions: ['Cellular Jail National Memorial', 'Radhanagar Beach (Havelock)', 'Elephant Beach Snorkeling', 'Neil Island (Bharatpur Beach)', 'Baratang Limestone Caves'],
    safetyScore: 95,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to May',
    estimatedBudget: '₹5,000 – ₹12,000 / day',
    recommendedDuration: '4 - 6 Days',
    latitude: 11.6234,
    longitude: 92.7265,
    highlights: ['Time Magazine rated Radhanagar Beach', 'Scuba diving with manta rays and sea turtles', 'Sound & light show at historic Cellular Jail'],
    thingsToDo: ['Scuba diving or sea walking in Havelock', 'Watch sunset at Radhanagar Beach', 'Light and Sound show at Cellular Jail', 'Ferry cruise across inter-island waters'],
    transportOptions: ['✈️ Veer Savarkar International Airport Port Blair (IXZ)', '🚢 Passenger ships from Chennai, Kolkata, and Visakhapatnam', '🛥️ Makruzz / Green Ocean inter-island catamarans'],
    safetyOverview: 'Certified dive masters and continuous maritime search-and-rescue patrol boats.',
    nearbyHospitals: [{ name: 'G.B. Pant Hospital Port Blair', distance: '1.5 km', phone: '03192-232102' }],
    nearbyPolice: [{ name: 'Port Blair Tourist Police Outpost', distance: '400 m', phone: '112 / 03192-232100' }]
  },

  // --- PUDUCHERRY ---
  {
    id: 'pondicherry',
    name: 'Pondicherry (Puducherry)',
    state: 'Puducherry',
    category: 'Coastal & Heritage',
    tagline: 'The French Riviera of the East',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    description: 'A charming seaside former French colony featuring mustard-yellow colonial villas, bougainvillea-lined avenues, Sri Aurobindo Ashram, and the universal township of Auroville.',
    popularAttractions: ['Promenade Beach & Rock Beach', 'Auroville & Matrimandir', 'Sri Aurobindo Ashram', 'French Quarter (White Town)', 'Paradise Beach', 'Serenity Beach'],
    safetyScore: 94,
    safetyLevel: 'SAFE',
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹3,000 – ₹7,500 / day',
    recommendedDuration: '2 - 3 Days',
    latitude: 11.9416,
    longitude: 79.8083,
    highlights: ['Bicycle tours through French White Town', 'Universal meditation globe at Matrimandir', 'French bakeries, creperies and artisanal cafes'],
    thingsToDo: ['Sunrise stroll along Promenade Beach', 'Meditation visit to Auroville Matrimandir', 'Heritage walk in French Quarter', 'Ferry ride to Paradise Beach'],
    transportOptions: ['✈️ Puducherry Airport (PNY) or Chennai Airport (MAA - 140 km)', '🚗 Scenic East Coast Road (ECR) from Chennai (3 hrs)', '🚆 Puducherry Railway Station'],
    safetyOverview: 'Pedestrian-priority coastal promenade with dedicated coastal police units.',
    nearbyHospitals: [{ name: 'JIPMER Puducherry', distance: '4.0 km', phone: '0413-2296000' }],
    nearbyPolice: [{ name: 'Grand Bazaar Police Station', distance: '500 m', phone: '112 / 0413-2334000' }]
  }
];

/**
 * Destination Service APIs
 */
export const destinationService = {
  /**
   * Return all pre-loaded destinations
   */
  getAllDestinations() {
    return ALL_INDIAN_DESTINATIONS;
  },

  /**
   * Return curated list of destinations (alias for getAllDestinations)
   */
  getCuratedDestinations() {
    return ALL_INDIAN_DESTINATIONS;
  },

  /**
   * Curated search with rank-ordered scoring (synchronous)
   * Prevents substring collision (e.g. Agra vs fragrant)
   */
  searchCuratedDestinations(query = '', category = 'ALL') {
    const q = (query || '').trim().toLowerCase();

    // 1. Filter local catalog
    let catalogResults = ALL_INDIAN_DESTINATIONS;

    if (category && category !== 'ALL') {
      catalogResults = catalogResults.filter(d => 
        d.category && d.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (!q) {
      return catalogResults;
    }

    // Rank-ordered scoring function
    const scored = [];
    for (const dest of catalogResults) {
      const nameLower = (dest.name || '').toLowerCase();
      const stateLower = (dest.state || '').toLowerCase();
      let score = 0;

      // Rule 1: Exact name match (highest priority)
      if (nameLower === q || nameLower.startsWith(q + ' ') || nameLower.includes(`(${q})`)) {
        score += 100;
      } 
      // Rule 2: Name starts with query
      else if (nameLower.startsWith(q)) {
        score += 80;
      }
      // Rule 3: Word boundary match in name (e.g. "Mysuru (Mysore)")
      else {
        const words = nameLower.split(/[\s,()/-]+/).filter(Boolean);
        if (words.some(w => w === q)) {
          score += 70;
        } else if (words.some(w => w.startsWith(q))) {
          score += 50;
        }
      }

      // Rule 4: Match in attractions (word boundary or starts with)
      const attrMatch = (dest.popularAttractions || []).some(a => {
        const aLower = a.toLowerCase();
        return aLower === q || aLower.startsWith(q) || aLower.split(/[\s,()/-]+/).includes(q);
      });
      if (attrMatch) {
        score += 40;
      }

      // Rule 5: Match in state
      if (stateLower === q || stateLower.startsWith(q)) {
        score += 30;
      }

      // Only include if score > 0 (strictly NO blind substring match on description!)
      if (score > 0) {
        scored.push({ dest, score });
      }
    }

    // Sort by descending relevance score
    scored.sort((a, b) => b.score - a.score);
    return scored.map(item => item.dest);
  },

  /**
   * Search destinations with rank-ordered relevance scoring
   * - Prevents substring accidents (e.g. "Agra" matching "fragrant")
   * - Dynamically falls back to OpenStreetMap Nominatim for ANY Indian city/town/monument
   */
  async searchDestinations(query = '', category = 'ALL') {
    const q = (query || '').trim().toLowerCase();

    const matchedLocal = this.searchCuratedDestinations(q, category);
    if (matchedLocal.length > 0) {
      return matchedLocal;
    }

    // 2. If no local catalog match: Query OpenStreetMap Nominatim for India dynamically
    try {
      const osmResults = await this.queryOsmIndiaDestinations(q);
      if (osmResults && osmResults.length > 0) {
        return osmResults;
      }
    } catch (err) {
      console.warn('[DestinationService] OSM live search unavailable:', err.message);
    }

    // 3. If genuinely no results found: return empty array
    return [];
  },

  /**
   * Pan-India search wrapper for dynamic OpenStreetMap search
   */
  async searchPanIndia(query) {
    return this.queryOsmIndiaDestinations(query);
  },

  /**
   * Query OpenStreetMap Nominatim specifically for Indian locations
   */
  async queryOsmIndiaDestinations(query) {
    if (!query || query.trim().length < 2) return [];

    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
    const response = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(4500)
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.map((item, index) => {
      const addr = item.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.county || item.display_name.split(',')[0].trim();
      const stateName = addr.state || addr.state_district || 'India';
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);

      return {
        id: `osm-dest-${item.place_id || index}`,
        name: cityName,
        state: stateName,
        category: 'Indian Destination',
        tagline: `Destination in ${stateName}, India`,
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80',
        description: `Verified geographic location in ${item.display_name}.`,
        popularAttractions: [cityName, `Historic ${cityName} Center`, `${stateName} Regional Heritage`],
        safetyScore: 90,
        safetyLevel: 'SAFE',
        bestTimeToVisit: 'October to March',
        estimatedBudget: '₹3,000 – ₹7,000 / day',
        recommendedDuration: '2 - 3 Days',
        latitude: lat,
        longitude: lon,
        highlights: [`Explore ${cityName}`, `${stateName} culture`],
        thingsToDo: [`Visit local landmarks in ${cityName}`, `Sample regional ${stateName} cuisine`],
        transportOptions: [`Regional transport connecting to ${cityName}`],
        safetyOverview: 'Civic police corridors and 112 emergency service active.',
        nearbyHospitals: [{ name: `${cityName} Civil Hospital`, distance: '2.0 km', phone: '108 / 112' }],
        nearbyPolice: [{ name: `${cityName} Police Station`, distance: '1.0 km', phone: '112' }],
        isLiveOsm: true
      };
    });
  },

  /**
   * Find destination by ID or Name (Synchronous lookup for immediate rendering)
   */
  getDestinationById(id) {
    if (!id) return null;
    const cleanId = id.toLowerCase().trim();
    
    // Check local catalog
    const match = ALL_INDIAN_DESTINATIONS.find(d => 
      d.id === cleanId || 
      d.name.toLowerCase() === cleanId || 
      d.name.toLowerCase().startsWith(cleanId + ' ') ||
      cleanId.includes(d.name.toLowerCase())
    );
    return match || null;
  }
};
