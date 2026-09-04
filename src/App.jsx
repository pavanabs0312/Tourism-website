import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TouristProvider } from './context/TouristContext';
import { AuthorityProvider } from './context/AuthorityContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoScenarioModal } from './components/DemoScenarioModal';

// Pages
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { TouristDashboard } from './pages/TouristDashboard';
import { DestinationPlanningPage } from './pages/DestinationPlanningPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { TransportPage } from './pages/TransportPage';
import { NavigationPage } from './pages/NavigationPage';
import { SafetyEnginePage } from './pages/SafetyEnginePage';
import { EmergencyPage } from './pages/EmergencyPage';
import { ServicesPage } from './pages/ServicesPage';

// Authority Pages
import { AuthorityCommandCenter } from './pages/AuthorityCommandCenter';
import { TouristMonitoringPage } from './pages/TouristMonitoringPage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { DangerZonesPage } from './pages/DangerZonesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

const AppLayout = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const location = useLocation();
  const isFirstScreen = location.pathname === '/' || location.pathname === '/register' || location.pathname === '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {!isFirstScreen && <Navbar onOpenDemoModal={() => setDemoModalOpen(true)} />}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* First Screen: Mode Selection & Step 1 Registration */}
          <Route path="/" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Tourist Flow */}
          <Route path="/destination-planner" element={<DestinationPlanningPage />} />
          <Route path="/trip-planner" element={<TripPlannerPage />} />
          <Route path="/tourist" element={<TouristDashboard />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/safety" element={<SafetyEnginePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />

          {/* Authority Flow */}
          <Route path="/authority" element={<AuthorityCommandCenter />} />
          <Route path="/authority/tourists" element={<TouristMonitoringPage />} />
          <Route path="/authority/alerts" element={<AlertCenterPage />} />
          <Route path="/authority/danger-zones" element={<DangerZonesPage />} />
          <Route path="/authority/analytics" element={<AnalyticsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isFirstScreen && <Footer />}

      <DemoScenarioModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <TouristProvider>
        <AuthorityProvider>
          <Router>
            <AppLayout />
          </Router>
        </AuthorityProvider>
      </TouristProvider>
    </AuthProvider>
  );
}

export default App;
