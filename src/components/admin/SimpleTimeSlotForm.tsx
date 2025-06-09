
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface SimpleTimeSlot {
  id?: string;
  specific_date: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

interface SimpleTimeSlotFormProps {
  onSubmit: (data: SimpleTimeSlot) => void;
  onCancel?: () => void;
  initialData?: SimpleTimeSlot;
  isSubmitting?: boolean;
}

const SimpleTimeSlotForm: React.FC<SimpleTimeSlotFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SimpleTimeSlot>({
    defaultValues: initialData || {
      specific_date: new Date().toISOString().split('T')[0],
      start_time: "09:00",
      end_time: "10:00",
      available: true
    }
  });

  const handleFormSubmit = (data: SimpleTimeSlot) => {
    // Validation simple des heures
    if (data.start_time >= data.end_time) {
      alert("L'heure de fin doit être postérieure à l'heure de début");
      return;
    }
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Modifier le créneau" : "Créer un nouveau créneau"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="specific_date">Date *</Label>
            <Input
              id="specific_date"
              type="date"
              {...register("specific_date", { 
                required: "La date est obligatoire" 
              })}
            />
            {errors.specific_date && (
              <p className="text-red-500 text-sm mt-1">{errors.specific_date.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Heure de début *</Label>
              <Input
                id="start_time"
                type="time"
                {...register("start_time", { 
                  required: "L'heure de début est obligatoire" 
                })}
              />
              {errors.start_time && (
                <p className="text-red-500 text-sm mt-1">{errors.start_time.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="end_time">Heure de fin *</Label>
              <Input
                id="end_time"
                type="time"
                {...register("end_time", { 
                  required: "L'heure de fin est obligatoire" 
                })}
              />
              {errors.end_time && (
                <p className="text-red-500 text-sm mt-1">{errors.end_time.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={!watch("available")}
              onCheckedChange={(checked) => setValue("available", !checked)}
            />
            <Label htmlFor="available" className="text-sm">
              Créneau bloqué (non disponible)
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleTimeSlotForm;
