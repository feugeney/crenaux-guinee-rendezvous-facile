
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export const useActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (limit = 50) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: any
  ) => {
    try {
      await supabase.rpc('log_activity', {
        action_name: action,
        resource_type_param: resourceType,
        resource_id_param: resourceId,
        details_param: details
      });
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'activité:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    error,
    logActivity,
    refetch: fetchLogs
  };
};
