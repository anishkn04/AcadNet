import { getAllGroups , createStudyGroupWithSyllabus, getGroupOverviewList, getGroupDetailsById, getGroupOverviewByCode } from "../services/groupservices.js";
import jsonRes from "../utils/response.js"
import fs from 'fs'

export const getGroups = async (req,res)=>{
    try{
  
        const allGroups = await getAllGroups(req)
        console.log("All groups: ", allGroups)
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
    const group = await getGroupDetailsById(groupCode);
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