import jsonRes from "../utils/response.js";
import { verifyAccessToken } from "../utils/utils.js";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log("AA")
  console.log(token)
  console.log("AA")
  if (!token) {
    return jsonRes(res, 401, false, "Unauthorized Access");
  }
  try {
    const decoded = verifyAccessToken(token);
    console.log(`Its here ${decoded.id}`)
    req.id = decoded.id;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return jsonRes(res, 401, false, "Token Expired");
    } else if (err.name === "JsonWebTokenError") {
      return jsonRes(res, 403, false, "Invalid Token");
    } else {
      return jsonRes(res, 500, false, "Server Error");
    }
  }
};

export default authMiddleware