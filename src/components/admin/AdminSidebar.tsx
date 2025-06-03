
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
  Crown,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const AdminSidebar = () => {
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
      title: 'Gestion des offres',
      icon: <Package className="h-5 w-5" />,
      path: '/admin/offers'
    },
    {
      title: 'Demandes prioritaires',
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      path: '/admin/priority-requests',
      badge: 'Urgent'
    },
    {
      title: 'Créneaux express',
      icon: <Clock className="h-5 w-5 text-emerald-500" />,
      path: '/admin/express-slots',
      badge: 'Express'
    },
    {
      title: 'Lancement Politique',
      icon: <Crown className="h-5 w-5 text-amber-500" />,
      path: '/admin/political-launch',
      badge: 'VIP'
    },
    {
      title: 'Réservations',
      icon: <CheckCircle className="h-5 w-5" />,
      path: '/admin/bookings'
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
    <div className="fixed left-0 top-0 w-64 bg-white border-r border-gray-200 h-screen shadow-lg z-50">
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

        <nav className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                <Badge 
                  variant="secondary" 
                  className={`ml-2 ${
                    item.badge === 'Urgent' ? 'bg-red-100 text-red-800' :
                    item.badge === 'Express' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
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
