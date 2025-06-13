
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const AdminSettings = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paramètres généraux</h1>
            <p className="text-gray-600 mt-2">Configuration de l'application</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du site</CardTitle>
              <CardDescription>
                Paramètres généraux de votre site web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Les paramètres généraux seront bientôt disponibles ici.
                </p>
                <Button variant="outline">
                  Configurer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sauvegarde et restauration</CardTitle>
              <CardDescription>
                Gérez vos données et sauvegardes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Options de sauvegarde et restauration à venir.
                </p>
                <Button variant="outline">
                  Créer une sauvegarde
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminSettings;
