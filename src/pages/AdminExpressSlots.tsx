
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  X,
  Calendar
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';

interface ExpressSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
  is_express: boolean;
  created_at: string;
}

const AdminExpressSlots = () => {
  const [slots, setSlots] = useState<ExpressSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: '',
    start_time: '',
    end_time: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchExpressSlots();
  }, []);

  const fetchExpressSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('is_recurring', false)
        .gte('specific_date', new Date().toISOString().split('T')[0])
        .order('specific_date', { ascending: true });

      if (error) throw error;
      
      // Map data to match our interface
      const mappedData = (data || []).map(slot => ({
        id: slot.id,
        date: slot.specific_date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        available: slot.available,
        is_express: true,
        created_at: slot.created_at
      }));
      
      setSlots(mappedData);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux express:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les créneaux express",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createExpressSlot = async () => {
    if (!newSlot.date || !newSlot.start_time || !newSlot.end_time) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('time_slots')
        .insert({
          specific_date: newSlot.date,
          start_time: newSlot.start_time,
          end_time: newSlot.end_time,
          available: true,
          is_recurring: false,
          day_of_week: new Date(newSlot.date).getDay()
        });

      if (error) throw error;

      toast({
        title: "Créneau créé",
        description: "Le créneau express a été créé avec succès",
      });

      setNewSlot({ date: '', start_time: '', end_time: '' });
      setShowForm(false);
      fetchExpressSlots();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le créneau express",
        variant: "destructive",
      });
    }
  };

  const toggleSlotAvailability = async (slotId: string, currentAvailability: boolean) => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .update({ available: !currentAvailability })
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Créneau ${!currentAvailability ? 'activé' : 'désactivé'}`,
      });

      fetchExpressSlots();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le créneau",
        variant: "destructive",
      });
    }
  };

  const deleteSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Créneau supprimé",
        description: "Le créneau express a été supprimé",
      });

      fetchExpressSlots();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le créneau",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Créneaux express</h1>
            <p className="text-gray-600 mt-2">
              Gérez les créneaux de dernière minute et les disponibilités express
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau créneau express
          </Button>
        </div>

        {showForm && (
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                <span>Créer un créneau express</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="start_time">Heure de début</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">Heure de fin</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
                <Button onClick={createExpressSlot} className="bg-emerald-600 hover:bg-emerald-700">
                  Créer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : slots.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun créneau express configuré</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {slots.map((slot) => (
              <Card key={slot.id} className="border-l-4 border-l-emerald-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {format(new Date(slot.date), 'PPP', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{slot.start_time} - {slot.end_time}</span>
                      </div>
                      <Badge 
                        className={
                          slot.available 
                            ? "bg-emerald-100 text-emerald-800" 
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {slot.available ? 'Disponible' : 'Indisponible'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSlotAvailability(slot.id, slot.available)}
                        className={
                          slot.available 
                            ? "text-red-600 border-red-200 hover:bg-red-50" 
                            : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        }
                      >
                        {slot.available ? (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activer
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSlot(slot.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminExpressSlots;
