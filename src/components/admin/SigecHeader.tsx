
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SigecHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logos et titre */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {/* Logo Cabinet */}
              <img 
                src="/lovable-uploads/c6033619-b5e0-4be0-95e1-f9af4d96470c.png" 
                alt="Dom Consulting Logo" 
                className="h-12 w-auto" 
              />
              
              {/* Logo SIGEC */}
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">ADM</span>
              </div>
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Système d'Administration du Cabinet
              </h1>
              <p className="text-sm text-gray-600">
                Dom Consulting - Cabinet de Coaching Politique
              </p>
            </div>
          </div>

          {/* Informations utilisateur */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                3
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
              <User className="h-8 w-8 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Domani Doré</p>
                <p className="text-xs text-gray-600">Administrateur</p>
                <p className="text-xs text-gray-500">Dom Consulting</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
