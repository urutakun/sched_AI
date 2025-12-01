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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Import } from 'lucide-react';
import { toast } from "sonner";
import type { Trimester as TrimesterType } from "../Interfaces/Trimester";
import type { AcademicYear } from "../Interfaces/AcademicYear";


const StudentsForm = () => {
  const [file, setFile] = useState<string | null>(null);
  const { data, setData, post, errors } = useForm({
    file: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file.name);
    setData('file', file);
  }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();

      post('/admin/students/import', {
        onSuccess: () => toast.success('Upload successful!'),
        onError: () => toast.error('Upload Failed')
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
                        <FieldLegend>Upload</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="file_upload"
                                className="border border-dashed border-custom-accent w-full min-h-[150px] rounded-xl
                                flex items-center justify-center text-custom-accent bg-gray-100/50 hover:bg-gray-100
                                ctransition cursor-pointer
                                ">
                                  <Input
                                    id="file_upload"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleChange(e)}
                                  />
                                  <div className="label flex flex-col items-center space-y-3">
                                    <Import />
                                    <span>{file ?? 'Upload CSV file'}</span>
                                  </div>
                                </FieldLabel>
                                <FieldError>
                                    {errors.file ?? ""}
                                </FieldError>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Link href={"/admin/students"}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
};

StudentsForm.layout = (page: React.ReactNode) => (
    <Layout title="Students">{page}</Layout>
);
export default StudentsForm;
