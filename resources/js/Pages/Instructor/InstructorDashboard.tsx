import React, { useEffect, useState } from 'react'
import Layout from "@/Layouts/Layout"
import { usePage } from '@inertiajs/react'
import { Session } from '../Interfaces/Session'
import { Program } from '../Interfaces/Program';
import ScheduleCalendar from '../Components/ScheduleCalendar';
import SessionFilter from '../Components/SessionFilter';
import DatePicker from '../Components/DatePicker';
import { User } from '../Interfaces/User';

interface InstructorDashboardProps {
  sessions: Session[];
  programs: Program[];
}

const InstructorDashboard = ({
  sessions,
  programs,
}: InstructorDashboardProps) => {
  const user = usePage().props.auth.user;

  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'timeGridWeek' | 'timeGridDay'>('timeGridDay');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);


  const programSessionList = sessions.filter((session: Session) => session.extendedProps.instructor_id === user.id);
  const filteredSessionList = programSessionList.filter((session: Session) => selectedProgram ? session.extendedProps.program_id === selectedProgram : true);
  const filteredPrograms = programs.filter((program: Program) => program.dept_id === user.instructor.dept_id);


  return (
     <div className="date_block grid grid-cols-4 gap-3 w-full">
        <div className="calendar col-span-4  h-full w-full lg:col-span-1 bg-white rounded-2xl shadow-sm p-4 min-h-[400px]">
          <DatePicker setSelectedDate={setSelectedDate}/>
        </div>
        <ScheduleCalendar
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          selectedDate={selectedDate || new Date()}
          sessionList={filteredSessionList}
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

InstructorDashboard.layout = (page: React.ReactNode) => <Layout title={'Instructor Dashboard'}>{page}</Layout>
export default InstructorDashboard
