# AcadNet Study Group API Documentation

## Overview
This document provides comprehensive information on how to interact with the AcadNet Study Group API from the frontend application.

---

## API Endpoints

### 1. Get All Public Groups
**Endpoint:** `GET /api/groups/groups`

**Headers Required:**
- `Authorization: Bearer <jwt_token>`
- `X-CSRF-Token: <csrf_token>`

**Response:**
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

**Frontend Implementation:**
```javascript
const getAllGroups = async () => {
  try {
    const response = await fetch('/api/groups/groups', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};
```

---

### 2. Create Study Group with Syllabus
**Endpoint:** `POST /api/groups/create`

**Headers Required:**
- `Authorization: Bearer <jwt_token>`
- `X-CSRF-Token: <csrf_token>`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**

#### Required Fields:
- **name** (string): Group name
- **syllabus** (JSON string): Syllabus structure with topics

#### Optional Fields:
- **description** (string): Group description
- **isPrivate** (string): "true" or "false"
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

**Complete Frontend Implementation:**
```javascript
const createStudyGroup = async (groupData) => {
  try {
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
    
    // Files (optional)
    if (groupData.files && groupData.files.length > 0) {
      groupData.files.forEach(file => {
        formData.append('additionalResources', file);
      });
    }
    
    const response = await fetch('/api/groups/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-CSRF-Token': csrfToken
      },
      body: formData
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create group');
    }
    
    return result.data;
    
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};
```

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
        "topics": [
          {
            "id": 1,
            "syllabusId": 1,
            "title": "Calculus",
            "description": "Differential and Integral Calculus",
            "subTopics": [
              {
                "id": 1,
                "topicId": 1,
                "title": "Derivatives",
                "content": "Rules and applications"
              }
            ]
          }
        ]
      }
    }
  }
}
```

---

## Complete Example Implementation

### React Component Example:
```jsx
import React, { useState } from 'react';

const CreateGroupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    topics: [
      {
        title: '',
        description: '',
        subTopics: [{ title: '', content: '' }]
      }
    ]
  });
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const groupData = {
        name: formData.name,
        description: formData.description,
        isPrivate: formData.isPrivate,
        topics: formData.topics,
        files: files
      };
      
      const result = await createStudyGroup(groupData);
      console.log('Group created:', result);
      // Handle success (redirect, show message, etc.)
      
    } catch (error) {
      console.error('Error:', error);
      // Handle error (show error message)
    }
  };

  const addTopic = () => {
    setFormData({
      ...formData,
      topics: [
        ...formData.topics,
        {
          title: '',
          description: '',
          subTopics: [{ title: '', content: '' }]
        }
      ]
    });
  };

  const addSubTopic = (topicIndex) => {
    const newTopics = [...formData.topics];
    newTopics[topicIndex].subTopics.push({ title: '', content: '' });
    setFormData({ ...formData, topics: newTopics });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Group Name */}
      <div>
        <label>Group Name (Required):</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      {/* Group Description */}
      <div>
        <label>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      {/* Privacy Setting */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.isPrivate}
            onChange={(e) => setFormData({...formData, isPrivate: e.target.checked})}
          />
          Private Group
        </label>
      </div>

      {/* Topics */}
      <div>
        <h3>Topics (At least one required):</h3>
        {formData.topics.map((topic, topicIndex) => (
          <div key={topicIndex}>
            <h4>Topic {topicIndex + 1}</h4>
            <input
              type="text"
              placeholder="Topic Title (Required)"
              value={topic.title}
              onChange={(e) => {
                const newTopics = [...formData.topics];
                newTopics[topicIndex].title = e.target.value;
                setFormData({...formData, topics: newTopics});
              }}
              required
            />
            <textarea
              placeholder="Topic Description (Optional)"
              value={topic.description}
              onChange={(e) => {
                const newTopics = [...formData.topics];
                newTopics[topicIndex].description = e.target.value;
                setFormData({...formData, topics: newTopics});
              }}
            />

            {/* Subtopics */}
            <h5>Subtopics (At least one required per topic):</h5>
            {topic.subTopics.map((subTopic, subTopicIndex) => (
              <div key={subTopicIndex}>
                <input
                  type="text"
                  placeholder="Subtopic Title (Required)"
                  value={subTopic.title}
                  onChange={(e) => {
                    const newTopics = [...formData.topics];
                    newTopics[topicIndex].subTopics[subTopicIndex].title = e.target.value;
                    setFormData({...formData, topics: newTopics});
                  }}
                  required
                />
                <textarea
                  placeholder="Subtopic Content (Optional)"
                  value={subTopic.content}
                  onChange={(e) => {
                    const newTopics = [...formData.topics];
                    newTopics[topicIndex].subTopics[subTopicIndex].content = e.target.value;
                    setFormData({...formData, topics: newTopics});
                  }}
                />
              </div>
            ))}
            <button type="button" onClick={() => addSubTopic(topicIndex)}>
              Add Subtopic
            </button>
          </div>
        ))}
        <button type="button" onClick={addTopic}>Add Topic</button>
      </div>

      {/* File Upload */}
      <div>
        <label>Additional Resources (Up to 10 files):</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
        />
      </div>

      <button type="submit">Create Study Group</button>
    </form>
  );
};

export default CreateGroupForm;
```

---

## Error Handling

### Common Error Responses:
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
  "statusCode": 404,
  "message": "Creator user not found."
}
```

### Error Handling in Frontend:
```javascript
const handleApiError = (error, response) => {
  if (response && !response.ok) {
    switch (response.status) {
      case 400:
        alert('Invalid data provided. Please check your input.');
        break;
      case 401:
        alert('Authentication required. Please login again.');
        // Redirect to login
        break;
      case 404:
        alert('Resource not found.');
        break;
      case 500:
        alert('Server error. Please try again later.');
        break;
      default:
        alert('An unexpected error occurred.');
    }
  } else {
    alert('Network error. Please check your connection.');
  }
};
```

---

## Data Validation Rules

### Group Data:
- **name**: Required, must be a non-empty string
- **description**: Optional string
- **isPrivate**: Optional boolean (defaults to false)

### Syllabus Data:
- **topics**: Required array with at least one topic
- Each **topic** must have:
  - **title**: Required string
  - **description**: Optional string
  - **subTopics**: Required array with at least one subtopic
- Each **subTopic** must have:
  - **title**: Required string
  - **content**: Optional string

### File Upload:
- Maximum 10 files per group
- Files are stored in `resources/{groupId}_resources/` directory
- Files are renamed to sequential numbers (1.pdf, 2.docx, etc.)

---

## Authentication & Security

### Required Headers:
1. **Authorization**: JWT Bearer token
2. **X-CSRF-Token**: CSRF protection token

### Middleware Chain:
1. `authMiddleware`: Validates JWT token
2. `csrfMiddleware`: Validates CSRF token
3. `addUser`: Adds user info to request object
4. `upload.array`: Handles file uploads (multer)

---

## File Structure Created

When a group is created with files, the following structure is generated:
```
resources/
├── {groupId}_resources/
│   ├── 1.pdf
│   ├── 2.docx
│   └── 3.txt
└── temp/ (temporary upload directory)
```

---

## Tips for Frontend Implementation

1. **Always include CSRF token** in requests
2. **Handle file uploads properly** using FormData
3. **Validate data on frontend** before sending to reduce server errors
4. **Implement proper error handling** for better user experience
5. **Show loading states** during API calls
6. **Store JWT token securely** (consider using httpOnly cookies)
7. **Implement token refresh logic** for expired tokens

---

## Testing the API

### Using Postman or similar tools:
1. Set Authorization header with Bearer token
2. Set X-CSRF-Token header
3. Use form-data for POST requests with files
4. Test with various data combinations to ensure validation works

### Example Test Cases:
1. Create group with minimum required data
2. Create group with all optional fields
3. Create group with files
4. Try creating group without required fields (should fail)
5. Try creating group with invalid syllabus structure (should fail)

---

*Generated on: July 2, 2025*
*API Version: 1.0*
*Backend Framework: Node.js + Express + Sequelize*
