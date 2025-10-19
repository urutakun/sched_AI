import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import { DepartmentColumns } from '../Components/DepartmentColumns';
import type { Department as DepartmentType } from '../Interfaces/Department';
import { router } from '@inertiajs/react';
import DeleteModal from '../Components/DeleteModal';


interface DepartmentProps {
  departments: DepartmentType[];
}

const Department = ({ departments }: DepartmentProps) => {
  const [departmentList, setDepartmentList] = useState<DepartmentType[]>(departments);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = departmentList?.find((item: DepartmentType) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/admin/departments/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_departments = departmentList.filter((item: DepartmentType) => item.id !== id);
    setDepartmentList(filtered_departments);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={DepartmentColumns(handleEdit, setIsOpen, setDeletingId)} data={departmentList} filterLabel={"name"} filterColumn={"name"} createUrl={'/admin/departments/create'}/>
      <DeleteModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      toDelete={toDelete}
      onDelete={onDelete}
      deletingId={deletingId}
      url={'/admin/departments/delete'}
      nameField="name"
      />
    </div>
  )
}

Department.layout = (page: React.ReactNode) => <Layout title={'Departments'}>{page}</Layout>
export default Department
