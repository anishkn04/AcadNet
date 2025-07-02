# AcadNet Complete API Documentation

## Overview
This document provides comprehensive information on all API endpoints available in the AcadNet backend application.

**Base URL:** `http://localhost:3000` (or your configured backend port)

**API Version:** 1.0

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Data Management Endpoints](#data-management-endpoints)
3. [Study Group Endpoints](#study-group-endpoints)
4. [Error Responses](#error-responses)
5. [Authentication & Security](#authentication--security)
6. [Frontend Implementation Examples](#frontend-implementation-examples)

---

## Authentication Endpoints

### Base Route: `/api/v1/auth`

### 1. User Signup
**Endpoint:** `POST /api/v1/auth/signup`

**Description:** Register a new user account

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Validation Rules:**
- Email must be unique and valid format
- Username must be unique
- Password requirements as per validation

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "Success"
}
```

**Error Responses:**
- `409 Conflict`: Email already in use
- `400 Bad Request`: Validation errors
- `500 Internal Server Error`: Server error

**Cookies Set:**
- `otpToken` (HttpOnly, 1 hour)
- `username` (HttpOnly, 1 hour)

---

### 2. User Login
**Endpoint:** `POST /api/v1/auth/login`

**Description:** Authenticate user and get tokens

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userPassword"
}
```

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "Login Success"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials or user not found
- `409 Conflict`: User must login via GitHub
- `303 See Other`: Redirect to OTP verification
- `500 Internal Server Error`: Server error

**Cookies Set:**
- `accessToken` (HttpOnly, 15 minutes)
- `refreshToken` (HttpOnly, 7 days)
- `csrfToken` (15 minutes)

---

### 3. GitHub OAuth Login
**Endpoint:** `GET /api/v1/auth/github`

**Description:** Initiate GitHub OAuth authentication

**Response:** Redirects to GitHub for authentication

---

### 4. GitHub OAuth Callback
**Endpoint:** `GET /api/v1/auth/github/callback`

**Description:** Handle GitHub OAuth callback

**Success:** Redirects to dashboard with authentication cookies
**Failure:** Redirects to failure page

---

### 5. Authentication Failure
**Endpoint:** `GET /api/v1/auth/failure`

**Description:** Returns authentication failure page

**Response:** HTML failure page with 401 status

---

### 6. Session Check
**Endpoint:** `POST /api/v1/auth/checkSession`

**Description:** Validate current user session

**Headers Required:**
- `Authorization: Bearer <access_token>` (via cookies)
- `X-CSRF-Token: <csrf_token>`

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "Ref Token is Valid"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired session

**Note:** Automatically refreshes access token if valid refresh token exists

---

### 7. Refresh Token
**Endpoint:** `POST /api/v1/auth/refresh-token`

**Description:** Refresh access and CSRF tokens

**Headers Required:**
- `Authorization: Bearer <access_token>` (via cookies)
- `X-CSRF-Token: <csrf_token>`

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "Token refreshed"
}
```

**Error Responses:**
- `401 Unauthorized`: No refresh token provided
- `403 Forbidden`: Invalid refresh token

**Cookies Updated:**
- New `accessToken`, `refreshToken`, `csrfToken`

---

### 8. Logout
**Endpoint:** `POST /api/v1/auth/logout`

**Description:** Logout user from current session

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "Logged out successfully"
}
```

**Error Responses:**
- `400 Bad Request`: No refresh token provided
- `500 Internal Server Error`: Logout failed

**Cookies Cleared:** All authentication cookies

---

### 9. Logout All Sessions
**Endpoint:** `POST /api/v1/auth/logout-all`

**Description:** Logout user from all sessions/devices

**Headers Required:**
- `Authorization: Bearer <access_token>` (via cookies)
- `X-CSRF-Token: <csrf_token>`

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "Logged out from all sessions"
}
```

**Error Responses:**
- `500 Internal Server Error`: Logout all failed

---

### 10. Protected Page Access
**Endpoint:** `GET /api/v1/auth/authorizedPage`

**Description:** Test endpoint for checking authentication

**Headers Required:**
- `Authorization: Bearer <access_token>` (via cookies)
- `X-CSRF-Token: <csrf_token>`

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "Logged In"
}
```

---

### 11. Generate OTP
**Endpoint:** `POST /api/v1/auth/otp-auth`

**Description:** Generate and send OTP for email verification

**Prerequisites:** Must have `username` and `otpToken` cookies from signup

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "OTP Sent"
}
```

**Error Responses:**
- Various error codes depending on failure reason

---

### 12. Verify OTP
**Endpoint:** `POST /api/v1/auth/otp-verify`

**Description:** Verify OTP for account activation

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Prerequisites:** Must have `username` and `otpToken` cookies

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "Verified"
}
```

**Cookies Cleared:** `username`, `otpToken`

---

### 13. Password Reset Request
**Endpoint:** `POST /api/v1/auth/password-reset`

**Description:** Send password reset OTP to user email

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "OTP SENT"
}
```

**Cookies Set:**
- `username` (HttpOnly, 5 minutes)
- `resetToken` (HttpOnly, 5 minutes)

---

### 14. Verify Password Reset OTP
**Endpoint:** `POST /api/v1/auth/password-verify`

**Description:** Verify OTP for password reset

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Prerequisites:** Must have `username` and `resetToken` cookies

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "Verified"
}
```

---

### 15. Change Password
**Endpoint:** `POST /api/v1/auth/change-password`

**Description:** Change user password after OTP verification

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "newPassword": "newSecurePassword123"
}
```

**Prerequisites:** Must have `username` and `resetToken` cookies

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "Password has been reset successfully."
}
```

**Error Responses:**
- `400 Bad Request`: New password is required

**Cookies Cleared:** `username`, `resetToken`

---

## Data Management Endpoints

### Base Route: `/api/v1/data`

### 1. Get Current User Information
**Endpoint:** `GET /api/v1/data/user`

**Description:** Get detailed information about the authenticated user

**Headers Required:**
- `Authorization: Bearer <access_token>` (via cookies)
- `X-CSRF-Token: <csrf_token>`

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user_id": "123",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "student",
    "age": 22,
    "phone": "+1234567890",
    "nationality": "US",
    "created_at": "2025-01-01T00:00:00.000Z",
    "Address": {
      "province": "California",
      "district": "Los Angeles",
      "municipality": "Santa Monica",
      "postal_code": "90401"
    },
    "Academic": {
      "Level": {
        "level_name": "Undergraduate"
      },
      "FieldOfStudy": {
        "field_of_study_name": "Computer Science"
      },
      "University": {
        "university_name": "UCLA",
        "Country": {
          "country_name": "United States"
        }
      },
      "College": {
        "college_name": "School of Engineering",
        "University": {
          "university_name": "UCLA",
          "Country": {
            "country_name": "United States"
          }
        },
        "Country": {
          "country_name": "United States"
        }
      }
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: User not found
- `401 Unauthorized`: Invalid authentication

---

### 2. Get User by ID
**Endpoint:** `GET /api/v1/data/user/:userId`

**Description:** Get basic information about a specific user

**Headers Required:**
- `Authorization: Bearer <access_token>` (via cookies)
- `X-CSRF-Token: <csrf_token>`

**URL Parameters:**
- `userId` (string): The ID of the user to retrieve

**Success Response:**
```json
{
  "user_id": "123",
  "username": "johndoe", 
  "created_at": "2025-01-01T00:00:00.000Z",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "student",
  "age": 22,
  "phone": "+1234567890",
  "nationality": "US",
  "address": "Santa Monica, CA",
  "education": "Computer Science at UCLA"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid user ID format
- `404 Not Found`: User not found

---

### 3. Edit User Profile
**Endpoint:** `POST /api/v1/data/editprofile`

**Description:** Update user profile information

**Headers Required:**
- `Authorization: Bearer <access_token>` (via cookies)
- `X-CSRF-Token: <csrf_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "username": "newusername",
  "fullName": "New Full Name",
  "age": 23,
  "phone": "+1234567890",
  "nationality": "US",
  "address": {
    "province": "California",
    "district": "Los Angeles", 
    "municipality": "Santa Monica",
    "postal_code": "90401"
  },
  "education": {
    "level": "Undergraduate",
    "FOS": "Computer Science",
    "university": "UCLA",
    "college": "School of Engineering"
  }
}
```

**Field Descriptions:**
- **Basic Profile Fields**: `username`, `fullName`, `age`, `phone`, `nationality`
- **Address Object**: All address fields are optional
- **Education Object**: All education fields are optional
  - `level`: Academic level (creates if doesn't exist)
  - `FOS`: Field of Study (creates if doesn't exist)
  - `university`: University name (creates if doesn't exist)
  - `college`: College name (creates if doesn't exist)

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": "successful"
}
```

**Error Responses:**
- `404 Not Found`: User not found
- `400 Bad Request`: Validation errors

**Note:** The endpoint automatically creates new records for level, field of study, university, and college if they don't exist in the database.

---

## Study Group Endpoints

### Base Route: `/api/v1/group`

### 1. Get All Public Groups
**Endpoint:** `GET /api/v1/group/groups`

**Description:** Retrieve all public study groups

**Headers Required:**
- `Authorization: Bearer <access_token>` (via cookies)
- `X-CSRF-Token: <csrf_token>`

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "name": "Mathematics Study Group",
      "description": "Advanced mathematics concepts",
      "creatorId": 123,
      "isPrivate": false,
      "createdAt": "2025-07-02T10:00:00.000Z",
      "updatedAt": "2025-07-02T10:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: Can't get response

---

### 2. Create Study Group with Syllabus
**Endpoint:** `POST /api/v1/group/create`

**Description:** Create a new study group with syllabus and optional file resources

**Headers Required:**
- `Authorization: Bearer <access_token>` (via cookies)
- `X-CSRF-Token: <csrf_token>`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**

#### Required Fields:
- **name** (string): Group name
- **syllabus** (JSON string): Syllabus structure with topics

#### Optional Fields:
- **description** (string): Group description
- **isPrivate** (string): "true" or "false" (defaults to false)
- **additionalResources** (files): Up to 10 files

#### Syllabus Structure:
```json
{
  "topics": [
    {
      "title": "Topic Title (Required)",
      "description": "Topic Description (Optional)",
      "subTopics": [
        {
          "title": "Subtopic Title (Required)",
          "content": "Subtopic Content (Optional)"
        }
      ]
    }
  ]
}
```

**Validation Rules:**
- Group name is required
- Syllabus must contain at least one topic
- Each topic must have a title
- Each topic must contain at least one subtopic
- Each subtopic must have a title
- Maximum 10 files allowed

**Success Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "message": "Study group created successfully!",
    "group": {
      "id": 1,
      "name": "Advanced Mathematics",
      "description": "Group for advanced math topics",
      "creatorId": 123,
      "isPrivate": false,
      "createdAt": "2025-07-02T10:00:00.000Z",
      "updatedAt": "2025-07-02T10:00:00.000Z",
      "additionalResources": [
        {
          "id": 1,
          "studyGroupId": 1,
          "filePath": "resources/1_resources/1.pdf"
        }
      ],
      "syllabus": {
        "id": 1,
        "studyGroupId": 1,
        "createdAt": "2025-07-02T10:00:00.000Z",
        "updatedAt": "2025-07-02T10:00:00.000Z",
        "topics": [
          {
            "id": 1,
            "syllabusId": 1,
            "title": "Calculus",
            "description": "Differential and Integral Calculus",
            "createdAt": "2025-07-02T10:00:00.000Z",
            "updatedAt": "2025-07-02T10:00:00.000Z",
            "subTopics": [
              {
                "id": 1,
                "topicId": 1,
                "title": "Derivatives",
                "content": "Rules and applications of derivatives",
                "createdAt": "2025-07-02T10:00:00.000Z",
                "updatedAt": "2025-07-02T10:00:00.000Z"
              }
            ]
          }
        ]
      }
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors (missing name, invalid syllabus, etc.)
- `404 Not Found`: Creator user not found
- `500 Internal Server Error`: Database transaction failed

**File Storage:**
- Files are stored in `resources/{groupId}_resources/` directory
- Files are renamed sequentially (1.pdf, 2.docx, etc.)
- Temporary files are cleaned up on error

---

## Error Responses

### Standard Error Format:
```json
{
  "success": false,
  "statusCode": <error_code>,
  "message": "<error_message>"
}
```

### Common Error Status Codes:

#### 400 Bad Request
- Invalid request data
- Missing required fields
- Validation failures
- Invalid ID formats

#### 401 Unauthorized  
- Invalid or missing authentication tokens
- Expired tokens
- Invalid credentials
- Session expired

#### 403 Forbidden
- Invalid refresh token
- CSRF token mismatch
- Insufficient permissions

#### 404 Not Found
- User not found
- Resource not found
- Invalid user ID

#### 409 Conflict
- Email already in use
- Username already taken
- OAuth login required

#### 500 Internal Server Error
- Database errors
- Server configuration issues
- Unexpected errors

### Authentication Specific Errors:

#### Login Errors:
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Login Error: User not Found"
}

{
  "success": false,
  "statusCode": 401, 
  "message": "Login Error: Wrong Credentials"
}

{
  "success": false,
  "statusCode": 409,
  "message": "Please Login via GitHub"
}

{
  "success": false,
  "statusCode": 303,
  "message": "Redirecting to /otp-auth"
}
```

#### Study Group Creation Errors:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Group name is required."
}

{
  "success": false,
  "statusCode": 400,
  "message": "Syllabus must contain at least one topic."
}

{
  "success": false,
  "statusCode": 400,
  "message": "Each topic must have a title."
}

{
  "success": false,
  "statusCode": 400,
  "message": "Topic 'Calculus' must contain at least one subtopic."
}

{
  "success": false,
  "statusCode": 400,
  "message": "Each subtopic must have a title."
}
```

---

## Authentication & Security

### Token Management
1. **Access Token**: Short-lived (15 minutes), HttpOnly cookie
2. **Refresh Token**: Long-lived (7 days), HttpOnly cookie  
3. **CSRF Token**: Medium-lived (15 minutes), accessible to JavaScript

### Required Headers for Protected Endpoints:
```javascript
{
  'Authorization': 'Bearer <access_token>', // Via cookies
  'X-CSRF-Token': '<csrf_token>',
  'Content-Type': 'application/json' // For JSON requests
}
```

### Middleware Chain for Protected Routes:
1. `authMiddleware`: Validates JWT access token
2. `csrfMiddleware`: Validates CSRF token
3. `addUser`: Adds user info to request object
4. `upload.array`: Handles file uploads (for group creation)

### CORS Configuration:
- Allowed Origins: `localhost:5500`, `127.0.0.1:5500`, `localhost:3000`, `127.0.0.1:3000`
- Credentials: `true` (allows cookies)

---

## Frontend Implementation Examples

### 1. Authentication Helper Functions

```javascript
// API Client Setup
const API_BASE_URL = 'http://localhost:3000/api/v1';

const makeRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken(), // Function to get CSRF token
      ...options.headers
    },
    ...options
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }
  
  return result;
};

// Get CSRF token from cookie
const getCsrfToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrfToken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};
```

### 2. Authentication Functions

```javascript
// User Signup
const signup = async (userData) => {
  return await makeRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

// User Login  
const login = async (credentials) => {
  return await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

// Check Session
const checkSession = async () => {
  return await makeRequest('/auth/checkSession', {
    method: 'POST'
  });
};

// Logout
const logout = async () => {
  return await makeRequest('/auth/logout', {
    method: 'POST'
  });
};

// Generate OTP
const generateOTP = async () => {
  return await makeRequest('/auth/otp-auth', {
    method: 'POST'
  });
};

// Verify OTP
const verifyOTP = async (otp) => {
  return await makeRequest('/auth/otp-verify', {
    method: 'POST',
    body: JSON.stringify({ otp })
  });
};

// Password Reset Request
const requestPasswordReset = async (email) => {
  return await makeRequest('/auth/password-reset', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
};

// Verify Password Reset OTP
const verifyPasswordResetOTP = async (otp) => {
  return await makeRequest('/auth/password-verify', {
    method: 'POST',
    body: JSON.stringify({ otp })
  });
};

// Change Password
const changePassword = async (newPassword) => {
  return await makeRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ newPassword })
  });
};
```

### 3. Data Management Functions

```javascript
// Get Current User
const getCurrentUser = async () => {
  return await makeRequest('/data/user', {
    method: 'GET'
  });
};

// Get User by ID
const getUserById = async (userId) => {
  return await makeRequest(`/data/user/${userId}`, {
    method: 'GET'
  });
};

// Update User Profile
const updateProfile = async (profileData) => {
  return await makeRequest('/data/editprofile', {
    method: 'POST',
    body: JSON.stringify(profileData)
  });
};
```

### 4. Study Group Functions

```javascript
// Get All Public Groups
const getAllGroups = async () => {
  return await makeRequest('/group/groups', {
    method: 'GET'
  });
};

// Create Study Group
const createStudyGroup = async (groupData) => {
  const formData = new FormData();
  
  // Required fields
  formData.append('name', groupData.name);
  formData.append('syllabus', JSON.stringify({
    topics: groupData.topics
  }));
  
  // Optional fields
  if (groupData.description) {
    formData.append('description', groupData.description);
  }
  if (groupData.isPrivate !== undefined) {
    formData.append('isPrivate', groupData.isPrivate.toString());
  }
  
  // Files
  if (groupData.files && groupData.files.length > 0) {
    groupData.files.forEach(file => {
      formData.append('additionalResources', file);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/group/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': getCsrfToken()
      // Don't set Content-Type for FormData
    },
    body: formData
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to create group');
  }
  
  return result;
};
```

### 5. Error Handling

```javascript
const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Handle specific error types
  if (error.message.includes('401')) {
    // Redirect to login
    window.location.href = '/login';
  } else if (error.message.includes('403')) {
    // CSRF token might be expired, try to refresh
    window.location.reload();
  } else {
    // Show user-friendly error message
    alert(error.message || 'An error occurred');
  }
};

// Usage example
try {
  const user = await getCurrentUser();
  console.log('User data:', user);
} catch (error) {
  handleApiError(error);
}
```

### 6. Complete React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Check session first
        await checkSession();
        
        // Load user data and groups
        const [userData, groupsData] = await Promise.all([
          getCurrentUser(),
          getAllGroups()
        ]);
        
        setUser(userData.data);
        setGroups(groupsData.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      handleApiError(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <button onClick={handleLogout}>Logout</button>
      
      <h2>Public Study Groups</h2>
      {groups.map(group => (
        <div key={group.id}>
          <h3>{group.name}</h3>
          <p>{group.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
```

---

## Testing the API

### Using Postman/Insomnia:

1. **Setup Environment:**
   - Base URL: `http://localhost:3000/api/v1`
   - Enable cookie jar for session management

2. **Authentication Flow:**
   - Signup → Generate OTP → Verify OTP → Login
   - Or use GitHub OAuth flow

3. **Test Protected Endpoints:**
   - Ensure cookies are included in requests
   - Add CSRF token to headers

4. **File Upload Testing:**
   - Use form-data for group creation
   - Test with various file types and sizes

### Example Test Sequence:

1. **Register new user:**
   ```
   POST /auth/signup
   Body: {"email": "test@example.com", "username": "testuser", "password": "password123"}
   ```

2. **Generate OTP:**
   ```
   POST /auth/otp-auth
   (Uses cookies from signup)
   ```

3. **Verify OTP:**
   ```
   POST /auth/otp-verify  
   Body: {"otp": "123456"}
   ```

4. **Login:**
   ```
   POST /auth/login
   Body: {"email": "test@example.com", "password": "password123"}
   ```

5. **Access protected resources:**
   ```
   GET /data/user
   Headers: X-CSRF-Token: <token_from_cookie>
   ```

---

## Additional Notes

### File Upload Specifications:
- **Maximum Files**: 10 per group
- **Storage Location**: `resources/{groupId}_resources/`
- **File Naming**: Sequential numbering (1.pdf, 2.docx, etc.)
- **Cleanup**: Automatic cleanup on transaction failure

### Database Relationships:
- **User** → **Address** (One-to-One)
- **User** → **Academic** (One-to-One)
- **StudyGroup** → **Syllabus** (One-to-One)
- **Syllabus** → **Topics** (One-to-Many)
- **Topic** → **SubTopics** (One-to-Many)
- **StudyGroup** → **AdditionalResources** (One-to-Many)

### Security Best Practices:
1. Always validate input on both frontend and backend
2. Use HTTPS in production
3. Implement rate limiting for auth endpoints
4. Store JWT tokens in httpOnly cookies
5. Validate file types and sizes for uploads
6. Use CSRF protection for state-changing operations

---

*Generated on: July 2, 2025*  
*API Version: 1.0*  
*Backend Framework: Node.js + Express + Sequelize*  
*Database: PostgreSQL/MySQL*  
*Authentication: JWT + CSRF tokens*
