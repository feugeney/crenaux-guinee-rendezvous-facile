import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Eye, Calendar, Check, X, Send, Clock, CheckCircle } from 'lucide-react';

interface PoliticalApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  professional_profile: string;
  city_country: string;
  gender: string;
  age_group: string;
  political_situation: string[];
  leadership_qualities: string;
  desired_transformation: string;
  preferred_topic: string;
  why_collaboration: string;
  format_preference: string;
  contact_preference: string;
  start_period: string;
  payment_option: string;
  payment_method: string;
  status: string;
  admin_response?: string;
  payment_link?: string;
  preferred_start_date?: string;
  proposed_schedule?: any;
  schedule_validated: boolean;
  created_at: string;
}

const PoliticalApplicationsList = () => {
  const [applications, setApplications] = useState<PoliticalApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<PoliticalApplication | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('political_launch_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string, response?: string, link?: string) => {
    setIsSubmitting(true);
    try {
      const updateData: any = { status };
      if (response) updateData.admin_response = response;
      if (link) updateData.payment_link = link;

      const { error } = await supabase
        .from('political_launch_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: "La candidature a été mise à jour avec succès"
      });

      await loadApplications();
      setIsResponseOpen(false);
      setAdminResponse('');
      setPaymentLink('');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateSchedule = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('political_launch_applications')
        .update({ schedule_validated: true })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Planning validé",
        description: "Le planning a été validé avec succès"
      });

      await loadApplications();
    } catch (error: any) {
      console.error('Erreur lors de la validation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de valider le planning",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      approved: { label: 'Approuvé', variant: 'default' as const },
      rejected: { label: 'Rejeté', variant: 'destructive' as const },
      schedule_proposed: { label: 'Planning proposé', variant: 'outline' as const },
      payment_pending: { label: 'Paiement en attente', variant: 'outline' as const },
      completed: { label: 'Terminé', variant: 'default' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const openResponseDialog = (application: PoliticalApplication) => {
    setSelectedApp(application);
    setAdminResponse(application.admin_response || '');
    setPaymentLink(application.payment_link || '');
    setNewStatus(application.status);
    setIsResponseOpen(true);
  };

  const handleApprove = (applicationId: string) => {
    // Rediriger directement vers la page de planification
    window.open(`/admin/political-launch-schedule/${applicationId}`, '_blank');
  };

  // Séparer les candidatures
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const validatedApplications = applications.filter(app => 
    app.status !== 'pending' && app.status !== 'rejected'
  );

  const renderApplicationCard = (app: PoliticalApplication) => (
    <Card key={app.id}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{app.full_name}</CardTitle>
            <CardDescription>{app.email} • {app.city_country}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(app.status)}
            {app.schedule_validated && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Planning validé
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Profil professionnel</p>
            <p className="font-medium">{app.professional_profile}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sujet prioritaire</p>
            <p className="font-medium">{app.preferred_topic}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Format préféré</p>
            <p className="font-medium">{app.format_preference}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedApp(app)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Voir détails
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Détails de la candidature - {selectedApp?.full_name}</DialogTitle>
              </DialogHeader>
              {selectedApp && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Informations personnelles</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Nom:</strong> {selectedApp.full_name}</p>
                        <p><strong>Email:</strong> {selectedApp.email}</p>
                        <p><strong>Téléphone:</strong> {selectedApp.phone}</p>
                        <p><strong>Ville/Pays:</strong> {selectedApp.city_country}</p>
                        <p><strong>Genre:</strong> {selectedApp.gender}</p>
                        <p><strong>Âge:</strong> {selectedApp.age_group}</p>
                        <p><strong>Profil:</strong> {selectedApp.professional_profile}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Préférences</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Sujet prioritaire:</strong> {selectedApp.preferred_topic}</p>
                        <p><strong>Format:</strong> {selectedApp.format_preference}</p>
                        <p><strong>Contact:</strong> {selectedApp.contact_preference}</p>
                        <p><strong>Période de début:</strong> {selectedApp.start_period}</p>
                        <p><strong>Paiement:</strong> {selectedApp.payment_option}</p>
                        <p><strong>Méthode:</strong> {selectedApp.payment_method}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Qualités de leadership</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedApp.leadership_qualities}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Transformation désirée</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedApp.desired_transformation}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Motivation pour la collaboration</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedApp.why_collaboration}</p>
                  </div>

                  {selectedApp.political_situation && selectedApp.political_situation.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Situation politique</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.political_situation.map((situation, index) => (
                          <Badge key={index} variant="outline">{situation}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedApp.admin_response && (
                    <div>
                      <h4 className="font-semibold mb-2">Réponse administrateur</h4>
                      <p className="text-sm bg-blue-50 p-3 rounded">{selectedApp.admin_response}</p>
                    </div>
                  )}

                  {selectedApp.payment_link && (
                    <div>
                      <h4 className="font-semibold mb-2">Lien de paiement</h4>
                      <a 
                        href={selectedApp.payment_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedApp.payment_link}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => openResponseDialog(app)}
          >
            <Send className="w-4 h-4 mr-1" />
            Répondre
          </Button>

          {app.status === 'pending' && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleApprove(app.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Approuver & Planifier
            </Button>
          )}

          {(app.status === 'approved' || app.status === 'schedule_proposed') && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`/admin/political-launch-schedule/${app.id}`, '_blank')}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Planning
            </Button>
          )}

          {app.proposed_schedule && !app.schedule_validated && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => validateSchedule(app.id)}
            >
              <Check className="w-4 h-4 mr-1" />
              Valider planning
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coaching-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Candidatures "Je me lance en politique"</h2>
        <Button onClick={loadApplications} variant="outline">
          Actualiser
        </Button>
      </div>

      {/* Section Candidatures en attente */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Candidatures en attente ({pendingApplications.length})
          </h3>
        </div>
        
        {pendingApplications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Aucune candidature en attente
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingApplications.map(renderApplicationCard)}
          </div>
        )}
      </div>

      {/* Section Candidatures validées */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Candidatures validées ({validatedApplications.length})
          </h3>
        </div>
        
        {validatedApplications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Aucune candidature validée
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {validatedApplications.map(renderApplicationCard)}
          </div>
        )}
      </div>

      {/* Dialog de réponse */}
      <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Répondre à {selectedApp?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Nouveau statut</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                  <SelectItem value="schedule_proposed">Planning proposé</SelectItem>
                  <SelectItem value="payment_pending">Paiement en attente</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="response">Réponse à envoyer</Label>
              <Textarea
                id="response"
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Votre réponse au candidat..."
                className="min-h-[100px]"
              />
            </div>

            {(newStatus === 'approved' || newStatus === 'payment_pending') && (
              <div>
                <Label htmlFor="payment_link">Lien de paiement (optionnel)</Label>
                <Input
                  id="payment_link"
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsResponseOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => updateApplicationStatus(selectedApp!.id, newStatus, adminResponse, paymentLink)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Envoyer réponse"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoliticalApplicationsList;
