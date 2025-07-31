# User Report Feature Documentation

## Overview
This feature allows group members to report other users within their study groups to the group administrators. Reports are reviewed by group admins who can take appropriate action.

## Backend Implementation

### New Endpoints Added

#### 1. Report User in Group
- **Endpoint**: `POST /api/v1/groups/:groupCode/report/:reportedUserId`
- **Description**: Allows a group member to report another member to group admins
- **Authentication**: Required (group membership)
- **Parameters**:
  - `groupCode` (path): The group code
  - `reportedUserId` (path): ID of the user being reported
- **Request Body**:
  ```json
  {
    "reason": "inappropriate_behavior",
    "description": "Optional description of the issue"
  }
  ```
- **Valid Reasons**:
  - `inappropriate_behavior`
  - `harassment`
  - `spam`
  - `offensive_content`
  - `violation_of_rules`
  - `fake_profile`
  - `academic_dishonesty`
  - `other`

#### 2. Get Group Reports (Admin Only)
- **Endpoint**: `GET /api/v1/groups/:groupCode/reports`
- **Description**: Retrieves all reports for a group (admin access only)
- **Authentication**: Required (group admin)
- **Query Parameters**:
  - `status` (optional): Filter by report status (`pending`, `reviewed`, `resolved`, `dismissed`)

### Backend Files Modified

#### 1. `/backend/services/groupservices.js`
Added two new functions:
- `reportUserInGroup()`: Handles user reporting within a group context
- `getGroupReports()`: Retrieves reports for group admins

Key validations:
- Prevents self-reporting
- Ensures both users are group members
- Prevents duplicate reports
- Validates group admin permissions for viewing reports

#### 2. `/backend/controllers/groupcontroller.js`
Added controller functions:
- `reportUserInGroup()`: Controller for reporting users
- `getGroupReportsController()`: Controller for retrieving reports

#### 3. `/backend/routes/grouprouter.js`
Added new routes:
- `POST /:groupCode/report/:reportedUserId`
- `GET /:groupCode/reports`

### Database Model
The feature utilizes the existing `UserReport` model with the following structure:

```javascript
{
  reporterId: INTEGER,        // User making the report
  reportedUserId: INTEGER,    // User being reported
  studyGroupId: UUID,         // Group where report is made
  reason: ENUM,              // Reason for report
  description: TEXT,         // Optional description
  status: ENUM,              // pending, reviewed, resolved, dismissed
  adminNotes: TEXT,          // Admin notes (for future use)
  reviewedBy: INTEGER,       // Admin who reviewed (for future use)
  reviewedAt: DATE          // Review timestamp (for future use)
}
```

### Security Features
1. **Authentication Required**: All endpoints require valid user authentication
2. **CSRF Protection**: All endpoints include CSRF token validation
3. **Group Membership Validation**: Users must be members of the group to report
4. **Admin Authorization**: Only group admins can view reports
5. **Duplicate Prevention**: Users cannot report the same person multiple times in the same group
6. **Self-Report Prevention**: Users cannot report themselves

### API Response Format

#### Successful Report Creation:
```json
{
  "success": true,
  "message": "User reported successfully.",
  "data": {
    "report": {
      "id": 1,
      "reporterId": 3,
      "reportedUserId": 5,
      "studyGroupId": "uuid",
      "reason": "inappropriate_behavior",
      "description": "User posting inappropriate content",
      "status": "pending",
      "created_at": "2025-01-31T...",
      "reporter": {
        "user_id": 3,
        "username": "reporter_user",
        "fullName": "Reporter Name"
      },
      "reportedUser": {
        "user_id": 5,
        "username": "reported_user",
        "fullName": "Reported User Name"
      },
      "studyGroup": {
        "id": "uuid",
        "name": "Group Name",
        "groupCode": "ABC123"
      }
    }
  }
}
```

#### Get Reports Response:
```json
{
  "success": true,
  "message": "Reports retrieved successfully.",
  "data": {
    "reports": [
      {
        "id": 1,
        "reason": "inappropriate_behavior",
        "description": "User posting inappropriate content",
        "status": "pending",
        "created_at": "2025-01-31T...",
        "reporter": { /* user details */ },
        "reportedUser": { /* user details */ },
        "reviewer": null,
        "studyGroup": { /* group details */ }
      }
    ]
  }
}
```

### Error Handling
Common error responses:
- `400`: Invalid reason, missing required fields
- `403`: Not a group member, not a group admin
- `404`: Group not found, user not found
- `409`: User already reported in this group

### Integration with Existing Features
This feature integrates seamlessly with:
- Existing user authentication system
- Group membership system
- Admin role management
- CSRF protection middleware

### Usage Example
1. Group member identifies inappropriate behavior
2. Member calls the report endpoint with reason and description
3. Report is stored with "pending" status
4. Group admin can view all reports via the reports endpoint
5. Admin can take appropriate action based on reports

This implementation provides a robust foundation for user moderation within study groups while maintaining security and preventing abuse.
