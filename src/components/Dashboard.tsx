import { useWaterBodies } from '@/contexts/WaterBodyContext';
import { StatCard } from './StatCard';
import { WaterBodyCard } from './WaterBodyCard';
import { QuickActions } from './QuickActions';
import { Button } from './ui/button';
import { Droplets, AlertTriangle, TrendingUp, Database, Plus, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';

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
    link.download = `water_bodies_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Backup created successfully!');
  };

  // Prepare chart data
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
    .map(([district, count]) => ({
      district,
      count,
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Water Body Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor and analyze water quality across Maharashtra</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/analytics')} variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          <Button onClick={() => navigate('/add')} className="gap-2 bg-gradient-water">
            <Plus className="h-4 w-4" />
            Add Water Body
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Water Bodies"
          value={stats.totalWaterBodies}
          icon={Database}
          description="Across Maharashtra"
          variant="primary"
        />
        <StatCard
          title="Average Health Score"
          value={stats.averageHealthScore}
          icon={TrendingUp}
          description="Overall water quality"
          variant="accent"
        />
        <StatCard
          title="Critical Alerts"
          value={stats.criticalAlerts}
          icon={AlertTriangle}
          description="Require immediate attention"
          variant={stats.criticalAlerts > 0 ? 'danger' : 'default'}
        />
        <StatCard
          title="Excellent Status"
          value={stats.byStatus.excellent || 0}
          icon={Droplets}
          description="Premium water quality"
          variant="default"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Status Distribution */}
        <div className="bg-card p-6 rounded-xl shadow-card">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Health Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Water Body Types */}
        <div className="bg-card p-6 rounded-xl shadow-card">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Water Body Types</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Districts */}
      <div className="bg-card p-6 rounded-xl shadow-card">
        <h2 className="text-xl font-semibold mb-6 text-foreground">Top Districts by Water Bodies</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topDistricts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="district" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <QuickActions waterBodies={waterBodies} onExport={handleExportBackup} />

      {/* Recent Water Bodies */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Recent Water Bodies</h2>
          <Button variant="outline" onClick={() => navigate('/list')}>
            View All
          </Button>
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
