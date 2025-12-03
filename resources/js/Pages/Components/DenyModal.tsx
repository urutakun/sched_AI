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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from '@inertiajs/react'
import { toast } from 'sonner'

interface DenyModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

const DenyModal = ({
  isOpen,
  setIsOpen,
  id
}: DenyModalProps) => {

  const { data, setData, post, errors, reset, transform } = useForm({
    denial_reason: '',
    other_reason: '',
  });

  transform((data) => ({
  denial_reason: data.denial_reason === 'other' ? data.other_reason : data.denial_reason
  }));

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    post(`/admin/schedules/cancel-request/deny/${id}`, {
      onSuccess: () => {
        toast.success('Cancellation request denied');
        setIsOpen(false);
        reset();
      },
      onError: () => {
        toast.error('Failed to deny request!')
        setIsOpen(false);
        reset();
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader className='flex-row items-center space-x-4'>
          <DialogTitle className='text-xl'>Deny Request</DialogTitle>
        </DialogHeader>
        <form action="" className='w-full font-dm' onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="department">Denial Reason</FieldLabel>
                  <Select value={data.denial_reason} onValueChange={(value) => setData('denial_reason', value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Denial Reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Duplicate cancellation request">Duplicate cancellation request</SelectItem>
                      <SelectItem value="Attached document is invalid">Attached document is invalid</SelectItem>
                      <SelectItem value="Session already completed">Session already completed</SelectItem>
                      <SelectItem value="Request does not meet policy requirements">Request does not meet policy requirements</SelectItem>
                      <SelectItem value="other">Other &#40;specify&#41;</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.denial_reason ?? ""}</FieldError>
                </Field>
                {data.denial_reason === 'other' && (
                  <Field>
                    <FieldLabel htmlFor="first_name">Other Reason</FieldLabel>
                    <Textarea
                        id="name"
                        autoComplete="off"
                        placeholder="Type your reason here"
                        value={data.other_reason}
                        onChange={(e) =>
                            setData("other_reason", e.target.value)
                        }
                    />
                    <FieldError>{errors.other_reason ?? ""}</FieldError>
                  </Field>
                )}
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="button">Cancel</Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DenyModal
