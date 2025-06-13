
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import BookingsList from '@/components/admin/BookingsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminBookings = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des rendez-vous</h1>
          <p className="text-gray-600 mt-2">Consultez et gérez tous les rendez-vous</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des rendez-vous</CardTitle>
            <CardDescription>
              Tous les rendez-vous programmés et leur statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingsList />
          </CardContent>
        </Card>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminBookings;
