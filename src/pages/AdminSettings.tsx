
import React, { useState } from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SystemNotifications } from '@/components/admin/SystemNotifications';
import { BackupManagement } from '@/components/admin/BackupManagement';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { 
  Settings, 
  Bell, 
  Mail, 
  Database,
  Shield,
  Globe,
  Palette,
  Save,
  RefreshCw,
  Server,
  Users
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { settings, updateSetting, loading } = useSystemSettings();

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'system', label: 'Système', icon: Database },
    { id: 'backup', label: 'Sauvegardes', icon: Server },
    { id: 'appearance', label: 'Apparence', icon: Palette }
  ];

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || '';
  };

  const handleSettingChange = async (key: string, value: string) => {
    await updateSetting(key, value);
  };

  const handleSave = () => {
    console.log('Paramètres sauvegardés');
  };

  return (
    <SigecLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres Système</h1>
            <p className="text-gray-600">Configuration et préférences du système SIG-Budget</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
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

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'Organisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'application
                  </label>
                  <input
                    type="text"
                    value={getSettingValue('app_name')}
                    onChange={(e) => handleSettingChange('app_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version de l'application
                  </label>
                  <input
                    type="text"
                    value={getSettingValue('app_version')}
                    onChange={(e) => handleSettingChange('app_version', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email système
                  </label>
                  <input
                    type="email"
                    value={getSettingValue('system_email')}
                    onChange={(e) => handleSettingChange('system_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration Système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Mode maintenance</h3>
                    <p className="text-sm text-gray-600">Activer le mode maintenance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={getSettingValue('maintenance_mode') === 'true'}
                      onChange={(e) => handleSettingChange('maintenance_mode', e.target.checked.toString())}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fréquence des sauvegardes (heures)
                  </label>
                  <select
                    value={getSettingValue('backup_frequency')}
                    onChange={(e) => handleSettingChange('backup_frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="1">Toutes les heures</option>
                    <option value="6">Toutes les 6 heures</option>
                    <option value="12">Toutes les 12 heures</option>
                    <option value="24">Quotidienne</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && <SystemNotifications />}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout de session (heures)
                  </label>
                  <select
                    value={getSettingValue('session_timeout')}
                    onChange={(e) => handleSettingChange('session_timeout', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="1">1 heure</option>
                    <option value="4">4 heures</option>
                    <option value="8">8 heures</option>
                    <option value="24">24 heures</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tentatives de connexion max
                  </label>
                  <input
                    type="number"
                    value={getSettingValue('max_login_attempts')}
                    onChange={(e) => handleSettingChange('max_login_attempts', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="1"
                    max="10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications par email</h3>
                    <p className="text-sm text-gray-600">Activer les notifications système</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={getSettingValue('email_notifications') === 'true'}
                      onChange={(e) => handleSettingChange('email_notifications', e.target.checked.toString())}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <Card>
            <CardHeader>
              <CardTitle>Informations Système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application :</span>
                    <span className="font-medium">{getSettingValue('app_name')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version :</span>
                    <span className="font-medium">{getSettingValue('app_version')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode maintenance :</span>
                    <Badge variant={getSettingValue('maintenance_mode') === 'true' ? 'destructive' : 'default'}>
                      {getSettingValue('maintenance_mode') === 'true' ? 'Activé' : 'Désactivé'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base de données :</span>
                    <span className="font-medium">PostgreSQL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sauvegarde :</span>
                    <span className="font-medium">Toutes les {getSettingValue('backup_frequency')}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dernière activité :</span>
                    <span className="font-medium">{new Date().toLocaleString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && <BackupManagement />}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation de l'Interface</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Thème</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border-2 border-blue-500 rounded-lg p-4 cursor-pointer">
                    <div className="w-full h-16 bg-blue-50 rounded mb-2"></div>
                    <p className="text-center text-sm font-medium">Clair (Actuel)</p>
                  </div>
                  <div className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400">
                    <div className="w-full h-16 bg-gray-800 rounded mb-2"></div>
                    <p className="text-center text-sm font-medium">Sombre</p>
                  </div>
                  <div className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400">
                    <div className="w-full h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded mb-2"></div>
                    <p className="text-center text-sm font-medium">Automatique</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Logo de l'organisation</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Glissez votre logo ici ou</p>
                  <Button variant="outline" size="sm">Choisir un fichier</Button>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG jusqu'à 2MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SigecLayout>
  );
};

export default AdminSettings;
