import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MoreVertical, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { toast } from 'sonner';

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
  view: 'timeGridWeek' | 'timeGridDay',
  onEventStatusChange: (id: string, newStatus: Status) => void;
}

type Status = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

const CalendarEvent = ({
  id,
  title,
  instructor,
  program,
  code,
  status,
  view,
  onEventStatusChange
}: CalendarEventProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [updatedStatus, setUpdatedStatus] = useState<string>("");

  const text = {
    'upcoming': 'text-gray-600',
    'ongoing': 'text-blue-600',
    'completed': 'text-green-600',
    'cancelled': 'text-red-600'
  }

  const handleUpdate = (): void => {
    setIsOpen(true);
    return;
  }

  const handleSubmit = (id: string) => {
    axios.put(`/admin/schedule-session/update/${id}`, { 'status' : updatedStatus })
      .then((res) => {
        onEventStatusChange(id, updatedStatus as Status);
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      })
    setIsOpen(false);
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
          <p>{instructor} | {program}</p>
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
            <DropdownMenuItem onClick={handleUpdate}>Update</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='space-y-4'>
          <DialogHeader className='flex flex-row items-center space-x-4'>
            <div className="icon bg-blue-200 text-white p-2 rounded-lg">
              <Calendar className='text-blue-600'/>
            </div>
            <DialogTitle className='text-xl'>Update Status</DialogTitle>
          </DialogHeader>
          <div>
              <Select
                value={updatedStatus || ''}
                onValueChange={(val: Status) => {
                  setUpdatedStatus(val);
                }}
                >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
          </div>
          <DialogFooter className='flex flex-row justify-end mt-6 w-full'>
            <Button size={'lg'} type="submit" className='hover:bg-black hover:text-white'  onClick={() => handleSubmit(id)}>Update</Button>
            <Button size={'lg'} variant="outline" type="button" className='hover:bg-custom-accent/20' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter >
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CalendarEvent
