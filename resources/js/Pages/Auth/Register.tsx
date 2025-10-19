import React from "react";
import FormInputField from "../Components/FormInputField";
import FormLabel from "../Components/FormLabel";
import GlassFormInput from "../Components/GlassFormInput";
import FormSubmitButton from "../Components/FormSubmitButton";
import Logo from "../Components/Logo";
import { useForm, Link, Head, router } from "@inertiajs/react";
import { toast } from "sonner";

const Register = () => {
    const { data, setData, errors } = useForm({
        first_name: "",
        last_name: "",
        year: "",
        section: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleRegister = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        router.post("/auth/register", data, {
            onSuccess: () => {
                toast.success("Registered");
            },
        });
    };

    return (
        <div className="w-screen h-screen cbg  font-dm text-black text-sm md:text-base space-y-6 flex flex-col items-center justify-center p-4">
          <div className="header">
            <Logo color={'white'} height={30} width={30}  isVisible={true} size={'text-xl lg:text-2xl'} textColor={'text-white'}/>
          </div>
          <div className="form-wrapper w-full lg:w-[600px] h-[700px] lg:h-[880px] relative bg-[linear-gradient(to_bottom,rgba(200,200,200,0.2),rgba(200,200,200,0.4))] backdrop-blur-[20px] border border-white/10 before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:border before:border-white/20 before:pointer-events-none px-4 py-3 lg:px-6 lg:py-6 rounded-3xl text-white tracking-tight font-bold flex flex-col items-center justify-center space-y-8 lg:space-y-8">
            <div className="form-header text-center space-y-2 w-full">
              <h1 className="text-2xl lg:text-4xl tracking-tighter">Create an account</h1>
              <p className="font-light text-base lg:text-lg">Enter your email and password</p>
            </div>
            <form className="w-full" onSubmit={handleRegister}>
              <div className="full_name grid grid-cols-2 gap-x-6">
                <FormInputField>
                  <FormLabel htmlFor={'first_name'} textLabel={'First Name'}/>
                  <GlassFormInput id={'first_name'} type={'text'} placeholder={'John '} value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} error={errors.first_name} className="w-full"/>
                </FormInputField>
                <FormInputField>
                  <FormLabel htmlFor={'last_name'} textLabel={'Last Name'}/>
                  <GlassFormInput id={'last_name'} type={'text'} placeholder={'Doe'} value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} error={errors.last_name} className="w-full"/>
                </FormInputField>
              </div>
              <div className="info grid grid-cols-2 gap-x-6">
                <FormInputField>
                  <FormLabel htmlFor={'year'} textLabel={'Year'}/>
                  <GlassFormInput id={'year'} type={'number'} min={1} max={4} placeholder={'e.g., 1-4'} value={data.year} onChange={(e) => setData('year', e.target.value)} error={errors.year} className="w-full"/>
                </FormInputField>
                <FormInputField>
                  <FormLabel htmlFor={'section'} textLabel={'Section'}/>
                  <GlassFormInput id={'section'} type={'text'} maxLength={1} placeholder={'e.g., A, B, C'} value={data.section} onChange={(e) => setData('section', e.target.value.toUpperCase())} error={errors.section} className="w-full"/>
                </FormInputField>
              </div>
              <FormInputField>
                <FormLabel htmlFor={'email'} textLabel={'Email'}/>
                <GlassFormInput id={'email'} type={'text'} placeholder={'johndoe@example.com'} value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} className="w-full"/>
              </FormInputField>
              <FormInputField>
                <FormLabel htmlFor={'password'} textLabel={'Password'}/>
                <GlassFormInput id={'password'} type={'password'} value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} className="w-full"/>
              </FormInputField>
              <FormInputField>
                <FormLabel htmlFor={'password_confirmation'} textLabel={'Confirm Password'}/>
                <GlassFormInput id={'password_confirmation'} type={'password'} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} error={errors.password} className="w-full"/>
              </FormInputField>
              <FormInputField className="space-y-4 text-center">
                <FormSubmitButton submit={'Register'} />
                <span className="block font-light">
                  Already have an account? <Link href={'/auth/login'} className="underline">Login</Link>
                </span>
              </FormInputField>
            </form>
          </div>
        </div>
    );
};

export default Register;
