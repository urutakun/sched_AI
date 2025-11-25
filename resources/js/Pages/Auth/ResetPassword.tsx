import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import FormInputField from "../Components/FormInputField";
import FormSubmitButton from '../Components/FormSubmitButton';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from 'lucide-react';
import OTPInput from '@/components/ui/otp-input';
import {
  FieldError,
} from "@/components/ui/field"
import { toast } from 'sonner';

export default function ResetPassword(){
    const { data, setData, post, errors, reset } = useForm({
        password: '',
        password_confirmation: ''
    });

    const handleFormSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        post('/auth/reset-password', {
        onSuccess: () => {
          toast.success('Reset Password Successfully');
          reset();
        },
        onError: () => {
          toast.error('Failed to reset password')
          reset();
        }
        });
    };

    return (
      <div className='w-full h-screen bg-custom-primary'>
        <div className="h-full lg:min-h-[500px] w-full shadow-sm rounded-2xl p-6 flex flex-col justify-center items-center space-y-8">
            <div className='header flex flex-col items-center space-y-8'>
              <div className="icon w-fit bg-blue-200 text-blue-600 p-5 rounded-full">
                <KeyRound size='30px'/>
              </div>
              <div className="header_text flex flex-col items-center font-dm space-y-2">
                <span className='text-4xl font-bold tracking-tighter'>Create New Password</span>
                <span className='text-gray-400'>Enter a secure password for your account.</span>
              </div>
            </div>
            <form
                onSubmit={(e) => handleFormSubmit(e)}
                action=""
                className="w-full lg:w-[500px] font-dm lg:p-4"
            >
                <FormInputField>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={data.password}
                    className='h-[50px] bg-white'
                    onChange={(e) => setData('password', e.target.value)}
                  />
                  <FieldError className='mt-2 italic'>{errors.password ?? ""}</FieldError>
                </FormInputField>
                <FormInputField>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={data.password_confirmation}
                    className='h-[50px] bg-white'
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                  />
                  <FieldError className='mt-2 italic'>{errors.password_confirmation ?? ""}</FieldError>
                </FormInputField>
                <FormInputField className="space-y-4 text-center">
                    <FormSubmitButton submit={"Reset Password"} />
                </FormInputField>
            </form>
        </div>
      </div>
    );
}
