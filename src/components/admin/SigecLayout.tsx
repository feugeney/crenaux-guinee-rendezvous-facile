
import React from 'react';
import { SigecHorizontalNav } from './SigecHorizontalNav';

interface SigecLayoutProps {
  children: React.ReactNode;
}

const SigecLayout: React.FC<SigecLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SigecHorizontalNav />
      <main className="pt-16">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SigecLayout;
