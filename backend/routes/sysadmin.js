import express from "express";
import sysadminMiddleware from "../middlewares/sysadminmid.js";
import csrfMiddleware from "../middlewares/csrf.js";
import { sysadminDashboard, getStats, listAllUsers, deleteUserById, listAllGroups, deleteGroupById, searchUserByUsername, searchGroupByName } from "../controllers/sysadmincontroller.js";

const router = express.Router();


router.get("/", sysadminMiddleware, csrfMiddleware, sysadminDashboard);

router.get("/stats", sysadminMiddleware, csrfMiddleware, getStats);

router.get("/users", sysadminMiddleware, csrfMiddleware, listAllUsers);

router.delete("/user/:userId", sysadminMiddleware, csrfMiddleware, deleteUserById);
router.get("/groups", sysadminMiddleware, csrfMiddleware, listAllGroups);
router.delete("/group/:groupId", sysadminMiddleware, csrfMiddleware, deleteGroupById);
router.get("/search/user", sysadminMiddleware, csrfMiddleware, searchUserByUsername);
router.get("/search/group", sysadminMiddleware, csrfMiddleware, searchGroupByName);


export default router;
