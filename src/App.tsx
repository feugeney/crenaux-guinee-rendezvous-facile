
import React, { useMemo } from 'react';
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
import NotFound from './pages/NotFound';
import PoliticalLaunchForm from './pages/PoliticalLaunchForm';
import PoliticalLaunchSuccess from './pages/PoliticalLaunchSuccess';
import AdminBudgetDashboard from './pages/AdminBudgetDashboard';
import AdminBudget from './pages/AdminBudget';
import AdminExpenses from './pages/AdminExpenses';
import AdminReports from './pages/AdminReports';
import AdminAdministration from './pages/AdminAdministration';
import AdminSettings from './pages/AdminSettings';

function App() {
  // Create QueryClient inside component to ensure proper React context
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }), []);

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
            
            {/* Admin Budget Routes */}
            <Route path="/admin" element={<AdminBudgetDashboard />} />
            <Route path="/admin/dashboard" element={<AdminBudgetDashboard />} />
            <Route path="/admin/budget" element={<AdminBudget />} />
            <Route path="/admin/expenses" element={<AdminExpenses />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/administration" element={<AdminAdministration />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
