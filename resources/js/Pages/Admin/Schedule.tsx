import React, { useState } from "react";
import Layout from "@/Layouts/Layout";
import { DataTable } from "../Components/DataTable";
import { ScheduleColumns } from "../Components/ScheduleColumns";
import type { Schedule as ScheduleType } from "../Interfaces/Schedule";
import { router, usePage } from "@inertiajs/react";
import DeleteModal from '../Components/DeleteModal';

interface ScheduleProps {
    schedules: ScheduleType[];
}

const Schedule = ({ schedules }: ScheduleProps) => {
  const role = usePage().props.auth.user.role;
  const [scheduleList, setScheduleList] = useState<ScheduleType[]>(schedules || []);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<string>('');
    const toDelete = scheduleList?.find((item: ScheduleType) => item.id === deletingId);

    const handleEdit = (id: string): void => {
      router.get(`/${role}/schedules/edit/${id}`);
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
                filterLabel={"department"}
                filterColumn={"department_name"}
                createUrl={`/${role}/schedules/create`}
            />
            <DeleteModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              toDelete={toDelete}
              onDelete={onDelete}
              deletingId={deletingId}
              url={`/${role}/schedules/delete`}
              nameField="course_assignment.course.name"
              errorMessage="Failed to delete schedule"
            />
        </div>
    );
};

Schedule.layout = (page: React.ReactNode) => (
    <Layout title="Schedules">{page}</Layout>
);
export default Schedule;
