import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import { router } from '@inertiajs/react';
import DeleteModal from '../Components/DeleteModal';
import { CancellationRequestColumns } from '../Components/CancellationRequestColumns';
import type { CancellationRequest } from '../Interfaces/CancellationRequest';

interface CancellationRequestProps {
  cancellation_request: CancellationRequest[];
}

const CancellationRequest = ({ cancellation_request }: CancellationRequestProps) => {
  const [cancellationRequestList, setCancellationRequestList] = useState<CancellationRequest[]>(cancellation_request);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = cancellationRequestList?.find((item: CancellationRequest) => item.id === deletingId);

  // console.log(cancellationRequestList);

  const handleEdit = (id: string): void => {
    router.get(`/admin/course-assignments/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_request = cancellationRequestList.filter((item: CancellationRequest) => item.id !== id);
    setCancellationRequestList(filtered_request);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={CancellationRequestColumns(handleEdit, setIsOpen, setDeletingId)} data={cancellationRequestList || []} filterLabel={"instructor"} filterColumn={"instructor"}/>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toDelete={toDelete}
        onDelete={onDelete}
        deletingId={deletingId}
        url={'/admin/course-assignments/delete'}
        nameField="course.name"
        errorMessage="Failed to delete course assignment year"
      />
    </div>
  )
}

CancellationRequest.layout = (page: React.ReactNode) => <Layout title={'Cancel Request'}>{page}</Layout>
export default CancellationRequest
