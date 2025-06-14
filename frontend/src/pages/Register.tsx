import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/userContext";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type RegisterFormsInputs = {
  email: string;
  userName: string;
  password: string;
};

// Define Yup validation schema for the registration form with detailed password rules
const validation = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address.").required("Email is required"),
  userName: Yup.string()
    .required("Username is required")
    .max(15, "Username must be at most 15 characters long.")
    .matches(
      /^[A-Za-z][A-Za-z0-9_]*$/,
      "Must start with a letter and contain only letters, numbers, and underscores."
    ),
  password: Yup.string()
    .required("Password is required")
    .min(8, "At least 8 characters long")
    .matches(/[a-z]/, "One lowercase letter")
    .matches(/[A-Z]/, "One uppercase letter")
    .matches(/\d/, "One number")
    .matches(/[^A-Za-z0-9]/, "One special character"),
});

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormsInputs>({
    resolver: yupResolver(validation),
    mode: "onChange",
  });

  const password = watch("password");

  // Calculate the status of each password requirement for visual feedback
  const passwordReqs = {
    length: password ? password.length >= 8 : false,
    lowercase: password ? /[a-z]/.test(password) : false,
    uppercase: password ? /[A-Z]/.test(password) : false,
    number: password ? /\d/.test(password) : false,
    special: password ? /[^A-Za-z0-9]/.test(password) : false,
  };

  const handleRegister = async (form: RegisterFormsInputs) => {
    setFormMessage({ text: '', type: '' });

    if (!isValid) {
      setFormMessage({ text: 'Please fix the errors before submitting.', type: 'error' });
      return;
    }

    try {
      const success = await registerUser(form.email, form.userName, form.password);

      if (success) {
        setFormMessage({ text: 'Signup successful! Redirecting to login...', type: 'success' });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // The toast.error from registerUser in userContext will handle the specific error.
        // This formMessage is a generic fallback.
        setFormMessage({ text: 'Registration failed. Please try again.', type: 'error' });
      }
    } catch (error) {
      setFormMessage({ text: 'Could not connect to the server.', type: 'error' });
      console.error("Registration request failed:", error);
    }
  };

  return (
    <div className="flex bg-muted justify-center h-svh items-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Join us today!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleRegister)}>
            <div className="flex flex-col gap-6">

              {formMessage.text && (
                <div
                  className={`p-3 text-sm rounded-lg ${
                    formMessage.type === 'success'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                  role="alert"
                >
                  {formMessage.text}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 -mt-2 ml-2">{errors.email.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  {...register("userName")}
                />
                {errors.userName && <p className="text-red-500 -mt-2 ml-2">{errors.userName.message}</p>}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" {...register('password')} />
              </div>

              {/* Password Requirements: Dynamically show checkmark/cross based on validation */}
              <div id="password-reqs" className="text-xs text-gray-500 space-y-1">
                <p className={`flex items-center ${passwordReqs.length ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordReqs.length ? (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  )}
                  At least 8 characters long
                </p>
                <p className={`flex items-center ${passwordReqs.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordReqs.lowercase ? (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  )}
                  One lowercase letter
                </p>
                <p className={`flex items-center ${passwordReqs.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordReqs.uppercase ? (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  )}
                  One uppercase letter
                </p>
                <p className={`flex items-center ${passwordReqs.number ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordReqs.number ? (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  )}
                  One number
                </p>
                <p className={`flex items-center ${passwordReqs.special ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordReqs.special ? (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  )}
                  One special character
                </p>
              </div>

            </div>
            <CardFooter className="flex-col gap-2 mt-6 p-0">
              <Button type="submit" className="w-full" disabled={!isValid}>
                Sign Up
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}