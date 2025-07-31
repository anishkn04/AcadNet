import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '@/hooks/userInfoContext';
import { getPendingResourcesAPI, approveResourceAPI, rejectResourceAPI, editGroupSyllabusAPI, deleteApprovedResourceAPI } from '@/services/UserServices';
import { toast } from 'react-toastify';
import type { Groups, member, topics, subTopics } from '@/models/User';
import ComplaintsSection from '@/components/own_components/ComplaintsSection';
import VideoPlayerModal from '@/components/own_components/VideoPlayerModal';
import FileViewerModal from '@/components/own_components/FileViewerModal';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const GroupAdmin = () => {
  const { retreiveGroupByCode, removeGroupMember, userId } = useData();
  const [group, setGroup] = useState<Groups | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState<member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceSearchTerm, setResourceSearchTerm] = useState('');
  const [pendingResources, setPendingResources] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  
  // Syllabus state
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [syllabusData, setSyllabusData] = useState<{ topics: topics[] }>({ topics: [] });
  const [isSavingSyllabus, setIsSavingSyllabus] = useState(false);
  
  // Modal state for resource viewing
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [selectedVideoName, setSelectedVideoName] = useState('');
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  
  // Confirmation modal state for member removal
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: number; name: string } | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Confirmation modal state for resource deletion
  const [showDeleteResourceConfirmation, setShowDeleteResourceConfirmation] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeletingResource, setIsDeletingResource] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const groupCode = params.get('code');
    const fetchGroup = async () => {
      if (groupCode) {
        console.log('Fetching group details for code:', groupCode);
        const group = await retreiveGroupByCode(groupCode);
        console.log('Received group data:', group);
        if (group) {
          console.log(group)
          setGroup(group);
          setGroupName(group.name || '');
          setGroupDescription(group.description || '');
          setMembers(group.members || []);
          console.log('Members set:', group.members);
        } else {
          console.log('No group found for code:', groupCode);
          setGroup(null);
          setGroupName('');
          setGroupDescription('');
          setMembers([]);
        }
      } else {
        console.log('No group code provided in URL');
        setGroup(null);
        setGroupName('');
        setGroupDescription('');
        setMembers([]);
      }
    };
    fetchGroup();
  }, [location.search, retreiveGroupByCode]);

  // Fetch pending resources
  useEffect(() => {
    const fetchPendingResources = async () => {
      const params = new URLSearchParams(location.search);
      const groupCode = params.get('code');
      
      if (groupCode) {
        setLoadingPending(true);
        try {
          const { data } = await getPendingResourcesAPI(groupCode);
          if (data.success) {
            const pendingResourcesData = data.message?.pendingResources || data.pendingResources || [];
            setPendingResources(pendingResourcesData);
          }
        } catch (error) {
          console.error('Error fetching pending resources:', error);
          toast.error('Failed to fetch pending resources');
        } finally {
          setLoadingPending(false);
        }
      }
    };

    fetchPendingResources();
  }, [location.search]);

  const handleApproveResource = async (resourceId: number, fileName: string) => {
    const params = new URLSearchParams(location.search);
    const groupCode = params.get('code');
    
    if (!groupCode) return;
    
    try {
      const { data } = await approveResourceAPI(groupCode, resourceId);
      if (data.success) {
        toast.success(`Resource "${fileName}" approved successfully`);
        setPendingResources(prev => prev.filter(r => r.id !== resourceId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve resource');
    }
  };

  const handleRejectResource = async (resourceId: number, fileName: string) => {
    const params = new URLSearchParams(location.search);
    const groupCode = params.get('code');
    
    if (!groupCode) return;
    
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    try {
      const { data } = await rejectResourceAPI(groupCode, resourceId, reason || undefined);
      if (data.success) {
        toast.success(`Resource "${fileName}" rejected successfully`);
        setPendingResources(prev => prev.filter(r => r.id !== resourceId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject resource');
    }
  };

  // Helper function to check if file is video
  const isVideoFile = (fileName: string): boolean => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
    const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return videoExtensions.includes(fileExtension);
  };

  // Handle video file click
  const handleVideoClick = (resource: any) => {
    const videoUrl = `http://localhost:3000/${resource.filePath}`;
    const fileName = resource.filePath.split('/').pop() || resource.filePath;
    setSelectedVideoUrl(videoUrl);
    setSelectedVideoName(fileName);
    setShowVideoModal(true);
  };

  // Handle non-video file click
  const handleFileClick = (resource: any) => {
    const fileUrl = `http://localhost:3000/${resource.filePath}`;
    const fileName = resource.filePath.split('/').pop() || resource.filePath;
    setSelectedFileUrl(fileUrl);
    setSelectedFileName(fileName);
    setSelectedFileType(resource.fileType || 'unknown');
    setShowFileModal(true);
  };

  // Handle resource view - determines if video or file
  const handleViewResource = (resource: any) => {
    const fileName = resource.filePath || resource.fileName || '';
    if (isVideoFile(fileName)) {
      handleVideoClick(resource);
    } else {
      handleFileClick(resource);
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleSave = async () => {
    setEditMode(false);
    alert('Group settings updated! (Note: Backend update endpoint not implemented yet)');
  };

  const handleRemoveMember = async (memberId: number, memberName: string) => {
    // Set up the confirmation modal data
    setMemberToRemove({ id: memberId, name: memberName });
    setShowRemoveConfirmation(true);
  };

  // Handler for confirming member removal
  const handleConfirmRemoveMember = async () => {
    if (!group?.groupCode || !memberToRemove) return;
    
    setIsRemoving(true);
    try {
      const result = await removeGroupMember(group.groupCode, memberToRemove.id);
      if (result.success) {
        setMembers(prev => prev.filter(member => member.userId !== memberToRemove.id));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to remove member');
    } finally {
      setIsRemoving(false);
      setShowRemoveConfirmation(false);
      setMemberToRemove(null);
    }
  };

  // Handler for canceling member removal
  const handleCancelRemoveMember = () => {
    setShowRemoveConfirmation(false);
    setMemberToRemove(null);
  };

  // Resource deletion handlers
  const handleDeleteResource = async (resourceId: number, resourceName: string) => {
    // Set up the confirmation modal data
    setResourceToDelete({ id: resourceId, name: resourceName });
    setShowDeleteResourceConfirmation(true);
  };

  // Handler for confirming resource deletion
  const handleConfirmDeleteResource = async () => {
    if (!group?.groupCode || !resourceToDelete) return;
    
    setIsDeletingResource(true);
    try {
      const { data } = await deleteApprovedResourceAPI(group.groupCode, resourceToDelete.id);
      if (data.success) {
        // Remove the resource from the local state
        setGroup(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            AdditionalResources: prev.AdditionalResources?.filter(resource => resource.id !== resourceToDelete.id) || []
          };
        });
        toast.success(data.message || 'Resource deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete resource');
      }
    } catch (error: any) {
      console.error('Error deleting resource:', error);
      toast.error(error.response?.data?.message || 'Failed to delete resource');
    } finally {
      setIsDeletingResource(false);
      setShowDeleteResourceConfirmation(false);
      setResourceToDelete(null);
    }
  };

  // Handler for canceling resource deletion
  const handleCancelDeleteResource = () => {
    setShowDeleteResourceConfirmation(false);
    setResourceToDelete(null);
  };

  // Syllabus handlers
  const handleEditSyllabus = () => {
    if (group?.syllabus?.topics) {
      // Sort topics by created_at to maintain original order when editing
      const sortedTopics = [...group.syllabus.topics].sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateA.getTime() - dateB.getTime();
      });
      
      // Also sort subtopics within each topic
      const topicsWithSortedSubtopics = sortedTopics.map(topic => ({
        ...topic,
        subTopics: topic.subTopics ? [...topic.subTopics].sort((a: any, b: any) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateA.getTime() - dateB.getTime();
        }) : []
      }));
      
      setSyllabusData({ topics: topicsWithSortedSubtopics });
    }
    setShowSyllabusModal(true);
  };

  const handleSaveSyllabus = async () => {
    const params = new URLSearchParams(location.search);
    const groupCode = params.get('code');
    
    if (!groupCode) {
      toast.error('Group code not found');
      return;
    }

    setIsSavingSyllabus(true);
    try {
      // Add order indices to preserve the exact order from the modal
      const syllabusWithOrder = {
        topics: syllabusData.topics.map((topic, topicIndex) => ({
          ...topic,
          orderIndex: topicIndex, // Add explicit order index
          subTopics: topic.subTopics ? topic.subTopics.map((subtopic, subTopicIndex) => ({
            ...subtopic,
            orderIndex: subTopicIndex // Add explicit order index for subtopics
          })) : []
        }))
      };

      const result = await editGroupSyllabusAPI(groupCode, syllabusWithOrder);
      if (result.data.success) {
        toast.success('Syllabus updated successfully');
        setShowSyllabusModal(false);
        // Refresh the group data
        const updatedGroup = await retreiveGroupByCode(groupCode);
        if (updatedGroup) {
          setGroup(updatedGroup);
        }
      }
    } catch (error: any) {
      console.error('Error updating syllabus:', error);
      toast.error(error?.response?.data?.message || 'Failed to update syllabus');
    } finally {
      setIsSavingSyllabus(false);
    }
  };

  const handleCancelSyllabusEdit = () => {
    setShowSyllabusModal(false);
    setSyllabusData({ topics: [] });
  };

  const addTopic = () => {
    const newTopic: topics = {
      id: Date.now().toString(), // Temporary ID for frontend
      title: '',
      description: '',
      subTopics: []
    };
    setSyllabusData(prev => ({
      topics: [...prev.topics, newTopic]
    }));
  };

  const removeTopic = (topicIndex: number) => {
    setSyllabusData(prev => ({
      topics: prev.topics.filter((_, index) => index !== topicIndex)
    }));
  };

  const updateTopic = (topicIndex: number, field: keyof topics, value: string) => {
    setSyllabusData(prev => ({
      topics: prev.topics.map((topic, index) => 
        index === topicIndex ? { ...topic, [field]: value } : topic
      )
    }));
  };

  const addSubTopic = (topicIndex: number) => {
    const newSubTopic: subTopics = {
      id: Date.now().toString(), // Temporary ID for frontend
      title: '',
      content: ''
    };
    setSyllabusData(prev => ({
      topics: prev.topics.map((topic, index) => 
        index === topicIndex 
          ? { ...topic, subTopics: [...(topic.subTopics || []), newSubTopic] }
          : topic
      )
    }));
  };

  const removeSubTopic = (topicIndex: number, subTopicIndex: number) => {
    setSyllabusData(prev => ({
      topics: prev.topics.map((topic, index) => 
        index === topicIndex 
          ? { ...topic, subTopics: topic.subTopics?.filter((_, subIndex) => subIndex !== subTopicIndex) || [] }
          : topic
      )
    }));
  };

  const updateSubTopic = (topicIndex: number, subTopicIndex: number, field: keyof subTopics, value: string) => {
    setSyllabusData(prev => ({
      topics: prev.topics.map((topic, index) => 
        index === topicIndex 
          ? { 
              ...topic, 
              subTopics: topic.subTopics?.map((subTopic, subIndex) => 
                subIndex === subTopicIndex ? { ...subTopic, [field]: value } : subTopic
              ) || []
            }
          : topic
      )
    }));
  };

 

  const filteredMembers = members.filter(member => {
    if (!searchTerm.trim()) return true; // Show all members if search term is empty
    
    const username = member.UserModel?.username?.toLowerCase() || '';
    const fullName = member.UserModel?.fullName?.toLowerCase() || '';
    const userId = member.userId?.toString() || '';
    const searchLower = searchTerm.toLowerCase().trim();
    
    return username.includes(searchLower) || 
           fullName.includes(searchLower) || 
           userId.includes(searchLower);
  });

  const filteredResources = group?.AdditionalResources?.filter(resource => {
    const resourceName = resource.filePath?.split('/').pop() || '';
    return resourceName.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
           resource.fileType?.toLowerCase().includes(resourceSearchTerm.toLowerCase());
  }) || [];

  const isCreator = Number(group?.creatorId) === Number(userId);

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <p className="text-gray-500 text-center">Group not found or loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 py-3 sm:py-5">
          <div className="layout-content-container flex flex-col w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-4 sm:pb-6">
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 text-xl sm:text-2xl font-bold leading-tight">Study Group Admin Panel</p>
                <p className="text-slate-500 text-sm font-normal leading-normal">Manage group settings, reports, and members.</p>
              </div>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              {/* Group Settings Section */}
              <section>
                <div className="space-y-4 sm:space-y-6 max-w-full lg:max-w-xl">
                  <div>
                    <label className="block text-slate-700 text-sm font-medium leading-normal pb-1.5" htmlFor="groupName">Group Name</label>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-sky-500/50 border border-slate-300 bg-white focus:border-sky-500 h-10 sm:h-11 placeholder:text-slate-400 px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-normal leading-normal shadow-sm"
                      id="groupName"
                      type="text"
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-medium leading-normal pb-1.5" htmlFor="groupDescription">Group Description</label>
                    <textarea
                      className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-sky-500/50 border border-slate-300 bg-white focus:border-sky-500 min-h-20 sm:min-h-24 placeholder:text-slate-400 px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-normal leading-normal shadow-sm"
                      id="groupDescription"
                      placeholder="Enter a brief description of the study group..."
                      rows={3}
                      value={groupDescription}
                      onChange={e => setGroupDescription(e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="flex justify-start">
                    {editMode ? (
                      <button
                        className="flex items-center justify-center overflow-hidden rounded-lg h-9 sm:h-10 px-4 sm:px-5 bg-sky-600 text-white text-sm font-semibold leading-normal tracking-wide shadow-sm hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-150"
                        onClick={handleSave}
                      >
                        <span className="truncate">Save Changes</span>
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center overflow-hidden rounded-lg h-9 sm:h-10 px-4 sm:px-5 bg-gray-300 text-slate-800 text-sm font-semibold leading-normal tracking-wide shadow-sm hover:bg-gray-400 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-150"
                        onClick={handleEdit}
                      >
                        <span className="truncate">Edit</span>
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Syllabus Management Section */}
              <section>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 pb-4">
                  <h2 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight">Syllabus</h2>
                  {isCreator && (
                    <button
                      className="flex items-center justify-center overflow-hidden rounded-lg h-9 sm:h-10 px-4 sm:px-5 bg-blue-600 text-white text-sm font-semibold leading-normal tracking-wide shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150"
                      onClick={handleEditSyllabus}
                    >
                      <span className="material-icons-outlined text-lg mr-2">edit</span>
                      <span className="truncate">Edit Syllabus</span>
                    </button>
                  )}
                </div>
                
                {group?.syllabus?.topics && group.syllabus.topics.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500" scope="col">
                              Topic
                            </th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500" scope="col">
                              Description
                            </th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500" scope="col">
                              Subtopics
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {(() => {
                            // Sort topics by created_at to maintain the original order from creation
                            const sortedTopics = [...group.syllabus.topics].sort((a: any, b: any) => {
                              const dateA = new Date(a.created_at || 0);
                              const dateB = new Date(b.created_at || 0);
                              return dateA.getTime() - dateB.getTime();
                            });
                            
                            return sortedTopics.map((topic: any) => (
                              <tr key={topic.id} className="border-b hover:bg-blue-50">
                                <td className="px-3 sm:px-4 py-3 text-sm font-medium text-slate-800 align-top">
                                  <div className="max-w-xs truncate">{topic.title}</div>
                                </td>
                                <td className="px-3 sm:px-4 py-3 text-sm text-slate-600 align-top">
                                  <div className="max-w-xs">{topic.description || '-'}</div>
                                </td>
                                <td className="px-3 sm:px-4 py-3 text-sm text-slate-600 align-top">
                                  {topic.subTopics && Array.isArray(topic.subTopics) && topic.subTopics.length > 0 ? (
                                    <ul className="list-disc ml-4 space-y-1">
                                      {(() => {
                                        // Sort subtopics by created_at to maintain the original order from creation
                                        const sortedSubTopics = [...topic.subTopics].sort((a: any, b: any) => {
                                          const dateA = new Date(a.created_at || 0);
                                          const dateB = new Date(b.created_at || 0);
                                          return dateA.getTime() - dateB.getTime();
                                        });
                                        
                                        return sortedSubTopics.map((subtopic: any) => (
                                          <li key={subtopic.id} className="mb-1">
                                            <span className="font-semibold text-blue-700">{subtopic.title}</span>
                                            {subtopic.content && (
                                              <span className="text-slate-500 ml-1">({subtopic.content})</span>
                                            )}
                                          </li>
                                        ));
                                      })()}
                                    </ul>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-6 text-center">
                    <div className="text-slate-400 mb-4">
                      <span className="material-icons-outlined text-4xl">menu_book</span>
                    </div>
                    <p className="text-slate-500 text-sm">No syllabus available for this group.</p>
                    {isCreator && (
                      <button
                        className="mt-4 flex items-center justify-center overflow-hidden rounded-lg h-9 sm:h-10 px-4 sm:px-5 bg-blue-600 text-white text-sm font-semibold leading-normal tracking-wide shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150 mx-auto"
                        onClick={handleEditSyllabus}
                      >
                        <span className="material-icons-outlined text-lg mr-2">add</span>
                        <span className="truncate">Add Syllabus</span>
                      </button>
                    )}
                  </div>
                )}
              </section>

              {/* Members Management Section */}
              <section>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 pb-4">
                  <h2 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight">Members</h2>
                  <div className="relative w-full sm:w-auto sm:max-w-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-icons-outlined text-slate-400 text-xl">search</span>
                    </div>
                    <input
                      className="form-input block w-full rounded-lg border border-slate-300 bg-white py-2 sm:py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
                      placeholder="Search by name, username, or user ID..."
                      type="search"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500" scope="col">
                            Name
                          </th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500" scope="col">
                            Role
                          </th>
                          {isCreator && (
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500" scope="col">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {filteredMembers.length === 0 ? (
                          <tr>
                            <td colSpan={isCreator ? 3 : 2} className="px-3 sm:px-4 py-6 text-center text-slate-500 text-sm">
                              {searchTerm ? 'No members found matching your search.' : 'No members in this group yet.'}
                            </td>
                          </tr>
                        ) : (
                          filteredMembers.map((member) => (
                            <tr key={member.id}>
                              <td className="px-3 sm:px-4 py-3 text-sm font-medium text-slate-800">
                                <div className="truncate max-w-xs">
                                  {member.UserModel?.fullName || member.UserModel?.username || 'Unknown'}
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 py-3 text-sm text-slate-600">
                                <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  Number(member.userId) === Number(group.creatorId) 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {Number(member.userId) === Number(group.creatorId) ? 'Creator' : 'Member'}
                                  {member.isAnonymous && ' (Anonymous)'}
                                </span>
                              </td>
                              {isCreator && (
                                <td className="px-3 sm:px-4 py-3 text-sm">
                                  {Number(member.userId) !== Number(group.creatorId) && (
                                    <div className="flex gap-1 sm:gap-2">
                                      <button
                                        className="text-red-600 hover:text-red-800 font-medium text-xs sm:text-sm px-2 py-1 rounded hover:bg-red-50"
                                        onClick={() => handleRemoveMember(member.userId, member.UserModel?.username || 'Unknown')}
                                        disabled={isRemoving}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  )}
                                  {Number(member.userId) === Number(group.creatorId) && (
                                    <span className="text-slate-400 text-xs sm:text-sm">Creator</span>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Resources Section */}
              <section>
                <h3 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight mb-4">Resource Management</h3>
                
                {/* Tab Navigation */}
                <div className="mb-4">
                  <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
                      <button
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === 'approved'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                        onClick={() => setActiveTab('approved')}
                      >
                        Approved Resources ({group?.AdditionalResources?.length || 0})
                      </button>
                      <button
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === 'pending'
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                        onClick={() => setActiveTab('pending')}
                      >
                        Pending Approval ({pendingResources.length})
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                  <label className="flex flex-col w-full">
                    <div className="flex w-full items-stretch rounded-lg shadow-sm border border-slate-300">
                      <div className="text-slate-500 flex bg-slate-50 items-center justify-center pl-3 pr-2 rounded-l-lg border-r border-slate-300">
                        <span className="material-icons-outlined text-xl">search</span>
                      </div>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none bg-white h-10 sm:h-11 placeholder:text-slate-400 px-3 text-sm sm:text-base" 
                        placeholder="Search resources..." 
                        value={resourceSearchTerm}
                        onChange={e => setResourceSearchTerm(e.target.value)}
                      />
                    </div>
                  </label>
                </div>
                
                {/* Resources Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-3 sm:px-4 py-3 sm:py-3.5 text-left text-slate-600 text-xs sm:text-sm font-semibold">Resource Name</th>
                          <th className="px-3 sm:px-4 py-3 sm:py-3.5 text-left text-slate-600 text-xs sm:text-sm font-semibold">Type</th>
                          <th className="px-3 sm:px-4 py-3 sm:py-3.5 text-left text-slate-600 text-xs sm:text-sm font-semibold hidden sm:table-cell">Uploaded By</th>
                          <th className="px-3 sm:px-4 py-3 sm:py-3.5 text-left text-slate-600 text-xs sm:text-sm font-semibold hidden md:table-cell">Uploaded Date</th>
                          <th className="px-3 sm:px-4 py-3 sm:py-3.5 text-left text-slate-600 text-xs sm:text-sm font-semibold">Status</th>
                          <th className="px-3 sm:px-4 py-3 sm:py-3.5 text-left text-slate-600 text-xs sm:text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {activeTab === 'approved' ? (
                          /* Approved Resources */
                          filteredResources.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-3 sm:px-4 py-6 text-center text-slate-500 text-sm">
                                {resourceSearchTerm ? 'No approved resources found matching your search.' : 'No approved resources yet.'}
                              </td>
                            </tr>
                          ) : (
                            filteredResources.map((resource, index) => (
                              <tr key={resource.id || index}>
                                <td className="px-3 sm:px-4 py-3 text-slate-800 text-sm">
                                  <div className="truncate max-w-xs">
                                    {resource.filePath?.split('/').pop() || `Resource ${index + 1}`}
                                  </div>
                                </td>
                                <td className="px-3 sm:px-4 py-3 text-slate-500 text-sm">
                                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {resource.fileType || 'Unknown'}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 py-3 text-slate-500 text-sm hidden sm:table-cell">
                                  <div className="truncate max-w-xs">
                                    {resource.uploader?.username || resource.uploader?.username || 'Unknown'}
                                  </div>
                                </td>
                                <td className="px-3 sm:px-4 py-3 text-slate-500 text-sm hidden md:table-cell">
                                  {new Date(resource.created_at || new Date()).toLocaleDateString()}
                                </td>
                                <td className="px-3 sm:px-4 py-3">
                                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Approved
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 py-3">
                                  <div className="flex space-x-1">
                                    <button 
                                      className="p-1 sm:p-1.5 text-slate-500 hover:text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      title="View Resource"
                                      onClick={() => handleViewResource(resource)}
                                    >
                                      <span className="material-icons-outlined text-lg">visibility</span>
                                    </button>
                                    {isCreator && (
                                      <button 
                                        className="p-1 sm:p-1.5 text-slate-500 hover:text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        title="Delete Resource"
                                        onClick={() => handleDeleteResource(resource.id || 0, resource.fileName || resource.filePath?.split('/').pop() || 'Unknown Resource')}
                                      >
                                        <span className="material-icons-outlined text-lg">delete</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )
                        ) : (
                          /* Pending Resources */
                          loadingPending ? (
                            <tr>
                              <td colSpan={6} className="px-3 sm:px-4 py-6 text-center text-slate-500 text-sm">
                                Loading pending resources...
                              </td>
                            </tr>
                          ) : pendingResources.filter(resource => {
                            const resourceName = resource.fileName || '';
                            return resourceName.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
                                   resource.fileType?.toLowerCase().includes(resourceSearchTerm.toLowerCase());
                          }).length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-3 sm:px-4 py-6 text-center text-slate-500 text-sm">
                                {resourceSearchTerm ? 'No pending resources found matching your search.' : 'No pending resources for approval.'}
                              </td>
                            </tr>
                          ) : (
                            pendingResources
                              .filter(resource => {
                                const resourceName = resource.fileName || '';
                                return resourceName.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
                                       resource.fileType?.toLowerCase().includes(resourceSearchTerm.toLowerCase());
                              })
                              .map((resource, index) => (
                                <tr key={resource.id || index}>
                                  <td className="px-3 sm:px-4 py-3 text-slate-800 text-sm">
                                    <div className="truncate max-w-xs">
                                      {resource.fileName || `Resource ${index + 1}`}
                                    </div>
                                  </td>
                                  <td className="px-3 sm:px-4 py-3 text-slate-500 text-sm">
                                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {resource.fileType || 'Unknown'}
                                    </span>
                                  </td>
                                  <td className="px-3 sm:px-4 py-3 text-slate-500 text-sm hidden sm:table-cell">
                                    <div className="truncate max-w-xs">
                                      {resource.uploader?.username || 'Unknown'}
                                    </div>
                                  </td>
                                  <td className="px-3 sm:px-4 py-3 text-slate-500 text-sm hidden md:table-cell">
                                    {new Date(resource.uploadedAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-3 sm:px-4 py-3">
                                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                      Pending
                                    </span>
                                  </td>
                                  <td className="px-3 sm:px-4 py-3">
                                    <div className="flex space-x-1">
                                      <button 
                                        className="p-1 sm:p-1.5 text-slate-500 hover:text-green-600 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        title="Approve Resource"
                                        onClick={() => handleApproveResource(resource.id, resource.fileName)}
                                      >
                                        <span className="material-icons-outlined text-lg">check_circle</span>
                                      </button>
                                      <button 
                                        className="p-1 sm:p-1.5 text-slate-500 hover:text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        title="Reject Resource"
                                        onClick={() => handleRejectResource(resource.id, resource.fileName)}
                                      >
                                        <span className="material-icons-outlined text-lg">cancel</span>
                                      </button>
                                      <button 
                                        className="p-1 sm:p-1.5 text-slate-500 hover:text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        title="View Resource"
                                        onClick={() => handleViewResource(resource)}
                                      >
                                        <span className="material-icons-outlined text-lg">visibility</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Complaints Section */}
              {group?.groupCode && (
                <ComplaintsSection groupCode={group.groupCode} />
              )}

              {/* Group Details Section */}
              <section>
                <h2 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight pb-4">Group Details</h2>
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm divide-y divide-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 items-center">
                    <p className="text-slate-600 text-sm font-medium">Total Members</p>
                    <p className="text-slate-800 text-sm font-medium sm:col-span-2">{members.length}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 items-center">
                    <p className="text-slate-600 text-sm font-medium">Group Code</p>
                    <p className="text-slate-800 text-sm font-medium sm:col-span-2 break-all">{group.groupCode}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 items-center">
                    <p className="text-slate-600 text-sm font-medium">Total Resources</p>
                    <p className="text-slate-800 text-sm font-medium sm:col-span-2">{group.AdditionalResources?.length || 0}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 items-center">
                    <p className="text-slate-600 text-sm font-medium">Privacy</p>
                    <p className="text-slate-800 text-sm font-medium sm:col-span-2">{group.isPrivate ? 'Private' : 'Public'}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl={selectedVideoUrl}
        fileName={selectedVideoName}
      />

      {/* File Viewer Modal */}
      <FileViewerModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        fileUrl={selectedFileUrl}
        fileName={selectedFileName}
        fileType={selectedFileType}
      />

      {/* Member Removal Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRemoveConfirmation}
        title="Remove Member"
        message={`Are you sure you want to remove ${memberToRemove?.name || 'this member'} from the group? This action cannot be undone.`}
        confirmText="Yes, Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmRemoveMember}
        onCancel={handleCancelRemoveMember}
        isLoading={isRemoving}
        variant="danger"
      />

      {/* Resource Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteResourceConfirmation}
        title="Delete Resource"
        message={`Are you sure you want to delete "${resourceToDelete?.name || 'this resource'}"? This action cannot be undone and the file will be permanently removed.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteResource}
        onCancel={handleCancelDeleteResource}
        isLoading={isDeletingResource}
        variant="danger"
      />

      {/* Syllabus Edit Modal */}
      <Dialog open={showSyllabusModal} onOpenChange={setShowSyllabusModal}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b border-slate-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="material-icons-outlined text-blue-600">menu_book</span>
              Edit Syllabus
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Modify the syllabus structure for your group. Add, remove, or edit topics and subtopics to keep your curriculum organized.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-6">
              {syllabusData.topics.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4">
                    <span className="material-icons-outlined text-6xl">book</span>
                  </div>
                  <p className="text-slate-500 text-lg mb-4">No topics yet</p>
                  <p className="text-slate-400 text-sm mb-6">Start building your syllabus by adding your first topic</p>
                  <Button
                    variant="outline"
                    onClick={addTopic}
                    className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                  >
                    <span className="material-icons-outlined text-sm mr-2">add</span>
                    Add Your First Topic
                  </Button>
                </div>
              ) : (
                syllabusData.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 p-4 rounded-t-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              <span className="material-icons-outlined text-sm mr-1 align-middle">topic</span>
                              Topic Title
                            </label>
                            <input
                              type="text"
                              value={topic.title}
                              onChange={(e) => updateTopic(topicIndex, 'title', e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                              placeholder="Enter topic title..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              <span className="material-icons-outlined text-sm mr-1 align-middle">description</span>
                              Topic Description
                            </label>
                            <textarea
                              value={topic.description}
                              onChange={(e) => updateTopic(topicIndex, 'description', e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm resize-none"
                              placeholder="Enter topic description..."
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Topic {topicIndex + 1}</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTopic(topicIndex)}
                            className="shadow-sm"
                          >
                            <span className="material-icons-outlined text-sm">delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Subtopics Section */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <span className="material-icons-outlined text-sm">list</span>
                          Subtopics
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addSubTopic(topicIndex)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <span className="material-icons-outlined text-sm mr-1">add</span>
                          Add Subtopic
                        </Button>
                      </div>
                      
                      {topic.subTopics && topic.subTopics.length > 0 ? (
                        <div className="space-y-3">
                          {topic.subTopics.map((subtopic, subTopicIndex) => (
                            <div key={subTopicIndex} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors duration-150">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded">
                                    {subTopicIndex + 1}
                                  </span>
                                  <span className="text-xs text-slate-500">Subtopic</span>
                                </div>
                                <input
                                  type="text"
                                  value={subtopic.title}
                                  onChange={(e) => updateSubTopic(topicIndex, subTopicIndex, 'title', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  placeholder="Subtopic title..."
                                />
                                <input
                                  type="text"
                                  value={subtopic.content}
                                  onChange={(e) => updateSubTopic(topicIndex, subTopicIndex, 'content', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  placeholder="Subtopic content..."
                                />
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeSubTopic(topicIndex, subTopicIndex)}
                                className="mt-6"
                              >
                                <span className="material-icons-outlined text-sm">close</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                          <span className="material-icons-outlined text-slate-400 text-4xl block mb-2">list_alt</span>
                          <p className="text-sm text-slate-500 mb-3">No subtopics yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addSubTopic(topicIndex)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <span className="material-icons-outlined text-sm mr-1">add</span>
                            Add First Subtopic
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {/* Add Topic Button */}
              {syllabusData.topics.length > 0 && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={addTopic}
                    className="w-full sm:w-auto bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 shadow-sm"
                  >
                    <span className="material-icons-outlined text-sm mr-2">add</span>
                    Add New Topic
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleCancelSyllabusEdit}
              disabled={isSavingSyllabus}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSyllabus}
              disabled={isSavingSyllabus || syllabusData.topics.length === 0}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              {isSavingSyllabus ? (
                <>
                  <span className="material-icons-outlined text-sm mr-2 animate-spin">sync</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-icons-outlined text-sm mr-2">save</span>
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupAdmin;