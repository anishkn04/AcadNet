import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/userContext";
import { useNavigate } from "react-router-dom";
import type { OtpFormInput } from "@/models/User";
import { useEffect, useState } from "react";

const OTPValidation = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required for verification")
    .min(6, "OTP must be of 6 digits")
    .max(6, "OTP exceeds")
    .matches(/^[0-9]+$/, "Must be only digits"),
});

const OtpFerification = () => {
  const [minute, setMinute] = useState(1);
  const [second, setSecond] = useState(0);
  const { verifySignupOtp, sendSignupOtp } = useAuth();
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormInput>({
    resolver: yupResolver(OTPValidation),
  });

  const handleOtp = async ({ otp }: OtpFormInput) => {
    try {
      setFormMessage({ text: '', type: '' });
      const success = await verifySignupOtp(otp);
      if (success) {
        navigate('/login', { replace: true });
      }
    } catch (e: any) {
      setFormMessage({ text: e.message || "Failed to verify OTP.", type: 'error' });
    }
  };

  const triggerOtp = async () => {
    try {
      setFormMessage({ text: '', type: '' });
      setIsResendDisabled(true);
      const sentSuccess = await sendSignupOtp();
      if (sentSuccess) {
        setFormMessage({ text: "The OTP is sent to your mail.", type: 'success' });
        setMinute(1);
        setSecond(0);
      } else {
        setFormMessage({ text: "Failed to send OTP. Please try again later.", type: "error" });
      }
    } catch (e: any) {
      setFormMessage({ text: e.message || "Failed to send OTP. Please try again later.", type: "error" });
      setIsResendDisabled(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isResendDisabled && (minute > 0 || second > 0)) {
      interval = setInterval(() => {
        if (second > 0) {
          setSecond(prev => prev - 1);
        } else if (minute > 0) {
          setSecond(59);
          setMinute(prev => prev - 1);
        } else {
          clearInterval(interval!);
          setIsResendDisabled(false);
        }
      }, 1000);
    } else if (minute === 0 && second === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isResendDisabled, minute, second]);

  return (
    <div className="flex bg-muted justify-center h-svh items-center w-full ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-86"
      >
        <Card className="w-full ">
          <CardHeader className="text-center">
            <CardTitle>OTP Verification</CardTitle>
            <CardDescription>Please! Enter the OTP</CardDescription>
          </CardHeader>
          <CardContent>
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
            <form onSubmit={handleSubmit(handleOtp)}>
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  placeholder="------"
                  {...register('otp')}
                  className="text-center text-2xl tracking-[1em]"
                />
                {errors.otp && (
                  <p className="text-red-500 text-center -mb-3 ml-2">
                    {errors.otp.message}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  {isResendDisabled && (minute > 0 || second > 0) ? (
                    <p className="opacity-80">
                      Time Remaining:{" "}
                      <span className="font-medium">
                        {minute < 10 ? `0${minute}` : minute}:
                        {second < 10 ? `0${second}` : second}
                      </span>
                    </p>
                  ) : (
                    <div></div>
                  )}
                  <button
                    type="button"
                    className={`underline cursor-pointer ${
                      isResendDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={triggerOtp}
                    disabled={isResendDisabled}
                  >
                    Resend OTP
                  </button>
                </div>
                <Button type="submit" className="cursor-pointer">
                  Verify OTP
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OtpFerification;