
import React from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  AlertTriangle,
  FileText,
  CheckCircle,
  Calendar,
  Users
} from 'lucide-react';

const AdminBudgetDashboard = () => {
  const budgetStats = [
    {
      title: 'Budget Total 2024',
      value: '4 500 000 000 FG',
      change: '+2.5% vs 2023',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Recettes Collectées',
      value: '4 500 000 000 FG',
      subtitle: '100.0% du budget',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Engagements',
      value: '3 375 000 000 FG',
      subtitle: '75.0% du budget',
      icon: CreditCard,
      color: 'purple'
    },
    {
      title: 'Paiements Effectués',
      value: '2 580 000 000 FG',
      subtitle: '57.3% d\'exécution',
      icon: CheckCircle,
      color: 'amber'
    }
  ];

  const executionData = [
    {
      category: 'Traitements et salaires du personnel',
      percentage: 60.0,
      paid: '1 500 000 000 FG',
      planned: '2 500 000 000 FG'
    },
    {
      category: 'Fournitures de bureau et services',
      percentage: 60.0,
      paid: '480 000 000 FG',
      planned: '800 000 000 FG'
    },
    {
      category: 'Équipements et infrastructures',
      percentage: 50.0,
      paid: '600 000 000 FG',
      planned: '1 200 000 000 FG'
    }
  ];

  const alerts = [
    {
      title: 'Validation en attente',
      description: '3 dépenses nécessitent une validation du contrôleur financier',
      type: 'urgent',
      icon: AlertTriangle
    },
    {
      title: 'Rapport mensuel',
      description: 'Le rapport de juin doit être soumis avant le 10 juillet',
      type: 'warning',
      icon: FileText
    },
    {
      title: 'Bonne performance',
      description: 'Taux d\'exécution conforme aux objectifs trimestriels',
      type: 'success',
      icon: CheckCircle
    }
  ];

  return (
    <SigecLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600">Vue d'ensemble de l'exécution budgétaire - Établissement Public Administratif de Conakry (EPAC-001)</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">EPAC-001 • Version 1.0</div>
              <Badge variant="outline" className="mt-1">
                SIG-Budget Guinée
              </Badge>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">
                EPA connecté : Établissement Public Administratif de Conakry
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {budgetStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      {stat.change && (
                        <p className="text-sm text-green-600">{stat.change}</p>
                      )}
                      {stat.subtitle && (
                        <p className="text-sm text-gray-500">{stat.subtitle}</p>
                      )}
                    </div>
                    <div className={`p-3 bg-${stat.color}-100 rounded-xl ml-4`}>
                      <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exécution par Nature Économique */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Exécution par Nature Économique</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {executionData.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">{item.category}</h4>
                      <span className="text-lg font-bold text-blue-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Payé: {item.paid}</span>
                      <span>Prévu: {item.planned}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertes et Notifications */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>Alertes et Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => {
                  const IconComponent = alert.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`p-2 rounded-full ${
                        alert.type === 'urgent' ? 'bg-red-100' :
                        alert.type === 'warning' ? 'bg-amber-100' : 'bg-green-100'
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          alert.type === 'urgent' ? 'text-red-600' :
                          alert.type === 'warning' ? 'text-amber-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      </div>
                      <Badge variant={
                        alert.type === 'urgent' ? 'destructive' :
                        alert.type === 'warning' ? 'secondary' : 'default'
                      }>
                        {alert.type === 'urgent' ? 'Urgent' :
                         alert.type === 'warning' ? 'Attention' : 'OK'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Info Footer */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">MD</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Mamadou Diallo</p>
                <p className="text-sm text-gray-600">Directeur Général</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Ministère du Budget - République de Guinée</p>
              <p>Dernière connexion: {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>
      </div>
    </SigecLayout>
  );
};

export default AdminBudgetDashboard;
