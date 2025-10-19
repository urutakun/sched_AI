import Layout from "@/Layouts/Layout";
import React, { useState } from "react";
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
import { Department as DepartmentType } from "../Interfaces/Department";
import { toast } from "sonner";

interface CourseFormProps {
    departments: DepartmentType[];
}

const CourseForm = ({ departments }: CourseFormProps) => {
    const [departmentList, setDepartmentList] =
        useState<DepartmentType[]>(departments ?? []);
    const { data, setData, errors, post, reset } = useForm({
        dept_id: "",
        crs_code: "",
        crs_name: "",
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        post("/admin/courses/create", {
            onSuccess: () => {
                toast("Courses created successfully");
                reset();
            },
            onError: () => {
                toast("Failed to create courses");
                reset();
            },
        });
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
                        <FieldLegend>Create Course</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="department">
                                    Department
                                </FieldLabel>
                                <Select
                                    value={data.dept_id}
                                    onValueChange={(value) =>
                                        setData("dept_id", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departmentList.map(
                                            (
                                                department: DepartmentType,
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
                                <FieldError>{errors.dept_id ?? ""}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="code">
                                    Course Code
                                </FieldLabel>
                                <Input
                                    id="code"
                                    autoComplete="off"
                                    placeholder="DSA"
                                    value={data.crs_code}
                                    onChange={(e) =>
                                        setData("crs_code", e.target.value)
                                    }
                                />
                                <FieldError>{errors.crs_code ?? ""}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="name">
                                    Course Name
                                </FieldLabel>
                                <Input
                                    id="name"
                                    autoComplete="off"
                                    placeholder="Data Structures & Algorithms"
                                    value={data.crs_name}
                                    onChange={(e) =>
                                        setData("crs_name", e.target.value)
                                    }
                                />
                                <FieldError>{errors.crs_name ?? ""}</FieldError>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Link href={"/admin/courses"}>
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

CourseForm.layout = (page: React.ReactNode) => (
    <Layout title="Courses">{page}</Layout>
);
export default CourseForm;
