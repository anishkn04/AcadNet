import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/userContext';
import axios from 'axios'; // Import axios for error checking

type OtpFormInputs = {
  otp: string;
};

const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be a 6-digit number"),
});

const OtpVerificationPage: React.FC = () => {
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0); // State for countdown timer
  const navigate = useNavigate();
  const { sendSignupOtp, verifySignupOtp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<OtpFormInputs>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // Function to start the cooldown timer
  const startCooldown = useCallback((seconds: number) => {
    setCooldownSeconds(seconds);
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer); // Cleanup function
  }, []);

  // Effect to request OTP on page load
    useEffect(() => {
    const requestInitialOtp = async () => {
      setFormMessage({ text: 'Sending OTP...', type: 'info' });
      setIsSubmitting(true);
      try {
        const success = await sendSignupOtp();
        if (success) {
          setFormMessage({ text: 'A new OTP has been sent to your email.', type: 'success' });
          // Do NOT start a cooldown here on initial send.
          // The cooldown is for subsequent resend attempts.
        } else {
          // If `sendSignupOtp` returns false, it means an error occurred
          // and was likely toasted by the context.
          // Set a generic error message if context didn't provide specific message.
          setFormMessage({ text: 'Failed to send initial OTP. Please try resending.', type: 'error' });
        }
      } catch (e: any) {
        // This catch block handles errors re-thrown from sendSignupOtp (e.g., Axios errors)
        // For initial OTP, a 429 here means the backend already has a cooldown for this user.
        // We still display the cooldown message to inform the user.
        const errorMsg = (error: any) => axios.isAxiosError(error) && error.response?.data?.message ? error.response.data.message : 'An unexpected error occurred.';
        const match = errorMsg(e).match(/(\d+) seconds/);

        if (axios.isAxiosError(e) && e.response?.status === 429 && match && match[1]) {
          const timeLeft = parseInt(match[1], 10);
          startCooldown(timeLeft);
          setFormMessage({ text: `Due to previous attempts, please wait ${timeLeft} seconds before requesting another OTP.`, type: 'error' });
        } else {
          setFormMessage({ text: `Failed to send initial OTP: ${errorMsg(e)}. Please try again.`, type: 'error' });
          console.error("Initial OTP request failed unexpectedly:", e);
        }
      } finally {
        setIsSubmitting(false);
      }
    };
    requestInitialOtp();
  }, [sendSignupOtp, startCooldown]);


  const handleVerifyOtp = async (data: OtpFormInputs) => {
    setFormMessage({ text: '', type: '' });
    setIsSubmitting(true);

    const success = await verifySignupOtp(data.otp);
    if (success) {
      setFormMessage({ text: 'Verification successful! Redirecting to login...', type: 'success' });
      reset();
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      // Error message for failed OTP verification (handled by context and toasting)
      setFormMessage({ text: 'OTP verification failed. Invalid code.', type: 'error' });
    }
    setIsSubmitting(false);
  };

  const handleResendOtp = async () => {
    setFormMessage({ text: '', type: '' });
    setIsSubmitting(true);
    
    // Before attempting to send, ensure cooldown has passed
    if (cooldownSeconds > 0) {
      setFormMessage({ text: `Please wait ${cooldownSeconds} seconds before requesting another OTP.`, type: 'error' });
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await sendSignupOtp();
      if (success) {
        setFormMessage({ text: 'A new OTP has been sent to your email.', type: 'success' });
        startCooldown(60); // Start a default 60-second cooldown after successful resend
      } else {
        // If `sendSignupOtp` returns false, the error and its message would have been
        // handled (toasted) within `useContext.tsx`. We set a generic error message here.
        setFormMessage({ text: 'Failed to resend OTP. Please try again.', type: 'error' });
      }
    } catch (e: any) {
        // This catch block handles errors thrown from sendSignupOtp that were re-thrown
        const errorMsg = (error: any) => axios.isAxiosError(error) && error.response?.data?.message ? error.response.data.message : '';
        const match = errorMsg(e).match(/(\d+) seconds/);
        if (axios.isAxiosError(e) && e.response?.status === 429 && match && match[1]) {
            const timeLeft = parseInt(match[1], 10);
            startCooldown(timeLeft);
            setFormMessage({ text: `Please wait ${timeLeft} seconds before requesting another OTP.`, type: 'error' });
        } else {
            setFormMessage({ text: 'An unexpected error occurred during resend.', type: 'error' });
            console.error("Resend OTP failed unexpectedly:", e);
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex bg-muted justify-center h-svh items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification code to your email address.
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
                  : 'bg-blue-100 text-blue-700' // 'info' type
              }`}
              role="alert"
            >
              {formMessage.text}
            </div>
          )}
          <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                pattern="\d{6}"
                maxLength={6}
                placeholder="------"
                className="text-center text-2xl tracking-[1em]"
                {...register("otp")}
              />
              {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || !isValid}>
              {isSubmitting ? "Verifying..." : "Verify Account"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={handleResendOtp}
              disabled={isSubmitting || cooldownSeconds > 0} // Disable if submitting or on cooldown
            >
              {cooldownSeconds > 0 ? `Resend Code in ${cooldownSeconds}s` : "Resend Code"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpVerificationPage;