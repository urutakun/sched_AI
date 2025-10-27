"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  id?: string;
  value?: string; // expected format: 'YYYY-MM-DD HH:mm:ss'
  onChange?: (value: string) => void;
}

export function DateTimePicker({ id, value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // parse existing value or default to now
  const initialDate = value ? new Date(value) : new Date();
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [time, setTime] = React.useState<string>(
    value ? initialDate.toTimeString().slice(0, 8) : "00:00:00"
  );

  // combine date and time into a single datetime string
  React.useEffect(() => {
    if (date && time && onChange) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const combined = new Date(date);
      combined.setHours(hours, minutes, seconds);
      const formatted = combined.toISOString().slice(0, 19).replace("T", " ");
      onChange(formatted);
    }
  }, [date, time]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {/* Date Picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={id}
              className="w-full justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(d) => {
                setDate(d);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        {/* Time Picker */}
        <Input
          type="time"
          step="1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-96"
        />
      </div>
    </div>
  );
}
