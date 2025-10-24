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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Trimester as TrimesterType } from "../Interfaces/Trimester";
import type { AcademicYear } from "../Interfaces/AcademicYear";

interface TrimesterFormProps {
  academic_years: AcademicYear[];
  trimester: TrimesterType;
}

const TrimesterForm = ({ academic_years, trimester }: TrimesterFormProps) => {
    const [academicYearList, setAcademicYearList] = useState<AcademicYear[]>(academic_years);
    const { data, setData, errors, post, put, reset } = useForm({
        academic_years_id: trimester?.academic_years_id ?? "",
        name: trimester?.name ?? "",
        start_date: trimester?.start_date ?? "",
        end_date: trimester?.end_date ?? "",
        status: trimester?.status ?? "",
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if(trimester){
          put(`/admin/trimesters/update/${trimester.id}`, {
            onSuccess: () => toast.success('Trimester updated successfully'),
            onError: () => toast.error('Failed to update trimester')
          })
        }
        else{
          post("/admin/trimesters/create", {
              onSuccess: () => {
                  toast.success("Trimester created successfully");
                  reset();
              },
              onError: () => {
                  toast.error("Failed to create trimester");
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
                        <FieldLegend>{ trimester ? 'Update Trimester' : 'Create Trimester'}</FieldLegend>
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
                                    Name
                                </FieldLabel>
                                <Select
                                    value={data.name}
                                    onValueChange={(value) =>
                                        setData("name", value as 'First Trimester' | 'Second Trimester' | 'Third Trimester')
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Trimester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="First Trimester" className="capitalize">
                                        First Trimester
                                      </SelectItem>
                                      <SelectItem value="Second Trimester" className="capitalize">
                                        Second Trimester
                                      </SelectItem>
                                      <SelectItem value="Third Trimester" className="capitalize">
                                        Third Trimester
                                      </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {errors.name ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="year_start">Start Date</FieldLabel>
                                 <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-[240px] justify-between font-dm font-light text-muted-foreground px-3",
                                          !data.start_date && "text-muted-foreground"
                                        )}
                                      >
                                        {data.start_date ? (
                                          format(new Date(data.start_date), "PPP")
                                        ) : (
                                          <span>Select start date</span>
                                        )}
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={data.start_date ? new Date(data.start_date) : undefined}
                                        onSelect={(date) =>
                                          setData("start_date", date ? format(date, "yyyy-MM-dd") : "")
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>

                                <FieldError>
                                    {errors.start_date ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="year_start">End Date</FieldLabel>
                                 <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-[240px] justify-between font-dm font-light text-muted-foreground px-3",
                                          !data.end_date && "text-muted-foreground"
                                        )}
                                      >
                                        {data.end_date ? (
                                          format(new Date(data.end_date), "PPP")
                                        ) : (
                                          <span>Select end date</span>
                                        )}
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={data.end_date ? new Date(data.end_date) : undefined}
                                        onSelect={(date) =>
                                          setData("end_date", date ? format(date, "yyyy-MM-dd") : "")
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>

                                <FieldError>
                                    {errors.end_date ?? ""}
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
                        <Link href={"/admin/trimesters"}>
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

TrimesterForm.layout = (page: React.ReactNode) => (
    <Layout title="Trimesters">{page}</Layout>
);
export default TrimesterForm;
