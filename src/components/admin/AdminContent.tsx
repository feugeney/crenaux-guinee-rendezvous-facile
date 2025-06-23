
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminOverview } from './AdminOverview';
import { TimeSlotManagement } from './TimeSlotManagement';
import { BookingManagement } from './BookingManagement';
import { PoliticalProgramManagement } from './PoliticalProgramManagement';
import { AdminReports } from './AdminReports';
import { AdminSettings } from './AdminSettings';
import { ExpressBookings } from './ExpressBookings';
import { StandardBookings } from './StandardBookings';
import { UpcomingBookings } from './UpcomingBookings';
import { PoliticalApplications } from './PoliticalApplications';
import { Planning } from './Planning';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const AdminContent = () => {
  return (
    <SidebarInset className="flex-1">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Panneau d'Administration</h1>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </Button>
      </div>
      <div className="p-6">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="time-slots" element={<TimeSlotManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="bookings/express" element={<ExpressBookings />} />
          <Route path="bookings/standard" element={<StandardBookings />} />
          <Route path="bookings/upcoming" element={<UpcomingBookings />} />
          <Route path="political-program" element={<PoliticalProgramManagement />} />
          <Route path="political-program/applications" element={<PoliticalApplications />} />
          <Route path="planning" element={<Planning />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </SidebarInset>
  );
};
