
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, Clock, CreditCard, Bell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import StripeConfigForm from '@/components/StripeConfigForm';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gold-900">Paramètres de l'application</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
          >
            Retour au tableau de bord
          </Button>
        </div>
        
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Général</span>
            </TabsTrigger>
            <TabsTrigger value="timeslots" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden md:inline">Créneaux horaires</span>
            </TabsTrigger>
            <TabsTrigger value="stripe" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden md:inline">Configuration Stripe</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Configurez les paramètres généraux de l'application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Cette section est en cours de développement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeslots">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des créneaux horaires</CardTitle>
                <CardDescription>
                  Configurez vos disponibilités pour les rendez-vous.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => navigate('/admin/time-slots')}>
                  Gérer les créneaux horaires
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stripe">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Stripe</CardTitle>
                <CardDescription>
                  Configurez vos paramètres de paiement avec Stripe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StripeConfigForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de notifications</CardTitle>
                <CardDescription>
                  Configurez les modèles et paramètres de notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/admin/notifications')} className="mb-4">
                  Gérer les notifications
                </Button>
                <p className="text-center py-4 text-muted-foreground">
                  La personnalisation des modèles de notifications est en cours de développement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSettings;
