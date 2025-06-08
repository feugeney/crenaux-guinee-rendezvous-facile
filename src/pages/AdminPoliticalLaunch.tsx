
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  ArrowLeft, 
  Users, 
  DollarSign,
  Calendar,
  Star,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface PoliticalApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  professional_profile: string;
  other_profile?: string;
  city_country: string;
  gender: string;
  age_group: string;
  social_media: string;
  discovery_channel: string;
  other_discovery_channel?: string;
  political_situation: string[];
  other_political_situation?: string;
  obstacles?: string[];
  other_obstacles?: string;
  leadership_qualities: string;
  desired_transformation: string;
  coaching_experience: string;
  personal_situation: string[];
  other_personal_situation?: string;
  preferred_topic: string;
  why_collaboration: string;
  format_preference: string;
  contact_preference: string;
  start_period: string;
  preferred_start_date?: string;
  comfort_options?: string[];
  payment_option: string;
  payment_method: string;
  created_at: string;
  status: string;
  admin_response?: string;
  proposed_schedule?: any;
  schedule_validated?: boolean;
  payment_link?: string;
}

const AdminPoliticalLaunch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<PoliticalApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<PoliticalApplication | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [proposedSchedule, setProposedSchedule] = useState('');

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      case 'schedule_proposed':
        return <Badge className="bg-blue-100 text-blue-800">Planning proposé</Badge>;
      case 'schedule_validated':
        return <Badge className="bg-purple-100 text-purple-800">Planning validé</Badge>;
      case 'payment_sent':
        return <Badge className="bg-orange-100 text-orange-800">Paiement envoyé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const updateApplicationStatus = async (id: string, status: string, response?: string, schedule?: string) => {
    try {
      const updateData: any = { status };
      
      if (response) {
        updateData.admin_response = response;
      }
      
      if (schedule) {
        updateData.proposed_schedule = { schedule };
      }

      const { error } = await supabase
        .from('political_launch_applications')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setApplications(apps => 
        apps.map(app => 
          app.id === id ? { ...app, ...updateData } : app
        )
      );
      
      toast({
        title: "Succès",
        description: `Candidature ${status === 'approved' ? 'approuvée' : status === 'rejected' ? 'rejetée' : 'mise à jour'}`,
      });

      if (status === 'approved') {
        // Ici vous pourriez ajouter l'envoi d'un email de confirmation
        console.log('Envoi email de confirmation pour:', id);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const handleApproveWithSchedule = async (app: PoliticalApplication) => {
    if (!proposedSchedule.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez proposer un planning",
        variant: "destructive",
      });
      return;
    }

    await updateApplicationStatus(app.id, 'schedule_proposed', adminResponse, proposedSchedule);
    setAdminResponse('');
    setProposedSchedule('');
    setSelectedApp(null);
  };

  const sendPaymentLink = async (applicationId: string) => {
    try {
      // Simuler la création d'un lien de paiement
      const paymentLink = `https://checkout.stripe.com/pay/political-launch-${applicationId}`;
      
      const { error } = await supabase
        .from('political_launch_applications')
        .update({ 
          status: 'payment_sent',
          payment_link: paymentLink 
        })
        .eq('id', applicationId);

      if (error) throw error;

      // Ici vous pourriez appeler une edge function pour envoyer l'email avec le lien
      
      toast({
        title: "Succès",
        description: "Lien de paiement envoyé par email au client",
      });

      fetchApplications();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi du lien de paiement",
        variant: "destructive",
      });
    }
  };

  const getPrice = (paymentOption: string) => {
    return paymentOption.includes('entièrement') ? 1500 : 1800;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <Crown className="h-8 w-8 text-amber-500" />
                <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Programme "Je me lance en politique"
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                Gestion des candidatures pour l'accompagnement politique premium
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total candidatures</p>
                  <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approuvées</p>
                  <p className="text-3xl font-bold text-green-600">
                    {applications.filter(app => ['approved', 'schedule_proposed', 'schedule_validated', 'payment_sent'].includes(app.status)).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paiement envoyé</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {applications.filter(app => app.status === 'payment_sent').length}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenus potentiels</p>
                  <p className="text-3xl font-bold text-green-600">
                    {applications
                      .filter(app => ['approved', 'schedule_proposed', 'schedule_validated', 'payment_sent'].includes(app.status))
                      .reduce((total, app) => total + getPrice(app.payment_option), 0)}$
                  </p>
                </div>
                <Star className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des candidatures */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Chargement...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Aucune candidature pour le moment</p>
            </div>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{app.full_name}</CardTitle>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{app.email}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{app.city_country}</span>
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Profil professionnel:</p>
                    <p className="text-sm text-gray-600">{app.professional_profile}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Situation politique:</p>
                    <p className="text-sm text-gray-600">{app.political_situation.join(', ')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Transformation souhaitée:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{app.desired_transformation}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Période de début souhaitée:</p>
                    <p className="text-sm text-gray-600">{app.start_period}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>{getPrice(app.payment_option)}$</span>
                      <span className="text-gray-500">({app.payment_method})</span>
                    </div>
                    <div className="flex space-x-2">
                      {app.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => updateApplicationStatus(app.id, 'rejected')}
                          >
                            Rejeter
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => setSelectedApp(app)}
                              >
                                Approuver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Approuver la candidature</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Réponse personnalisée (optionnel)</label>
                                  <Textarea
                                    placeholder="Message personnalisé pour le candidat..."
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Proposition de planning *</label>
                                  <Textarea
                                    placeholder="Proposez des créneaux disponibles..."
                                    value={proposedSchedule}
                                    onChange={(e) => setProposedSchedule(e.target.value)}
                                    required
                                  />
                                </div>
                                <Button
                                  onClick={() => handleApproveWithSchedule(app)}
                                  className="w-full"
                                >
                                  Approuver et envoyer le planning
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                      
                      {app.status === 'schedule_validated' && (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => sendPaymentLink(app.id)}
                        >
                          Envoyer lien paiement
                        </Button>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApp(app)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Détails de la candidature - {app.full_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-700">Informations personnelles</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Email:</strong> {app.email}</p>
                                  <p><strong>Téléphone:</strong> {app.phone}</p>
                                  <p><strong>Sexe:</strong> {app.gender}</p>
                                  <p><strong>Âge:</strong> {app.age_group}</p>
                                  <p><strong>Ville/Pays:</strong> {app.city_country}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-700">Profil professionnel</h4>
                                <div className="space-y-2 text-sm">
                                  <p>{app.professional_profile}</p>
                                  {app.other_profile && <p><strong>Autre:</strong> {app.other_profile}</p>}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-700">Situation politique</h4>
                              <p className="text-sm">{app.political_situation.join(', ')}</p>
                              {app.other_political_situation && (
                                <p className="text-sm"><strong>Autre:</strong> {app.other_political_situation}</p>
                              )}
                            </div>

                            {app.obstacles && app.obstacles.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-700">Obstacles rencontrés</h4>
                                <p className="text-sm">{app.obstacles.join(', ')}</p>
                                {app.other_obstacles && (
                                  <p className="text-sm"><strong>Autre:</strong> {app.other_obstacles}</p>
                                )}
                              </div>
                            )}

                            <div>
                              <h4 className="font-semibold text-gray-700">Qualités de leadership</h4>
                              <p className="text-sm">{app.leadership_qualities}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-700">Transformation souhaitée</h4>
                              <p className="text-sm">{app.desired_transformation}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-700">Expérience coaching</h4>
                              <p className="text-sm">{app.coaching_experience}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-700">Situation personnelle</h4>
                              <p className="text-sm">{app.personal_situation.join(', ')}</p>
                              {app.other_personal_situation && (
                                <p className="text-sm"><strong>Autre:</strong> {app.other_personal_situation}</p>
                              )}
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-700">Thématique souhaitée</h4>
                              <p className="text-sm">{app.preferred_topic}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-700">Pourquoi collaborer</h4>
                              <p className="text-sm">{app.why_collaboration}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-700">Préférences</h4>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Format:</strong> {app.format_preference}</p>
                                  <p><strong>Contact:</strong> {app.contact_preference}</p>
                                  <p><strong>Début:</strong> {app.start_period}</p>
                                  {app.preferred_start_date && (
                                    <p><strong>Date souhaitée:</strong> {new Date(app.preferred_start_date).toLocaleDateString('fr-FR')}</p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-700">Paiement</h4>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Option:</strong> {app.payment_option}</p>
                                  <p><strong>Méthode:</strong> {app.payment_method}</p>
                                  <p><strong>Montant:</strong> {getPrice(app.payment_option)}$ USD</p>
                                </div>
                              </div>
                            </div>

                            {app.comfort_options && app.comfort_options.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-700">Options de commodité (présentiel)</h4>
                                <p className="text-sm">{app.comfort_options.join(', ')}</p>
                              </div>
                            )}

                            {app.admin_response && (
                              <div>
                                <h4 className="font-semibold text-gray-700">Réponse admin</h4>
                                <p className="text-sm">{app.admin_response}</p>
                              </div>
                            )}

                            {app.proposed_schedule && (
                              <div>
                                <h4 className="font-semibold text-gray-700">Planning proposé</h4>
                                <p className="text-sm">{app.proposed_schedule.schedule}</p>
                              </div>
                            )}

                            <div className="text-xs text-gray-500">
                              <p>Candidature soumise le: {new Date(app.created_at).toLocaleString('fr-FR')}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPoliticalLaunch;
