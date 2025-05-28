
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  Users, 
  CreditCard, 
  Package, 
  Settings, 
  FileText, 
  Clock, 
  Bell
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DashboardStats from '@/components/admin/DashboardStats';
import BookingsList from '@/components/admin/BookingsList';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: 'Créneaux horaires',
      description: 'Gérez les créneaux horaires disponibles pour les consultations',
      icon: <Clock className="h-6 w-6 text-primary" />,
      action: () => navigate('/admin/time-slots')
    },
    {
      title: 'Offres',
      description: 'Gérez les offres et services proposés',
      icon: <Package className="h-6 w-6 text-primary" />,
      action: () => navigate('/admin/offers')
    },
    {
      title: 'Notifications',
      description: 'Consultez les emails et notifications envoyés',
      icon: <Bell className="h-6 w-6 text-primary" />,
      action: () => navigate('/admin/notifications')
    },
    {
      title: 'Paramètres Stripe',
      description: 'Configurez vos paramètres de paiement Stripe',
      icon: <FileText className="h-6 w-6 text-primary" />,
      action: () => navigate('/admin/stripe-settings')
    },
    {
      title: 'Paramètres',
      description: 'Configurez les paramètres généraux de l\'application',
      icon: <Settings className="h-6 w-6 text-primary" />,
      action: () => navigate('/admin/settings')
    }
  ];

  return (
    <div>
      <DashboardStats />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous à venir</CardTitle>
            <CardDescription>Prochains rendez-vous planifiés</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingsList limit={5} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Demandes prioritaires</CardTitle>
            <CardDescription>Rendez-vous prioritaires en attente de confirmation</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingsList priorityOnly limit={5} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={module.action}
          >
            <CardHeader>
              <div className="mb-2">
                {module.icon}
              </div>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default">Accéder</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
