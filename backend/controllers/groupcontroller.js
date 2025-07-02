import { getAllGroups , createStudyGroupWithSyllabus} from "../services/groupservices.js";
import jsonRes from "../utils/response.js"

export const getGroups = async (req,res)=>{
    try{
        console.log("Reached Here")
        const allGroups = await getAllGroups(res)
        console.log(allGroups)
        jsonRes(res,200,true,allGroups)
    }
    catch(err){
        jsonRes(res, err.code, false, err.message);
    }
}


export const createGroup = async (req, res) => {
 const creatorId = req.id;
 const { name, description, isPrivate, syllabus } = req.body;
 const files = req.files; // Files from multer

 if (!name) {
  return jsonRes(res, 400, false, "Group name is required.");
 }
 if (!syllabus) {
  return jsonRes(res, 400, false, "Syllabus data is required to create a group.");
 }

 try {
  const newGroup = await createStudyGroupWithSyllabus(
   creatorId,
   { name, description, isPrivate },
   syllabus.topics,
   files // Pass the files to the service
  );
  jsonRes(res, 201, true, {
   message: "Study group created successfully!",
   group: newGroup,
  });
 } catch (err) {
  // If there's an error, clean up any uploaded files
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