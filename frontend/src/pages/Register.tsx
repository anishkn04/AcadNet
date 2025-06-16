import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/userContext"; // Import useAuth
// import { toast } from "react-toastify"; // Keep toast for direct messages not from context
import { useNavigate } from "react-router-dom";
import type { RegisterFormsInputs } from "@/models/User";
import { useState} from "react";
import PasswordStrengthMeter from "@/components/own_components/PasswordStrengthMeter";




// Define Yup validation schema for the registration form with detailed password rules
const validation = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address.").required("Email is required"),
  userName: Yup.string()
    .required("Username is required")
    .min(3,"Username must be at least 3 charaters.")
    .max(15, "Username must be at most 15 characters long.")
    .matches(
      /^[A-Za-z][A-Za-z0-9_]*$/,
      "Must start with a letter and contain only letters, numbers, and underscores."
    ),
  password: Yup.string()
    .required("Password is required")
    // .min(8, "At least 8 characters long")
    // .matches(/[a-z]/, "One lowercase letter")
    // .matches(/[A-Z]/, "One uppercase letter")
    // .matches(/\d/, "One number")
    // .matches(/[^A-Za-z0-9]/, "One special character"),

   
});


export default function Register() {
  // Destructure sendSignupOtp from useAuth
  const { registerUser ,sendSignupOtp} = useAuth();
  const navigate = useNavigate();
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });
  // const [isSubmitting, setIsSubmitting] = useState(false); // To disable button
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({
    resolver: yupResolver(validation),
    mode: "onChange",
  });

  const password = watch("password");
 
  // Calculate the status of each password requirement for visual feedback
  // const passwordReqs = {
  //   length: password ? password.length >= 8 : false,
  //   lowercase: password ? /[a-z]/.test(password) : false,
  //   uppercase: password ? /[A-Z]/.test(password) : false,
  //   number: password ? /\d/.test(password) : false,
  //   special: password ? /[^A-Za-z0-9]/.test(password) : false,
  // };


  const triggerOtp = async () =>{
    try{
      const sentsucces = await sendSignupOtp();
      if(sentsucces){
        setFormMessage({text:"OTP has been sent to your mail",type:"Success"})
       setTimeout(() => {
          navigate('/otpverification', { replace: true });
        }, 1000);
      
      }else{
        setFormMessage({text:"Failed to send OTP. Please try again later!",type:"error"})
      }
    }catch(e){
      console.log(e)
    }

  }
  const handleRegister = async ({email,userName, password}:RegisterFormsInputs)=>{
    console.log("has triggered")
     try{
       const registerRes = await registerUser(email,userName,password)
       if (registerRes){
          console.log("registered")
          reset()
          triggerOtp()
       }
     }catch(e){
      console.log(e)
     }
  }

 

  return (
    <div className="flex bg-muted justify-center h-svh items-center">
    <motion.div
        initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }} className="max-w-md w-full bg-blue-800/20  backdrop-blur-5xl rounded-2xl shadow-xl 
			overflow-hidden">
      
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
                    className={`p-3 text-sm rounded-lg mb-4 ${
                      formMessage.type === 'success'
                        ? 'bg-green-100 text-green-700'
                        : formMessage.type === 'error'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700' // 'info' type
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
                <PasswordStrengthMeter password={password?? ""}/>
                {/* Password Requirements: Dynamically show checkmark/cross based on validation */}
                {/* <div id="password-reqs" className="text-xs text-gray-500 space-y-1 mb-2">
                  <p className={`flex items-center ${passwordReqs.length ? 'hidden' : 'block text-red-600'}`}>
                    At least 8 characters long
                  </p>
                  <p className={`flex items-center ${passwordReqs.lowercase ? 'hidden' : 'block text-red-500'}`}>
                    One lowercase letter
                  </p>
                  <p className={`flex items-center ${passwordReqs.uppercase ? 'hidden' : 'block text-red-500'}`}>
                    One uppercase letter
                  </p>
                  <p className={`flex items-center ${passwordReqs.number ? 'hidden' : 'block text-red-500'}`}>
                    One number
                  </p>
                  <p className={`flex items-center ${passwordReqs.special ? 'hidden' : 'block text-red-500'}`}>
                    One special character
                  </p>
                </div> */}
              </div>
      
      
                <Button type="submit" className="w-full" >
                  Sign Up
                </Button>
      
            </form>
          </CardContent>
        </Card>
    </motion.div>     
    </div>
  );
}
