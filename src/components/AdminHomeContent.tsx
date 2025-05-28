
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Settings, Clock, FileText, Package2, LogOut, Bell, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

const AdminHomeContent = () => {
  const navigate = useNavigate();
  const [priorityCount, setPriorityCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPriorityBookingsCount = async () => {
      try {
        const { count, error } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('is_priority', true)
          .eq('payment_status', 'pending');
          
        if (!error && count !== null) {
          setPriorityCount(count);
        }
      } catch (err) {
        console.error("Error fetching priority bookings count:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPriorityBookingsCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

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
      icon: <Package2 className="h-6 w-6 text-primary" />,
      action: () => navigate('/admin/offers')
    },
    {
      title: 'Notifications',
      description: 'Consultez les emails et notifications envoyés',
      badge: priorityCount > 0 ? priorityCount : null,
      badgeColor: 'bg-amber-500 text-white',
      icon: priorityCount > 0 
        ? <AlertTriangle className="h-6 w-6 text-amber-500" />
        : <Bell className="h-6 w-6 text-primary" />,
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
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
          <p className="text-gray-500">Gérez votre site et vos services</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="mt-4 md:mt-0">
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>

      {priorityCount > 0 && (
        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <span className="font-medium text-amber-800">
                  {priorityCount} {priorityCount > 1 ? "demandes prioritaires" : "demande prioritaire"} en attente
                </span>
                <Button 
                  variant="link" 
                  className="text-amber-700 p-0 h-auto ml-2"
                  onClick={() => navigate('/admin/notifications')}
                >
                  Consulter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={module.action}
          >
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <div>{module.icon}</div>
                {module.badge && (
                  <Badge className={module.badgeColor}>{module.badge}</Badge>
                )}
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

export default AdminHomeContent;
