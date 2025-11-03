import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileSpreadsheet, Download, Share2, Trash2 } from 'lucide-react';
import { WaterBody } from '@/types/waterBody';
import { toast } from 'sonner';

interface QuickActionsProps {
  waterBodies: WaterBody[];
  onExport?: () => void;
}

export const QuickActions = ({ waterBodies, onExport }: QuickActionsProps) => {
  const exportToCSV = () => {
    const headers = [
      'Name',
      'Type',
      'District',
      'Health Score',
      'Status',
      'pH',
      'Dissolved Oxygen',
      'Turbidity',
      'Temperature',
      'Date',
    ];

    const rows = waterBodies.map((wb) => [
      wb.name,
      wb.type,
      wb.location.district,
      wb.healthScore,
      wb.healthStatus,
      wb.measurements.pH || '',
      wb.measurements.dissolvedOxygen || '',
      wb.measurements.turbidity || '',
      wb.measurements.temperature || '',
      wb.measurements.date,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `water_bodies_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Data exported to CSV successfully!');
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(waterBodies, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `water_bodies_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Data exported to JSON successfully!');
  };

  const shareData = async () => {
    const shareText = `Water Body Health Report\n\nTotal Water Bodies: ${waterBodies.length}\nAverage Health Score: ${Math.round(
      waterBodies.reduce((sum, wb) => sum + wb.healthScore, 0) / waterBodies.length
    )}\n\nGenerated on: ${new Date().toLocaleDateString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Water Body Health Report',
          text: shareText,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Report copied to clipboard!');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" className="gap-2" onClick={exportToCSV}>
          <FileSpreadsheet className="h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="outline" className="gap-2" onClick={exportToJSON}>
          <Download className="h-4 w-4" />
          Export JSON
        </Button>
        <Button variant="outline" className="gap-2" onClick={shareData}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" className="gap-2" onClick={onExport}>
          <Download className="h-4 w-4" />
          Backup
        </Button>
      </div>
    </Card>
  );
};
