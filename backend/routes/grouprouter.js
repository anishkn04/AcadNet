import express from 'express'
import { getGroups , createGroup, groupOverview, groupDetails, groupOverviewByCode } from '../controllers/groupcontroller.js'
import authMiddleware from "../middlewares/authmiddleware.js";
import csrfMiddleware from "../middlewares/csrf.js";
import upload from '../middlewares/multer.js';
import addUser from '../middlewares/addUsertoReq.js';

const router = express.Router()

router.get("/groups",authMiddleware,csrfMiddleware,getGroups)

router.post(
 "/create",
 authMiddleware, csrfMiddleware, addUser,
 upload.array("additionalResources", 10), // a new middleware to accept up to 10 files
 createGroup
);

router.get("/overview",  groupOverview);
router.get("/details/:groupCode", groupDetails);
router.get("/overview/:groupCode", groupOverviewByCode);

export default router