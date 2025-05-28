
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UpcomingBookings from '@/components/admin/UpcomingBookings';
import PriorityBookingsList from '@/components/PriorityBookingsList';
import BookingsList from '@/components/admin/BookingsList';

const AdminBookings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Gestion des Réservations</h1>
          
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming">Rendez-vous à venir</TabsTrigger>
              <TabsTrigger value="priority">Demandes prioritaires</TabsTrigger>
              <TabsTrigger value="all">Toutes les réservations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <UpcomingBookings />
            </TabsContent>
            
            <TabsContent value="priority">
              <PriorityBookingsList limit={50} showHeader={false} />
            </TabsContent>
            
            <TabsContent value="all">
              <BookingsList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminBookings;
