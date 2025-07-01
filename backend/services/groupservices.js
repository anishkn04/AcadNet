import StudyGroup from "../models/studyGroup.model.js"
import throwWithCode from "../utils/errorthrow.js";

export const getAllGroups= async (req)=>{
    try{
        const publicGroups = await StudyGroup.findAll({
      where: {
        isPrivate: false
      }
    });
    return publicGroups
      }catch(error){
    throwWithCode("Can't Get Response",400)
}
}
export const createStudyGroupWithSyllabus = async (creatorId, groupData, syllabusTopicsData) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();


        const creator = await UserModel.findByPk(creatorId, { transaction });
        if (!creator) {
            throwWithCode('Creator user not found.', 404);
        }


        if (!syllabusTopicsData || !Array.isArray(syllabusTopicsData) || syllabusTopicsData.length === 0) {
            throwWithCode('Syllabus must contain at least one topic.', 400);
        }

        for (const topic of syllabusTopicsData) {
            if (!topic.title) {
                throwWithCode('Each topic must have a title.', 400);
            }
            if (!topic.subTopics || !Array.isArray(topic.subTopics) || topic.subTopics.length === 0) {
                throwWithCode(`Topic "${topic.title}" must contain at least one subtopic.`, 400);
            }
            for (const subTopic of topic.subTopics) {
                if (!subTopic.title) {
                    throwWithCode('Each subtopic must have a title.', 400);
                }
            }
        }

     
        const newGroup = await StudyGroup.create({
            name: groupData.name,
            description: groupData.description || null,
            creatorId: creatorId,
            isPrivate: groupData.isPrivate || false,
        
        }, { transaction });


        const newSyllabus = await Syllabus.create({
            studyGroupId: newGroup.id,
        }, { transaction });

        const createdTopics = [];


        for (const topicData of syllabusTopicsData) {
            const newTopic = await Topic.create({
                syllabusId: newSyllabus.id,
                title: topicData.title,
                description: topicData.description || null,
            }, { transaction });

            const createdSubTopics = [];
            for (const subTopicData of topicData.subTopics) {
                const newSubTopic = await SubTopic.create({
                    topicId: newTopic.id,
                    title: subTopicData.title,
                    content: subTopicData.content || null,
                }, { transaction });
                createdSubTopics.push(newSubTopic.toJSON()); 
            }
            createdTopics.push({ ...newTopic.toJSON(), subTopics: createdSubTopics });
        }

        await transaction.commit();


        return {
            ...newGroup.toJSON(),
            syllabus: {
                ...newSyllabus.toJSON(),
                topics: createdTopics,
            },
        };

    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }

        throw error;
    }
};
