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
import { BellRing } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationsModal = ({
  isOpen,
  setIsOpen
}: NotificationsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader className='flex-row items-start space-x-4'>
          <div className="icon bg-blue-200 text-white p-2 rounded-xl">
            <BellRing className='text-blue-600'/>
          </div>
          <DialogTitle className='text-xl'>Notifications</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>

        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NotificationsModal
