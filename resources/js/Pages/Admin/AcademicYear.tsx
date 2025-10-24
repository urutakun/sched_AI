import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import type { AcademicYear as AcademicYearType } from '../Interfaces/AcademicYear';
import { AcademicYearColumns } from '../Components/AcademicYearColumns';
import { router } from '@inertiajs/react';
import DeleteModal from '../Components/DeleteModal';

interface AcademicYearProps {
  academic_years: AcademicYearType[];
}

const AcademicYear = ({ academic_years }: AcademicYearProps) => {
  const [academicYearList, setAcademicYearList] = useState<AcademicYearType[]>(academic_years);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = academicYearList?.find((item: AcademicYearType) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/admin/academic-years/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_years = academicYearList.filter((item: AcademicYearType) => item.id !== id);
    setAcademicYearList(filtered_years);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={AcademicYearColumns(handleEdit, setIsOpen, setDeletingId)} data={academicYearList || []} filterLabel={"status"} filterColumn={"status"} createUrl={'/admin/academic-years/create'}/>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toDelete={toDelete}
        onDelete={onDelete}
        deletingId={deletingId}
        url={'/admin/academic-years/delete'}
        nameField="year_start + '-' + year_end"
        errorMessage="Failed to delete academic year"
      />
    </div>
  )
}

AcademicYear.layout = (page: React.ReactNode) => <Layout title={'Academic Years'}>{page}</Layout>
export default AcademicYear
