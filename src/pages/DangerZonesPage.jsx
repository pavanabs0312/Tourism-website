import React, { useState } from 'react';
import { useAuthority } from '../context/AuthorityContext';
import { MapView } from '../components/MapView';
import { 
  AlertTriangle, Plus, Trash2, Edit3, CheckCircle2, 
  MapPin, Shield, RefreshCw 
} from 'lucide-react';

export const DangerZonesPage = () => {
  const { dangerZones, saveDangerZone, deleteDangerZone } = useAuthority();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    latitude: 12.3100,
    longitude: 76.6600,
    radius: 400,
    severity: 'HIGH',
    reason: '',
    active: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (name === 'latitude' || name === 'longitude' || name === 'radius' ? parseFloat(value) : value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.reason.trim()) return;

    await saveDangerZone(formData);
    setShowAddForm(false);
    setFormData({
      name: '',
      latitude: 12.3100,
      longitude: 76.6600,
      radius: 400,
      severity: 'HIGH',
      reason: '',
      active: true
    });
  };

  const handleToggleZone = async (zone) => {
    await saveDangerZone({ ...zone, active: !zone.active });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 0 4rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <div style={{ backgroundColor: '#fffbeb', padding: '0.4rem', borderRadius: '8px', color: '#d97706' }}>
                <AlertTriangle size={22} />
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
                Geo-Fenced Danger Zones Configuration
              </h1>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Configure spatial high-risk geo-fences, water hazard channels, and unlit corridors to proactively route tourists away from danger.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
            style={{ fontSize: '0.88rem' }}
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Cancel New Zone' : '+ Create Danger Geo-Fence'}</span>
          </button>
        </div>

        {/* Add New Danger Zone Form Drawer/Card */}
        {showAddForm && (
          <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid #f59e0b' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
              Create New Geo-Fenced Hazard Zone
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Zone Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Kabini Silt Bed Hazard"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Severity Level</label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="CAUTION">🟡 CAUTION (Minor Traffic/Crowd)</option>
                    <option value="HIGH">🟠 HIGH (Unlit / Secluded Sector)</option>
                    <option value="CRITICAL">🔴 CRITICAL (Active Surge / Steep Cliff)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Geo-Fence Radius (Meters)</label>
                  <input
                    type="number"
                    name="radius"
                    value={formData.radius}
                    onChange={handleChange}
                    min="100"
                    max="3000"
                    step="50"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Center Latitude (Decimal)</label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    step="0.0001"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Center Longitude (Decimal)</label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    step="0.0001"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hazard Incident Reason & Safety Warning *</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="e.g. Unlit forested trail with wildlife movement after 18:00"
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save & Broadcast Danger Geo-Fence
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2-Column Grid: Left Zones Table & Right Live Geo-Fence Map */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Danger Zones Roster */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>Active Danger Geo-Fences ({dangerZones.length})</strong>
            </div>

            <div style={{ divideY: '1px solid #f1f5f9' }}>
              {dangerZones.map((zone) => {
                const isCritical = zone.severity === 'CRITICAL';
                const isHigh = zone.severity === 'HIGH';
                const zoneColor = isCritical ? '#ef4444' : (isHigh ? '#f97316' : '#f59e0b');

                return (
                  <div
                    key={zone.id}
                    style={{
                      padding: '1rem 1.25rem',
                      borderBottom: '1px solid #f1f5f9',
                      opacity: zone.active === false ? 0.6 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{zone.name}</strong>
                      <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: zoneColor, textTransform: 'uppercase' }}>
                        {zone.severity} ({zone.radius}m)
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 0.5rem' }}>
                      {zone.reason}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                      <span style={{ fontFamily: 'monospace' }}>
                        {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                      </span>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleToggleZone(zone)}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: zone.active !== false ? '#059669' : '#64748b',
                            padding: '0.2rem 0.5rem',
                            backgroundColor: zone.active !== false ? '#ecfdf5' : '#f1f5f9',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1'
                          }}
                        >
                          {zone.active !== false ? '● Active' : '○ Disabled'}
                        </button>

                        <button
                          onClick={() => deleteDangerZone(zone.id)}
                          style={{
                            fontSize: '0.75rem',
                            color: '#ef4444',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px'
                          }}
                          title="Delete Zone"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Danger Map */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Spatial Geo-Fence Visualization</strong>
              <span className="badge badge-demo">Leaflet Circles</span>
            </div>

            <div style={{ height: '480px' }}>
              <MapView
                center={[12.3052, 76.6552]}
                zoom={12}
                dangerZones={dangerZones}
                height="100%"
                showDangerZones={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
