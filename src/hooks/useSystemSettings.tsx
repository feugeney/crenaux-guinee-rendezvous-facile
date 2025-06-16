
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);

      if (error) throw error;
      
      // Log the activity
      await supabase.rpc('log_activity', {
        action_name: 'update_system_setting',
        resource_type_param: 'system_settings',
        resource_id_param: key,
        details_param: { key, new_value: value }
      });

      await fetchSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSetting,
    refetch: fetchSettings
  };
};
