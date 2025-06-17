import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/userContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import {motion} from "framer-motion"

type LoginFormsInputs = {
  email: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
  .required("Password is required")
  .min(8, "At least 8 characters long")
  .matches(/[a-z]/, "One lowercase letter")
  .matches(/[A-Z]/, "One uppercase letter")
  .matches(/\d/, "One number")
  .matches(/[^A-Za-z0-9]/, "One special character")
  ,
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { loginUser, isLoggedIn, isLoading,sendSignupOtp,isVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState('');

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormsInputs>({
    resolver: yupResolver(validation),
  });

  useEffect(() => {
    if (!isLoading && isLoggedIn()) {
      navigate(from, { replace: true });
    }
  }, [isLoading, isLoggedIn, navigate, from]);

  const handleLogin = async (form: LoginFormsInputs) => {
    setFormError('');
    try {
      const success = await loginUser(form.email, form.password);
      if (success) {
        reset();
        navigate(from, { replace: true });
      } else if (isVerified) {
        await sendSignupOtp();
        setFormError('Please verify your email to login.');
         navigate('/otpverification',{replace:true})
        }else{
          console.log("failed to sent otp")
        }
    } catch (error:any) {
      console.log(error.response.data.message)
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Checking session...</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <motion.div 
      initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }} 
      >
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit(handleLogin)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome!</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your Acadnet account
                  </p>
                </div>
                {formError && (
                  <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {formError}
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-red-500 -mt-3 -mb-3 ml-2">{errors.email.message}</p>}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to={'/forgot'}
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                  {errors.password && <p className="-mt-3 -mb-3 bottom-80 ml-2 text-red-500 ">{errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <a href={(apiClient.defaults.baseURL ?? "") + "auth/github"}>
                    <Button variant="outline" type="button" className="w-full">
                      <FontAwesomeIcon icon={faGithub} className="mr-2" />
                      Login with GitHub
                    </Button>
                  </a>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="acadnet_login_img.png"
                alt="acadnet"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}