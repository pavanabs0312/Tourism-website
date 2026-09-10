import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import { INITIAL_DEMO_TOURISTS } from '../data/mockData';

const AuthContext = createContext(null);

// Generate formatted Tourist ID: TG-YYYY-XXXXXX
export const generateTouristId = () => {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `TG-${year}-${randomDigits}`;
};

// 4 Fixed Automated Tourist Profiles with Increasing Group Sizes
export const FIXED_TOURIST_PRESETS = [
  // 1st: Own Car (2 People)
  {
    id: 1,
    touristId: 'TG-2026-752019',
    touristTag: 'TG-2026-752019',
    name: 'Pavana Sharma',
    mobile: '+91 98765 43210',
    email: 'pavana.sharma@example.com',
    emergencyContact: 'Suresh Sharma (Father)',
    emergencyContactNumber: '+91 98765 43211',
    preferredLanguage: 'Kannada / English',
    selectedTransport: 'car',
    selectedTransportLabel: '🚗 1st: Own Car (Self-Drive)',
    travellersCount: 2,
    groupSize: 2,
    groupMembers: [
      { name: 'Pavana Sharma (Lead)', mobile: '+91 98765 43210', status: 'GPS Active', isLead: true },
      { name: 'Megha Sharma (Co-Traveler)', mobile: '+91 98765 43211', status: 'Anchor Connected', isLead: false }
    ],
    role: 'tourist',
    status: 'ONLINE',
    riskScore: 12,
    riskLevel: 'SAFE',
    tripStatus: 'NOT_STARTED',
    sosStatus: 'INACTIVE'
  },
  // 2nd: Train (3 People)
  {
    id: 2,
    touristId: 'TG-2026-819402',
    touristTag: 'TG-2026-819402',
    name: 'Rajesh Kumar',
    mobile: '+91 98450 12345',
    email: 'rajesh.kumar@expressrail.in',
    emergencyContact: 'Deepa Kumar (Spouse)',
    emergencyContactNumber: '+91 98450 12346',
    preferredLanguage: 'English / Hindi',
    selectedTransport: 'train',
    selectedTransportLabel: '🚆 2nd: Train (Vande Bharat)',
    travellersCount: 3,
    groupSize: 3,
    groupMembers: [
      { name: 'Rajesh Kumar (Lead)', mobile: '+91 98450 12345', status: 'GPS Active', isLead: true },
      { name: 'Deepa Kumar', mobile: '+91 98450 12346', status: 'Anchor Connected', isLead: false },
      { name: 'Aarav Kumar (Child)', mobile: '+91 98450 12347', status: 'Anchor Connected', isLead: false }
    ],
    role: 'tourist',
    status: 'ONLINE',
    riskScore: 28,
    riskLevel: 'LOW',
    tripStatus: 'NOT_STARTED',
    sosStatus: 'INACTIVE'
  },
  // 3rd: Flight (4 People)
  {
    id: 3,
    touristId: 'TG-2026-932104',
    touristTag: 'TG-2026-932104',
    name: 'Ananya Desai',
    mobile: '+91 99001 56789',
    email: 'ananya.desai@aeroadventures.com',
    emergencyContact: 'Kiran Desai (Brother)',
    emergencyContactNumber: '+91 99001 56780',
    preferredLanguage: 'English',
    selectedTransport: 'flight',
    selectedTransportLabel: '✈️ 3rd: Flight (Domestic Flight)',
    travellersCount: 4,
    groupSize: 4,
    groupMembers: [
      { name: 'Ananya Desai (Lead)', mobile: '+91 99001 56789', status: 'GPS Active', isLead: true },
      { name: 'Kiran Desai', mobile: '+91 99001 56780', status: 'Anchor Connected', isLead: false },
      { name: 'Siddharth Roy', mobile: '+91 99001 56781', status: 'Anchor Connected', isLead: false },
      { name: 'Neha Roy', mobile: '+91 99001 56782', status: 'Anchor Connected', isLead: false }
    ],
    role: 'tourist',
    status: 'ONLINE',
    riskScore: 16,
    riskLevel: 'SAFE',
    tripStatus: 'NOT_STARTED',
    sosStatus: 'INACTIVE'
  },
  // 4th: Bus / Tour Coach (5 People)
  {
    id: 4,
    touristId: 'TG-2026-641920',
    touristTag: 'TG-2026-641920',
    name: 'Vikram Patel',
    mobile: '+91 97120 44556',
    email: 'vikram.patel@touristbus.org',
    emergencyContact: 'Sunita Patel (Spouse)',
    emergencyContactNumber: '+91 97120 44557',
    preferredLanguage: 'Gujarati / English',
    selectedTransport: 'bus',
    selectedTransportLabel: '🚌 4th: Bus (Tour Coach)',
    travellersCount: 5,
    groupSize: 5,
    groupMembers: [
      { name: 'Vikram Patel (Lead)', mobile: '+91 97120 44556', status: 'GPS Active', isLead: true },
      { name: 'Sunita Patel', mobile: '+91 97120 44557', status: 'Anchor Connected', isLead: false },
      { name: 'Harsh Patel', mobile: '+91 97120 44558', status: 'Anchor Connected', isLead: false },
      { name: 'Kavita Patel', mobile: '+91 97120 44559', status: 'Anchor Connected', isLead: false },
      { name: 'Devendra Patel (Senior)', mobile: '+91 97120 44560', status: 'Anchor Connected', isLead: false }
    ],
    role: 'tourist',
    status: 'ONLINE',
    riskScore: 45,
    riskLevel: 'CAUTION',
    tripStatus: 'NOT_STARTED',
    sosStatus: 'INACTIVE'
  }
];

export const DEMO_TOURIST_USER = {
  id: 'demo-tourist-001',
  touristId: 'TG-DEMO-001',
  touristTag: 'TG-DEMO-001',
  name: 'Demo Tourist',
  mobile: '+91 98765 43210',
  email: 'demo.tourist@guardian.in',
  emergencyContact: 'Emergency Command Desk',
  emergencyContactNumber: '+91 821 2418400',
  preferredLanguage: 'English / Kannada',
  selectedTransport: 'car',
  selectedTransportLabel: '🚗 Car (Expressway Corridor)',
  travellersCount: 2,
  groupSize: 2,
  groupMembers: [
    { name: 'Demo Tourist (Lead)', mobile: '+91 98765 43210', status: 'GPS Active', isLead: true },
    { name: 'Co-Traveler', mobile: '+91 98765 43211', status: 'Anchor Connected', isLead: false }
  ],
  role: 'Tourist',
  status: 'ONLINE',
  riskScore: 12,
  riskLevel: 'SAFE',
  tripStatus: 'NOT_STARTED',
  sosStatus: 'INACTIVE'
};

const DEFAULT_TOURIST = DEMO_TOURIST_USER;

export const DEFAULT_AUTHORITY = {
  id: 'auth-001',
  name: 'Officer K. Naik',
  officer: 'K. Naik',
  officerName: 'K. Naik',
  badgeNumber: 'KA-POL-MY-4402',
  officerId: 'KA-POL-MY-4402',
  department: 'Mysuru City Police & Tourism Safety Wing',
  role: 'Police & Tourism Command'
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('atg_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeMode, setActiveMode] = useState(() => {
    try {
      return localStorage.getItem('atg_active_mode') || 'PUBLIC';
    } catch (e) {
      return 'PUBLIC';
    }
  });

  // User Saved Destinations (Wishlist)
  const [savedDestinations, setSavedDestinations] = useState(() => {
    try {
      const saved = localStorage.getItem('atg_saved_destinations');
      return saved ? JSON.parse(saved) : ['mysuru'];
    } catch (e) {
      return ['mysuru'];
    }
  });

  // User Bookings (Live sync from firebaseService)
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const unsub = firebaseService.subscribeBookings((allBookings) => {
      setBookings(allBookings);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('atg_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('atg_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('atg_active_mode', activeMode);
  }, [activeMode]);

  useEffect(() => {
    localStorage.setItem('atg_saved_destinations', JSON.stringify(savedDestinations));
  }, [savedDestinations]);

  const toggleSaveDestination = (destinationId) => {
    if (!currentUser) return false; // Requires login
    setSavedDestinations(prev => {
      if (prev.includes(destinationId)) {
        return prev.filter(id => id !== destinationId);
      }
      return [...prev, destinationId];
    });
    return true;
  };

  const isDestinationSaved = (destinationId) => {
    return savedDestinations.includes(destinationId);
  };

  const addBooking = async (bookingData) => {
    const touristId = currentUser?.touristId || 'TG-2026-752019';
    const touristName = currentUser?.name || 'Pavana Sharma';
    const contactNumber = currentUser?.mobile || '+91 98765 43210';

    const newBooking = await firebaseService.createBooking({
      ...bookingData,
      touristId,
      touristName,
      contactNumber
    });

    return newBooking;
  };

  // Switch between Tourist Mode, Authority Mode, and Public Mode
  const setMode = (mode) => {
    setActiveMode(mode);
    if (mode === 'AUTHORITY') {
      setCurrentUser(DEFAULT_AUTHORITY);
    } else if (mode === 'TOURIST' && (!currentUser || currentUser.role === 'authority')) {
      setCurrentUser(DEFAULT_TOURIST);
    } else if (mode === 'PUBLIC') {
      setCurrentUser(null);
    }
  };

  // Register New Tourist with Group Members
  const registerTourist = async (formData) => {
    const touristId = generateTouristId();
    const count = parseInt(formData.travellersCount || formData.groupSize, 10) || 1;
    
    // Generate default member roster based on count
    const members = formData.groupMembers || [
      { name: `${formData.name} (Lead)`, mobile: formData.mobile, status: 'GPS Active', isLead: true }
    ];
    while (members.length < count) {
      members.push({
        name: `Co-Traveler ${members.length + 1}`,
        mobile: '+91 98450 ' + Math.floor(10000 + Math.random() * 90000),
        status: 'Anchor Connected',
        isLead: false
      });
    }

    const newTourist = {
      ...formData,
      touristId,
      touristTag: touristId,
      travellersCount: count,
      groupSize: count,
      groupMembers: members,
      role: 'tourist',
      status: 'ONLINE',
      riskScore: 0,
      riskLevel: 'SAFE',
      tripStatus: 'NOT_STARTED',
      sosStatus: 'INACTIVE',
      createdAt: new Date().toISOString()
    };

    const savedDoc = await firebaseService.saveTouristProfile(newTourist);
    setCurrentUser(savedDoc);
    setActiveMode('TOURIST');
    return savedDoc;
  };

  // Quick Load One of the 4 Fixed Preset Profiles
  const loadPresetTourist = (presetIndex = 0) => {
    const preset = FIXED_TOURIST_PRESETS[presetIndex] || FIXED_TOURIST_PRESETS[0];
    setCurrentUser(preset);
    setActiveMode('TOURIST');
    return preset;
  };

  // Login Existing Tourist by Tourist Tag or Mobile Number or Email
  const loginExistingTourist = async (queryStr, password = '') => {
    const existing = await firebaseService.getTouristByTagOrMobile(queryStr);
    if (existing) {
      const restoredUser = {
        ...existing,
        role: 'tourist',
        status: 'ONLINE'
      };
      setCurrentUser(restoredUser);
      setActiveMode('TOURIST');
      return { success: true, tourist: restoredUser };
    }

    // Check fixed presets
    const matchPreset = FIXED_TOURIST_PRESETS.find(p => 
      p.touristTag.toLowerCase().includes(queryStr.toLowerCase()) || 
      p.mobile.includes(queryStr) || 
      p.name.toLowerCase().includes(queryStr.toLowerCase()) ||
      p.email?.toLowerCase().includes(queryStr.toLowerCase())
    );

    if (matchPreset) {
      setCurrentUser(matchPreset);
      setActiveMode('TOURIST');
      return { success: true, tourist: matchPreset };
    }

    // If email provided without prior record, generate demo session for traveler
    if (queryStr.includes('@')) {
      const newDemoUser = {
        ...DEFAULT_TOURIST,
        name: queryStr.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: queryStr,
        touristId: generateTouristId(),
        touristTag: generateTouristId()
      };
      setCurrentUser(newDemoUser);
      setActiveMode('TOURIST');
      return { success: true, tourist: newDemoUser };
    }

    return { success: false, error: 'No tourist profile found for this Tourist Tag or mobile number.' };
  };

  const loginAsTourist = (customData = null) => {
    const user = customData || DEFAULT_TOURIST;
    setCurrentUser(user);
    setActiveMode('TOURIST');
    try {
      localStorage.setItem('atg_current_user', JSON.stringify(user));
      localStorage.setItem('atg_active_mode', 'TOURIST');
    } catch (e) {
      console.error(e);
    }
    return user;
  };

  const loginAsDemoTourist = () => {
    setCurrentUser(DEMO_TOURIST_USER);
    setActiveMode('TOURIST');
    try {
      localStorage.setItem('atg_current_user', JSON.stringify(DEMO_TOURIST_USER));
      localStorage.setItem('atg_active_mode', 'TOURIST');
    } catch (e) {
      console.error(e);
    }
    return DEMO_TOURIST_USER;
  };

  const loginAsAuthority = () => {
    setCurrentUser(DEFAULT_AUTHORITY);
    setActiveMode('AUTHORITY');
    try {
      localStorage.setItem('atg_current_user', JSON.stringify(DEFAULT_AUTHORITY));
      localStorage.setItem('atg_active_mode', 'AUTHORITY');
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_AUTHORITY;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveMode('PUBLIC');
    localStorage.removeItem('atg_current_user');
    localStorage.setItem('atg_active_mode', 'PUBLIC');
  };

  const isAuthenticated = Boolean(currentUser);
  const isTourist = isAuthenticated && (activeMode === 'TOURIST' || currentUser?.role === 'tourist' || currentUser?.role === 'Tourist');
  const isAuthority = isAuthenticated && (activeMode === 'AUTHORITY' || currentUser?.role === 'authority' || currentUser?.role === 'Police & Tourism Command');

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        activeMode,
        setMode,
        registerTourist,
        loadPresetTourist,
        loginExistingTourist,
        loginAsTourist,
        loginAsDemoTourist,
        loginAsAuthority,
        logout,
        fixedPresets: FIXED_TOURIST_PRESETS,
        demoTouristUser: DEMO_TOURIST_USER,
        defaultAuthorityUser: DEFAULT_AUTHORITY,
        isTourist,
        isAuthority,
        savedDestinations,
        toggleSaveDestination,
        isDestinationSaved,
        bookings,
        addBooking,
        userBookings: currentUser?.touristId 
          ? bookings.filter(b => b.touristId === currentUser.touristId || b.touristTag === currentUser.touristId)
          : bookings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
