
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Calendar, Clock, CheckCircle, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PaidApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  professional_profile: string;
  city_country: string;
  preferred_topic: string;
  status: string;
  created_at: string;
  payment_option: string;
  start_period: string;
  proposed_schedule: any;
  payment_confirmed_at?: string;
  stripe_session_id?: string;
}

interface SessionSchedule {
  session_number: number;
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
  completed?: boolean;
  notes?: string;
}

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
      // Récupérer les candidatures validées (avec planning validé)
      const { data, error } = await supabase
        .from('political_launch_applications')
        .select('*')
        .eq('schedule_validated', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapper les données pour correspondre à notre interface
      const mappedData: PaidApplication[] = (data || []).map(app => ({
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
        payment_confirmed_at: app.created_at, // Utiliser created_at comme fallback
        stripe_session_id: app.stripe_session_id || undefined
      }));

      setPaidApplications(mappedData);
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures validées:', error);
      toast.error('Erreur lors du chargement des candidatures validées');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSessions = (application: PaidApplication) => {
    setSelectedApplication(application);
    if (application.proposed_schedule) {
      setSessions(application.proposed_schedule.sessions || []);
      setFollowUpSessions(application.proposed_schedule.followUpSessions || []);
    }
    setShowSessionDetails(true);
  };

  const updateSessionStatus = (index: number, completed: boolean, isFollowUp = false) => {
    if (isFollowUp) {
      setFollowUpSessions(prev => prev.map((session, i) => 
        i === index ? { ...session, completed } : session
      ));
    } else {
      setSessions(prev => prev.map((session, i) => 
        i === index ? { ...session, completed } : session
      ));
    }
  };

  const getCompletionPercentage = (application: PaidApplication) => {
    if (!application.proposed_schedule) return 0;
    
    const allSessions = [
      ...(application.proposed_schedule.sessions || []),
      ...(application.proposed_schedule.followUpSessions || [])
    ];
    
    const completedSessions = allSessions.filter(session => session.completed);
    return Math.round((completedSessions.length / allSessions.length) * 100);
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
    } else {
      return <Badge className="bg-purple-100 text-purple-800">Planning validé</Badge>;
    }
  };

  const getSessionStatusColor = (session: SessionSchedule) => {
    const now = new Date();
    const sessionDate = parseISO(session.date);
    
    if (isBefore(sessionDate, now)) {
      return 'bg-red-50 border-red-200'; // Sessions passées en rouge
    } else {
      return 'bg-green-50 border-green-200'; // Sessions à venir en vert
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

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total candidatures</p>
                <p className="text-2xl font-bold">{paidApplications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">En cours</p>
                <p className="text-2xl font-bold">
                  {paidApplications.filter(app => {
                    const percentage = getCompletionPercentage(app);
                    return percentage > 0 && percentage < 100;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Terminées</p>
                <p className="text-2xl font-bold">
                  {paidApplications.filter(app => getCompletionPercentage(app) === 100).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">En attente paiement</p>
                <p className="text-2xl font-bold">
                  {paidApplications.filter(app => app.status === 'payment_pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des candidatures validées */}
      <Card>
        <CardHeader>
          <CardTitle>Candidatures en suivi</CardTitle>
          <CardDescription>
            {paidApplications.length} candidature(s) avec planning validé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Profil</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paidApplications.map((application) => {
                const completionPercentage = getCompletionPercentage(application);
                return (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{application.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          {application.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          {application.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.professional_profile}</p>
                        <p className="text-sm text-gray-500">{application.city_country}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(application.created_at), 'PPP', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{completionPercentage}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(application)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSessions(application)}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Voir Séances
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de suivi des séances */}
      <Dialog open={showSessionDetails} onOpenChange={setShowSessionDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Suivi des séances - {selectedApplication?.full_name}</DialogTitle>
            <DialogDescription>
              Gérez et suivez l'évolution des séances (Rouge = passées, Vert = à venir)
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Informations candidat */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Candidat</p>
                      <p className="font-medium">{selectedApplication.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Profil</p>
                      <p className="font-medium">{selectedApplication.professional_profile}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Progression</p>
                      <p className="font-medium">{getCompletionPercentage(selectedApplication)}% terminé</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Séances intensives */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Séances intensives ({sessions.length} séances)
                  </h3>
                  <div className="space-y-3">
                    {sessions.map((session, index) => (
                      <Card key={index} className={`p-4 ${getSessionStatusColor(session)} ${session.completed ? 'ring-2 ring-blue-500' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">Séance {session.session_number}</span>
                              {session.completed && <CheckCircle className="h-4 w-4 text-blue-600" />}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{session.topic}</p>
                            <div className="text-xs text-gray-500">
                              {session.date ? format(new Date(session.date), 'PPP', { locale: fr }) : 'Date non définie'} • {session.start_time} - {session.end_time}
                            </div>
                          </div>
                          <Button
                            variant={session.completed ? "outline" : "default"}
                            size="sm"
                            onClick={() => updateSessionStatus(index, !session.completed)}
                          >
                            {session.completed ? 'Marquer non terminée' : 'Marquer terminée'}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Suivi post-coaching */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Suivi post-coaching ({followUpSessions.length} semaines)
                  </h3>
                  <div className="space-y-3">
                    {followUpSessions.map((session, index) => (
                      <Card key={index} className={`p-4 ${getSessionStatusColor(session)} ${session.completed ? 'ring-2 ring-blue-500' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">Semaine {session.session_number}</span>
                              {session.completed && <CheckCircle className="h-4 w-4 text-blue-600" />}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{session.topic}</p>
                            <div className="text-xs text-gray-500">
                              {session.date ? format(new Date(session.date), 'PPP', { locale: fr }) : 'Date non définie'} • {session.start_time} - {session.end_time}
                            </div>
                          </div>
                          <Button
                            variant={session.completed ? "outline" : "default"}
                            size="sm"
                            onClick={() => updateSessionStatus(index, !session.completed, true)}
                          >
                            {session.completed ? 'Marquer non terminée' : 'Marquer terminée'}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
