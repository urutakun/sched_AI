import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import type { Trimester as TrimesterType } from '../Interfaces/Trimester';
import { TrimesterColumns } from '../Components/TrimesterColumns';
import { router } from '@inertiajs/react';
import DeleteModal from '../Components/DeleteModal';

interface TrimesterProps {
  trimesters: TrimesterType[];
}

const Trimester = ({ trimesters }: TrimesterProps) => {
  const [trimesterList, setTrimesterList] = useState<TrimesterType[]>(trimesters);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = trimesterList?.find((item: TrimesterType) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/admin/trimesters/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_years = trimesterList.filter((item: TrimesterType) => item.id !== id);
    setTrimesterList(filtered_years);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={TrimesterColumns(handleEdit, setIsOpen, setDeletingId)} data={trimesterList || []} filterLabel={"status"} filterColumn={"status"} createUrl={'/admin/trimesters/create'}/>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toDelete={toDelete}
        onDelete={onDelete}
        deletingId={deletingId}
        url={'/admin/trimesters/delete'}
        nameField="name"
        errorMessage="Failed to delete academic year"
      />
    </div>
  )
}

Trimester.layout = (page: React.ReactNode) => <Layout title={'Trimesters'}>{page}</Layout>
export default Trimester
