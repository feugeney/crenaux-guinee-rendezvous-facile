
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
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
        
        const { data: statsData, error } = await supabase.functions.invoke('get-dashboard-stats');
        
        if (error) throw error;
        
        setStats(statsData as DashboardStats);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
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
      link: "clients",
    },
    {
      title: "Total Rendez-vous",
      value: stats?.bookings_count || 0,
      icon: <CalendarDays className="h-8 w-8 text-purple-500" />,
      link: "appointments",
    },
    {
      title: "RDV cette semaine",
      value: stats?.week_bookings_count || 0,
      icon: <Clock className="h-8 w-8 text-green-500" />,
      link: "appointments",
    },
    {
      title: "RDV prioritaires",
      value: stats?.priority_bookings_count || 0,
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      link: "appointments",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
              ) : (
                stat.value
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs w-full justify-center"
              onClick={() => document.querySelector(`[data-state="inactive"][value="${stat.link}"]`)?.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
              )}
            >
              Voir détails
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
