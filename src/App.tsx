
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Admin from './pages/Admin';
import AdminOffers from './pages/AdminOffers';
import AdminStripeSettings from './pages/AdminStripeSettings';
import AdminSettings from './pages/AdminSettings';
import AdminTimeSlots from './pages/AdminTimeSlots';
import AdminNotifications from './pages/AdminNotifications';
import StrategicConsultation from './pages/StrategicConsultation';
import TimeSelection from './pages/TimeSelection';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingSuccess from './pages/BookingSuccess';
import Payment from './pages/Payment';
import Subscription from './pages/Subscription';
import Shop from './pages/Shop';
import NotFound from './pages/NotFound';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/offers" element={<AdminOffers />} />
          <Route path="/admin/stripe-settings" element={<AdminStripeSettings />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/time-slots" element={<AdminTimeSlots />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/strategic-consultation" element={<StrategicConsultation />} />
          <Route path="/time-selection" element={<TimeSelection />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
