const jsonRes = (res, statusCode, success, message) => {
  return res.status(statusCode).json({ success, message });
};

export default jsonRes;
