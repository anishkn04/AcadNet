import express, { Router } from "express";
import { userInfo, userProfile, getUserById } from "../controllers/essentialController.js";
import authMiddleware from "../middlewares/authmiddleware.js";
import csrfMiddleware from "../middlewares/csrf.js";

const router = express.Router();

router.get("/user", authMiddleware, csrfMiddleware, userInfo);

router.get("/user/:userId", authMiddleware, csrfMiddleware, getUserById)

router.post("/editprofile", authMiddleware, csrfMiddleware, userProfile)



export default router;