import express from 'express'
import { getGroups , createGroup} from '../controllers/groupcontroller.js'
import authMiddleware from "../middlewares/authmiddleware.js";
import csrfMiddleware from "../middlewares/csrf.js";
import upload from '../middlewares/multer.js';

const router = express.Router()

router.get("/groups",authMiddleware,csrfMiddleware,getGroups)

router.post(
 "/create",
 authMiddleware,
 upload.array("additionalResources", 10), // a new middleware to accept up to 10 files
 createGroup
);

export default router