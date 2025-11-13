import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Session } from '../Interfaces/Session';
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarEvent from '../Components/CalendarEvent';
import SelectView from '../Components/SelectView';
import TableComponent from '../Components/TableComponent';
import FullCalendar from "@fullcalendar/react";
import '../../../css/full-calendar.css';
import { format } from 'date-fns';
import SessionModal from './SessionModal';

interface ScheduleCalendarProps {
  selectedView: 'timeGridWeek' | 'timeGridDay';
  setSelectedView: React.Dispatch<React.SetStateAction<'timeGridWeek' | 'timeGridDay'>>
  selectedDate?: Date | string;
  sessionList: Session[];
  filters?: React.ReactNode;
  events: any[]
}

interface SessionModalEvent {
  title: string;
  extendedProps: {
    instructor: string;
    room: string;
    program_name: string;
    section: string;
    status: string;
  }
}

type Status = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

const ScheduleCalendar = ({
  selectedView,
  setSelectedView,
  selectedDate,
  sessionList,
  events,
  filters,
}: ScheduleCalendarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<SessionModalEvent | null>(null);
  const [sessions, setSessions] = useState<Session[]>(sessionList || []);
  const calendarRef = useRef<FullCalendar | null>(null);

  // Combine events and sessions with events taking priority
  const getCombinedCalendarEvents = useCallback(() => {
    // Convert sessions to calendar events
    const sessionEvents = sessions.map(session => ({
      id: session.id,
      title: session.title,
      start: session.start,
      end: session.end,
      extendedProps: {
        ...session.extendedProps,
        type: 'session',
        instructor: session.extendedProps.instructor,
        room: session.extendedProps.room,
        program_name: session.extendedProps.program_name,
        program_code: session.extendedProps.program_code,
        section: session.extendedProps.section,
        status: session.extendedProps.status,
      },
      backgroundColor: getStatusColor(session.extendedProps.status),
      borderColor: getStatusColor(session.extendedProps.status),
    }));

    // Convert events to calendar events with higher priority
    const eventEvents = events.map(event => ({
      id: `event-${event.id}`,
      title: event.title,
      start: event.start_datetime,
      end: event.end_datetime,
      extendedProps: {
        ...event,
        type: 'event',
        description: event.description,
        location: event.location,
        department: event.department,
        status: 'event', // Events have special status
      },
      backgroundColor: 'var(--event-color)', // Use a distinct color for events
      borderColor: 'var(--event-color)',
      textColor: '#ffffff',
      // Make events appear on top by using a higher z-index through class names
      classNames: ['calendar-event-priority'],
    }));

    // Return combined array (events will naturally overlay sessions due to rendering order)
    return [...sessionEvents, ...eventEvents];
  }, [sessions, events]);

  // Update the getStatusColor function to handle events
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      upcoming: "var(--light-gray)",
      ongoing: "var(--light-blue)",
      completed: "var(--light-green)",
      cancelled: "var(--light-red)",
      event: "var(--event-color)", // Add event color
    };

    return colors[status] || "#e5e7eb";
  }

  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(selectedView);
    }
  }, [selectedView]);

  const handleStatusUpdate = (id: string, newStatus: Status): void => {
    // Only update sessions, not events
    if (!id.startsWith('event-')) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === id
            ? {
              ...session,
              extendedProps: { ...session.extendedProps, status: newStatus },
            } as Session
            : session
        )
      );

      // Update event color in calendar
      if (calendarRef.current) {
        const calendarAPI = calendarRef.current.getApi();
        const event = calendarAPI.getEventById(id);
        if (event && event.start) {
          const eventData = {
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end || event.start,
            extendedProps: { ...event.extendedProps, status: newStatus },
            backgroundColor: getStatusColor(newStatus),
            borderColor: getStatusColor(newStatus),
          };

          event.remove();
          calendarAPI.addEvent(eventData);
        }
      }
    }
  };

  const handleEventClick = (evt: any) => {
    const event = evt.event;
    const eventType = event.extendedProps.type;

    if (eventType === 'event') {
      // Handle event click - show event details
      setSelectedSession({
        title: event.title,
        extendedProps: {
          instructor: event.extendedProps.department?.name || 'Event',
          room: event.extendedProps.location || 'N/A',
          program_name: event.extendedProps.description || 'Event',
          section: 'Event',
          status: 'event',
        }
      });
    } else {
      // Handle session click
      setSelectedSession({
        title: event.title,
        extendedProps: {
          instructor: event.extendedProps.instructor,
          room: event.extendedProps.room,
          program_name: event.extendedProps.program_name,
          section: event.extendedProps.section,
          status: event.extendedProps.status,
        }
      });
    }
    setIsOpen(true);
  };

  return (
    <div className="date_table cols-span-4 col-span-4 lg:col-span-3 min-h-[400px] w-full bg-white shadow-sm p-4 rounded-2xl">
      {/* HEADER */}
      <div className="header min-h-[40px] lg:flex items-center items-between lg:justify-between my-2">
        <div className="filters flex gap-4">
          <SelectView selectedView={selectedView} setSelectedView={setSelectedView} />
          {filters && <div className="flex gap-2">{filters}</div>}
        </div>

        <div className="date_title my-4 lg:my-0">
          <span className='font-bold font-dm tracking-tighter'>
            {format(selectedDate || new Date(), 'MMMM d, yyyy')}
          </span>
        </div>
      </div>

      {/* CALENDAR */}
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
        initialView={selectedView}
        initialDate={selectedDate || new Date()}
        headerToolbar={false}
        titleFormat={{
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }}
        height="auto"
        allDaySlot={false}
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        events={getCombinedCalendarEvents()}
        eventContent={(evt) => {
          const extendedProps = evt.event.extendedProps;
          const eventType = extendedProps.type;

          if (eventType === 'event') {
            // Render event differently
            return (
              <div className="calendar-event-priority-content p-1">
                <div className="font-semibold text-white text-sm">
                  {evt.event.title}
                </div>
                <div className="text-white/90 text-xs">
                  {extendedProps.location && `📍 ${extendedProps.location}`}
                </div>
              </div>
            );
          }

          // Render session normally
          return (
            <CalendarEvent
              id={evt.event.id}
              title={evt.event.title}
              instructor={extendedProps.instructor}
              room={extendedProps.room}
              program={extendedProps.program_name}
              code={extendedProps.program_code}
              section={extendedProps.section}
              status={extendedProps.status}
              view={selectedView}
              onEventStatusChange={handleStatusUpdate}
            />
          );
        }}
        eventClick={handleEventClick}
        eventDidMount={(info) => {
          // Only style sessions, events are already styled
          if (info.event.extendedProps.type !== 'event') {
            const status = info.event.extendedProps.status;
            const color = getStatusColor(status);
            info.el.style.backgroundColor = color;
            info.el.style.borderColor = color;
          }

          // Add priority class for events
          if (info.event.extendedProps.type === 'event') {
            info.el.classList.add('calendar-event-priority');
            info.el.style.zIndex = '999'; // Ensure events appear on top
          }
        }}
      />

      {/* Session Modal */}
      <SessionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedSession={selectedSession}
      />
    </div>
  )
}

export default ScheduleCalendar