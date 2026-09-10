import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TouristProvider } from './context/TouristContext';
import { AuthorityProvider } from './context/AuthorityContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoScenarioModal } from './components/DemoScenarioModal';

// Public & Discovery Pages
import { LandingPage } from './pages/LandingPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { HotelsPage } from './pages/HotelsPage';
import { PlanTripPage } from './pages/PlanTripPage';
import { MysuruDemoTripPage } from './pages/MysuruDemoTripPage';

// Auth Pages
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';

// Tourist Flow Pages
import { TouristDashboard } from './pages/TouristDashboard';
import { MyTripsPage } from './pages/MyTripsPage';
import { DestinationPlanningPage } from './pages/DestinationPlanningPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { TransportPage } from './pages/TransportPage';
import { NavigationPage } from './pages/NavigationPage';
import { SafetyEnginePage } from './pages/SafetyEnginePage';
import { EmergencyPage } from './pages/EmergencyPage';
import { ServicesPage } from './pages/ServicesPage';

// Authority Flow Pages
import { AuthorityCommandCenter } from './pages/AuthorityCommandCenter';
import { TouristMonitoringPage } from './pages/TouristMonitoringPage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { DangerZonesPage } from './pages/DangerZonesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

const AppLayout = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const location = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Navbar rendered across all pages dynamically adapting to Public, Tourist, or Authority mode */}
      <Navbar onOpenDemoModal={() => setDemoModalOpen(true)} />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Portal & Discovery Routes */}
          <Route path="/" element={<LandingPage onOpenDemoModal={() => setDemoModalOpen(true)} />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationsPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelsPage />} />
          <Route path="/plan-trip" element={<PlanTripPage />} />
          <Route path="/mysuru-demo" element={<MysuruDemoTripPage />} />
          <Route path="/mysuru-trip" element={<MysuruDemoTripPage />} />
          <Route path="/how-it-works" element={<LandingPage scrollTo="how-it-works" onOpenDemoModal={() => setDemoModalOpen(true)} />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<RegisterPage />} />

          {/* Tourist Flow & Safe Journey Routes */}
          <Route path="/tourist" element={<TouristDashboard />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/destination-planner" element={<PlanTripPage />} />
          <Route path="/trip-planner" element={<TripPlannerPage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/safety" element={<SafetyEnginePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />

          {/* Authority Command Center Routes */}
          <Route path="/authority" element={<AuthorityCommandCenter />} />
          <Route path="/authority/tourists" element={<TouristMonitoringPage />} />
          <Route path="/authority/alerts" element={<AlertCenterPage />} />
          <Route path="/authority/danger-zones" element={<DangerZonesPage />} />
          <Route path="/authority/analytics" element={<AnalyticsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

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
