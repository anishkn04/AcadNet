// Example integration of new Group Admin features into existing GroupAdmin component
// This shows how to add syllabus editing and resource deletion functionality

import React, { useState } from 'react';
import { editGroupSyllabusAPI, deleteApprovedResourceAPI } from '@/services/UserServices';
import { toast } from 'react-toastify';

// Additional state and handlers to add to the existing GroupAdmin component

export const GroupAdminEnhancements = {
  
  // Additional state variables to add
  additionalState: {
    editingSyllabus: false,
    syllabusData: null as any,
    showSyllabusModal: false,
  },

  // Syllabus editing modal component
  SyllabusEditModal: ({ group, isOpen, onClose, onSave }: any) => {
    const [topics, setTopics] = useState(group?.syllabus?.topics || []);
    const [loading, setLoading] = useState(false);

    const addTopic = () => {
      setTopics([...topics, {
        title: '',
        description: '',
        subTopics: []
      }]);
    };

    const addSubTopic = (topicIndex: number) => {
      const newTopics = [...topics];
      newTopics[topicIndex].subTopics.push({
        title: '',
        content: ''
      });
      setTopics(newTopics);
    };

    const updateTopic = (index: number, field: string, value: string) => {
      const newTopics = [...topics];
      newTopics[index][field] = value;
      setTopics(newTopics);
    };

    const updateSubTopic = (topicIndex: number, subTopicIndex: number, field: string, value: string) => {
      const newTopics = [...topics];
      newTopics[topicIndex].subTopics[subTopicIndex][field] = value;
      setTopics(newTopics);
    };

    const removeTopic = (index: number) => {
      setTopics(topics.filter((_: any, i: number) => i !== index));
    };

    const removeSubTopic = (topicIndex: number, subTopicIndex: number) => {
      const newTopics = [...topics];
      newTopics[topicIndex].subTopics = newTopics[topicIndex].subTopics.filter((_: any, i: number) => i !== subTopicIndex);
      setTopics(newTopics);
    };

    const handleSave = async () => {
      if (!group?.groupCode) return;
      
      // Validate topics
      const validTopics = topics.filter((topic: any) => topic.title.trim());
      if (validTopics.length === 0) {
        toast.error('Please add at least one topic with a title');
        return;
      }

      setLoading(true);
      try {
        const syllabusData = { topics: validTopics };
        await editGroupSyllabusAPI(group.groupCode, syllabusData);
        toast.success('Syllabus updated successfully!');
        onSave();
        onClose();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to update syllabus');
      } finally {
        setLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Edit Syllabus</h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700"
              >
                <span className="material-icons-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {topics.map((topic: any, topicIndex: number) => (
                <div key={topicIndex} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-slate-700">Topic {topicIndex + 1}</h3>
                    <button
                      onClick={() => removeTopic(topicIndex)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove Topic"
                    >
                      <span className="material-icons-outlined">delete</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Topic Title *
                      </label>
                      <input
                        type="text"
                        value={topic.title}
                        onChange={(e) => updateTopic(topicIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter topic title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Topic Description
                      </label>
                      <textarea
                        value={topic.description || ''}
                        onChange={(e) => updateTopic(topicIndex, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter topic description"
                        rows={3}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700">
                          Subtopics
                        </label>
                        <button
                          onClick={() => addSubTopic(topicIndex)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          + Add Subtopic
                        </button>
                      </div>

                      {topic.subTopics?.map((subTopic: any, subTopicIndex: number) => (
                        <div key={subTopicIndex} className="border border-slate-100 rounded p-3 mb-3 bg-slate-50">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-slate-600">
                              Subtopic {subTopicIndex + 1}
                            </span>
                            <button
                              onClick={() => removeSubTopic(topicIndex, subTopicIndex)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              <span className="material-icons-outlined text-lg">delete</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            <input
                              type="text"
                              value={subTopic.title}
                              onChange={(e) => updateSubTopic(topicIndex, subTopicIndex, 'title', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Subtopic title"
                            />
                            <textarea
                              value={subTopic.content || ''}
                              onChange={(e) => updateSubTopic(topicIndex, subTopicIndex, 'content', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Subtopic content"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addTopic}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Add New Topic
              </button>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  // Handler functions to add to the component
  handlers: {
    
    // Handle resource deletion with confirmation
    handleDeleteResource: async (groupCode: string, resourceId: number, resourceName: string, onSuccess: () => void) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${resourceName}"?\n\nThis action cannot be undone and will permanently remove the file from the server.`
      );
      
      if (!confirmed) return;

      try {
        await deleteApprovedResourceAPI(groupCode, resourceId);
        toast.success('Resource deleted successfully!');
        onSuccess(); // Callback to refresh the resources list
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete resource');
        console.error('Resource deletion error:', error);
      }
    },

    // Handle syllabus editing
    handleEditSyllabus: (setSyllabusModalOpen: (open: boolean) => void) => {
      setSyllabusModalOpen(true);
    },

    // Check if user has admin permissions
    hasAdminPermissions: (group: any, userId: string) => {
      if (!group || !userId) return false;
      
      // Check if user is group creator
      if (group.creatorId === userId) return true;
      
      // Check if user has admin role
      const userMembership = group.members?.find((member: any) => member.userId === userId);
      return userMembership?.role === 'admin';
    }
  }
};

// Example of how to integrate into the existing component:
/*
// Add these to the existing GroupAdmin component:

// 1. Add to imports:
import { editGroupSyllabusAPI, deleteApprovedResourceAPI } from '@/services/UserServices';
import { GroupAdminEnhancements } from './GroupAdminEnhancements';

// 2. Add to state:
const [showSyllabusModal, setShowSyllabusModal] = useState(false);

// 3. Add to JSX where you want the syllabus edit button:
{GroupAdminEnhancements.handlers.hasAdminPermissions(group, userId) && (
  <button
    onClick={() => GroupAdminEnhancements.handlers.handleEditSyllabus(setShowSyllabusModal)}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    Edit Syllabus
  </button>
)}

// 4. Add to JSX for resource delete buttons:
{GroupAdminEnhancements.handlers.hasAdminPermissions(group, userId) && (
  <button
    onClick={() => GroupAdminEnhancements.handlers.handleDeleteResource(
      group.groupCode,
      resource.id,
      resource.fileName,
      () => {
        // Refresh resources callback
        fetchResources();
      }
    )}
    className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
    title="Delete Resource"
  >
    <span className="material-icons-outlined text-lg">delete</span>
  </button>
)}

// 5. Add modal to JSX:
<GroupAdminEnhancements.SyllabusEditModal
  group={group}
  isOpen={showSyllabusModal}
  onClose={() => setShowSyllabusModal(false)}
  onSave={() => {
    // Refresh group data callback
    fetchGroup();
  }}
/>
*/
