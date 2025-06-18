
import { 
  Calendar, 
  BookOpen, 
  Flag, 
  BarChart3, 
  Settings,
  Home,
  Clock,
  CalendarCheck,
  Users,
  UserPlus,
  CheckCircle,
  FileText,
  CalendarDays
} from 'lucide-react';

export interface MenuItem {
  title: string;
  url: string;
  icon: any;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  title: string;
  url: string;
  icon: any;
}

export const menuItems: MenuItem[] = [
  { 
    title: 'Tableau de bord', 
    url: '/admin', 
    icon: Home 
  },
  { 
    title: 'Gestion des créneaux', 
    url: '/admin/time-slots', 
    icon: Calendar 
  },
  { 
    title: 'Gestion des réservations', 
    url: '/admin/bookings', 
    icon: BookOpen,
    submenu: [
      {
        title: 'Validation Express',
        url: '/admin/bookings/express',
        icon: Clock
      },
      {
        title: 'Réservations Standard',
        url: '/admin/bookings/standard',
        icon: CalendarCheck
      },
      {
        title: 'Rendez-vous à venir',
        url: '/admin/bookings/upcoming',
        icon: CalendarDays
      }
    ]
  },
  { 
    title: 'Programme politique', 
    url: '/admin/political-program', 
    icon: Flag,
    submenu: [
      {
        title: 'Validation des candidatures',
        url: '/admin/political-program/applications',
        icon: CheckCircle
      },
      {
        title: 'Suivi des séances',
        url: '/admin/political-program/candidates',
        icon: FileText
      }
    ]
  },
  { 
    title: 'Rapports', 
    url: '/admin/reports', 
    icon: BarChart3 
  },
  { 
    title: 'Paramètres', 
    url: '/admin/settings', 
    icon: Settings 
  },
];
