import React, { useState, useEffect, useMemo } from 'react'
import Layout from "@/Layouts/Layout"
import StatusCard from '../Components/StatusCard'
import {
  FaBuilding,
  FaGraduationCap
} from "react-icons/fa";
import { BsCalendarFill, BsDoorOpenFill } from "react-icons/bs";
import { ImUsers } from "react-icons/im";
import DatePicker from '../Components/DatePicker';
import type { Session } from '../Interfaces/Session';
import { Department } from '../Interfaces/Department';
import { Program } from '../Interfaces/Program';
import ScheduleCalendar from '../Components/ScheduleCalendar';
import SessionFilter from '../Components/SessionFilter';
import { CalendarIcon } from 'lucide-react';

interface AdminDashboardProps {
  department_count: number;
  instructor_count: number;
  student_count: number;
  room_count: number;
  event_count: number;
  sessions: Session[];
  departments: Department[];
  events: any[];
}

type Status = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

const DeanDashboard = ({
  department_count,
  instructor_count,
  student_count,
  room_count,
  event_count,
  sessions,
  departments,
  events
}: AdminDashboardProps) => {
  const [sessionList, setSessionList] = useState<Session[]>(sessions || []);
  const [departmentList, setDepartmentList] = useState<Department[]>(departments);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'timeGridWeek' | 'timeGridDay'>('timeGridDay');

  // Use useMemo for efficient filtering
  const filteredSessionList = useMemo(() => {
    return sessionList.filter((session) => {
      const matchDept = selectedDepartment
        ? session.extendedProps.department_id === selectedDepartment
        : true;
      const matchProg = selectedProgram
        ? session.extendedProps.program_id === selectedProgram
        : true;

      return matchDept && matchProg;
    });
  }, [sessionList, selectedDepartment, selectedProgram]);

  useEffect(() => {
    if (selectedDepartment) {
      const selDept = departments.find((department: Department) => department.id === selectedDepartment);
      setFilteredPrograms(selDept ? selDept.programs : []);
      setSelectedProgram(null);
    } else {
      setFilteredPrograms([]);
      setSelectedProgram(null);
    }
  }, [selectedDepartment, departments]);

  const handleSessionStatusChange = (sessionId: string, newStatus: Status) => {
    setSessionList(prev => prev.map(session =>
      session.id === sessionId
        ? {
          ...session,
          extendedProps: {
            ...session.extendedProps,
            status: newStatus
          }
        }
        : session
    ));
  };

  return (
    <div className="wrapper space-y-8">
      <div className='status grid grid-cols-2 gap-3 lg:gap-0 lg:flex lg:space-x-3'>
        <StatusCard icon={FaBuilding} label={'Departments'} value={department_count} href={'/admin/departments'} />
        <StatusCard icon={ImUsers} label={'Instructors'} value={instructor_count} href={'/admin/instructors'} />
        <StatusCard icon={FaGraduationCap} label={'Students'} value={student_count} href={'/admin/students'} />
        <StatusCard icon={BsDoorOpenFill} label={'Rooms'} value={room_count} href={'/admin/rooms'} />
        <StatusCard icon={BsCalendarFill} label={'Events'} value={event_count} href={'/admin/events'} />
      </div>
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
              departments={departmentList}
              onDepartmentChange={setSelectedDepartment}
              programs={filteredPrograms}
              onProgramChange={setSelectedProgram}
            />
          }
          onSessionStatusChange={handleSessionStatusChange}
        />
      </div>
    </div>
  )
}

DeanDashboard.layout = (page: React.ReactNode) => <Layout title={'Dean Dashboard'}>{page}</Layout>
export default DeanDashboard
