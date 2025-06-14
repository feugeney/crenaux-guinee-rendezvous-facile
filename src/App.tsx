
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Booking from './pages/Booking';
import TimeSelection from './pages/TimeSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingSuccess from './pages/BookingSuccess';
import Payment from './pages/Payment';
import Shop from './pages/Shop';
import Subscription from './pages/Subscription';
import StrategicConsultation from './pages/StrategicConsultation';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminBookingsPending from './pages/AdminBookingsPending';
import AdminBookingsConfirmed from './pages/AdminBookingsConfirmed';
import AdminBookingsRejected from './pages/AdminBookingsRejected';
import AdminTimeSlots from './pages/AdminTimeSlots';
import AdminPriorityRequests from './pages/AdminPriorityRequests';
import AdminOffers from './pages/AdminOffers';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminNotifications from './pages/AdminNotifications';
import AdminSettings from './pages/AdminSettings';
import AdminStripeSettings from './pages/AdminStripeSettings';
import AdminPoliticalLaunch from './pages/AdminPoliticalLaunch';
import AdminPoliticalLaunchSchedule from './pages/AdminPoliticalLaunchSchedule';
import AdminPoliticalLaunchPending from './pages/AdminPoliticalLaunchPending';
import AdminPoliticalLaunchValidated from './pages/AdminPoliticalLaunchValidated';
import NotFound from './pages/NotFound';
import PoliticalLaunchForm from './pages/PoliticalLaunchForm';
import PoliticalLaunchSuccess from './pages/PoliticalLaunchSuccess';

// Create QueryClient instance outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/time-selection" element={<TimeSelection />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/strategic-consultation" element={<StrategicConsultation />} />
            <Route path="/political-launch" element={<PoliticalLaunchForm />} />
            <Route path="/political-launch-success" element={<PoliticalLaunchSuccess />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/bookings-pending" element={<AdminBookingsPending />} />
            <Route path="/admin/bookings-confirmed" element={<AdminBookingsConfirmed />} />
            <Route path="/admin/bookings-rejected" element={<AdminBookingsRejected />} />
            <Route path="/admin/time-slots" element={<AdminTimeSlots />} />
            <Route path="/admin/priority-requests" element={<AdminPriorityRequests />} />
            <Route path="/admin/offers" element={<AdminOffers />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/stripe-settings" element={<AdminStripeSettings />} />
            <Route path="/admin/political-launch" element={<AdminPoliticalLaunch />} />
            <Route path="/admin/political-launch-schedule/:id" element={<AdminPoliticalLaunchSchedule />} />
            <Route path="/admin/political-launch-pending" element={<AdminPoliticalLaunchPending />} />
            <Route path="/admin/political-launch-validated" element={<AdminPoliticalLaunchValidated />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
