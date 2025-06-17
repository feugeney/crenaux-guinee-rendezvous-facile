
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Mail, Phone, Eye, Calendar, Flag, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SessionDetailsDialog } from './session-tracking/SessionDetailsDialog';
import { getCompletionPercentage } from './session-tracking/sessionUtils';
import { PaidApplication, SessionSchedule } from './session-tracking/types';

interface RegisteredCandidate {
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
  schedule_validated: boolean;
  proposed_schedule?: any;
  payment_link?: string;
}

export const RegisteredCandidates = () => {
  const [candidates, setCandidates] = useState<RegisteredCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<RegisteredCandidate | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<PaidApplication | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('political_launch_applications')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des candidats:', error);
      toast.error('Erreur lors du chargement des candidats');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowSessions = (candidate: RegisteredCandidate) => {
    // Convertir le candidat au format PaidApplication
    const application: PaidApplication = {
      id: candidate.id,
      full_name: candidate.full_name,
      email: candidate.email,
      phone: candidate.phone,
      professional_profile: candidate.professional_profile,
      city_country: candidate.city_country,
      preferred_topic: candidate.preferred_topic,
      status: candidate.status,
      created_at: candidate.created_at,
      payment_option: candidate.payment_option,
      start_period: candidate.start_period,
      proposed_schedule: candidate.proposed_schedule,
      schedule_validated: candidate.schedule_validated,
      payment_link: candidate.payment_link
    };
    
    setSelectedApplication(application);
    setShowSessionDetails(true);
  };

  const getStatusBadge = (application: PaidApplication) => {
    if (application.status === 'approved') {
      return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
    }
    return <Badge variant="outline">{application.status}</Badge>;
  };

  const updateSessionStatus = (sessionIndex: number, completed: boolean, isFollowUp?: boolean) => {
    if (!selectedApplication) return;
    
    const updatedApplication = { ...selectedApplication };
    
    if (isFollowUp) {
      if (updatedApplication.proposed_schedule?.followUpSessions) {
        updatedApplication.proposed_schedule.followUpSessions[sessionIndex].completed = completed;
      }
    } else {
      if (updatedApplication.proposed_schedule?.sessions) {
        updatedApplication.proposed_schedule.sessions[sessionIndex].completed = completed;
      }
    }
    
    setSelectedApplication(updatedApplication);
    
    // Ici vous pourriez sauvegarder les changements dans la base de données
    toast.success(`Séance marquée comme ${completed ? 'terminée' : 'non terminée'}`);
  };

  const filteredCandidates = candidates.filter(candidate => 
    candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.professional_profile.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Candidats Inscrits</h2>
          <p className="text-muted-foreground">Liste des candidats approuvés au programme politique</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {candidates.length} candidat(s) inscrit(s)
        </Badge>
      </div>

      {/* Recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Rechercher par nom, email ou profil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flag className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Total inscrits</p>
                <p className="text-2xl font-bold">{candidates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Planning validé</p>
                <p className="text-2xl font-bold">{candidates.filter(c => c.schedule_validated).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Ce mois</p>
                <p className="text-2xl font-bold">
                  {candidates.filter(c => {
                    const candidateDate = new Date(c.created_at);
                    const now = new Date();
                    return candidateDate.getMonth() === now.getMonth() && 
                           candidateDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des candidats */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des candidats inscrits</CardTitle>
          <CardDescription>
            {filteredCandidates.length} candidat(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Profil</TableHead>
                <TableHead>Sujet d'intérêt</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Planning</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{candidate.full_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="h-3 w-3" />
                        {candidate.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{candidate.professional_profile}</p>
                      <p className="text-sm text-gray-500">{candidate.city_country}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-xs truncate">{candidate.preferred_topic}</p>
                  </TableCell>
                  <TableCell>
                    {format(new Date(candidate.created_at), 'PPP', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {candidate.schedule_validated ? (
                      <Badge className="bg-green-100 text-green-800">Validé</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir profil
                      </Button>
                      {candidate.schedule_validated && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                          onClick={() => handleFollowSessions(candidate)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Suivre les séances
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

      {/* Dialog des détails */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profil du candidat</DialogTitle>
            <DialogDescription>
              Détails complets de {selectedCandidate?.full_name}
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Informations personnelles</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Nom:</strong> {selectedCandidate.full_name}</p>
                    <p><strong>Email:</strong> {selectedCandidate.email}</p>
                    <p><strong>Téléphone:</strong> {selectedCandidate.phone}</p>
                    <p><strong>Ville/Pays:</strong> {selectedCandidate.city_country}</p>
                    <p><strong>Profil professionnel:</strong> {selectedCandidate.professional_profile}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Programme</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Option de paiement:</strong> {selectedCandidate.payment_option}</p>
                    <p><strong>Période de début:</strong> {selectedCandidate.start_period}</p>
                    <p><strong>Sujet préféré:</strong> {selectedCandidate.preferred_topic}</p>
                    <p><strong>Planning:</strong> {selectedCandidate.schedule_validated ? 'Validé' : 'En attente'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Statut de l'inscription</h4>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Candidat approuvé</Badge>
                  <span className="text-sm text-gray-500">
                    Inscrit le {format(new Date(selectedCandidate.created_at), 'PPP', { locale: fr })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de suivi des séances */}
      {selectedApplication && (
        <SessionDetailsDialog
          open={showSessionDetails}
          onOpenChange={setShowSessionDetails}
          application={selectedApplication}
          sessions={selectedApplication.proposed_schedule?.sessions || []}
          followUpSessions={selectedApplication.proposed_schedule?.followUpSessions || []}
          getStatusBadge={getStatusBadge}
          getCompletionPercentage={getCompletionPercentage}
          updateSessionStatus={updateSessionStatus}
        />
      )}
    </div>
  );
};
