
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, Settings } from 'lucide-react';

const BookingsCalendar = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      {/* Message temporaire */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-blue-700" />
            <span>Calendrier des rendez-vous</span>
          </CardTitle>
          <CardDescription>
            Gestion et visualisation des rendez-vous programmés
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="mb-6">
              <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Vue calendrier temporairement indisponible
            </h3>
            <p className="text-gray-500 mb-4">
              Installation des dépendances FullCalendar en cours...
            </p>
            <div className="flex justify-center">
              <div className="animate-pulse bg-blue-200 h-2 w-48 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsCalendar;
