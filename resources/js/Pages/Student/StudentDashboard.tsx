import React, { useEffect, useState, useMemo } from 'react'
import Layout from "@/Layouts/Layout"
import { usePage } from '@inertiajs/react'
import type { Session } from '../Interfaces/Session'
import ScheduleCalendar from '../Components/ScheduleCalendar';
import SessionFilter from '../Components/SessionFilter';
import DatePicker from '../Components/DatePicker';
import { Program } from '../Interfaces/Program';

interface StudentDashboardProps {
  sessions: Session[];
  events: any[];
  programs?: Program[]; // Add programs to props if available
}

const StudentDashboard = ({
  sessions,
  events,
  programs = [] // Default to empty array if not provided
}: StudentDashboardProps) => {
  const user = usePage().props.auth.user;
  console.log(user);

  const [selectedView, setSelectedView] = useState<'timeGridWeek' | 'timeGridDay'>('timeGridDay');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [firstLogin, setFirstLogin] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!user.first_login_at) {
      setFirstLogin(true);
      setIsOpen(true);
    } else {
      setFirstLogin(false);
    }
  }, [])

  // Filter sessions based on student's details
  const filteredSessionList = useMemo(() => {
    return sessions.filter((session) => {
      const matchDept = session.extendedProps.department_id === user.student.program.dept_id;
      const matchProgram = selectedProgram
        ? session.extendedProps.program_id === selectedProgram
        : session.extendedProps.program_id === user.student.program.id;
      const matchSection = session.extendedProps.section === user.student.section;
      const matchYear = session.extendedProps.course_year_level === user.student.year;

      return matchDept && matchProgram && matchSection && matchYear;
    });
  }, [sessions, user.student, selectedProgram]);

  // Get programs available to the student (from their department)
  const availablePrograms = useMemo(() => {
    return programs.filter(program =>
      program.dept_id === user.student.program.dept_id
    );
  }, [programs, user.student.program.dept_id]);

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
          availablePrograms.length > 1 ? (
            <SessionFilter
              programs={availablePrograms}
              onProgramChange={setSelectedProgram}
            />
          ) : null
        }
      />
    </div>
  )
}

StudentDashboard.layout = (page: React.ReactNode) => <Layout title={'Student Dashboard'}>{page}</Layout>
export default StudentDashboard