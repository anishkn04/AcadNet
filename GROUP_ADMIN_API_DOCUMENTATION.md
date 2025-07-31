# Group Admin API Documentation

This document describes the new API endpoints for group admin features: syllabus editing and resource deletion.

## Authentication & Authorization

All endpoints require:
- Valid authentication token
- CSRF protection
- User must be either the group creator OR have admin role in the group

## Endpoints

### 1. Edit Group Syllabus

**Endpoint:** `PUT /api/group/:groupCode/syllabus/edit`

**Description:** Allows group admins to edit the syllabus structure of their group.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
X-CSRF-Token: <csrf_token>
```

**Parameters:**
- `groupCode` (path): The unique code of the group

**Request Body:**
```json
{
  "syllabus": {
    "topics": [
      {
        "title": "Unit 1: Introduction",
        "description": "Basic concepts and overview",
        "subTopics": [
          {
            "title": "Chapter 1.1",
            "content": "Introduction to the subject"
          },
          {
            "title": "Chapter 1.2", 
            "content": "Key terminology"
          }
        ]
      },
      {
        "title": "Unit 2: Advanced Topics",
        "description": "In-depth analysis",
        "subTopics": [
          {
            "title": "Chapter 2.1",
            "content": "Advanced concepts"
          }
        ]
      }
    ]
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Syllabus updated successfully.",
  "groupCode": "ABC123",
  "groupName": "Math Study Group",
  "syllabus": {
    "id": 1,
    "topics": [
      {
        "id": 1,
        "title": "Unit 1: Introduction",
        "description": "Basic concepts and overview",
        "subTopics": [
          {
            "id": 1,
            "title": "Chapter 1.1",
            "content": "Introduction to the subject"
          }
        ]
      }
    ]
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid syllabus data or missing topics
- `403 Forbidden`: User doesn't have admin permissions
- `404 Not Found`: Group or syllabus not found

### 2. Delete Approved Resource

**Endpoint:** `DELETE /api/group/:groupCode/resources/:resourceId/delete`

**Description:** Allows group admins to delete approved resources from their group.

**Headers:**
```
Authorization: Bearer <token>
X-CSRF-Token: <csrf_token>
```

**Parameters:**
- `groupCode` (path): The unique code of the group
- `resourceId` (path): The ID of the resource to delete

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resource deleted successfully.",
  "resourceId": 123,
  "fileName": "study-notes.pdf"
}
```

**Error Responses:**
- `403 Forbidden`: User doesn't have admin permissions
- `404 Not Found`: Group not found or resource not found/not approved
- `500 Internal Server Error`: File deletion failed

## Frontend Service Functions

### Edit Group Syllabus
```typescript
import { editGroupSyllabusAPI } from '../services/UserServices';

const handleEditSyllabus = async (groupCode: string, syllabusData: any) => {
  try {
    const result = await editGroupSyllabusAPI(groupCode, syllabusData);
    console.log('Syllabus updated:', result.data);
  } catch (error: any) {
    console.error('Failed to update syllabus:', error.response?.data?.message);
  }
};
```

### Delete Approved Resource
```typescript
import { deleteApprovedResourceAPI } from '../services/UserServices';

const handleDeleteResource = async (groupCode: string, resourceId: number) => {
  try {
    const result = await deleteApprovedResourceAPI(groupCode, resourceId);
    console.log('Resource deleted:', result.data);
  } catch (error: any) {
    console.error('Failed to delete resource:', error.response?.data?.message);
  }
};
```

## Permission System

### Group Creator
- Has full admin permissions
- Can edit syllabus
- Can delete any approved resources
- Can promote/demote members

### Group Admin  
- Assigned admin role by group creator
- Can edit syllabus
- Can delete any approved resources
- Can approve/reject pending resources
- Cannot promote/demote other members (creator only)

### Regular Members
- Cannot access admin endpoints
- Can only view syllabus and resources
- Can upload resources (pending approval)

## Validation Rules

### Syllabus Editing
1. Must contain at least one topic
2. Each topic must have a title
3. SubTopics are optional but if provided, must have title
4. Description and content fields are optional

### Resource Deletion
1. Resource must exist and be approved
2. Physical file is deleted from server
3. Database record is removed
4. Action is irreversible

## Notes

- Both operations use database transactions for data consistency
- File system operations are performed for resource deletion
- All changes are logged and can be tracked
- CSRF protection prevents unauthorized requests
- Rate limiting may apply based on server configuration
