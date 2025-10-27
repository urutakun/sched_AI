import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import type { Room as RoomType} from '../Interfaces/Room';
import { RoomColumns } from '../Components/RoomColumns';
import { router } from '@inertiajs/react';
import DeleteModal from '../Components/DeleteModal';

interface RoomProps {
  rooms: RoomType[];
}

const Room = ({ rooms }: RoomProps) => {
  const [roomList, setRoomList] = useState<RoomType[]>(rooms);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = roomList?.find((item: RoomType) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/admin/rooms/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_rooms = roomList.filter((item: RoomType) => item.id !== id);
    setRoomList(filtered_rooms);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={RoomColumns(handleEdit, setIsOpen, setDeletingId)} data={roomList || []} filterLabel={"room name"} filterColumn={"room_name"} createUrl={'/admin/rooms/create'}/>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toDelete={toDelete}
        onDelete={onDelete}
        deletingId={deletingId}
        url={'/admin/rooms/delete'}
        nameField="room_name"
        errorMessage="Failed to delete room"
      />
    </div>
  )
}

Room.layout = (page: React.ReactNode) => <Layout title={'Rooms'}>{page}</Layout>
export default Room
