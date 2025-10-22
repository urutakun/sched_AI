import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import type { Program as ProgramType} from '../Interfaces/Program';
import { router } from '@inertiajs/react';
import DeleteModal from '../Components/DeleteModal';
import { ProgramColumns } from '../Components/ProgramColumns';

interface ProgramProps {
  programs: ProgramType[];
}

const Program = ({ programs }: ProgramProps) => {
  const [programList, setProgramList] = useState<ProgramType[]>(programs);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = programList?.find((item: ProgramType) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/admin/programs/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_programs = programList.filter((item: ProgramType) => item.id !== id);
    setProgramList(filtered_programs);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={ProgramColumns(handleEdit, setIsOpen, setDeletingId)} data={programList || []} filterLabel={"name"} filterColumn={"name"} createUrl={'/admin/programs/create'}/>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toDelete={toDelete}
        onDelete={onDelete}
        deletingId={deletingId}
        url={'/admin/programs/delete'}
        nameField="name"
        errorMessage="Failed to delete program"
      />
    </div>
  )
}

Program.layout = (page: React.ReactNode) => <Layout title={'Programs'}>{page}</Layout>
export default Program
