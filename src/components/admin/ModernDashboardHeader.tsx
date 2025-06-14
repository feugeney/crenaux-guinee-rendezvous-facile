
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Sparkles, TrendingUp, Calendar } from 'lucide-react';

const ModernDashboardHeader = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Crown className="h-6 w-6 text-amber-300" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Tableau de bord</h1>
                  <p className="text-blue-100">Excellence en coaching politique</p>
                </div>
              </div>
              <p className="text-lg text-blue-50 max-w-2xl">
                Gérez votre cabinet avec style et efficacité. Votre plateforme de coaching politique de nouvelle génération.
              </p>
            </div>
            
            <div className="hidden lg:flex space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-2">
                  <Sparkles className="h-8 w-8 text-amber-300" />
                </div>
                <p className="text-sm text-blue-100">Innovation</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-2">
                  <TrendingUp className="h-8 w-8 text-green-300" />
                </div>
                <p className="text-sm text-blue-100">Croissance</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5"></div>
      </div>
    </div>
  );
};

export default ModernDashboardHeader;
