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
import type { Schedule as ScheduleType } from '../Interfaces/Schedule';
import type { AssignCourse } from "../Interfaces/AssignCourse";
import type { Department } from "../Interfaces/Department";
import type { AcademicYear } from "../Interfaces/AcademicYear";
import type { Trimester } from "../Interfaces/Trimester";
import type { Program } from "../Interfaces/Program";
import type { Room } from "../Interfaces/Room";
import { DayMultiSelect } from "../../components/ui/day-multi-select";
import { TimePicker } from "../../components/ui/time-picker";
import { toast } from "sonner";

interface RoomFormProps {
    schedule?: ScheduleType;
    course_assignments: AssignCourse[];
    departments: Department[];
    academic_years: AcademicYear[];
    rooms: Room[];
    programs: Program[];
    schedules: ScheduleType[];
}

const ScheduleForm = ({
    schedule,
    course_assignments,
    academic_years,
    departments,
    rooms,
    programs,
    schedules,
}: RoomFormProps) => {
    const [courseAssignmentList, setCourseAssignmentList] = useState<AssignCourse[]>(course_assignments);
    const [departmentList, setDepartmentList] = useState<Department[]>(departments ?? []);
    const [programtList, setProgramList] = useState<Program[]>(programs ?? []);
    const [academicYearList, setAcademicYearList] = useState<AcademicYear[]>(academic_years ?? []);
    const [trimesterList, setTrimesterList] = useState<Trimester[]>([]);
    const [roomList, setRoomList] = useState<Room[]>(rooms ?? []);
    const [scheduleList, setScheduleList] = useState<ScheduleType[]>(schedules || []);

    const { data, setData, errors, post, put, reset } = useForm({
        course_assignment_id: schedule?.course_assignment_id ?? "",
        academic_year_id: schedule?.academic_year_id ?? "",
        trimester_id: schedule?.trimester_id ?? "",
        department_id: schedule?.department_id ?? "",
        program_id: schedule?.program_id ?? "",
        section: schedule?.section ?? "",
        room_id: schedule?.room_id ?? "",
        days: schedule?.days ?? [] as string[],
        start_time: schedule?.start_time ?? "",
        end_time: schedule?.end_time ?? "",
    });


    // Filter trimesters
    useEffect(() => {
        const selectedYear = academicYearList.find((year) => year.id === data.academic_year_id);
        const filteredTrimesters = (selectedYear?.trimesters ?? []).filter((trimester) => trimester.status !== 'inactive');
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
    }, [data.academic_year_id, academicYearList])

    // Filter course assignments
    useEffect(() => {
        if (!data.trimester_id || !data.department_id) {
            setCourseAssignmentList(course_assignments);
            return;
        }

        const filteredCourseAssignments = course_assignments.filter((course_assignment) => {
            const alreadyHasSchedule = scheduleList.some(
              (schedule) => schedule.course_assignment_id === course_assignment.id
            );

            return (
                course_assignment.course.trimester_id === data.trimester_id &&
                course_assignment.course.dept_id === data.department_id &&
                !alreadyHasSchedule
            )
        });

        setCourseAssignmentList(filteredCourseAssignments);
    }, [data.trimester_id, data.department_id, course_assignments, scheduleList]);

    // Filter Programs
    useEffect(() => {
        if (!data.department_id) {
            setProgramList(programs);
            return;
        }

        const filteredPrograms = programs?.filter((program) => program.dept_id === data.department_id);
        setProgramList(filteredPrograms);
    }, [data.department_id])

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (schedule) {
            put(`/admin/schedules/update/${schedule.id}`, {
                onSuccess: () => toast.success('Schedule updated successfully'),
                onError: (errors: any) => {
                    // Handle Inertia validation errors properly
                    const errorMessage = errors?.message ||
                        errors?.error ||
                        'Failed to update schedule';
                    toast.error(errorMessage);
                },
            });
        } else {
            post("/admin/schedules/create", {
                onSuccess: (page) => {
                    const message = (page?.props?.flash?.success ?? "Schedule created successfully");
                    toast.success(message);
                    console.log('Error response:', errors);
                    reset(); // Optional: clear form on success
                },
                onError: (errors: any) => {
                    console.log('Error response:', errors);
                    console.log()

                    if (errors?.suggestions_message) {
                        toast.success(errors.suggestions_message, {
                            duration: 8000,
                        });
                    }

                    // Show conflict message as error toast
                    if (errors?.conflict_message) {
                        toast.error(errors.conflict_message);
                    }

                    // Show suggestions message as success toast (blue color in Sonner)


                    // Fallback for other error types
                    if (!errors?.conflict_message && !errors?.suggestions_message) {
                        if (errors?.message) {
                            toast.error(errors.message);
                        } else if (typeof errors === 'string') {
                            toast.error(errors);
                        } else {
                            toast.error("Failed to create schedule");
                        }
                    }
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
                        <FieldLegend>{schedule ? 'Update Schedule' : 'Create Schedule'}</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Academic Year
                                </FieldLabel>
                                <Select
                                    value={data.academic_year_id}
                                    onValueChange={(value) =>
                                        setData("academic_year_id", value)
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
                                    {errors.academic_year_id ?? ""}
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
                                <FieldLabel htmlFor="program">
                                    Program
                                </FieldLabel>
                                <Select
                                    value={data.program_id}
                                    onValueChange={(value) =>
                                        setData("program_id", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {programtList?.map(
                                            (
                                                program: Program,
                                                index: number
                                            ) => {
                                                return (
                                                    <SelectItem
                                                        value={program.id}
                                                        key={index}
                                                        className="capitalize"
                                                    >
                                                        {program.name}
                                                    </SelectItem>
                                                );
                                            }
                                        )}
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.program_id ?? ""}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Section
                                </FieldLabel>
                                <Input
                                    id="section"
                                    autoComplete="off"
                                    placeholder="e.g., A, B"
                                    maxLength={1}
                                    value={data.section}
                                    onChange={(e) =>
                                        setData("section", e.target.value.toUpperCase())
                                    }
                                />
                                <FieldError>
                                    {errors.section ?? ""}
                                </FieldError>
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
                                            const course = assignment.course.name;
                                            const instructor = `${assignment.instructor.user.first_name} ${assignment.instructor.user.last_name}`;
                                            return (
                                                <SelectItem value={assignment.id} className="capitalize">
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
                                            return (
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
                                    {errors.days ?? ""}
                                </FieldError>
                            </Field>
                            <FieldGroup className="grid grid-cols-2">
                                <Field>
                                    <FieldLabel>
                                        Start Time
                                    </FieldLabel>
                                    <TimePicker
                                        value={data.start_time}
                                        onChange={(value) => setData("start_time", value)}
                                    />
                                    <FieldError>
                                        {errors.start_time ?? ""}
                                    </FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        End Time
                                    </FieldLabel>
                                    <TimePicker
                                        value={data.end_time}
                                        onChange={(value) => setData("end_time", value)}
                                    />
                                    <FieldError>
                                        {errors.end_time ?? ""}
                                    </FieldError>
                                </Field>

                            </FieldGroup>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Link href={"/admin/schedules"}>
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
