
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminAuth from '@/components/AdminAuth';
import { toast } from '@/components/ui/use-toast';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      // Rediriger vers le dashboard
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigate('/admin/dashboard');
    toast({
      title: "Connexion réussie",
      description: "Bienvenue dans l'espace administrateur.",
    });
  };

  if (isAuthenticated) {
    return null; // La redirection se fait dans useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AdminAuth onAuthSuccess={handleAuthSuccess} />
      <Footer />
    </div>
  );
};

export default Admin;
