import React, { useState } from 'react'
import { formatDateRange } from "little-date"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getDefaultClassNames } from 'react-day-picker'
import { router, usePage } from '@inertiajs/react'

interface Event {
  id: string;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  type: string;
  dept_id: string;
  location: string;
  status: string;
  department: {
    id: string;
    name: string;
  } | null;
}

interface DatePickerProps {
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  events: Event[];
}

const DatePicker = ({ setSelectedDate, events }: DatePickerProps) => {
  const user = usePage().props.auth.user;
  const defaultClassNames = getDefaultClassNames();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleChange = (newDate: any): void => {
    setDate(newDate);
    setSelectedDate(newDate ? newDate.toISOString() : null);
  }

  // Filter events that occur on the selected date (including multi-day events)
  const eventsForSelectedDate = events.filter(event => {
    if (!date) return false;

    const selectedDateStart = new Date(date);
    selectedDateStart.setHours(0, 0, 0, 0);

    const selectedDateEnd = new Date(date);
    selectedDateEnd.setHours(23, 59, 59, 999);

    const eventStart = new Date(event.start_datetime);
    const eventEnd = new Date(event.end_datetime);

    // Check if the event overlaps with the selected date
    return eventStart <= selectedDateEnd && eventEnd >= selectedDateStart;
  });

  // Format event date range for display
  // const formatEventTime = (start: string, end: string) => {
  //   return formatDateRange(new Date(start), new Date(end));
  // }

  const formatEventTime = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);

    const format = (d: Date) =>
      d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    const formatDate = (d: Date) =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    // If same day → Show short format
    const sameDay =
      s.toDateString() === e.toDateString();

    if (sameDay) {
      return `${format(s)} - ${format(e)}`;
    }

    // If multi-day → include date
    return `${formatDate(s)} ${format(s)} → ${formatDate(e)} ${format(e)}`;
  };

  const handleEventCreation = (): void => {
    router.get('/admin/events/create');
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
        <h1 className='font-bold text-lg'>Events</h1>
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          {user.role === 'admin' && (
            <Button
              variant="ghost"
              size="icon"
              className="size-6 hover:text-custom-secondary"
              title="Add Event"
              onClick={handleEventCreation}
            >
              <PlusIcon />
              <span className="sr-only">Add Event</span>
            </Button>
          )}
        </div>
        <div className="flex w-full flex-col gap-2">
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((event) => (
              <div
                key={event.id}
                className="bg-custom-primary after:bg-custom-secondary relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-muted-foreground text-xs">
                  {formatEventTime(event.start_datetime, event.end_datetime)}
                </div>
                {event.location && (
                  <div className="text-muted-foreground text-xs">
                    Location: {event.location}
                  </div>
                )}
                {event.department && (
                  <div className="text-muted-foreground text-xs">
                    Department: {event.department.name}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm text-center py-4">
              No events for this date
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default DatePicker
