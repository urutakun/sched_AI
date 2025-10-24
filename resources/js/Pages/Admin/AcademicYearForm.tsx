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
import { toast } from "sonner";
import { AcademicYear } from "../Interfaces/AcademicYear";

interface AcademicYearFormProps {
  academic_year: AcademicYear;
}

const AcademicYearForm = ({ academic_year }: AcademicYearFormProps) => {
    const { data, setData, errors, post, put, reset } = useForm({
        year_start: academic_year?.year_start ?? "",
        year_end: academic_year?.year_end ?? "",
        status: academic_year?.status ?? "",
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if(academic_year){
          put(`/admin/academic-years/update/${academic_year.id}`, {
            onSuccess: () => toast.success('Academic year updated successfully'),
            onError: () => toast.error('Failed to update academic year')
          })
        }
        else{
          post("/admin/academic-years/create", {
              onSuccess: () => {
                  toast.success("Academic year created successfully");
                  reset();
              },
              onError: () => {
                  toast.error("Failed to create academic year");
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
                        <FieldLegend>{ academic_year ? 'Update Academic Year' : 'Create Academic Year'}</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="year_start">Year Start</FieldLabel>
                                <Input
                                    id="year_start"
                                    type="text"
                                    autoComplete="off"
                                    maxLength={4}
                                    placeholder="e.g., 2025, 2026"
                                    value={data.year_start}
                                    onChange={(e) =>
                                      setData("year_start", Number(e.target.value))
                                    }
                                    />
                                <FieldError>
                                    {errors.year_start ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="year_start">Year End</FieldLabel>
                                <Input
                                    id="year_end"
                                    type="text"
                                    autoComplete="off"
                                    maxLength={4}
                                    placeholder="e.g., 2025, 2026"
                                    value={data.year_end}
                                    onChange={(e) =>
                                        setData("year_end", Number(e.target.value))
                                    }
                                />
                                <FieldError>
                                    {errors.year_end ?? ""}
                                </FieldError>
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
                        <Link href={"/admin/academic-years"}>
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

AcademicYearForm.layout = (page: React.ReactNode) => (
    <Layout title="Academic Years">{page}</Layout>
);
export default AcademicYearForm;
