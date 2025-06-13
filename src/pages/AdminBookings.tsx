
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import BookingsList from '@/components/admin/BookingsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Users, TrendingUp } from 'lucide-react';

const AdminBookings = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-8">
        {/* Header moderne */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">
                Gestion des rendez-vous
              </h1>
              <p className="text-gray-600">Consultez et gérez tous les rendez-vous</p>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-gray-700" />
              <span>Liste des rendez-vous</span>
            </CardTitle>
            <CardDescription>
              Tous les rendez-vous programmés et leur statut
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <BookingsList />
          </CardContent>
        </Card>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminBookings;
