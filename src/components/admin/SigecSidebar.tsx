
import React from 'react';
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
  Menu,
  LogOut
} from 'lucide-react';

interface SigecSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const SigecSidebar: React.FC<SigecSidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  const menuSections = [
    {
      title: 'Navigation - Administration',
      items: [
        {
          title: 'Tableau de bord',
          icon: <LayoutDashboard className="h-5 w-5" />,
          path: '/admin/dashboard',
          active: location.pathname === '/admin/dashboard' || location.pathname === '/admin'
        },
        {
          title: 'Notifications',
          icon: <Bell className="h-5 w-5" />,
          path: '/admin/notifications',
          badge: '3'
        }
      ]
    },
    {
      title: 'Gestion des Rendez-vous',
      items: [
        {
          title: 'Créneaux horaires',
          icon: <Calendar className="h-5 w-5" />,
          path: '/admin/time-slots'
        },
        {
          title: 'Demandes prioritaires',
          icon: <AlertTriangle className="h-5 w-5" />,
          path: '/admin/priority-requests',
          badge: '3'
        },
        {
          title: 'Rendez-vous confirmés',
          icon: <CheckCircle className="h-5 w-5" />,
          path: '/admin/bookings-confirmed',
          badge: '24'
        },
        {
          title: 'Lancement politique',
          icon: <Building2 className="h-5 w-5" />,
          path: '/admin/political-launch',
          badge: 'VIP'
        }
      ]
    },
    {
      title: 'Comptabilité',
      items: [
        {
          title: 'Vue d\'ensemble',
          icon: <TrendingUp className="h-5 w-5" />,
          path: '/admin/accounting/overview'
        },
        {
          title: 'Revenus',
          icon: <DollarSign className="h-5 w-5" />,
          path: '/admin/accounting/revenue'
        },
        {
          title: 'Factures',
          icon: <Receipt className="h-5 w-5" />,
          path: '/admin/accounting/invoices'
        },
        {
          title: 'Rapports financiers',
          icon: <PieChart className="h-5 w-5" />,
          path: '/admin/accounting/reports'
        }
      ]
    },
    {
      title: 'Ressources Humaines',
      items: [
        {
          title: 'Équipe',
          icon: <Users className="h-5 w-5" />,
          path: '/admin/hr/team'
        },
        {
          title: 'Performance',
          icon: <BarChart3 className="h-5 w-5" />,
          path: '/admin/hr/performance'
        },
        {
          title: 'Présences',
          icon: <UserCheck className="h-5 w-5" />,
          path: '/admin/hr/attendance'
        }
      ]
    },
    {
      title: 'Communication',
      items: [
        {
          title: 'Témoignages',
          icon: <MessageSquare className="h-5 w-5" />,
          path: '/admin/testimonials'
        },
        {
          title: 'Clients',
          icon: <Users className="h-5 w-5" />,
          path: '/admin/clients'
        }
      ]
    },
    {
      title: 'Configuration',
      items: [
        {
          title: 'Administration',
          icon: <Settings className="h-5 w-5" />,
          path: '/admin/administration'
        },
        {
          title: 'Paramètres',
          icon: <Settings className="h-5 w-5" />,
          path: '/admin/settings'
        },
        {
          title: 'Paramètres Stripe',
          icon: <FileText className="h-5 w-5" />,
          path: '/admin/stripe-settings'
        }
      ]
    }
  ];

  return (
    <div className={`fixed left-0 top-0 bg-white border-r border-gray-200 h-screen shadow-sm transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        {/* Header avec logo et bouton toggle */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/c6033619-b5e0-4be0-95e1-f9af4d96470c.png" 
                alt="Domani Doré Logo" 
                className="h-10 w-auto" 
              />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Administration</h2>
                <p className="text-xs text-gray-500">Dom Consulting</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-gray-100"
            title={collapsed ? "Agrandir le menu" : "Réduire le menu"}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-3">
              {!collapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.path}
                    variant={item.active || location.pathname === item.path ? "default" : "ghost"}
                    className={`w-full justify-start h-10 px-3 ${
                      item.active || location.pathname === item.path
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${collapsed ? 'px-2' : ''}`}
                    onClick={() => navigate(item.path)}
                    title={collapsed ? item.title : undefined}
                  >
                    <div className="flex items-center w-full">
                      {item.icon}
                      {!collapsed && (
                        <>
                          <span className="ml-3 flex-1 text-left text-sm">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className={`ml-2 text-xs ${
                                item.badge === 'VIP' ? 'bg-purple-100 text-purple-800' :
                                item.badge === '3' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bouton de déconnexion */}
        <div className="absolute bottom-6 left-4 right-4">
          <Button
            variant="outline"
            className={`w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 ${
              collapsed ? 'px-2' : 'justify-start'
            }`}
            onClick={handleLogout}
            title={collapsed ? "Déconnexion" : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Déconnexion</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};
