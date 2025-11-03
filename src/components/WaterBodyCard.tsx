import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WaterBody } from '@/types/waterBody';
import { getHealthBadgeClass } from '@/utils/healthScore';
import { MapPin, Calendar, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { generateWaterBodyReport } from '@/utils/reportGenerator';
import { toast } from 'sonner';
import { useState } from 'react';

interface WaterBodyCardProps {
  waterBody: WaterBody;
}

export const WaterBodyCard = ({ waterBody }: WaterBodyCardProps) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    try {
      await generateWaterBodyReport(waterBody);
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-elevated transition-all duration-300 group cursor-pointer" 
          onClick={() => navigate(`/water-body/${waterBody.id}`)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {waterBody.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{waterBody.location.district}</span>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {waterBody.type}
          </Badge>
        </div>

        {/* Health Score */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Health Score</span>
              <span className="text-2xl font-bold text-foreground">{waterBody.healthScore}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${waterBody.healthScore}%`,
                  backgroundColor: `hsl(var(--status-${waterBody.healthStatus}))`
                }}
              />
            </div>
          </div>
          <Badge className={getHealthBadgeClass(waterBody.healthStatus)}>
            {waterBody.healthStatus}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">pH</p>
            <p className="text-sm font-semibold text-foreground">
              {waterBody.measurements.pH?.toFixed(1) || 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">DO</p>
            <p className="text-sm font-semibold text-foreground">
              {waterBody.measurements.dissolvedOxygen?.toFixed(1) || 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Turbidity</p>
            <p className="text-sm font-semibold text-foreground">
              {waterBody.measurements.turbidity || 'N/A'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(waterBody.measurements.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              <FileText className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Report'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/water-body/${waterBody.id}`);
              }}
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
