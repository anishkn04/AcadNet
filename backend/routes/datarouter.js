import express, { Router } from "express";
import { userInfo, userProfile, getUserById } from "../controllers/essentialController.js";
import authMiddleware from "../middlewares/authmiddleware.js";
import csrfMiddleware from "../middlewares/csrf.js";

/**
 * @swagger
 * tags:
 *   name: Data
 *   description: Data retrieval and modification
 */

const router = express.Router();

/**
 * @swagger
 * /api/v1/data/user:
 *   get:
 *     tags: [Data]
 *     summary: Get user information
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       '200':
 *         description: User information retrieved successfully
 *       '401':
 *         description: Unauthorized
 */
router.get("/user", authMiddleware, csrfMiddleware, userInfo);

/**
 * @swagger
 * /api/v1/data/user/{userId}:
 *   get:
 *     tags: [Data]
 *     summary: Get user by ID
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User found
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 */
router.get("/user/:userId", authMiddleware, csrfMiddleware, getUserById)

/**
 * @swagger
 * /api/v1/data/editprofile:
 *   post:
 *     tags: [Data]
 *     summary: Edit user profile
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 */
router.post("/editprofile", authMiddleware, csrfMiddleware, userProfile)



export default router;