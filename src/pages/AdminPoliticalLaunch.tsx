
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Clock, CheckCircle, Users, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPoliticalLaunch = () => {
  const navigate = useNavigate();

  return (
    <AdminHorizontalLayout>
      <div className="space-y-8">
        {/* Header VIP */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-amber-500 rounded-xl shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                Programme "Je me lance en politique"
              </h1>
              <p className="text-gray-600">Vue d'ensemble et accès rapide aux candidatures</p>
            </div>
          </div>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">En attente</p>
                  <p className="text-2xl font-bold text-orange-900">5</p>
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
                  <p className="text-sm font-medium text-green-700">Validées</p>
                  <p className="text-2xl font-bold text-green-900">18</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">En formation</p>
                  <p className="text-2xl font-bold text-blue-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Terminées</p>
                  <p className="text-2xl font-bold text-purple-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accès rapide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/political-launch-pending')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Candidatures en attente</CardTitle>
                    <p className="text-gray-600">Candidatures nécessitant votre validation</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-orange-600">5</span>
                <Button onClick={() => navigate('/admin/political-launch-pending')}>
                  Gérer les candidatures
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/political-launch-validated')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Candidatures validées</CardTitle>
                    <p className="text-gray-600">Suivi des candidatures approuvées</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-green-600">18</span>
                <Button onClick={() => navigate('/admin/political-launch-validated')}>
                  Voir le suivi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminPoliticalLaunch;
