import React, { useState, useEffect, useRef } from 'react'
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
  filters,
}: ScheduleCalendarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<SessionModalEvent | null>(null);
  const [sessions, setSessions] = useState<Session[]>(sessionList || []);
  const calendarRef = useRef<FullCalendar | null>(null);


useEffect(() => {
  if (selectedDate && calendarRef.current) {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(selectedDate);
  }
}, [selectedDate]);

useEffect(() => {
  if(calendarRef.current){
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(selectedView);
  }
}, [selectedView])

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    upcoming: "var(--light-gray)",
    ongoing: "var(--light-blue)",
    completed: "var(--light-green)",
    cancelled: "var(--light-red)",
  };

  return colors[status] || "#e5e7eb";
}

const handleStatusUpdate = (id: string, newStatus: Status): void => {
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

  // Update event color  by removing the event
  if(calendarRef.current){
    const calendarAPI = calendarRef.current.getApi();

    const event = calendarAPI.getEventById(id);
    if(event && event.start){
      const eventData = {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end || event.start,
        extendedProps: { ...event.extendedProps, status: newStatus }
      };

      event.remove();
      calendarAPI.addEvent(eventData);
    }
  }
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
            events={sessions}
            eventContent={(evt) => {
              const extendedProps = evt.event.extendedProps;
              return(
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
              )
            }}
              eventClick={(evt) => {
                const event = evt.event;
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
                setIsOpen(true);
              }}
              eventDidMount={(info) => {
                const status = info.event.extendedProps.status;
                const color = getStatusColor(status);
                info.el.style.backgroundColor = color;
                info.el.style.borderColor = color;
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
