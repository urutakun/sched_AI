import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import type { AssignCourse as AssignCourseType } from '../Interfaces/AssignCourse';
import { CourseAssignmentColumns } from '../Components/CourseAssignmentColumns';
import { router, usePage } from '@inertiajs/react';
import DeleteModal from '../Components/DeleteModal';

interface CourseAssignmentsProps {
  course_assignments: AssignCourseType[];
}

const CourseAssignments = ({ course_assignments }: CourseAssignmentsProps) => {
  const role =  usePage().props.auth.user.role;
  const [courseAssignmentList, setCourseAssignmentList] = useState<AssignCourseType[]>(course_assignments);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string>('');
  const toDelete = courseAssignmentList?.find((item: AssignCourseType) => item.id === deletingId);

  const handleEdit = (id: string): void => {
    router.get(`/${role}/course-assignments/edit/${id}`);
  }

  const onDelete = (id: string): void => {
    const filtered_assignments = courseAssignmentList.filter((item: AssignCourseType) => item.id !== id);
    setCourseAssignmentList(filtered_assignments);
  }

  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={CourseAssignmentColumns(handleEdit, setIsOpen, setDeletingId)} data={courseAssignmentList || []} filterLabel={"course"} filterColumn={"course_name"}/>
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toDelete={toDelete}
        onDelete={onDelete}
        deletingId={deletingId}
        url={`/${role}/course-assignments/delete`}
        nameField="course.name"
        errorMessage="Failed to delete course assignment year"
      />
    </div>
  )
}

CourseAssignments.layout = (page: React.ReactNode) => <Layout title={'Course Assignments'}>{page}</Layout>
export default CourseAssignments
