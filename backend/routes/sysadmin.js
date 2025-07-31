import express from "express";
import sysadminMiddleware from "../middlewares/sysadminmid.js";
import csrfMiddleware from "../middlewares/csrf.js";
import { sysadminDashboard, getStats, listAllUsers, deleteUserById, listAllGroups } from "../controllers/sysadmincontroller.js";

const router = express.Router();

router.get("/", sysadminMiddleware, sysadminDashboard);


router.get("/users", sysadminMiddleware, listAllUsers);

router.delete("/user/:userId", sysadminMiddleware, deleteUserById);
router.get("/groups", sysadminMiddleware, listAllGroups);

export default router;
