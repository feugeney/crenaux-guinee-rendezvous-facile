
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, User, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeSlot } from "@/types";

interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
}

// Define a type for the data that comes from temp_bookings_data
interface TempBookingData {
  booking_data: any; // Use 'any' since this can be different types
}

// Étendre l'interface Booking pour y inclure les propriétés manquantes
interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
  payment_status: string;
  is_priority: boolean;
  created_at: string;
  message?: string; // Ajout du message comme propriété optionnelle
  payment_link?: string;
  payment_method?: string;
  user_id?: string;
  stripe_session_id?: string;
  profiles?: Profile;
  formData?: any; // Using 'any' since Supabase can return different types
  amount?: number;
  updated_at: string;
}

interface BookingsListProps {
  priorityOnly?: boolean;
  limit?: number;
}

interface BookingDetails {
  booking: Booking | null;
  userData: any;
}

const BookingsList = ({ priorityOnly = false, limit }: BookingsListProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        
        // Using a more comprehensive query to get booking info with user data
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            profiles:user_id (
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .order('date', { ascending: false });
          
        if (bookingsError) throw bookingsError;
        
        // Get detailed booking form data from temp_bookings_data
        const enhancedBookings = await Promise.all((bookingsData || []).map(async (booking) => {
          const bookingWithFormData: Booking = { ...booking } as Booking;
          
          if (booking.stripe_session_id) {
            const { data: tempData } = await supabase
              .from('temp_bookings_data')
              .select('booking_data')
              .eq('stripe_session_id', booking.stripe_session_id)
              .single();
              
            if (tempData && tempData.booking_data) {
              // Simply assign without type constraints - we'll handle the different types when using the data
              bookingWithFormData.formData = tempData.booking_data;
            }
          }
          return bookingWithFormData;
        }));
        
        // Filter by priority if needed
        let filteredData = enhancedBookings;
        if (priorityOnly) {
          filteredData = filteredData.filter(booking => booking.is_priority);
        }
        
        // Apply limit if specified
        if (limit) {
          filteredData = filteredData.slice(0, limit);
        }
        
        setBookings(filteredData);
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        setError(err.message || "Impossible de charger les rendez-vous");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [priorityOnly, limit]);

  const getStatusBadge = (status: string, isPriority: boolean) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmé</Badge>;
      case 'pending':
        return isPriority 
          ? <Badge className="bg-amber-100 text-amber-800 border-amber-200">Priorité en attente</Badge>
          : <Badge className="bg-blue-100 text-blue-800 border-blue-200">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh bookings list
      const updatedBookings = bookings.map(booking => 
        booking.id === id ? { ...booking, payment_status: status } : booking
      );
      setBookings(updatedBookings);
      
      toast({
        title: "Statut mis à jour",
        description: `Le rendez-vous a été marqué comme ${status === 'completed' ? 'confirmé' : status === 'cancelled' ? 'annulé' : status}`,
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      console.error("Error updating booking status:", err);
    }
  };

  const viewBookingDetails = async (booking: Booking) => {
    try {
      // Get temp booking data to fetch full form submission details
      let tempBookingData: TempBookingData | null = null;
      
      if (booking.stripe_session_id) {
        const { data, error: tempBookingError } = await supabase
          .from('temp_bookings_data')
          .select('booking_data')
          .eq('stripe_session_id', booking.stripe_session_id)
          .single();
          
        if (data) {
          tempBookingData = data as TempBookingData;
        }
        
        if (tempBookingError && tempBookingError.code !== 'PGRST116') {
          console.error("Error fetching temp booking data:", tempBookingError);
        }
      }
      
      // Get user profile data
      let userData: any = null;
      
      if (booking.user_id) {
        const { data, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', booking.user_id)
          .single();
          
        if (data) {
          userData = data;
        }
        
        if (userError && userError.code !== 'PGRST116') {
          console.error("Error fetching user data:", userError);
        }
      }
      
      // Combine all data to ensure we have all information
      const combinedData = {
        ...(userData || {}),
        ...(tempBookingData?.booking_data || {}),
        ...(booking.formData || {})
      };
      
      setSelectedBooking({
        booking,
        userData: combinedData
      });
      
    } catch (err) {
      console.error("Error fetching booking details:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du rendez-vous",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Aucun rendez-vous trouvé</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Horaire</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {format(new Date(booking.date), 'PPP', { locale: fr })}
                </div>
              </TableCell>
              <TableCell>
                {booking.profiles ? (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {booking.profiles.first_name} {booking.profiles.last_name}
                  </div>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  {booking.start_time?.substring(0, 5)} - {booking.end_time?.substring(0, 5)}
                </div>
              </TableCell>
              <TableCell>{booking.topic}</TableCell>
              <TableCell>{getStatusBadge(booking.payment_status, booking.is_priority)}</TableCell>
              <TableCell>
                {booking.payment_status === "pending" ? (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                      onClick={() => viewBookingDetails(booking)}
                    >
                      <Info className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Confirmer
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Annuler
                    </Button>
                  </div>
                ) : (
                  <div>
                    {booking.payment_status === "completed" ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">Confirmé</Badge>
                    ) : booking.payment_status === "cancelled" ? (
                      <Badge className="bg-red-100 text-red-800 border-red-200">Annulé</Badge>
                    ) : (
                      <span>{getStatusBadge(booking.payment_status, booking.is_priority)}</span>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
            <DialogDescription>
              Informations complètes sur le rendez-vous et le client
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Informations client</h3>
                    <dl className="space-y-2">
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Nom</dt>
                        <dd className="col-span-2">{selectedBooking.userData?.first_name} {selectedBooking.userData?.last_name}</dd>
                      </div>
                      
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Email</dt>
                        <dd className="col-span-2">{selectedBooking.userData?.email}</dd>
                      </div>
                      
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Téléphone</dt>
                        <dd className="col-span-2">{selectedBooking.userData?.phone || selectedBooking.userData?.countryCode + " " + selectedBooking.userData?.phone || "—"}</dd>
                      </div>

                      {selectedBooking.userData?.whatsapp && (
                        <div className="grid grid-cols-3">
                          <dt className="font-medium text-gray-500">WhatsApp</dt>
                          <dd className="col-span-2">{selectedBooking.userData?.whatsapp}</dd>
                        </div>
                      )}
                      
                      {selectedBooking.userData?.location && (
                        <div className="grid grid-cols-3">
                          <dt className="font-medium text-gray-500">Pays/Région</dt>
                          <dd className="col-span-2">{selectedBooking.userData?.location}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Détails du rendez-vous</h3>
                    <dl className="space-y-2">
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Date</dt>
                        <dd className="col-span-2">
                          {selectedBooking.booking?.date ? 
                            format(new Date(selectedBooking.booking.date), 'PPP', { locale: fr }) : "—"}
                        </dd>
                      </div>
                      
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Horaire</dt>
                        <dd className="col-span-2">
                          {selectedBooking.booking?.start_time?.substring(0, 5)} - {selectedBooking.booking?.end_time?.substring(0, 5)}
                        </dd>
                      </div>
                      
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Type</dt>
                        <dd className="col-span-2">
                          {selectedBooking.booking?.topic}
                          {selectedBooking.booking?.is_priority && 
                            <Badge className="ml-2 bg-amber-100 text-amber-800">Prioritaire</Badge>}
                        </dd>
                      </div>

                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Prix</dt>
                        <dd className="col-span-2">
                          {selectedBooking.userData?.isPriority ? "350 $ USD" : "300 $ USD"}
                        </dd>
                      </div>
                      
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Statut</dt>
                        <dd className="col-span-2">
                          {getStatusBadge(selectedBooking.booking?.payment_status || "", selectedBooking.booking?.is_priority || false)}
                        </dd>
                      </div>
                      
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Date de création</dt>
                        <dd className="col-span-2">
                          {selectedBooking.booking?.created_at ? 
                            format(new Date(selectedBooking.booking.created_at), "dd/MM/yyyy HH:mm") : "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {/* Profil personnel */}
                {(selectedBooking.userData?.gender || selectedBooking.userData?.relationshipStatus) && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium border-b pb-2">Profil personnel</h3>
                    <dl className="space-y-2">
                      {selectedBooking.userData?.gender && (
                        <div className="grid grid-cols-3">
                          <dt className="font-medium text-gray-500">Genre</dt>
                          <dd className="col-span-2">
                            {selectedBooking.userData?.gender === 'male' ? 'Homme' : 
                             selectedBooking.userData?.gender === 'female' ? 'Femme' : 
                             selectedBooking.userData?.gender}
                          </dd>
                        </div>
                      )}
                      
                      {selectedBooking.userData?.relationshipStatus && (
                        <div className="grid grid-cols-3">
                          <dt className="font-medium text-gray-500">Statut relationnel</dt>
                          <dd className="col-span-2">
                            {selectedBooking.userData?.relationshipStatus === 'single' ? 'Célibataire' :
                             selectedBooking.userData?.relationshipStatus === 'married' ? 'Marié(e)' :
                             selectedBooking.userData?.relationshipStatus === 'relationship' ? 'En couple' :
                             selectedBooking.userData?.otherStatus || 'Autre'}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
                
                {/* Profil professionnel */}
                {(selectedBooking.userData?.professionalProfile || selectedBooking.userData?.businessType) && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium border-b pb-2">Profil professionnel</h3>
                    <dl className="space-y-2">
                      {selectedBooking.userData?.professionalProfile && (
                        <div className="grid grid-cols-3">
                          <dt className="font-medium text-gray-500">Activité professionnelle</dt>
                          <dd className="col-span-2">{selectedBooking.userData?.professionalProfile}</dd>
                        </div>
                      )}
                      
                      {selectedBooking.userData?.businessType && (
                        <div className="grid grid-cols-3">
                          <dt className="font-medium text-gray-500">Type d'entreprise</dt>
                          <dd className="col-span-2">
                            {selectedBooking.userData?.businessType === 'startup' ? 'Startup' :
                             selectedBooking.userData?.businessType === 'established' ? 'Entreprise établie' :
                             selectedBooking.userData?.businessType === 'selfEmployed' ? 'Auto-entrepreneur' :
                             selectedBooking.userData?.businessType === 'planning' ? 'En phase de planification' :
                             selectedBooking.userData?.otherBusinessType || 'Autre'}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
                
                {/* Sujet de consultation */}
                {selectedBooking.userData?.topic && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium border-b pb-2">Sujet de consultation</h3>
                    <dl className="space-y-2">
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Sujet principal</dt>
                        <dd className="col-span-2">
                          {selectedBooking.userData?.topic === 'businessCreation' ? 'Création d\'entreprise' :
                           selectedBooking.userData?.topic === 'businessStrategy' ? 'Stratégie d\'entreprise' :
                           selectedBooking.userData?.topic === 'digitalTransformation' ? 'Transformation digitale' :
                           selectedBooking.userData?.topic === 'financialStrategy' ? 'Stratégie financière' :
                           selectedBooking.userData?.topic === 'careerChange' ? 'Reconversion professionnelle' :
                           selectedBooking.userData?.otherTopic || 'Autre'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
                
                {/* Message ou questions */}
                {(selectedBooking.userData?.message || selectedBooking.userData?.questions || selectedBooking.booking?.message) && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium border-b pb-2">Message du client</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedBooking.userData?.message || selectedBooking.userData?.questions || selectedBooking.booking?.message}
                    </p>
                  </div>
                )}
                
                {/* Toutes les informations fournies */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium border-b pb-2">Toutes les informations fournies</h3>
                  <dl className="space-y-4 grid grid-cols-1">
                    {Object.entries(selectedBooking.userData || {}).map(([key, value]) => {
                      // Skip display of internal fields and already displayed fields
                      if (['id', '__supabase_realtime_auth_token', 'profiles', 'created_at', 'updated_at', 
                           'first_name', 'last_name', 'email', 'phone', 'message', 'questions', 
                           'gender', 'relationshipStatus', 'professionalProfile', 'businessType', 'topic'].includes(key)) {
                        return null;
                      }
                      
                      // Handle nested objects
                      if (typeof value === 'object' && value !== null) {
                        return (
                          <div key={key} className="border-l-2 pl-3 py-1 border-gray-200">
                            <dt className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                            <dd className="mt-1 text-gray-600">
                              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded-md">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            </dd>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={key} className="border-l-2 pl-3 py-1 border-gray-200">
                          <dt className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                          <dd className="mt-1 text-gray-600">{value?.toString() || "—"}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
                
                {/* If there are form responses */}
                {selectedBooking.userData?.formResponses && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium border-b pb-2">Réponses au questionnaire</h3>
                    <dl className="space-y-4">
                      {Object.entries(selectedBooking.userData.formResponses).map(([question, answer]) => (
                        <div key={question} className="space-y-1">
                          <dt className="font-medium text-gray-600">{question}</dt>
                          <dd className="text-gray-700">{answer as string}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            {selectedBooking?.booking && (
              <div className="flex space-x-2 w-full justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedBooking(null)}>
                  Fermer
                </Button>
                
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
                    onClick={() => {
                      updateBookingStatus(selectedBooking.booking!.id, 'completed');
                      setSelectedBooking(null);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Confirmer
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                    onClick={() => {
                      updateBookingStatus(selectedBooking.booking!.id, 'cancelled');
                      setSelectedBooking(null);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsList;
