# Study Groups API Documentation

## Endpoints

### GET /api/groups
- **Description:** Get all public study groups.
- **Auth:** Required
- **CSRF:** Required
- **Response:**
  - 200 OK: List of study groups
  - 4xx/5xx: Error message

### POST /api/create
- **Description:** Create a new study group with syllabus and additional resources.
- **Auth:** Required
- **CSRF:** Required
- **Body (multipart/form-data):**
  - `name` (string, required): Name of the group
  - `description` (string, optional): Description of the group
  - `isPrivate` (boolean, optional): Whether the group is private
  - `syllabus` (JSON string, required): Syllabus object. Example:
    ```json
    {
      "topics": [
        {
          "title": "Unit 1",
          "description": "...",
          "subTopics": [
            { "title": "Subtopic 1", "content": "..." }
          ]
        }
      ]
    }
    ```
  - `additionalResources` (file[], optional): Up to 10 files (pdf, doc, image, video, audio, etc.)
- **Response:**
  - 201 Created: Group object with syllabus and resources
  - 4xx/5xx: Error message

### GET /api/v1/group/overview
- **Description:** Get an overview of all study groups, including group name, description, file counts (by type), total files, member count, syllabus, and creator name.
- **Auth:** Required
- **CSRF:** Required
- **Response:**
  - 200 OK: Array of group overviews
  - 4xx/5xx: Error message

**Example Response:**
```json
[
  {
    "id": "...",
    "name": "Physics Group",
    "description": "A group for physics students",
    "fileCounts": { "pdf": 2, "image": 1 },
    "totalFiles": 3,
    "membersCount": 5,
    "syllabus": {
      "id": 1,
      "studyGroupId": "...",
      "topics": [
        {
          "id": 1,
          "syllabusId": 1,
          "title": "Mechanics",
          "description": "Kinematics, Dynamics, etc.",
          "subTopics": [
            { "id": 1, "topicId": 1, "title": "Kinematics", "content": "Motion in 1D, 2D" }
          ]
        }
      ]
    },
    "creatorName": "John Doe"
  }
]
```

### GET /api/v1/group/:groupId
- **Description:** Get all details for a specific group (for logged-in user), including all resources, members, syllabus, and creator info.
- **Auth:** Required
- **CSRF:** Required
- **Response:**
  - 200 OK: Group details object
  - 404 Not Found: Group not found
  - 4xx/5xx: Error message

**Example Response:**
```json
{
  "id": "...",
  "name": "Physics Group",
  "description": "A group for physics students",
  "creatorId": 1,
  "groupCode": "ABC123",
  "isPrivate": false,
  "syllabus": {
    "id": 1,
    "studyGroupId": "...",
    "topics": [
      {
        "id": 1,
        "syllabusId": 1,
        "title": "Mechanics",
        "description": "Kinematics, Dynamics, etc.",
        "subTopics": [
          { "id": 1, "topicId": 1, "title": "Kinematics", "content": "Motion in 1D, 2D" }
        ]
      }
    ]
  },
  "additionalResources": [
    { "id": 1, "studyGroupId": "...", "filePath": "resources/.../1.pdf", "fileType": "pdf" }
  ],
  "Memberships": [
    { "id": 1, "userId": 1, "studyGroupId": "...", "isAnonymous": false }
  ],
  "UserModel": { "username": "johndoe", "fullName": "John Doe" },
  "created_at": "...",
  "updated_at": "..."
}
```


## Get Single Group Overview by Group Code

- **Endpoint:** `GET /api/v1/group/overview/:groupCode`
- **Description:** Returns an overview of a single group by its group code. Useful for sharing or direct access.
- **Request Params:**
  - `groupCode` (string, required): The unique code of the group.
- **Response Example:**

```json
{
  "success": true,
  "data": {
    "groupName": "Physics Study Group",
    "description": "A group for physics enthusiasts",
    "fileCounts": {
      "pdf": 3,
      "image": 2
    },
    "memberCount": 5,
    "syllabus": [
      {
        "syllabusName": "Mechanics",
        "topics": [
          {
            "topicName": "Kinematics",
            "subtopics": ["Projectile Motion", "Circular Motion"]
          }
        ]
      }
    ],
    "creatorName": "John Doe"
  }
}
```
- **Errors:**
  - 400: Group code is required
  - 404: Group not found

### POST /api/v1/group/join/:groupCode
- **Description:** Join a study group using its unique group code. Useful for joining private groups.
- **Auth:** Required
- **CSRF:** Required
- **Request Params:**
  - `groupCode` (string, required): The 6-character alphanumeric group code.
- **Request Body:**
  ```json
  {
    "isAnonymous": false
  }
  ```
- **Response:**
  - 200 OK: Successfully joined group
  - 400: Invalid group code or already a member
  - 404: Group not found
  - 403: Permission denied

---


---

## Data Models

### StudyGroup
- `id` (UUID): Unique group ID
- `name` (string): Group name
- `description` (string): Group description
- `creatorId` (int): User ID of creator
- `groupCode` (string): 6-character code
- `isPrivate` (boolean): Private group flag
- `created_at`, `updated_at` (timestamp)

### Syllabus
- `id` (int): Syllabus ID
- `studyGroupId` (UUID): Linked group
- `created_at`, `updated_at` (timestamp)

### Topic
- `id` (int): Topic ID
- `syllabusId` (int): Linked syllabus
- `title` (string): Topic title
- `description` (string): Topic description
- `created_at`, `updated_at` (timestamp)

### SubTopic
- `id` (int): Subtopic ID
- `topicId` (int): Linked topic
- `title` (string): Subtopic title
- `content` (string): Subtopic content
- `created_at`, `updated_at` (timestamp)

### AdditionalResource
- `id` (int): Resource ID
- `studyGroupId` (UUID): Linked group
- `filePath` (string): Path to file
- `fileType` (string): File type (pdf, doc, image, video, audio, etc.)
- `created_at`, `updated_at` (timestamp)

### Membership
- `id` (int): Membership ID
- `userId` (int): User ID
- `studyGroupId` (UUID): Group ID
- `isAnonymous` (boolean): Anonymous flag
- `created_at`, `updated_at` (timestamp)

---

## Example: Create Group Request

**Request (multipart/form-data):**
- name: "Physics Group"
- description: "A group for physics students"
- isPrivate: false
- syllabus: (as JSON string)
  ```json
  {
    "topics": [
      {
        "title": "Mechanics",
        "description": "Kinematics, Dynamics, etc.",
        "subTopics": [
          { "title": "Kinematics", "content": "Motion in 1D, 2D" }
        ]
      }
    ]
  }
  ```
- additionalResources: (files)

**Response:**
```json
{
  "message": "Study group created successfully!",
  "group": {
    "id": "...",
    "name": "Physics Group",
    "description": "A group for physics students",
    "creatorId": 1,
    "groupCode": "ABC123",
    "isPrivate": false,
    "syllabus": {
      "id": 1,
      "studyGroupId": "...",
      "topics": [
        {
          "id": 1,
          "syllabusId": 1,
          "title": "Mechanics",
          "description": "Kinematics, Dynamics, etc.",
          "subTopics": [
            { "id": 1, "topicId": 1, "title": "Kinematics", "content": "Motion in 1D, 2D" }
          ]
        }
      ]
    },
    "additionalResources": [
      { "id": 1, "studyGroupId": "...", "filePath": "resources/.../1.pdf", "fileType": "pdf" }
    ],
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

### PUT /api/group/:groupCode/syllabus/edit
- **Description:** Edit group syllabus structure (group admin only)
- **Auth:** Required (Group Creator or Admin)
- **CSRF:** Required
- **Body:**
  ```json
  {
    "syllabus": {
      "topics": [
        {
          "title": "Unit 1",
          "description": "...",
          "subTopics": [
            { "title": "Subtopic 1", "content": "..." }
          ]
        }
      ]
    }
  }
  ```
- **Response:**
  - 200 OK: Updated syllabus structure
  - 403 Forbidden: Not authorized
  - 400 Bad Request: Invalid syllabus data

### DELETE /api/group/:groupCode/resources/:resourceId/delete
- **Description:** Delete an approved resource (group admin only)
- **Auth:** Required (Group Creator or Admin)
- **CSRF:** Required
- **Response:**
  - 200 OK: Resource deleted successfully
  - 403 Forbidden: Not authorized  
  - 404 Not Found: Resource not found or not approved

### POST /api/group/:groupCode/resources/:resourceId/report
- **Description:** Report an approved resource (group member only)
- **Auth:** Required (Group Member)
- **CSRF:** Required
- **Body:**
  ```json
  {
    "reason": "offensive_content",
    "description": "Optional description of the issue"
  }
  ```
- **Response:**
  - 200 OK: Resource reported and status changed to pending
  - 400 Bad Request: Invalid reason or self-reporting
  - 403 Forbidden: Not a group member
  - 404 Not Found: Resource not found or not approved
  - 409 Conflict: Already reported by this user

---

## Password Reset API

### POST /api/v1/auth/password-reset
- **Description:** Initiate password reset process by sending OTP to user's email.
- **Auth:** Not required
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  - 200 OK: OTP sent to email
  - 400/404: Email not found or invalid

### POST /api/v1/auth/password-verify
- **Description:** Verify OTP received via email for password reset.
- **Auth:** Not required (uses cookies from previous step)
- **Body:**
  ```json
  {
    "otp": "123456"
  }
  ```
- **Response:**
  - 200 OK: OTP verified, proceed to change password
  - 400/401: Invalid or expired OTP

### POST /api/v1/auth/change-password
- **Description:** Change password after OTP verification.
- **Auth:** Not required (uses cookies from verification step)
- **Body:**
  ```json
  {
    "newPassword": "NewSecurePassword123!"
  }
  ```
- **Response:**
  - 200 OK: Password changed successfully
  - 400: Invalid password format or missing OTP verification

---

## Notes
- All endpoints require authentication and CSRF protection.
- Only group-related endpoints and models are documented here.
- For file uploads, use the `additionalResources` field as an array in multipart form.
- Syllabus must be sent as a JSON string in the request body.
- Group Admin permissions: Group creators and users with 'admin' role can access admin endpoints.
- Password reset process: Send email → Verify OTP → Change password (uses temporary cookies for session management).
