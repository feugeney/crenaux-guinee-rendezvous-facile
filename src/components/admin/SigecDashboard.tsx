
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  FileText
} from 'lucide-react';

const SigecDashboard = () => {
  const stats = [
    {
      title: 'Rendez-vous ce mois',
      value: '24',
      change: '+15% ce mois',
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Clients actifs',
      value: '156',
      subtitle: 'Croissance: +12%',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Sessions aujourd\'hui',
      value: '8',
      subtitle: 'Objectif: 10/jour',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      title: 'Demandes urgentes',
      value: '3',
      subtitle: 'Nécessite attention',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const revenueData = [
    { label: 'Consultations', value: 12500, color: 'bg-blue-500' },
    { label: 'Formations', value: 8500, color: 'bg-green-500' },
    { label: 'Coaching VIP', value: 15000, color: 'bg-purple-500' },
    { label: 'Lancement politique', value: 25000, color: 'bg-amber-500' }
  ];

  const recentActivities = [
    {
      title: 'Nouvelle demande de consultation prioritaire',
      time: 'Il y a 15 minutes',
      status: 'urgent'
    },
    {
      title: 'Session de coaching complétée - Client VIP',
      time: 'Il y a 1 heure',
      status: 'completed'
    },
    {
      title: 'Nouveau client inscrit pour formation',
      time: 'Il y a 2 heures',
      status: 'pending'
    },
    {
      title: 'Paiement reçu - Lancement politique',
      time: 'Il y a 3 heures',
      status: 'completed'
    },
    {
      title: 'Rendez-vous programmé pour demain',
      time: 'Il y a 4 heures',
      status: 'pending'
    }
  ];

  const monthlyStats = [
    { month: 'Jan', consultations: 45, revenus: 28500 },
    { month: 'Fév', consultations: 52, revenus: 32400 },
    { month: 'Mar', consultations: 48, revenus: 29800 },
    { month: 'Avr', consultations: 61, revenus: 38200 },
    { month: 'Mai', consultations: 58, revenus: 36500 },
    { month: 'Jun', consultations: 67, revenus: 42100 }
  ];

  return (
    <div className="space-y-6">
      {/* Header simple */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre cabinet de coaching politique</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    {stat.change && (
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    )}
                    {stat.subtitle && (
                      <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                    )}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance mensuelle</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Consultations et revenus par mois</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyStats.map((month) => (
                <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900 w-8">{month.month}</span>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">{month.consultations} consultations</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-green-600">
                      {month.revenus.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Répartition des revenus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Revenus par service</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Répartition du chiffre d'affaires</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {item.value.toLocaleString('fr-FR')} €
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total mensuel</span>
                  <span className="text-lg font-bold text-green-600">
                    {revenueData.reduce((sum, item) => sum + item.value, 0).toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Activités récentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'urgent' ? 'bg-red-500' :
                    activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'urgent' ? 'bg-red-100 text-red-800' :
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status === 'urgent' ? 'Urgent' :
                   activity.status === 'completed' ? 'Terminé' : 'En cours'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SigecDashboard;
