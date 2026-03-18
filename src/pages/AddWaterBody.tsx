import { Layout } from '@/components/Layout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWaterBodies } from '@/contexts/WaterBodyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { MAHARASHTRA_DISTRICTS } from '@/data/maharashtraData';
import { WaterBodyType, WaterBody, WATER_BODY_TYPES, WATER_BODY_TYPE_LABELS } from '@/types/waterBody';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const AddWaterBody = () => {
  const navigate = useNavigate();
  const { addWaterBody } = useWaterBodies();

  const [formData, setFormData] = useState<Partial<WaterBody>>({
    name: '',
    type: 'lake' as WaterBodyType,
    location: {
      district: '',
      taluka: '',
      village: '',
      address: '',
      latitude: 0,
      longitude: 0,
    },
    measurements: {
      date: new Date().toISOString().split('T')[0],
      pH: null,
      dissolvedOxygen: null,
      turbidity: null,
      temperature: null,
      conductivity: null,
      bod: null,
      cod: null,
      nitrates: null,
      phosphates: null,
      fecalColiform: null,
      heavyMetals: '',
    },
    observations: '',
    pollutionSources: [],
    reportedBy: {
      name: '',
      organization: '',
      contact: '',
    },
    photos: [],
    history: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location?.district) {
      toast.error('Please fill in all required fields');
      return;
    }

    await addWaterBody(formData as any);
    navigate('/list');
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Add New Water Body</h1>
          <p className="text-muted-foreground">Enter details about the water body and its health parameters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Powai Lake"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as WaterBodyType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="river">River</SelectItem>
                    <SelectItem value="lake">Lake</SelectItem>
                    <SelectItem value="pond">Pond</SelectItem>
                    <SelectItem value="reservoir">Reservoir</SelectItem>
                    <SelectItem value="wetland">Wetland</SelectItem>
                    <SelectItem value="stream">Stream</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Select
                  value={formData.location?.district}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, district: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAHARASHTRA_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taluka">Taluka</Label>
                <Input
                  id="taluka"
                  value={formData.location?.taluka}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, taluka: e.target.value }
                  })}
                  placeholder="e.g., Andheri"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={formData.location?.village}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, village: e.target.value }
                  })}
                  placeholder="e.g., Powai"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.location?.address}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, address: e.target.value }
                  })}
                  placeholder="Full address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  value={formData.location?.latitude}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, latitude: parseFloat(e.target.value) }
                  })}
                  placeholder="e.g., 19.1206"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  value={formData.location?.longitude}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, longitude: parseFloat(e.target.value) }
                  })}
                  placeholder="e.g., 72.9050"
                />
              </div>
            </div>
          </Card>

          {/* Water Quality Parameters */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Water Quality Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Measurement Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.measurements?.date}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, date: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pH">pH Level (0-14)</Label>
                <Input
                  id="pH"
                  type="number"
                  step="0.1"
                  value={formData.measurements?.pH || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, pH: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  placeholder="e.g., 7.2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dissolvedOxygen">Dissolved Oxygen (mg/L)</Label>
                <Input
                  id="dissolvedOxygen"
                  type="number"
                  step="0.1"
                  value={formData.measurements?.dissolvedOxygen || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, dissolvedOxygen: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  placeholder="e.g., 6.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turbidity">Turbidity (NTU)</Label>
                <Input
                  id="turbidity"
                  type="number"
                  value={formData.measurements?.turbidity || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, turbidity: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  placeholder="e.g., 25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={formData.measurements?.temperature || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, temperature: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  placeholder="e.g., 24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conductivity">Conductivity (µS/cm)</Label>
                <Input
                  id="conductivity"
                  type="number"
                  value={formData.measurements?.conductivity || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, conductivity: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  placeholder="e.g., 450"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bod">BOD (mg/L)</Label>
                <Input
                  id="bod"
                  type="number"
                  value={formData.measurements?.bod || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, bod: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  placeholder="e.g., 8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cod">COD (mg/L)</Label>
                <Input
                  id="cod"
                  type="number"
                  value={formData.measurements?.cod || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, cod: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  placeholder="e.g., 20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nitrates">Nitrates (mg/L)</Label>
                <Input
                  id="nitrates"
                  type="number"
                  step="0.1"
                  value={formData.measurements?.nitrates || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, nitrates: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  placeholder="e.g., 8.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phosphates">Phosphates (mg/L)</Label>
                <Input
                  id="phosphates"
                  type="number"
                  step="0.1"
                  value={formData.measurements?.phosphates || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, phosphates: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  placeholder="e.g., 1.2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecalColiform">Fecal Coliform (CFU/100mL)</Label>
                <Input
                  id="fecalColiform"
                  type="number"
                  value={formData.measurements?.fecalColiform || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, fecalColiform: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  placeholder="e.g., 850"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="heavyMetals">Heavy Metals</Label>
                <Input
                  id="heavyMetals"
                  value={formData.measurements?.heavyMetals}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    measurements: { ...formData.measurements!, heavyMetals: e.target.value }
                  })}
                  placeholder="e.g., None detected"
                />
              </div>
            </div>
          </Card>

          {/* Observations */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Observations & Notes</h2>
            <div className="space-y-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                placeholder="Describe any notable observations about the water body..."
                rows={4}
              />
            </div>
          </Card>

          {/* Reporter Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Reporter Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reporterName">Name *</Label>
                <Input
                  id="reporterName"
                  value={formData.reportedBy?.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    reportedBy: { ...formData.reportedBy!, name: e.target.value }
                  })}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={formData.reportedBy?.organization}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    reportedBy: { ...formData.reportedBy!, organization: e.target.value }
                  })}
                  placeholder="Organization name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  value={formData.reportedBy?.contact}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    reportedBy: { ...formData.reportedBy!, contact: e.target.value }
                  })}
                  placeholder="Email or phone"
                />
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" className="gap-2 bg-gradient-water">
              <Save className="h-4 w-4" />
              Save Water Body
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddWaterBody;
