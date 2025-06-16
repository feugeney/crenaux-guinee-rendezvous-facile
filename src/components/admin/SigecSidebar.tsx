
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Bell, 
  Mail, 
  CheckCircle, 
  Users, 
  FolderOpen,
  FileText,
  Eye,
  Building2,
  User
} from 'lucide-react';

export const SigecSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuSections = [
    {
      title: 'Navigation - Directeur',
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
          badge: '4'
        },
        {
          title: 'Courriers reçus',
          icon: <Mail className="h-5 w-5" />,
          path: '/admin/courriers-recus',
          badge: '156'
        },
        {
          title: 'Validation SG',
          icon: <CheckCircle className="h-5 w-5" />,
          path: '/admin/validation-sg'
        },
        {
          title: 'Affectation Directions',
          icon: <Building2 className="h-5 w-5" />,
          path: '/admin/affectation-directions'
        },
        {
          title: 'Affectation Divisions',
          icon: <Users className="h-5 w-5" />,
          path: '/admin/affectation-divisions'
        },
        {
          title: 'Courriers à valider',
          icon: <FolderOpen className="h-5 w-5" />,
          path: '/admin/courriers-valider',
          badge: '35'
        },
        {
          title: 'Documents à viser',
          icon: <FileText className="h-5 w-5" />,
          path: '/admin/documents-viser',
          badge: '12'
        },
        {
          title: 'Suivi direction',
          icon: <Eye className="h-5 w-5" />,
          path: '/admin/suivi-direction'
        },
        {
          title: 'Ma direction',
          icon: <User className="h-5 w-5" />,
          path: '/admin/ma-direction'
        }
      ]
    }
  ];

  return (
    <div className="fixed left-0 top-20 w-64 bg-white border-r border-gray-200 h-[calc(100vh-80px)] shadow-sm">
      <div className="p-4">
        <nav className="space-y-6">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.path}
                    variant={item.active || location.pathname === item.path ? "default" : "ghost"}
                    className={`w-full justify-start h-10 px-3 ${
                      item.active || location.pathname === item.path
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center w-full">
                      {item.icon}
                      <span className="ml-3 flex-1 text-left text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="ml-2 bg-red-100 text-red-800 text-xs"
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
      </div>
    </div>
  );
};
