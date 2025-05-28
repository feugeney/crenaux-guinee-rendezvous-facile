
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Pour l'instant, utilisons des identifiants fixes de démonstration
  const adminCredentials = {
    email: 'admin@domconsulting.com',
    password: 'admin123'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simuler un délai d'authentification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérification simple des identifiants
      if (email === adminCredentials.email && password === adminCredentials.password) {
        // Stocker l'état de connexion dans le localStorage pour la persistance
        localStorage.setItem('adminAuthenticated', 'true');
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'espace administrateur.",
        });
        onAuthSuccess();
      } else {
        throw new Error('Identifiants incorrects');
      }
    } catch (err: any) {
      console.error("Erreur d'authentification:", err);
      toast({
        title: "Erreur de connexion",
        description: err.message || "Une erreur s'est produite lors de la connexion.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Administration DomConsulting</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder au tableau de bord administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@domconsulting.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Pour la démo: admin@domconsulting.com / admin123
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-coaching-600 hover:bg-coaching-700"
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
