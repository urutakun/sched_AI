import React, { useEffect, useState, useMemo } from 'react'
import Layout from "@/Layouts/Layout"
import { usePage } from '@inertiajs/react'
import { Session } from '../Interfaces/Session'
import { Program } from '../Interfaces/Program';
import ScheduleCalendar from '../Components/ScheduleCalendar';
import SessionFilter from '../Components/SessionFilter';
import DatePicker from '../Components/DatePicker';
import { User } from '../Interfaces/User';

interface DeanDashboardProps {
  sessions: Session[];
  programs: Program[];
  events: any[];
}

const DeanDashboard = ({
  sessions,
  programs,
  events
}: DeanDashboardProps) => {
  const user = usePage().props.auth.user;
  // console.log(user);

  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'timeGridWeek' | 'timeGridDay'>('timeGridDay');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Filter sessions by department
  const programSessionList = useMemo(() => {
    return sessions.filter((session: Session) =>
      session.extendedProps.instructor_id === user.id
    );
  }, [sessions, user.id]);

  const filteredSessionList = useMemo(() => {
    return programSessionList.filter((session: Session) =>
      selectedProgram ? session.extendedProps.program_id === selectedProgram : true
    );
  }, [programSessionList, selectedProgram]);

  // Filter programs by instructor's department
  const filteredPrograms = useMemo(() => {
    return programs.filter((program: Program) =>
      program.dept_id === user.dean.dept_id
    );
  }, [programs, user.dean.dept_id]);

  return (

    <div className="date_block grid grid-cols-4 gap-3 w-full">
      <div className="calendar col-span-4 h-full w-full lg:col-span-1 bg-white rounded-2xl shadow-sm p-4 min-h-[400px]">
        <DatePicker
          setSelectedDate={setSelectedDate}
          events={events}
        />
      </div>
      <ScheduleCalendar
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        selectedDate={selectedDate || new Date()}
        sessionList={filteredSessionList}
        events={events}
        filters={
          <SessionFilter
            programs={filteredPrograms}
            onProgramChange={setSelectedProgram}
          />
        }
      />
    </div>
  )
}

DeanDashboard.layout = (page: React.ReactNode) => <Layout title={'Dean Dashboard'}>{page}</Layout>
export default DeanDashboard
