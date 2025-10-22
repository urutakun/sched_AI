import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import type { Instructor as InstructorType} from '../Interfaces/Instructor';
import { InstructorColumns } from '../Components/InstructorColumns';
import DeleteModal from '../Components/DeleteModal';
import { router } from '@inertiajs/react';

interface InstructorProps {
  instructors: InstructorType[];
}

const Instructor = ({ instructors }: InstructorProps) => {
  const [instructorList, setInstructorList] = useState<InstructorType[]>(instructors);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = instructorList?.find((item: InstructorType) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/admin/user-management/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_instructors = instructorList.filter((item: InstructorType) => item.id !== id);
    setInstructorList(filtered_instructors);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={InstructorColumns(handleEdit, setIsOpen, setDeletingId)} data={instructorList || []} filterLabel={"last name"} filterColumn={"user.last_name"} createUrl={'/admin/user-management/create'}/>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toDelete={toDelete}
        onDelete={onDelete}
        deletingId={deletingId}
        url={'/admin/instructors/delete'}
        nameField="user.first_name+user.last_name"
        errorMessage="Failed to delete instructor"
      />
    </div>
  )
}

Instructor.layout = (page: React.ReactNode) => <Layout title={'Instructors'}>{page}</Layout>
export default Instructor
