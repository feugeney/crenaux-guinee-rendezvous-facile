
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Package, 
  Bell, 
  Settings, 
  Users, 
  Crown,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import BookingsCalendar from './BookingsCalendar';
import RecentActivity from './RecentActivity';

const ModernDashboardGrid = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Créneaux horaires',
      description: 'Gérer les disponibilités',
      icon: <Calendar className="h-5 w-5" />,
      action: () => navigate('/admin/time-slots'),
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Gestion des offres',
      description: 'Services et tarifs',
      icon: <Package className="h-5 w-5" />,
      action: () => navigate('/admin/offers'),
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      title: 'Rendez-vous',
      description: 'Planification client',
      icon: <CheckCircle className="h-5 w-5" />,
      action: () => navigate('/admin/bookings'),
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      title: 'Clients',
      description: 'Base de données',
      icon: <Users className="h-5 w-5" />,
      action: () => navigate('/admin/clients'),
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
    },
    {
      title: 'Demandes prioritaires',
      description: 'Traitement urgent',
      icon: <AlertTriangle className="h-5 w-5" />,
      action: () => navigate('/admin/priority-requests'),
      color: 'from-amber-500 to-amber-600',
      hoverColor: 'hover:from-amber-600 hover:to-amber-700'
    },
    {
      title: 'Programme VIP',
      description: 'Lancement politique',
      icon: <Crown className="h-5 w-5" />,
      action: () => navigate('/admin/political-launch'),
      color: 'from-gradient-to-r from-amber-400 via-yellow-500 to-amber-600',
      hoverColor: 'hover:from-amber-500 hover:to-yellow-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Actions rapides */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span>Actions rapides</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center space-y-2 text-white border-0 bg-gradient-to-r ${action.color} ${action.hoverColor} transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
                onClick={action.action}
              >
                <div className="flex items-center space-x-2">
                  {action.icon}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendrier principal */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Calendrier des rendez-vous</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookingsCalendar />
            </CardContent>
          </Card>
        </div>

        {/* Activité récente */}
        <div className="space-y-6">
          <RecentActivity />
          
          {/* Liens rapides */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>Paramètres</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/notifications')}
              >
                <Bell className="h-4 w-4 mr-2" />
                Centre de notifications
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/testimonials')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Témoignages clients
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/stripe-settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuration Stripe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboardGrid;
