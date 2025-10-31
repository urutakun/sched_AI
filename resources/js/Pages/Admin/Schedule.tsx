import React, { useState } from "react";
import Layout from "@/Layouts/Layout";
import { DataTable } from "../Components/DataTable";
import { ScheduleColumns } from "../Components/ScheduleColumns";
import type { Schedule as ScheduleType } from "../Interfaces/Schedule";
import { router } from "@inertiajs/react";
import DeleteModal from '../Components/DeleteModal';

interface DepartmentProps {
    schedules: ScheduleType[];
}

const Schedule = ({ schedules }: DepartmentProps) => {
    const [scheduleList, setScheduleList] = useState<ScheduleType[]>(schedules);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<string>('');
    const toDelete = scheduleList?.find((item: ScheduleType) => item.id === deletingId);

    const handleEdit = (id: string): void => {
      router.get(`/admin/schedules/edit/${id}`);
    }

    const onDelete = (id: string): void => {
      const filtered_courses = scheduleList.filter((item: ScheduleType) => item.id !== id);
      setScheduleList(filtered_courses);
    }

    return (
        <div className="w-full h-full bg-white shadow-sm rounded-2xl p-4">
            <DataTable
                columns={ScheduleColumns(handleEdit, setIsOpen, setDeletingId)}
                data={scheduleList || []}
                filterLabel={"day"}
                filterColumn={"day_of_week"}
                createUrl={"/admin/schedules/create"}
            />
            <DeleteModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              toDelete={toDelete}
              onDelete={onDelete}
              deletingId={deletingId}
              url={'/admin/schedules/delete'}
              nameField="name"
              errorMessage="Failed to delete course"
            />
        </div>
    );
};

Schedule.layout = (page: React.ReactNode) => (
    <Layout title="Schedules">{page}</Layout>
);
export default Schedule;
