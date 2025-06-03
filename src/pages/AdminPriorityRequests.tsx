
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';

interface PriorityRequest {
  id: string;
  customer_name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  date: string;
  start_time: string;
  end_time: string;
  payment_status: string;
  created_at: string;
  is_priority: boolean;
}

const AdminPriorityRequests = () => {
  const [requests, setRequests] = useState<PriorityRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPriorityRequests();
  }, []);

  const fetchPriorityRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('is_priority', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes prioritaires:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes prioritaires",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'approved' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Demande approuvée",
        description: "La demande prioritaire a été approuvée avec succès",
      });

      fetchPriorityRequests();
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la demande",
        variant: "destructive",
      });
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Demande rejetée",
        description: "La demande prioritaire a été rejetée",
      });

      fetchPriorityRequests();
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la demande",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejetée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Non défini</Badge>;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Demandes prioritaires</h1>
            <p className="text-gray-600 mt-2">
              Gérez les demandes de créneaux prioritaires dans les 48h
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <span className="text-lg font-semibold text-amber-600">
              {requests.filter(r => r.payment_status === 'pending').length} en attente
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune demande prioritaire pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span>{request.topic}</span>
                    </CardTitle>
                    {getStatusBadge(request.payment_status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{request.customer_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{request.email}</span>
                      </div>
                      {request.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{request.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{format(new Date(request.date), 'PPP', { locale: fr })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{request.start_time} - {request.end_time}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {request.message && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <MessageCircle className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Message</span>
                          </div>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded border text-sm">
                            {request.message}
                          </p>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500">
                        Demande reçue le {format(new Date(request.created_at), 'PPp', { locale: fr })}
                      </div>
                    </div>
                  </div>
                  
                  {request.payment_status === 'pending' && (
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => rejectRequest(request.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                      <Button
                        onClick={() => approveRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminPriorityRequests;
