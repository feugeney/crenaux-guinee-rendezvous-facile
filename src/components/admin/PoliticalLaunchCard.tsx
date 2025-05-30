
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Star, 
  Users, 
  DollarSign,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const PoliticalLaunchCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-amber-800">
            <Crown className="h-5 w-5" />
            <span>Programme VIP</span>
          </CardTitle>
          <Badge className="bg-amber-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Exclusif
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-amber-900 mb-2">
            "Je me lance en politique"
          </h3>
          <p className="text-sm text-amber-700">
            Accompagnement personnalisé pour leaders politiques ambitieux
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <DollarSign className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <div className="text-lg font-bold text-gray-900">1500$</div>
            <div className="text-xs text-gray-500">Tarif complet</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <div className="text-lg font-bold text-gray-900">3</div>
            <div className="text-xs text-gray-500">Places/mois</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-gray-700">Coaching individuel premium</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-gray-700">Stratégie politique personnalisée</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-gray-700">Garantie satisfaction</span>
          </div>
        </div>

        <Button 
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          onClick={() => navigate('/admin/political-launch')}
        >
          Gérer le programme
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default PoliticalLaunchCard;
