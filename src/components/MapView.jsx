import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRiskLevelColor } from '../services/riskEngine';
import { Crosshair, Shield, AlertTriangle, Radio, Navigation } from 'lucide-react';

// Fix Leaflet default marker icons issue in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom SVG Pulsing Marker for Live Tourists
const createTouristIcon = (level, isSOS, name) => {
  let color = '#10b981'; // Green SAFE
  if (isSOS) color = '#dc2626';
  else if (level === 'CRITICAL') color = '#dc2626';
  else if (level === 'HIGH' || level === 'HIGH RISK') color = '#ea580c';
  else if (level === 'CAUTION') color = '#d97706';
  else if (level === 'LOW') color = '#0284c7';

  const pulseHtml = `
    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
      ${isSOS ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: ${color}; opacity: 0.75; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
      <div style="width: 22px; height: 22px; border-radius: 50%; background-color: ${color}; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 10;">
        <span style="color: #ffffff; font-size: 11px; font-weight: 800;">${isSOS ? '🚨' : '👤'}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html: pulseHtml,
    className: 'custom-leaflet-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
};

// Custom SVG Icon for POI Destinations
const createDestinationIcon = (number = 1) => {
  const html = `
    <div style="width: 26px; height: 26px; border-radius: 50%; background-color: #2563eb; border: 2px solid #ffffff; color: #ffffff; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
      ${number}
    </div>
  `;
  return L.divIcon({
    html,
    className: 'destination-marker',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13]
  });
};

// Map Recenter & FlyTo Controller
const MapFlyToController = ({ center, zoom, triggerKey }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 14, { animate: true, duration: 1.0 });
    }
  }, [center, zoom, triggerKey, map]);
  return null;
};

export const MapView = ({
  center = [12.3052, 76.6552],
  zoom = 13,
  tourists = [],
  dangerZones = [],
  destinations = [],
  fastestRouteCoordinates = null,
  saferRouteCoordinates = null,
  onTouristClick = null,
  height = '420px',
  isDemoMode = false,
  highlightTouristId = null
}) => {
  const [autoCenter, setAutoCenter] = useState(true);
  const [markerRefs, setMarkerRefs] = useState({});

  const mainCenter = center && center[0] ? center : [12.3052, 76.6552];

  const getDangerZoneStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return { color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.22, weight: 2, dashArray: '4, 4' };
      case 'HIGH':
        return { color: '#ea580c', fillColor: '#f97316', fillOpacity: 0.18, weight: 2 };
      case 'CAUTION':
        return { color: '#d97706', fillColor: '#f59e0b', fillOpacity: 0.15, weight: 1.5 };
      default:
        return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.18, weight: 2 };
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      {/* Top Floating Badges */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 500, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span
          style={{
            backgroundColor: isDemoMode ? '#fff7ed' : '#ecfdf5',
            color: isDemoMode ? '#c2410c' : '#047857',
            border: isDemoMode ? '1px solid #fed7aa' : '1px solid #a7f3d0',
            padding: '0.3rem 0.65rem',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: '700',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span>{isDemoMode ? '🟠' : '🟢'}</span>
          <span>{isDemoMode ? 'DEMO SIMULATION' : 'REAL GNSS'}</span>
        </span>

        <span
          style={{
            backgroundColor: '#0a1128',
            color: '#38bdf8',
            padding: '0.3rem 0.65rem',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: '700',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Shield size={12} />
          <span>GEO-FENCE ACTIVE</span>
        </span>
      </div>

      <MapContainer
        center={mainCenter}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic FlyTo Controller for Track on Map */}
        <MapFlyToController center={mainCenter} zoom={zoom} triggerKey={`${mainCenter[0]}-${mainCenter[1]}-${zoom}`} />

        {/* 1. Accuracy Circles & Tourist Markers */}
        {tourists.map((t, idx) => {
          if (!t.latitude || !t.longitude) return null;
          const pos = [t.latitude, t.longitude];
          const isSOS = t.sosActive || t.sosStatus === 'ACTIVE';
          const level = t.safetyStatus || t.riskLevel || 'SAFE';
          const accuracy = Math.max(5, t.gpsAccuracy || 15);
          const isHighlighted = highlightTouristId && (t.touristId === highlightTouristId || t.touristTag === highlightTouristId);

          return (
            <React.Fragment key={t.touristId || idx}>
              {/* Blue translucent GPS Accuracy Uncertainty Circle */}
              <Circle
                center={pos}
                radius={accuracy}
                pathOptions={{
                  color: isSOS ? '#dc2626' : (isHighlighted ? '#f59e0b' : '#3b82f6'),
                  fillColor: isSOS ? '#ef4444' : (isHighlighted ? '#fde68a' : '#60a5fa'),
                  fillOpacity: isHighlighted ? 0.28 : 0.14,
                  weight: isHighlighted ? 2.5 : 1
                }}
              />

              {/* Tourist Marker */}
              <Marker
                position={pos}
                icon={createTouristIcon(level, isSOS, t.name)}
                eventHandlers={{
                  click: () => onTouristClick && onTouristClick(t)
                }}
              >
                <Popup>
                  <div style={{ minWidth: '190px', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '0.2rem' }}>
                      {t.name || 'Active Tourist'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#2563eb', fontFamily: 'monospace', fontWeight: '700' }}>
                      {t.touristTag || t.touristId} • {t.selectedTransportLabel || t.selectedTransport || 'Active Transit'}
                    </div>
                    <div style={{ marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Risk Score:</span>
                      <strong style={{ color: level === 'SAFE' ? '#10b981' : (level === 'LOW' ? '#0284c7' : '#dc2626') }}>
                        {t.riskScore || 0}/100 ({level})
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                      Accuracy: ±{Math.round(accuracy)}m ({accuracy <= 30 ? 'High GNSS' : 'Low confidence'})
                    </div>
                    {t.movementStatus && (
                      <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.15rem' }}>
                        Movement: {t.movementStatus} ({t.speed || 0} km/h)
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* 2. Danger Zone Geo-Fences */}
        {dangerZones.map((zone) => {
          if (!zone.latitude || !zone.longitude || zone.active === false) return null;
          const zonePos = [zone.latitude, zone.longitude];
          const radius = zone.radius || 400;

          return (
            <Circle
              key={zone.id}
              center={zonePos}
              radius={radius}
              pathOptions={getDangerZoneStyle(zone.severity)}
            >
              <Popup>
                <div style={{ fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#dc2626', fontWeight: '800' }}>
                    <AlertTriangle size={15} />
                    <span>{zone.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7f1d1d', marginTop: '0.25rem' }}>
                    {zone.reason || zone.description || 'Configured hazard buffer zone'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>
                    Radius: {radius}m • Severity: {zone.severity || 'HIGH'}
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* 3. Destination Markers */}
        {destinations.map((dest, idx) => {
          if (!dest.latitude || !dest.longitude) return null;
          return (
            <Marker
              key={dest.id || idx}
              position={[dest.latitude, dest.longitude]}
              icon={createDestinationIcon(idx + 1)}
            >
              <Popup>
                <div style={{ fontSize: '0.82rem' }}>
                  <strong>{idx + 1}. {dest.name}</strong>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{dest.category} • {dest.location}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 4. Fastest Route Polyline (Blue) */}
        {fastestRouteCoordinates && fastestRouteCoordinates.length > 0 && (
          <Polyline
            positions={fastestRouteCoordinates}
            pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.8 }}
          />
        )}

        {/* 5. Safer Route Polyline (Green Dashed) */}
        {saferRouteCoordinates && saferRouteCoordinates.length > 0 && (
          <Polyline
            positions={saferRouteCoordinates}
            pathOptions={{ color: '#10b981', weight: 5, opacity: 0.9, dashArray: '6, 8' }}
          />
        )}
      </MapContainer>
    </div>
  );
};
