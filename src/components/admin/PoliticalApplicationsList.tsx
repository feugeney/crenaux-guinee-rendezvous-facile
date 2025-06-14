
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PoliticalApplicationCard from './PoliticalApplicationCard';
import { Loader2 } from 'lucide-react';

interface PoliticalApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city_country: string;
  status: string;
  payment_option: string;
  format_preference: string;
  proposed_schedule?: any;
  created_at: string;
}

interface Props {
  showOnlyPending?: boolean;
  showOnlyValidated?: boolean;
}

const PoliticalApplicationsList: React.FC<Props> = ({ 
  showOnlyPending = false, 
  showOnlyValidated = false 
}) => {
  const [applications, setApplications] = useState<PoliticalApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [showOnlyPending, showOnlyValidated]);

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from('political_launch_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (showOnlyPending) {
        query = query.eq('status', 'pending');
      } else if (showOnlyValidated) {
        query = query.neq('status', 'pending').neq('status', 'rejected');
      }

      const { data, error } = await query;

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/admin/political-launch-schedule/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Chargement des candidatures...</span>
      </div>
    );
  }

  if (applications.length === 0) {
    const emptyMessage = showOnlyPending 
      ? "Aucune candidature en attente" 
      : showOnlyValidated 
      ? "Aucune candidature validée"
      : "Aucune candidature trouvée";

    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {showOnlyPending 
            ? `Candidatures en attente (${applications.length})` 
            : showOnlyValidated 
            ? `Candidatures validées (${applications.length})`
            : `Toutes les candidatures (${applications.length})`
          }
        </h3>
      </div>

      <div className="grid gap-6">
        {applications.map((application) => (
          <PoliticalApplicationCard
            key={application.id}
            application={application}
            showSchedule={showOnlyValidated}
            onViewDetails={showOnlyPending ? handleViewDetails : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default PoliticalApplicationsList;
