// src/pages/ForgotPasswordPage.tsx
// MODIFIED: Uses methods from useAuth context instead of direct API calls.
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/userContext'; 

// Type for Step 1 form inputs (Email)
type ForgotPasswordEmailInputs = {
  email: string;
};

// Type for Step 2 form inputs (OTP and New Password)
type ResetPasswordInputs = {
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
};

// Validation schema for email (Step 1)
const emailValidationSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address.").required("Email is required"),
});

// Validation schema for new password (Step 2 - re-using rules from register.tsx)
const resetPasswordValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be 6 digits"), // Validate OTP format
  newPassword: Yup.string()
    .required("New Password is required")
    .min(8, "At least 8 characters long")
    .matches(/[a-z]/, "One lowercase letter")
    .matches(/[A-Z]/, "One uppercase letter")
    .matches(/\d/, "One number")
    .matches(/[^A-Za-z0-9]/, "One special character"),
  confirmNewPassword: Yup.string()
    .required("Confirm New Password is required")
    .oneOf([Yup.ref('newPassword')], 'Passwords must match') // Ensure passwords match
});


const ForgotPasswordPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [emailForReset, setEmailForReset] = useState('');
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword, resetPasswordWithOTP } = useAuth(); // Destructure methods from useAuth

  // --- Form Hooks for each step ---
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm<ForgotPasswordEmailInputs>({
    resolver: yupResolver(emailValidationSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors, isValid: isResetFormValid },
    watch,
    reset: resetPasswordForm,
  } = useForm<ResetPasswordInputs>({
    resolver: yupResolver(resetPasswordValidationSchema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword");

  const passwordReqs = {
    length: newPassword ? newPassword.length >= 8 : false,
    lowercase: newPassword ? /[a-z]/.test(newPassword) : false,
    uppercase: newPassword ? /[A-Z]/.test(newPassword) : false,
    number: newPassword ? /\d/.test(newPassword) : false,
    special: newPassword ? /[^A-Za-z0-9]/.test(newPassword) : false,
  };

  // --- Step 1: Send Reset Code (Email Submission) ---
  const handleSendEmail = async (data: ForgotPasswordEmailInputs) => {
    setFormMessage({ text: '', type: '' });
    setIsSubmitting(true);

    const success = await forgotPassword(data.email); 
    if (success) {
      setEmailForReset(data.email);
      setFormMessage({
        text: "A reset OTP has been sent your email",
        type: 'success'
      });
      setCurrentStep(2);
      resetEmailForm();
    } else {
      setFormMessage({
        text: "Failed to send reset code. Please check the email address.",
        type: 'error'
      });
    }
    setIsSubmitting(false);
  };

  // --- Step 2: Verify OTP and Reset Password ---
  const handleResetPassword = async (data: ResetPasswordInputs) => {
    setFormMessage({ text: '', type: '' });
    setIsSubmitting(true);

    const success = await resetPasswordWithOTP(data.otp, data.newPassword); // Use context method
    if (success) {
      setFormMessage({
        text: "Your password has been reset successfully. Redirecting to login...",
        type: 'success'
      });
      resetPasswordForm();
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setFormMessage({
        text: "Password reset failed. Please try again or check your OTP.",
        type: 'error'
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex bg-muted justify-center h-svh items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          {currentStep === 1 ? (
            <>
              <CardTitle className="text-center">Forgot Your Password?</CardTitle>
              <CardDescription className="text-center">
                Enter your email and we'll send you a code to reset your password.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-center">Reset Your Password</CardTitle>
              <CardDescription className="text-center">
                Check your email for the verification code.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {formMessage.text && (
            <div
              className={`p-3 text-sm rounded-lg mb-4 ${
                formMessage.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
              role="alert"
            >
              {formMessage.text}
            </div>
          )}

          {/* Step 1: Send OTP Form */}
          {currentStep === 1 && (
            <form onSubmit={handleSubmitEmail(handleSendEmail)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...registerEmail("email")}
                />
                {emailErrors.email && <p className="text-red-500 text-xs mt-1">{emailErrors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          )}
          {/* Step 2: OTP and New Password Form */}
          {currentStep === 2 && (
            <form onSubmit={handleSubmitReset(handleResetPassword)} className="space-y-4">
              <p className="text-sm text-gray-600">Code sent to: <span className="font-semibold">{emailForReset}</span></p>
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="------"
                  className="text-center text-2xl tracking-[1em]"
                  {...registerReset("otp")}
                />
                {resetErrors.otp && <p className="text-red-500 text-xs mt-1">{resetErrors.otp.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  {...registerReset("newPassword")}
                />
                {resetErrors.newPassword && <p className="text-red-500 text-xs mt-1">{resetErrors.newPassword.message}</p>}
              </div>

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

              <div className="grid gap-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="••••••••"
                  {...registerReset("confirmNewPassword")}
                />
                {resetErrors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{resetErrors.confirmNewPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || !isResetFormValid}>
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-sm text-center flex justify-center">
          <p>
            Remembered your password?{' '}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;