
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import PoliticalApplicationsList from '@/components/admin/PoliticalApplicationsList';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertCircle } from 'lucide-react';

const AdminPoliticalLaunchPending = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                Candidatures en attente
              </h1>
              <p className="text-gray-600">Candidatures nécessitant votre validation</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-500 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Urgentes</p>
                  <p className="text-2xl font-bold text-amber-900">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Temps moyen</p>
                  <p className="text-2xl font-bold text-blue-900">2j</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <PoliticalApplicationsList showOnlyPending={true} />
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminPoliticalLaunchPending;
