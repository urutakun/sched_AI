import React, { useMemo } from 'react'
import { usePage } from '@inertiajs/react'

const breadcrumbMap:Record<string, string> = {
  'dashboard': 'Dashboard',
  'user': 'Users',
  'test': 'Test',
  'departments': 'Departments',
  'programs': 'Programs',
  'deans': 'Deans',
  'instructors': 'Instructors',
  'students': 'Students',
  'courses': 'Courses',
  'rooms': 'Rooms',
  'events': 'Events',
  'user-management': 'User Management',
  'academic-years' : 'Academic Years',
  'trimesters' : 'Trimesters',
  'create': 'Create',
  'edit': 'Edit',
  'assign': 'Assign',
  'course-assignments': 'Course Assignments',
  'schedules': 'Schedules',
  'profile': 'Profile',
  'change-password': 'Change Password',
  'cancel-request': 'Cancel Request'
}


export function useBreadcrumbs(){
  const { url } = usePage();

  return useMemo(() => {
    const segments = url.split("/").filter(Boolean);

    return segments.slice(1).map((seg, idx) => {
      const href = '/' + segments.slice(0, idx + 2).join('/');
      return {
        label: breadcrumbMap[seg] ?? seg,
        href: idx < segments.length - 2 ? href : undefined,
      }
    })
  }, [url])
}
