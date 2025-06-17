
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PaidApplication, SessionSchedule } from './session-tracking/types';
import { SessionStatistics } from './session-tracking/SessionStatistics';
import { ApplicationsTable } from './session-tracking/ApplicationsTable';
import { SessionDetailsDialog } from './session-tracking/SessionDetailsDialog';
import { getCompletionPercentage } from './session-tracking/sessionUtils';

export const SessionTracking = () => {
  const [paidApplications, setPaidApplications] = useState<PaidApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<PaidApplication | null>(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [sessions, setSessions] = useState<SessionSchedule[]>([]);
  const [followUpSessions, setFollowUpSessions] = useState<SessionSchedule[]>([]);

  useEffect(() => {
    fetchPaidApplications();
  }, []);

  const fetchPaidApplications = async () => {
    try {
      console.log('Récupération des candidatures avec planning validé...');
      
      const { data, error } = await supabase
        .from('political_launch_applications')
        .select('*')
        .eq('schedule_validated', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Candidatures récupérées:', data);

      if (!data || data.length === 0) {
        console.log('Aucune candidature avec planning validé trouvée');
        setPaidApplications([]);
        return;
      }

      const mappedData: PaidApplication[] = data.map(app => ({
        id: app.id,
        full_name: app.full_name,
        email: app.email,
        phone: app.phone,
        professional_profile: app.professional_profile,
        city_country: app.city_country,
        preferred_topic: app.preferred_topic,
        status: app.status,
        created_at: app.created_at,
        payment_option: app.payment_option,
        start_period: app.start_period,
        proposed_schedule: app.proposed_schedule,
        schedule_validated: app.schedule_validated,
        payment_link: app.payment_link || undefined
      }));

      console.log('Candidatures mappées:', mappedData);
      setPaidApplications(mappedData);
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures validées:', error);
      toast.error('Erreur lors du chargement des candidatures validées');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSessions = (application: PaidApplication) => {
    console.log('Visualisation des séances pour:', application.full_name);
    console.log('Planning proposé:', application.proposed_schedule);
    
    setSelectedApplication(application);
    if (application.proposed_schedule) {
      setSessions(application.proposed_schedule.sessions || []);
      setFollowUpSessions(application.proposed_schedule.followUpSessions || []);
    } else {
      setSessions([]);
      setFollowUpSessions([]);
    }
    setShowSessionDetails(true);
  };

  const updateSessionStatus = async (sessionIndex: number, completed: boolean, isFollowUp = false) => {
    if (!selectedApplication) return;

    try {
      const updatedSchedule = { ...selectedApplication.proposed_schedule };
      
      if (isFollowUp) {
        updatedSchedule.followUpSessions[sessionIndex].completed = completed;
        setFollowUpSessions(prev => prev.map((session, i) => 
          i === sessionIndex ? { ...session, completed } : session
        ));
      } else {
        updatedSchedule.sessions[sessionIndex].completed = completed;
        setSessions(prev => prev.map((session, i) => 
          i === sessionIndex ? { ...session, completed } : session
        ));
      }

      const { error } = await supabase
        .from('political_launch_applications')
        .update({ proposed_schedule: updatedSchedule })
        .eq('id', selectedApplication.id);

      if (error) throw error;

      setPaidApplications(prev => prev.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, proposed_schedule: updatedSchedule }
          : app
      ));

      setSelectedApplication(prev => prev ? { ...prev, proposed_schedule: updatedSchedule } : null);
      
      toast.success('Statut de la séance mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadge = (application: PaidApplication) => {
    if (application.status === 'paid') {
      const percentage = getCompletionPercentage(application);
      if (percentage === 100) {
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      } else if (percentage > 0) {
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      } else {
        return <Badge className="bg-gray-100 text-gray-800">À commencer</Badge>;
      }
    } else if (application.status === 'payment_pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">En attente de paiement</Badge>;
    } else if (application.status === 'approved') {
      return <Badge className="bg-purple-100 text-purple-800">Planning validé</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">{application.status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Suivi des Séances</h2>
          <p className="text-muted-foreground">Suivez l'évolution des candidatures validées</p>
        </div>
      </div>

      <SessionStatistics 
        applications={paidApplications}
        getCompletionPercentage={getCompletionPercentage}
      />

      <ApplicationsTable
        applications={paidApplications}
        getCompletionPercentage={getCompletionPercentage}
        getStatusBadge={getStatusBadge}
        onViewSessions={handleViewSessions}
      />

      <SessionDetailsDialog
        open={showSessionDetails}
        onOpenChange={setShowSessionDetails}
        application={selectedApplication}
        sessions={sessions}
        followUpSessions={followUpSessions}
        getStatusBadge={getStatusBadge}
        getCompletionPercentage={getCompletionPercentage}
        updateSessionStatus={updateSessionStatus}
      />
    </div>
  );
};
