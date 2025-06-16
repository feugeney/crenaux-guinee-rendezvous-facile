
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Archive
} from 'lucide-react';

const SigecDashboard = () => {
  const stats = [
    {
      title: 'Courriers entrants',
      value: '156',
      change: '+12% ce mois',
      icon: Mail,
      color: 'blue'
    },
    {
      title: 'En traitement',
      value: '35',
      subtitle: 'Délai moyen: 3.2 jours',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Traités aujourd\'hui',
      value: '12',
      subtitle: 'Objectif: 15/jour',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Alertes urgentes',
      value: '4',
      subtitle: 'Nécessite attention',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const statusData = [
    { label: 'En cours', value: 35, color: 'bg-orange-500' },
    { label: 'Traités', value: 142, color: 'bg-green-500' },
    { label: 'En attente', value: 23, color: 'bg-yellow-500' },
    { label: 'Archivés', value: 89, color: 'bg-gray-500' }
  ];

  const recentActivities = [
    {
      title: 'Courrier urgent de la Direction Générale',
      time: 'Il y a 15 minutes',
      status: 'urgent'
    },
    {
      title: 'Validation du rapport mensuel',
      time: 'Il y a 1 heure',
      status: 'completed'
    },
    {
      title: 'Affectation nouveau courrier',
      time: 'Il y a 2 heures',
      status: 'pending'
    },
    {
      title: 'Document visé et transmis',
      time: 'Il y a 3 heures',
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble des activités et statistiques du système</p>
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
              <span>Évolution mensuelle</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Courriers entrants et sortants par mois</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Graphique d'évolution</p>
                <div className="flex space-x-4 text-sm">
                  <span>Jan: 45</span>
                  <span>Fév: 52</span>
                  <span>Mar: 48</span>
                  <span>Avr: 61</span>
                  <span>Mai: 58</span>
                  <span>Jun: 67</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Répartition par statut */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Archive className="h-5 w-5" />
              <span>Répartition par statut</span>
            </CardTitle>
            <p className="text-sm text-gray-600">État d'avancement des courriers</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
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
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
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
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
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
