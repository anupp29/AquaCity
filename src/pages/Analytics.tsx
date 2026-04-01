import { Layout } from '@/components/Layout';
import { useWaterBodies } from '@/contexts/WaterBodyContext';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const STATUS_COLORS = {
  excellent: 'hsl(var(--status-excellent))',
  good: 'hsl(var(--status-good))',
  fair: 'hsl(var(--status-fair))',
  poor: 'hsl(var(--status-poor))',
  critical: 'hsl(var(--status-critical))',
};

const Analytics = () => {
  const { waterBodies, stats } = useWaterBodies();

  const districtAverages = Object.entries(
    waterBodies.reduce((acc, wb) => {
      const d = wb.location.district;
      if (!acc[d]) acc[d] = { district: d, total: 0, healthSum: 0 };
      acc[d].total += 1;
      acc[d].healthSum += wb.healthScore;
      return acc;
    }, {} as Record<string, { district: string; total: number; healthSum: number }>)
  ).map(([_, data]) => ({ district: data.district, avgHealth: Math.round(data.healthSum / data.total) }))
    .sort((a, b) => b.avgHealth - a.avgHealth).slice(0, 10);

  const scoreDistribution = [
    { range: '0-29', count: waterBodies.filter(wb => wb.healthScore < 30).length },
    { range: '30-49', count: waterBodies.filter(wb => wb.healthScore >= 30 && wb.healthScore < 50).length },
    { range: '50-69', count: waterBodies.filter(wb => wb.healthScore >= 50 && wb.healthScore < 70).length },
    { range: '70-84', count: waterBodies.filter(wb => wb.healthScore >= 70 && wb.healthScore < 85).length },
    { range: '85-100', count: waterBodies.filter(wb => wb.healthScore >= 85).length },
  ];

  const avgParams = {
    pH: waterBodies.length ? waterBodies.reduce((s, wb) => s + (wb.measurements.pH || 0), 0) / waterBodies.length : 0,
    dissolvedOxygen: waterBodies.length ? waterBodies.reduce((s, wb) => s + (wb.measurements.dissolvedOxygen || 0), 0) / waterBodies.length : 0,
    turbidity: waterBodies.length ? waterBodies.reduce((s, wb) => s + (wb.measurements.turbidity || 0), 0) / waterBodies.length : 0,
    temperature: waterBodies.length ? waterBodies.reduce((s, wb) => s + (wb.measurements.temperature || 0), 0) / waterBodies.length : 0,
  };

  const statusData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
  }));

  const topPerformers = [...waterBodies].sort((a, b) => b.healthScore - a.healthScore).slice(0, 5)
    .map(wb => ({ name: wb.name.length > 25 ? wb.name.substring(0, 25) + '...' : wb.name, score: wb.healthScore }));

  const bottomPerformers = [...waterBodies].sort((a, b) => a.healthScore - b.healthScore).slice(0, 5)
    .map(wb => ({ name: wb.name.length > 25 ? wb.name.substring(0, 25) + '...' : wb.name, score: wb.healthScore }));

  const tooltipStyle = { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-1 tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into urban water body health — benchmarked against CPCB & IS 10500 standards</p>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-water text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Average Health</h3>
              <Activity className="h-6 w-6" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.averageHealthScore}</div>
            <p className="text-white/80 text-sm">CPCB composite quality index</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Best Performers</h3>
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.byStatus.excellent || 0}</div>
            <p className="text-white/80 text-sm">Meeting all CPCB norms</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-red-600 to-red-700 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Need Intervention</h3>
              <TrendingDown className="h-6 w-6" />
            </div>
            <div className="text-4xl font-bold mb-2">{(stats.byStatus.poor || 0) + (stats.byStatus.critical || 0)}</div>
            <p className="text-white/80 text-sm">Below acceptable thresholds</p>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-1">Health Score Distribution</h2>
            <p className="text-xs text-muted-foreground mb-6">Based on CPCB composite scoring methodology</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold mb-1">Status Overview</h2>
            <p className="text-xs text-muted-foreground mb-6">Classification per BIS IS 10500 water quality grades</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100} fill="#8884d8" dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* District Performance */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-1">Average Health Score by District (Top 10)</h2>
          <p className="text-xs text-muted-foreground mb-6">Aligned with NITI Aayog SDG India Index district benchmarking</p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={districtAverages} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="district" type="category" width={150} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="avgHealth" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top and Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-6 text-emerald-600 dark:text-emerald-400">Top 5 Performers</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPerformers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" width={150} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" fill="hsl(var(--status-excellent))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-6 text-red-600 dark:text-red-400">Bottom 5 — Intervention Priority</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bottomPerformers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" width={150} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" fill="hsl(var(--status-critical))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Average Parameters */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-1">Average Water Quality Parameters</h2>
          <p className="text-xs text-muted-foreground mb-6">Optimal ranges as per CPCB designated best use criteria & IS 10500</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-muted rounded-lg">
              <div className="text-4xl font-bold text-foreground mb-2">{avgParams.pH.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Average pH</div>
              <div className="text-xs text-muted-foreground mt-1">(6.5–8.5 per IS 10500)</div>
            </div>
            <div className="text-center p-6 bg-muted rounded-lg">
              <div className="text-4xl font-bold text-foreground mb-2">{avgParams.dissolvedOxygen.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg DO (mg/L)</div>
              <div className="text-xs text-muted-foreground mt-1">(≥6 per CPCB Class A)</div>
            </div>
            <div className="text-center p-6 bg-muted rounded-lg">
              <div className="text-4xl font-bold text-foreground mb-2">{avgParams.turbidity.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Avg Turbidity (NTU)</div>
              <div className="text-xs text-muted-foreground mt-1">({'<'}10 per IS 10500)</div>
            </div>
            <div className="text-center p-6 bg-muted rounded-lg">
              <div className="text-4xl font-bold text-foreground mb-2">{avgParams.temperature.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Temp (°C)</div>
              <div className="text-xs text-muted-foreground mt-1">(15–25 ambient norm)</div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
