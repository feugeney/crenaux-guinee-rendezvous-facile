
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  clients_count: number;
  bookings_count: number;
  priority_bookings_count: number;
  week_bookings_count: number;
  upcoming_bookings: any[];
}

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les données directement depuis la base de données
        const today = new Date().toISOString().split('T')[0];
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Compter les clients (profiles)
        const { count: clientsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Compter tous les rendez-vous
        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        // Compter les rendez-vous prioritaires en attente
        const { count: priorityBookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('is_priority', true)
          .eq('payment_status', 'pending');

        // Compter les rendez-vous de cette semaine
        const { count: weekBookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .gte('date', startOfWeek.toISOString().split('T')[0])
          .lte('date', endOfWeek.toISOString().split('T')[0]);

        // Récupérer les prochains rendez-vous
        const { data: upcomingBookings } = await supabase
          .from('bookings')
          .select('*')
          .gte('date', today)
          .order('date', { ascending: true })
          .order('start_time', { ascending: true })
          .limit(5);

        setStats({
          clients_count: clientsCount || 0,
          bookings_count: bookingsCount || 0,
          priority_bookings_count: priorityBookingsCount || 0,
          week_bookings_count: weekBookingsCount || 0,
          upcoming_bookings: upcomingBookings || []
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        // En cas d'erreur, afficher des valeurs par défaut
        setStats({
          clients_count: 0,
          bookings_count: 0,
          priority_bookings_count: 0,
          week_bookings_count: 0,
          upcoming_bookings: []
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Clients",
      value: stats?.clients_count || 0,
      icon: <Users className="h-8 w-8 text-blue-500" />,
      description: "Total des profils clients"
    },
    {
      title: "Total Rendez-vous",
      value: stats?.bookings_count || 0,
      icon: <CalendarDays className="h-8 w-8 text-purple-500" />,
      description: "Toutes les réservations"
    },
    {
      title: "RDV cette semaine",
      value: stats?.week_bookings_count || 0,
      icon: <Clock className="h-8 w-8 text-green-500" />,
      description: "Rendez-vous programmés"
    },
    {
      title: "RDV prioritaires",
      value: stats?.priority_bookings_count || 0,
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      description: "En attente de traitement"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className="text-2xl font-bold mt-2">
                  {isLoading ? (
                    <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className="ml-2">
                {stat.icon}
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
