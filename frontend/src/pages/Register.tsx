import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner,faEye ,faEyeSlash, faSpaghettiMonsterFlying} from "@fortawesome/free-solid-svg-icons";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/userContext"; 
import { useNavigate } from "react-router-dom";
import type { RegisterFormsInputs } from "@/models/User";
import { useEffect, useState} from "react";
import PasswordStrengthMeter from "@/components/own_components/PasswordStrengthMeter";
import LoadingPage from "./LoadingPage";

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
});

export default function Register() {
  const { registerUser ,sendSignupOtp} = useAuth();
  const [seePwd,setSeePwd] = useState<boolean>(false)
  const navigate = useNavigate();
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });
  const [spin,setSpin] = useState<boolean>(false)
  const [load,setLoad] = useState<boolean>(false)
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

  const togglePwd = () =>{
    setSeePwd(!seePwd)
  }

  const triggerOtp = async () =>{
    try{
      const sentsucces = await sendSignupOtp();
      if(sentsucces){
        setLoad(false)
        navigate('/otpverification', { replace: true });
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
          setLoad(true)
          // if(!load){
          //   navigate('/loading',{replace:true})
          // }
          triggerOtp()
          setSpin(true)
          
       }
     }catch(e){
      console.log(e)
     }
  }
  return (
    
    <div>
      {!load ? (
          <div className="flex bg-muted justify-center h-svh items-center">
      <motion.div
          initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }} className="max-w-md w-full 
            overflow-hidden">
      
            <Card className="w-full max-w-x ">
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
                          : 'bg-blue-100 text-blue-700'
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
                    <div className="flex justify-center items-center gap-2 relative">
                      <Input id="password" type={!seePwd? ('password'):('text')} {...register('password')} />
                      <FontAwesomeIcon onClick={() => togglePwd()} icon={!seePwd? (faEyeSlash):(faEye)} className="absolute right-3 text-gray-500/90 cursor-pointer" />
                    </div>
                  </div>
                  <PasswordStrengthMeter password={password?? ""}/>
                </div>
                  <Button type="submit" className={`w-full cursor-pointer flex justify-center` } >
                    <div className={spin?('block'):('hidden')}>
                      <FontAwesomeIcon icon={faSpinner} className={`animate-spin`}/>
                    </div>
                    Sign Up
                  </Button>
              </form>
            </CardContent>
          </Card>
      </motion.div>
      </div>
      ):(
        <LoadingPage/>
      )}
      
    </div>
  );
}
