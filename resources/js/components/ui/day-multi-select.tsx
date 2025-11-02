import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const DayMultiSelect = ({ value, onChange}: DayMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const selected = value || [];

  const toggleDay = (day: string) => {
    let updated = selected.includes(day)
      ? selected.filter((d) => d !== day)
      : [...selected, day];

    updated = updated.sort(
      (a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
    );

    onChange(updated);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
           <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between p-3",
              selected.length === 0 && "text-muted-foreground"
            )}
          >
            {selected.length > 0
              ? selected.join(", ")
              : "Select days"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandGroup>
              {daysOfWeek.map((day) => (
                <CommandItem
                  key={day}
                  onSelect={() => toggleDay(day)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{day}</span>
                  {selected.includes(day) && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
