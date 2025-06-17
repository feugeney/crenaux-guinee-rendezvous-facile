
import React from 'react';
import { Button } from './ui/button';
import { Calendar, Phone, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ConsultPro</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-600 hover:text-gray-900 transition-colors">
              Services
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              À propos
            </a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="hidden md:flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Button>
            <Button
              onClick={() => navigate('/booking')}
              className="flex items-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Réserver</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
