import jsonRes from "../utils/response.js";

const csrfMiddleware = (req,res,next)=>{
  const csrfCookie = req.cookies.csrfToken;

  const csrfHeader = req.headers['x-csrf-token']

  console.log(csrfCookie)

     if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return jsonRes(res, 403, false, "Invalid Token");
  }
  next()
}

export default csrfMiddleware