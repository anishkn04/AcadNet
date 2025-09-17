import { getDashboard, getStatsService, deleteUserAndDataService, listAllGroupsService, deleteGroupAndDataService, searchUserByUsernameService, searchGroupByNameService } from "../services/sysadminservice.js";
import jsonRes from "../utils/response.js";
import { UserModel } from "../models/index.model.js";

export const sysadminDashboard = (req, res) => {
  const result = getDashboard({ role: req.role, id: req.id });
  if (req.role === "admin") {
    return jsonRes(res, 200, true, result);
  } else {
    return jsonRes(res, 403, false, result);
  }
};

export const getStats = async (req, res) => {
  if (req.role !== "admin") {
    return jsonRes(res, 403, false, "Forbidden");
  }
  try {
    const stats = await getStatsService();
    return jsonRes(res, 200, true, stats);
  } catch (err) {
    return jsonRes(res, 500, false, "Internal Server Error");
  }
};

export const listAllUsers = async (req, res) => {
  if (req.role !== "admin") {
    return jsonRes(res, 403, false, "Forbidden");
  }
  try {
    const users = await UserModel.findAll({ attributes: ["user_id", "username", "email"] });
    return jsonRes(res, 200, true, users);
  } catch (err) {
    return jsonRes(res, 500, false, "Internal Server Error");
  }
};

export const deleteUserById = async (req, res) => {
  if (req.role !== "admin") {
    return jsonRes(res, 403, false, "Forbidden");
  }
  const { userId } = req.params;
  if (String(req.id) === String(userId)) {
    return jsonRes(res, 403, false, "Admins cannot delete their own account.");
  }
  try {
    const result = await deleteUserAndDataService(userId);
    if (result === "admin") {
      return jsonRes(res, 403, false, "Admins cannot delete another admin.");
    } else if (result === "notfound") {
      return jsonRes(res, 404, false, "User not found");
    } else if (result === "success") {
      return jsonRes(res, 200, true, `User ${userId} and all related data deleted.`);
    } else {
      return jsonRes(res, 500, false, "Internal Server Error");
    }
  } catch (err) {
    return jsonRes(res, 500, false, "Internal Server Error");
  }
};

export const listAllGroups = async (req, res) => {
  if (req.role !== "admin") {
    return jsonRes(res, 403, false, "Forbidden");
  }
  try {
    const formatted = await listAllGroupsService();
    return jsonRes(res, 200, true, formatted);
  } catch (err) {
    return jsonRes(res, 500, false, "Internal Server Error");
  }
};

export const deleteGroupById = async (req, res) => {
  if (req.role !== "admin") {
    return jsonRes(res, 403, false, "Forbidden");
  }
  const { groupId } = req.params;
  try {
    const result = await deleteGroupAndDataService(groupId);
    if (result === "notfound") {
      return jsonRes(res, 404, false, "Group not found");
    } else if (result === "success") {
      return jsonRes(res, 200, true, `Group ${groupId} and all related data deleted.`);
    } else {
      return jsonRes(res, 500, false, "Internal Server Error");
    }
  } catch (err) {
    return jsonRes(res, 500, false, "Internal Server Error");
  }
};

export const searchUserByUsername = async (req, res) => {
  if (req.role !== "admin") {
    return jsonRes(res, 403, false, "Forbidden");
  }
  const { username } = req.query;
  if (!username) {
    return jsonRes(res, 400, false, "Username is required");
  }
  try {
    const user = await searchUserByUsernameService(username);
    if (user) {
      return jsonRes(res, 200, true, user);
    } else {
      return jsonRes(res, 404, false, "User not found");
    }
  } catch (err) {
    return jsonRes(res, 500, false, "Internal Server Error");
  }
};

export const searchGroupByName = async (req, res) => {
  if (req.role !== "admin") {
    return jsonRes(res, 403, false, "Forbidden");
  }
  const { groupname } = req.query;
  if (!groupname) {
    return jsonRes(res, 400, false, "Group name is required");
  }
  try {
    const group = await searchGroupByNameService(groupname);
    if (group) {
      return jsonRes(res, 200, true, group);
    } else {
      return jsonRes(res, 404, false, "Group not found");
    }
  } catch (err) {
    return jsonRes(res, 500, false, "Internal Server Error");
  }
};
