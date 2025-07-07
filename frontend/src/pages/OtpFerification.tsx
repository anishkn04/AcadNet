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

const OTP_VALIDITY_MINUTES = 5;

const OtpFerification = () => {
  const [minute, setMinute] = useState(OTP_VALIDITY_MINUTES);
  const [second, setSecond] = useState(0);
  const { verifySignupOtp, sendSignupOtp } = useAuth();
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });
  const [isOtpExpired, setIsOtpExpired] = useState(false); // NEW
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
      if (isOtpExpired) {
        setFormMessage({ text: "OTP has expired. Please resend OTP.", type: 'error' });
        return;
      }
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
      setIsOtpExpired(false); // Reset expiry
      const sentSuccess = await sendSignupOtp();
      if (sentSuccess) {
        setFormMessage({ text: "The OTP is sent to your mail.", type: 'success' });
        setMinute(OTP_VALIDITY_MINUTES);
        setSecond(0);
      } else {
        setFormMessage({ text: "Failed to send OTP. Please try again later.", type: "error" });
      }
    } catch (e: any) {
      setFormMessage({ text: e.message || "Failed to send OTP. Please try again later.", type: "error" });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if ((minute > 0 || second > 0) && !isOtpExpired) {
      interval = setInterval(() => {
        if (second > 0) {
          setSecond(prev => prev - 1);
        } else if (minute > 0) {
          setSecond(59);
          setMinute(prev => prev - 1);
        }
      }, 1000);
    } else if (minute === 0 && second === 0 && !isOtpExpired) {
      setIsOtpExpired(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [minute, second, isOtpExpired]);

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
            <CardDescription>
              Please! Enter the OTP<br />
              <span className="text-xs text-gray-500">
                OTP expires in 5 minutes.
              </span>
            </CardDescription>
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
                  disabled={isOtpExpired}
                />
                {errors.otp && (
                  <p className="text-red-500 text-center -mb-3 ml-2">
                    {errors.otp.message}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  {!isOtpExpired ? (
                    <p className="opacity-80">
                      Time Remaining:{" "}
                      <span className="font-medium">
                        {minute < 10 ? `0${minute}` : minute}:
                        {second < 10 ? `0${second}` : second}
                      </span>
                    </p>
                  ) : (
                    <span className="text-red-500 font-medium">OTP expired</span>
                  )}
                  <button
                    type="button"
                    className={`underline cursor-pointer `}
                    onClick={triggerOtp}
                    
                  >
                    Resend OTP
                  </button>
                </div>
                <Button type="submit" className="cursor-pointer" disabled={isOtpExpired}>
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