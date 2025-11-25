import { useForm, Link } from '@inertiajs/react';
import FormInputField from "../Components/FormInputField";
import FormSubmitButton from '../Components/FormSubmitButton';
import { KeyRound } from 'lucide-react';
import OTPInput from '@/components/ui/otp-input';
import {
  FieldError,
} from "@/components/ui/field"
import { toast } from 'sonner';

export default function OTP(){
    const { data, setData, post, processing, errors, reset } = useForm({
        otp: '',
    });

    const handleFormSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        post('/auth/verify-otp', {
        onSuccess: () => {
          toast.success('Successfully verified OTP');
          reset();
        },
        onError: () => {
          toast.error('Invalid OTP')
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
                <span className='text-4xl font-bold tracking-tighter'>Enter your OTP</span>
                <span className='text-gray-400'>We've sent a verification code to your email.</span>
              </div>
            </div>
            <form
                onSubmit={(e) => handleFormSubmit(e)}
                action=""
                className="w-full lg:w-[500px] font-dm lg:p-4"
            >
                <FormInputField>
                  <OTPInput
                    length={6}
                    value={data.otp}
                    onChange={(value) => setData('otp', value)}
                  />
                  <FieldError className='mt-2 italic'>{errors.otp ?? ""}</FieldError>
                </FormInputField>
                <FormInputField className="space-y-4 text-center">
                    <FormSubmitButton submit={"Verify OTP"} />
                    <span className="block font-light">
                        Already have an account?{" "}
                        <Link href={"/auth/login"} className="underline">
                            Login
                        </Link>
                    </span>
                </FormInputField>
            </form>
        </div>
      </div>
    );
}
