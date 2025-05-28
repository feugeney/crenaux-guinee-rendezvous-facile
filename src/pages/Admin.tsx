
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminAuth from '@/components/AdminAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingsList from '@/components/admin/BookingsList';
import ClientsList from '@/components/admin/ClientsList';
import AdminDashboard from '@/pages/AdminDashboard';
import TestimonialsAdmin from '@/components/admin/TestimonialsAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, UserPlus, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [clientSearch, setClientSearch] = useState<string>("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de l'espace administrateur.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <AdminAuth onAuthSuccess={handleAuthSuccess} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-coaching-900">Administration</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
          </TabsList>
          
          {/* Tableau de bord principal */}
          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>
          
          {/* Gestion des rendez-vous */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des rendez-vous</CardTitle>
                <CardDescription>
                  Consultez, modifiez et annulez les rendez-vous planifiés.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Rendez-vous à venir</h3>
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" /> Planifier manuellement
                    </Button>
                  </div>
                  
                  <BookingsList />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Gestion des produits */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des produits</CardTitle>
                <CardDescription>
                  Ajoutez, modifiez et supprimez les produits de votre boutique.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Liste des produits</h3>
                    <Button variant="outline" size="sm">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Gérer la boutique
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <div className="p-4 text-center text-gray-500">
                      Accédez à la boutique pour gérer vos produits en mode administrateur.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Gestion des clients */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des clients</CardTitle>
                <CardDescription>
                  Consultez et gérez votre base clients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h3 className="text-lg font-medium">Liste des clients</h3>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher un client..."
                          className="pl-8"
                          value={clientSearch}
                          onChange={(e) => setClientSearch(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" /> Ajouter un client
                      </Button>
                    </div>
                  </div>
                  
                  <ClientsList searchTerm={clientSearch} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Gestion des témoignages */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des témoignages</CardTitle>
                <CardDescription>
                  Approuvez et gérez les témoignages clients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestimonialsAdmin />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
