import React, { useState, useEffect, useRef } from 'react'
import Layout from "@/Layouts/Layout"
import StatusCard from '../Components/StatusCard'
import {
  FaBuilding,
  FaGraduationCap
} from "react-icons/fa";
import { BsDoorOpenFill } from "react-icons/bs";
import { ImUsers } from "react-icons/im";
import DatePicker from '../Components/DatePicker';
import type { Session } from '../Interfaces/Session';
import { Department } from '../Interfaces/Department';
import { Program } from '../Interfaces/Program';
import ScheduleCalendar from '../Components/ScheduleCalendar';
import SessionFilter from '../Components/SessionFilter';

interface AdminDashboardProps {
  department_count: number;
  instructor_count: number;
  student_count: number;
  room_count: number;
  sessions: Session[];
  departments: Department[];
}

const AdminDashboard = ({
  department_count,
  instructor_count,
  student_count,
  room_count,
  sessions,
  departments
}: AdminDashboardProps) => {
  const [sessionList, setSessionList] = useState<Session[]>(sessions || []);
  const [departmentList, setDepartmentList] = useState<Department[]>(departments);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'timeGridWeek' | 'timeGridDay'>('timeGridDay');

  const filteredSessionList = sessionList.filter((session) => {
    const matchDept = selectedDepartment ? session.extendedProps.department_id === selectedDepartment : true;
    const matchProg = selectedProgram ? session.extendedProps.program_id === selectedProgram : true;

    return matchDept && matchProg;
  })



  useEffect(() => {
    if(selectedDepartment){
      const selDept = departments.find((department: Department) => department.id === selectedDepartment);
      setFilteredPrograms(selDept ? selDept.programs : []);
      setSelectedProgram(null);
    } else {
      setFilteredPrograms([]);
      setSelectedProgram(null);
    }
  }, [selectedDepartment, departments])


  return (
    <div className="wrapper space-y-8">
      <div className='status grid grid-cols-2 gap-3 lg:gap-0 lg:flex lg:space-x-3'>
        <StatusCard icon={FaBuilding} label={'Departments'} value={department_count} href={'/admin/departments'} />
        <StatusCard icon={ImUsers} label={'Instructors'} value={instructor_count} href={'/admin/instructors'} />
        <StatusCard icon={FaGraduationCap} label={'Students'} value={student_count} href={'/admin/students'} />
        <StatusCard icon={BsDoorOpenFill} label={'Rooms'} value={room_count} href={'/admin/rooms'} />
      </div>
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
              departments={departmentList}
              onDepartmentChange={setSelectedDepartment}
              programs={filteredPrograms}
              onProgramChange={setSelectedProgram}
            />
          }
        />
      </div>
    </div>
  )
}

AdminDashboard.layout = (page: React.ReactNode) => <Layout title={'Admin Dashboard'}>{page}</Layout>
export default AdminDashboard
