
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const Header = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/shop', label: 'Nos offres' },
    { href: '/admin', label: 'Admin' }
  ];

  const renderNavLinks = () => (
    <ul className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
      {navLinks.map((link) => (
        <li key={link.href}>
          <Link 
            to={link.href} 
            className={`text-gray-700 hover:text-gold-800 font-medium text-sm ${
              location.pathname === link.href ? 'text-gold-800 font-semibold' : ''
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="py-1 border-b border-gray-100 bg-white">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/e6025925-4f10-4a38-8780-a74241fe823d.png" 
            alt="Logo" 
            className="h-8 w-auto" 
          />
          <span className="ml-2 text-xs text-gray-600">
            Ici, commence ton ascension politique et professionnelle
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex-1 flex justify-center">
            {renderNavLinks()}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px]">
                <div className="py-6">
                  <Link to="/" className="flex items-center mb-6">
                    <img 
                      src="/lovable-uploads/e6025925-4f10-4a38-8780-a74241fe823d.png" 
                      alt="Logo"
                      className="h-10 w-auto"
                    />
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {renderNavLinks()}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
