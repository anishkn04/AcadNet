
import UserModel from '../models/user.model.js';
import StudyGroup from '../models/studyGroup.model.js';
import Membership from '../models/membership.model.js';
import AdditionalResource from '../models/additionalResources.model.js';
import ResourceLike from '../models/resourceLike.model.js';
import UserReport from '../models/userReport.model.js';
import Forum from '../models/forum.model.js';
import Thread from '../models/thread.model.js';
import Reply from '../models/reply.model.js';
import ReplyLike from '../models/replyLike.model.js';
import sequelize from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { throwWithCode } from '../utils/errorthrow.js';
import { Op } from 'sequelize';


export const deleteUserAccount = async (userId) => {
    const transaction = await sequelize.transaction();
    try {
        const user = await UserModel.findByPk(userId);
        if (!user) {
            throwWithCode('User not found.', 404);
        }

        // Delete user's resources and their physical files
        const resources = await AdditionalResource.findAll({ where: { uploadedBy: userId }, transaction });
        for (const resource of resources) {
            if (fs.existsSync(resource.filePath)) {
                fs.unlinkSync(resource.filePath);
            }
            await resource.destroy({ transaction });
        }

        // Delete user's likes on resources
        await ResourceLike.destroy({ where: { userId: userId }, transaction });

        // Handle study groups created by the user
        const createdGroups = await StudyGroup.findAll({ where: { creatorId: userId }, transaction });
        for (const group of createdGroups) {
            const groupResources = await AdditionalResource.findAll({ where: { studyGroupId: group.id }, transaction });
            for (const resource of groupResources) {
                if (fs.existsSync(resource.filePath)) {
                    fs.unlinkSync(resource.filePath);
                }
                await resource.destroy({ transaction });
            }
            await Membership.destroy({ where: { studyGroupId: group.id }, transaction });
            await group.destroy({ transaction });
        }

        // Remove user from any groups they are a member of
        await Membership.destroy({ where: { userId: userId }, transaction });

        // Delete user's forum threads and replies
        await Reply.destroy({ where: { userId: userId }, transaction });
        await Thread.destroy({ where: { userId: userId }, transaction });

        // Delete user's reports
        await UserReport.destroy({ where: { [Op.or]: [{ reporterId: userId }, { reportedUserId: userId }] }, transaction });

        // Delete forum likes
        await ReplyLike.destroy({ where: { userId: userId }, transaction });

        // Finally, delete the user
        await user.destroy({ transaction });

        await transaction.commit();
        return { message: 'Your account and all related data have been deleted successfully.' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
