import React, { useEffect, useState } from 'react'
import Layout from "@/Layouts/Layout"
import { usePage } from '@inertiajs/react'

const InstructorDashboard = () => {
  const user = usePage().props.auth.user as any;
  console.log(user);
  return (
    <div>
    </div>
  )
}

InstructorDashboard.layout = (page: React.ReactNode) => <Layout title={'Instructor Dashboard'}>{page}</Layout>
export default InstructorDashboard
