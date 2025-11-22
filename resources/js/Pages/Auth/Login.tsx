import React from "react";
import FormInputField from "../Components/FormInputField";
import FormLabel from "../Components/FormLabel";
import GlassFormInput from "../Components/GlassFormInput";
import FormSubmitButton from "../Components/FormSubmitButton";
import Logo from "../Components/Logo";
import { useForm, Link, Head, router } from "@inertiajs/react";
import { toast } from "sonner";

const Login = () => {
    const { data, setData, errors, post, reset } = useForm({
        email: "",
        password: "",
    });

    const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        router.post("/auth/login", data, {
            onSuccess: () => {
                toast.success("Logged In");
                reset("password");
            }
        });
    };

    const handleForgotPassword = (): void => {
        return;
    };

    return (
        <div className="w-screen h-screen cbg  font-dm text-black text-sm md:text-base space-y-6 flex flex-col items-center justify-center p-4">
            <div className="header">
                <Logo
                    color={"white"}
                    height={30}
                    width={30}
                    isVisible={true}
                    size={"text-xl lg:text-2xl"}
                    textColor={"text-white"}
                />
            </div>
            <div className="form-wrapper w-full lg:w-[600px] h-[480px] lg:h-[600px] relative bg-[linear-gradient(to_bottom,rgba(200,200,200,0.2),rgba(200,200,200,0.4))] backdrop-blur-[20px] border border-white/10 before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:border before:border-white/20 before:pointer-events-none px-4 py-3 lg:px-6 lg:py-6 rounded-3xl text-white tracking-tight font-bold flex flex-col items-center justify-center space-y-12 lg:space-y-16">
                <div className="form-header text-center space-y-2 w-full">
                    <h1 className="text-2xl lg:text-4xl tracking-tighter">
                        Welcome Back
                    </h1>
                    <p className="font-light text-base lg:text-lg">
                        Enter your email and password
                    </p>
                </div>
                <form onSubmit={handleLogin} className="w-full">
                    <FormInputField>
                        <FormLabel htmlFor={"email"} textLabel={"Email"} />
                        <GlassFormInput
                            id={"email"}
                            type={"text"}
                            placeholder={"johndoe@example.com"}
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            error={errors.email}
                            className="w-full"
                        />
                    </FormInputField>
                    <FormInputField>
                        <div className="passwd flex justify-between items-center">
                            <FormLabel
                                htmlFor={"password"}
                                textLabel={"Password"}
                            />
                            <Link
                                href={"/auth/forgot"}
                                className="font-light hover:underline ctransition"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <GlassFormInput
                            id={"password"}
                            type={"password"}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            error={errors.password}
                            className="w-full"
                        />
                    </FormInputField>
                    <FormInputField className="space-y-4 text-center">
                        <FormSubmitButton submit={"Log in"} />
                        {/* <span className="block font-light">
                            Don't have an account yet?{" "}
                            <Link href={"/auth/register"} className="underline">
                                Register
                            </Link>
                        </span> */}
                    </FormInputField>
                </form>
            </div>
        </div>
    );
};

export default Login;
