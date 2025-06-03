import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  User, 
  Calendar, 
  Crown,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Bell
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  priority?: boolean;
  status?: string;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      // Récupérer les dernières réservations
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Récupérer les notifications prioritaires
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'priority_booking_request')
        .order('created_at', { ascending: false })
        .limit(3);

      const activityItems: ActivityItem[] = [];

      if (bookings) {
        bookings.forEach(booking => {
          activityItems.push({
            id: booking.id,
            type: 'booking',
            title: booking.is_priority ? 'Demande prioritaire' : 'Nouvelle réservation',
            description: `${booking.customer_name || 'Client'} - ${booking.topic}`,
            timestamp: booking.created_at,
            priority: booking.is_priority,
            status: booking.payment_status
          });
        });
      }

      if (notifications) {
        notifications.forEach(notif => {
          activityItems.push({
            id: notif.id,
            type: 'notification',
            title: 'Demande de coaching politique',
            description: notif.content,
            timestamp: notif.created_at,
            priority: true
          });
        });
      }

      // Trier par date
      activityItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivities(activityItems.slice(0, 6));
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string, priority?: boolean) => {
    if (priority) return <Crown className="h-4 w-4 text-amber-500" />;
    if (type === 'booking') return <Calendar className="h-4 w-4 text-blue-500" />;
    if (type === 'notification') return <Bell className="h-4 w-4 text-purple-500" />;
    return <User className="h-4 w-4 text-gray-500" />;
  };

  const getStatusBadge = (status?: string, priority?: boolean) => {
    if (priority) return <Badge className="bg-amber-100 text-amber-800">Prioritaire</Badge>;
    if (status === 'completed') return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
    if (status === 'pending') return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Activité récente</span>
        </CardTitle>
        <Button variant="ghost" size="sm">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune activité récente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type, activity.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    {getStatusBadge(activity.status, activity.priority)}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(activity.timestamp), 'PPp', { locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
