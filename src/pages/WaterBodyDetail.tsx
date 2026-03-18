import { Layout } from '@/components/Layout';
import { useWaterBodies } from '@/contexts/WaterBodyContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getHealthBadgeClass } from '@/utils/healthScore';
import { ArrowLeft, MapPin, Calendar, Droplets, ThermometerSun, Activity, AlertCircle, Trash2, Download, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { generateWaterBodyReport } from '@/utils/reportGenerator';
import { useState } from 'react';

const WaterBodyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWaterBodyById, deleteWaterBody, user } = useWaterBodies();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const waterBody = getWaterBodyById(id!);

  if (!waterBody) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Water Body Not Found</h2>
          <Button onClick={() => navigate('/list')}>Back to List</Button>
        </div>
      </Layout>
    );
  }

  const handleDelete = async () => {
    await deleteWaterBody(waterBody.id);
    navigate('/list');
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      await generateWaterBodyReport(waterBody);
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Prepare radar chart data
  const radarData = [
    { parameter: 'pH', value: waterBody.measurements.pH ? (waterBody.measurements.pH / 14) * 100 : 0, fullMark: 100 },
    { parameter: 'DO', value: waterBody.measurements.dissolvedOxygen ? (waterBody.measurements.dissolvedOxygen / 12) * 100 : 0, fullMark: 100 },
    { parameter: 'Turbidity', value: waterBody.measurements.turbidity ? Math.max(0, 100 - waterBody.measurements.turbidity) : 0, fullMark: 100 },
    { parameter: 'Temp', value: waterBody.measurements.temperature ? (waterBody.measurements.temperature / 35) * 100 : 0, fullMark: 100 },
    { parameter: 'BOD', value: waterBody.measurements.bod ? Math.max(0, 100 - (waterBody.measurements.bod * 5)) : 0, fullMark: 100 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground">{waterBody.name}</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="capitalize">
                {waterBody.type}
              </Badge>
              <Badge className={getHealthBadgeClass(waterBody.healthStatus)}>
                {waterBody.healthStatus}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate PDF Report
                </>
              )}
            </Button>
            {user && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the water body record.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Health Score Card */}
        <Card className="p-6 bg-gradient-water text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Health Score</h2>
              <p className="text-white/90">Overall water quality assessment</p>
            </div>
            <div className="text-6xl font-bold">{waterBody.healthScore}</div>
          </div>
          <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${waterBody.healthScore}%` }}
            />
          </div>
        </Card>

        {/* Location & Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location Details
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-muted-foreground">District</dt>
                <dd className="font-medium">{waterBody.location.district}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Taluka</dt>
                <dd className="font-medium">{waterBody.location.taluka}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Village</dt>
                <dd className="font-medium">{waterBody.location.village}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Address</dt>
                <dd className="font-medium">{waterBody.location.address}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Coordinates</dt>
                <dd className="font-medium font-mono text-sm">
                  {waterBody.location.latitude.toFixed(4)}°N, {waterBody.location.longitude.toFixed(4)}°E
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Measurement Info
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-muted-foreground">Measurement Date</dt>
                <dd className="font-medium">{format(new Date(waterBody.measurements.date), 'MMMM d, yyyy')}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Reported By</dt>
                <dd className="font-medium">{waterBody.reportedBy.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Organization</dt>
                <dd className="font-medium">{waterBody.reportedBy.organization}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Contact</dt>
                <dd className="font-medium">{waterBody.reportedBy.contact}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Last Updated</dt>
                <dd className="font-medium">{format(new Date(waterBody.updatedAt), 'MMM d, yyyy h:mm a')}</dd>
              </div>
            </dl>
          </Card>
        </div>

        {/* Water Quality Parameters */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Water Quality Parameters
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {waterBody.measurements.pH?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">pH Level</div>
              <div className="text-xs text-muted-foreground mt-1">(6.5-8.5 optimal)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {waterBody.measurements.dissolvedOxygen?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Dissolved O₂</div>
              <div className="text-xs text-muted-foreground mt-1">(mg/L {'>'}6 optimal)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {waterBody.measurements.turbidity || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Turbidity</div>
              <div className="text-xs text-muted-foreground mt-1">(NTU {'<'}25 optimal)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {waterBody.measurements.temperature || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Temperature</div>
              <div className="text-xs text-muted-foreground mt-1">°C (15-25 optimal)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {waterBody.measurements.conductivity || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Conductivity</div>
              <div className="text-xs text-muted-foreground mt-1">µS/cm</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {waterBody.measurements.bod || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">BOD</div>
              <div className="text-xs text-muted-foreground mt-1">(mg/L {'<'}5 optimal)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {waterBody.measurements.cod || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">COD</div>
              <div className="text-xs text-muted-foreground mt-1">(mg/L {'<'}20 optimal)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {waterBody.measurements.nitrates?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Nitrates</div>
              <div className="text-xs text-muted-foreground mt-1">(mg/L {'<'}10 optimal)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {waterBody.measurements.phosphates?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Phosphates</div>
              <div className="text-xs text-muted-foreground mt-1">(mg/L {'<'}0.5 optimal)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {waterBody.measurements.fecalColiform || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Fecal Coliform</div>
              <div className="text-xs text-muted-foreground mt-1">(CFU/100mL {'<'}500)</div>
            </div>
          </div>
        </Card>

        {/* Parameter Visualization */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Parameter Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="parameter" stroke="hsl(var(--foreground))" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Radar name="Current Values" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Observations & Pollution Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Observations</h3>
            <p className="text-muted-foreground">{waterBody.observations || 'No observations recorded.'}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Pollution Sources
            </h3>
            {waterBody.pollutionSources.length > 0 ? (
              <ul className="space-y-2">
                {waterBody.pollutionSources.map((source, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground">{source}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No pollution sources identified.</p>
            )}
          </Card>
        </div>

        {/* Heavy Metals */}
        {waterBody.measurements.heavyMetals && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Heavy Metals Analysis</h3>
            <p className="text-muted-foreground">{waterBody.measurements.heavyMetals}</p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default WaterBodyDetail;
