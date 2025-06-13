import RefreshToken from "../models/refresh.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/utils.js";
import { randomBytes } from "crypto";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

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

export const loginService = async (email,password)=>{
  let REFRESH_TOKEN_EXPIRY_DAYS = 7
   let user = await User.findOne({ email });
   if(!user){
    throw new Error('Login Error: User not Found')
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
