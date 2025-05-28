import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from "lucide-react";

export interface Notification {
  id: string;
  type: string;
  subject: string;
  content: string;
  recipient_email: string;
  sender_email: string;
  created_at: string;
  read: boolean;
  sent: boolean;
  metadata?: any;
}

interface NotificationListProps {
  limit?: number;
  type?: string;
  showHeader?: boolean;
}

const NotificationList = ({ limit = 10, type, showHeader = true }: NotificationListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (type) {
          query = query.eq('type', type);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setNotifications(data as Notification[]);
      } catch (err: any) {
        console.error("Error fetching notifications:", err);
        setError(err.message || "Impossible de charger les notifications");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [limit, type]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Aucune notification trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          <Badge variant="outline" className="ml-auto">
            {notifications.length} {notifications.length > 1 ? "notifications" : "notification"}
          </Badge>
        </div>
      )}
      
      {notifications.map((notification) => (
        <Card key={notification.id} className={`${notification.read ? 'bg-gray-50/50' : 'bg-white'} border-l-4 ${notification.type === 'booking_confirmation' ? 'border-l-green-500' : notification.type === 'payment_confirmation' ? 'border-l-blue-500' : 'border-l-gold-500'}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`rounded-full p-2 mr-2 ${notification.type === 'booking_confirmation' ? 'bg-green-100 text-green-700' : notification.type === 'payment_confirmation' ? 'bg-blue-100 text-blue-700' : 'bg-gold-100 text-gold-700'}`}>
                  {notification.type === 'booking_confirmation' ? (
                    <Calendar className="h-4 w-4" />
                  ) : notification.type === 'payment_confirmation' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </div>
                <CardTitle className="text-base">{notification.subject}</CardTitle>
              </div>
              <div className="flex items-center">
                {notification.sent ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Envoyé</Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">En attente</Badge>
                )}
              </div>
            </div>
            <CardDescription className="text-xs flex justify-between mt-1">
              <span>À: {notification.recipient_email}</span>
              <span className="text-gray-400">
                {format(new Date(notification.created_at), 'PPp', { locale: fr })}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 pt-0">
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">
              {notification.content.length > 200 
                ? `${notification.content.substring(0, 200)}...`
                : notification.content}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationList;
