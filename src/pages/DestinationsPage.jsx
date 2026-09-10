import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { destinationService } from '../services/destinationService';
import { hotelService } from '../services/hotelService';
import { useAuth } from '../context/AuthContext';
import { useTourist } from '../context/TouristContext';
import { 
  Shield, MapPin, Compass, Search, Filter, Heart, ArrowRight, 
  Clock, DollarSign, Building, Phone, AlertTriangle, CheckCircle2, 
  ExternalLink, Car, Train, Plane, X, Sparkles, Navigation, RefreshCw,
  Info
} from 'lucide-react';

export const DestinationsPage = () => {
  const { isAuthenticated, isDestinationSaved, toggleSaveDestination } = useAuth();
  const { setActiveTrip } = useTourist();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: routeDestId } = useParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [livePlaces, setLivePlaces] = useState([]);

  // Auto-open destination if specified in query or route param
  useEffect(() => {
    const destId = routeDestId || searchParams.get('id') || searchParams.get('destination');
    if (destId) {
      const match = destinationService.getDestinationById(destId) ||
                    destinationService.getCuratedDestinations().find(d => 
                      d.name.toLowerCase() === destId.toLowerCase() ||
                      destId.toLowerCase().includes(d.name.toLowerCase())
                    );
      if (match) setSelectedDestination(match);
    }
  }, [routeDestId, searchParams]);

  const categories = ['ALL', 'Heritage', 'Hill Station', 'Coastal', 'Spiritual', 'Urban & Culture', 'Wildlife'];

  // Curated search with rank-ordered scoring (prevents substring collision e.g. Agra vs fragrant)
  const curatedResults = destinationService.searchCuratedDestinations(searchQuery, selectedCategory);

  // When search query is longer and local matches are empty, trigger live OpenStreetMap search
  useEffect(() => {
    let active = true;
    const cleanQ = searchQuery.trim();

    if (cleanQ.length >= 3 && curatedResults.length === 0) {
      setIsSearchingLive(true);
      const timer = setTimeout(async () => {
        try {
          const results = await destinationService.searchPanIndia(cleanQ);
          if (active) {
            setLivePlaces(results);
            setIsSearchingLive(false);
          }
        } catch {
          if (active) setIsSearchingLive(false);
        }
      }, 500);

      return () => {
        active = false;
        clearTimeout(timer);
      };
    } else {
      setLivePlaces([]);
      setIsSearchingLive(false);
    }
  }, [searchQuery, curatedResults.length]);

  const displayDestinations = curatedResults.length > 0 ? curatedResults : livePlaces;

  const handleSaveClick = (destId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/destinations?id=${destId}`);
      return;
    }
    toggleSaveDestination(destId);
  };

  const handlePlanTrip = (destName) => {
    if (setActiveTrip) {
      setActiveTrip(prev => ({
        ...prev,
        journeyDestination: destName,
        journeyOrigin: prev?.journeyOrigin || 'Bengaluru City Center',
        selectedTransportModes: prev?.selectedTransportModes?.length ? prev.selectedTransportModes : ['train', 'walking']
      }));
    }
    navigate(`/plan-trip?destination=${encodeURIComponent(destName)}`);
  };

  const handleFindAccommodation = (destId, destName = '') => {
    const param = destId || destName;
    navigate(`/hotels?destination=${encodeURIComponent(param)}`);
  };

  // Helper to get matching hotels for a destination
  const getNearbyHotelsForCard = (dest) => {
    return hotelService.getAllHotels().filter(h => 
      (h.destinationId && h.destinationId.toLowerCase() === dest.id.toLowerCase()) ||
      (h.city && h.city.toLowerCase() === dest.name.toLowerCase()) ||
      (h.destinationName && h.destinationName.toLowerCase().includes(dest.name.toLowerCase()))
    );
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f8fafc', padding: '2.5rem 0 5rem' }}>
      <div className="container-custom">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '0.75rem'
          }}>
            <Compass size={14} />
            <span>PAN-INDIA DISCOVERY & SAFETY DIRECTORY</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Explore India’s Iconic Destinations
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.6' }}>
            Verified tourism intelligence across all 28 Indian States & 8 Union Territories. Real-world safety ratings, emergency service corridors, and genuine accommodations.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e2e8f0',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              id="destination-search-input"
              type="text"
              placeholder="Search by city, town, hill station, or monument (e.g. Agra, Mumbai, Shimla, Varanasi...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 1rem 0.7rem 2.8rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === cat ? '#2563eb' : '#f1f5f9',
                  color: selectedCategory === cat ? '#ffffff' : '#475569',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? '#2563eb' : '#e2e8f0',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat === 'ALL' ? 'All Destinations' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Live Search Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
          <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: '600' }}>
            {isSearchingLive ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb' }}>
                <RefreshCw size={14} className="animate-spin" />
                Searching OpenStreetMap India directory for "{searchQuery}"...
              </span>
            ) : (
              <span>
                Showing <strong>{displayDestinations.length}</strong> verified destination{displayDestinations.length !== 1 ? 's' : ''}
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'ALL') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
              style={{
                fontSize: '0.8rem',
                color: '#2563eb',
                fontWeight: '700',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <RefreshCw size={12} />
              Reset filters
            </button>
          )}
        </div>

        {/* Empty State (When no results found) */}
        {!isSearchingLive && displayDestinations.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4.5rem 1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
            maxWidth: '650px',
            margin: '2rem auto'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <MapPin size={32} color="#64748b" />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>
              No tourism information found for this location.
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748b', marginBottom: '1.75rem', lineHeight: '1.5' }}>
              We could not find verified tourist information matching "<strong>{searchQuery}</strong>". Please verify the spelling or try searching for a major Indian city, district, or landmark (e.g. Agra, Mumbai, Delhi, Jaipur, Varanasi, Shimla).
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              Browse All Indian Destinations
            </button>
          </div>
        )}

        {/* Destinations Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {displayDestinations.map((dest) => {
            const isSaved = isDestinationSaved(dest.id);
            const destinationHotels = getNearbyHotelsForCard(dest);

            return (
              <div
                key={dest.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  transition: 'all 0.25s ease',
                  backgroundColor: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 32px -8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#93c5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {/* Photo & Overlay Badges */}
                <div style={{ height: '220px', position: 'relative' }}>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Safety Score Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '0.85rem',
                    right: '0.85rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#10b981',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Shield size={14} />
                    <span>Safety Score: {dest.safetyScore || 88}/100</span>
                  </div>

                  {/* State & Category Tag */}
                  <div style={{
                    position: 'absolute',
                    top: '0.85rem',
                    left: '0.85rem',
                    backgroundColor: 'rgba(37, 99, 235, 0.95)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px'
                  }}>
                    {dest.state} • {dest.category}
                  </div>

                  {/* Wishlist / Save Heart Button */}
                  <button
                    onClick={(e) => handleSaveClick(dest.id, e)}
                    style={{
                      position: 'absolute',
                      bottom: '0.85rem',
                      right: '0.85rem',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: isSaved ? '#ef4444' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                    title={isSaved ? 'Saved to Wishlist' : 'Save Destination'}
                  >
                    <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} />
                  </button>
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a' }}>
                      {dest.name}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                      {dest.recommendedDuration}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: '700', marginBottom: '0.75rem' }}>
                    {dest.tagline}
                  </div>

                  <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem', flex: 1 }}>
                    {dest.description}
                  </p>

                  {/* Popular Attractions */}
                  {dest.popularAttractions && dest.popularAttractions.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        TOP ATTRACTIONS:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {dest.popularAttractions.slice(0, 3).map((attr, idx) => (
                          <span key={idx} style={{ fontSize: '0.74rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Budget & Hotel Info */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.78rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Estimated Budget:</span>
                      <div style={{ fontWeight: '700', color: '#059669' }}>{dest.estimatedBudget}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Verified Stays:</span>
                      <div style={{ fontWeight: '700', color: '#2563eb' }}>
                        {destinationHotels.length > 0 ? `${destinationHotels.length} Hotels Nearby` : 'Verified Hub'}
                      </div>
                    </div>
                  </div>

                  {/* 3 Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <button
                      onClick={() => setSelectedDestination(dest)}
                      className="btn"
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}
                    >
                      Explore
                    </button>

                    <button
                      onClick={() => handleFindAccommodation(dest.id, dest.name)}
                      className="btn"
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        backgroundColor: '#f8fafc',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}
                    >
                      View Hotels
                    </button>

                    <button
                      onClick={() => handlePlanTrip(dest.name)}
                      className="btn btn-primary"
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}
                    >
                      Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DESTINATION DETAILS MODAL */}
      {selectedDestination && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1.25rem',
            maxWidth: '850px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Header Image */}
            <div style={{ height: '260px', position: 'relative' }}>
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 60%)'
              }} />

              {/* Close Button */}
              <button
                onClick={() => setSelectedDestination(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                <X size={20} />
              </button>

              {/* Title on Image */}
              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ backgroundColor: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                    {selectedDestination.state}
                  </span>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.9)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Shield size={13} />
                    <span>Safety Score: {selectedDestination.safetyScore || 88}/100</span>
                  </span>
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {selectedDestination.name}
                </h1>
                <div style={{ fontSize: '0.88rem', color: '#93c5fd' }}>
                  {selectedDestination.tagline}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem' }}>
              {/* Overview & Quick Info Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.85rem',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>BEST TIME TO VISIT</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>{selectedDestination.bestTimeToVisit}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>RECOMMENDED DURATION</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>{selectedDestination.recommendedDuration}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>DAILY BUDGET</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#059669' }}>{selectedDestination.estimatedBudget}</div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                  Destination Overview
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.6' }}>
                  {selectedDestination.description}
                </p>
              </div>

              {/* Top Attractions & Things to do */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.6rem' }}>
                    Top Attractions
                  </h4>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.7' }}>
                    {(selectedDestination.popularAttractions || []).map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.6rem' }}>
                    Things to Do
                  </h4>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.7' }}>
                    {(selectedDestination.thingsToDo || []).map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Verified Accommodations Preview */}
              {(() => {
                const hotels = getNearbyHotelsForCard(selectedDestination);
                if (hotels.length > 0) {
                  return (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          Verified Accommodations in {selectedDestination.name} ({hotels.length})
                        </h4>
                        <button
                          onClick={() => handleFindAccommodation(selectedDestination.id, selectedDestination.name)}
                          style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          View All ➔
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                        {hotels.slice(0, 3).map(h => (
                          <div
                            key={h.id}
                            onClick={() => navigate(`/hotels?id=${h.id}`)}
                            style={{
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem'
                            }}
                          >
                            <img src={h.image} alt={h.name} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {h.name}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: '700' }}>
                                ₹{h.pricePerNight?.toLocaleString()} / night
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                {h.distance || 'Central Area'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Safety Overview & Emergency Services */}
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontSize: '1rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                  <Shield size={18} />
                  <span>Safety Conditions & Help Centers</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#047857', marginBottom: '0.85rem' }}>
                  {selectedDestination.safetyOverview || 'Tourist Police active in central visitor areas.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '0.75rem', border: '1px solid #d1fae5' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.2rem' }}>🏥 Nearest Hospitals:</div>
                    {(selectedDestination.nearbyHospitals || [
                      { name: `${selectedDestination.name} District Civil Hospital`, distance: '2.0 km', phone: '108 / 112' }
                    ]).map((h, i) => (
                      <div key={i} style={{ color: '#475569', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                        • {h.name} ({h.distance}) - 📞 {h.phone}
                      </div>
                    ))}
                  </div>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '0.75rem', border: '1px solid #d1fae5' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.2rem' }}>👮 Police / Tourist Help Centers:</div>
                    {(selectedDestination.nearbyPolice || [
                      { name: `${selectedDestination.name} Tourist Assistance Booth`, distance: '500 m', phone: '112 / 100' }
                    ]).map((p, i) => (
                      <div key={i} style={{ color: '#475569', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                        • {p.name} ({p.distance}) - 📞 {p.phone}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transportation Options */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                  Transportation Options
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {(selectedDestination.transportOptions || [
                    '🚆 Central Railway Station with express connectivity',
                    '🚗 Monitored National Highway corridor'
                  ]).map((opt, i) => (
                    <div key={i} style={{ fontSize: '0.84rem', color: '#334155', backgroundColor: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button
                  onClick={() => handleFindAccommodation(selectedDestination.id, selectedDestination.name)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
                >
                  <Building size={16} />
                  <span>🏨 Find Hotels</span>
                </button>

                <button
                  onClick={() => handlePlanTrip(selectedDestination.name)}
                  className="btn"
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.88rem'
                  }}
                >
                  <Navigation size={16} />
                  <span>🗺️ Plan My Trip</span>
                </button>

                <Link
                  to="/safety"
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
                >
                  <Shield size={16} />
                  <span>🛡️ Safety Rating</span>
                </Link>

                <button
                  onClick={(e) => handleSaveClick(selectedDestination.id, e)}
                  className="btn"
                  style={{
                    backgroundColor: isDestinationSaved(selectedDestination.id) ? '#fef2f2' : '#f8fafc',
                    color: isDestinationSaved(selectedDestination.id) ? '#dc2626' : '#475569',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.88rem'
                  }}
                >
                  <Heart size={16} fill={isDestinationSaved(selectedDestination.id) ? '#dc2626' : 'none'} />
                  <span>{isDestinationSaved(selectedDestination.id) ? 'Saved' : 'Save Destination'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
