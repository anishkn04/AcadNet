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

const router = express.Router();

router.post("/signup", validateSignup, handleValidationError, signup);

router.post("/login", login);

router.get("/github",passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/v1/auth/failure",
    session: false
  }),
  oAuthCallback
);

router.get("/failure",oAuthFail)

router.post("/checkSession", authMiddleware, csrfMiddleware, addUser, sessionChecker);

router.post(
  "/refresh-token",
  authMiddleware,
  csrfMiddleware,
  refreshAccessToken
);

router.post("/logout", logoutCont);

router.post(
  "/logout-all",
  authMiddleware,
  csrfMiddleware,
  addUser,
  logoutAllCont
);

router.get("/authorizedPage", authMiddleware, csrfMiddleware, checkedRes);

router.post("/otp-auth", otpAuthGenerator);

router.post("/otp-verify", otpAuthChecker);

router.post("/password-reset", resetPasswordSender);

router.post("/password-verify", resetVerifier);

router.post("/change-password", changePassword);

export default router;
