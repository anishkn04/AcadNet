import jsonRes from "../utils/response.js";
import {
  loginOauth,
  refreshTokens,
  logout,
  logoutAll,
  sessionService,
  signupService,
  loginService,
  otpGenerator,
  otpSender,
  otpChecker,
  resetOTPgenerator,
  changePasswordService,
  terminateUser
} from "../services/authservices.js";
import { deleteUserAccount } from "../services/userAccountService.js";
import UserModel from "../models/user.model.js";
import { randomBytes } from "crypto";
import path from "path";
import { fileURLToPath } from "url";


const indexPath = "http://localhost:5500/sample_frontend/index.html";
const dashPath = "http://localhost:5500/";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const oAuthFail = async (req,res) =>{
    const filePath = path.join(__dirname, "../failure/fail.html");
    console.log(filePath)
   res.status(401).sendFile(filePath);
}

export const oAuthCallback = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.redirect(indexPath);
  }

  try {
    const { accessToken, refreshToken, csrfToken } = await loginOauth(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      sameSite: "Lax",
      secure: false,
      maxAge: 15 * 60 * 1000
    });

    return res.redirect(dashPath);
  } catch (err) {
    console.log(err);
    return res.redirect(indexPath);
  }
};

export const sessionChecker = async (req, res) => {
  try {

    const oldRefreshToken = req.cookies.refreshToken;
  
    if (!oldRefreshToken) {
      return jsonRes(res, 401, false, "No refresh token provided");
    }
    const {isSession,accessToken} = await sessionService(oldRefreshToken,req.user);

    if (isSession == true) {

      res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 15 * 60 * 1000
    });

    
      return jsonRes(res, 200, true, "Ref Token is Valid");
    } else {
      return jsonRes(res, 401, false, "Session is invalid");
    }
  } catch (err) {
    console.log("Error")
    return jsonRes(res, 401, false, "Session is invalid or expired");
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken)
      return jsonRes(res, 401, false, "No refresh token provided");

    const { accessToken, refreshToken, csrfToken } = await refreshTokens(
      oldRefreshToken
    );

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");

    // Set new tokens cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure:true,
      maxAge: 15 * 60 * 1000
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure:true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return jsonRes(res, 200, true, "Token refreshed");
  } catch (err) {
    console.log(err);
    return jsonRes(res, 403, false, err.message || "Refresh failed");
  }
};

export const logoutCont = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return jsonRes(res, 400, false, "No refresh token provided");

    await logout(refreshToken);

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");

    return jsonRes(res, 200, true, "Logged out successfully");
  } catch (err) {
    console.log(err);
    return jsonRes(res, 500, false, "Logout failed");
  }
};

export const logoutAllCont = async (req, res) => {
  try {
    const userId = req.user.user_id;

    await logoutAll(userId);

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");

    return jsonRes(res, 200, true, "Logged out from all sessions");
  } catch (err) {
    console.log(err);
    return jsonRes(res, 500, false, "Logout all failed");
  }
};

export const checkedRes = (req, res) => {
  return jsonRes(res, 200, true, "Logged In");
};

export const signup = async (req, res) => {
  try {
    let { email, username, password } = req.body;

    email = email.toLowerCase();
    username = username.toLowerCase();
    const newusername= await signupService(email, username, password);

    const otpToken = randomBytes(20).toString("hex");

    

    res.cookie("otpToken", otpToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 1000
    });

    res.cookie("username", newusername, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 1000
    });



    return jsonRes(res, 200, true, "Success");
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return jsonRes(res, 409, false, "Email already in use");
    }

    return jsonRes(res, 500, false, err.message);
  }
};

export const otpAuthGenerator = async (req, res) => {
  try {

    const username = req.cookies.username;
    const otpToken = req.cookies.otpToken;
  
    const { otp, email } = await otpGenerator(username, otpToken);
   
    await otpSender(otp, username, email);
    jsonRes(res, 200, true, "OTP Sent");
  } catch (err) {
    return jsonRes(res, err.code, false, err.message);
  }
};

export const otpAuthChecker = async (req, res) => {
  try {
    const username = req.cookies.username;
    const otpToken = req.cookies.otpToken;
    const { otp } = req.body;
    const check = await otpChecker(username, otpToken, otp);
    if (check) {
      res.clearCookie("username");
      res.clearCookie("otpToken");
      jsonRes(res, 200, true, "Verified");
    } else {
      jsonRes(res, err.code, false, "Not Verified");
    }
  } catch (err) {
    return jsonRes(res, err.code, false, err.message);
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const { accessToken, refreshToken, csrfToken } = await loginService(
      res,
      email,
      password
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      sameSite: "lax",
      secure: true,
      maxAge: 15 * 60 * 1000
    });

    jsonRes(res, 200, true, "Login Success");
  } catch (err) {
    if (
      err.message == "Login Error: User not Found" ||
      err.message == "Login Error: Wrong Credentials"
    ) {
      return jsonRes(res, 401, false, err.message);
    } else if (err.message == "Please Login via GitHub") {
      return jsonRes(res, 409, false, err.message);
    } else if (err.message == "Redirecting to /otp-auth") {
      return jsonRes(res, 303, false, err.message);
    } else {
      return jsonRes(res, 500, false, err.message);
    }
  }
};

export const resetPasswordSender = async (req, res) => {
  try {
    const { email } = req.body;

    const { otp, otpToken, username } = await resetOTPgenerator(email);

    await otpSender(otp, username, email);

    res.cookie("username", username, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 5 * 60 * 1000
    });

    res.cookie("resetToken", otpToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 5 * 60 * 1000
    });

    jsonRes(res, 200, true, "OTP SENT");
  } catch (err) {
    return jsonRes(res, err.code, false, err.message);
  }
};

export const resetVerifier = async (req, res) => {
  try {
    const username = req.cookies.username;
    const otpToken = req.cookies.resetToken;
    const { otp } = req.body;
    const check = await otpChecker(username, otpToken, otp);
    if (check) {
      jsonRes(res, 200, true, "Verified");
    } else {
      jsonRes(res, err.code, false, "Not Verified");
    }
  } catch (err) {
    return jsonRes(res, err.code, false, err.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const username = req.cookies.username;
    const otpToken = req.cookies.resetToken;
    const { newPassword } = req.body;

    if (!newPassword) {
      return jsonRes(res, 400, false, "New password is required.");
    }

    await changePasswordService(username, otpToken, newPassword);

    res.clearCookie("username");
    res.clearCookie("resetToken");

    return jsonRes(res, 200, true, "Password has been reset successfully.");
  } catch (err) {
    return jsonRes(res, err.code || 500, false, err.message);
  }
};


export const deleteUser = async (req, res) => {
  try {
    const userid = req.id;
    
    // Use comprehensive deletion that removes all user data
    const result = await deleteUserAccount(userid);
    
    // Clear cookies on successful deletion
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");

    return jsonRes(res, 200, true, result.message || "Account and all associated data deleted successfully");
  } catch (err) {
    console.log(err);
    return jsonRes(res, err.code || 500, false, err.message || "Failed to delete user account");
  }
};

