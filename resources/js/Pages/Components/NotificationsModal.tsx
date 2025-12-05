import React, { useState, useEffect } from 'react'
import { usePage, Link, router } from '@inertiajs/react';
import axios from 'axios';
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
import type { Notification } from '../Interfaces/Notifications';
import { Button } from '@/components/ui/button';

interface NotificationsModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshUnreadCount: () => void;
}

const NotificationsModal = ({
  isOpen,
  setIsOpen,
  refreshUnreadCount
}: NotificationsModalProps) => {
  const user = usePage().props.auth.user;
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  console.log(notifications);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.post(`/notifications/${id}/mark-as-read`);
      // Update local state instead of refetching all notifications
      setNotifications(prev => prev.map(notification =>
        notification.id === id
          ? { ...notification, read_at: new Date().toISOString() }
          : notification
      ));
      refreshUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  const handleView = (url: string): void => {
    router.visit(url);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader className='flex-row items-start space-x-4'>
          <div className="icon bg-blue-200 text-white p-2 rounded-xl">
            <BellRing className='text-blue-600' />
          </div>
          <DialogTitle className='text-xl'>Notifications</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 max-h-[600px] overflow-y-auto pr-2'>
          {notifications.map((notification) => {
            return (
              <div key={notification.id} className='border border-gray-300 p-2 rounded-lg'>
                <div className={`${notification.read_at ? 'text-gray-400' : 'text-black'}`}>
                  <span className='font-bold text-lg'>{notification.data.title}</span>
                  <p className='text-sm'>{notification.data.message.replace('r/\*/g', '')}</p>
                </div>
                <div className={`btns space-x-2 mt-3 ${notification.read_at ? 'text-gray-400' : 'text-black'}`}>
                  {!notification.read_at && (
                    <Button size={'sm'} variant="outline" onClick={() => markAsRead(notification.id)} className='outline-none'>Mark as read</Button>
                  )}
                  {notification.data.url && (
                      <Button size={'sm'} variant="outline" type="button"
                      className='outline-none'
                      onClick={() => handleView(notification.data.url)}
                      >View</Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NotificationsModal
