
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import DashboardUpcomingBookings from './DashboardUpcomingBookings';

const ModernDashboardGrid = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Demandes prioritaires',
      description: 'Gérer les demandes urgentes',
      icon: AlertTriangle,
      color: 'orange',
      action: () => navigate('/admin/bookings-pending'),
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    },
    {
      title: 'Rendez-vous confirmés',
      description: 'Voir les RDV validés',
      icon: CheckCircle,
      color: 'green',
      action: () => navigate('/admin/bookings-confirmed'),
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      title: 'Créneaux horaires',
      description: 'Gérer les disponibilités',
      icon: Clock,
      color: 'blue',
      action: () => navigate('/admin/time-slots'),
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Candidatures politiques',
      description: 'Suivi des candidatures',
      icon: Users,
      color: 'purple',
      action: () => navigate('/admin/political-launch'),
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {/* Prochains Rendez-vous - prend 2 colonnes sur xl */}
      <div className="xl:col-span-2">
        <DashboardUpcomingBookings />
      </div>

      {/* Actions rapides */}
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <TrendingUp className="h-5 w-5" />
              <span>Actions Rapides</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={`w-full justify-between p-4 h-auto bg-gradient-to-r ${action.bgGradient} hover:shadow-md transition-all group`}
                  onClick={action.action}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-gradient-to-br ${action.gradient} rounded-lg`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className={`font-medium text-${action.color}-800 text-sm`}>
                        {action.title}
                      </div>
                      <div className={`text-xs text-${action.color}-600`}>
                        {action.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-indigo-800">
              <FileText className="h-5 w-5" />
              <span>Aperçu Rapide</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-900">12</div>
                <div className="text-xs text-indigo-600">RDV ce mois</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">5</div>
                <div className="text-xs text-purple-600">En attente</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernDashboardGrid;
