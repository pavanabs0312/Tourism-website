import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { hotelService, ALL_VERIFIED_HOTELS } from '../services/hotelService';
import { destinationService } from '../services/destinationService';
import { availabilityService } from '../services/availabilityService';
import { tripService } from '../services/tripService';
import { useAuth } from '../context/AuthContext';
import { 
  Building, MapPin, Star, Shield, Check, Phone, Calendar, 
  Users, ArrowRight, X, AlertCircle, Sparkles, DollarSign, 
  Search, Filter, CheckCircle2, Bed, Heart, ChevronRight,
  ArrowUpDown, SlidersHorizontal, RefreshCw, Info
} from 'lucide-react';

export const HotelsPage = () => {
  const { isAuthenticated, currentUser, addBooking } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: routeHotelId } = useParams();

  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
  const [sortBy, setSortBy] = useState('PRICE_ASC');
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingHotel, setBookingHotel] = useState(null);
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Read initial query param or route
  useEffect(() => {
    const destQuery = searchParams.get('destination');
    if (destQuery) {
      setSelectedDestinationFilter(destQuery);
    }
    const checkInParam = searchParams.get('checkIn');
    if (checkInParam) setCheckInDate(checkInParam);
    const checkOutParam = searchParams.get('checkOut');
    if (checkOutParam) setCheckOutDate(checkOutParam);
    const guestsParam = searchParams.get('guests');
    if (guestsParam && !isNaN(Number(guestsParam))) setGuestsCount(Number(guestsParam));

    const hotelId = routeHotelId || searchParams.get('id');
    if (hotelId) {
      const match = hotelService.getHotelById(hotelId);
      if (match) setSelectedHotel(match);
    }
  }, [searchParams, routeHotelId]);

  // Curated list of destinations for the dropdown filter
  const allDestinations = destinationService.getCuratedDestinations();

  const normalizeQuery = (text) => {
    if (!text) return '';
    return text.trim().toLowerCase();
  };

  const PRICE_RANGES = [
    { id: 'ALL', label: 'All Prices' },
    { id: 'UNDER_1500', label: 'Under ₹1,500', max: 1500 },
    { id: '1500_2500', label: '₹1,500–₹2,500', min: 1500, max: 2500 },
    { id: '2500_5000', label: '₹2,500–₹5,000', min: 2500, max: 5000 },
    { id: 'ABOVE_5000', label: '₹5,000+', min: 5000 }
  ];

  const SORT_OPTIONS = [
    { id: 'PRICE_ASC', label: 'Price: Low to High (Budget First)' },
    { id: 'PRICE_DESC', label: 'Price: High to Low' },
    { id: 'RATING_DESC', label: 'Rating: High to Low' },
    { id: 'DISTANCE_ASC', label: 'Distance: Nearest' }
  ];

  const handlePriceRangeClick = (range) => {
    setSelectedPriceRange(range.id);
    if (range.id === 'ALL') {
      setMaxPrice(30000);
    } else if (range.max && range.max !== Infinity) {
      setMaxPrice(range.max);
    } else if (range.min) {
      setMaxPrice(30000);
    }
  };

  const handleResetFilters = () => {
    setSelectedDestinationFilter('ALL');
    setSearchQuery('');
    setMaxPrice(30000);
    setSelectedPriceRange('ALL');
    setSortBy('PRICE_ASC');
  };

  const handleIncreaseBudget = () => {
    setMaxPrice(30000);
    setSelectedPriceRange('ALL');
  };

  // Main Filtering Logic
  const allHotels = hotelService.getAllHotels();

  const filteredHotels = allHotels.filter((hotel) => {
    // 1. Destination Dropdown Filter
    if (selectedDestinationFilter !== 'ALL') {
      const normSelected = normalizeQuery(selectedDestinationFilter);
      const hotelDestId = normalizeQuery(hotel.destinationId);
      const hotelCity = normalizeQuery(hotel.city);
      const hotelDestName = normalizeQuery(hotel.destinationName);
      const hotelLocation = normalizeQuery(hotel.location);

      const matchesDest = (
        hotelDestId === normSelected ||
        hotelCity === normSelected ||
        hotelDestName.includes(normSelected) ||
        hotelLocation.includes(normSelected) ||
        normSelected.includes(hotelCity) ||
        (hotel.aliases && hotel.aliases.some(a => normalizeQuery(a) === normSelected || normSelected.includes(normalizeQuery(a))))
      );

      if (!matchesDest) return false;
    }

    // 2. Price Filter
    if (selectedPriceRange === 'UNDER_1500') {
      if (hotel.pricePerNight > 1500) return false;
    } else if (selectedPriceRange === '1500_2500') {
      if (hotel.pricePerNight < 1500 || hotel.pricePerNight > 2500) return false;
    } else if (selectedPriceRange === '2500_5000') {
      if (hotel.pricePerNight < 2500 || hotel.pricePerNight > 5000) return false;
    } else if (selectedPriceRange === 'ABOVE_5000') {
      if (hotel.pricePerNight < 5000) return false;
    } else {
      if (hotel.pricePerNight > maxPrice) return false;
    }

    // 3. Search Query Filter (name, city, area, location, aliases)
    if (searchQuery.trim()) {
      const q = normalizeQuery(searchQuery);
      const matchName = normalizeQuery(hotel.name).includes(q);
      const matchCity = normalizeQuery(hotel.city).includes(q);
      const matchArea = normalizeQuery(hotel.area).includes(q);
      const matchLocation = normalizeQuery(hotel.location).includes(q);
      const matchDestName = normalizeQuery(hotel.destinationName).includes(q);
      const matchAlias = hotel.aliases ? hotel.aliases.some(a => normalizeQuery(a).includes(q)) : false;

      if (!matchName && !matchCity && !matchArea && !matchLocation && !matchDestName && !matchAlias) {
        return false;
      }
    }

    return true;
  });

  // Sorting Logic
  if (sortBy === 'PRICE_ASC') {
    filteredHotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (sortBy === 'PRICE_DESC') {
    filteredHotels.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (sortBy === 'RATING_DESC') {
    filteredHotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'DISTANCE_ASC') {
    filteredHotels.sort((a, b) => (a.distanceKm || 99) - (b.distanceKm || 99));
  }

  // Calculate nights
  const calculateNights = () => {
    const duration = tripService.calculateTripDuration(checkInDate, checkOutDate);
    return Math.max(1, duration.nights || duration.days);
  };

  const handleBookNowClick = (hotel) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/hotels?id=${hotel.id}`);
      return;
    }
    setBookingHotel(hotel);
    setSelectedRoomIndex(0);
    setConfirmedBooking(null);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingSubmitting(true);

    setTimeout(() => {
      const nights = calculateNights();
      const room = bookingHotel.roomTypes[selectedRoomIndex] || bookingHotel.roomTypes[0];
      const total = room.price * nights;

      const newBookingRecord = {
        bookingId: `BK-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        touristId: currentUser?.touristId || 'TG-DEMO-2026',
        touristName: currentUser?.name || 'Verified Traveler',
        hotelId: bookingHotel.id,
        hotelName: bookingHotel.name,
        destination: bookingHotel.city || bookingHotel.destinationName,
        destinationId: bookingHotel.destinationId,
        checkInDate,
        checkOutDate,
        nights,
        guestsCount,
        roomType: room.name,
        pricePerNight: room.price,
        totalAmount: total,
        currency: '₹',
        status: 'CONFIRMED',
        contactNumber: currentUser?.phone || bookingHotel.contact,
        hotelImage: bookingHotel.image,
        hotelAddress: bookingHotel.location,
        hotelPhone: bookingHotel.contact,
        bookedAt: new Date().toISOString(),
        isDemoBooking: true
      };

      if (addBooking) {
        addBooking(newBookingRecord);
      }

      setConfirmedBooking(newBookingRecord);
      setBookingSubmitting(false);
    }, 600);
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
            <Building size={14} />
            <span>VERIFIED ACCOMMODATIONS DIRECTORY</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Find Verified Hotels & Stays
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.6' }}>
            Browse verified budget stays from ₹899, state tourism lodges, and luxury heritage resorts across India with verified safety corridors. Transparent pricing with genuine locations.
          </p>

          {/* Academic / Demo Mode Transparency Banner */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#92400e',
            padding: '0.4rem 1rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginTop: '0.75rem',
            textAlign: 'left'
          }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>DEMO MODE:</strong> Showing verified Pan-India accommodations. Live inventory status is simulated for demonstration and academic review.
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Row 1: Search Input + Destination Filter + Sort */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ flex: '1 1 280px', position: 'relative' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="hotel-search-input"
                type="text"
                placeholder="Search hotel name, city, area (e.g. Agra, Mysuru, Colaba, Zostel...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem 0.7rem 2.8rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
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

            {/* Destination Selector Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap' }}>
                Destination:
              </span>
              <select
                id="destination-filter-select"
                value={selectedDestinationFilter}
                onChange={(e) => setSelectedDestinationFilter(e.target.value)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  maxWidth: '220px'
                }}
              >
                <option value="ALL">All Destinations (Pan-India)</option>
                {allDestinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap' }}>
                <ArrowUpDown size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: '#0f172a'
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Budget Pills & Reset */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginRight: '0.25rem' }}>
                Budget:
              </span>
              {PRICE_RANGES.map((r) => {
                const isActive = selectedPriceRange === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handlePriceRangeClick(r)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? '800' : '600',
                      backgroundColor: isActive ? '#2563eb' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#475569',
                      border: isActive ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            {(selectedDestinationFilter !== 'ALL' || searchQuery || selectedPriceRange !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: '#2563eb',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={12} />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.88rem', color: '#475569', fontWeight: '600', padding: '0 0.25rem' }}>
          Showing <strong>{filteredHotels.length}</strong> verified accommodation{filteredHotels.length !== 1 ? 's' : ''}
          {selectedDestinationFilter !== 'ALL' && (
            <span> in <strong>{allDestinations.find(d => d.id === selectedDestinationFilter)?.name || selectedDestinationFilter}</strong></span>
          )}
          {searchQuery && (
            <span> matching "<strong>{searchQuery}</strong>"</span>
          )}
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4.5rem 1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
            maxWidth: '680px',
            margin: '0 auto'
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
              <Building size={32} color="#64748b" />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>
              No verified hotels found
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748b', marginBottom: '1.75rem', lineHeight: '1.5' }}>
              We could not find matching accommodations under your current filter settings. Try clearing the destination filter or increasing your budget.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleResetFilters}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem' }}
              >
                <RefreshCw size={15} />
                <span>Reset Filters</span>
              </button>

              <button
                onClick={handleIncreaseBudget}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                Increase Budget
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {filteredHotels.map((hotel) => {
              const avail = availabilityService.getAvailabilityStatus(hotel.id);

              return (
                <div
                  key={hotel.id}
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
                  {/* Photo & Badges */}
                  <div style={{ height: '220px', position: 'relative' }}>
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Verification Badge */}
                    {hotel.verified && (
                      <div style={{
                        position: 'absolute',
                        top: '0.85rem',
                        left: '0.85rem',
                        backgroundColor: '#059669',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                      }}>
                        <Check size={13} strokeWidth={3} />
                        <span>{hotel.verificationBadge || 'VERIFIED PROPERTY'}</span>
                      </div>
                    )}

                    {/* Price Badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '0.85rem',
                      right: '0.85rem',
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      backdropFilter: 'blur(6px)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: '900',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                    }}>
                      ₹{hotel.pricePerNight?.toLocaleString()} <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: '500' }}>/ night</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Title & Rating */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.3' }}>
                        {hotel.name}
                      </h2>
                      {hotel.rating && hotel.reviewsCount ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: '800', whiteSpace: 'nowrap' }}>
                          <Star size={15} fill="#f59e0b" />
                          <span>{hotel.rating}</span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>({hotel.reviewsCount})</span>
                        </div>
                      ) : null}
                    </div>

                    {/* City & Area / Locality */}
                    <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <MapPin size={14} color="#2563eb" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {hotel.area || hotel.location}
                      </span>
                      <span style={{ color: '#94a3b8' }}>•</span>
                      <span style={{ color: '#2563eb', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        {hotel.city || hotel.destinationName}
                      </span>
                    </div>

                    {/* Distance */}
                    {hotel.distance && (
                      <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem' }}>📍</span>
                        <span>{hotel.distance}</span>
                      </div>
                    )}

                    {/* Taxes Note */}
                    <div style={{
                      fontSize: '0.74rem',
                      color: hotel.taxesIncluded ? '#059669' : '#64748b',
                      fontWeight: '600',
                      marginBottom: '0.75rem'
                    }}>
                      {hotel.taxNote || (hotel.taxesIncluded ? 'Taxes included' : '+ taxes & fees (approx. 12% GST)')}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem', flex: 1 }}>
                      {hotel.description}
                    </p>

                    {/* Amenities Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {(hotel.amenities || []).slice(0, 4).map((am, i) => (
                        <span key={i} style={{ fontSize: '0.72rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '0.25rem 0.55rem', borderRadius: '6px', fontWeight: '500' }}>
                          {am}
                        </span>
                      ))}
                      {(hotel.amenities || []).length > 4 && (
                        <span style={{ fontSize: '0.72rem', backgroundColor: '#e2e8f0', color: '#64748b', padding: '0.25rem 0.45rem', borderRadius: '6px', fontWeight: '600' }}>
                          +{hotel.amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Availability Note */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.73rem',
                      color: '#64748b',
                      marginBottom: '1rem',
                      border: '1px solid #f1f5f9'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#059669', fontWeight: '700', marginBottom: '0.15rem' }}>
                        <Shield size={12} />
                        <span>{hotel.safetyRating || 'Verified Safe Corridor'}</span>
                      </div>
                      <div style={{ color: '#64748b' }}>
                        {avail.badge}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                      <button
                        onClick={() => setSelectedHotel(hotel)}
                        className="btn"
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          padding: '0.6rem 0.5rem',
                          borderRadius: '8px',
                          textAlign: 'center'
                        }}
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => handleBookNowClick(hotel)}
                        className="btn btn-primary"
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          padding: '0.6rem 0.5rem',
                          borderRadius: '8px',
                          textAlign: 'center'
                        }}
                      >
                        Book Stay
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* HOTEL DETAILS MODAL */}
      {selectedHotel && (
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
            {/* Header Image */}
            <div style={{ height: '260px', position: 'relative' }}>
              <img
                src={selectedHotel.image}
                alt={selectedHotel.name}
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
                onClick={() => setSelectedHotel(null)}
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

              {/* Title & Info on Image */}
              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ backgroundColor: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800' }}>
                    {selectedHotel.verificationBadge || 'VERIFIED ACCOMMODATION'}
                  </span>
                  {selectedHotel.rating && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: '800' }}>
                      <Star size={14} fill="#f59e0b" />
                      <span>{selectedHotel.rating} ({selectedHotel.reviewsCount || 100}+ reviews)</span>
                    </span>
                  )}
                </div>
                <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {selectedHotel.name}
                </h1>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {selectedHotel.location}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem' }}>
              <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {selectedHotel.description}
              </p>

              {/* Amenities Grid */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
                  Property Amenities & Facilities
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                  {(selectedHotel.amenities || []).map((am, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#10b981" />
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Options */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
                  Available Room Options
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(selectedHotel.roomTypes || []).map((room, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>{room.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          Capacity: {room.capacity} • Beds: {room.beds} • Size: {room.size}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>
                          ₹{room.price?.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b' }}>/ night</span>
                        </div>
                        <button
                          onClick={() => { setSelectedHotel(null); handleBookNowClick(selectedHotel); }}
                          className="btn btn-primary"
                          style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem', marginTop: '0.35rem' }}
                        >
                          Select & Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety & Cancellation Policies */}
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: '700', color: '#1e40af', marginBottom: '0.35rem' }}>
                  🛡️ Tourist Safety & Check-In Verification
                </div>
                <div style={{ color: '#1e3a8a', lineHeight: '1.5' }}>
                  • Verified accommodation linked to local Tourist Police network. High-coverage perimeter monitoring.<br />
                  • {selectedHotel.cancellation || 'Free cancellation available'}<br />
                  • 24/7 reception desk. Free baggage lockers available for arriving travelers.
                </div>
              </div>

              {/* Contact & Action Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  📞 Direct Reception Desk: <strong>{selectedHotel.contact || '+91 Reception'}</strong>
                </div>

                <button
                  onClick={() => { setSelectedHotel(null); handleBookNowClick(selectedHotel); }}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem' }}
                >
                  Book Stay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOTEL BOOKING FLOW MODAL */}
      {bookingModalOpen && bookingHotel && (
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
          zIndex: 2100,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1.25rem',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setBookingModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                color: '#64748b',
                cursor: 'pointer',
                background: 'none',
                border: 'none'
              }}
            >
              <X size={20} />
            </button>

            {!confirmedBooking ? (
              /* Booking Form */
              <form onSubmit={handleConfirmBooking}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#d97706',
                    border: '1px solid #fde68a',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px'
                  }}>
                    Demo Reservation • Tourist Guardian
                  </span>
                </div>

                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
                  Confirm Your Stay
                </h2>
                <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  {bookingHotel.name} • {bookingHotel.city || bookingHotel.destinationName}
                </div>

                {/* Dates Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      required
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      required
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Guests & Room Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>
                      Guests Count
                    </label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>
                      Room Type
                    </label>
                    <select
                      value={selectedRoomIndex}
                      onChange={(e) => setSelectedRoomIndex(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      {(bookingHotel.roomTypes || []).map((room, idx) => (
                        <option key={idx} value={idx}>
                          {room.name} (₹{room.price?.toLocaleString()}/night)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Booking Summary Box */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Booking Summary
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#475569' }}>
                    <span>Hotel:</span>
                    <strong style={{ color: '#0f172a' }}>{bookingHotel.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#475569' }}>
                    <span>Room:</span>
                    <strong>{bookingHotel.roomTypes?.[selectedRoomIndex]?.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#475569' }}>
                    <span>Dates:</span>
                    <span>{checkInDate} to {checkOutDate} ({calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#475569' }}>
                    <span>Guests:</span>
                    <span>{guestsCount} Guests</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>Total Amount:</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#059669' }}>
                      ₹{((bookingHotel.roomTypes?.[selectedRoomIndex]?.price || bookingHotel.pricePerNight) * calculateNights()).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Demo Notice */}
                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.75rem', color: '#92400e', marginBottom: '1.5rem' }}>
                  ℹ️ <strong>Demonstration Mode:</strong> Simulated reservation record for evaluation. No payment is processed; booking syncs to your Tourist Dashboard and My Trips.
                </div>

                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', borderRadius: '8px' }}
                >
                  {bookingSubmitting ? 'Confirming Reservation...' : 'Confirm Booking'}
                </button>
              </form>
            ) : (
              /* Booking Confirmed State */
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}>
                  <CheckCircle2 size={36} />
                </div>

                <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.25rem' }}>
                  Booking Confirmed! 🎉
                </h2>
                <div style={{ fontSize: '0.88rem', color: '#059669', fontWeight: '700', marginBottom: '1.5rem' }}>
                  Reservation successfully saved to your tourist profile
                </div>

                {/* Confirmation Receipt Details */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  marginBottom: '1.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    <span style={{ color: '#64748b' }}>Booking ID:</span>
                    <strong style={{ fontFamily: 'monospace', color: '#2563eb' }}>{confirmedBooking.bookingId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#64748b' }}>Hotel:</span>
                    <strong style={{ color: '#0f172a' }}>{confirmedBooking.hotelName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#64748b' }}>Dates:</span>
                    <span>{confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({confirmedBooking.nights} nights)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#64748b' }}>Guests:</span>
                    <span>{confirmedBooking.guestsCount} Guests</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#64748b' }}>Room:</span>
                    <span>{confirmedBooking.roomType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>Total (Demo):</span>
                    <strong style={{ color: '#059669', fontSize: '1.1rem' }}>₹{confirmedBooking.totalAmount?.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => { setBookingModalOpen(false); navigate('/my-trips'); }}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
                  >
                    View in My Trips
                  </button>
                  <button
                    onClick={() => { setBookingModalOpen(false); navigate('/tourist'); }}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
                  >
                    Tourist Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
