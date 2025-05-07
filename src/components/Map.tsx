import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Import Leaflet CSS (will be included in the HTML)
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
// @ts-ignore - Workaround for missing marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create custom icons
const restaurantIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'restaurant-marker'
});

const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'user-marker'
});

const driverIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'driver-marker'
});

interface MapAutoFitProps {
  points: [number, number][];
}

// Component to automatically fit map to markers
const MapAutoFit: React.FC<MapAutoFitProps> = ({ points }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (points.length > 0) {
      if (points.length === 1) {
        map.setView(points[0], 14);
      } else {
        const bounds = L.latLngBounds(points.map(point => L.latLng(point[0], point[1])));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [map, points]);
  
  return null;
};

interface MarkerInfo {
  position: [number, number];
  title: string;
  description?: string;
  type: 'restaurant' | 'user' | 'driver';
}

interface MapProps {
  markers: MarkerInfo[];
  height?: string;
  zoom?: number;
  center?: [number, number];
  className?: string;
}

const Map: React.FC<MapProps> = ({ 
  markers, 
  height = '400px', 
  zoom = 13, 
  center = [40.7128, -74.0060],
  className = ''
}) => {
  const getIcon = (type: string): L.Icon => {
    switch (type) {
      case 'restaurant':
        return restaurantIcon;
      case 'user':
        return userIcon;
      case 'driver':
        return driverIcon;
      default:
        return restaurantIcon;
    }
  };

  return (
    <div style={{ height }} className={`rounded-lg overflow-hidden shadow-md ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={marker.position} 
            icon={getIcon(marker.type)}
          >
            <Popup>
              <div>
                <h3 className="font-medium">{marker.title}</h3>
                {marker.description && <p>{marker.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapAutoFit points={markers.map(m => m.position)} />
      </MapContainer>
    </div>
  );
};

export default Map;