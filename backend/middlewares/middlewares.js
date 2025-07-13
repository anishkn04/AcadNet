export const logger = (req, res, next) => {
  console.log(`The Method is ${req.method} - The Endpoint is ${req.url}`);
  next();
};
