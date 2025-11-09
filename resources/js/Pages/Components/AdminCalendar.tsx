import React from 'react'
import type { Session } from '../Interfaces/Session';
import { Department } from '../Interfaces/Department';
import { Program } from '../Interfaces/Program';

interface AdminCalendarProps {
  sessions: Session[];
  departments: Department[];
  programs: Program[];
}

const AdminCalendar = ({
  sessions,
  departments,
  programs
}: AdminCalendarProps ) => {
  return (
    <div>AdminCalendar</div>
  )
}

export default AdminCalendar
