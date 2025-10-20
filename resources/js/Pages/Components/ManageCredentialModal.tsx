import React, { useEffect } from 'react'
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
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import axios from 'axios';

interface ManageCredentialModalProps<T = any> {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toManage: T;
}

const ManageCredentialModal = ({ isModalOpen, setIsModalOpen, toManage }: ManageCredentialModalProps) => {
  type CredentialFormData = {
    email: string;
    password: string;
    password_confirmation: string;
  }

  useEffect(() => {
    if (toManage) {
      setData({
        email: toManage.email ?? '',
        password: '',
        password_confirmation: ''
      });
    }
  }, [toManage]);

  const { data, setData, reset } = useForm<CredentialFormData>({
    email: toManage?.email ?? '',
    password: '',
    password_confirmation: ''
  })

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if(!toManage?.id) return;

    axios.put(`/admin/user-management/updateCredentials/${toManage.id}`, data)
      .then((res) => {
        toast.success(res.data.message);
        setIsModalOpen(false);
        reset();
      })
      .catch((error) => {
         if (error.response?.status === 422) {
            const errors = error.response.data.errors;

            Object.values(errors).forEach((fieldErrors: any) => {
              toast.error(fieldErrors[0]);
            });
          } else {
            toast.error("Failed to update credentials");
          }
          setIsModalOpen(false);
      })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>Manage Credentials</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input id='email' value={data.email} autoComplete='off' placeholder='john@example.com' onChange={(e) => setData('email', e.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor='password'>Password</FieldLabel>
                <Input id='password' type="password" value={data.password} autoComplete='off' onChange={(e) => setData('password', e.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor='password_confirmation'>Confirm Password</FieldLabel>
                <Input id='password_confirmation' type="password" value={data.password_confirmation} autoComplete='off' onChange={(e) => setData('password_confirmation', e.target.value)} />
              </Field>
            </FieldSet>
          </FieldGroup>
          <DialogFooter className='flex flex-row mt-6'>
            <Button size={'lg'} type="submit">Submit</Button>
            <Button size={'lg'} variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter >
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ManageCredentialModal
