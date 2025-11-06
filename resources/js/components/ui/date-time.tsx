"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "./time-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function DateTimePicker({ id, value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // parse existing value or default to now
  const initialDate = value ? new Date(value) : new Date();
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [time, setTime] = React.useState<string>(() =>
    {
      if (value) return value.split(" ")[1].slice(0, 5);
      return initialDate.toTimeString().slice(0, 5);
    }
  );

  // combine date and time into a single datetime string
  React.useEffect(() => {
    if (date && time && onChange) {
      const [hours, minutes, seconds = 0] = time.split(":").map(Number);
      const combined = new Date(date);
      combined.setHours(hours, minutes, seconds);
      const formatted = `${combined.getFullYear()}-${(combined.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${combined.getDate().toString().padStart(2, "0")} ${combined
      .getHours()
      .toString()
      .padStart(2, "0")}:${combined.getMinutes().toString().padStart(2, "0")}:${combined
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
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
              {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : "Select date"}
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
        <TimePicker
            value={time}
            onChange={(value) => setTime(value)}
        />
      </div>
    </div>
  );
}
