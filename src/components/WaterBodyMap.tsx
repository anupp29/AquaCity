import { useMemo } from 'react';
import { WaterBody } from '@/types/waterBody';

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
}: WaterBodyMapProps) {
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

  const plotPoints = useMemo(() => {
    const minLat = 15.5;
    const maxLat = 22.5;
    const minLng = 72.5;
    const maxLng = 80.5;

    return waterBodies.map((wb) => {
      const x = ((wb.location.longitude - minLng) / (maxLng - minLng)) * 100;
      const y = 100 - ((wb.location.latitude - minLat) / (maxLat - minLat)) * 100;

      return {
        ...wb,
        x: Math.max(2, Math.min(98, x)),
        y: Math.max(2, Math.min(98, y)),
      };
    });
  }, [waterBodies]);

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      <div
        style={{
          position: 'relative',
          height,
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 20% 30%, rgba(6,182,212,0.18), transparent 35%), radial-gradient(circle at 80% 70%, rgba(34,197,94,0.2), transparent 30%), linear-gradient(135deg, #f8fafc, #e2e8f0)',
          border: '1px solid #cbd5e1',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            padding: '4px 8px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#0f172a',
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid #cbd5e1',
          }}
        >
          Approximate Maharashtra distribution
        </div>

        {plotPoints.map((wb) => {
          const isSelected = selectedId === wb.id;

          return (
            <button
              key={wb.id}
              type="button"
              onClick={() => onMarkerClick?.(wb.id)}
              title={`${wb.name} (${wb.healthScore}/100)`}
              style={{
                position: 'absolute',
                left: `${wb.x}%`,
                top: `${wb.y}%`,
                transform: 'translate(-50%, -50%)',
                width: isSelected ? '18px' : '14px',
                height: isSelected ? '18px' : '14px',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: isSelected
                  ? '0 0 0 4px rgba(15, 23, 42, 0.18)'
                  : '0 2px 4px rgba(0,0,0,0.25)',
                backgroundColor: getMarkerColor(wb.healthStatus),
                cursor: 'pointer',
              }}
            />
          );
        })}

        <div
          style={{
            position: 'absolute',
            right: '10px',
            bottom: '8px',
            fontSize: '11px',
            color: '#475569',
            background: 'rgba(255,255,255,0.8)',
            padding: '2px 6px',
            borderRadius: '6px',
          }}
        >
          Center: {center[0].toFixed(2)}, {center[1].toFixed(2)}
        </div>
      </div>
    </div>
  );
}

