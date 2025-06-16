
import React from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  Users,
  Clock
} from 'lucide-react';

const AdminAccountingRevenue = () => {
  const revenueStats = [
    {
      title: 'Revenus du mois',
      value: '€45,320',
      change: '+12.5%',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Revenus moyens/client',
      value: '€285',
      change: '+8.1%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Sessions facturées',
      value: '159',
      change: '+15.2%',
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'Croissance mensuelle',
      value: '+18.4%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const revenueByService = [
    { service: 'Coaching individuel', amount: 18500, percentage: 41, sessions: 74 },
    { service: 'Formation en groupe', amount: 12800, percentage: 28, sessions: 32 },
    { service: 'Consultation stratégique', amount: 8900, percentage: 20, sessions: 28 },
    { service: 'Lancement politique VIP', amount: 5120, percentage: 11, sessions: 8 }
  ];

  const monthlyRevenue = [
    { month: 'Janvier', amount: 38200, growth: '+5.2%' },
    { month: 'Février', amount: 42100, growth: '+10.2%' },
    { month: 'Mars', amount: 39800, growth: '-5.5%' },
    { month: 'Avril', amount: 45600, growth: '+14.6%' },
    { month: 'Mai', amount: 41900, growth: '-8.1%' },
    { month: 'Juin', amount: 45320, growth: '+8.2%' }
  ];

  return (
    <SigecLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Revenus</h1>
            <p className="text-gray-600">Suivi détaillé des revenus et performances financières</p>
          </div>
          <div className="space-x-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {revenueStats.map((stat) => {
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
                    <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                      <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue by Service */}
          <Card>
            <CardHeader>
              <CardTitle>Revenus par Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByService.map((item) => (
                  <div key={item.service} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.service}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {item.amount.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{item.sessions} sessions</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Evolution */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyRevenue.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-900">{month.month}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {month.amount.toLocaleString('fr-FR')} €
                      </p>
                      <p className={`text-sm ${
                        month.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {month.growth}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SigecLayout>
  );
};

export default AdminAccountingRevenue;
