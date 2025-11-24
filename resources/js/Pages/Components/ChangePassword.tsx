import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import Layout from '@/Layouts/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';

const ChangePassword = () => {

  const { data, setData, errors, put, reset } = useForm({
    old_password: '',
    password: '',
    password_confirmation: ''
  });

  const user = usePage().props.auth.user;

  const handleFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    put(route(`${user.role}.change-password.update`, user.id), {
      onSuccess: () => {
        toast.success('Password updated successfully');
        reset();
      },
      onError: () => toast.success('Failed to update password'),
    })
  }

  return (
      <div className="h-full lg:min-h-[500px] w-full bg-white shadow-sm rounded-2xl p-6 flex justify-center items-center">
          <form
              onSubmit={(e) => handleFormSubmit(e)}
              action=""
              className="w-full lg:w-[500px] font-dm lg:border border-custom-accent/50 lg:p-4 rounded-2xl"
          >
              <FieldGroup>
                  <FieldSet>
                      <FieldLegend>Create New Password</FieldLegend>
                      <FieldGroup>
                          <Field>
                              <FieldLabel htmlFor="old_password">Old Password</FieldLabel>
                              <Input
                                  type="password"
                                  id="old_password"
                                  value={data.old_password}
                                  onChange={(e) =>
                                      setData("old_password", e.target.value)
                                  }
                              />
                              <FieldError>
                                  {errors.old_password ?? ""}
                              </FieldError>
                          </Field>
                          <Field>
                              <FieldLabel htmlFor="password">New Password</FieldLabel>
                              <Input
                                  type="password"
                                  id="password"
                                  value={data.password}
                                  onChange={(e) =>
                                      setData("password", e.target.value)
                                  }
                              />
                              <FieldError>
                                  {errors.password ?? ""}
                              </FieldError>
                          </Field>
                          <Field>
                              <FieldLabel htmlFor="password_confirmation">Confirm New Password</FieldLabel>
                              <Input
                                  type="password"
                                  id="password_confirmation"
                                  value={data.password_confirmation}
                                  onChange={(e) =>
                                      setData("password_confirmation", e.target.value)
                                  }
                              />
                              <FieldError>
                                  {errors.password_confirmation ?? ""}
                              </FieldError>
                          </Field>
                      </FieldGroup>
                  </FieldSet>
                  <Field orientation="horizontal">
                      <Button type="submit">Submit</Button>
                  </Field>
              </FieldGroup>
          </form>
      </div>
    );
}

ChangePassword.layout = (page: React.ReactNode) => (
    <Layout title="Change Password">{page}</Layout>
);
export default ChangePassword;
