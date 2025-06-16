
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
  BarChart3
} from 'lucide-react';

interface SigecSidebarProps {
  collapsed: boolean;
}

export const SigecSidebar: React.FC<SigecSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
          title: 'Paramètres',
          icon: <Settings className="h-5 w-5" />,
          path: '/admin/settings'
        }
      ]
    }
  ];

  return (
    <div className={`fixed left-0 top-20 bg-white border-r border-gray-200 h-[calc(100vh-80px)] shadow-sm transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <nav className="space-y-6">
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
      </div>
    </div>
  );
};
