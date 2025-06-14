
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
      start_time: "09:00", 
      end_time: "10:00", 
      available: true,
      is_recurring: isPermanent,
      specific_date: "",
      created_at: "",
      updated_at: ""
    }
  });

  const [creationType, setCreationType] = React.useState<'recurring' | 'specific'>(
    formData?.is_recurring !== false ? 'recurring' : 'specific'
  );

  React.useEffect(() => {
    setValue('is_recurring', creationType === 'recurring');
    if (creationType === 'specific') {
      setValue('day_of_week', 0);
    }
  }, [creationType, setValue]);

  const handleFormSubmit = (data: TimeSlot) => {
    const submitData = {
      ...data,
      is_recurring: creationType === 'recurring',
      specific_date: data.specific_date || null,
      day_of_week: creationType === 'recurring' && data.specific_date 
        ? new Date(data.specific_date).getDay() 
        : data.day_of_week
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
            <SelectItem value="recurring">Créneau récurrent (se répète chaque semaine)</SelectItem>
            <SelectItem value="specific">Créneau spécifique (date unique)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_selection">Date</Label>
        <Input
          id="date_selection"
          type="date"
          {...register("specific_date", { 
            required: "La date est obligatoire" 
          })}
        />
        {formState.errors.specific_date && (
          <p className="text-red-500 text-sm">{formState.errors.specific_date.message}</p>
        )}
        {creationType === 'recurring' && (
          <p className="text-sm text-gray-500">
            Ce créneau se répétera chaque semaine à partir de cette date
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">Heure de début</Label>
          <Input
            id="start_time"
            type="time"
            {...register("start_time", { required: "L'heure de début est obligatoire" })}
          />
          {formState.errors.start_time && (
            <p className="text-red-500 text-sm">{formState.errors.start_time.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">Heure de fin</Label>
          <Input
            id="end_time"
            type="time"
            {...register("end_time", { required: "L'heure de fin est obligatoire" })}
          />
          {formState.errors.end_time && (
            <p className="text-red-500 text-sm">{formState.errors.end_time.message}</p>
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
