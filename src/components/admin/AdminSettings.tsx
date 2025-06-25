
import React from 'react';
import { ModernAdminLayout } from './ModernAdminLayout';
import { Button } from '@/components/ui/button';
import { Save, Settings, Shield, Bell, Database, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AdminSettings = () => {
  return (
    <ModernAdminLayout 
      title="Paramètres Système"
      subtitle="Configuration générale de l'application"
      showBackButton
      actions={
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Settings Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* General Settings */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Paramètres Généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nom du Site</Label>
                <Input id="site-name" placeholder="Coaching Politique Pro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email Administrateur</Label>
                <Input id="admin-email" type="email" placeholder="admin@example.com" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance">Mode Maintenance</Label>
                <Switch id="maintenance" />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor">Authentification 2FA</Label>
                <Switch id="two-factor" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-backup">Sauvegarde Auto</Label>
                <Switch id="auto-backup" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Timeout Session (min)</Label>
                <Input id="session-timeout" type="number" placeholder="30" />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif">Notifications Email</Label>
                <Switch id="email-notif" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="booking-alerts">Alertes Réservations</Label>
                <Switch id="booking-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="payment-alerts">Alertes Paiements</Label>
                <Switch id="payment-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-600" />
                Configuration Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-server">Serveur SMTP</Label>
                <Input id="smtp-server" placeholder="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Port SMTP</Label>
                <Input id="smtp-port" placeholder="587" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smtp-ssl">SSL/TLS</Label>
                <Switch id="smtp-ssl" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-gray-600" />
              Informations Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">v2.1.0</p>
                <p className="text-sm text-gray-600">Version Application</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">99.9%</p>
                <p className="text-sm text-gray-600">Disponibilité</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">1.2GB</p>
                <p className="text-sm text-gray-600">Base de Données</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};
