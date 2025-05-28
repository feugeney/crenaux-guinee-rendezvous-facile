
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingSuccess from "./pages/BookingSuccess";
import TimeSelection from "./pages/TimeSelection";
import StrategicConsultation from "./pages/StrategicConsultation";
import Payment from "./pages/Payment";
import Shop from "./pages/Shop";
import Subscription from "./pages/Subscription";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTimeSlots from "./pages/AdminTimeSlots";
import AdminOffers from "./pages/AdminOffers";
import AdminSettings from "./pages/AdminSettings";
import AdminStripeSettings from "./pages/AdminStripeSettings";
import AdminNotifications from "./pages/AdminNotifications";
import AdminBookings from "./pages/AdminBookings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/time-selection" element={<TimeSelection />} />
            <Route path="/strategic-consultation" element={<StrategicConsultation />} />
            <Route path="/payment/:bookingId" element={<Payment />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/time-slots" element={<AdminTimeSlots />} />
            <Route path="/admin/offers" element={<AdminOffers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/stripe" element={<AdminStripeSettings />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
