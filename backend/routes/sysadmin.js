import express from "express";
import sysadminMiddleware from "../middlewares/sysadminmid.js";
import csrfMiddleware from "../middlewares/csrf.js";
import { sysadminDashboard } from "../controllers/sysadmincontroller.js";

const router = express.Router();

router.get("/", sysadminMiddleware, csrfMiddleware,sysadminDashboard);

export default router;
