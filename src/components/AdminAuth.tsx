
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Crown, Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">
            Dom Consulting
          </h1>
          <p className="text-gray-600 mt-2">Espace Administrateur</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl">Connexion sécurisée</CardTitle>
            <CardDescription>
              Accédez au tableau de bord administrateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domconsulting.com"
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-700 text-center">
                  <strong>Identifiants de démonstration :</strong><br />
                  Email: admin@domconsulting.com<br />
                  Mot de passe: admin123
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-slate-800 to-gray-700 hover:from-slate-900 hover:to-gray-800"
                disabled={loading}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
