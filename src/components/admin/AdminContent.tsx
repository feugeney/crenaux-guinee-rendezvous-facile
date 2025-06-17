
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
import { PoliticalApplications } from './PoliticalApplications';
import { RegisteredCandidates } from './RegisteredCandidates';

export const AdminContent = () => {
  return (
    <SidebarInset className="flex-1">
      <div className="flex items-center gap-2 p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Administration</h1>
      </div>
      <div className="p-6">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="time-slots" element={<TimeSlotManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="bookings/express" element={<ExpressBookings />} />
          <Route path="bookings/standard" element={<StandardBookings />} />
          <Route path="political-program" element={<PoliticalProgramManagement />} />
          <Route path="political-program/applications" element={<PoliticalApplications />} />
          <Route path="political-program/candidates" element={<RegisteredCandidates />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </SidebarInset>
  );
};
