
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarInset } from '@/components/ui/sidebar';
import { AdminOverview } from './AdminOverview';
import { TimeSlotManagement } from './TimeSlotManagement';
import { BookingManagement } from './BookingManagement';
import { PoliticalProgramManagement } from './PoliticalProgramManagement';
import { AdminReports } from './AdminReports';
import { AdminSettings } from './AdminSettings';

export const AdminContent = () => {
  return (
    <SidebarInset className="flex-1">
      <div className="p-6">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="time-slots" element={<TimeSlotManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="political-program" element={<PoliticalProgramManagement />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </SidebarInset>
  );
};
