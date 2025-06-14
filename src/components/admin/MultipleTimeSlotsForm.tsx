
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { TimeSlot } from '@/types';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from 'lucide-react';

interface MultipleTimeSlotsData {
  date: string;
  slots: Array<{
    start_time: string;
    end_time: string;
    available: boolean;
  }>;
  is_recurring: boolean;
}

interface MultipleTimeSlotsFormProps {
  onSubmit: (slots: TimeSlot[]) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const MultipleTimeSlotsForm: React.FC<MultipleTimeSlotsFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const { register, handleSubmit, control, formState, watch, setValue } = useForm<MultipleTimeSlotsData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      slots: [
        { start_time: "09:00", end_time: "10:00", available: true }
      ],
      is_recurring: false
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slots"
  });

  const [creationType, setCreationType] = useState<'recurring' | 'specific'>('specific');

  React.useEffect(() => {
    setValue('is_recurring', creationType === 'recurring');
  }, [creationType, setValue]);

  const addTimeSlot = () => {
    append({ start_time: "09:00", end_time: "10:00", available: true });
  };

  const removeTimeSlot = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleFormSubmit = async (data: MultipleTimeSlotsData) => {
    const timeSlots: TimeSlot[] = data.slots.map((slot, index) => ({
      id: `temp-${index}`,
      day_of_week: data.is_recurring ? new Date(data.date).getDay() : 0,
      start_time: slot.start_time,
      end_time: slot.end_time,
      available: slot.available,
      is_recurring: data.is_recurring,
      specific_date: data.date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    await onSubmit(timeSlots);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Type de créneaux</Label>
        <Select 
          value={creationType} 
          onValueChange={(value: 'recurring' | 'specific') => setCreationType(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recurring">Créneaux récurrents (se répètent chaque semaine)</SelectItem>
            <SelectItem value="specific">Créneaux spécifiques (date unique)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register("date", { required: "La date est obligatoire" })}
        />
        {formState.errors.date && (
          <p className="text-red-500 text-sm">{formState.errors.date.message}</p>
        )}
        {creationType === 'recurring' && (
          <p className="text-sm text-gray-500">
            Ces créneaux se répéteront chaque semaine à partir de cette date
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-medium">Créneaux horaires</Label>
          <Button type="button" onClick={addTimeSlot} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un créneau
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Créneau {index + 1}</h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeTimeSlot(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`slots.${index}.start_time`}>Heure de début</Label>
                <Input
                  id={`slots.${index}.start_time`}
                  type="time"
                  {...register(`slots.${index}.start_time`, { 
                    required: "L'heure de début est obligatoire" 
                  })}
                />
                {formState.errors.slots?.[index]?.start_time && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.slots[index]?.start_time?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`slots.${index}.end_time`}>Heure de fin</Label>
                <Input
                  id={`slots.${index}.end_time`}
                  type="time"
                  {...register(`slots.${index}.end_time`, { 
                    required: "L'heure de fin est obligatoire" 
                  })}
                />
                {formState.errors.slots?.[index]?.end_time && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.slots[index]?.end_time?.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id={`slots.${index}.available`}
                  checked={watch(`slots.${index}.available`)}
                  onCheckedChange={(checked) => 
                    setValue(`slots.${index}.available`, Boolean(checked))
                  }
                />
                <label
                  htmlFor={`slots.${index}.available`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Disponible
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : `Créer ${fields.length} créneau${fields.length > 1 ? 's' : ''}`}
        </Button>
      </div>
    </form>
  );
};

export default MultipleTimeSlotsForm;
