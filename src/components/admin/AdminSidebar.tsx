
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  Bell, 
  Settings, 
  FileText, 
  Users,
  LogOut,
  Crown
} from 'lucide-react';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  const menuItems = [
    {
      title: 'Tableau de bord',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard' || location.pathname === '/admin'
    },
    {
      title: 'Créneaux horaires',
      icon: <Calendar className="h-5 w-5" />,
      path: '/admin/time-slots'
    },
    {
      title: 'Offres & Services',
      icon: <Package className="h-5 w-5" />,
      path: '/admin/offers'
    },
    {
      title: 'Lancement Politique',
      icon: <Crown className="h-5 w-5 text-amber-500" />,
      path: '/admin/political-launch',
      badge: 'VIP'
    },
    {
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      path: '/admin/notifications'
    },
    {
      title: 'Clients',
      icon: <Users className="h-5 w-5" />,
      path: '/admin/clients'
    },
    {
      title: 'Paramètres Stripe',
      icon: <FileText className="h-5 w-5" />,
      path: '/admin/stripe-settings'
    },
    {
      title: 'Paramètres',
      icon: <Settings className="h-5 w-5" />,
      path: '/admin/settings'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Dom Consulting</h2>
            <p className="text-sm text-gray-500">Administration</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start h-12 ${
                item.active 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="ml-3 flex-1 text-left">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
};
