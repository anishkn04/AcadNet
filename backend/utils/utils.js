import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET

export const generateAccessToken = (payload) => {
  const tokenPayload = {
    role: 'user',  // default role
    ...payload    
  };


  return jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload,ACCESS_SECRET,{expiresIn: "15m"});
};

export const verifyAccessToken = (token) => {return jwt.verify(token, ACCESS_SECRET);};

export const verifyRefreshToken = (token) => {return jwt.verify(token, REFRESH_SECRET);};
