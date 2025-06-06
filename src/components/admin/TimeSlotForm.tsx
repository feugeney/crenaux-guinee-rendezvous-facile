
import React from 'react';
import { useForm } from 'react-hook-form';
import { TimeSlot } from '@/types';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimeSlotFormProps {
  timeSlot?: TimeSlot;
  initialData?: TimeSlot;
  onSubmit: (data: TimeSlot) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  isPermanent?: boolean;
  isEditing?: boolean;
  onCancel?: () => void;
}

const TimeSlotForm = ({ 
  timeSlot, 
  initialData, 
  onSubmit, 
  isSubmitting = false, 
  submitButtonText, 
  isPermanent = false,
  isEditing = false,
  onCancel
}: TimeSlotFormProps) => {
  // Use either timeSlot or initialData to support both prop naming conventions
  const formData = timeSlot || initialData;
  
  const { register, handleSubmit, formState, setValue, watch } = useForm<TimeSlot>({
    defaultValues: formData || {
      id: "",
      day_of_week: 1, // Monday
      startTime: "09:00", 
      endTime: "10:00", 
      available: true,
      is_recurring: isPermanent,
      specific_date: null
    }
  });

  const [creationType, setCreationType] = React.useState<'recurring' | 'specific'>(
    formData?.is_recurring !== false ? 'recurring' : 'specific'
  );

  const daysOfWeek = [
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' },
    { value: 0, label: 'Dimanche' },
  ];

  React.useEffect(() => {
    setValue('is_recurring', creationType === 'recurring');
    if (creationType === 'recurring') {
      setValue('specific_date', null);
    }
  }, [creationType, setValue]);

  const handleFormSubmit = (data: TimeSlot) => {
    const submitData = {
      ...data,
      is_recurring: creationType === 'recurring',
      specific_date: creationType === 'specific' ? data.specific_date : null
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Type de créneau</Label>
        <Select 
          value={creationType} 
          onValueChange={(value: 'recurring' | 'specific') => setCreationType(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recurring">Créneau récurrent (chaque semaine)</SelectItem>
            <SelectItem value="specific">Créneau spécifique (date unique)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {creationType === 'recurring' ? (
        <div className="space-y-2">
          <Label htmlFor="day_of_week">Jour de la semaine</Label>
          <select
            id="day_of_week"
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-primary focus:border-primary"
            {...register("day_of_week", { valueAsNumber: true, required: "Le jour de la semaine est obligatoire" })}
          >
            {daysOfWeek.map(day => (
              <option key={day.value} value={day.value}>{day.label}</option>
            ))}
          </select>
          {formState.errors.day_of_week && (
            <p className="text-red-500 text-sm">{formState.errors.day_of_week.message}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="specific_date">Date spécifique</Label>
          <Input
            id="specific_date"
            type="date"
            {...register("specific_date", { 
              required: creationType === 'specific' ? "La date est obligatoire" : false 
            })}
          />
          {formState.errors.specific_date && (
            <p className="text-red-500 text-sm">{formState.errors.specific_date.message}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Heure de début</Label>
          <Input
            id="startTime"
            type="time"
            {...register("startTime", { required: "L'heure de début est obligatoire" })}
          />
          {formState.errors.startTime && (
            <p className="text-red-500 text-sm">{formState.errors.startTime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">Heure de fin</Label>
          <Input
            id="endTime"
            type="time"
            {...register("endTime", { required: "L'heure de fin est obligatoire" })}
          />
          {formState.errors.endTime && (
            <p className="text-red-500 text-sm">{formState.errors.endTime.message}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="available"
          checked={watch("available")}
          onCheckedChange={(checked) => setValue("available", Boolean(checked))}
        />
        <label
          htmlFor="available"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Disponible
        </label>
      </div>
      
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : submitButtonText || "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default TimeSlotForm;
