
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2, User, Mail, Phone, Calendar, Building, MapPin, AlertTriangle, AlertCircle } from 'lucide-react';
import BookingsList from './BookingsList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import NotificationList from '@/components/NotificationList';
import { Badge } from '@/components/ui/badge';

interface ClientDetailProps {
  clientId: string;
  onClose: () => void;
}

interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  company?: string;
  address?: string;
  notes?: string;
  verified?: boolean;
}

const ClientDetail = ({ clientId, onClose }: ClientDetailProps) => {
  const [client, setClient] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch client profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', clientId)
          .single();
          
        if (profileError) throw profileError;
        
        setClient(profileData as ClientData);
      } catch (err: any) {
        console.error("Error fetching client data:", err);
        setError(err.message || "Impossible de charger les données du client");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const fetchClientBookings = async () => {
    try {
      setBookingsLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', clientId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      setBookings(data || []);
    } catch (err: any) {
      console.error("Error fetching client bookings:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations du client",
        variant: "destructive"
      });
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "bookings" && clientId) {
      fetchClientBookings();
    }
  }, [activeTab, clientId]);

  const verifyClient = async () => {
    if (!client) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ verified: true })
        .eq('id', client.id);
        
      if (error) throw error;
      
      setClient({...client, verified: true});
      
      toast({
        title: "Client vérifié",
        description: "Les informations du client ont été vérifiées avec succès",
      });
    } catch (err: any) {
      console.error("Error verifying client:", err);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le client",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error || "Client non trouvé"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            <div>
              <CardTitle>
                {client.first_name} {client.last_name}
              </CardTitle>
              <CardDescription>Détails du client</CardDescription>
            </div>
          </div>
          
          {client.verified ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Vérifié</Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200">
              <AlertTriangle className="h-3 w-3 mr-1" /> En attente de vérification
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="bookings">Rendez-vous</TabsTrigger>
            <TabsTrigger value="notifications">Communications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" />
                  {client.email || "—"}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
                <p className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-gray-500" />
                  {client.phone || "—"}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Date d'inscription</p>
                <p className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  {client.created_at && format(new Date(client.created_at), 'PPP', { locale: fr })}
                </p>
              </div>

              {client.company && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Entreprise</p>
                  <p className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-gray-500" />
                    {client.company}
                  </p>
                </div>
              )}

              {client.address && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Adresse</p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    {client.address}
                  </p>
                </div>
              )}
            </div>

            {client.notes && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Notes</p>
                <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-100">
                  {client.notes}
                </div>
              </div>
            )}

            {!client.verified && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                  <div>
                    <p className="font-medium text-amber-800">Vérification requise</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Veuillez vérifier les informations de ce client avant son prochain rendez-vous.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bookings">
            <h3 className="text-lg font-medium mb-4">Historique des rendez-vous</h3>
            
            {bookingsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className={`h-2 ${booking.is_priority ? 'bg-amber-400' : booking.payment_status === 'paid' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{booking.topic}</p>
                          <p className="text-sm text-gray-600">
                            {booking.date} • {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                          </p>
                        </div>
                        <Badge className={
                          booking.payment_status === 'paid' ? 'bg-green-100 text-green-800 border-green-200' : 
                          booking.payment_status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }>
                          {booking.payment_status === 'paid' ? 'Payé' : 
                           booking.payment_status === 'pending' ? 'En attente' : 'Annulé'}
                        </Badge>
                      </div>
                      {booking.message && (
                        <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                          {booking.message}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucun rendez-vous trouvé pour ce client</p>
            )}
          </TabsContent>
          
          <TabsContent value="notifications">
            <h3 className="text-lg font-medium mb-4">Communications</h3>
            <NotificationList 
              limit={5} 
              type="payment_confirmation"
              showHeader={false}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
        
        {!client.verified && (
          <Button 
            onClick={verifyClient}
            disabled={isUpdating}
            className="bg-coaching-600 hover:bg-coaching-700"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              'Marquer comme vérifié'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ClientDetail;
