import RefreshToken from "../models/refresh.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/utils.js";
import { randomBytes,randomInt} from "crypto";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import otpModel from '../models/otp.model.js'
import throwWithCode from "../utils/errorthrow.js";
import nodemailer from 'nodemailer'
import mailSender from "./otpmailservice.js";

export const loginOauth = async (user) => {
  const REFRESH_TOKEN_EXPIRY_DAYS = 7;
  const userId = user._id;
  const accessToken = generateAccessToken({ id: userId, role: user.role });
  const refreshToken = generateRefreshToken({ id: userId, role: user.role });
  const csrfToken = randomBytes(20).toString("hex");

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  await RefreshToken.create({ user: userId, token: refreshToken, expiresAt });

  return { accessToken, refreshToken, csrfToken };
};

export const sessionService = async (oldRefreshToken) => {
  try {
    let decoded
    console.log(oldRefreshToken)
    decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const savedToken = await RefreshToken.findOne({ token: oldRefreshToken });
    if (!savedToken) {
      throw new Error("Refresh token revoked or not found");
    }

    return true;
  } catch {
    throw new Error("Invalid refresh token");
  }
};

export const refreshTokens = async (oldRefreshToken) => {
  const REFRESH_TOKEN_EXPIRY_DAYS = 7;
  
  let decoded;


  try {
    decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new Error("Invalid refresh token");
  }
  const savedToken = await RefreshToken.findOne({ token: oldRefreshToken });
  if (!savedToken) {
    throw new Error("Refresh token revoked or not found");
  }



  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User not found");


  await RefreshToken.deleteOne({ token: oldRefreshToken });

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );
  await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt });

  const csrfToken = randomBytes(20).toString("hex");

  return { accessToken, refreshToken, csrfToken };
};

export const logout = async (refreshToken) => {
  try {
    await RefreshToken.deleteOne({ token: refreshToken });
  } catch (err) {
    console.log(err);
    console.log("Logout error");
  }
};

export const logoutAll = async (userId) => {
  try {

    console.log(userId);

    await RefreshToken.deleteMany({ user: userId });
  } catch (err) {
    console.log(err);
  }
};

export const signupService = async (email, username, password) => {
  try {
    let newusername = username;

    let suffix = 1;

    while (await User.findOne({ username: newusername })) {
      newusername = `${username}_${suffix++}`;
    }

    await User.create({ email, username: newusername, password });
  } catch (err) {
    throw new Error(err);
  }
};

export const loginService = async (res,email,password)=>{
  let REFRESH_TOKEN_EXPIRY_DAYS = 7
   console.log("Login Reached")
   console.log(email)
   let user = await User.findOne({ email });
   if(!user){
    throw new Error('Login Error: User not Found')
   }

   if(user.isVerified === false){

    const otpToken = randomBytes(20).toString("hex");
    const username = user.username

    res.cookie("otpToken", otpToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 60 * 60 * 1000
    });
    

     res.cookie("username", username, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 60 * 60 * 1000
    });


    throwWithCode("Redirecting to /otp-auth", 303); 
   }

   if(user.authProvider != 'local'){
    throw new Error("Please Login via GitHub")
   }

   const verify = await bcrypt.compare(password, user.password);

    if (!verify) {
     throw new Error('Login Error: Wrong Credentials')
    }

  const userId = user._id;
  const accessToken = generateAccessToken({ id: userId, role: user.role });
  const refreshToken = generateRefreshToken({ id: userId, role: user.role });
  const csrfToken = randomBytes(20).toString("hex");

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  await RefreshToken.create({ user: userId, token: refreshToken, expiresAt });

  return { accessToken, refreshToken, csrfToken };


}

export const otpGenerator = async (username,otpToken)=>{
  try{
    const OTP_COOLDOWN_PERIOD_MS = 1000 * 60 * 1
    const OTP_TOKEN_EXPIRY = 7;

    if (!username) {
      throwWithCode("Username unreachable",401)
    }

    const user = await User.findOne({username})
    
    if (!user) {
      throwWithCode("User Not Found",401)
    }
    
    const userId = user._id
    const email = user.email

  
    if(user.isVerified === true){
      throwWithCode("User Already Verified",303)
    }

    const lastOtpTime = user.lastOtp.getTime();
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastOtpTime;

    if (timeElapsed < OTP_COOLDOWN_PERIOD_MS) {
      const timeLeftMs = OTP_COOLDOWN_PERIOD_MS - timeElapsed;
      const timeLeftSeconds = Math.ceil(timeLeftMs / 1000);
      const message = `Please wait ${timeLeftSeconds} seconds before requesting another OTP.`
      throwWithCode(message, 429); 
    }

    const otp = randomInt(100000, 1000000).toString()

    const expiresAt = new Date(
    Date.now() + OTP_TOKEN_EXPIRY * 60 * 1000
  );

    user.lastOtp = new Date();
    await user.save(); 
  
    await otpModel.deleteMany({user: userId})
    await user.save()
    await otpModel.create({user: userId, otp,otpToken,expiresAt})
    return {otp,email};
}catch(err){
  throw err
}
  
}


export const otpSender = async (otp,username,email)=>{
try{
  const success= await mailSender(email, username, otp);
}catch(err){
  throw err
}
}

export const otpChecker = async(username,otpToken,otp)=>{
  if(!username || !otpToken){
    throwWithCode("Credential Error",401)
  }

  const user = await User.findOne({username})
  const userId = user._id

  const correct_otp = await otpModel.findOne({user: userId, otpToken})
   if(!correct_otp){
    throwWithCode("Credential Error",401)
  }

  const isMatch = await bcrypt.compare(otp, correct_otp.otp);

  if(!isMatch){
    throwWithCode("Wrong OTP",401)
  }

  user.isVerified = true;
  await user.save()
  return true




}