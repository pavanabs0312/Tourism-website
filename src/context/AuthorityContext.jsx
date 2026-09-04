import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { firebaseService } from '../services/firebaseService';

const AuthorityContext = createContext(null);

export const AuthorityProvider = ({ children }) => {
  const [tourists, setTourists] = useState([]);
  const [dangerZones, setDangerZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'SAFE' | 'CAUTION' | 'HIGH' | 'CRITICAL' | 'SOS'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('RISK_DESC'); // 'RISK_DESC' | 'TIME_DESC' | 'NAME_ASC'

  // Subscribe to real-time streams
  useEffect(() => {
    const unsubTourists = firebaseService.subscribeTourists((data) => {
      setTourists(data);
      setSelectedTourist((prev) => {
        if (!prev) return null;
        return data.find(t => t.touristId === prev.touristId || t.touristTag === prev.touristTag) || prev;
      });
    });

    const unsubZones = firebaseService.subscribeDangerZones((data) => {
      setDangerZones(data);
    });

    const unsubAlerts = firebaseService.subscribeAlerts((data) => {
      setAlerts(data);
    });

    return () => {
      unsubTourists();
      unsubZones();
      unsubAlerts();
    };
  }, []);

  // Compute Dynamic KPI Counters from real data
  const kpiStats = useMemo(() => {
    const total = tourists.length;
    const safe = tourists.filter(t => (t.safetyStatus === 'SAFE' || t.riskLevel === 'SAFE') && !t.sosActive && t.sosStatus !== 'ACTIVE').length;
    const caution = tourists.filter(t => (t.safetyStatus === 'CAUTION' || t.riskLevel === 'CAUTION') && !t.sosActive && t.sosStatus !== 'ACTIVE').length;
    const high = tourists.filter(t => (t.safetyStatus === 'HIGH' || t.safetyStatus === 'HIGH RISK' || t.riskLevel === 'HIGH RISK' || t.riskLevel === 'HIGH') && !t.sosActive && t.sosStatus !== 'ACTIVE').length;
    const critical = tourists.filter(t => (t.safetyStatus === 'CRITICAL' || t.riskLevel === 'CRITICAL' || t.sosActive || t.sosStatus === 'ACTIVE')).length;
    const activeSos = tourists.filter(t => t.sosActive || t.sosStatus === 'ACTIVE').length;

    return {
      totalTourists: total,
      safe,
      caution,
      highRisk: high,
      critical,
      activeSOS: activeSos
    };
  }, [tourists]);

  // Filtered and Sorted Tourist List
  const filteredTourists = useMemo(() => {
    return tourists.filter(t => {
      const isSOS = t.sosActive || t.sosStatus === 'ACTIVE';
      const status = t.safetyStatus || t.riskLevel || 'SAFE';

      if (activeFilter === 'SAFE' && (status !== 'SAFE' || isSOS)) return false;
      if (activeFilter === 'CAUTION' && (status !== 'CAUTION' || isSOS)) return false;
      if (activeFilter === 'HIGH' && (status !== 'HIGH' && status !== 'HIGH RISK' || isSOS)) return false;
      if (activeFilter === 'CRITICAL' && status !== 'CRITICAL' && !isSOS) return false;
      if (activeFilter === 'SOS' && !isSOS) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = t.name?.toLowerCase().includes(query);
        const matchesId = t.touristId?.toLowerCase().includes(query) || t.touristTag?.toLowerCase().includes(query);
        const matchesMobile = t.mobile?.toLowerCase().includes(query);
        const matchesTrip = t.activeTrip?.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesMobile && !matchesTrip) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'RISK_DESC') {
        return (b.riskScore || 0) - (a.riskScore || 0);
      } else if (sortBy === 'TIME_DESC') {
        return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
      } else if (sortBy === 'NAME_ASC') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
  }, [tourists, activeFilter, searchQuery, sortBy]);

  // Alert Actions
  const acknowledgeAlert = async (alertId, officerName = 'Officer K. Naik') => {
    await firebaseService.updateAlertStatus(alertId, 'ACKNOWLEDGED', officerName);
    const alert = alerts.find(a => a.id === alertId);
    if (alert && alert.touristId) {
      await firebaseService.updateSOSStatus(alert.touristId, 'ACKNOWLEDGED', `Acknowledged by ${officerName}`);
    }
  };

  const resolveAlert = async (alertId) => {
    await firebaseService.updateAlertStatus(alertId, 'RESOLVED', 'Command Center Desk');
    const alert = alerts.find(a => a.id === alertId);
    if (alert && alert.touristId) {
      await firebaseService.updateSOSStatus(alert.touristId, 'RESOLVED', 'Emergency marked resolved');
    }
  };

  // SOS Emergency Life-Cycle Updates: 'ACKNOWLEDGED' | 'RESPONSE_INITIATED' | 'HELP_DISPATCHED' | 'RESOLVED'
  const updateEmergencyStatus = async (touristId, status, notes = '', assignedUnit = null) => {
    await firebaseService.updateSOSStatus(touristId, status, notes, assignedUnit);
  };

  // Danger Zone Management
  const saveDangerZone = async (zone) => {
    return await firebaseService.saveDangerZone(zone);
  };

  const deleteDangerZone = async (zoneId) => {
    await firebaseService.deleteDangerZone(zoneId);
  };

  // Load / Reset Hackathon Demo Scenario
  const loadDemoScenario = () => {
    const result = firebaseService.resetToDemoScenario();
    setTourists(result.tourists);
    setDangerZones(result.dangerZones);
    setAlerts(result.alerts);
  };

  return (
    <AuthorityContext.Provider
      value={{
        tourists,
        dangerZones,
        alerts,
        kpiStats,
        filteredTourists,
        selectedTourist,
        setSelectedTourist,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        acknowledgeAlert,
        resolveAlert,
        updateEmergencyStatus,
        saveDangerZone,
        deleteDangerZone,
        loadDemoScenario
      }}
    >
      {children}
    </AuthorityContext.Provider>
  );
};

export const useAuthority = () => {
  const context = useContext(AuthorityContext);
  if (!context) throw new Error('useAuthority must be used within an AuthorityProvider');
  return context;
};
