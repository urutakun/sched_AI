import Layout from '@/Layouts/Layout'
import React, { useState } from 'react'
import { useForm, Link } from '@inertiajs/react'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
import { Department } from '../Interfaces/Department'
import { Program } from '../Interfaces/Program'

interface UserFormProps {
  user?: User
  departments?: Department[]
  programs?: Program[]
}

const UserManagementForm = ({ user, departments, programs }: UserFormProps) => {
  const { data, setData, errors, post, put, reset } = useForm({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    role: user?.role ?? '',
    year: user?.student?.year ?? '',
    section: user?.student?.section ?? '',
    program_id: user?.student?.program_id?.toString() ?? '',
    department_id: user?.instructor?.dept_id?.toString() ?? '',
    instructor_type: user?.instructor?.instructor_type ?? '',
    max_load: user?.instructor?.max_load ?? '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const onSuccess = () => {
      toast.success(user ? 'User updated successfully' : 'User created successfully')
      if (!user) reset()
    }

    const onError = () => toast.error('Something went wrong. Please check the form.')

    if (user) {
      put(`/admin/user-management/update/${user.id}`, { onSuccess, onError })
    } else {
      post('/admin/user-management/create', { onSuccess, onError })
    }
  }

  return (
    <div className="h-full lg:min-h-[500px] w-full bg-white shadow-sm rounded-2xl p-6 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full lg:w-[500px] font-dm lg:border border-custom-accent/50 lg:p-4 rounded-2xl">
        <FieldSet>
          <FieldLegend>{user ? 'Update User' : 'Create User'}</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input value={data.first_name} placeholder='Jone' onChange={(e) => setData('first_name', e.target.value)} />
              <FieldError>{errors.first_name}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input value={data.last_name} placeholder='Doe' onChange={(e) => setData('last_name', e.target.value)} />
              <FieldError>{errors.last_name}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{errors.role}</FieldError>
            </Field>

            {data.role === 'student' && (
              <>
                <Field>
                  <FieldLabel>Year</FieldLabel>
                  <Input type="number" value={data.year} placeholder='1 - 4' onChange={(e) => setData('year', e.target.value)} />
                  <FieldError>{errors.year}</FieldError>
                </Field>
                <Field>
                  <FieldLabel>Section</FieldLabel>
                  <Input value={data.section} maxLength={1} placeholder='A, B, C, ...' onChange={(e) => setData('section', e.target.value.toUpperCase())} />
                  <FieldError>{errors.section}</FieldError>
                </Field>
                <Field>
                  <FieldLabel>Program</FieldLabel>
                  <Select
                    value={data.program_id}
                    onValueChange={(val) => setData('program_id', val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Program" /></SelectTrigger>
                    <SelectContent>
                      {programs?.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.program_id}</FieldError>
                </Field>
              </>
            )}

            {data.role === 'instructor' && (
              <>
                <Field>
                  <FieldLabel>Department</FieldLabel>
                  <Select
                    value={data.department_id}
                    onValueChange={(val) => setData('department_id', val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                    <SelectContent>
                      {departments?.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.department_id}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>Instructor Type</FieldLabel>
                  <Select
                    value={data.instructor_type}
                    onValueChange={(val) => setData('instructor_type', val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Instructor Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="part-time">Part-Time</SelectItem>
                        <SelectItem value="full-time">Full-Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.instructor_type}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>Max Load</FieldLabel>
                  <Input type="number" value={data.max_load} placeholder='24' onChange={(e) => setData('max_load', e.target.value)} />
                  <FieldError>{errors.max_load}</FieldError>
                </Field>
              </>
            )}

            {!user && (
              <>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input type="email" value={data.email} placeholder='example@sched.ai' onChange={(e) => setData('email', e.target.value)} />
                  <FieldError>{errors.email}</FieldError>
                </Field>
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                  <FieldError>{errors.password}</FieldError>
                </Field>
                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                  <FieldError>{errors.password_confirmation}</FieldError>
                </Field>
              </>
            )}

            <div className="flex gap-2 mt-4">
              <Button type="submit">Submit</Button>
              <Link href="/admin/user-management">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}

UserManagementForm.layout = (page: React.ReactNode) => <Layout title="User Management">{page}</Layout>
export default UserManagementForm
