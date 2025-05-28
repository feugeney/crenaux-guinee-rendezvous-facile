
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StripeConfigForm from '@/components/StripeConfigForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const AdminStripeSettings = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [configStatus, setConfigStatus] = useState<string>("checking");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth !== 'true') {
      // Rediriger vers la page d'admin pour l'authentification
      navigate('/admin');
    } else {
      setIsAuthenticated(true);
      
      // Check if Stripe is configured properly
      const checkStripeConfig = async () => {
        try {
          // Here you would normally call a Supabase function
          // For now, we'll simulate with localStorage
          const hasPublicKey = localStorage.getItem('stripePublicKey');
          const hasSecretKey = localStorage.getItem('stripeSecretKey');
          
          if (hasPublicKey && hasSecretKey) {
            setConfigStatus("configured");
          } else {
            setConfigStatus("not-configured");
          }
        } catch (error) {
          console.error("Error checking Stripe config:", error);
          setConfigStatus("error");
        }
      };
      
      checkStripeConfig();
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container py-8 flex-1">
          <p className="text-center text-gray-600">Vérification de l'authentification...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8 flex-1">
        <h1 className="text-3xl font-bold text-coaching-900 mb-6">Configuration de Stripe</h1>
        
        {configStatus === "error" && (
          <Alert variant="destructive" className="mb-6">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Un problème est survenu lors de la vérification de la configuration Stripe. 
              Assurez-vous que vos clés API sont correctes et que Stripe est accessible.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="max-w-2xl mx-auto">
          <StripeConfigForm initialStatus={configStatus} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminStripeSettings;
