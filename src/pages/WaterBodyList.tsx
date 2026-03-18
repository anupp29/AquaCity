import { Layout } from '@/components/Layout';
import { useWaterBodies } from '@/contexts/WaterBodyContext';
import { WaterBodyCard } from '@/components/WaterBodyCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { Search, Map, Grid } from 'lucide-react';
import { MAHARASHTRA_DISTRICTS } from '@/data/maharashtraData';
import { WATER_BODY_TYPES, WATER_BODY_TYPE_LABELS } from '@/types/waterBody';
import { WaterBodyMap } from '@/components/WaterBodyMap';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const WaterBodyList = () => {
  const { waterBodies } = useWaterBodies();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filteredWaterBodies = useMemo(() => {
    return waterBodies.filter((wb) => {
      const matchesSearch = wb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wb.location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wb.location.taluka.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDistrict = filterDistrict === 'all' || wb.location.district === filterDistrict;
      const matchesType = filterType === 'all' || wb.type === filterType;
      const matchesStatus = filterStatus === 'all' || wb.healthStatus === filterStatus;

      return matchesSearch && matchesDistrict && matchesType && matchesStatus;
    });
  }, [waterBodies, searchQuery, filterDistrict, filterType, filterStatus]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Water Bodies</h1>
            <p className="text-muted-foreground">Browse and filter all water bodies across Maharashtra</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="gap-2"
            >
              <Grid className="h-4 w-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="gap-2"
            >
              <Map className="h-4 w-4" />
              Map
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterDistrict} onValueChange={setFilterDistrict}>
            <SelectTrigger>
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {MAHARASHTRA_DISTRICTS.map((district) => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="river">River</SelectItem>
              <SelectItem value="lake">Lake</SelectItem>
              <SelectItem value="pond">Pond</SelectItem>
              <SelectItem value="reservoir">Reservoir</SelectItem>
              <SelectItem value="wetland">Wetland</SelectItem>
              <SelectItem value="stream">Stream</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredWaterBodies.length} of {waterBodies.length} water bodies
          </p>
          
          {filteredWaterBodies.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl shadow-card">
              <p className="text-muted-foreground">No water bodies found matching your filters</p>
            </div>
          ) : viewMode === 'map' ? (
            <div className="bg-card p-6 rounded-xl shadow-card">
              <WaterBodyMap 
                waterBodies={filteredWaterBodies}
                height="600px"
                onMarkerClick={(id) => navigate(`/water-body/${id}`)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWaterBodies.map((wb) => (
                <WaterBodyCard key={wb.id} waterBody={wb} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WaterBodyList;
