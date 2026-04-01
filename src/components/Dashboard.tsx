import { useWaterBodies } from '@/contexts/WaterBodyContext';
import { StatCard } from './StatCard';
import { WaterBodyCard } from './WaterBodyCard';
import { QuickActions } from './QuickActions';
import { Button } from './ui/button';
import { AlertTriangle, TrendingUp, Database, Plus, BarChart3, Building2, ShieldCheck, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';
import { WaterBodyMap } from './WaterBodyMap';

const STATUS_COLORS = {
  excellent: 'hsl(var(--status-excellent))',
  good: 'hsl(var(--status-good))',
  fair: 'hsl(var(--status-fair))',
  poor: 'hsl(var(--status-poor))',
  critical: 'hsl(var(--status-critical))',
};

export const Dashboard = () => {
  const { waterBodies, stats } = useWaterBodies();
  const navigate = useNavigate();

  const recentWaterBodies = waterBodies.slice(0, 6);

  const handleExportBackup = () => {
    const dataStr = JSON.stringify(waterBodies, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aquacity_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Backup created successfully!');
  };

  const statusData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
  }));

  const typeData = Object.entries(stats.byType).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count,
  }));

  const topDistricts = Object.entries(stats.byDistrict)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([district, count]) => ({ district, count }));

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-water p-8 text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5" /> UN SDG 11
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-white/10 backdrop-blur">
                AI Kosh Powered
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Urban Water Infrastructure<br className="hidden md:block" /> Dashboard
            </h1>
            <p className="text-white/85 max-w-xl leading-relaxed">
              Real-time monitoring of urban water bodies across Maharashtra — enabling data-driven decisions for sustainable, resilient cities. Methodology aligned with CPCB standards and MoEFCC guidelines.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Button onClick={() => navigate('/analytics')} variant="secondary" className="gap-2 font-semibold">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button onClick={() => navigate('/add')} className="gap-2 bg-white/20 hover:bg-white/30 backdrop-blur border-white/20 text-white font-semibold">
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
      </div>

      {/* SDG 11 Indicator Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2 rounded-lg bg-accent/10">
            <Building2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">SDG 11.6 — Urban Environment</p>
            <p className="text-xs text-muted-foreground mt-0.5">Reduce per capita environmental impact of cities, including water quality management</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">CPCB Standards</p>
            <p className="text-xs text-muted-foreground mt-0.5">Water quality parameters benchmarked against Central Pollution Control Board criteria</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2 rounded-lg bg-accent/10">
            <Info className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Kosh Data Platform</p>
            <p className="text-xs text-muted-foreground mt-0.5">Water body data extracted and validated from India's national AI data repository</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Water Bodies"
          value={stats.totalWaterBodies}
          icon={Database}
          description="Monitored across Maharashtra"
          variant="primary"
        />
        <StatCard
          title="Avg. Health Score"
          value={stats.averageHealthScore}
          icon={TrendingUp}
          description="CPCB-benchmarked quality index"
          variant="accent"
        />
        <StatCard
          title="Critical Alerts"
          value={stats.criticalAlerts}
          icon={AlertTriangle}
          description="Require immediate intervention"
          variant={stats.criticalAlerts > 0 ? 'danger' : 'default'}
        />
        <StatCard
          title="Excellent Status"
          value={stats.byStatus.excellent || 0}
          icon={ShieldCheck}
          description="Meeting all CPCB norms"
          variant="default"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-card border border-border">
          <h2 className="text-lg font-bold mb-1 text-foreground">Health Status Distribution</h2>
          <p className="text-xs text-muted-foreground mb-6">As per CPCB Water Quality Assessment criteria</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100} fill="#8884d8" dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-card border border-border">
          <h2 className="text-lg font-bold mb-1 text-foreground">Water Body Types</h2>
          <p className="text-xs text-muted-foreground mb-6">Classification per MoWR typology standards</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Districts */}
      <div className="bg-card p-6 rounded-xl shadow-card border border-border">
        <h2 className="text-lg font-bold mb-1 text-foreground">Top Districts by Monitored Water Bodies</h2>
        <p className="text-xs text-muted-foreground mb-6">District-wise coverage aligned with NITI Aayog SDG India Index framework</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topDistricts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="district" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Map */}
      <div className="bg-card p-6 rounded-xl shadow-card border border-border">
        <h2 className="text-lg font-bold mb-1 text-foreground">Geospatial Water Body Map</h2>
        <p className="text-xs text-muted-foreground mb-6">Interactive map of monitored urban water infrastructure across Maharashtra</p>
        <WaterBodyMap waterBodies={waterBodies} height="500px" onMarkerClick={(id) => navigate(`/water-body/${id}`)} />
      </div>

      {/* Quick Actions */}
      <QuickActions waterBodies={waterBodies} onExport={handleExportBackup} />

      {/* Recent Records */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Recent Records</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Latest field submissions from community monitors and government agencies</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/list')}>View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentWaterBodies.map((wb) => (
            <WaterBodyCard key={wb.id} waterBody={wb} />
          ))}
        </div>
      </div>
    </div>
  );
};
