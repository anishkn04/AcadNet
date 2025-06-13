import jsonRes from "../utils/response.js";
import {
  loginOauth,
  refreshTokens,
  logout,
  logoutAll,
  sessionService,
  signupService,
  loginService
} from "../services/authservices.js";
import RefreshToken from "../models/refresh.model.js";

const indexPath = "http://localhost:5500/sample_frontend/index.html";
const dashPath = "http://localhost:5500/";

export const oAuthCallback = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.redirect(indexPath);
  }

  try {
    const { accessToken, refreshToken, csrfToken } = await loginOauth(user);




    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
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
    console.error(err);
    return res.redirect(indexPath);
  }
};

export const sessionChecker = async (req,res) =>{
  try{
  const oldRefreshToken = req.cookies.refreshToken;
   if (!oldRefreshToken){
      return jsonRes(res, 401, false, "No refresh token provided");
    }
    const isSession = await sessionService(oldRefreshToken)
   
   if(isSession == true){
      return jsonRes(res, 200, false, "Ref Token is Valid");
   }else {
      return jsonRes(res, 401, false, "Session is invalid");
    }
  }
  catch(err){
    return jsonRes(res, 401, false, "Session is invalid or expired");
  }
}


export const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken)
      return jsonRes(res, 401, false, "No refresh token provided");
    
    const { accessToken, refreshToken, csrfToken } = await refreshTokens(oldRefreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");

    // Set new tokens cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

   

    return jsonRes(res, 200, true, "Token refreshed");
  } catch (err) {
    console.error(err);
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
    console.error(err);
    return jsonRes(res, 500, false, "Logout failed");
  }
};

export const logoutAllCont = async (req, res) => {

  try {

    const userId = req.user._id;

    await logoutAll(userId);

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");

    return jsonRes(res, 200, true, "Logged out from all sessions");
  } catch (err) {
    console.error(err);
    return jsonRes(res, 500, false, "Logout all failed");
  }
};

export const checkedRes = (req, res) => {
  return jsonRes(res, 200, true, "Logged In");
};


export const signup = async (req, res) => {
  try {
    console.log("Reached here")
    let { email, username, password } = req.body;
    email = email.toLowerCase();
    username = username.toLowerCase();
    await signupService(email,username, password);
     return jsonRes(res, 200, true, "Signup Success");
  } catch (err) {
    if(err.message === 'MongoServerError: E11000 duplicate key error collection: acadnetest.users index: email_1 dup key: { email: "gainrishavchap@gmail.com" }'){
      return jsonRes(res, 404, false, "Email already in use");
    }
    return jsonRes(res, 500, false, "Internal Server Error");
  }
};

export const otpAuth =async (req,res) =>{
  try{
    
  } catch(err){

  }
}

export const login = async (req,res) =>{
  try{   
   let { email, password } = req.body;
   email = email.toLowerCase()
    
   const {accessToken, refreshToken, csrfToken }= await loginService(email,password)

   res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      sameSite: "Lax",
      secure: false,
      maxAge: 15 * 60 * 1000
    });

    jsonRes(res,200,true,"Login Success")

  }catch(err){
    if(err.message == "Login Error: User not Found" || err.message == "Login Error: Wrong Credentials"){
      return jsonRes(res,401,false,err.message)
    }else if(err.message == "Please Login via GitHub"){
      return jsonRes(res,409,false,err.message)
    }else{
    return jsonRes(res, 500, false, err.message);
    }
  }
  }
