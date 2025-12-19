import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import type { Dean as DeanType } from '../Interfaces/Dean';
import { DeanColumns } from '../Components/DeanColumns';
import DeleteModal from '../Components/DeleteModal';
import { router } from '@inertiajs/react';

interface DeanProps {
  deans: DeanType[];
}

const Dean = ({ deans }: DeanProps) => {
  const [deanList, setDeanList] = useState<DeanType[]>(deans);

  console.log(deanList);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = deanList?.find((item: DeanType) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/admin/user-management/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_deans = deanList.filter((item: DeanType) => item.id !== id);
    setDeanList(filtered_deans);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={DeanColumns(handleEdit, setIsOpen, setDeletingId)} data={deanList || []} filterLabel={"last name"} filterColumn={"user.last_name"} createUrl={'/admin/user-management/create'}/>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toDelete={toDelete}
        onDelete={onDelete}
        deletingId={deletingId}
        url={'/admin/deans/delete'}
        nameField="user.first_name+user.last_name"
        errorMessage="Failed to delete instructor"
      />
    </div>
  )
}

Dean.layout = (page: React.ReactNode) => <Layout title={'Deans'}>{page}</Layout>
export default Dean
