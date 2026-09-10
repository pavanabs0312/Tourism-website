import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { 
  Compass, MapPin, Calendar, Clock, Building, Shield, 
  Route, ArrowRight, CheckCircle2, AlertOctagon, PhoneCall, 
  Car, Train, Bus, Bed, Users, PlusCircle, Check, Sparkles 
} from 'lucide-react';

export const MyTripsPage = () => {
  const { currentUser, userBookings, isAuthenticated } = useAuth();
  const { activeTrip, tripHistory, isProtectedJourneyActive, startTrip, completeTrip } = useTourist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'UPCOMING' | 'STAYS' | 'PAST'

  const isTripActive = activeTrip?.status === 'ACTIVE';

  const handleStartProtectedJourney = async (trip) => {
    if (isTripActive) {
      navigate('/navigation');
    } else {
      await startTrip(trip || {
        title: userBookings[0] ? `Trip to ${userBookings[0].hotelName}` : 'Karnataka Heritage Tour',
        journeyDestination: userBookings[0] ? userBookings[0].destination : 'Mysuru Palace'
      });
      navigate('/navigation');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f8fafc', padding: '2.5rem 0 5rem' }}>
      <div className="container-custom">
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0f172a' }}>
                My Trips & Reservations 🧳
              </h1>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                {currentUser?.touristTag || 'TG-2026-752019'}
              </span>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#64748b' }}>
              Manage your upcoming multi-modal journeys, booked hotel stays, and completed trip safety history.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <Link
              to="/plan-trip"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
            >
              <PlusCircle size={16} />
              <span>Plan New Trip</span>
            </Link>

            <Link
              to="/hotels"
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
            >
              <Building size={16} />
              <span>Book Hotels</span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          {[
            { id: 'ALL', label: 'All Itineraries' },
            { id: 'UPCOMING', label: `Upcoming Journeys` },
            { id: 'STAYS', label: `Hotel Bookings (${userBookings.length})` },
            { id: 'PAST', label: `Past Trips (${tripHistory.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '700',
                backgroundColor: activeTab === tab.id ? '#2563eb' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ACTIVE / ONGOING PROTECTED JOURNEY BANNER */}
        {isTripActive && (
          <div className="card" style={{
            backgroundColor: '#ffffff',
            border: '2px solid #10b981',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 24px -4px rgba(16,185,129,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={28} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#10b981', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      ● ACTIVE PROTECTED JOURNEY
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Live GPS Monitoring On</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginTop: '0.2rem' }}>
                    {activeTrip?.title || 'Active Multi-Modal Journey'}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                    Destination: <strong>{activeTrip?.journeyDestination || 'Mysuru'}</strong> • Route: {activeTrip?.selectedRouteLabel || 'Safer Corridor'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Link
                  to="/navigation"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <Navigation size={15} />
                  <span>Open Live Navigation</span>
                </Link>
                <Link
                  to="/emergency"
                  className="btn btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <PhoneCall size={15} />
                  <span>SOS Beacon</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 1. HOTEL BOOKINGS (STAYS) SECTION (Section 12 & 32) */}
        {(activeTab === 'ALL' || activeTab === 'STAYS' || activeTab === 'UPCOMING') && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Building size={20} color="#2563eb" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                Upcoming Hotel Stays
              </h2>
            </div>

            {userBookings.length === 0 ? (
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center' }}>
                <Building size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
                  No hotel reservations yet
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Browse our verified accommodations in Mysuru, Coorg, Hampi, and Bengaluru.
                </p>
                <Link to="/hotels" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                  Browse Hotels & Stays
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {userBookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="card"
                    style={{
                      padding: 0,
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      borderRadius: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div style={{ height: '160px', position: 'relative' }}>
                      <img
                        src={booking.hotelImage}
                        alt={booking.hotelName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px'
                      }}>
                        {booking.status}
                      </div>

                      <div style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        right: '0.75rem',
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                      }}>
                        {booking.bookingId}
                      </div>
                    </div>

                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
                        {booking.hotelName}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
                        <MapPin size={13} color="#2563eb" />
                        <span>{booking.destination}</span>
                      </div>

                      {/* Dates & Room Info */}
                      <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem', marginBottom: '1rem', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ color: '#64748b' }}>Check-in / Check-out:</span>
                          <strong>{booking.checkInDate} – {booking.checkOutDate}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ color: '#64748b' }}>Room:</span>
                          <span>{booking.roomType}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Total Paid (Demo):</span>
                          <strong style={{ color: '#059669' }}>₹{booking.totalAmount?.toLocaleString()}</strong>
                        </div>
                      </div>

                      {/* Action to connect hotel stay to active protected trip */}
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleStartProtectedJourney({
                            title: `Trip to ${booking.hotelName}`,
                            journeyDestination: booking.destination
                          })}
                          className="btn btn-primary"
                          style={{ flex: 1, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                        >
                          <Compass size={14} />
                          <span>Start Protected Journey</span>
                        </button>

                        <Link
                          to={`/hotels/${booking.hotelId}`}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.82rem' }}
                        >
                          View Hotel
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. UPCOMING / SAVED MULTI-MODAL TRIPS */}
        {(activeTab === 'ALL' || activeTab === 'UPCOMING') && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Route size={20} color="#2563eb" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                Planned Journeys & Itineraries
              </h2>
            </div>

            <div className="card" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    MULTI-MODAL ITINERARY
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginTop: '0.35rem' }}>
                    Bengaluru ➔ Mysuru Heritage & Palace Trail
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Cab ➔ Vande Bharat Train ➔ Local Auto ➔ Hotel Grand Mercure
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>
                    🛡️ Safety Index: 94/100
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Zero danger zone intersections
                  </div>
                </div>
              </div>

              {/* Multi-modal segments visual */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>Bengaluru Home</span>
                <ArrowRight size={14} color="#94a3b8" />
                <span style={{ fontSize: '0.78rem', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>🚕 Cab</span>
                <ArrowRight size={14} color="#94a3b8" />
                <span style={{ fontSize: '0.78rem', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>🚆 Train</span>
                <ArrowRight size={14} color="#94a3b8" />
                <span style={{ fontSize: '0.78rem', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>🚕 Local Transport</span>
                <ArrowRight size={14} color="#94a3b8" />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#059669' }}>🏨 Grand Mercure Hotel</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Estimated Travel Time: <strong>2 hrs 45 mins</strong> • Distance: <strong>148 km</strong>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleStartProtectedJourney()}
                    className="btn btn-primary"
                    style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Compass size={14} />
                    <span>Start Protected Journey</span>
                  </button>

                  <Link to="/trip-planner" className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                    Edit in Smart Planner
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PAST COMPLETED TRIPS */}
        {(activeTab === 'ALL' || activeTab === 'PAST') && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={20} color="#059669" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                Past Completed Journeys
              </h2>
            </div>

            {tripHistory.length === 0 ? (
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                No completed trips recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tripHistory.map((past, idx) => (
                  <div
                    key={past.tripId || idx}
                    className="card"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', backgroundColor: '#ecfdf5', color: '#059669', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          COMPLETED
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(past.startTime).toLocaleDateString()}</span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                        {past.title}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Travel Mode: {past.selectedTransportLabel || past.selectedTransport} • Route: {past.selectedRoute || 'Safer Corridor'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                          {past.distanceKm ? `${past.distanceKm} km` : '145 km'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Duration: {past.durationMins ? `${past.durationMins} mins` : '240 mins'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#10b981' }}>
                          Risk: {past.maxRiskScore || 18}/100
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                          Zero SOS Incidents
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
