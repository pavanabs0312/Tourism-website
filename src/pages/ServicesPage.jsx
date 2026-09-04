import React, { useState } from 'react';
import { useTourist } from '../context/TouristContext';
import { calculateDistanceInMeters, formatDistance } from '../services/locationService';
import { 
  Building, MapPin, Search, Star, Phone, 
  Navigation, Plus, ExternalLink, CheckCircle2 
} from 'lucide-react';
import { INITIAL_SERVICES, POPULAR_DESTINATIONS } from '../data/mockData';

export const ServicesPage = () => {
  const { telemetry, addStopToTrip } = useTourist();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemName, setAddedItemName] = useState(null);

  // Combine curated directory
  const allDirectoryItems = [
    ...INITIAL_SERVICES,
    ...POPULAR_DESTINATIONS.map(d => ({
      ...d,
      categoryLabel: d.category,
      phone: 'Tourist Information Desk: 1363',
      address: d.location,
      openStatus: d.timings
    }))
  ];

  const categories = [
    { id: 'ALL', label: 'All Services' },
    { id: 'police', label: '👮 Police & Helpdesks' },
    { id: 'hospital', label: '🏥 Hospitals & Trauma' },
    { id: 'hotel', label: '🏨 Hotels & Resorts' },
    { id: 'restaurant', label: '🍴 Dining & Cuisine' },
    { id: 'transport', label: '🚉 Transport Junctions' }
  ];

  const filteredItems = allDirectoryItems.filter(item => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchAddr = item.address?.toLowerCase().includes(q);
      const matchCat = (item.categoryLabel || item.category)?.toLowerCase().includes(q);
      if (!matchName && !matchAddr && !matchCat) return false;
    }
    return true;
  }).map(item => {
    const distMeters = calculateDistanceInMeters(
      telemetry.latitude, telemetry.longitude,
      item.latitude, item.longitude
    );
    return {
      ...item,
      distMeters,
      distFormatted: formatDistance(distMeters)
    };
  }).sort((a, b) => a.distMeters - b.distMeters);

  const handleAddToTrip = (item) => {
    addStopToTrip({
      name: item.name,
      location: item.address || item.location,
      category: item.categoryLabel || item.category,
      latitude: item.latitude,
      longitude: item.longitude
    });
    setAddedItemName(item.name);
    setTimeout(() => setAddedItemName(null), 2500);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 0 4rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.4rem', borderRadius: '8px', color: '#2563eb' }}>
              <Building size={22} />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              Tourism & Public Services Directory
            </h1>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Verified hotels, dining spots, heritage sites, hospitals, and police desks mapped relative to your live GPS coordinates.
          </p>
        </div>

        {/* Added Notification Toast */}
        {addedItemName && (
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem'
          }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span>Added "<strong>{addedItemName}</strong>" to your active Trip Itinerary stops!</span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by service name, area, or facility..."
                className="form-input"
                style={{ paddingLeft: '2.6rem', fontSize: '0.92rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: activeCategory === cat.id ? '#1d4ed8' : '#475569',
                  backgroundColor: activeCategory === cat.id ? '#eff6ff' : '#f1f5f9',
                  border: activeCategory === cat.id ? '1px solid #bfdbfe' : '1px solid transparent',
                  transition: 'all 0.15s'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Results Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a', display: 'block' }}>{item.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '600' }}>
                      {item.categoryLabel || item.category}
                    </span>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                    📍 {item.distFormatted}
                  </span>
                </div>

                {item.rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#b45309', fontWeight: '700', marginBottom: '0.4rem' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{item.rating}</span>
                    <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>({item.reviews ? `${item.reviews.toLocaleString()} reviews` : 'Verified listing'})</span>
                  </div>
                )}

                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem', lineHeight: '1.4' }}>
                  {item.address}
                </p>

                {item.openStatus && (
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600', marginBottom: '0.85rem' }}>
                    🕒 {item.openStatus}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => handleAddToTrip(item)}
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.78rem', padding: '0.4rem' }}
                >
                  <Plus size={13} />
                  <span>+ Add to Trip</span>
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: '0.78rem', padding: '0.4rem' }}
                >
                  <Navigation size={13} />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
