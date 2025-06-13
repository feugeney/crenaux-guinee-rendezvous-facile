
import React, { useState } from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleTimeSlotCreator from '@/components/admin/SimpleTimeSlotCreator';
import SimpleTimeSlotList from '@/components/admin/SimpleTimeSlotList';
import { Calendar, Clock, BarChart3 } from 'lucide-react';

const AdminTimeSlots = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [timeSlots, setTimeSlots] = useState([]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSubmitTimeSlot = (data: any) => {
    console.log('Submit time slot:', data);
    handleRefresh();
  };

  const handleTimeSlotEdit = async (timeSlot: any) => {
    console.log('Time slot edit:', timeSlot);
  };

  const handleTimeSlotDelete = async (id: string) => {
    console.log('Time slot delete:', id);
  };

  const handleTimeSlotCreate = async (timeSlot: any) => {
    console.log('Time slot create:', timeSlot);
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
                  <Calendar className="h-5 w-5 text-white" />
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <SimpleTimeSlotCreator onSubmit={handleSubmitTimeSlot} />
          </div>
          
          <div>
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
          </div>
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminTimeSlots;
