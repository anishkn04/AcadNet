# Password Reset API - Quick Guide

## API Endpoints

### 1. Initiate Password Reset
```
POST /api/v1/auth/password-reset
Body: { "email": "user@example.com" }
Response: OTP sent to email
```

### 2. Verify OTP
```
POST /api/v1/auth/password-verify
Body: { "otp": "123456" }
Response: OTP verified
```

### 3. Change Password
```
POST /api/v1/auth/change-password
Body: { "newPassword": "NewSecurePassword123!" }
Response: Password changed successfully
```

## Frontend Implementation

- **Settings Page**: Located at `/user/settings` with "Reset Password" button
- **Reset Flow**: Button navigates to `/forgot` which handles the complete 3-step process
- **Reset Page**: Complete UI with email input, OTP verification, and password change forms

## Usage Flow

1. User clicks "Reset Password" in Settings page
2. Redirected to forgot password page
3. Enter email → Receive OTP → Verify OTP → Set new password
4. Session management handled via temporary cookies

*Note: The password reset feature is already fully implemented and functional.*
