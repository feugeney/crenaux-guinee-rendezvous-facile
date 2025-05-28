
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertCircle, User, Mail, Phone, Calendar, Eye } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface ClientsListProps {
  limit?: number;
  searchTerm?: string;
}

const ClientsList = ({ limit, searchTerm = "" }: ClientsListProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        // Apply search filter if provided
        if (searchTerm.trim()) {
          query = query.or(
            `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
          );
        }
          
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setClients(data as Client[]);
      } catch (err: any) {
        console.error("Error fetching clients:", err);
        setError(err.message || "Impossible de charger les clients");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [limit, searchTerm]);

  const getClientBookings = async (clientId: string) => {
    try {
      // Fetch bookings for this client
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', clientId)
        .order('date', { ascending: false });

      if (error) throw error;

      // This would typically open a modal or navigate to a detail view
      console.log("Client bookings:", bookings);
      
      // In a real implementation, you'd show these bookings in a modal or navigate to a detail page
      alert(`Rendez-vous trouvés: ${bookings?.length || 0}`);
    } catch (err) {
      console.error("Error fetching client bookings:", err);
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

  if (clients.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">
          {searchTerm ? `Aucun client trouvé pour "${searchTerm}"` : "Aucun client trouvé"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Inscription</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  {client.first_name} {client.last_name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  {client.email}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  {client.phone || "—"}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {client.created_at && format(new Date(client.created_at), 'PPP', { locale: fr })}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => getClientBookings(client.id)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" /> Voir RDV
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsList;
