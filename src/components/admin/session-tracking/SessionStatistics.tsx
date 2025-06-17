
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Clock, CheckCircle, Calendar } from 'lucide-react';
import { PaidApplication } from './types';

interface SessionStatisticsProps {
  applications: PaidApplication[];
  getCompletionPercentage: (application: PaidApplication) => number;
}

export const SessionStatistics = ({ applications, getCompletionPercentage }: SessionStatisticsProps) => {
  const inProgressCount = applications.filter(app => {
    const percentage = getCompletionPercentage(app);
    return percentage > 0 && percentage < 100;
  }).length;

  const completedCount = applications.filter(app => getCompletionPercentage(app) === 100).length;
  const pendingPaymentCount = applications.filter(app => app.status === 'approved').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Total candidatures</p>
              <p className="text-2xl font-bold">{applications.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">En cours</p>
              <p className="text-2xl font-bold">{inProgressCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Terminées</p>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium">En attente paiement</p>
              <p className="text-2xl font-bold">{pendingPaymentCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
