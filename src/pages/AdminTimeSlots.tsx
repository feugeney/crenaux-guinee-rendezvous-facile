
import React, { useState } from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimpleTimeSlotForm from '@/components/admin/SimpleTimeSlotForm';
import SimpleTimeSlotList from '@/components/admin/SimpleTimeSlotList';
import BulkTimeSlotCreator from '@/components/admin/BulkTimeSlotCreator';
import TimeSlotCalendar from '@/components/admin/TimeSlotCalendar';
import { Calendar, Clock, Plus, BarChart3 } from 'lucide-react';

const AdminTimeSlots = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [timeSlots, setTimeSlots] = useState([]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // For TimeSlotCalendar - onEdit expects (timeSlot: TimeSlot) => void
  const handleEditTimeSlot = (timeSlot: any) => {
    console.log('Edit time slot:', timeSlot);
    // TODO: Implémenter l'édition
  };

  // For TimeSlotCalendar - onDelete expects (id: string) => Promise<void>
  const handleDeleteTimeSlot = async (id: string) => {
    console.log('Delete time slot:', id);
    // TODO: Implémenter la suppression
  };

  // For TimeSlotCalendar - onCreate expects (timeSlot: TimeSlot) => Promise<void>
  const handleCreateTimeSlot = async (timeSlot: any) => {
    console.log('Create time slot:', timeSlot);
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
                  <p className="text-2xl font-bold text-green-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">Réservés</p>
                  <p className="text-2xl font-bold text-orange-900">8</p>
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
                  <p className="text-2xl font-bold text-purple-900">67%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="calendar" className="rounded-lg">Calendrier</TabsTrigger>
            <TabsTrigger value="simple" className="rounded-lg">Créer simple</TabsTrigger>
            <TabsTrigger value="bulk" className="rounded-lg">Création en lot</TabsTrigger>
            <TabsTrigger value="list" className="rounded-lg">Liste complète</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-700" />
                  <span>Calendrier des créneaux</span>
                </CardTitle>
                <CardDescription>
                  Vue d'ensemble de vos créneaux disponibles et réservés
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-blue-700" />
                  <span>Créer un créneau simple</span>
                </CardTitle>
                <CardDescription>
                  Ajoutez un créneau horaire individuel
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <SimpleTimeSlotForm onSubmit={handleSubmitTimeSlot} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-700" />
                  <span>Création en lot</span>
                </CardTitle>
                <CardDescription>
                  Créez plusieurs créneaux rapidement avec des modèles prédéfinis
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <BulkTimeSlotCreator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-700" />
                  <span>Liste de tous les créneaux</span>
                </CardTitle>
                <CardDescription>
                  Gérez, modifiez et supprimez vos créneaux existants
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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
