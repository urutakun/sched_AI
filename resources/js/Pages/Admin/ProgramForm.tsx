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
import { Program as ProgramType } from "../Interfaces/Program";
import { toast } from "sonner";
import { Department as DepartmentType } from "../Interfaces/Department";
interface ProgramFormProps {
  program?: ProgramType;
  departments?: DepartmentType[];
}

const ProgramForm = ({ program, departments }: ProgramFormProps) => {
    const [departmentList, setDepartmentList] = useState<DepartmentType[]>(departments ?? []);
    const { data, setData, errors, post, put, reset } = useForm({
        dept_id: program?.dept_id ?? "",
        code: program?.code ?? "",
        name: program?.name ?? "",
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if(program){
          put(`/admin/programs/update/${program.id}`, {
            onSuccess: () => toast.success('Program updated successfully'),
            onError: () => toast.error('Failed to update program')
          })
        }
        else{
          post("/admin/programs/create", {
              onSuccess: () => {
                  toast.success("Program created successfully");
                  reset();
              },
              onError: () => {
                  toast.error("Failed to create program");
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
                        <FieldLegend>{ program ? 'Update Program' : 'Create Progam'}</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Department
                                </FieldLabel>
                                <Select
                                    value={data.dept_id}
                                    onValueChange={(value) =>
                                        setData("dept_id", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {departmentList.map((item: DepartmentType, index: number) => (
                                        <SelectItem value={item.id} className="capitalize">
                                            {item.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {errors.dept_id ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="code">Code</FieldLabel>
                                <Input
                                    id="code"
                                    autoComplete="off"
                                    maxLength={8}
                                    placeholder="e.g., BSIT, BSCS, BSBA"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                />
                                <FieldError>
                                    {errors.code ?? ""}
                                </FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    autoComplete="off"
                                    placeholder="e.g., Bachelor of Science in Information Technology"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <FieldError>
                                    {errors.name ?? ""}
                                </FieldError>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Link href={"/admin/programs"}>
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

ProgramForm.layout = (page: React.ReactNode) => (<Layout title="Programs">{page}</Layout>);
export default ProgramForm;
