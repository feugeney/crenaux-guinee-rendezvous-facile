
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Mail, Bell, Shield } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Plateforme de Consultation Politique',
    siteDescription: 'Réservez vos consultations avec nos experts politiques',
    contactEmail: 'contact@politique.fr',
    notificationsEnabled: true,
    emailNotifications: true,
    autoConfirmBookings: false,
    maxBookingsPerDay: 10,
    bookingAdvanceNotice: 24
  });

  const handleSave = () => {
    // Ici, vous sauvegarderiez les paramètres dans la base de données
    toast.success('Paramètres sauvegardés');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Configurez votre plateforme</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres généraux
            </CardTitle>
            <CardDescription>Configuration de base de la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Nom du site</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="siteDescription">Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Email de contact</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>

            <Button onClick={handleSave} className="bg-gold-600 hover:bg-gold-700">
              Sauvegarder
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Gérez les notifications et alertes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications activées</Label>
                <p className="text-sm text-gray-500">Recevoir les notifications système</p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, notificationsEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications par email</Label>
                <p className="text-sm text-gray-500">Recevoir les alertes par email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Confirmation automatique</Label>
                <p className="text-sm text-gray-500">Confirmer automatiquement les réservations</p>
              </div>
              <Switch
                checked={settings.autoConfirmBookings}
                onCheckedChange={(checked) => setSettings({ ...settings, autoConfirmBookings: checked })}
              />
            </div>

            <Button onClick={handleSave} className="bg-gold-600 hover:bg-gold-700">
              Sauvegarder
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Réservations
            </CardTitle>
            <CardDescription>Configuration des règles de réservation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxBookings">Réservations max par jour</Label>
              <Input
                id="maxBookings"
                type="number"
                value={settings.maxBookingsPerDay}
                onChange={(e) => setSettings({ ...settings, maxBookingsPerDay: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="advanceNotice">Préavis minimum (heures)</Label>
              <Input
                id="advanceNotice"
                type="number"
                value={settings.bookingAdvanceNotice}
                onChange={(e) => setSettings({ ...settings, bookingAdvanceNotice: parseInt(e.target.value) })}
              />
            </div>

            <Button onClick={handleSave} className="bg-gold-600 hover:bg-gold-700">
              Sauvegarder
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuration email
            </CardTitle>
            <CardDescription>Paramètres de l'envoi d'emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtpHost">Serveur SMTP</Label>
              <Input
                id="smtpHost"
                placeholder="smtp.gmail.com"
              />
            </div>

            <div>
              <Label htmlFor="smtpPort">Port SMTP</Label>
              <Input
                id="smtpPort"
                type="number"
                placeholder="587"
              />
            </div>

            <div>
              <Label htmlFor="smtpUser">Utilisateur SMTP</Label>
              <Input
                id="smtpUser"
                type="email"
                placeholder="votre@email.com"
              />
            </div>

            <Button onClick={handleSave} className="bg-gold-600 hover:bg-gold-700">
              Tester et sauvegarder
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
