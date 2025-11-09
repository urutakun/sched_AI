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

interface ScheduleCalendarProps {
  selectedView: 'timeGridWeek' | 'timeGridDay';
  setSelectedView: React.Dispatch<React.SetStateAction<'timeGridWeek' | 'timeGridDay'>>
  selectedDate?: Date | string;
  sessionList: Session[];
  filters?: React.ReactNode;
}

const ScheduleCalendar = ({
  selectedView,
  setSelectedView,
  selectedDate,
  sessionList,
  filters,
}: ScheduleCalendarProps) => {
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

useEffect(() => {
  if(filters){
    console.log(filters);
  }
}, [filters]);

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
            events={sessionList}
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
                />
              )
            }}
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
      </div>
  )
}

export default ScheduleCalendar
