# Join Group by Code Feature Documentation

## Overview
The "Join by Code" feature allows users to join study groups directly using a unique 6-character group code. This is particularly useful for:
- Joining private groups that aren't publicly listed
- Quick access to groups when you have the code
- Sharing groups with friends via code

## Backend Implementation

### API Endpoint
- **URL**: `POST /api/v1/group/join/:groupCode`
- **Auth**: Required (Bearer token)
- **CSRF**: Required

### Request Parameters
- `groupCode` (path parameter): 6-character alphanumeric code (e.g., "ABC123")
- `isAnonymous` (body): Boolean to join as anonymous member

### Response
```json
{
  "success": true,
  "message": "Joined group successfully.",
  "data": {
    "membership": {
      "userId": 123,
      "studyGroupId": "uuid",
      "isAnonymous": false,
      "role": "member"
    }
  }
}
```

### Error Handling
- **400**: Invalid group code format or user already a member
- **404**: Group not found
- **403**: Permission denied

## Frontend Implementation

### Components Created
1. **JoinByCodeDialog**: Modal component for entering group code
   - Input validation (6 characters, alphanumeric)
   - Anonymous join option
   - Real-time formatting (uppercase)
   - Error handling with toast notifications

### Integration Points
1. **Groups Page** (`/join`): 
   - "Join by Code" button in header section
   - Opens modal dialog

2. **Settings Page** (`/user/settings`):
   - "Join by Code" option in account settings
   - Grouped with other group-related features

### User Experience
1. Click "Join by Code" button
2. Enter 6-character group code (automatically formatted)
3. Optionally select "Join as anonymous"
4. Submit to join group
5. Automatic redirect to group page on success

## Group Code Format
- **Length**: Exactly 6 characters
- **Characters**: Letters (A-Z) and numbers (0-9)
- **Case**: Stored and displayed in uppercase
- **Uniqueness**: Each group has a unique code
- **Generation**: Automatic during group creation

## Use Cases

### Private Groups
- Group creators can share codes with intended members
- Private groups won't appear in public listings
- Code is the only way to join private groups

### Quick Access
- Users can join any group instantly with the code
- No need to search through group listings
- Direct navigation to group after joining

### Sharing
- Group codes can be shared via:
  - Social media
  - Messaging apps
  - Email
  - Physical sharing (written down)

## Security Considerations
- Codes are randomly generated to prevent guessing
- 6 characters provide 36^6 = ~2 billion combinations
- Authentication required to prevent unauthorized access
- CSRF protection prevents cross-site attacks

## Future Enhancements
- QR code generation for easy sharing
- Expiring invitation codes
- Code regeneration for group admins
- Analytics on code usage

## Documentation Location
- Main API docs: `NEW_API_DOC.md`
- Quick reference: `PASSWORD_RESET_API_GUIDE.md`
- Implementation details: This file

*Feature Status: ✅ Fully Implemented and Ready*
