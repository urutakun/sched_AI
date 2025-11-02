import Layout from "@/Layouts/Layout";
import React, { useState, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Schedule as ScheduleType} from '../Interfaces/Schedule';
import type { AssignCourse } from "../Interfaces/AssignCourse";
import type { Department } from "../Interfaces/Department";
import type { AcademicYear } from "../Interfaces/AcademicYear";
import type { Trimester } from "../Interfaces/Trimester";
import type { Room } from "../Interfaces/Room";
import DayMultiSelect from "../Components/DayMultiSelect";
import { toast } from "sonner";

interface RoomFormProps {
  schedule?: ScheduleType;
  course_assignments: AssignCourse[];
  departments: Department[];
  academic_years: AcademicYear[];
  rooms: Room[];
}

const ScheduleForm = ({
  schedule,
  course_assignments,
  academic_years,
  departments,
  rooms,
}: RoomFormProps) => {
    const [courseAssignmentList, setCourseAssignmentList] = useState<AssignCourse[]>(course_assignments);
    const [departmentList, setDepartmentList] =useState<Department[]>(departments ?? []);
    const [academicYearList, setAcademicYearList] =useState<AcademicYear[]>(academic_years ?? []);
    const [trimesterList, setTrimesterList] =useState<Trimester[]>([]);
    const [roomList, setRoomList] =useState<Room[]>(rooms ?? []);
    console.log(courseAssignmentList);

    const { data, setData, errors, post, put, reset } = useForm({
        course_assignment_id: schedule?.course_assignment_id ?? "",
        academic_years_id: schedule?.academic_years_id ?? "",
        trimester_id: schedule?.trimester_id ?? "",
        department_id: schedule?.department_id ?? "",
        room_id: schedule?.room_id ?? "",
        days: schedule?.days ?? [] as string[],
        start_time: schedule?.start_time ?? "",
        end_time: schedule?.end_time ?? "",
    });

    useEffect(() => {
      const selectedYear = academicYearList.find((year) => year.id === data.academic_years_id);
      const filteredTrimesters = selectedYear?.trimesters ?? [];
      setTrimesterList(filteredTrimesters);

      if (filteredTrimesters.length === 0) {
        setData("trimester_id", "");
      } else {
        const stillValid = filteredTrimesters.some(
          (t) => t.id === data.trimester_id
        );
        if (!stillValid) {
          setData("trimester_id", "");
        }
      }
    }, [data.academic_years_id, academicYearList])

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if(schedule){
          put(`/admin/schedules/update/${schedule.id}`, {
            onSuccess: () => toast.success('Schedule updated successfully'),
            onError: () => toast.error('Failed to update schedule')
          })
        }
        else{
          post("/admin/schedules/create", {
              onSuccess: () => {
                  toast.success("Schedule created successfully");
                  reset();
              },
              onError: () => {
                  toast.error("Failed to create schedule");
                  reset();
              },
          });
        }
    };

    return (
        <div className="h-full lg:min-h-[500px] w-full bg-white shadow-sm rounded-2xl p-6 flex justify-center items-center">
            <form
                onSubmit={handleFormSubmit}
                action=""
                className="w-full lg:w-[500px] font-dm lg:border border-custom-accent/50 lg:p-4 rounded-2xl"
            >
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>{ schedule ? 'Update Schedule' : 'Create Schedule'}</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Academic Year
                                </FieldLabel>
                                <Select
                                    value={data.academic_years_id}
                                    onValueChange={(value) =>
                                        setData("academic_years_id", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select academic year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYearList?.map((item: AcademicYear, index: number) => (
                                          <SelectItem value={item.id} key={index} className="capitalize">
                                            {`AY ${item.year_start} - ${item.year_end}`}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {errors.academic_years_id ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Trimester
                                </FieldLabel>
                                <Select
                                    value={data.trimester_id}
                                    onValueChange={(value) =>
                                        setData("trimester_id", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select trimester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {trimesterList?.map((item: Trimester, index: number) => (
                                          <SelectItem value={item.id} key={index} className="capitalize">
                                            {item.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {errors.trimester_id ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="department">
                                    Department
                                </FieldLabel>
                                <Select
                                    value={data.department_id}
                                    onValueChange={(value) =>
                                        setData("department_id", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departmentList.map(
                                            (
                                                department: Department,
                                                index: number
                                            ) => {
                                                return (
                                                    <SelectItem
                                                        value={
                                                            department.id
                                                        }
                                                        key={index}
                                                        className="capitalize"
                                                    >
                                                        {department.name}
                                                    </SelectItem>
                                                );
                                            }
                                        )}
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.department_id ?? ""}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Course Assignment
                                </FieldLabel>
                                <Select
                                    value={data.course_assignment_id}
                                    onValueChange={(value) =>
                                        setData("course_assignment_id", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select course assignment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {courseAssignmentList.map((assignment: AssignCourse, index: number) => {
                                        console.log(assignment);
                                        const course = assignment.course.name;
                                        const instructor = `${assignment.instructor.user.first_name} ${assignment.instructor.user.last_name}`;
                                        return(
                                          <SelectItem value={assignment.course_id} className="capitalize">
                                              {`${course} - ${instructor}`}
                                          </SelectItem>
                                        )
                                      })}
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {errors.course_assignment_id ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Room
                                </FieldLabel>
                                <Select
                                    value={data.room_id}
                                    onValueChange={(value) =>
                                        setData("room_id", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select room" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {roomList.map((room: Room, index: number) => {
                                        return(
                                          <SelectItem value={room.id} className="capitalize">
                                              {room.room_name}
                                          </SelectItem>
                                        )
                                      })}
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {errors.course_assignment_id ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Days
                                </FieldLabel>
                                <DayMultiSelect
                                  value={data.days}
                                  onChange={(days) => setData("days", days)}
                                />
                                <FieldError>
                                    {errors.course_assignment_id ?? ""}
                                </FieldError>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Link href={"/admin/rooms"}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
};

ScheduleForm.layout = (page: React.ReactNode) => (
    <Layout title="Schedules">{page}</Layout>
);
export default ScheduleForm;
