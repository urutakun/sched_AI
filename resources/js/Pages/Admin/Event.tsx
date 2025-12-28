import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import type { Event as EventType} from '../Interfaces/Event';
import { EventColumns } from '../Components/EventColumns';
import { router, usePage } from '@inertiajs/react';
import DeleteModal from '../Components/DeleteModal';

interface EventProps {
  events: EventType[];
}

const Event = ({ events }: EventProps) => {
  const role = usePage().props.auth.user.role;
  const [eventList, setEventList] = useState<EventType[]>(events);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = eventList?.find((item: EventType) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/${role}/events/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_rooms = eventList.filter((item: EventType) => item.id !== id);
    setEventList(filtered_rooms);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={EventColumns(handleEdit, setIsOpen, setDeletingId)} data={eventList || []} filterLabel={"title"} filterColumn={"title"} createUrl={`/${role}/events/create`}/>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toDelete={toDelete}
        onDelete={onDelete}
        deletingId={deletingId}
        url={`/${role}/events/delete`}
        nameField="title"
        errorMessage="Failed to delete event"
      />
    </div>
  )
}

Event.layout = (page: React.ReactNode) => <Layout title={'Events'}>{page}</Layout>
export default Event
