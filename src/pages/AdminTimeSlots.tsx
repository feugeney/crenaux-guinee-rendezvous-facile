
import React, { useState } from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimpleTimeSlotForm from '@/components/admin/SimpleTimeSlotForm';
import SimpleTimeSlotList from '@/components/admin/SimpleTimeSlotList';
import BulkTimeSlotCreator from '@/components/admin/BulkTimeSlotCreator';
import TimeSlotCalendar from '@/components/admin/TimeSlotCalendar';

const AdminTimeSlots = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [timeSlots, setTimeSlots] = useState([]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEditTimeSlot = async (id: string) => {
    console.log('Edit time slot:', id);
    // TODO: Implémenter l'édition
  };

  const handleDeleteTimeSlot = async (timeSlot: any) => {
    console.log('Delete time slot:', timeSlot);
    // TODO: Implémenter la suppression
  };

  const handleCreateTimeSlot = async () => {
    console.log('Create time slot');
    // TODO: Implémenter la création
  };

  const handleSubmitTimeSlot = (data: any) => {
    console.log('Submit time slot:', data);
    // TODO: Implémenter la soumission
    handleRefresh();
  };

  const handleTimeSlotEdit = async (timeSlot: any) => {
    console.log('Time slot edit:', timeSlot);
    // TODO: Implémenter l'édition
  };

  const handleTimeSlotDelete = async (id: string) => {
    console.log('Time slot delete:', id);
    // TODO: Implémenter la suppression
  };

  const handleTimeSlotCreate = async (timeSlot: any) => {
    console.log('Time slot create:', timeSlot);
    // TODO: Implémenter la création
  };

  return (
    <AdminHorizontalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des créneaux horaires</h1>
          <p className="text-gray-600 mt-2">Gérez vos disponibilités pour les consultations</p>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="simple">Créer simple</TabsTrigger>
            <TabsTrigger value="bulk">Création en lot</TabsTrigger>
            <TabsTrigger value="list">Liste complète</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendrier des créneaux</CardTitle>
                <CardDescription>
                  Vue d'ensemble de vos créneaux disponibles et réservés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSlotCalendar 
                  key={refreshKey}
                  timeSlots={timeSlots}
                  onEdit={handleEditTimeSlot}
                  onDelete={handleDeleteTimeSlot}
                  onCreate={handleCreateTimeSlot}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simple" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Créer un créneau simple</CardTitle>
                <CardDescription>
                  Ajoutez un créneau horaire individuel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleTimeSlotForm onSubmit={handleSubmitTimeSlot} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Création en lot</CardTitle>
                <CardDescription>
                  Créez plusieurs créneaux rapidement avec des modèles prédéfinis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BulkTimeSlotCreator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Liste de tous les créneaux</CardTitle>
                <CardDescription>
                  Gérez, modifiez et supprimez vos créneaux existants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleTimeSlotList 
                  key={refreshKey} 
                  timeSlots={timeSlots}
                  onEdit={handleTimeSlotEdit}
                  onDelete={handleTimeSlotDelete}
                  onCreate={handleTimeSlotCreate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminTimeSlots;
