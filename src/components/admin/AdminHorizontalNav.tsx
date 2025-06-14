
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const AdminHorizontalNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard' || location.pathname === '/admin'
    },
    {
      title: 'Créneaux',
      path: '/admin/time-slots'
    },
    {
      title: 'Offres',
      path: '/admin/offers'
    },
    {
      title: 'Rendez-vous',
      path: '/admin/bookings',
      badge: 'Urgent',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200'
    },
    {
      title: 'Politique',
      path: '/admin/political-launch',
      badge: 'VIP',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      title: 'Témoignages',
      path: '/admin/testimonials'
    },
    {
      title: 'Notifications',
      path: '/admin/notifications'
    },
    {
      title: 'Clients',
      path: '/admin/clients'
    },
    {
      title: 'Stripe',
      path: '/admin/stripe-settings'
    },
    {
      title: 'Paramètres',
      path: '/admin/settings'
    }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-3 mr-8">
              <img 
                src="/lovable-uploads/c6033619-b5e0-4be0-95e1-f9af4d96470c.png" 
                alt="Domani Doré Logo" 
                className="h-10 w-auto" 
              />
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">
                  Dom Consulting
                </h2>
                <p className="text-xs text-gray-500 font-medium">Administration</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-1 overflow-x-auto">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    item.active || location.pathname === item.path
                      ? 'bg-slate-100 text-slate-800 border border-slate-200/50 shadow-sm' 
                      : 'text-gray-600 hover:text-slate-800 hover:bg-gray-50/80'
                  }`}
                >
                  <span className="text-xs lg:text-sm">{item.title}</span>
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

          {/* Bouton de déconnexion */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* Mobile menu dropdown */}
          <div className="md:hidden flex items-center space-x-2">
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
