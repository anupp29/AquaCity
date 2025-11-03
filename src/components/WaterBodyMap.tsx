import { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, LayerGroup } from 'leaflet';
import { WaterBody } from '@/types/waterBody';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet when bundling
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

export function WaterBodyMap({
  waterBodies,
  selectedId,
  onMarkerClick,
  height = '500px',
  center = [19.7515, 75.7139], // Maharashtra center
  zoom = 7,
}: WaterBodyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return '#22c55e';
      case 'good':
        return '#84cc16';
      case 'fair':
        return '#eab308';
      case 'poor':
        return '#f97316';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const createColoredIcon = (color: string) =>
    L.divIcon({
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

  // Initialize map once
  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      const map = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const markers = L.layerGroup();
      markers.addTo(map);

      mapRef.current = map;
      markersLayerRef.current = markers;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update view when center/zoom change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers when data changes
  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    waterBodies.forEach((wb) => {
      const marker = L.marker([wb.location.latitude, wb.location.longitude], {
        icon: createColoredIcon(getMarkerColor(wb.healthStatus)),
      });

      marker.on('click', () => onMarkerClick?.(wb.id));

      const popupHtml = `
        <div style="padding: 8px;">
          <h3 style="font-weight:600; margin:0 0 4px;">${wb.name}</h3>
          <p style="margin:0 0 4px; text-transform:capitalize; color:#6b7280;">${wb.type}</p>
          <p style="margin:0 0 2px;">
            <span style="font-weight:500;">Health: </span>
            <span style="font-weight:600; color:${getMarkerColor(wb.healthStatus)}; text-transform:capitalize;">${wb.healthStatus}</span>
          </p>
          <p style="margin:0 0 6px;"><span style="font-weight:500;">Score: </span>${wb.healthScore}/100</p>
          <p style="margin:0; font-size:12px; color:#6b7280;">${wb.location.village}, ${wb.location.taluka}</p>
        </div>`;

      marker.bindPopup(popupHtml);
      marker.addTo(layer);

      if (selectedId && wb.id === selectedId) {
        map.setView([wb.location.latitude, wb.location.longitude], Math.max(10, zoom));
      }
    });
  }, [waterBodies, selectedId, zoom, onMarkerClick]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}
    />
  );
}

