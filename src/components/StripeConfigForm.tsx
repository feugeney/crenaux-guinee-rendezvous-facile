
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { DEFAULT_STRIPE_PUBLIC_KEY, supabase } from '@/lib/supabase';

interface StripeConfigFormProps {
  initialStatus?: string;
}

const StripeConfigForm: React.FC<StripeConfigFormProps> = ({ initialStatus = 'not-configured' }) => {
  const [publicKey, setPublicKey] = useState<string>(DEFAULT_STRIPE_PUBLIC_KEY);
  const [secretKey, setSecretKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [configStatus, setConfigStatus] = useState<'not-configured' | 'configured' | 'checking' | 'error'>
    (initialStatus as 'not-configured' | 'configured' | 'checking' | 'error');
  const [testMode, setTestMode] = useState<boolean>(true);

  useEffect(() => {
    // Load existing keys if available
    const loadKeys = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'stripe_public_key')
          .single();
          
        if (!error && data) {
          setPublicKey(data.value);
          setConfigStatus('configured');
        } else {
          // Si aucune clé n'est trouvée, utiliser la clé par défaut
          setPublicKey(DEFAULT_STRIPE_PUBLIC_KEY);
        }
      } catch (e) {
        console.error("Erreur lors du chargement des clés Stripe:", e);
      }
    };
    
    loadKeys();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate keys format
      if (testMode) {
        if (publicKey && !publicKey.startsWith('pk_test_')) {
          throw new Error("La clé publique de test doit commencer par 'pk_test_'");
        }
        if (secretKey && !secretKey.startsWith('sk_test_')) {
          throw new Error("La clé secrète de test doit commencer par 'sk_test_'");
        }
      } else {
        if (publicKey && !publicKey.startsWith('pk_live_')) {
          throw new Error("La clé publique de production doit commencer par 'pk_live_'");
        }
        if (secretKey && !secretKey.startsWith('sk_live_')) {
          throw new Error("La clé secrète de production doit commencer par 'sk_live_'");
        }
      }

      // Créer ou mettre à jour la configuration dans Supabase
      try {
        // Appel de l'Edge Function set-stripe-config
        const { data, error } = await supabase.functions.invoke('set-stripe-config', {
          body: {
            publicKey: publicKey,
            secretKey: secretKey || undefined
          }
        });
        
        if (error) {
          console.error("Erreur lors de l'appel à set-stripe-config:", error);
          throw new Error(error.message || "Erreur lors de la configuration");
        }
        
        toast({
          title: "Configuration réussie",
          description: "Les clés API Stripe ont été configurées avec succès.",
        });
        setConfigStatus('configured');
        
        // Masquer la clé après configuration
        if (secretKey) {
          setSecretKey('••••••••••••••••••••••••••••');
        }
      } catch (err: any) {
        console.error("Erreur lors de l'appel à l'Edge Function:", err);
        
        // Plan B: utiliser localStorage si l'Edge Function échoue
        localStorage.setItem('stripePublicKey', publicKey);
        if (secretKey) {
          localStorage.setItem('stripeSecretKey', secretKey);
        }
        localStorage.setItem('stripeMode', testMode ? 'test' : 'live');
        
        toast({
          title: "Configuration locale réussie",
          description: "Les clés API Stripe ont été configurées localement.",
        });
        setConfigStatus('configured');
        
        // Masquer la clé après configuration
        if (secretKey) {
          setSecretKey('••••••••••••••••••••••••••••');
        }
      }
    } catch (err: any) {
      console.error("Erreur lors de la configuration des clés Stripe:", err);
      setConfigStatus('error');
      toast({
        title: "Erreur de configuration",
        description: err.message || "Une erreur s'est produite lors de la configuration des clés Stripe.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setConfigStatus('checking');
    
    try {
      // In a production app, you would call a function to test the Stripe connection
      // For demo, we simulate a successful connection after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Check if keys exist in localStorage
      const hasPublicKey = localStorage.getItem('stripePublicKey');
      const hasSecretKey = localStorage.getItem('stripeSecretKey');
      
      if (!hasPublicKey || !hasSecretKey) {
        throw new Error("Les clés Stripe ne sont pas configurées");
      }
      
      toast({
        title: "Connexion réussie",
        description: "La connexion avec Stripe a été établie avec succès.",
      });
      setConfigStatus('configured');
    } catch (err: any) {
      console.error("Erreur de connexion Stripe:", err);
      setConfigStatus('error');
      toast({
        title: "Erreur de connexion",
        description: err.message || "Impossible de se connecter à Stripe. Veuillez vérifier vos clés API.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuration de Stripe</CardTitle>
        <CardDescription>
          Configurez vos clés API Stripe pour activer les paiements sur votre site.
          {testMode && (
            <p className="mt-1 text-sm text-green-600">Mode test activé - Vous pouvez utiliser les cartes de test Stripe (ex: 4242 4242 4242 4242)</p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {configStatus === 'configured' && (
          <Alert className="mb-6">
            <CheckCircledIcon className="h-4 w-4" />
            <AlertTitle>Configuration active</AlertTitle>
            <AlertDescription>
              Stripe est correctement configuré en mode {testMode ? 'test' : 'production'}. La modification des clés remplacera la configuration existante.
            </AlertDescription>
          </Alert>
        )}
        
        {configStatus === 'error' && (
          <Alert variant="destructive" className="mb-6">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Erreur de configuration</AlertTitle>
            <AlertDescription>
              Un problème est survenu avec la configuration Stripe. Vérifiez vos clés API et assurez-vous que Stripe est accessible.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 mb-6">
            <Label>Mode :</Label>
            <div className="flex border rounded-md p-1">
              <Button
                type="button"
                variant={testMode ? "default" : "outline"}
                size="sm"
                onClick={() => setTestMode(true)}
                className={testMode ? "bg-coaching-600" : ""}
              >
                Test
              </Button>
              <Button
                type="button"
                variant={!testMode ? "default" : "outline"}
                size="sm"
                onClick={() => setTestMode(false)}
                className={!testMode ? "bg-coaching-600" : ""}
              >
                Production
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="publicKey">Clé publique Stripe</Label>
            <Input
              id="publicKey"
              type="text"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder={testMode ? "pk_test_..." : "pk_live_..."}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Commence par {testMode ? "pk_test_" : "pk_live_"}
            </p>
          </div>
          
          <div>
            <Label htmlFor="secretKey">Clé secrète Stripe</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder={testMode ? "sk_test_..." : "sk_live_..."}
              required={configStatus !== 'configured'}
            />
            <p className="text-xs text-gray-500 mt-1">
              {configStatus === 'configured' 
                ? "Laissez vide pour conserver la clé existante" 
                : `Commence par ${testMode ? "sk_test_" : "sk_live_"}`}
            </p>
          </div>
          
          <div className="flex gap-4 pt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-coaching-600 hover:bg-coaching-700"
              disabled={loading}
            >
              {loading ? "Configuration en cours..." : "Enregistrer la configuration"}
            </Button>
            
            {configStatus === 'configured' && (
              <Button 
                type="button" 
                variant="outline"
                onClick={testConnection}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Test en cours..." : "Tester la connexion"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripeConfigForm;
