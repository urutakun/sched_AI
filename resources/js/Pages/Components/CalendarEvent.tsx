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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  MoreVertical,
  Calendar,
  CalendarOff,
  Paperclip,
  Info
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';
import { useForm, usePage } from '@inertiajs/react';

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
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [updatedStatus, setUpdatedStatus] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const role = usePage().props.auth.user.role;

  const { data, setData, errors, post, reset } = useForm({
    session_id: id,
    type: '',
    reason: '',
    attachment: null as File | null,
  })

  const text = {
    'upcoming': 'text-gray-600',
    'ongoing': 'text-blue-600',
    'completed': 'text-green-600',
    'cancelled': 'text-red-600'
  }

  const handleUpdate = (): void => {
    setIsOpen(true);
  }

  const handleUpdateSubmit = (id: string) => {
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

  const handleCancelRequest = (): void => {
    setIsRequestModalOpen(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file.name);
    setData('attachment', file);
  }

  const handleRequestSubmit = (id: string): void => {
    post(`/instructor/schedule-session/cancel/${id}`, {
      onSuccess: () => {
        toast.success('Cancel request submitted successfully!');
        setIsRequestModalOpen(false);
        reset();
        setFile(null);
      },
      onError: () => {
        toast.error('Failed to send cancel request');
        setIsRequestModalOpen(false);
        reset();
        setFile(null);
      }
    })
  }

  return (
    <div className={`${text[status]} p-1 w-full h-full cursor-pointer relative ${view === 'timeGridWeek' ? 'text-xs' : ''}`} >
      <div>
        <p className='font-semibold'>{view === 'timeGridWeek' ? title.slice(0, 13) + '...' :title}</p>
        {view === 'timeGridWeek' ? (
          <>
            <p>{code}</p>
          </>
        ) : (
          <>
            <p>{instructor} | {program}</p>
          </>
        )}
      </div>

      { role !== 'student' && (
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
      )}

      { role === 'instructor' && (
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
              <DropdownMenuItem onClick={handleCancelRequest}>Request Cancellation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

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
            <Button size={'lg'} type="submit" className='hover:bg-black hover:text-white'  onClick={() => handleUpdateSubmit(id)}>Update</Button>
            <Button size={'lg'} variant="outline" type="button" className='hover:bg-custom-accent/20' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter >
        </DialogContent>
      </Dialog>

      {/* Request Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className='space-y-4'>
          <DialogHeader className='flex flex-row items-center space-x-4'>
            <div className="icon bg-blue-200 text-white p-2 rounded-lg">
              <CalendarOff className='text-blue-600'/>
            </div>
            <DialogTitle className='text-xl'>Class Cancellation Request</DialogTitle>
          </DialogHeader>
          <div>
              <div className="class_info">
                  <FieldLabel htmlFor="course">
                      Course Info
                  </FieldLabel>
                  <div className="info flex space-x-3 items-center text-custom-accent text-sm mt-2">
                    <span>{title}</span>
                    <div className="line w-[1px] h-[20px] bg-gray-300"></div>
                    <span>{program}</span>
                  </div>
              </div>
              <form className='mt-6'>
                <FieldGroup>
                  <Field>
                    <FieldLabel>
                      Type of Cancellation
                    </FieldLabel>
                     <Select
                          value={data.type}
                          onValueChange={(value) =>
                              setData("type", value)
                          }
                      >
                          <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select cancellation type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal Emergency</SelectItem>
                            <SelectItem value="medical">Medical</SelectItem>
                            <SelectItem value="weather">Weather Disturbance</SelectItem>
                            <SelectItem value="event">Academic Activity / Official Event</SelectItem>
                            <SelectItem value="others">Others</SelectItem>
                          </SelectContent>
                      </Select>
                      <FieldError>
                          {errors.type ?? ""}
                      </FieldError>
                  </Field>
                  <Field>
                    <FieldLabel>
                      Reason for cancellation
                    </FieldLabel>
                    <Textarea
                        id="reason"
                        autoComplete="off"
                        placeholder="Type your reason here"
                        value={data.reason}
                        onChange={(e) =>
                            setData("reason", e.target.value)
                        }
                        className='min-h-[100px]'
                    />
                    <FieldError>
                        {errors.reason ?? ""}
                    </FieldError>
                  </Field>
                  <Field>
                    <FieldLabel>
                      Attachment
                    </FieldLabel>
                    <FieldLabel htmlFor="file_upload"
                    className="border border-dashed border-custom-accent w-full min-h-[60px] rounded-xl
                    flex items-center justify-center text-custom-accent bg-gray-100/50 hover:bg-gray-100
                    ctransition cursor-pointer
                    ">
                      <Input
                        id="file_upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleChange(e)}
                      />
                      <div className="label flex justify-center items-center space-x-3">
                        <Paperclip />
                        <span>{file ?? 'Upload Attachment'}</span>
                      </div>
                    </FieldLabel>
                    <FieldError>
                        {errors.reason ?? ""}
                    </FieldError>
                  </Field>
                </FieldGroup>
              </form>
              <div className="note p-2 bg-red-200 text-xs text-red-600 rounded-full mt-4 flex items-center space-x-1">
                <Info className='w-4'/>
                <span>Submission will be reviewed by the admin; class is not automatically cancelled.</span>
              </div>
          </div>
          <DialogFooter className='flex flex-row justify-end mt-6 w-full'>
            <Button size={'lg'} type="submit" className='hover:bg-black hover:text-white'  onClick={() => handleRequestSubmit(id)}>Submit</Button>
            <Button size={'lg'} variant="outline" type="button" className='hover:bg-custom-accent/20' onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter >
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CalendarEvent
