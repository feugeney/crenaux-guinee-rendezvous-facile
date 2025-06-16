
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

export const AdminReports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rapports et statistiques</h1>
        <p className="text-gray-600">Analysez les performances de votre plateforme</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Réservations par mois
            </CardTitle>
            <CardDescription>Évolution des réservations sur l'année</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Graphique des réservations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Taux de conversion
            </CardTitle>
            <CardDescription>Pourcentage de visiteurs qui réservent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Graphique de conversion</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Programmes populaires
            </CardTitle>
            <CardDescription>Classement des programmes les plus demandés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Formation Leadership</span>
                <span className="text-gold-600 font-bold">85%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Campagne Électorale</span>
                <span className="text-gold-600 font-bold">72%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Communication Politique</span>
                <span className="text-gold-600 font-bold">68%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Créneaux les plus demandés
            </CardTitle>
            <CardDescription>Heures de réservation préférées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">14h00 - 16h00</span>
                <span className="text-green-600 font-bold">45 réservations</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">10h00 - 12h00</span>
                <span className="text-green-600 font-bold">38 réservations</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">16h00 - 18h00</span>
                <span className="text-green-600 font-bold">32 réservations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
