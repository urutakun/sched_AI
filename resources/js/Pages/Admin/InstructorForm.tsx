import Layout from '@/Layouts/Layout'
import React, { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Department as DepartmentType } from '../Interfaces/Department'

interface InstructorFormProps{
  departments: DepartmentType[];
}

const InstructorForm = ({ departments }: InstructorFormProps) => {
  const [departmentList, setDepartmentList] = useState<DepartmentType[]>(departments);
  const { data, setData, errors, post } = useForm({
    dept_id: '',
    first_name: '',
    last_name: '',
    position: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  return (
    <div className='h-full lg:min-h-[500px] w-full bg-white shadow-sm rounded-2xl p-6 flex justify-center items-center'>
      <form action="" className='w-full lg:w-[500px] font-dm lg:border border-custom-accent/50 lg:p-4 rounded-2xl'>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Add Instructor</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="department">Department</FieldLabel>
                <Select value={data.dept_id} onValueChange={(value) => setData('dept_id', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      departmentList.map((department: DepartmentType, index: number) => {
                        return(
                          <SelectItem value={department.id} key={index} className='capitalize'>{department.name}</SelectItem>
                        )
                      })
                    }
                  </SelectContent>
                </Select>
                <FieldError>{errors.dept_id ?? ""}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                <Input id="first_name" autoComplete="off" placeholder="John" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                <FieldError>{errors.first_name ?? ""}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                <Input id="last_name" autoComplete="off" placeholder="Doe" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                <FieldError>{errors.last_name ?? ""}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="position">Position</FieldLabel>
                <Input id="position" autoComplete="off" placeholder="Professor" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                <FieldError>{errors.position ?? ""}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="position">Email</FieldLabel>
                <Input id="email" type="email" autoComplete="off" placeholder="johndoe@example.com" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                <FieldError>{errors.email ?? ""}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" autoComplete="off" placeholder="Enter your password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                <FieldError>{errors.password ?? ""}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
                <Input id="password_confirmation" type="password" autoComplete="off" placeholder="Confirm your password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                <FieldError>{errors.password_confirmation ?? ""}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
          <Button type="submit">Submit</Button>
          <Link href={'/admin/instructors'}>
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

InstructorForm.layout = (page:React.ReactNode) => <Layout title="Instructors">{page}</Layout>
export default InstructorForm
