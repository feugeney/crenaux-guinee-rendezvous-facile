
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpcomingBookings from '@/components/admin/UpcomingBookings';
import PriorityBookingsList from '@/components/PriorityBookingsList';
import BookingsList from '@/components/admin/BookingsList';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';

const AdminBookings = () => {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
            <p className="text-gray-600 mt-2">
              Gérez tous les rendez-vous et réservations
            </p>
          </div>
        </div>
        
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
    </AdminDashboardLayout>
  );
};

export default AdminBookings;
