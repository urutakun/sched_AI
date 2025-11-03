// "use client";

// import * as React from "react";
// import { Input } from "@/components/ui/input";

// interface TimePickerProps {
//   value?: string;
//   onChange?: (value: string) => void;
// }

// export function TimePicker({ value = "00:00:00", onChange }: TimePickerProps) {
//   const [time, setTime] = React.useState<string>(value);

//   React.useEffect(() => {
//     setTime(value);
//   }, [value]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newTime = e.target.value;
//     setTime(newTime);
//     onChange?.(newTime);
//   };

//   return (
//     <Input
//       type="time"
//       step="1"
//       value={time}
//       onChange={handleChange}
//       className="block w-full"
//     />
//   );
// }

"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hour, setHour] = React.useState("12");
  const [minute, setMinute] = React.useState("00");
  const [ampm, setAmpm] = React.useState("AM");

  // Convert to display format if value exists
  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      let hourNum = parseInt(h);
      const ampmVal = hourNum >= 12 ? "PM" : "AM";
      hourNum = hourNum % 12 || 12;
      setHour(hourNum.toString().padStart(2, "0"));
      setMinute(m);
      setAmpm(ampmVal);
    }
  }, [value]);

  const handleSelect = (newHour: string, newMinute: string, newAmpm: string) => {
    let hour24 = parseInt(newHour);
    if (newAmpm === "PM" && hour24 < 12) hour24 += 12;
    if (newAmpm === "AM" && hour24 === 12) hour24 = 0;
    const formatted = `${hour24.toString().padStart(2, "0")}:${newMinute}`;
    onChange?.(formatted);
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[140px] justify-between"
        >
          <span>
            {hour}:{minute} {ampm}
          </span>
          <Clock className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-3">
        <div className="flex justify-between gap-2">
          {/* Hour list */}
          <ScrollArea className="h-[200px] w-[60px] rounded-md border">
            {hours.map((h) => (
              <div
                key={h}
                onClick={() => {
                  setHour(h);
                  handleSelect(h, minute, ampm);
                }}
                className={cn(
                  "cursor-pointer py-1 text-center hover:bg-custom-secondary hover:bg-accent hover:text-black ctransition",
                  h === hour && "bg-custom-secondary text-primary-foreground"
                )}
              >
                {h}
              </div>
            ))}
          </ScrollArea>

          {/* Minute list */}
          <ScrollArea className="h-[200px] w-[60px] rounded-md border">
            {minutes.map((m) => (
              <div
                key={m}
                onClick={() => {
                  setMinute(m);
                  handleSelect(hour, m, ampm);
                }}
                className={cn(
                  "cursor-pointer py-1 text-center hover:bg-custom-secondary hover:bg-accent hover:text-black ctransition",
                  m === minute && "bg-custom-secondary text-primary-foreground"
                )}
              >
                {m}
              </div>
            ))}
          </ScrollArea>

          {/* AM/PM toggle */}
          <div className="flex flex-col gap-1">
            {["AM", "PM"].map((a) => (
              <Button
                key={a}
                size="sm"
                variant={ampm === a ? "default" : "outline"}
                onClick={() => {
                  setAmpm(a);
                  handleSelect(hour, minute, a);
                }}
              >
                {a}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
