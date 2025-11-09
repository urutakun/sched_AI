import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

type statusType = 'upcoming' | 'ongoing' | 'completed' |'cancelled';

interface CalendarEventProps {
  id: string;
  title: string;
  instructor: string;
  room: string;
  program: string;
  code: string;
  section: string;
  status: statusType;
  view: 'timeGridWeek' | 'timeGridDay'
}

const CalendarEvent = ({
  id,
  title,
  instructor,
  room,
  program,
  code,
  section,
  status,
  view
}: CalendarEventProps) => {
  const text = {
    'upcoming': 'text-gray-600',
    'ongoing': 'text-blue-600',
    'completed': 'text-green-600',
    'cancelled': 'text-red-600'
  }
  return (
    <div className={`${text[status]} p-1 w-full h-full cursor-pointer relative`} >
      <p className='font-semibold'>{title}</p>
      {view === 'timeGridWeek' ? (
        <>
          <p>{code}</p>
        </>
      ) : (
        <>
          <p>[ {instructor} ]</p>
          <p>{program}</p>
        </>
      )}

      <div className="actions absolute right-1 top-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 focus-visible:ring-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default CalendarEvent
