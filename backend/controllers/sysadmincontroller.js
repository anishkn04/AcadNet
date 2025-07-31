import { getDashboard } from "../services/sysadminservice.js";

export const sysadminDashboard = (req, res) => {
  const result = getDashboard({ role: req.role, id: req.id });
  if (req.role === "admin") {
    return res.status(200).json(result);
  } else {
    return res.status(403).json(result);
  }
};
