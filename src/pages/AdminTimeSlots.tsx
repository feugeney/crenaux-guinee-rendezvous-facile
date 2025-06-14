
import React, { useState, useEffect } from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleTimeSlotList from '@/components/admin/SimpleTimeSlotList';
import { Calendar, Clock, BarChart3 } from 'lucide-react';
import { fetchTimeSlots, createTimeSlot, updateTimeSlot, deleteTimeSlot } from '@/services/timeSlotService';
import { TimeSlot } from '@/types';
import { useToast } from '@/hooks/use-toast';

const AdminTimeSlots = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTimeSlots();
  }, [refreshKey]);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const slots = await fetchTimeSlots();
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les créneaux horaires",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTimeSlotEdit = async (timeSlotData: any) => {
    try {
      const updatedSlot: TimeSlot = {
        id: timeSlotData.id,
        day_of_week: new Date(timeSlotData.specific_date).getDay(),
        start_time: timeSlotData.start_time,
        end_time: timeSlotData.end_time,
        available: timeSlotData.available,
        is_recurring: false,
        specific_date: timeSlotData.specific_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await updateTimeSlot(updatedSlot);
      toast({
        title: "Succès",
        description: "Créneau modifié avec succès"
      });
      handleRefresh();
    } catch (error) {
      console.error('Error updating time slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le créneau",
        variant: "destructive"
      });
    }
  };

  const handleTimeSlotDelete = async (id: string) => {
    try {
      await deleteTimeSlot(id);
      toast({
        title: "Succès",
        description: "Créneau supprimé avec succès"
      });
      handleRefresh();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le créneau",
        variant: "destructive"
      });
    }
  };

  const handleTimeSlotCreate = async (timeSlotData: any) => {
    try {
      const newSlot: TimeSlot = {
        id: '',
        day_of_week: new Date(timeSlotData.specific_date).getDay(),
        start_time: timeSlotData.start_time,
        end_time: timeSlotData.end_time,
        available: timeSlotData.available,
        is_recurring: false,
        specific_date: timeSlotData.specific_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await createTimeSlot(newSlot);
      toast({
        title: "Succès",
        description: "Créneau créé avec succès"
      });
      handleRefresh();
    } catch (error) {
      console.error('Error creating time slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le créneau",
        variant: "destructive"
      });
    }
  };

  // Calculer les statistiques
  const availableSlots = timeSlots.filter(slot => slot.available).length;
  const bookedSlots = timeSlots.filter(slot => !slot.available).length;
  const occupancyRate = timeSlots.length > 0 ? Math.round((bookedSlots / timeSlots.length) * 100) : 0;

  return (
    <AdminHorizontalLayout>
      <div className="space-y-8">
        {/* Header moderne */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">
                Gestion des créneaux horaires
              </h1>
              <p className="text-gray-600">Gérez vos disponibilités pour les consultations</p>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Créneaux totaux</p>
                  <p className="text-2xl font-bold text-blue-900">{timeSlots.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Disponibles</p>
                  <p className="text-2xl font-bold text-green-900">{availableSlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">Réservés</p>
                  <p className="text-2xl font-bold text-orange-900">{bookedSlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Taux occupation</p>
                  <p className="text-2xl font-bold text-purple-900">{occupancyRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des créneaux */}
        <div>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-700" />
                <span>Gestion des créneaux horaires</span>
              </CardTitle>
              <CardDescription>
                Créez, modifiez et supprimez vos créneaux individuellement
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <SimpleTimeSlotList 
                key={refreshKey} 
                timeSlots={timeSlots.map(slot => ({
                  ...slot,
                  specific_date: slot.specific_date || new Date().toISOString().split('T')[0]
                }))}
                onEdit={handleTimeSlotEdit}
                onDelete={handleTimeSlotDelete}
                onCreate={handleTimeSlotCreate}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminTimeSlots;
