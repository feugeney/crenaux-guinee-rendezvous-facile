
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import PoliticalApplicationsList from '@/components/admin/PoliticalApplicationsList';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Calendar, Award, TrendingUp } from 'lucide-react';

const AdminPoliticalLaunchValidated = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Candidatures validées
              </h1>
              <p className="text-gray-600">Suivi des candidatures approuvées et en cours</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <Calendar className="h-5 w-5 text-white" />
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

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-500 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Taux succès</p>
                  <p className="text-2xl font-bold text-amber-900">94%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <PoliticalApplicationsList showOnlyValidated={true} />
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminPoliticalLaunchValidated;
