import React, { useState } from "react";
import Layout from "@/Layouts/Layout";
import { DataTable } from "../Components/DataTable";
import { CourseColumns } from "../Components/CourseColumns";
import type { Course as CourseType } from "../Interfaces/Course";
import { router } from "@inertiajs/react";
import DeleteModal from '../Components/DeleteModal';

interface DepartmentProps {
    courses: CourseType[];
}

const Course = ({ courses }: DepartmentProps) => {
    const [courseList, setCourseList] = useState<CourseType[]>(courses);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<string>('');
    const toDelete = courseList?.find((item: CourseType) => item.id === deletingId);

    const handleEdit = (id: string): void => {
      router.get(`/admin/courses/edit/${id}`);
    }

    const onDelete = (id: string): void => {
      const filtered_courses = courseList.filter((item: CourseType) => item.id !== id);
      setCourseList(filtered_courses);
    }

    return (
        <div className="w-full h-full bg-white shadow-sm rounded-2xl p-4">
            <DataTable
                columns={CourseColumns(handleEdit, setIsOpen, setDeletingId)}
                data={courseList || []}
                filterLabel={"name"}
                filterColumn={"name"}
                createUrl={"/admin/courses/create"}
            />
            <DeleteModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              toDelete={toDelete}
              onDelete={onDelete}
              deletingId={deletingId}
              url={'/admin/courses/delete'}
              nameField="name"
              errorMessage="Failed to delete course"
            />
        </div>
    );
};

Course.layout = (page: React.ReactNode) => (
    <Layout title="Courses">{page}</Layout>
);
export default Course;
