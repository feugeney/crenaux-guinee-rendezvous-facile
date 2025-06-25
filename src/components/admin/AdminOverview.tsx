
import React from 'react';
import ModernDashboardHeader from './ModernDashboardHeader';
import ModernDashboardStats from './ModernDashboardStats';
import ModernDashboardGrid from './ModernDashboardGrid';

export const AdminOverview = () => {
  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <ModernDashboardHeader />
      <ModernDashboardStats />
      <ModernDashboardGrid />
    </div>
  );
};
