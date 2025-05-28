
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotificationList from "@/components/NotificationList";
import PriorityBookingsList from "@/components/PriorityBookingsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

const AdminNotifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // Vérifier l'authentification
  React.useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demandes de RDV prioritaires</CardTitle>
            <CardDescription>
              Gérez les demandes de rendez-vous prioritaires nécessitant une action de votre part
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PriorityBookingsList showHeader={false} limit={5} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications et emails envoyés</CardTitle>
            <CardDescription>
              Consultez les emails de confirmation et les notifications envoyés aux clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="booking_confirmation">Confirmations de réservation</TabsTrigger>
                <TabsTrigger value="priority_booking_request">Demandes prioritaires</TabsTrigger>
                <TabsTrigger value="payment_confirmation">Confirmations de paiement</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-0">
                <NotificationList showHeader={false} limit={20} />
              </TabsContent>
              <TabsContent value="booking_confirmation" className="mt-0">
                <NotificationList showHeader={false} type="booking_confirmation" limit={20} />
              </TabsContent>
              <TabsContent value="priority_booking_request" className="mt-0">
                <NotificationList showHeader={false} type="priority_booking_request" limit={20} />
              </TabsContent>
              <TabsContent value="payment_confirmation" className="mt-0">
                <NotificationList showHeader={false} type="payment_confirmation" limit={20} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminNotifications;
