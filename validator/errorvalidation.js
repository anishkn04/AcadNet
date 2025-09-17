import { validationResult } from "express-validator";
import jsonRes from "../utils/response.js";

const handleValidationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return jsonRes(res, 400, false, firstError.msg);
  }
  next();
};

export default handleValidationError;
