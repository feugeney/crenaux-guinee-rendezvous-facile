
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Plus, Eye, Trash2, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  target_users: string[];
  is_read: boolean;
  created_by?: string;
  created_at: string;
  expires_at?: string;
}

export const SystemNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    expires_at: ''
  });

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('system_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async () => {
    try {
      const { error } = await supabase
        .from('system_notifications')
        .insert([{
          ...newNotification,
          expires_at: newNotification.expires_at || null
        }]);

      if (error) throw error;

      setNewNotification({ title: '', message: '', type: 'info', expires_at: '' });
      setShowCreateForm(false);
      fetchNotifications();
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('system_notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notifications Système</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle notification
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer une notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre</label>
              <input
                type="text"
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="info">Information</option>
                  <option value="success">Succès</option>
                  <option value="warning">Attention</option>
                  <option value="error">Erreur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expiration (optionnel)</label>
                <input
                  type="datetime-local"
                  value={newNotification.expires_at}
                  onChange={(e) => setNewNotification({...newNotification, expires_at: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={createNotification}>Créer</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {notifications.map((notification) => {
          const TypeIcon = getTypeIcon(notification.type);
          return (
            <Card key={notification.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <TypeIcon className="h-5 w-5 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        <Badge variant={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <div className="text-xs text-gray-500">
                        Créé le {new Date(notification.created_at).toLocaleDateString('fr-FR')}
                        {notification.expires_at && (
                          <span> • Expire le {new Date(notification.expires_at).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
