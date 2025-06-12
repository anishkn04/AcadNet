import jsonRes from "../utils/response.js";
import {
  loginOauth,
  refreshTokens,
  logout,
  logoutAll,
  sessionService
} from "../services/authservices.js";
import RefreshToken from "../models/refresh.model.js";

const indexPath = "http://localhost:5500/sample_frontend/index.html";
const dashPath = "http://localhost:5500/sample_frontend/dashboard.html";

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
   if (!oldRefreshToken)
      return jsonRes(res, 401, false, "No refresh token provided");
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
    const { email, username, password } = req.body;
    await signupService(email,username, password);
     return jsonRes(res, 200, true, "Signup Success");
  } catch (err) {
    return jsonRes(res, 500, false, err);
  }
};
