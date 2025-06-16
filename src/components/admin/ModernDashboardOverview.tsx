
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Clock
} from 'lucide-react';

const ModernDashboardOverview = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Revenus du mois',
      value: '€12,450',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Rendez-vous confirmés',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: CheckCircle,
      color: 'blue'
    },
    {
      title: 'Demandes en attente',
      value: '8',
      change: '-3%',
      trend: 'down',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Clients actifs',
      value: '156',
      change: '+5.1%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    }
  ];

  const quickActions = [
    {
      title: 'Nouveau rendez-vous',
      description: 'Créer un créneau urgent',
      icon: Calendar,
      action: () => navigate('/admin/time-slots'),
      color: 'blue'
    },
    {
      title: 'Demandes prioritaires',
      description: '3 demandes en attente',
      icon: AlertTriangle,
      action: () => navigate('/admin/priority-requests'),
      color: 'amber',
      urgent: true
    },
    {
      title: 'Rapport financier',
      description: 'Consulter les performances',
      icon: TrendingUp,
      action: () => navigate('/admin/accounting/reports'),
      color: 'green'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de votre cabinet</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Dernière mise à jour</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 flex items-center ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-4 w-4 mr-1 ${
                        stat.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Actions rapides</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.title}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all ${
                    action.urgent ? 'border-amber-200 bg-amber-50 hover:bg-amber-100' : ''
                  }`}
                  onClick={action.action}
                >
                  <div className="flex items-center justify-between w-full">
                    <IconComponent className={`h-5 w-5 text-${action.color}-600`} />
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernDashboardOverview;
