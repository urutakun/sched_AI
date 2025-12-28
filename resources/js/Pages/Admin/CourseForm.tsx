import Layout from "@/Layouts/Layout";
import React, { useEffect, useState } from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
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
import type { Department as DepartmentType } from "../Interfaces/Department";
import type { AcademicYear } from "../Interfaces/AcademicYear";
import type { Trimester } from "../Interfaces/Trimester";
import type { Course as CourseType } from "../Interfaces/Course";
import { toast } from "sonner";

interface CourseFormProps {
    departments: DepartmentType[];
    academic_years: AcademicYear[];
    course: CourseType;
}

const CourseForm = ({ departments, academic_years, course }: CourseFormProps) => {
    const role = usePage().props.auth.user.role;
    const [departmentList, setDepartmentList] =useState<DepartmentType[]>(departments ?? []);
    const [academicYearList, setAcademicYearList] =useState<AcademicYear[]>(academic_years ?? []);
    const [trimesterList, setTrimesterList] =useState<Trimester[]>([]);

    const { data, setData, errors, post, reset, put } = useForm({
        academic_years_id: course?.academic_years_id ?? "",
        trimester_id: course?.trimester_id ?? "",
        dept_id: course?.dept_id ?? "",
        year_level: course?.year_level ?? 0,
        code: course?.code ?? "",
        name: course?.name ?? "",
        units: course?.units ?? "",
        has_lab: course?.has_lab ?? false,
        is_assigned: course?.is_assigned ?? "",
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

        if(course){
           put(`/${role}/courses/update/${course.id}`, {
              onSuccess: () => toast.success('Course updated successfully'),
              onError: () => toast.error('Failed to update course')
            });
        }
        else{
          post(`/${role}/courses/create`, {
              onSuccess: () => {
                  toast.success("Course created successfully");
                  reset();
              },
              onError: () => {
                  toast.error("Failed to create course");
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
                        <FieldLegend>{course ? 'Update Course' : 'Create Course'}</FieldLegend>
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
                                    value={data.code}
                                    maxLength={10}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                />
                                <FieldError>{errors.code ?? ""}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="description">
                                    Descriptive Title
                                </FieldLabel>
                                <Input
                                    id="name"
                                    autoComplete="off"
                                    placeholder="Data Structures & Algorithms"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <FieldError>{errors.name ?? ""}</FieldError>
                            </Field>
                             <Field>
                                <FieldLabel htmlFor="year_level">
                                    Year Level
                                </FieldLabel>
                                <Select
                                    value={data.year_level ? String(data.year_level) : ''}
                                    onValueChange={(value) =>
                                        setData("year_level", Number(value))
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select year level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1"  className="capitalize">First Year</SelectItem>
                                      <SelectItem value="2"  className="capitalize">Second Year</SelectItem>
                                      <SelectItem value="3"  className="capitalize">Third Year</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.year_level ?? ""}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="units">
                                    Units
                                </FieldLabel>
                                <Input
                                    id="units"
                                    type="number"
                                    autoComplete="off"
                                    value={data.units}
                                    onChange={(e) =>
                                        setData("units", Number(e.target.value))
                                    }
                                />
                                <FieldError>{errors.units ?? ""}</FieldError>
                            </Field>
                            { course && (
                              <Field>
                                <FieldLabel>
                                    Status
                                </FieldLabel>
                                <Select
                                    value={data.is_assigned}
                                    onValueChange={(value) =>
                                        setData("is_assigned", value as 'assigned' | 'not_assigned')
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="assigned"
                                            className="capitalize"
                                        >
                                            Assigned
                                        </SelectItem>
                                        <SelectItem
                                            value="not_assigned"
                                            className="capitalize"
                                        >
                                            Not Assigned
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {errors.is_assigned ?? ""}
                                </FieldError>
                              </Field>
                            )}
                            <Field>
                                <FieldLabel htmlFor="has_lab">
                                  Use Lab
                                </FieldLabel>
                                <div className="flex item-center space-x-3">
                                  <Switch
                                      id="has_lab"
                                      checked={data.has_lab}
                                      onCheckedChange={(checked) =>
                                          setData("has_lab", checked)
                                      }
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {data.has_lab ? "Yes, has lab" : "No lab required"}
                                  </span>
                                </div>
                                <FieldError>{errors.has_lab ?? ""}</FieldError>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Link href={`/${role}/courses`}>
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
