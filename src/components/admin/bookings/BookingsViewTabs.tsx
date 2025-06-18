
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingsTable } from './BookingsTable';
import { BookingsGanttCalendar } from '../BookingsGanttCalendar';
import { CalendarDays, Table as TableIcon } from 'lucide-react';

interface Booking {
  id: string;
  customer_name?: string;
  email?: string;
  topic: string;
  date: string;
  start_time: string;
  end_time: string;
  message?: string;
  is_priority: boolean;
}

interface BookingsViewTabsProps {
  filteredBookings: Booking[];
}

export const BookingsViewTabs = ({ filteredBookings }: BookingsViewTabsProps) => {
  return (
    <Tabs defaultValue="calendar" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Vue Calendrier
        </TabsTrigger>
        <TabsTrigger value="list" className="flex items-center gap-2">
          <TableIcon className="h-4 w-4" />
          Vue Liste
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="calendar" className="space-y-4">
        <BookingsGanttCalendar bookings={filteredBookings} />
      </TabsContent>
      
      <TabsContent value="list" className="space-y-4">
        <BookingsTable bookings={filteredBookings} />
      </TabsContent>
    </Tabs>
  );
};
