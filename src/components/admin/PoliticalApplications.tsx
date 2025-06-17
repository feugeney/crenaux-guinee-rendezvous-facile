
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, Eye, CheckCircle, XCircle, Clock, Calendar, Plus, Trash2, CreditCard, Briefcase, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DatePicker } from '@/components/ui/date-picker';

interface PoliticalApplication {
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
  why_collaboration: string;
  desired_transformation: string;
  proposed_schedule?: any;
  schedule_validated?: boolean;
  payment_confirmed_at?: string;
  payment_link?: string;
  stripe_session_id?: string;
}

interface SessionSchedule {
  session_number: number;
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
}

interface NewTimeSlot {
  date?: Date;
  start_time: string;
  end_time: string;
}

export const PoliticalApplications = () => {
  const [applications, setApplications] = useState<PoliticalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<PoliticalApplication | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showPlanningView, setShowPlanningView] = useState(false);
  const [sessions, setSessions] = useState<SessionSchedule[]>([]);
  const [followUpSessions, setFollowUpSessions] = useState<SessionSchedule[]>([]);
  const [processing, setProcessing] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState<NewTimeSlot>({
    start_time: '',
    end_time: ''
  });
  const [showNewSlotForm, setShowNewSlotForm] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('political_launch_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
      toast.error('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const initializeSchedule = () => {
    // Initialiser 6 séances intensives
    const mainSessions = Array.from({ length: 6 }, (_, i) => ({
      session_number: i + 1,
      date: '',
      start_time: '10:00',
      end_time: '11:30',
      topic: `Séance intensive ${i + 1} - Formation politique approfondie`
    }));

    // Initialiser 2 semaines de suivi post-coaching
    const followUp = Array.from({ length: 2 }, (_, i) => ({
      session_number: i + 1,
      date: '',
      start_time: '10:00',
      end_time: '11:00',
      topic: `Suivi post-coaching semaine ${i + 1} - Accompagnement continu`
    }));

    setSessions(mainSessions);
    setFollowUpSessions(followUp);
  };

  const handleApproveWithSchedule = (application: PoliticalApplication) => {
    setSelectedApplication(application);
    initializeSchedule();
    setShowScheduleDialog(true);
  };

  const handleViewPlanning = (application: PoliticalApplication) => {
    setSelectedApplication(application);
    if (application.proposed_schedule) {
      setSessions(application.proposed_schedule.sessions || []);
      setFollowUpSessions(application.proposed_schedule.followUpSessions || []);
    }
    setShowPlanningView(true);
  };

  const updateSession = (index: number, field: keyof SessionSchedule, value: string, isFollowUp = false) => {
    if (isFollowUp) {
      setFollowUpSessions(prev => prev.map((session, i) => 
        i === index ? { ...session, [field]: value } : session
      ));
    } else {
      setSessions(prev => prev.map((session, i) => 
        i === index ? { ...session, [field]: value } : session
      ));
    }
  };

  const handleFinalApproval = async () => {
    if (!selectedApplication) return;

    // Vérifier que toutes les séances ont une date
    const allSessionsComplete = sessions.every(s => s.date) && followUpSessions.every(s => s.date);
    if (!allSessionsComplete) {
      toast.error('Veuillez compléter toutes les dates des séances');
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('approve-political-application', {
        body: {
          applicationId: selectedApplication.id,
          proposedSchedule: {
            sessions,
            followUpSessions
          }
        }
      });

      if (error) throw error;

      toast.success('Candidature approuvée et email envoyé avec succès');
      setShowScheduleDialog(false);
      setSelectedApplication(null);
      fetchApplications();
    } catch (error: any) {
      console.error('Erreur lors de l\'approbation:', error);
      toast.error('Erreur lors de l\'approbation: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddTimeSlot = () => {
    if (!newTimeSlot.date || !newTimeSlot.start_time || !newTimeSlot.end_time) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const newSession: SessionSchedule = {
      session_number: sessions.length + followUpSessions.length + 1,
      date: format(newTimeSlot.date, 'yyyy-MM-dd'),
      start_time: newTimeSlot.start_time,
      end_time: newTimeSlot.end_time,
      topic: 'Nouveau créneau'
    };

    setSessions(prev => [...prev, newSession]);
    setNewTimeSlot({ start_time: '', end_time: '' });
    setShowNewSlotForm(false);
    toast.success('Nouveau créneau ajouté');
  };

  const getPaymentAmount = (application: PoliticalApplication) => {
    return application.payment_option === 'full' ? '600 USD' : '250 USD/mois';
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('political_launch_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast.success('Statut mis à jour');
      fetchApplications();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-800">Payé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredApplications = applications.filter(app => {
    return filter === 'all' || app.status === filter;
  });

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Validation des Candidatures</h2>
          <p className="text-muted-foreground">Gérez les candidatures au programme politique</p>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les candidatures</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="paid">Payées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">En attente</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Approuvées</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Attente paiement</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'approved' && a.schedule_validated && !a.payment_confirmed_at).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Payées</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'paid').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Rejetées</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'rejected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des candidatures */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des candidatures</CardTitle>
          <CardDescription>
            {filteredApplications.length} candidature(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Profil</TableHead>
                <TableHead>Sujet d'intérêt</TableHead>
                <TableHead>Date de candidature</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
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
                    <p className="max-w-xs truncate">{application.preferred_topic}</p>
                  </TableCell>
                  <TableCell>
                    {format(new Date(application.created_at), 'PPP', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(application.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      {application.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveWithSchedule(application)}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Approuver & Planifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(application.id, 'rejected')}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      {(application.status === 'approved' || application.status === 'paid') && application.schedule_validated && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPlanning(application)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Voir Planning
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de vue du planning */}
      <Dialog open={showPlanningView} onOpenChange={setShowPlanningView}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Planning - {selectedApplication?.full_name}</DialogTitle>
            <DialogDescription>
              Planning des séances approuvées
            </DialogDescription>
          </DialogHeader>
          
          {/* Informations de la candidature */}
          {selectedApplication && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations de la candidature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium">{selectedApplication.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Fonction</p>
                      <p className="font-medium">{selectedApplication.professional_profile}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Montant à payer</p>
                      <p className="font-medium text-green-600">{getPaymentAmount(selectedApplication)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Statut du paiement et lien */}
                {selectedApplication.status === 'approved' && !selectedApplication.payment_confirmed_at && selectedApplication.payment_link && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">En attente de paiement</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-blue-600" />
                      <a href={selectedApplication.payment_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Lien de paiement envoyé au client
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedApplication.status === 'paid' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Paiement confirmé</span>
                    </div>
                    {selectedApplication.payment_confirmed_at && (
                      <p className="text-sm text-green-600 mt-1">
                        Payé le {format(new Date(selectedApplication.payment_confirmed_at), 'PPP', { locale: fr })}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Séances intensives */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Séances intensives ({sessions.length} séances)
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNewSlotForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau créneau
                </Button>
              </div>
              
              {/* Formulaire nouveau créneau */}
              {showNewSlotForm && (
                <Card className="mb-4 p-4 border-blue-200">
                  <h4 className="font-medium mb-3">Nouveau créneau</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Date</Label>
                      <DatePicker 
                        date={newTimeSlot.date}
                        setDate={(date) => setNewTimeSlot(prev => ({ ...prev, date }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Heure de début</Label>
                        <Input
                          type="time"
                          value={newTimeSlot.start_time}
                          onChange={(e) => setNewTimeSlot(prev => ({ ...prev, start_time: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Heure de fin</Label>
                        <Input
                          type="time"
                          value={newTimeSlot.end_time}
                          onChange={(e) => setNewTimeSlot(prev => ({ ...prev, end_time: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddTimeSlot}>
                        Créer
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setShowNewSlotForm(false);
                          setNewTimeSlot({ start_time: '', end_time: '' });
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              
              <div className="space-y-4">
                {sessions.map((session, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <Label>Séance {session.session_number}</Label>
                        <p className="text-sm text-gray-600">{session.topic}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <strong>Date:</strong> {session.date ? format(new Date(session.date), 'PPP', { locale: fr }) : 'Non définie'}
                        </div>
                        <div>
                          <strong>Début:</strong> {session.start_time}
                        </div>
                        <div>
                          <strong>Fin:</strong> {session.end_time}
                        </div>
                      </div>
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
              <div className="space-y-4">
                {followUpSessions.map((session, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <Label>Semaine {session.session_number}</Label>
                        <p className="text-sm text-gray-600">{session.topic}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <strong>Date:</strong> {session.date ? format(new Date(session.date), 'PPP', { locale: fr }) : 'Non définie'}
                        </div>
                        <div>
                          <strong>Début:</strong> {session.start_time}
                        </div>
                        <div>
                          <strong>Fin:</strong> {session.end_time}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowPlanningView(false)}
              className="flex-1"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de planification - gardé inchangé */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Planification - {selectedApplication?.full_name}</DialogTitle>
            <DialogDescription>
              Définissez le planning des 6 séances intensives et des 2 semaines de suivi post-coaching
            </DialogDescription>
          </DialogHeader>
          
          {/* Informations de la candidature */}
          {selectedApplication && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations de la candidature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium">{selectedApplication.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Fonction</p>
                      <p className="font-medium">{selectedApplication.professional_profile}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Montant à payer</p>
                      <p className="font-medium text-green-600">{getPaymentAmount(selectedApplication)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Option de paiement</p>
                    <p className="font-medium">
                      {selectedApplication.payment_option === 'full' ? 'Paiement complet' : 'Paiement mensuel'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Période de début souhaitée</p>
                    <p className="font-medium">{selectedApplication.start_period}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Séances intensives */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Séances intensives (6 séances)
              </h3>
              <div className="space-y-4">
                {sessions.map((session, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={session.date}
                          onChange={(e) => updateSession(index, 'date', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Sujet</Label>
                        <Input
                          value={session.topic}
                          onChange={(e) => updateSession(index, 'topic', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Heure début</Label>
                        <Input
                          type="time"
                          value={session.start_time}
                          onChange={(e) => updateSession(index, 'start_time', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Heure fin</Label>
                        <Input
                          type="time"
                          value={session.end_time}
                          onChange={(e) => updateSession(index, 'end_time', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Suivi post-coaching */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Suivi post-coaching (2 semaines)
              </h3>
              <div className="space-y-4">
                {followUpSessions.map((session, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={session.date}
                          onChange={(e) => updateSession(index, 'date', e.target.value, true)}
                        />
                      </div>
                      <div>
                        <Label>Sujet</Label>
                        <Input
                          value={session.topic}
                          onChange={(e) => updateSession(index, 'topic', e.target.value, true)}
                        />
                      </div>
                      <div>
                        <Label>Heure début</Label>
                        <Input
                          type="time"
                          value={session.start_time}
                          onChange={(e) => updateSession(index, 'start_time', e.target.value, true)}
                        />
                      </div>
                      <div>
                        <Label>Heure fin</Label>
                        <Input
                          type="time"
                          value={session.end_time}
                          onChange={(e) => updateSession(index, 'end_time', e.target.value, true)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button 
              onClick={handleFinalApproval} 
              disabled={processing}
              className="flex-1"
            >
              {processing ? 'Traitement...' : 'Approuver et Envoyer le Lien de Paiement'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowScheduleDialog(false)}
              disabled={processing}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog des détails - gardé inchangé */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la candidature</DialogTitle>
            <DialogDescription>
              Candidature de {selectedApplication?.full_name}
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Informations personnelles</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Nom:</strong> {selectedApplication.full_name}</p>
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    <p><strong>Téléphone:</strong> {selectedApplication.phone}</p>
                    <p><strong>Ville/Pays:</strong> {selectedApplication.city_country}</p>
                    <p><strong>Profil professionnel:</strong> {selectedApplication.professional_profile}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Préférences</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Option de paiement:</strong> {selectedApplication.payment_option}</p>
                    <p><strong>Période de début:</strong> {selectedApplication.start_period}</p>
                    <p><strong>Sujet préféré:</strong> {selectedApplication.preferred_topic}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Motivations</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Pourquoi cette collaboration:</strong>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{selectedApplication.why_collaboration}</p>
                  </div>
                  <div>
                    <strong>Transformation désirée:</strong>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{selectedApplication.desired_transformation}</p>
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
