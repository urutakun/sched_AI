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
import Occasion from './Occasion';
import type { SessionModalEvent, EventModal, ModalSession } from '../Interfaces/ModalTypes';

interface ScheduleCalendarProps {
  selectedView: 'timeGridWeek' | 'timeGridDay';
  setSelectedView: React.Dispatch<React.SetStateAction<'timeGridWeek' | 'timeGridDay'>>
  selectedDate?: Date | string;
  sessionList: Session[];
  filters?: React.ReactNode;
  events: any[]
}

// interface SessionModalEvent {
//   title: string;
//   eventType: 'session' | 'event',
//   extendedProps: {
//     instructor: string;
//     room: string;
//     program_name: string;
//     section: string;
//     status: string;
//   }
// }

// interface EventModal {
//   title: string;
//   eventType: 'event' | 'occasion',
//   extendedProps: {
//     status: 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
//     description: string;
//     location: string;
//     start: Date;
//     end: Date;
//   }
// }

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
  const [selectedSession, setSelectedSession] = useState<SessionModalEvent | EventModal |null>(null);
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
        status: event.status
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
      console.log(event);
      setSelectedSession({
        title: event.title,
        eventType: 'event',
        extendedProps: {
          description: event.extendedProps.description,
          location: event.extendedProps.location,
          start: event.extendedProps.start_datetime,
          end: event.extendedProps.end_datetime,
          status: event.extendedProps.status,
        }
      });
    } else {
      // Handle session click
      setSelectedSession({
        title: event.title,
        eventType: 'session',
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
              <Occasion
                id={evt.event.id}
                title={evt.event.title}
                description={extendedProps.description}
                start={extendedProps.start_datetime}
                end={extendedProps.end_datetime}
                location={extendedProps.location}
                status={extendedProps.status}
                view={selectedView}
              />
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
          const status = info.event.extendedProps.status;
          const colors: Record<string, string> = {
            upcoming: "var(--light-gray)",
            ongoing: "var(--light-blue)",
            completed: "var(--light-green)",
            cancelled: "var(--light-red)",
          };
          info.el.style.backgroundColor = colors[status] || "#e5e7eb";
          info.el.style.borderColor = colors[status] || "#e5e7eb";
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
