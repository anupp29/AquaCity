import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { WaterBody } from '@/types/waterBody';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WaterBodyMapProps {
  waterBodies: WaterBody[];
  selectedId?: string;
  onMarkerClick?: (id: string) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
}

function MapController({ 
  center, 
  zoom 
}: { 
  center?: [number, number]; 
  zoom?: number; 
}) {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

export function WaterBodyMap({ 
  waterBodies, 
  selectedId,
  onMarkerClick,
  height = "500px",
  center = [19.7515, 75.7139], // Maharashtra center
  zoom = 7
}: WaterBodyMapProps) {
  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#22c55e';
      case 'good': return '#84cc16';
      case 'fair': return '#eab308';
      case 'poor': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const createColoredIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  return (
    <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} zoom={zoom} />
        {waterBodies.map((wb) => (
          <Marker
            key={wb.id}
            position={[wb.location.latitude, wb.location.longitude]}
            icon={createColoredIcon(getMarkerColor(wb.healthStatus))}
            eventHandlers={{
              click: () => onMarkerClick?.(wb.id),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-foreground">{wb.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{wb.type}</p>
                <p className="text-sm">
                  <span className="font-medium">Health: </span>
                  <span className={`capitalize font-semibold`} style={{ color: getMarkerColor(wb.healthStatus) }}>
                    {wb.healthStatus}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Score: </span>
                  {wb.healthScore}/100
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {wb.location.village}, {wb.location.taluka}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
