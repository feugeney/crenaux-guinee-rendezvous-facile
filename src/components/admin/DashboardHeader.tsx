
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, TrendingUp, Users, Calendar } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-gray-700 to-slate-800 bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-gray-600 text-lg">
            Gérez votre cabinet de coaching politique avec excellence
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-amber-50 px-6 py-3 rounded-2xl border border-purple-100">
          <Crown className="h-6 w-6 text-purple-600" />
          <div className="text-right">
            <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
              Leader du coaching politique
            </span>
            <p className="text-sm text-gray-500">Excellence & Innovation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Performance</p>
                <p className="text-2xl font-bold text-blue-900">Excellente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Clients actifs</p>
                <p className="text-2xl font-bold text-green-900">+150</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Consultations</p>
                <p className="text-2xl font-bold text-purple-900">Planifiées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHeader;
