
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Crown } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez votre cabinet de coaching politique avec excellence
          </p>
        </div>
        <div className="flex items-center space-x-2 text-amber-600">
          <Crown className="h-6 w-6" />
          <span className="text-lg font-semibold">Leader du coaching politique</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
