import Layout from "@/Layouts/Layout";
import React, { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch"
import type { Course as CourseType } from "../Interfaces/Course";
import type { AssignCourse as AssignCourseType } from "../Interfaces/AssignCourse";
import { toast } from "sonner";
import { Instructor } from "../Interfaces/Instructor";

interface CourseFormProps {
    course: CourseType;
    assigned_course: AssignCourseType;
    recommended_instructors: Instructor[];
}

const AssignCourseForm = ({ course, assigned_course, recommended_instructors }: CourseFormProps) => {
  const [recommendedInstructorList, setRecommendedInstructorList] = useState<Instructor[]>(recommended_instructors || []);
  console.log(recommendedInstructorList);
    const { data, setData, errors, post, reset, put } = useForm({
        course_id: course?.id ?? "",
        instructor_id: assigned_course?.instructor_id ?? "",
        status: assigned_course?.status ?? ""
    });


    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (assigned_course) {
            put(`/admin/course-assignments/update/${assigned_course.id}`, {
                onSuccess: () => toast.success('Course assignment updated successfully'),
                onError: () => toast.error('Failed to update course assignment')
            });
        }
        else {
            post("/admin/course-assignments/create", {
                onSuccess: () => {
                    toast.success("Course assignment created successfully");
                    reset();
                },
                onError: () => {
                    toast.error("Failed to create course assignment");
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
                        <FieldLegend>{assigned_course ? 'Update Course Assignment' : 'Create Course Assignment'}</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="course">
                                    Course
                                </FieldLabel>
                                <Input
                                    id="course_id"
                                    value={course.name}
                                    onChange={(e) =>
                                        setData("course_id", course.id)
                                    }
                                    disabled
                                />
                                <FieldError>{errors.course_id ?? ""}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="name">
                                    Instructor
                                </FieldLabel>
                                <Select
                                    value={data.instructor_id}
                                    onValueChange={(value) =>
                                        setData("instructor_id", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select instructor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            recommendedInstructorList.map((instructor: Instructor, index: number) => {
                                              const fullName = `${instructor.user.first_name} ${instructor.user.last_name}`;
                                              return(
                                                <SelectItem key={index} value={instructor.id} className="capitalize">
                                                  {fullName}
                                                </SelectItem>
                                              )
                                            })
                                      }
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.instructor_id ?? ""}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Status
                                </FieldLabel>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData("status", value as 'active' | 'inactive')
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="active"
                                            className="capitalize"
                                        >
                                            Active
                                        </SelectItem>
                                        <SelectItem
                                            value="inactive"
                                            className="capitalize"
                                        >
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {errors.status ?? ""}
                                </FieldError>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Link href={"/admin/course-assignments"}>
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

AssignCourseForm.layout = (page: React.ReactNode) => (
    <Layout title="Course Assignment">{page}</Layout>
);
export default AssignCourseForm;
