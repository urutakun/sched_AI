import React, { useEffect, useState, useMemo } from 'react'
import Layout from "@/Layouts/Layout"
import { usePage } from '@inertiajs/react'
import axios from 'axios';
import { Box } from 'lucide-react';
import { Button } from '@headlessui/react';

interface Notification {
    id: string;
    data: {
        title: string;
        message: string;
        url: string;
    }
}
const Notification = ({ }) => {
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

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        fetchNotifications();
    };

    return (

        <div className="grid grid-cols-1 gap-3 w-full">
            <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-sm p-4 min-h-[400px]">
                {notifications.map((notification) => (
                    <div className='p-4 border-gray-100 border-2'>
                        <h1 className='font-bold'>
                            {notification.data.title}
                        </h1>
                        <h1 >
                            {notification.data.message}
                        </h1>
                        <button>
                            <p>click here{notification.data.url}</p>
                        </button>
                    </div>

                ))}
            </div>
        </div>
    )
}

Notification.layout = (page: React.ReactNode) => <Layout title={'Instructor Notifications'}>{page}</Layout>
export default Notification