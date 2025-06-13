
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  Bell, 
  Settings, 
  FileText, 
  Users,
  Crown,
  AlertTriangle,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

export const AdminHorizontalNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard' || location.pathname === '/admin'
    },
    {
      title: 'Créneaux',
      icon: <Calendar className="h-4 w-4" />,
      path: '/admin/time-slots'
    },
    {
      title: 'Offres',
      icon: <Package className="h-4 w-4" />,
      path: '/admin/offers'
    },
    {
      title: 'Rendez-vous',
      icon: <CheckCircle className="h-4 w-4" />,
      path: '/admin/bookings'
    },
    {
      title: 'Prioritaires',
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      path: '/admin/priority-requests',
      badge: 'Urgent',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      title: 'Politique',
      icon: <Crown className="h-4 w-4 text-amber-500" />,
      path: '/admin/political-launch',
      badge: 'VIP',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      title: 'Témoignages',
      icon: <MessageSquare className="h-4 w-4" />,
      path: '/admin/testimonials'
    },
    {
      title: 'Notifications',
      icon: <Bell className="h-4 w-4" />,
      path: '/admin/notifications'
    },
    {
      title: 'Clients',
      icon: <Users className="h-4 w-4" />,
      path: '/admin/clients'
    },
    {
      title: 'Stripe',
      icon: <FileText className="h-4 w-4" />,
      path: '/admin/stripe-settings'
    },
    {
      title: 'Paramètres',
      icon: <Settings className="h-4 w-4" />,
      path: '/admin/settings'
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-3 mr-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Dom Consulting</h2>
                <p className="text-xs text-gray-500">Administration</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.active || location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:block">{item.title}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-1 text-xs ${item.badgeColor}`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu dropdown */}
          <div className="md:hidden flex items-center">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={location.pathname}
              onChange={(e) => navigate(e.target.value)}
            >
              {menuItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};
