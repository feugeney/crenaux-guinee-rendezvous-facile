
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Bell, 
  Calendar, 
  CheckCircle, 
  Users, 
  DollarSign,
  FileText,
  Settings,
  Building2,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Receipt,
  UserCheck,
  PieChart,
  BarChart3,
  LogOut,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const SigecHorizontalNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  const navigationMenus = [
    {
      title: 'Tableau de bord',
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard' || location.pathname === '/admin'
    },
    {
      title: 'Rendez-vous',
      icon: <Calendar className="h-4 w-4" />,
      items: [
        {
          title: 'Créneaux horaires',
          icon: <Calendar className="h-4 w-4" />,
          path: '/admin/time-slots'
        },
        {
          title: 'Demandes prioritaires',
          icon: <AlertTriangle className="h-4 w-4" />,
          path: '/admin/priority-requests',
          badge: '3'
        },
        {
          title: 'Rendez-vous confirmés',
          icon: <CheckCircle className="h-4 w-4" />,
          path: '/admin/bookings-confirmed',
          badge: '24'
        },
        {
          title: 'Lancement politique',
          icon: <Building2 className="h-4 w-4" />,
          path: '/admin/political-launch',
          badge: 'VIP'
        }
      ]
    },
    {
      title: 'Comptabilité',
      icon: <DollarSign className="h-4 w-4" />,
      items: [
        {
          title: 'Vue d\'ensemble',
          icon: <TrendingUp className="h-4 w-4" />,
          path: '/admin/accounting/overview'
        },
        {
          title: 'Revenus',
          icon: <DollarSign className="h-4 w-4" />,
          path: '/admin/accounting/revenue'
        },
        {
          title: 'Factures',
          icon: <Receipt className="h-4 w-4" />,
          path: '/admin/accounting/invoices'
        },
        {
          title: 'Rapports financiers',
          icon: <PieChart className="h-4 w-4" />,
          path: '/admin/accounting/reports'
        }
      ]
    },
    {
      title: 'RH',
      icon: <Users className="h-4 w-4" />,
      items: [
        {
          title: 'Équipe',
          icon: <Users className="h-4 w-4" />,
          path: '/admin/hr/team'
        },
        {
          title: 'Performance',
          icon: <BarChart3 className="h-4 w-4" />,
          path: '/admin/hr/performance'
        },
        {
          title: 'Présences',
          icon: <UserCheck className="h-4 w-4" />,
          path: '/admin/hr/attendance'
        }
      ]
    },
    {
      title: 'Communication',
      icon: <MessageSquare className="h-4 w-4" />,
      items: [
        {
          title: 'Témoignages',
          icon: <MessageSquare className="h-4 w-4" />,
          path: '/admin/testimonials'
        },
        {
          title: 'Clients',
          icon: <Users className="h-4 w-4" />,
          path: '/admin/clients'
        }
      ]
    },
    {
      title: 'Configuration',
      icon: <Settings className="h-4 w-4" />,
      items: [
        {
          title: 'Administration',
          icon: <Settings className="h-4 w-4" />,
          path: '/admin/administration'
        },
        {
          title: 'Paramètres',
          icon: <Settings className="h-4 w-4" />,
          path: '/admin/settings'
        },
        {
          title: 'Paramètres Stripe',
          icon: <FileText className="h-4 w-4" />,
          path: '/admin/stripe-settings'
        }
      ]
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/c6033619-b5e0-4be0-95e1-f9af4d96470c.png" 
              alt="Domani Doré Logo" 
              className="h-8 w-auto" 
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Administration</h1>
              <p className="text-xs text-gray-500">Dom Consulting</p>
            </div>
          </div>

          {/* Menu de navigation */}
          <div className="flex items-center space-x-1">
            {navigationMenus.map((menu) => {
              if (menu.items) {
                return (
                  <DropdownMenu key={menu.title}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        {menu.icon}
                        <span className="text-sm">{menu.title}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {menu.items.map((item) => (
                        <DropdownMenuItem 
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            {item.icon}
                            <span className="text-sm">{item.title}</span>
                          </div>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                item.badge === 'VIP' ? 'bg-purple-100 text-purple-800' :
                                item.badge === '3' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Button
                  key={menu.path}
                  variant={menu.active ? "default" : "ghost"}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm ${
                    menu.active
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => navigate(menu.path)}
                >
                  {menu.icon}
                  <span>{menu.title}</span>
                </Button>
              );
            })}

            {/* Notifications */}
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 text-gray-700 hover:bg-gray-100"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                3
              </Badge>
            </Button>

            {/* Déconnexion */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="ml-4 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
