
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
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface PoliticalApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  professional_profile: string;
  city_country: string;
  gender: string;
  age_group: string;
  social_media: string;
  political_situation: string[];
  obstacles: string[];
  leadership_qualities: string;
  desired_transformation: string;
  coaching_experience: string;
  personal_situation: string[];
  preferred_topic: string;
  why_collaboration: string;
  format_preference: string;
  contact_preference: string;
  payment_option: string;
  payment_method: string;
  created_at: string;
  status: string;
}

const AdminPoliticalLaunch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<PoliticalApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<PoliticalApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Simuler des données pour le moment
      const mockData: PoliticalApplication[] = [
        {
          id: '1',
          full_name: 'Marie Camara',
          email: 'marie.camara@example.com',
          phone: '+224 123 456 789',
          professional_profile: 'Entrepreneur(e)',
          city_country: 'Conakry, Guinée',
          gender: 'Femme',
          age_group: 'Entre 35 ans et 45 ans',
          social_media: 'Facebook: Marie Camara',
          political_situation: ['Futur(e) candidat(e) non déclaré encore'],
          obstacles: ['Manque de visibilité', 'Manque de réseau et de soutien'],
          leadership_qualities: 'Déterminée, Visionnaire, Empathique',
          desired_transformation: 'Acquérir une stratégie claire pour ma candidature',
          coaching_experience: 'Non, première expérience',
          personal_situation: ['Marié (e)'],
          preferred_topic: 'Stratégie de communication politique',
          why_collaboration: 'Votre expérience en tant qu\'ancienne ministre m\'inspire',
          format_preference: 'En Présentiel dans nos bureaux',
          contact_preference: 'Via WhatsApp',
          payment_option: 'Je souhaite payer entièrement pour mon accompagnement',
          payment_method: 'Orange Money (exclusivement si vous êtes en Guinée)',
          created_at: new Date().toISOString(),
          status: 'pending'
        }
      ];
      
      setApplications(mockData);
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
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      setApplications(apps => 
        apps.map(app => 
          app.id === id ? { ...app, status } : app
        )
      );
      
      toast({
        title: "Succès",
        description: `Candidature ${status === 'approved' ? 'approuvée' : 'rejetée'}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    {applications.filter(app => app.status === 'approved').length}
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
                  <p className="text-sm text-gray-600">Revenus potentiels</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {applications.filter(app => app.status === 'approved').length * 1500}$
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des candidatures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <p className="text-sm text-gray-600">{app.desired_transformation}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>{app.payment_option.includes('entièrement') ? '1500$' : '1800$ (2x)'}</span>
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
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateApplicationStatus(app.id, 'approved')}
                          >
                            Approuver
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApp(app)}
                      >
                        Détails
                      </Button>
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
