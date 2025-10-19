import React, { useState } from "react";
import Layout from "@/Layouts/Layout";
import { DataTable } from "../Components/DataTable";
import { CourseColumns } from "../Components/CourseColumns";
import type { Course as CourseType } from "../Interfaces/Course";

interface DepartmentProps {
    courses: CourseType[];
}

const Course = ({ courses }: DepartmentProps) => {
    const [courseList, setCourseList] = useState<CourseType[]>(courses);
    return (
        <div className="w-full h-full bg-white shadow-sm rounded-2xl p-4">
            <DataTable
                columns={CourseColumns}
                data={courseList || []}
                filterLabel={"name"}
                filterColumn={"name"}
                createUrl={"/admin/courses/create"}
            />
        </div>
    );
};

Course.layout = (page: React.ReactNode) => (
    <Layout title="Courses">{page}</Layout>
);
export default Course;
