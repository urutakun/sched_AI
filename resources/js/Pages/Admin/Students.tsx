import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import type { Student } from '../Interfaces/Student';
import DeleteModal from '../Components/DeleteModal';
import { StudentColumns } from '../Components/StudentColumns';
import { router } from '@inertiajs/react';

interface StudentsProps {
  students: Student[];
}

const Students = ({ students }: StudentsProps) => {
  console.log(students);
  const [studentList, setStudentList] = useState<Student[]>(students);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = studentList?.find((item: Student) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/admin/user-management/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_students = studentList.filter((item: Student) => item.id !== id);
    setStudentList(filtered_students);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={StudentColumns(handleEdit, setIsOpen, setDeletingId)} data={studentList} filterLabel={"last name"} filterColumn={"user.last_name"} createUrl={'/admin/user-management/create'}/>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toDelete={toDelete}
        onDelete={onDelete}
        deletingId={deletingId}
        url={'/admin/students/delete'}
        nameField="user.first_name+user.last_name"
        errorMessage="Failed to delete student"
      />
    </div>
  )
}

Students.layout = (page: React.ReactNode) => <Layout title={'Students'}>{page}</Layout>
export default Students
