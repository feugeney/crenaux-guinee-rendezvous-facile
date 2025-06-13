
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import PriorityBookingsList from '@/components/PriorityBookingsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const AdminPriorityRequests = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Demandes prioritaires</h1>
            <p className="text-gray-600 mt-2">Réservations nécessitant une validation urgente</p>
          </div>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Demandes en attente de validation</span>
            </CardTitle>
            <CardDescription className="text-amber-700">
              Ces demandes nécessitent une réponse rapide pour confirmer la disponibilité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PriorityBookingsList />
          </CardContent>
        </Card>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminPriorityRequests;
