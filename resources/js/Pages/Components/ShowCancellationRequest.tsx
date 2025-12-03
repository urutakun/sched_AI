import React, { useState, useEffect } from 'react'
import Layout from "@/Layouts/Layout"
import type { CancellationRequest } from "../Interfaces/CancellationRequest";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';
import DenyModal from './DenyModal';
interface ShowCancellationRequestProps {
  cancellation_request: CancellationRequest[];
}

const ShowCancellationRequest = ({
  cancellation_request
}: ShowCancellationRequestProps) => {
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const request = cancellation_request[0];
  const { put } = useForm();


  // DATE & TIME
  const date = new Date(request.schedule_session.session_date);
  const formattedDate = date?.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
  const start_time = new Date(`1970-01-01T${request.schedule_session.schedule.start_time}`).toLocaleTimeString('en-US', {hour12: true, hour: 'numeric', minute: 'numeric'});
  const end_time = new Date(`1970-01-01T${request.schedule_session.schedule.end_time}`).toLocaleTimeString('en-US', {hour12: true, hour: 'numeric', minute: 'numeric'});

  // INSTRUCTOR
  const instructor = request.schedule_session.schedule.course_assignment.instructor.user;
  const fullName = instructor.first_name + ' ' + instructor.last_name;

  console.log(request);

  useEffect(() => {
    if (request?.status !== "pending") {
      setIsProcessed(true);
    }
  }, [request]);

   const colors: Record<string,string> = {
      pending: 'bg-gray-200 text-gray-600',
      approved: 'bg-green-200 text-green-600',
      denied: 'bg-red-200 text-red-600',
  }


  const handleAccept = (id: string): void => {
    put(`/admin/schedules/cancel-request/accept/${id}`, {
      onSuccess: () => {
        toast.success('Cancellation request approved');
        setIsProcessed(true);
      },
      onError: () => {
        toast.error('Failed to approve request!')
      }
    })
  }

  return (
       <div className="h-full lg:min-h-[500px] w-full bg-white shadow-sm rounded-2xl p-6 flex justify-center items-center">
          <div className="w-full lg:w-[500px] font-dm lg:border border-custom-accent/50 lg:p-4 rounded-2xl">
            <div className="header w-full flex justify-between items-start mb-4">
              <span className='font-medium font-dm text-lg'>Cancellation Request</span>
            </div>
            <div className="details space-y-3">
              <div className="req_info space-y-3 border border-dashed rounded-2xl p-3">
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Status: </span>
                  <div className={`capitalize px-3 py-1 w-[100px] text-center rounded-full text-sm ${colors[request.status]}`}>{request.status}</div>
                </div>
                {request?.denial_reason && (
                  <div className="field flex space-x-3 items-start">
                    <span className="label block font-bold">Denial Reason: </span>
                    <span className='capitalize'>{request.denial_reason}</span>
                  </div>
                )}
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Type: </span>
                  <span className='capitalize'>{request.type}</span>
                </div>
                <div className="field flex space-x-3 items-start">
                  <span className="label block font-bold">Reason: </span>
                  <p className='capitalize'>{request.reason}</p>
                </div>
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Attachment: </span>
                  {request.attachment ? (
                    <a href={`/storage/${request.attachment}`} target="_blank" className='text-blue-400'>View Attachment</a>
                  ):
                  (
                    <span className='text-gray-400'>No Attachment</span>
                  )
                  }
                </div>
              </div>
              <div className="sched_info space-y-3 border border-dashed rounded-2xl p-3">
                <div className="header w-full flex justify-between items-start mb-4">
                  <span className='font-bold font-dm'>Schedule Information</span>
                </div>
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Date: </span>
                  <p className='capitalize'>{formattedDate}</p>
                </div>
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Time: </span>
                  <p className='capitalize'>{start_time} - {end_time}</p>
                </div>
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Course: </span>
                  <p className='capitalize'>{request.schedule_session.schedule.course_assignment.course.name}</p>
                </div>
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Department: </span>
                  <p className='capitalize'>{request.schedule_session.schedule.department.name}</p>
                </div>
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Program: </span>
                  <p className='capitalize'>{request.schedule_session.schedule.program.name}</p>
                </div>
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Section: </span>
                  <p className='capitalize'>{request.schedule_session.schedule.section}</p>
                </div>
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Room: </span>
                  <p className='capitalize'>{request.schedule_session.schedule.room.room_name}</p>
                </div>
                <div className="field flex space-x-3 items-center">
                  <span className="label block font-bold">Instructor: </span>
                  <p className='capitalize'>{fullName}</p>
                </div>
              </div>
            </div>
            {!isProcessed && (
              <>
                <div className="btns space-x-3 mt-6">
                  <Button onClick={() => handleAccept(request.id)}>Accept</Button>
                  <Button variant="outline" onClick={() => setIsOpen(true)}>Deny</Button>
                </div>
                <DenyModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  id={request.id}
                />
              </>

            )}
          </div>
        </div>
  )
}

ShowCancellationRequest.layout = (page: React.ReactNode) => <Layout title={'Cancel Request'}>{page}</Layout>
export default ShowCancellationRequest
