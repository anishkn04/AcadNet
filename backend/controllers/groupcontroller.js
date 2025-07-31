import { getAllGroups, createStudyGroupWithSyllabus, getGroupOverviewList, getGroupDetailsByCode, getGroupDetailsById, getGroupOverviewByCode, likeResource, dislikeResource, getResourceLikeStatus, getGroupAdditionalResources, addAdditionalResources, checkUserProfileCompleteness, reportUserInGroup as reportUserInGroupService, getGroupReports, getPendingResources, approveResource, rejectResource } from "../services/groupservices.js";
import * as groupServices from "../services/groupservices.js";
import jsonRes from "../utils/response.js"
import fs from 'fs'

export const getGroups = async (req,res)=>{
    try{
  
        const allGroups = await getAllGroups(req)
        // console.log("All groups: ", allGroups)
        jsonRes(res,200,true,allGroups)
    }
    catch(err){
        jsonRes(res, err.code, false, err.message);
    }
}


export const createGroup = async (req, res) => {
    console.log("Creating group with details: ", req.body)
 const creatorId = req.id;
 let { name, description, isPrivate, syllabus, additionalResources } = req.body;
 const files = req.files; 

 // Check if user profile is complete before allowing group creation
 try {
   const profileCheck = await checkUserProfileCompleteness(creatorId);
   if (!profileCheck.isComplete) {
     return jsonRes(res, 400, false, {
       message: "Please complete your profile before creating a study group.",
       missingFields: profileCheck.missingFields,
       requiredFields: ["fullName", "phone", "age", "nationality", "education", "address"]
     });
   }
 } catch (profileError) {
   return jsonRes(res, profileError.code || 500, false, profileError.message || "Error checking user profile.");
 }

 if (typeof syllabus === 'string') {
  try {
   syllabus = JSON.parse(syllabus);
  } catch (parseError) {
   return jsonRes(res, 400, false, "Invalid syllabus JSON format.");
  }
 }


 if (!name) {
  return jsonRes(res, 400, false, "Group name is required.");
 }
 if (!syllabus) {
  return jsonRes(res, 400, false, "Syllabus data is required to create a group.");
 }
 

 let topicsData;
 if (syllabus.syllabus && syllabus.syllabus.topics) {
  topicsData = syllabus.syllabus.topics;
 } else if (syllabus.topics) {
  topicsData = syllabus.topics;
 } else {
  return jsonRes(res, 400, false, "Syllabus must have a 'topics' property.");
 }
 
 if (!Array.isArray(topicsData)) {
  return jsonRes(res, 400, false, "Syllabus topics must be an array.");
 }
 
 if (topicsData.length === 0) {
  return jsonRes(res, 400, false, "Syllabus must contain at least one topic.");
 }

 try {
  const newGroup = await createStudyGroupWithSyllabus(
   creatorId,
   { name, description, isPrivate },
   topicsData,
   files 
  );
  jsonRes(res, 201, true, {
   message: "Study group created successfully!",
   group: newGroup,
  });
 } catch (err) {

  if (files) {
   files.forEach((file) => {
    fs.unlink(file.path, (unlinkErr) => {
     if (unlinkErr) {
      console.error("Error deleting temp file:", unlinkErr);
     }
    });
   });
  }
  console.error("Error in createGroup controller:", err);
  jsonRes(
   res,
   err.code || 500,
   false,
   err.message || "Failed to create study group."
  );
 }
};

export const groupOverview = async (req, res) => {
  try {
    const overview = await getGroupOverviewList();
    jsonRes(res, 200, true, overview);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to fetch group overview.");
  }
};

export const groupDetails = async (req, res) => {
  try {
    const groupCode = req.params.groupCode;
    if (!groupCode) {
      return jsonRes(res, 400, false, "Group code is required.");
    }
    const group = await getGroupDetailsByCode(groupCode);
    console.log(group)
    if (!group) return jsonRes(res, 404, false, "Group not found");
    jsonRes(res, 200, true, group);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to fetch group details.");
  }
};

export const groupDetailsById = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    if (!groupId) {
      return jsonRes(res, 400, false, "Group ID is required.");
    }
    const group = await getGroupDetailsById(groupId);
    if (!group) return jsonRes(res, 404, false, "Group not found");
    jsonRes(res, 200, true, group);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to fetch group details.");
  }
};

export const groupOverviewByCode = async (req, res) => {
  try {
    const groupCode = req.params.groupCode;
    if (!groupCode) {
      return jsonRes(res, 400, false, "Group code is required.");
    }
    const overview = await getGroupOverviewByCode(groupCode);
    if (!overview) {
      return jsonRes(res, 404, false, "Group not found");
    }
    jsonRes(res, 200, true, overview);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to fetch group overview by code.");
  }
};


export const likeAdditionalResource = async (req, res) => {
  try {
    const userId = req.id; 
    const { resourceId } = req.params;

    if (!resourceId) {
      return jsonRes(res, 400, false, "Resource ID is required.");
    }

    const result = await likeResource(userId, parseInt(resourceId));
    return jsonRes(res, 200, true, result);
  } catch (err) {
    console.log(err);
    return jsonRes(res, err.code || 500, false, err.message || "Failed to like resource.");
  }
};

export const dislikeAdditionalResource = async (req, res) => {
  try {
    const userId = req.id; // from auth middleware
    const { resourceId } = req.params;

    if (!resourceId) {
      return jsonRes(res, 400, false, "Resource ID is required.");
    }

    const result = await dislikeResource(userId, parseInt(resourceId));
    return jsonRes(res, 200, true, result);
  } catch (err) {
    console.log(err);
    return jsonRes(res, err.code || 500, false, err.message || "Failed to dislike resource.");
  }
};

export const getResourceStatus = async (req, res) => {
  try {
    const userId = req.id; // from auth middleware
    const { resourceId } = req.params;

    if (!resourceId) {
      return jsonRes(res, 400, false, "Resource ID is required.");
    }

    const result = await getResourceLikeStatus(userId, parseInt(resourceId));
    return jsonRes(res, 200, true, result);
  } catch (err) {
    console.log(err);
    return jsonRes(res, err.code || 500, false, err.message || "Failed to get resource status.");
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const userId = req.id;
    const { groupCode } = req.params;
    const result = await groupServices.leaveGroup(userId, groupCode);
    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message);
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const adminId = req.id;
    const { groupCode, userId } = req.params;
    const result = await groupServices.removeMember(adminId, groupCode, userId);
    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message);
  }
};

export const promoteGroupMember = async (req, res) => {
  try {
    const adminId = req.id;
    const { groupCode, userId } = req.params;
    const result = await groupServices.promoteMember(adminId, groupCode, userId);
    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message);
  }
};

export const demoteGroupMember = async (req, res) => {
  try {
    const adminId = req.id;
    const { groupCode, userId } = req.params;
    const result = await groupServices.demoteMember(adminId, groupCode, userId);
    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message);
  }
};

// Get all additional resources for a group
export const getGroupResources = async (req, res) => {
  try {
    const { groupCode } = req.params;
    const resources = await groupServices.getGroupAdditionalResources(groupCode);
    jsonRes(res, 200, true, resources);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to fetch group resources.");
  }
};

// Add additional resources to a group
export const addGroupResources = async (req, res) => {
  try {
    const userId = req.id;
    const { groupCode } = req.params;
    const { topicId, subTopicId } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return jsonRes(res, 400, false, "No files provided.");
    }

    const result = await groupServices.addAdditionalResources(
      groupCode, 
      userId, 
      files, 
      topicId ? parseInt(topicId) : null, 
      subTopicId ? parseInt(subTopicId) : null
    );
    
    jsonRes(res, 201, true, result);
  } catch (err) {
    // Clean up uploaded files if there's an error
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting temp file:", unlinkErr);
          }
        });
      });
    }
    
    jsonRes(res, err.code || 500, false, err.message || "Failed to add additional resources.");
  }
};

// Report a user within a group
export const reportUserInGroup = async (req, res) => {
  try {
    const reporterId = req.id;
    const { groupCode, reportedUserId } = req.params;
    const { reason, description } = req.body;

    // Validate required fields
    if (!reason) {
      return jsonRes(res, 400, false, "Reason is required.");
    }

    if (!reportedUserId || !groupCode) {
      return jsonRes(res, 400, false, "Reported user ID and group code are required.");
    }

    const validReasons = [
      'inappropriate_behavior',
      'harassment', 
      'spam',
      'offensive_content',
      'violation_of_rules',
      'fake_profile',
      'academic_dishonesty',
      'other'
    ];

    if (!validReasons.includes(reason)) {
      return jsonRes(res, 400, false, "Invalid reason provided.");
    }

    const report = await reportUserInGroupService(
      reporterId,
      parseInt(reportedUserId),
      groupCode,
      { reason, description }
    );

    jsonRes(res, 201, true, {
      message: "User reported successfully.",
      report
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to report user.");
  }
};

// Get reports for a group (admin only)
export const getGroupReportsController = async (req, res) => {
  try {
    const userId = req.id;
    const { groupCode } = req.params;
    const { status } = req.query;

    const reports = await getGroupReports(userId, groupCode, status);

    jsonRes(res, 200, true, {
      message: "Reports retrieved successfully.",
      reports
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to retrieve reports.");
  }
};

// Get pending resources for admin approval
export const getPendingResourcesController = async (req, res) => {
  try {
    const adminUserId = req.id;
    const { groupCode } = req.params;

    const result = await getPendingResources(adminUserId, groupCode);

    jsonRes(res, 200, true, {
      message: "Pending resources retrieved successfully.",
      ...result
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to retrieve pending resources.");
  }
};

// Approve a resource
export const approveResourceController = async (req, res) => {
  try {
    const adminUserId = req.id;
    const { groupCode, resourceId } = req.params;

    const result = await approveResource(adminUserId, parseInt(resourceId), groupCode);

    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to approve resource.");
  }
};

// Reject a resource
export const rejectResourceController = async (req, res) => {
  try {
    const adminUserId = req.id;
    const { groupCode, resourceId } = req.params;
    const { reason } = req.body;

    const result = await rejectResource(adminUserId, parseInt(resourceId), groupCode, reason);

    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to reject resource.");
  }
};