import Layout from '@/Layouts/Layout'
import React from 'react'
import { useForm, Link } from '@inertiajs/react'
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
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { Department as DepartmentType } from "../Interfaces/Department"

interface DepartmentFormProps{
  department?: DepartmentType;
}

const DepartmentForm = ({ department }: DepartmentFormProps ) => {
  const { data, setData, errors, post, put, reset } = useForm({
    code: department?.code ?? '',
    name: department?.name ?? '',
    head: department?.head ??''
  })

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if(department){
      put(`/admin/departments/update/${department.id}`, {
        onSuccess: () => toast.success('Department updated successfully'),
        onError: () => toast.error('Failed to update department')
      });
    }
    else{
      post('/admin/departments/create', {
        onSuccess: () => {
          toast.success('Department created successfully');
          reset();
        },
        onError: () => {
          toast.error('Failed to create department');
          reset();
        }
      });
    }
  }

  return (
    <div className='h-full lg:min-h-[500px] w-full bg-white shadow-sm rounded-2xl p-6 flex justify-center items-center'>
      <form onSubmit={handleFormSubmit} className='w-full lg:w-[500px] font-dm lg:border border-custom-accent/50 lg:p-4 rounded-2xl'>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{ department ? 'Update Department' : 'Create Department'}</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="code">Code</FieldLabel>
                <Input id="code" autoComplete="off" placeholder="e.g., CCE, CTE" value={data.code} onChange={(e) => setData('code', e.target.value)} />
                <FieldError>{errors.code ?? ""}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" autoComplete="off" placeholder="College of Computer Education" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <FieldError>{errors.name ?? ""}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="head">Head</FieldLabel>
                <Input id="head" autoComplete="off" placeholder="John Doe" value={data.head} onChange={(e) => setData('head', e.target.value)} />
                <FieldError>{errors.head ?? ""}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
          <Button type="submit">Submit</Button>
          <Link href={'/admin/departments'}>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}

DepartmentForm.layout = (page:React.ReactNode) => <Layout title="Departments">{page}</Layout>
export default DepartmentForm
