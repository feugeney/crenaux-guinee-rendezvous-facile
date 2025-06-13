
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
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      path: '/admin/priority-requests',
      badge: 'Urgent',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200'
    },
    {
      title: 'Politique',
      icon: <Crown className="h-4 w-4 text-purple-500" />,
      path: '/admin/political-launch',
      badge: 'VIP',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
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
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-3 mr-8">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">
                  Dom Consulting
                </h2>
                <p className="text-xs text-gray-500 font-medium">Administration</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.active || location.pathname === item.path
                      ? 'bg-slate-100 text-slate-800 border border-slate-200/50 shadow-sm' 
                      : 'text-gray-600 hover:text-slate-800 hover:bg-gray-50/80'
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:block">{item.title}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-1 text-xs font-medium ${item.badgeColor}`}
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
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
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
