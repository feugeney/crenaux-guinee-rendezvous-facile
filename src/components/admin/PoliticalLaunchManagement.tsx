
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, User, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PoliticalApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city_country: string;
  professional_profile: string;
  preferred_topic: string;
  why_collaboration: string;
  format_preference: string;
  payment_method: string;
  payment_option: string;
  status: string;
  admin_response?: string;
  created_at: string;
  preferred_start_date?: string;
}

export const PoliticalLaunchManagement = () => {
  const [applications, setApplications] = useState<PoliticalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<PoliticalApplication | null>(null);
  const [adminResponse, setAdminResponse] = useState('');

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

  const handleUpdateStatus = async (applicationId: string, newStatus: string, response?: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (response) {
        updateData.admin_response = response;
      }

      const { error } = await supabase
        .from('political_launch_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      toast.success('Statut mis à jour');
      setSelectedApplication(null);
      setAdminResponse('');
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
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-800">En cours d'examen</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Programme Lancement Politique</h2>
          <p className="text-muted-foreground">Gérez les candidatures au programme de coaching politique</p>
        </div>
      </div>

      {/* Filtres et statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-yellow-500" />
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
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">En examen</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'under_review').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Approuvés</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Rejetés</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'rejected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les candidatures</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="under_review">En cours d'examen</SelectItem>
              <SelectItem value="approved">Approuvées</SelectItem>
              <SelectItem value="rejected">Rejetées</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table des candidatures */}
      <Card>
        <CardHeader>
          <CardTitle>Candidatures</CardTitle>
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
                <TableHead>Sujet préféré</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de candidature</TableHead>
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
                    <div className="space-y-1">
                      <p className="font-medium">{application.professional_profile}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {application.city_country}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-xs truncate">{application.preferred_topic}</p>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(application.status)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(application.created_at), 'PPP', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Détails de la candidature</DialogTitle>
                            <DialogDescription>
                              Candidature de {application.full_name}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedApplication && (
                            <div className="space-y-6">
                              {/* Informations personnelles */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Informations personnelles</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>Nom:</strong> {selectedApplication.full_name}</p>
                                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                                    <p><strong>Téléphone:</strong> {selectedApplication.phone}</p>
                                    <p><strong>Ville/Pays:</strong> {selectedApplication.city_country}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Profil professionnel</h4>
                                  <p className="text-sm">{selectedApplication.professional_profile}</p>
                                </div>
                              </div>
                              
                              {/* Préférences */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Sujet préféré</h4>
                                  <p className="text-sm">{selectedApplication.preferred_topic}</p>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Format préféré</h4>
                                  <p className="text-sm">{selectedApplication.format_preference}</p>
                                </div>
                              </div>
                              
                              {/* Motivation */}
                              <div>
                                <h4 className="font-semibold mb-2">Pourquoi cette collaboration?</h4>
                                <p className="text-sm bg-gray-50 p-3 rounded">{selectedApplication.why_collaboration}</p>
                              </div>
                              
                              {/* Réponse admin */}
                              <div>
                                <h4 className="font-semibold mb-2">Réponse administrateur</h4>
                                <Textarea
                                  placeholder="Votre réponse à la candidature..."
                                  value={adminResponse}
                                  onChange={(e) => setAdminResponse(e.target.value)}
                                  className="mb-4"
                                />
                                
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleUpdateStatus(selectedApplication.id, 'under_review')}
                                    variant="outline"
                                  >
                                    Mettre en examen
                                  </Button>
                                  <Button
                                    onClick={() => handleUpdateStatus(selectedApplication.id, 'approved', adminResponse)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approuver
                                  </Button>
                                  <Button
                                    onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected', adminResponse)}
                                    variant="destructive"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Rejeter
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
