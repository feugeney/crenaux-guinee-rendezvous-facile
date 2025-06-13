
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import PoliticalLaunchCard from '@/components/admin/PoliticalLaunchCard';
import PoliticalApplicationsList from '@/components/admin/PoliticalApplicationsList';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Star, Users, Award } from 'lucide-react';

const AdminPoliticalLaunch = () => {
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
              <p className="text-gray-600">Gestion des candidatures et du programme VIP</p>
            </div>
          </div>
        </div>

        {/* Stats VIP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Candidatures VIP</p>
                  <p className="text-2xl font-bold text-purple-900">15</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-500 rounded-xl">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Approuvées</p>
                  <p className="text-2xl font-bold text-amber-900">12</p>
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
                  <p className="text-sm font-medium text-green-700">En formation</p>
                  <p className="text-2xl font-bold text-green-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Diplômés</p>
                  <p className="text-2xl font-bold text-blue-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <PoliticalLaunchCard />
          <PoliticalApplicationsList />
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminPoliticalLaunch;
