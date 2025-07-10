import RefreshToken from "../models/refresh.sequelize.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/utils.js";
import { randomBytes, randomInt } from "crypto";
import UserModel from "../models/user.model.js";
import OTP from '../models/otp.model.js';
import jwt from "jsonwebtoken";
import throwWithCode from "../utils/errorthrow.js";
import mailSender from "./otpmailservice.js";

export const loginOauth = async (user) => {
  try {
    const REFRESH_TOKEN_EXPIRY_DAYS = 7;
    const userId = user.user_id;
    const accessToken = generateAccessToken({ id: userId, role: user.role });
    const refreshToken = generateRefreshToken({ id: userId, role: user.role });
    const csrfToken = randomBytes(20).toString("hex");

    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    await RefreshToken.create({ user_id: userId, token: refreshToken, expires_at: expiresAt });

    return { accessToken, refreshToken, csrfToken };
  } catch (err) {
    throw err;
  }
};

export const sessionService = async (oldRefreshToken,user) => {
  try {
    let decoded;

    decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const savedToken = await RefreshToken.findOne({ where: { token: oldRefreshToken } });
    if (!savedToken) {
      throw new Error("Refresh token revoked or not found");
    }

    const accessToken = generateAccessToken({ id: user.user_id, role: user.role })
    return {isSession: true , accessToken};
  } catch {
    throw new Error("Invalid refresh token");
  }
};

export const refreshTokens = async (oldRefreshToken) => {
  try {
    const REFRESH_TOKEN_EXPIRY_DAYS = 7;

    let decoded;

    try {
      decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      throw new Error("Invalid refresh token");
    }
    const savedToken = await RefreshToken.findOne({ where: { token: oldRefreshToken } });
    if (!savedToken) {
      throw new Error("Refresh token revoked or not found");
    }

    const user = await UserModel.findByPk(decoded.id);
    if (!user) throw new Error("User not found");

    await RefreshToken.destroy({ where: { token: oldRefreshToken } });

    const accessToken = generateAccessToken({ id: user.user_id, role: user.role });
    const refreshToken = generateRefreshToken({
      id: user.user_id,
      role: user.role
    });
    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );
    await RefreshToken.create({
      user_id: user.user_id,
      token: refreshToken,
      expires_at: expiresAt
    });

    const csrfToken = randomBytes(20).toString("hex");

    return { accessToken, refreshToken, csrfToken };
  } catch (err) {
    throw err;
  }
};

export const logout = async (refreshToken) => {
  try {
    await RefreshToken.destroy({ where: { token: refreshToken } });
  } catch (err) {
    console.log(err);
    console.log("Logout error");
    throw err;
  }
};

export const logoutAll = async (userId) => {
  try {
    await RefreshToken.destroy({ where: { user_id: userId } });
  } catch (err) {
    throw err;
  }
};


export const signupService = async (email, username, password) => {
  try {
    let newusername = username;
  
    let suffix = 1;

    while (await UserModel.findOne({ where: { username: newusername } })) {
      newusername = `${username}_${suffix++}`;
    }
    await UserModel.create({ email, username: newusername, password_hash: password });
 
    return newusername
  } catch (err) {
    // Handle Sequelize Unique Constraint Errors
    if (err.name === 'SequelizeUniqueConstraintError') {
      // Check which field caused the unique constraint violation
      if (err.errors && err.errors.length > 0) {
        const duplicateField = err.errors[0].path;
        
        if (duplicateField === 'email') {
          err.message = "Email is already in use";
        } else if (duplicateField === 'username') {
          err.message = "Username is already taken";
        } else {
          err.message = `${duplicateField} must be unique`;
        }
      } else {
        err.message = "Duplicate entry detected";
      }
    } 
    // Handle other Sequelize Validation Errors
    else if (err.name === 'SequelizeValidationError') {
      // Handle validation errors (like invalid email format, length constraints, etc.)
      if (err.errors && err.errors.length > 0) {
        err.message = err.errors[0].message;
      } else {
        err.message = "Validation failed";
      }
    }
    // Keep original handling for backward compatibility
    else if (err.message === "Validation error") {
      err.message = "Email in Use";
    }
    
    throw err;
  }
};


export const loginService = async (res, email, password) => {
  try {
    let REFRESH_TOKEN_EXPIRY_DAYS = 7;

    let user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw new Error("Login Error: User not Found");
    }

    if (user.is_verified === false) {
      const otpToken = randomBytes(20).toString("hex");
      const username = user.username;

      res.cookie("otpToken", otpToken, {
        httpOnly: true,
        sameSite: "Lax",
        secure: true,
        maxAge: 60 * 60 * 1000
      });

      res.cookie("username", username, {
        httpOnly: true,
        sameSite: "Lax",
        secure: true,
        maxAge: 60 * 60 * 1000
      });

      throwWithCode("Redirecting to /otp-auth", 303);
    }

    if (user.auth_provider != "local") {
      throw new Error("Please Login via GitHub");
    }

    const verify = await user.comparePassword(password);

    if (!verify) {
      throw new Error("Login Error: Wrong Credentials");
    }

    const userId = user.user_id;
    const accessToken = generateAccessToken({ id: userId, role: user.role });
    const refreshToken = generateRefreshToken({ id: userId, role: user.role });
    const csrfToken = randomBytes(20).toString("hex");

    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    await RefreshToken.create({ user_id: userId, token: refreshToken, expires_at: expiresAt });

    return { accessToken, refreshToken, csrfToken };
  } catch (err) {
    throw err;
  }
};

export const otpGenerator = async (username, otpToken) => {
  try {
    const OTP_COOLDOWN_PERIOD_MS = 1000 * 60 * 1;
    const OTP_TOKEN_EXPIRY = 7;
    if (!username || !otpToken) {
      throwWithCode(" unreachable", 401);
    }

    const user = await UserModel.findOne({ where: { username } });

    if (!user) {
      throwWithCode("User Not Found", 401);
    }

    const userId = user.user_id;
    const email = user.email;

    if (user.is_verified === true) {
      throwWithCode("User Already Verified", 303);
    }

    const lastOtpTime = user.last_otp.getTime();
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastOtpTime;

    if (timeElapsed < OTP_COOLDOWN_PERIOD_MS) {
      const timeLeftMs = OTP_COOLDOWN_PERIOD_MS - timeElapsed;
      const timeLeftSeconds = Math.ceil(timeLeftMs / 1000);
      const message = `Please wait ${timeLeftSeconds} seconds before requesting another OTP.`;
      throwWithCode(message, 429);
    }

    const otp = randomInt(100000, 1000000).toString();

    const expiresAt = new Date(Date.now() + OTP_TOKEN_EXPIRY * 60 * 1000);

    user.last_otp = new Date();
    await user.save();

    await OTP.destroy({ where: { user_id: userId } });
    await OTP.create({ user_id: userId, otp_code: otp, expires_at: expiresAt });
    return { otp, otpToken, email };
  } catch (err) {
    throw err;
  }
};

export const otpSender = async (otp, username, email) => {
  try {
    const success = await mailSender(email, username, otp);
  } catch (err) {
    throw err;
  }
};

export const otpChecker = async (username, otpToken, otp) => {
  try {
    if (!username || !otpToken) {
      throwWithCode("Credential Error", 401);
    }

    const user = await UserModel.findOne({ where: { username } });
    const userId = user.user_id;

    const correct_otp = await OTP.findOne({ where: { user_id: userId } });
    if (!correct_otp) {
      throwWithCode("Credential Error", 401);
    }

    if (otp !== correct_otp.otp_code) {
      throwWithCode("Wrong OTP", 401);
    }

    user.is_verified = true;
    await user.save();
    return true;
  } catch (err) {
    throw err;
  }
};

export const resetOTPgenerator = async (email) => {
  try {
    const OTP_COOLDOWN_PERIOD_MS = 1000 * 60 * 1;
    const OTP_TOKEN_EXPIRY = 5;
    const user = await UserModel.findOne({ where: { email } });

    if (!email) {
      throwWithCode(" unreachable", 401);
    }

    if (!user) {
      throwWithCode("No User Found", 401);
    }

    if (user.auth_provider === "github") {
      throwWithCode("Password Reset Not Available for oAuth", 429);
    }
    const userId = user.user_id;
    const otpToken = randomBytes(20).toString("hex");
    const username = user.username;

    const lastOtpTime = user.last_otp.getTime();
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastOtpTime;

    if (timeElapsed < OTP_COOLDOWN_PERIOD_MS) {
      const timeLeftMs = OTP_COOLDOWN_PERIOD_MS - timeElapsed;
      const timeLeftSeconds = Math.ceil(timeLeftMs / 1000);
      const message = `Please wait ${timeLeftSeconds} seconds before requesting another OTP.`;
      throwWithCode(message, 429);
    }
    const otp = randomInt(100000, 1000000).toString();

    const expiresAt = new Date(Date.now() + OTP_TOKEN_EXPIRY * 60 * 1000);

    user.last_otp = new Date();
    await user.save();

    await OTP.destroy({ where: { user_id: userId } });
    await OTP.create({
      user_id: userId,
      otp_code: otp,
      expires_at: expiresAt
    });
    return { otp, otpToken, username };
  } catch (err) {
    throw err;
  }
};

export const changePasswordService = async (
  username,
  otpToken,
  newPassword
) => {
  try {
    if (!username || !otpToken) {
      throwWithCode(
        "Invalid request. Please start the password reset process again.",
        401
      );
    }

    const user = await UserModel.findOne({ where: { username } });

    if (!user) {
      throwWithCode("User not found.", 404);
    }

    if (user.authProvider === "github") {
      throwWithCode("Not for OAuth Users.", 404);
    }

    user.password_hash = newPassword;
    await user.save();

    await logoutAll(user.user_id);
  } catch (err) {
    throw err;
  }
};



export const terminateUser= async (userid)=>{
  try{
    const user = await UserModel.findByPk(userid);
    
    if (!user) {
      throwWithCode("No User Found",404)
    }

    await user.destroy();
  }catch(err){
    throw err
  }
}