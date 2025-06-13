
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import BookingsList from '@/components/admin/BookingsList';
import PriorityBookingsList from '@/components/PriorityBookingsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Users, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminBookings = () => {
  return (
    <AdminHorizontalLayout>
      <div className="min-h-screen w-full space-y-6">
        {/* Header moderne */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Gestion des Rendez-vous Prioritaires Urgent
                </h1>
                <p className="text-gray-600">Consultez et gérez tous les rendez-vous et demandes prioritaires</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-500 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700">Urgent</p>
                  <p className="text-2xl font-bold text-red-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Aujourd'hui</p>
                  <p className="text-2xl font-bold text-blue-900">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Cette semaine</p>
                  <p className="text-2xl font-bold text-green-900">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Ce mois</p>
                  <p className="text-2xl font-bold text-purple-900">87</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <div className="w-full">
          <Tabs defaultValue="priority" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="priority" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Demandes Prioritaires Urgent</span>
              </TabsTrigger>
              <TabsTrigger value="regular" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Rendez-vous Confirmés</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="priority" className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 backdrop-blur-sm border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 rounded-t-lg">
                  <CardTitle className="text-orange-800 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 animate-pulse" />
                    <span>Demandes Prioritaires en attente de validation</span>
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    Ces demandes nécessitent une réponse rapide pour confirmer la disponibilité (traitement sous 48h)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <PriorityBookingsList />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="regular" className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-gray-700" />
                    <span>Liste des rendez-vous confirmés</span>
                  </CardTitle>
                  <CardDescription>
                    Tous les rendez-vous programmés et confirmés avec paiement
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <BookingsList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminBookings;
