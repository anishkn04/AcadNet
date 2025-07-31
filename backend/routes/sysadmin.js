import express from "express";
import sysadminMiddleware from "../middlewares/sysadminmid.js";
import csrfMiddleware from "../middlewares/csrf.js";
import { sysadminDashboard, getStats, listAllUsers, deleteUserById, listAllGroups, deleteGroupById, searchUserByUsername, searchGroupByName } from "../controllers/sysadmincontroller.js";

const router = express.Router();

router.get("/", sysadminMiddleware, sysadminDashboard);


router.get("/users", sysadminMiddleware, listAllUsers);

router.delete("/user/:userId", sysadminMiddleware, deleteUserById);
router.get("/groups", sysadminMiddleware, listAllGroups);
router.delete("/group/:groupId", sysadminMiddleware, deleteGroupById);
router.get("/search/user", sysadminMiddleware, searchUserByUsername);
router.get("/search/group", sysadminMiddleware, searchGroupByName);

export default router;
