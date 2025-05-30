
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
  Settings
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Nouveau créneau',
      description: 'Ajouter des disponibilités',
      icon: <Calendar className="h-5 w-5" />,
      action: () => navigate('/admin/time-slots'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Nouvelle offre',
      description: 'Créer un service',
      icon: <Package className="h-5 w-5" />,
      action: () => navigate('/admin/offers'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Programme Politique',
      description: 'Gestion VIP',
      icon: <Crown className="h-5 w-5" />,
      action: () => navigate('/admin/political-launch'),
      color: 'bg-amber-500 hover:bg-amber-600'
    },
    {
      title: 'Voir clients',
      description: 'Liste des profils',
      icon: <Users className="h-5 w-5" />,
      action: () => navigate('/admin/clients'),
      color: 'bg-purple-500 hover:bg-purple-600'
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
              className={`h-20 flex flex-col items-center justify-center space-y-2 text-white border-0 ${action.color}`}
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
