
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

interface BookingsStatsProps {
  totalBookings: number;
  expressBookings: number;
  standardBookings: number;
  isDateSelected: boolean;
}

export const BookingsStats = ({
  totalBookings,
  expressBookings,
  standardBookings,
  isDateSelected
}: BookingsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">
                {isDateSelected ? 'Total ce jour' : 'Total à venir'}
              </p>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium">Express</p>
              <p className="text-2xl font-bold">{expressBookings}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Standard</p>
              <p className="text-2xl font-bold">{standardBookings}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
