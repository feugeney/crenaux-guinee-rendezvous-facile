
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
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Calculator,
  DollarSign,
  UserCheck,
  TrendingUp,
  Receipt,
  Building2
} from 'lucide-react';

export const ModernAdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  const menuSections = [
    {
      title: 'Principal',
      items: [
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
        }
      ]
    },
    {
      title: 'Rendez-vous',
      items: [
        {
          title: 'Tous les rendez-vous',
          icon: <CheckCircle className="h-5 w-5" />,
          path: '/admin/bookings'
        },
        {
          title: 'Demandes prioritaires',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          path: '/admin/priority-requests',
          badge: 'Urgent'
        },
        {
          title: 'Lancement Politique',
          icon: <Building2 className="h-5 w-5 text-purple-500" />,
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
          icon: <TrendingUp className="h-5 w-5 text-green-500" />,
          path: '/admin/accounting/overview'
        },
        {
          title: 'Revenus',
          icon: <DollarSign className="h-5 w-5 text-green-500" />,
          path: '/admin/accounting/revenue'
        },
        {
          title: 'Factures',
          icon: <Receipt className="h-5 w-5 text-blue-500" />,
          path: '/admin/accounting/invoices'
        },
        {
          title: 'Rapport financier',
          icon: <Calculator className="h-5 w-5 text-indigo-500" />,
          path: '/admin/accounting/reports'
        }
      ]
    },
    {
      title: 'Ressources Humaines',
      items: [
        {
          title: 'Équipe',
          icon: <Users className="h-5 w-5 text-blue-500" />,
          path: '/admin/hr/team'
        },
        {
          title: 'Présences',
          icon: <UserCheck className="h-5 w-5 text-green-500" />,
          path: '/admin/hr/attendance'
        },
        {
          title: 'Performance',
          icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
          path: '/admin/hr/performance'
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
          title: 'Notifications',
          icon: <Bell className="h-5 w-5" />,
          path: '/admin/notifications'
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
          title: 'Paramètres Stripe',
          icon: <FileText className="h-5 w-5" />,
          path: '/admin/stripe-settings'
        },
        {
          title: 'Paramètres',
          icon: <Settings className="h-5 w-5" />,
          path: '/admin/settings'
        }
      ]
    }
  ];

  return (
    <div className="fixed left-0 top-0 w-72 bg-white border-r border-gray-200 h-screen shadow-xl z-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-100">
          <img 
            src="/lovable-uploads/c6033619-b5e0-4be0-95e1-f9af4d96470c.png" 
            alt="Domani Doré Logo" 
            className="h-12 w-auto" 
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Administration</h2>
            <p className="text-sm text-gray-500">Dom Consulting</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-8 max-h-[calc(100vh-220px)] overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.path}
                    variant={item.active || location.pathname === item.path ? "default" : "ghost"}
                    className={`w-full justify-start h-11 px-3 ${
                      item.active || location.pathname === item.path
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center w-full">
                      {item.icon}
                      <span className="ml-3 flex-1 text-left text-sm font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={`ml-2 text-xs ${
                            item.badge === 'Urgent' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-purple-100 text-purple-800 border-purple-200'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
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
