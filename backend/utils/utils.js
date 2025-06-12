import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET

export const generateAccessToken = (payload) => {

  const sanitizedPayload = {
    role: 'user', // default role
    ...payload,
  };

  // Ensure all ObjectIds are converted to strings
  if (sanitizedPayload.id && typeof sanitizedPayload.id !== 'string') {
    sanitizedPayload.id = sanitizedPayload.id.toString();
  }

  return jwt.sign(sanitizedPayload, ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload) => {
   const sanitizedPayload = {
    role: 'user', // default role
    ...payload,
  };

  // Ensure all ObjectIds are converted to strings
  if (sanitizedPayload.id && typeof sanitizedPayload.id !== 'string') {
    sanitizedPayload.id = sanitizedPayload.id.toString();
  }


  return jwt.sign(sanitizedPayload,REFRESH_SECRET,{expiresIn: "7d"});
};

export const verifyAccessToken = (token) => {return jwt.verify(token, ACCESS_SECRET);};

export const verifyRefreshToken = (token) => {return jwt.verify(token, REFRESH_SECRET);};
