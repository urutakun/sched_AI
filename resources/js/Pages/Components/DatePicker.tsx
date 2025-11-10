import React, { useState } from 'react'
import { formatDateRange } from "little-date"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getDefaultClassNames  } from 'react-day-picker'

const events = [
  {
    title: "Christmas Party",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Hangout with Spiderman",
    from: "2025-06-12T11:30:00",
    to: "2025-06-12T12:30:00",
  },
  {
    title: "Shat session with lola Flora",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
]

interface DatePickerProps {
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>
}


const DatePicker = ({ setSelectedDate }: DatePickerProps) => {
  const defaultClassNames = getDefaultClassNames();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleChange = (newDate: any): void => {
    setDate(newDate);
    setSelectedDate(newDate ? newDate.toISOString() : null);
  }

  return (
    <Card className="w-full py-4 border-none shadow-none font-dm">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleChange}
          captionLayout='dropdown'
          classNames={{
            today: `bg-muted text-foreground rounded-xl ${defaultClassNames.today}`,
            selected: `[&_[data-selected-single=true]]:!bg-custom-secondary [&_[data-selected-single=true]]:!text-white rounded-2xl focus-visible:ring-0 focus-visible:outline-none outline-none ${defaultClassNames.selected}`,
            root: `w-full bg-transparent ${defaultClassNames.root}`
          }}
          required
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 hover:text-custom-secondary"
            title="Add Event"
          >
            <PlusIcon />
            <span className="sr-only">Add Event</span>
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2">
          {events.map((event) => (
            <div
              key={event.title}
              className="bg-custom-primary after:bg-custom-secondary relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-muted-foreground text-xs">
                {formatDateRange(new Date(event.from), new Date(event.to))}
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

export default DatePicker
