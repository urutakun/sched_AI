import React, { useMemo } from 'react'
import { usePage } from '@inertiajs/react'

const breadcrumbMap:Record<string, string> = {
  'dashboard': 'Dashboard',
  'user': 'Users',
  'test': 'Test',
  'departments': 'Departments',
  'instructors': 'Instructors',
  'courses': 'Courses',
  'rooms': 'Rooms',
  'events': 'Events',
  'user-management': 'User Management',
  'create': 'Create',
  'edit': 'Edit'
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
