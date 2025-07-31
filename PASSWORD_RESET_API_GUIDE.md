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

## Join Group by Code API

### Join Private Groups
```
POST /api/v1/group/join/:groupCode
Body: { "isAnonymous": false }
Response: Successfully joined group
```

## Frontend Implementation

- **Settings Page**: Located at `/user/settings` with "Reset Password" and "Join by Code" buttons
- **Reset Flow**: Button navigates to `/forgot` which handles the complete 3-step process
- **Join by Code**: Available in main groups page and settings - allows joining private groups directly
- **Reset Page**: Complete UI with email input, OTP verification, and password change forms

## Usage Flow

### Password Reset
1. User clicks "Reset Password" in Settings page
2. Redirected to forgot password page
3. Enter email → Receive OTP → Verify OTP → Set new password
4. Session management handled via temporary cookies

### Join by Code
1. User clicks "Join by Code" button in groups page or settings
2. Enter 6-character group code (ABC123 format)
3. Choose anonymous option if desired
4. Successfully join private or public groups

*Note: Both features are fully implemented and functional.*
