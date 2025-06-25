
import React from 'react';
import { ModernAdminLayout } from './ModernAdminLayout';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import { ModernStatCard } from './cards/ModernStatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AdminReports = () => {
  return (
    <ModernAdminLayout 
      title="Rapports & Analyses"
      subtitle="Tableaux de bord et statistiques détaillées"
      showBackButton
      actions={
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter Rapport
        </Button>
      }
    >
      <div className="space-y-6">
        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ModernStatCard
            title="Chiffre d'Affaires"
            value="€32,450"
            icon={DollarSign}
            trend={{ value: "+18%", direction: "up" }}
            description="Ce mois"
            color="green"
          />
          <ModernStatCard
            title="Nouveaux Clients"
            value="47"
            icon={Users}
            trend={{ value: "+22%", direction: "up" }}
            description="Ce mois"
            color="blue"
          />
          <ModernStatCard
            title="Taux de Conversion"
            value="68%"
            icon={TrendingUp}
            trend={{ value: "+5%", direction: "up" }}
            description="Candidatures → Clients"
            color="purple"
          />
          <ModernStatCard
            title="Satisfaction Client"
            value="4.8/5"
            icon={Calendar}
            trend={{ value: "+0.2", direction: "up" }}
            description="Note moyenne"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Évolution du Chiffre d'Affaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Graphique des revenus mensuels</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Acquisition de Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Graphique d'acquisition clients</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Rapports Détaillés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Rapport Mensuel</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Analyse Clients</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Rapport Financier</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};
