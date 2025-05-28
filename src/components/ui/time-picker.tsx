
import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  defaultValue?: string
  className?: string
  label?: string
}

export function TimePicker({ 
  value, 
  onChange, 
  disabled, 
  defaultValue = "12:00", 
  className = "", 
  label 
}: TimePickerProps) {
  // Generate hours from 8:00 to 20:00 (8am to 8pm)
  const hours = []
  for (let i = 8; i <= 20; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`
    hours.push(`${hour}:00`)
    hours.push(`${hour}:30`)
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 opacity-50" />
        <Select 
          value={value} 
          onValueChange={onChange}
          disabled={disabled}
          defaultValue={defaultValue}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une heure" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
