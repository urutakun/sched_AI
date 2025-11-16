import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { SessionModalEvent, EventModal, ModalSession } from '../Interfaces/ModalTypes';
// interface SessionModalEvent {
//   title: string;
//   eventType: 'session' | 'event',
//   extendedProps: {
//     instructor: string;
//     room: string;
//     program_name: string;
//     section: string;
//     status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
//   }
// }

// interface EventModal {
//   title: string;
//   eventType: 'session' | 'event',
//   extendedProps: {
//     status: 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
//     description: string;
//     location: string;
//     start: Date;
//     end: Date;
//   }
// }

interface SessionModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSession: ModalSession | null;
}

function isSessionEvent(
  session: SessionModalEvent | EventModal | null
): session is SessionModalEvent {
  return session?.eventType === 'session';
}

const SessionModal = ({
  isOpen,
  setIsOpen,
  selectedSession
}: SessionModalProps) => {

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader className='flex-row items-center space-x-4'>
          {/* <div className="icon bg-blue-200 text-white p-2 rounded-xl">
            <Calendar className='text-blue-600'/>
          </div> */}
          <DialogTitle className='text-xl'>{selectedSession?.title}</DialogTitle>
          <span
           className={`capitalize text-sm px-3 py-1 rounded-full ${
              selectedSession?.extendedProps?.status === "ongoing"
              ? "bg-blue-200 text-blue-600"
              : selectedSession?.extendedProps?.status === "completed"
              ? "bg-green-200 text-green-600"
              : selectedSession?.extendedProps?.status === "cancelled"
              ? "bg-red-200 text-red-600"
              : "bg-gray-200 text-gray-600"
              }`}
          >
            {selectedSession?.extendedProps?.status}
          </span>
        </DialogHeader>
         <div className='space-y-4'>
            <div className="space-y-3 text-sm text-gray-700">
             {isSessionEvent(selectedSession) ? (
                <>
                  <p><strong>Instructor:</strong> {selectedSession?.extendedProps?.instructor}</p>
                  <p><strong>Room:</strong> {selectedSession?.extendedProps?.room}</p>
                  <p><strong>Program:</strong> {selectedSession?.extendedProps?.program_name}</p>
                  <p><strong>Section:</strong> {selectedSession?.extendedProps?.section}</p>
                </>
              ) : (
                <>
                  <p><strong>Description:</strong> {selectedSession?.extendedProps?.description}</p>
                  <p><strong>Location:</strong> {selectedSession?.extendedProps?.location}</p>
                </>
              )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SessionModal
