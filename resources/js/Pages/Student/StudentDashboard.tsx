import React, { useEffect, useState } from 'react'
import Layout from "@/Layouts/Layout"
import { usePage } from '@inertiajs/react'
import type { Session } from '../Interfaces/Session'
import ScheduleCalendar from '../Components/ScheduleCalendar';
import SessionFilter from '../Components/SessionFilter';
import DatePicker from '../Components/DatePicker';
interface StudentDashboardProps {
  sessions: Session[];
  events: any[];
}

const StudentDashboard = ({
  sessions,
  events
}: StudentDashboardProps) => {
  const user = usePage().props.auth.user;
  console.log(user);
  const [selectedView, setSelectedView] = useState<'timeGridWeek' | 'timeGridDay'>('timeGridDay');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [firstLogin, setFirstLogin] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if(!user.first_login_at){
      setFirstLogin(true);
      setIsOpen(true);
    }
    else{
      setFirstLogin(false);
    }
  }, [])

  const filteredSessionList = sessions.filter((session) => {
    const matchDept = session.extendedProps.department_id === user.student.program.dept_id;
    const matchProgram = session.extendedProps.program_id === user.student.program.id;
    const matchSection = session.extendedProps.section === user.student.section;
    const matchYear = session.extendedProps.course_year_level === user.student.year;

    return matchDept && matchProgram && matchSection && matchYear;
  })


  return (
      <div className="date_block grid grid-cols-4 gap-3 w-full">
        <div className="calendar col-span-4  h-full w-full lg:col-span-1 bg-white rounded-2xl shadow-sm p-4 min-h-[400px]">
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
        />
      </div>
  )
}

StudentDashboard.layout = (page: React.ReactNode) => <Layout title={'Student Dashboard'}>{page}</Layout>
export default StudentDashboard
