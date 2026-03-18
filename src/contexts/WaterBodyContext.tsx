import React, { createContext, useContext, useEffect, useState } from 'react';
import { WaterBody, DashboardStats } from '@/types/waterBody';
import { calculateHealthScore, getHealthStatus } from '@/utils/healthScore';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface WaterBodyContextType {
  waterBodies: WaterBody[];
  stats: DashboardStats;
  user: User | null;
  loading: boolean;
  addWaterBody: (waterBody: Omit<WaterBody, 'id' | 'healthScore' | 'healthStatus' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWaterBody: (id: string, waterBody: Partial<WaterBody>) => Promise<void>;
  deleteWaterBody: (id: string) => Promise<void>;
  getWaterBodyById: (id: string) => WaterBody | undefined;
  signOut: () => Promise<void>;
}

const WaterBodyContext = createContext<WaterBodyContextType | undefined>(undefined);

export const WaterBodyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [waterBodies, setWaterBodies] = useState<WaterBody[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setTimeout(() => {
        fetchWaterBodies();
      }, 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      fetchWaterBodies();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchWaterBodies = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('water_bodies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data as any)?.map((wb: any) => ({
        id: wb.id,
        name: wb.name,
        type: wb.type as WaterBody['type'],
        location: wb.location as any as WaterBody['location'],
        capacity: wb.capacity || undefined,
        currentLevel: wb.current_level || undefined,
        measurements: wb.measurements as any as WaterBody['measurements'],
        healthScore: wb.health_score,
        healthStatus: wb.health_status as WaterBody['healthStatus'],
        images: wb.images || [],
        notes: wb.notes || undefined,
        photos: [],
        observations: wb.notes || undefined,
        pollutionSources: [],
        reportedBy: { name: '', organization: 'Community Monitoring', contact: '' },
        history: [],
        createdAt: wb.created_at,
        updatedAt: wb.updated_at,
      })) || [];

      setWaterBodies(mapped);
    } catch (error: any) {
      toast.error('Failed to fetch water bodies');
      console.error('Error fetching water bodies:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWaterBody = async (waterBody: Omit<WaterBody, 'id' | 'healthScore' | 'healthStatus' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('You must be signed in to add water bodies');
      return;
    }

    const healthScore = calculateHealthScore(waterBody.measurements);
    const healthStatus = getHealthStatus(healthScore);

    try {
      const { error } = await (supabase as any)
        .from('water_bodies')
        .insert([{
          user_id: user.id,
          name: waterBody.name,
          type: waterBody.type,
          location: waterBody.location as any,
          capacity: waterBody.capacity || null,
          current_level: waterBody.currentLevel || null,
          measurements: waterBody.measurements as any,
          health_score: healthScore,
          health_status: healthStatus,
          images: waterBody.images || [],
          notes: waterBody.notes || waterBody.observations || null,
        }]);

      if (error) throw error;

      await fetchWaterBodies();
      toast.success('Water body added successfully!');
    } catch (error: any) {
      toast.error('Failed to add water body');
      console.error('Error adding water body:', error);
    }
  };

  const updateWaterBody = async (id: string, updates: Partial<WaterBody>) => {
    if (!user) {
      toast.error('You must be signed in to update water bodies');
      return;
    }

    try {
      const dbUpdates: any = {};
      
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.location !== undefined) dbUpdates.location = updates.location as any;
      if (updates.capacity !== undefined) dbUpdates.capacity = updates.capacity;
      if (updates.currentLevel !== undefined) dbUpdates.current_level = updates.currentLevel;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.observations !== undefined) dbUpdates.notes = updates.observations;
      
      if (updates.measurements) {
        dbUpdates.measurements = updates.measurements as any;
        dbUpdates.health_score = calculateHealthScore(updates.measurements);
        dbUpdates.health_status = getHealthStatus(dbUpdates.health_score);
      }

      const { error } = await (supabase as any)
        .from('water_bodies')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      await fetchWaterBodies();
      toast.success('Water body updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update water body');
      console.error('Error updating water body:', error);
    }
  };

  const deleteWaterBody = async (id: string) => {
    if (!user) {
      toast.error('You must be signed in to delete water bodies');
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('water_bodies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchWaterBodies();
      toast.success('Water body deleted successfully!');
    } catch (error: any) {
      toast.error('Failed to delete water body');
      console.error('Error deleting water body:', error);
    }
  };

  const getWaterBodyById = (id: string) => {
    return waterBodies.find(wb => wb.id === id);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    setUser(null);
    await fetchWaterBodies();
    toast.success('Signed out successfully');
  };

  const stats: DashboardStats = React.useMemo(() => {
    const totalWaterBodies = waterBodies.length;
    const averageHealthScore = waterBodies.length > 0
      ? Math.round(waterBodies.reduce((sum, wb) => sum + wb.healthScore, 0) / waterBodies.length)
      : 0;
    
    const criticalAlerts = waterBodies.filter(wb => wb.healthStatus === 'critical').length;

    const byStatus = waterBodies.reduce((acc, wb) => {
      acc[wb.healthStatus] = (acc[wb.healthStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byType = waterBodies.reduce((acc, wb) => {
      acc[wb.type] = (acc[wb.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byDistrict = waterBodies.reduce((acc, wb) => {
      acc[wb.location.district] = (acc[wb.location.district] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalWaterBodies,
      averageHealthScore,
      criticalAlerts,
      byStatus: byStatus as any,
      byType: byType as any,
      byDistrict,
    };
  }, [waterBodies]);

  return (
    <WaterBodyContext.Provider value={{
      waterBodies,
      stats,
      user,
      loading,
      addWaterBody,
      updateWaterBody,
      deleteWaterBody,
      getWaterBodyById,
      signOut,
    }}>
      {children}
    </WaterBodyContext.Provider>
  );
};

export const useWaterBodies = () => {
  const context = useContext(WaterBodyContext);
  if (!context) {
    throw new Error('useWaterBodies must be used within WaterBodyProvider');
  }
  return context;
};
