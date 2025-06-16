
import React, { useState } from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  Key, 
  Database,
  Activity,
  Settings,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock
} from 'lucide-react';

const AdminAdministration = () => {
  const [activeTab, setActiveTab] = useState('users');

  const users = [
    {
      id: 'USR001',
      nom: 'Mamadou Diallo',
      email: 'mamadou.diallo@budget.gov.gn',
      role: 'Directeur Général',
      statut: 'Actif',
      derniereConnexion: '2024-06-16 14:30',
      permissions: ['Toutes']
    },
    {
      id: 'USR002',
      nom: 'Fatoumata Camara',
      email: 'fatoumata.camara@budget.gov.gn',
      role: 'Contrôleur Financier',
      statut: 'Actif',
      derniereConnexion: '2024-06-16 12:15',
      permissions: ['Validation', 'Rapports']
    },
    {
      id: 'USR003',
      nom: 'Ibrahima Sow',
      email: 'ibrahima.sow@budget.gov.gn',
      role: 'Agent Comptable',
      statut: 'Actif',
      derniereConnexion: '2024-06-15 16:45',
      permissions: ['Engagement', 'Paiement']
    },
    {
      id: 'USR004',
      nom: 'Mariama Bah',
      email: 'mariama.bah@budget.gov.gn',
      role: 'Assistant',
      statut: 'Inactif',
      derniereConnexion: '2024-06-10 09:20',
      permissions: ['Consultation']
    }
  ];

  const roles = [
    {
      id: 'ROLE001',
      nom: 'Directeur Général',
      description: 'Accès complet au système',
      utilisateurs: 1,
      permissions: ['Toutes les permissions']
    },
    {
      id: 'ROLE002',
      nom: 'Contrôleur Financier',
      description: 'Validation des dépenses et rapports',
      utilisateurs: 1,
      permissions: ['Validation dépenses', 'Génération rapports', 'Consultation budgets']
    },
    {
      id: 'ROLE003',
      nom: 'Agent Comptable',
      description: 'Gestion des engagements et paiements',
      utilisateurs: 1,
      permissions: ['Création engagements', 'Traitement paiements', 'Consultation']
    },
    {
      id: 'ROLE004',
      nom: 'Assistant',
      description: 'Consultation uniquement',
      utilisateurs: 1,
      permissions: ['Consultation rapports', 'Consultation budgets']
    }
  ];

  const systemLogs = [
    {
      id: 'LOG001',
      timestamp: '2024-06-16 14:30:15',
      utilisateur: 'Mamadou Diallo',
      action: 'Connexion système',
      module: 'Authentification',
      statut: 'Succès'
    },
    {
      id: 'LOG002',
      timestamp: '2024-06-16 14:25:32',
      utilisateur: 'Fatoumata Camara',
      action: 'Validation dépense EXP001',
      module: 'Dépenses',
      statut: 'Succès'
    },
    {
      id: 'LOG003',
      timestamp: '2024-06-16 14:20:08',
      utilisateur: 'Ibrahima Sow',
      action: 'Création engagement EXP005',
      module: 'Engagements',
      statut: 'Succès'
    },
    {
      id: 'LOG004',
      timestamp: '2024-06-16 14:15:45',
      utilisateur: 'Système',
      action: 'Sauvegarde automatique',
      module: 'Base de données',
      statut: 'Succès'
    }
  ];

  const getStatusColor = (statut: string) => {
    return statut === 'Actif' ? 'default' : 'secondary';
  };

  const tabs = [
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'roles', label: 'Rôles et Permissions', icon: Shield },
    { id: 'logs', label: 'Journaux Système', icon: Activity },
    { id: 'system', label: 'Configuration', icon: Settings }
  ];

  return (
    <SigecLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administration Système</h1>
            <p className="text-gray-600">Gestion des utilisateurs, rôles et configuration système</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Sauvegarde
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Utilisateur</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Rôle</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Dernière connexion</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Permissions</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{user.nom}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">ID: {user.id}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline">{user.role}</Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant={getStatusColor(user.statut)}>
                            {user.statut}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {user.derniereConnexion}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.map((perm, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              {user.statut === 'Actif' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <Card>
            <CardHeader>
              <CardTitle>Rôles et Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <Card key={role.id} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{role.nom}</h3>
                          <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                        </div>
                        <Badge variant="outline">{role.utilisateurs} utilisateur(s)</Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Permissions :</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((perm, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <Card>
            <CardHeader>
              <CardTitle>Journaux d'Activité Système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date/Heure</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Utilisateur</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Module</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemLogs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm font-mono">{log.timestamp}</td>
                        <td className="py-4 px-4 text-sm">{log.utilisateur}</td>
                        <td className="py-4 px-4 text-sm">{log.action}</td>
                        <td className="py-4 px-4">
                          <Badge variant="outline">{log.module}</Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant={log.statut === 'Succès' ? 'default' : 'destructive'}>
                            {log.statut}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Sauvegarde automatique</p>
                    <p className="text-sm text-gray-600">Toutes les 6 heures</p>
                  </div>
                  <Badge variant="default">Activé</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Notifications email</p>
                    <p className="text-sm text-gray-600">Alertes système</p>
                  </div>
                  <Badge variant="default">Activé</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Session timeout</p>
                    <p className="text-sm text-gray-600">8 heures d'inactivité</p>
                  </div>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations Système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version :</span>
                  <span className="font-medium">SIG-Budget v1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base de données :</span>
                  <span className="font-medium">PostgreSQL 14.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Espace disque :</span>
                  <span className="font-medium">2.4 GB / 50 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernière sauvegarde :</span>
                  <span className="font-medium">16/06/2024 12:00</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </SigecLayout>
  );
};

export default AdminAdministration;
