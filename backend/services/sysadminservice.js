import { UserModel, AdditionalResource, StudyGroup, Thread, Reply, Membership, Forum, UserReport } from "../models/index.model.js";

export const getDashboard = (user) => {
  if (user.role === "admin") {
    console.log("Welcome to SysAdmin Dashboard");
    return { message: "SysAdmin Dashboard Access Granted" };
  } else {
    return { message: "Access Denied: Not an Admin" };
  }
};

export const getStatsService = async () => {
  const totalUsers = await UserModel.count();
  const totalResources = await AdditionalResource.count();
  const totalActiveGroups = await StudyGroup.count({ where: { isPrivate: false } });
  return {
    totalUsers,
    totalResources,
    totalActiveGroups
  };
};

export const deleteUserAndDataService = async (userId) => {
  const userToDelete = await UserModel.findOne({ where: { user_id: userId } });
  if (!userToDelete) return "notfound";
  if (userToDelete.role === "admin") return "admin";
  try {
    const groups = await StudyGroup.findAll({ where: { creatorId: userId } });
    for (const group of groups) {
      await AdditionalResource.destroy({ where: { studyGroupId: group.id } });
      await Membership.destroy({ where: { studyGroupId: group.id } });
      await UserReport.destroy({ where: { studyGroupId: group.id } });
      // Find all forums for this group
      const forums = await Forum.findAll({ where: { studyGroupId: group.id } });
      for (const forum of forums) {
        await Thread.destroy({ where: { forumId: forum.id } });
        await forum.destroy();
      }
      await group.destroy();
    }
    await AdditionalResource.destroy({ where: { uploadedBy: userId } });
    await Thread.destroy({ where: { authorId: userId } });
    await Reply.destroy({ where: { authorId: userId } });
    await Membership.destroy({ where: { userId: userId } });
    await UserReport.destroy({ where: { reporterId: userId } });
    await UserReport.destroy({ where: { reportedUserId: userId } });
    await UserReport.destroy({ where: { reviewedBy: userId } });
    const deleted = await UserModel.destroy({ where: { user_id: userId } });
    if (deleted) return "success";
    return "notfound";
  } catch {
    return "error";
  }
};

export const listAllGroupsService = async () => {
  const groups = await StudyGroup.findAll({
    attributes: ["id", "name", "creatorId"],
  });
  // Fetch owner details for each group
  const formatted = await Promise.all(groups.map(async g => {
    const owner = await UserModel.findOne({
      where: { user_id: g.creatorId },
      attributes: ["username", "email"]
    });
    return {
      groupId: g.id,
      groupName: g.name,
      groupOwner: owner ? { username: owner.username, email: owner.email } : null
    };
  }));
  return formatted;
};

export const deleteGroupAndDataService = async (groupId) => {
  const group = await StudyGroup.findOne({ where: { id: groupId } });
  if (!group) {
    // Group not found, do not throw error
    return "notfound";
  }
  try {
    await AdditionalResource.destroy({ where: { studyGroupId: groupId } });
    await Membership.destroy({ where: { studyGroupId: groupId } });
    await UserReport.destroy({ where: { studyGroupId: groupId } });
    // Find all forums for this group
    const forums = await Forum.findAll({ where: { studyGroupId: groupId } });
    for (const forum of forums) {
      await Thread.destroy({ where: { forumId: forum.id } });
      await forum.destroy();
    }
    await group.destroy();
    return "success";
  } catch {
    return "error";
  }
};

export const searchUserByUsernameService = async (username) => {
  return await UserModel.findOne({ where: { username }, attributes: ["user_id", "username", "email"] });
};

export const searchGroupByNameService = async (groupname) => {
  return await StudyGroup.findOne({ where: { name: groupname }, attributes: ["id", "name", "creatorId"] });
};
