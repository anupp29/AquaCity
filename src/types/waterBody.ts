export const WATER_BODY_TYPES = ['river', 'lake', 'pond', 'reservoir', 'well'] as const;

export type WaterBodyType = (typeof WATER_BODY_TYPES)[number];

export const WATER_BODY_TYPE_LABELS: Record<WaterBodyType, string> = {
  river: 'River',
  lake: 'Lake',
  pond: 'Pond',
  reservoir: 'Reservoir',
  well: 'Well',
};

export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface Location {
  district: string;
  taluka: string;
  village: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Measurements {
  date: string;
  pH: number | null;
  dissolvedOxygen: number | null;
  turbidity: number | null;
  temperature: number | null;
  conductivity: number | null;
  bod: number | null;
  cod: number | null;
  nitrates: number | null;
  phosphates: number | null;
  fecalColiform: number | null;
  heavyMetals: string;
  customParams?: Record<string, any>;
}

export interface Photo {
  url: string;
  caption: string;
  date: string;
}

export interface ReportedBy {
  name: string;
  organization: string;
  contact: string;
}

export interface HistoryEntry {
  date: string;
  measurements: Measurements;
  healthScore: number;
}

export interface WaterBody {
  id: string;
  name: string;
  type: WaterBodyType;
  location: Location;
  capacity?: number;
  currentLevel?: number;
  measurements: Measurements;
  photos?: Photo[];
  images?: string[];
  observations?: string;
  notes?: string;
  healthScore: number;
  healthStatus: HealthStatus;
  pollutionSources?: string[];
  reportedBy?: ReportedBy;
  history?: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalWaterBodies: number;
  averageHealthScore: number;
  criticalAlerts: number;
  byStatus: Record<HealthStatus, number>;
  byType: Record<WaterBodyType, number>;
  byDistrict: Record<string, number>;
}
