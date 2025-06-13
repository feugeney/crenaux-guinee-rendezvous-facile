
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import StripeConfigForm from '@/components/StripeConfigForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

const AdminStripeSettings = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuration Stripe</h1>
            <p className="text-gray-600 mt-2">Configurez vos paramètres de paiement</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Paramètres Stripe</CardTitle>
            <CardDescription>
              Configurez vos clés API Stripe pour les paiements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StripeConfigForm />
          </CardContent>
        </Card>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminStripeSettings;
