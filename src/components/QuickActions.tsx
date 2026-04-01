import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileSpreadsheet, Download, Share2 } from 'lucide-react';
import { WaterBody } from '@/types/waterBody';
import { toast } from 'sonner';

interface QuickActionsProps {
  waterBodies: WaterBody[];
  onExport?: () => void;
}

export const QuickActions = ({ waterBodies, onExport }: QuickActionsProps) => {
  const exportToCSV = () => {
    const headers = ['Name','Type','District','Health Score','Status','pH','DO','Turbidity','Temperature','Date'];
    const rows = waterBodies.map((wb) => [
      wb.name, wb.type, wb.location.district, wb.healthScore, wb.healthStatus,
      wb.measurements.pH || '', wb.measurements.dissolvedOxygen || '',
      wb.measurements.turbidity || '', wb.measurements.temperature || '', wb.measurements.date,
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.map((c) => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `aquacity_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data exported to CSV');
  };

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(waterBodies, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `aquacity_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Data exported to JSON');
  };

  const shareData = async () => {
    const avg = waterBodies.length ? Math.round(waterBodies.reduce((s, wb) => s + wb.healthScore, 0) / waterBodies.length) : 0;
    const text = `AquaCity — Urban Water Health Report\n\nTotal Water Bodies: ${waterBodies.length}\nAvg Health Score: ${avg}\nData Source: AI Kosh\nFramework: UN SDG 11\n\nGenerated: ${new Date().toLocaleDateString()}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'AquaCity Report', text }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Report copied to clipboard');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" className="gap-2" onClick={exportToCSV}>
          <FileSpreadsheet className="h-4 w-4" /> Export CSV
        </Button>
        <Button variant="outline" className="gap-2" onClick={exportToJSON}>
          <Download className="h-4 w-4" /> Export JSON
        </Button>
        <Button variant="outline" className="gap-2" onClick={shareData}>
          <Share2 className="h-4 w-4" /> Share
        </Button>
        <Button variant="outline" className="gap-2" onClick={onExport}>
          <Download className="h-4 w-4" /> Backup
        </Button>
      </div>
    </Card>
  );
};
