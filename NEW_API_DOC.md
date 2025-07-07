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

## Notes
- All endpoints require authentication and CSRF protection.
- Only group-related endpoints and models are documented here.
- For file uploads, use the `additionalResources` field as an array in multipart form.
- Syllabus must be sent as a JSON string in the request body.
