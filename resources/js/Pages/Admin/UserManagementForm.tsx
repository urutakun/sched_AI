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
} from "@/components/ui/select";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { User } from '../Interfaces/User'
import { Department } from '../Interfaces/Department';

interface UserFormProps{
  user?: User;
  departments?: Department[];
}

const UserManagementForm = ({ user, departments }: UserFormProps ) => {
  const [departmentList, setDepartmentList] = useState<Department[]>(departments ?? []);
  const { data, setData, errors, post, put, reset } = useForm({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    year: user?.year ?? '',
    section: user?.section ?? '',
    role: user?.role ?? '',
    department_id: user?.department_id ?? '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if(user){
      put(`/admin/user-management/update/${user.id}`, {
        onSuccess: () => toast.success('User updated successfully'),
        onError: () => toast.error('Failed to update user')
      });
    }
    else{
      post('/admin/user-management/create', {
        onSuccess: () => {
          toast.success('User created successfully');
          reset();
        },
        onError: () => {
          toast.error('Failed to create user');
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
            <FieldLegend>{ user ? 'Update User' : 'Create User'}</FieldLegend>
            <FieldGroup>
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
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <Select
                    value={data.role}
                    onValueChange={(value) =>
                        setData("role", value)
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin" className="capitalize">Admin</SelectItem>
                      <SelectItem value="instructor" className="capitalize">Instructor</SelectItem>
                      <SelectItem value="student" className="capitalize">Student</SelectItem>
                    </SelectContent>
                </Select>
                <FieldError>{errors.role ?? ""}</FieldError>
              </Field>
              {data.role === 'student' && (
                <>
                  <Field>
                    <FieldLabel htmlFor="year">Year</FieldLabel>
                    <Input id="year" type='number' min="0" max="4" autoComplete="off" placeholder="e.g., 1 - 4" value={data.year} onChange={(e) => setData('year', e.target.value)} />
                    <FieldError>{errors.year ?? ""}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="section">Section</FieldLabel>
                    <Input id="section" autoComplete="off" maxLength={1} placeholder="e.g., A, B, C" value={data.section} onChange={(e) => setData('section', e.target.value.toUpperCase())} />
                    <FieldError>{errors.section ?? ""}</FieldError>
                  </Field>
                </>
              )}
              {data.role === 'instructor' && (
                <>
                  <Field>
                    <FieldLabel htmlFor="department">Department</FieldLabel>
                    <Select
                      value={data.department_id}
                      onValueChange={(value) =>
                          setData("department_id", value)
                      }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Deparment"/>
                        </SelectTrigger>
                        <SelectContent>
                          {departmentList.map(
                              (department: Department, index: number) => {
                                  return (
                                      <SelectItem value={department.id} key={index} className="capitalize">
                                          {department.name}
                                      </SelectItem>
                                  );
                              }
                          )}
                        </SelectContent>
                    </Select>
                    <FieldError>{errors.year ?? ""}</FieldError>
                  </Field>
                </>
              )}
              {!user && (
                <>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type='email' autoComplete="off" placeholder="johndoe@example.com" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    <FieldError>{errors.email ?? ""}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type='password' value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    <FieldError>{errors.password ?? ""}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
                    <Input id="password_confirmation" type='password' value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                    <FieldError>{errors.password_confirmation ?? ""}</FieldError>
                  </Field>
                </>
              )}
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
          <Button type="submit">Submit</Button>
          <Link href={'/admin/user-management'}>
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

UserManagementForm.layout = (page:React.ReactNode) => <Layout title="User Management">{page}</Layout>
export default UserManagementForm
