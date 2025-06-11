import { Button } from "@/components/ui/button"
import {
  Card,
  // CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/userContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type RegisterFormsInputs = {
  email: string;
  userName: string;
  password: string;
};
const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});
export default function Register() {
    const { registerUser } = useAuth();
    const navigate = useNavigate();
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<RegisterFormsInputs>({
      resolver: yupResolver(validation),
    });
  
    const handleLogin = async (form: RegisterFormsInputs) => {
      const success = await registerUser(form.email, form.userName, form.password);
  
      if (success) {
        navigate("/");
      } else {
        toast.error("Sorry! Unable to register at a moment");
      }
    };
  return (
    <div className="flex bg-muted justify-center h-svh items-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
         
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
              </div>
         {errors.email ? <p className="text-red-500 -mt-5 -mb-3 ml-2">{errors.email.message}</p>:""}
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  {...register("userName")}
                />
              </div>
                   {errors.userName ? <p className="text-red-500 -mt-5 -mb-3 ml-2">{errors.userName.message}</p>:""}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" {...register('password')} />
              </div>
                   {errors.password ? <p className=" bottom-49 ml-2 -mt-5 -mb-3 text-red-500 ">{errors.password.message}</p>:""}
            </div>
            <CardFooter className="flex-col gap-2 mt-6">
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}