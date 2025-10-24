import React from 'react'
import Layout from "@/Layouts/Layout"
import StatusCard from '../Components/StatusCard'
import {
  FaBuilding,
  FaGraduationCap
} from "react-icons/fa";
import { BsDoorOpenFill } from "react-icons/bs";
import { ImUsers } from "react-icons/im";
import { AiFillWarning } from "react-icons/ai";
import DatePicker from '../Components/DatePicker';
import TableComponent from '../Components/TableComponent';
import { usePage } from '@inertiajs/react';

// interface AdminDashboardProps {
// }

const AdminDashboard = () => {
  const user = usePage().props.auth.user;
  return (
    <div className="wrapper space-y-8">
      <div className='status grid grid-cols-2 gap-3 lg:gap-0 lg:flex lg:space-x-3'>
        <StatusCard icon={FaBuilding} label={'Departments'} value={6} href={'/admin/departments'} />
        <StatusCard icon={BsDoorOpenFill} label={'Rooms'} value={30} href={'/admin/rooms'} />
        <StatusCard icon={ImUsers} label={'Instructors'} value={100} href={'/admin/instructors'} />
        <StatusCard icon={FaGraduationCap} label={'Students'} value={1000} href={'/admin/students'} />
      </div>
      <div className="date_block grid grid-cols-4 gap-3 w-full">
        <div className="calendar col-span-4  h-full w-full lg:col-span-1 bg-white rounded-2xl shadow-sm p-4 min-h-[400px]">
          <DatePicker />
        </div>
        <div className="date_table cols-span-4 lg:col-span-3 min-h-[400px] w-full bg-white shadow-sm p-4 rounded-2xl">
          <TableComponent />
        </div>
      </div>
    </div>
  )
}

AdminDashboard.layout = (page: React.ReactNode) => <Layout title={'Admin Dashboard'}>{page}</Layout>
export default AdminDashboard
