
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import NotificationList from '@/components/NotificationList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminNotifications = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centre de notifications</h1>
          <p className="text-gray-600 mt-2">Consultez tous les emails et notifications envoyés</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historique des notifications</CardTitle>
            <CardDescription>
              Liste de tous les emails et messages envoyés depuis l'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationList />
          </CardContent>
        </Card>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminNotifications;
