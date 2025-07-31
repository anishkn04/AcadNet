# Resource Reporting API Documentation

## Overview
This feature allows group members to report inappropriate or offensive resources. When a resource is reported, its status changes from 'approved' to 'pending', requiring admin review before it becomes available again.

## Backend Implementation

### New Endpoint

#### Report Resource
- **Endpoint:** `POST /api/group/:groupCode/resources/:resourceId/report`
- **Description:** Allows group members to report an approved resource
- **Authentication:** Required (group membership)
- **CSRF:** Required

**Parameters:**
- `groupCode` (path): The unique code of the group
- `resourceId` (path): The ID of the resource to report

**Request Body:**
```json
{
  "reason": "offensive_content",
  "description": "This resource contains inappropriate material"
}
```

**Valid Reasons:**
- `inappropriate_behavior`
- `harassment`
- `spam`
- `offensive_content`
- `violation_of_rules`
- `fake_profile`
- `academic_dishonesty`
- `other`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resource reported successfully. The resource has been marked as pending review.",
  "resourceId": 123,
  "fileName": "document.pdf",
  "reportId": 456,
  "status": "pending"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid reason, user trying to report own resource
- `403 Forbidden`: Not a group member
- `404 Not Found`: Group not found or resource not found/not approved
- `409 Conflict`: Resource already reported by this user

## How It Works

### Reporting Process
1. **Validation**: System validates that:
   - User is a group member
   - Resource exists and is approved
   - User is not reporting their own resource
   - User hasn't already reported this resource

2. **User Report Creation**: Creates a record in the `user_reports` table linking:
   - Reporter (user making the report)
   - Reported user (resource uploader)
   - Group where report was made
   - Reason and description

3. **Status Change**: Resource status changes from `approved` to `pending`

4. **Admin Review**: Group admins can now see the resource in their pending resources list

### Database Changes
- **AdditionalResource**: Status changes from 'approved' to 'pending'
- **UserReport**: New report record created with special format for resource reports

### Security Features
- **Membership Required**: Only group members can report resources
- **Anti-Spam**: Users cannot report the same resource multiple times
- **Self-Protection**: Users cannot report their own resources
- **Authentication**: JWT token validation required
- **CSRF Protection**: Prevents unauthorized requests

## Frontend Integration

### API Service Function
```typescript
import { reportResourceAPI } from '../services/UserServices';

// Report a resource
const handleReportResource = async (groupCode: string, resourceId: number) => {
  try {
    const reportData = {
      reason: 'offensive_content',
      description: 'This resource contains inappropriate content'
    };
    
    const result = await reportResourceAPI(groupCode, resourceId, reportData);
    console.log('Resource reported:', result.data);
    
    // Update UI to reflect the resource is now pending
    // Remove from approved resources list or mark as pending
    
  } catch (error: any) {
    console.error('Failed to report resource:', error.response?.data?.message);
  }
};
```

### Usage Example in Component
```tsx
// Add report button for each resource
<button
  onClick={() => handleReportResource(groupCode, resource.id)}
  className="p-1.5 text-orange-500 hover:text-orange-700 rounded-md hover:bg-orange-50"
  title="Report Resource"
>
  <span className="material-icons-outlined text-lg">flag</span>
</button>
```

## Admin Workflow

### After Resource is Reported
1. **Visibility**: Resource disappears from public view (status = pending)
2. **Admin Notification**: Resource appears in admin's pending resources list
3. **Review Options**: Admin can:
   - **Approve**: Change status back to 'approved' (resource becomes visible again)
   - **Reject**: Permanently delete the resource
   - **View Report**: See who reported it and why

### Admin Actions
```typescript
// In admin panel, admins can see both:
// 1. Pending resources (including reported ones)
// 2. User reports (to see reporting details)

// Approve reported resource (restore to approved status)
await approveResourceAPI(groupCode, resourceId);

// Reject reported resource (delete permanently)
await rejectResourceAPI(groupCode, resourceId, "Inappropriate content confirmed");
```

## Use Cases

### Common Scenarios
1. **Inappropriate Content**: User uploads offensive material
2. **Copyright Violation**: User uploads copyrighted content
3. **Spam/Low Quality**: User uploads irrelevant or low-quality resources
4. **Malicious Files**: User uploads potentially harmful files
5. **Violation of Group Rules**: Content violates specific group guidelines

### Workflow Example
1. Student A uploads a study guide
2. Student B finds the content inappropriate
3. Student B reports the resource with reason "offensive_content"
4. Resource status changes to 'pending' (disappears from group)
5. Group admin receives notification about pending resource
6. Admin reviews the resource and report details
7. Admin decides to either approve (restore) or reject (delete) the resource

## Benefits

### For Group Members
- **Self-Moderation**: Community can self-regulate content quality
- **Quick Action**: Inappropriate content is immediately hidden
- **Anonymous Reporting**: Reports are handled by admins, not public

### For Group Admins
- **Quality Control**: Maintains high standard of resources
- **Conflict Resolution**: Provides structured way to handle disputes
- **Audit Trail**: Complete record of what was reported and why

### For Platform
- **Reduced Liability**: Inappropriate content is quickly removed
- **User Trust**: Users feel safe knowing they can report problems
- **Scalable Moderation**: Community helps moderate content

## Implementation Notes

### Technical Considerations
- **Atomicity**: Resource reporting uses database transactions
- **Consistency**: Status changes are immediately reflected
- **Error Handling**: Comprehensive validation and error messages
- **Performance**: Minimal impact on existing resource queries

### Future Enhancements
- **Report Categories**: Specific categories for different violation types
- **Auto-Moderation**: Automatic action based on report volume
- **Appeal Process**: Allow resource owners to appeal rejections
- **Report Analytics**: Statistics on reporting patterns

This feature provides a robust foundation for community-driven content moderation while maintaining proper oversight through admin review.
