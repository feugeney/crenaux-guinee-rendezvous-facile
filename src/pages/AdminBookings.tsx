
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminBookings = () => {
  const navigate = useNavigate();

  const bookingCategories = [
    {
      title: 'Demandes prioritaires en attente',
      description: 'Demandes urgentes nécessitant une validation rapide',
      count: 8,
      icon: AlertTriangle,
      color: 'orange',
      path: '/admin/bookings-pending',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Rendez-vous confirmés',
      description: 'Tous les rendez-vous validés et programmés',
      count: 45,
      icon: CheckCircle,
      color: 'green',
      path: '/admin/bookings-confirmed',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      title: 'Demandes rejetées',
      description: 'Rendez-vous qui ont été refusés ou annulés',
      count: 12,
      icon: XCircle,
      color: 'red',
      path: '/admin/bookings-rejected',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <AdminHorizontalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Gestion des Rendez-vous
                </h1>
                <p className="text-gray-600">Consultez et gérez tous les types de rendez-vous</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bookingCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.path}
                className={`bg-gradient-to-br ${category.bgGradient} ${category.borderColor} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                onClick={() => navigate(category.path)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 bg-gradient-to-br ${category.gradient} rounded-xl shadow-md`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold text-${category.color}-900`}>
                          {category.count}
                        </p>
                        <p className={`text-xs text-${category.color}-600`}>demandes</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className={`text-lg font-semibold text-${category.color}-800 mb-2`}>
                        {category.title}
                      </h3>
                      <p className={`text-sm text-${category.color}-600 mb-4`}>
                        {category.description}
                      </p>
                    </div>

                    <Button 
                      variant="outline" 
                      className={`w-full group-hover:bg-${category.color}-100 transition-colors flex items-center justify-center space-x-2`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(category.path);
                      }}
                    >
                      <span>Voir les détails</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Total</p>
                  <p className="text-2xl font-bold text-blue-900">65</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Taux succès</p>
                  <p className="text-2xl font-bold text-green-900">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">Temps moyen</p>
                  <p className="text-2xl font-bold text-orange-900">2h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Ce mois</p>
                  <p className="text-2xl font-bold text-purple-900">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminBookings;
