import React from 'react'
import Layout from '@/Layouts/Layout'
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
import { User } from '../Interfaces/User';

interface ProfilesProps {
  auth_user: User;
}

const Profiles = ({ auth_user }: ProfilesProps) => {
  console.log(auth_user);
  const fullName = `${auth_user?.first_name} ${auth_user?.last_name}`
  return (
    <div className='h-full lg:min-h-[500px] w-full bg-white shadow-sm rounded-2xl p-6 flex justify-center items-center'>
      <div className='wrapper w-full lg:w-[500px] font-dm lg:border border-custom-accent/50 lg:p-4 rounded-2xl space-y-4'>
        <div className="profile_picture flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-400">
            <img className="w-full h-full object-fit" src={auth_user.avatar ?? '/assets/images/avatar/default.png'} alt="profile"/>
          </div>
        </div>
        <FieldGroup>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="code">
                            Name
                        </FieldLabel>
                        <Input
                            id="code"
                            disabled
                            value={fullName}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="code">
                            Email
                        </FieldLabel>
                        <Input
                            id="code"
                            disabled
                            value={auth_user.email}
                        />
                    </Field>

                    {auth_user.role === 'student' && (
                      <>
                        <Field>
                            <FieldLabel htmlFor="code">
                                Program
                            </FieldLabel>
                            <Input
                                id="code"
                                disabled
                                value={auth_user.student.program.name}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="code">
                                Year
                            </FieldLabel>
                            <Input
                                id="code"
                                disabled
                                value={auth_user.student.year}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="code">
                                Section
                            </FieldLabel>
                            <Input
                                id="code"
                                disabled
                                value={auth_user.student.section}
                            />
                        </Field>
                      </>
                    )}
                    {auth_user.role === 'instructor' && (
                      <>
                        <Field>
                            <FieldLabel htmlFor="code">
                                Program
                            </FieldLabel>
                            <Input
                                id="code"
                                disabled
                                value={auth_user.instructor.department.name}
                            />
                        </Field>
                      </>
                    )}
                </FieldGroup>
            </FieldSet>
        </FieldGroup>
      </div>
    </div>
  )
}


Profiles.layout = (page: React.ReactNode) => <Layout title="Profile">{page}</Layout>
export default Profiles
