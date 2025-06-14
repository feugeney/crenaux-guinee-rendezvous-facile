
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, Clock, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  clients_count: number;
  bookings_count: number;
  priority_bookings_count: number;
  week_bookings_count: number;
  total_revenue: number;
  growth_rate: number;
}

const ModernDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        const today = new Date().toISOString().split('T')[0];
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Compter les clients
        const { count: clientsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Compter tous les rendez-vous
        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        // Compter les rendez-vous prioritaires
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

        // Calculer le chiffre d'affaires (simulation)
        const totalRevenue = (bookingsCount || 0) * 325; // Prix moyen
        const growthRate = 12.5; // Simulation croissance

        setStats({
          clients_count: clientsCount || 0,
          bookings_count: bookingsCount || 0,
          priority_bookings_count: priorityBookingsCount || 0,
          week_bookings_count: weekBookingsCount || 0,
          total_revenue: totalRevenue,
          growth_rate: growthRate
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setStats({
          clients_count: 0,
          bookings_count: 0,
          priority_bookings_count: 0,
          week_bookings_count: 0,
          total_revenue: 0,
          growth_rate: 0
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Clients actifs",
      value: stats?.clients_count || 0,
      icon: <Users className="h-6 w-6" />,
      description: "Total des profils",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      change: "+12%"
    },
    {
      title: "Chiffre d'affaires",
      value: `${(stats?.total_revenue || 0).toLocaleString('fr-FR')} $`,
      icon: <DollarSign className="h-6 w-6" />,
      description: "Total des revenus",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      change: `+${stats?.growth_rate || 0}%`
    },
    {
      title: "RDV cette semaine",
      value: stats?.week_bookings_count || 0,
      icon: <CalendarDays className="h-6 w-6" />,
      description: "Rendez-vous programmés",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      change: "+8%"
    },
    {
      title: "Demandes prioritaires",
      value: stats?.priority_bookings_count || 0,
      icon: <AlertTriangle className="h-6 w-6" />,
      description: "À traiter en urgence",
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      change: stats?.priority_bookings_count ? "Urgent" : "✓"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r ${stat.gradient} text-white shadow-lg`}>
                {stat.icon}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                stat.change.includes('+') ? 'bg-green-100 text-green-700' : 
                stat.change === 'Urgent' ? 'bg-red-100 text-red-700' : 
                'bg-gray-100 text-gray-700'
              }`}>
                {stat.change}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <div className="flex items-baseline space-x-2">
                {isLoading ? (
                  <div className="h-8 w-24 animate-pulse bg-gray-200 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                )}
              </div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModernDashboardStats;
