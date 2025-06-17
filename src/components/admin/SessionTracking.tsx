
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, CheckCircle, User, PlayCircle, PauseCircle, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PaidApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  professional_profile: string;
  status: string;
  payment_confirmed_at: string;
  proposed_schedule: {
    sessions: Array<{
      session_number: number;
      date: string;
      start_time: string;
      end_time: string;
      topic: string;
      completed?: boolean;
      notes?: string;
    }>;
    followUpSessions: Array<{
      session_number: number;
      date: string;
      start_time: string;
      end_time: string;
      topic: string;
      completed?: boolean;
      notes?: string;
    }>;
  };
}

export const SessionTracking = () => {
  const [applications, setApplications] = useState<PaidApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<PaidApplication | null>(null);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionType, setSessionType] = useState<'main' | 'followup'>('main');

  useEffect(() => {
    fetchPaidApplications();
  }, []);

  const fetchPaidApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('political_launch_applications')
        .select('*')
        .eq('status', 'paid')
        .order('payment_confirmed_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures payées:', error);
      toast.error('Erreur lors du chargement des candidatures payées');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionComplete = (application: PaidApplication, session: any, type: 'main' | 'followup') => {
    setSelectedApplication(application);
    setSelectedSession(session);
    setSessionType(type);
    setSessionNotes(session.notes || '');
    setShowSessionDialog(true);
  };

  const saveSessionCompletion = async () => {
    if (!selectedApplication || !selectedSession) return;

    try {
      const updatedSchedule = { ...selectedApplication.proposed_schedule };
      
      if (sessionType === 'main') {
        const sessionIndex = updatedSchedule.sessions.findIndex(
          s => s.session_number === selectedSession.session_number
        );
        if (sessionIndex !== -1) {
          updatedSchedule.sessions[sessionIndex] = {
            ...updatedSchedule.sessions[sessionIndex],
            completed: true,
            notes: sessionNotes
          };
        }
      } else {
        const sessionIndex = updatedSchedule.followUpSessions.findIndex(
          s => s.session_number === selectedSession.session_number
        );
        if (sessionIndex !== -1) {
          updatedSchedule.followUpSessions[sessionIndex] = {
            ...updatedSchedule.followUpSessions[sessionIndex],
            completed: true,
            notes: sessionNotes
          };
        }
      }

      const { error } = await supabase
        .from('political_launch_applications')
        .update({
          proposed_schedule: updatedSchedule,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedApplication.id);

      if (error) throw error;

      toast.success('Séance marquée comme terminée');
      setShowSessionDialog(false);
      fetchPaidApplications();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const getSessionStatus = (session: any) => {
    if (session.completed) {
      return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
    }
    
    const sessionDate = new Date(session.date);
    const now = new Date();
    
    if (sessionDate < now) {
      return <Badge variant="destructive">En retard</Badge>;
    } else if (sessionDate.toDateString() === now.toDateString()) {
      return <Badge className="bg-orange-100 text-orange-800">Aujourd'hui</Badge>;
    } else {
      return <Badge variant="secondary">Planifiée</Badge>;
    }
  };

  const getApplicationProgress = (application: PaidApplication) => {
    if (!application.proposed_schedule) return { completed: 0, total: 0, percentage: 0 };
    
    const mainSessions = application.proposed_schedule.sessions || [];
    const followUpSessions = application.proposed_schedule.followUpSessions || [];
    
    const completedMain = mainSessions.filter(s => s.completed).length;
    const completedFollowUp = followUpSessions.filter(s => s.completed).length;
    
    const totalCompleted = completedMain + completedFollowUp;
    const totalSessions = mainSessions.length + followUpSessions.length;
    
    return {
      completed: totalCompleted,
      total: totalSessions,
      percentage: totalSessions > 0 ? Math.round((totalCompleted / totalSessions) * 100) : 0
    };
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Suivi des Séances</h2>
          <p className="text-muted-foreground">Gérez l'évolution des candidatures payées</p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Candidatures payées</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Séances en cours</p>
                <p className="text-2xl font-bold">
                  {applications.filter(app => {
                    const progress = getApplicationProgress(app);
                    return progress.completed < progress.total;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Programmes terminés</p>
                <p className="text-2xl font-bold">
                  {applications.filter(app => {
                    const progress = getApplicationProgress(app);
                    return progress.completed === progress.total && progress.total > 0;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des candidatures */}
      <Card>
        <CardHeader>
          <CardTitle>Candidatures en suivi</CardTitle>
          <CardDescription>
            {applications.length} candidature(s) payée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((application) => {
              const progress = getApplicationProgress(application);
              return (
                <Card key={application.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{application.full_name}</h3>
                        <p className="text-sm text-gray-500">{application.professional_profile}</p>
                        <p className="text-sm text-gray-500">
                          Payé le {format(new Date(application.payment_confirmed_at), 'PPP', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Progression: {progress.completed}/{progress.total} ({progress.percentage}%)
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {application.proposed_schedule && (
                    <div className="space-y-4">
                      {/* Séances principales */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <PlayCircle className="h-4 w-4" />
                          Séances intensives (6 séances)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {application.proposed_schedule.sessions?.map((session, index) => (
                            <div key={index} className="border rounded-lg p-3 bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Séance {session.session_number}</span>
                                {getSessionStatus(session)}
                              </div>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(session.date), 'PPP', { locale: fr })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {session.start_time} - {session.end_time}
                                </div>
                              </div>
                              {!session.completed && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full mt-2"
                                  onClick={() => handleSessionComplete(application, session, 'main')}
                                >
                                  Marquer terminée
                                </Button>
                              )}
                              {session.completed && session.notes && (
                                <div className="mt-2 p-2 bg-white rounded border">
                                  <div className="flex items-center gap-1 mb-1">
                                    <FileText className="h-3 w-3" />
                                    <span className="text-xs font-medium">Notes:</span>
                                  </div>
                                  <p className="text-xs text-gray-600">{session.notes}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Séances de suivi */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <PauseCircle className="h-4 w-4" />
                          Suivi post-coaching (2 semaines)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {application.proposed_schedule.followUpSessions?.map((session, index) => (
                            <div key={index} className="border rounded-lg p-3 bg-blue-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Suivi {session.session_number}</span>
                                {getSessionStatus(session)}
                              </div>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(session.date), 'PPP', { locale: fr })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {session.start_time} - {session.end_time}
                                </div>
                              </div>
                              {!session.completed && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full mt-2"
                                  onClick={() => handleSessionComplete(application, session, 'followup')}
                                >
                                  Marquer terminée
                                </Button>
                              )}
                              {session.completed && session.notes && (
                                <div className="mt-2 p-2 bg-white rounded border">
                                  <div className="flex items-center gap-1 mb-1">
                                    <FileText className="h-3 w-3" />
                                    <span className="text-xs font-medium">Notes:</span>
                                  </div>
                                  <p className="text-xs text-gray-600">{session.notes}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour marquer une séance comme terminée */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marquer la séance comme terminée</DialogTitle>
            <DialogDescription>
              {selectedSession && (
                <>
                  {sessionType === 'main' ? 'Séance intensive' : 'Suivi'} {selectedSession.session_number} - {selectedApplication?.full_name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes de séance (optionnel)</Label>
              <Textarea
                id="notes"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Ajoutez des notes sur cette séance..."
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={saveSessionCompletion} className="flex-1">
              Marquer comme terminée
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowSessionDialog(false)}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
