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
    location: { district: '', taluka: '', village: '', address: '', latitude: 0, longitude: 0 },
    measurements: {
      date: new Date().toISOString().split('T')[0],
      pH: null, dissolvedOxygen: null, turbidity: null, temperature: null,
      conductivity: null, bod: null, cod: null, nitrates: null,
      phosphates: null, fecalColiform: null, heavyMetals: '',
    },
    observations: '',
    pollutionSources: [],
    reportedBy: { name: '', organization: '', contact: '' },
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
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-foreground mb-1 tracking-tight">Add Water Body Record</h1>
          <p className="text-muted-foreground">Submit a field record aligned with CPCB monitoring standards for SDG 11 urban water tracking.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Powai Lake" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as WaterBodyType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WATER_BODY_TYPES.map((t) => <SelectItem key={t} value={t}>{WATER_BODY_TYPE_LABELS[t]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>District *</Label>
                <Select value={formData.location?.district} onValueChange={(v) => setFormData({ ...formData, location: { ...formData.location!, district: v } })}>
                  <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                  <SelectContent>{MAHARASHTRA_DISTRICTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Taluka</Label>
                <Input value={formData.location?.taluka} onChange={(e) => setFormData({ ...formData, location: { ...formData.location!, taluka: e.target.value } })} placeholder="e.g., Andheri" />
              </div>
              <div className="space-y-2">
                <Label>Village</Label>
                <Input value={formData.location?.village} onChange={(e) => setFormData({ ...formData, location: { ...formData.location!, village: e.target.value } })} placeholder="e.g., Powai" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={formData.location?.address} onChange={(e) => setFormData({ ...formData, location: { ...formData.location!, address: e.target.value } })} placeholder="Full address" />
              </div>
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input type="number" step="0.0001" value={formData.location?.latitude} onChange={(e) => setFormData({ ...formData, location: { ...formData.location!, latitude: parseFloat(e.target.value) } })} />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input type="number" step="0.0001" value={formData.location?.longitude} onChange={(e) => setFormData({ ...formData, location: { ...formData.location!, longitude: parseFloat(e.target.value) } })} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Water Quality Parameters</h2>
            <p className="text-xs text-muted-foreground mb-4">Per CPCB designated best use criteria & IS 10500 drinking water standards</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Measurement Date</Label>
                <Input type="date" value={formData.measurements?.date} onChange={(e) => setFormData({ ...formData, measurements: { ...formData.measurements!, date: e.target.value } })} />
              </div>
              {[
                { key: 'pH', label: 'pH Level (0-14)', step: '0.1', ph: '7.2' },
                { key: 'dissolvedOxygen', label: 'Dissolved Oxygen (mg/L)', step: '0.1', ph: '6.5' },
                { key: 'turbidity', label: 'Turbidity (NTU)', step: '1', ph: '25' },
                { key: 'temperature', label: 'Temperature (°C)', step: '1', ph: '24' },
                { key: 'conductivity', label: 'Conductivity (µS/cm)', step: '1', ph: '450' },
                { key: 'bod', label: 'BOD (mg/L)', step: '1', ph: '8' },
                { key: 'cod', label: 'COD (mg/L)', step: '1', ph: '20' },
                { key: 'nitrates', label: 'Nitrates (mg/L)', step: '0.1', ph: '8.5' },
                { key: 'phosphates', label: 'Phosphates (mg/L)', step: '0.1', ph: '1.2' },
                { key: 'fecalColiform', label: 'Fecal Coliform (CFU/100mL)', step: '1', ph: '850' },
              ].map(({ key, label, step, ph }) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <Input type="number" step={step}
                    value={(formData.measurements as any)?.[key] || ''}
                    onChange={(e) => setFormData({ ...formData, measurements: { ...formData.measurements!, [key]: e.target.value ? parseFloat(e.target.value) : null } })}
                    placeholder={`e.g., ${ph}`} />
                </div>
              ))}
              <div className="space-y-2 md:col-span-2">
                <Label>Heavy Metals</Label>
                <Input value={formData.measurements?.heavyMetals} onChange={(e) => setFormData({ ...formData, measurements: { ...formData.measurements!, heavyMetals: e.target.value } })} placeholder="e.g., None detected" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Observations & Notes</h2>
            <Textarea value={formData.observations} onChange={(e) => setFormData({ ...formData, observations: e.target.value })} placeholder="Describe notable observations about the water body..." rows={4} />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Reporter Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={formData.reportedBy?.name} onChange={(e) => setFormData({ ...formData, reportedBy: { ...formData.reportedBy!, name: e.target.value } })} placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <Label>Organization</Label>
                <Input value={formData.reportedBy?.organization} onChange={(e) => setFormData({ ...formData, reportedBy: { ...formData.reportedBy!, organization: e.target.value } })} placeholder="Organization name" />
              </div>
              <div className="space-y-2">
                <Label>Contact</Label>
                <Input value={formData.reportedBy?.contact} onChange={(e) => setFormData({ ...formData, reportedBy: { ...formData.reportedBy!, contact: e.target.value } })} placeholder="Email or phone" />
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="gap-2 bg-gradient-water">
              <Save className="h-4 w-4" /> Save Water Body
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddWaterBody;
