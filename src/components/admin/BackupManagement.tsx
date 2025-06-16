
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Database, Download, RefreshCw, Clock, CheckCircle, XCircle, HardDrive } from 'lucide-react';

interface BackupLog {
  id: string;
  backup_type: string;
  status: string;
  file_size?: number;
  file_path?: string;
  created_by?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export const BackupManagement: React.FC = () => {
  const [backups, setBackups] = useState<BackupLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchBackups = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setBackups(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des sauvegardes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createManualBackup = async () => {
    try {
      setCreating(true);
      
      // Créer un enregistrement de sauvegarde
      const { data, error } = await supabase
        .from('backup_logs')
        .insert([{
          backup_type: 'manual',
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Simuler la création d'une sauvegarde (en production, cela déclencherait un processus côté serveur)
      setTimeout(async () => {
        const fileSize = Math.floor(Math.random() * 100000000) + 10000000; // Taille simulée
        const filePath = `backups/manual_backup_${Date.now()}.sql`;
        
        await supabase
          .from('backup_logs')
          .update({
            status: 'completed',
            file_size: fileSize,
            file_path: filePath,
            completed_at: new Date().toISOString()
          })
          .eq('id', data.id);

        fetchBackups();
        setCreating(false);
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de la création de la sauvegarde:', error);
      setCreating(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des Sauvegardes</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchBackups}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={createManualBackup} disabled={creating}>
            <Database className="h-4 w-4 mr-2" />
            {creating ? 'Création...' : 'Nouvelle sauvegarde'}
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{backups.length}</p>
                <p className="text-sm text-gray-600">Total sauvegardes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {backups.filter(b => b.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Réussies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {backups.filter(b => b.status === 'failed').length}
                </p>
                <p className="text-sm text-gray-600">Échouées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {backups.filter(b => b.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des sauvegardes */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Sauvegardes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backups.map((backup) => {
              const StatusIcon = getStatusIcon(backup.status);
              return (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className="h-5 w-5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">
                          Sauvegarde {backup.backup_type}
                        </p>
                        <Badge variant={getStatusColor(backup.status)}>
                          {backup.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Créée le {new Date(backup.created_at).toLocaleString('fr-FR')}
                        {backup.completed_at && (
                          <span> • Terminée le {new Date(backup.completed_at).toLocaleString('fr-FR')}</span>
                        )}
                      </p>
                      {backup.error_message && (
                        <p className="text-sm text-red-600">Erreur: {backup.error_message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {backup.file_size && (
                      <p className="text-sm text-gray-600">{formatFileSize(backup.file_size)}</p>
                    )}
                    {backup.status === 'completed' && backup.file_path && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
