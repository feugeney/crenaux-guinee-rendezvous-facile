
import React from 'react';
import { format, addDays } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PriorityBookingFormProps {
  customDate: string;
  setCustomDate: (date: string) => void;
  customTime: string;
  setCustomTime: (time: string) => void;
  customReason: string;
  setCustomReason: (reason: string) => void;
  handleContinue: () => void;
}

const PriorityBookingForm: React.FC<PriorityBookingFormProps> = ({
  customDate,
  setCustomDate,
  customTime,
  setCustomTime,
  customReason,
  setCustomReason,
  handleContinue
}) => {
  const today = new Date();
  const maxPriorityDate = format(addDays(today, 2), 'yyyy-MM-dd');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demande de rendez-vous prioritaire</CardTitle>
        <CardDescription>
          Obtenez un rendez-vous sous 48h en fonction de la disponibilité du coach
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-amber-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Votre demande sera mise en attente jusqu'à confirmation par notre équipe. Le paiement ne sera possible qu'après validation du créneau.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority-date">Date souhaitée</Label>
              <Input 
                id="priority-date" 
                type="date" 
                min={format(today, 'yyyy-MM-dd')} 
                max={maxPriorityDate}
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
              <p className="text-xs text-gray-500">Sélectionnez une date dans les 48h</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority-time">Heure souhaitée</Label>
              <Input 
                id="priority-time" 
                type="time" 
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority-reason">Raison de l'urgence</Label>
            <Textarea 
              id="priority-reason" 
              placeholder="Veuillez expliquer brièvement pourquoi vous avez besoin d'un rendez-vous prioritaire"
              rows={4}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleContinue}
              disabled={!customDate || !customTime || !customReason}
              className="bg-coaching-600 hover:bg-coaching-700"
            >
              Demander un rendez-vous prioritaire
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityBookingForm;
