import express from "express";
import passport from "passport";
import {
  logoutAllCont,
  logoutCont,
  oAuthCallback,
  refreshAccessToken,
  checkedRes,
  signup,
  sessionChecker,
  login,
  otpAuthGenerator,
  otpAuthChecker,
  resetPasswordSender,
  resetVerifier,
  changePassword,
    oAuthFail
} from "../controllers/authcontroller.js";
import csrfMiddleware from "../middlewares/csrf.js";
import authMiddleware from "../middlewares/authmiddleware.js";
import addUser from "../middlewares/addUsertoReq.js";
import validateSignup from "../validator/validate.js";
import handleValidationError from "../validator/errorvalidation.js";
import { userInfo } from "os";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and authorization
 */

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Bad request
 */
router.post("/signup", validateSignup, handleValidationError, signup);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Unauthorized
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/auth/github:
 *   get:
 *     tags: [Auth]
 *     summary: Authenticate with Github
 *     responses:
 *       '302':
 *         description: Redirect to Github for authentication
 */
router.get("/github",passport.authenticate("github", { scope: ["user:email"] })
);

/**
 * @swagger
 * /api/v1/auth/github/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Github authentication callback
 *     responses:
 *       '200':
 *         description: User authenticated successfully
 *       '401':
 *         description: Authentication failed
 */
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/v1/auth/failure",
    session: false
  }),
  oAuthCallback
);

/**
 * @swagger
 * /api/v1/auth/failure:
 *   get:
 *     tags: [Auth]
 *     summary: Authentication failure page
 *     responses:
 *       '200':
 *         description: Returns failure page
 */
router.get("/failure",oAuthFail)

/**
 * @swagger
 * /api/v1/auth/checkSession:
 *   post:
 *     tags: [Auth]
 *     summary: Check if user session is valid
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       '200':
 *         description: Session is valid
 *       '401':
 *         description: Unauthorized
 */
router.post("/checkSession", authMiddleware, csrfMiddleware, addUser, sessionChecker);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       '200':
 *         description: Token refreshed successfully
 *       '401':
 *         description: Unauthorized
 */
router.post(
  "/refresh-token",
  authMiddleware,
  csrfMiddleware,
  refreshAccessToken
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout a user
 *     responses:
 *       '200':
 *         description: User logged out successfully
 */
router.post("/logout", logoutCont);

/**
 * @swagger
 * /api/v1/auth/logout-all:
 *   post:
 *     tags: [Auth]
 *     summary: Logout from all devices
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       '200':
 *         description: Logged out from all devices
 *       '401':
 *         description: Unauthorized
 */
router.post(
  "/logout-all",
  authMiddleware,
  csrfMiddleware,
  addUser,
  logoutAllCont
);

/**
 * @swagger
 * /api/v1/auth/authorizedPage:
 *   get:
 *     tags: [Auth]
 *     summary: Access a protected page
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       '200':
 *         description: Access granted
 *       '401':
 *         description: Unauthorized
 */
router.get("/authorizedPage", authMiddleware, csrfMiddleware, checkedRes);

/**
 * @swagger
 * /api/v1/auth/otp-auth:
 *   post:
 *     tags: [Auth]
 *     summary: Generate OTP for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OTP sent successfully
 *       '400':
 *         description: Bad request
 */
router.post("/otp-auth", otpAuthGenerator);

/**
 * @swagger
 * /api/v1/auth/otp-verify:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OTP verified successfully
 *       '400':
 *         description: Invalid OTP
 */
router.post("/otp-verify", otpAuthChecker);

/**
 * @swagger
 * /api/v1/auth/password-reset:
 *   post:
 *     tags: [Auth]
 *     summary: Send password reset link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset link sent
 *       '400':
 *         description: Bad request
 */
router.post("/password-reset", resetPasswordSender);

/**
 * @swagger
 * /api/v1/auth/password-verify:
 *   post:
 *     tags: [Auth]
 *     summary: Verify password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Token verified
 *       '400':
 *         description: Invalid token
 */
router.post("/password-verify", resetVerifier);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *       '400':
 *         description: Bad request
 */
router.post("/change-password", changePassword);

export default router;
