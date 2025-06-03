
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar, 
  Package, 
  Users, 
  Bell,
  Crown,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Nouvelle offre',
      description: 'Créer un service',
      icon: <Package className="h-5 w-5" />,
      action: () => navigate('/admin/offers'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Nouveau créneau',
      description: 'Planifier disponibilité',
      icon: <Calendar className="h-5 w-5" />,
      action: () => navigate('/admin/time-slots'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Demandes prioritaires',
      description: 'Validation urgente',
      icon: <AlertTriangle className="h-5 w-5" />,
      action: () => navigate('/admin/priority-requests'),
      color: 'bg-amber-500 hover:bg-amber-600'
    },
    {
      title: 'Programme Politique',
      description: 'Gestion VIP',
      icon: <Crown className="h-5 w-5" />,
      action: () => navigate('/admin/political-launch'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Réservations',
      description: 'Gérer les RDV',
      icon: <CheckCircle className="h-5 w-5" />,
      action: () => navigate('/admin/bookings'),
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Clients',
      description: 'Liste des profils',
      icon: <Users className="h-5 w-5" />,
      action: () => navigate('/admin/clients'),
      color: 'bg-cyan-500 hover:bg-cyan-600'
    },
    {
      title: 'Notifications',
      description: 'Centre de messages',
      icon: <Bell className="h-5 w-5" />,
      action: () => navigate('/admin/notifications'),
      color: 'bg-rose-500 hover:bg-rose-600'
    },
    {
      title: 'Paramètres',
      description: 'Configuration',
      icon: <Settings className="h-5 w-5" />,
      action: () => navigate('/admin/settings'),
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Actions rapides</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center space-y-2 text-white border-0 ${action.color} transition-all duration-200 hover:scale-105`}
              onClick={action.action}
            >
              {action.icon}
              <div className="text-center">
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
