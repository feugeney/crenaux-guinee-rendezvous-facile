
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleTimeSlotCreatorProps {
  onSubmit?: (data: any) => void;
}

const SimpleTimeSlotCreator = ({ onSubmit }: SimpleTimeSlotCreatorProps) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (startTime >= endTime) {
      toast({
        title: "Erreur",
        description: "L'heure de fin doit être postérieure à l'heure de début",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const timeSlotData = {
        date,
        start_time: startTime,
        end_time: endTime,
        available: !isBlocked,
        is_recurring: false,
        specific_date: date
      };

      if (onSubmit) {
        await onSubmit(timeSlotData);
      }

      toast({
        title: "Succès",
        description: `Créneau ${isBlocked ? 'bloqué' : 'disponible'} créé avec succès`,
      });

      // Reset form
      setDate('');
      setStartTime('09:00');
      setEndTime('10:00');
      setIsBlocked(false);

    } catch (error) {
      console.error('Erreur lors de la création du créneau:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le créneau",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDate('');
    setStartTime('09:00');
    setEndTime('10:00');
    setIsBlocked(false);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-700" />
          <span>Créer un nouveau créneau</span>
        </CardTitle>
        <CardDescription>
          Définissez les détails de votre nouveau créneau horaire
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium">
                Heure de début <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium">
                Heure de fin <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Switch
              id="isBlocked"
              checked={isBlocked}
              onCheckedChange={setIsBlocked}
            />
            <Label htmlFor="isBlocked" className="text-sm font-medium cursor-pointer">
              Créneau bloqué (non disponible)
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Annuler</span>
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Enregistrement...' : 'Enregistrer'}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleTimeSlotCreator;
