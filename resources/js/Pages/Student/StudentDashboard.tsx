import React, { useEffect, useState } from 'react'
import Layout from "@/Layouts/Layout"
import { usePage } from '@inertiajs/react'

const StudentDashboard = () => {
  const user = usePage().props.auth.user as any;
  console.log(user);
  return (
    <div>
    </div>
  )
}

StudentDashboard.layout = (page: React.ReactNode) => <Layout title={'Student Dashboard'}>{page}</Layout>
export default StudentDashboard
