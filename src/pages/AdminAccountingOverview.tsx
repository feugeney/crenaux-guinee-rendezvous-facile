
import React from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Receipt,
  PieChart,
  BarChart3
} from 'lucide-react';

const AdminAccountingOverview = () => {
  const monthlyStats = [
    {
      title: 'Revenus totaux',
      value: '€45,320',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Consultations payées',
      value: '89',
      change: '+8.1%',
      trend: 'up',
      icon: Calendar
    },
    {
      title: 'Factures émises',
      value: '156',
      change: '+15.2%',
      trend: 'up',
      icon: Receipt
    },
    {
      title: 'Taux de conversion',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  const recentTransactions = [
    {
      client: 'Marie Dubois',
      service: 'Consultation stratégique',
      amount: '€250',
      date: '2024-01-15',
      status: 'Payé'
    },
    {
      client: 'Jean Martin',
      service: 'Coaching politique',
      amount: '€180',
      date: '2024-01-14',
      status: 'En attente'
    },
    {
      client: 'Sophie Laurent',
      service: 'Formation leadership',
      amount: '€320',
      date: '2024-01-13',
      status: 'Payé'
    }
  ];

  return (
    <ModernAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comptabilité</h1>
            <p className="text-gray-500">Vue d'ensemble financière</p>
          </div>
          <div className="space-x-3">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Exporter rapport
            </Button>
            <Button>
              <Receipt className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {monthlyStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Répartition des revenus</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Graphique des revenus par service</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.client}</p>
                      <p className="text-sm text-gray-500">{transaction.service}</p>
                      <p className="text-xs text-gray-400">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{transaction.amount}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'Payé' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminAccountingOverview;
