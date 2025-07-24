import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileArrowUp, 
  faSearch, 
  // faDownload, 
  faEye,
  faFile,
  faImage,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileVideo,
  faFileAudio,
  faFileText,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { LikeDislikeButton } from './LikeDislikeButton';
import ResourceUpload from './ResourceUpload';
import { getGroupResourcesAPI } from '@/services/UserServices';
import type { Resource, topics } from '@/models/User';
import { toast } from 'react-toastify';

interface ResourcesSectionProps {
  groupCode: string;
  topics?: topics[];
  canUpload?: boolean;
  initialResources?: Resource[];
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  groupCode,
  topics = [],
  canUpload = true,
  initialResources = []
}) => {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [filteredResources, setFilteredResources] = useState<Resource[]>(initialResources);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFileType, setFilterFileType] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [resourceStatuses, setResourceStatuses] = useState<Record<number, any>>({});

  // Fetch resources
  const fetchResources = async () => {
    if (!groupCode) return;
    
    setLoading(true);
    try {
      const { data, status } = await getGroupResourcesAPI(groupCode);
      if (status === 200 && data.success) {
        const responseData = data.message || data.data || {};
        // Map backend response to frontend expected format
        const resourcesData = responseData.resources || [];
        const mappedResources = resourcesData.map((resource: any) => ({
          id: resource.id,
          filePath: resource.filePath,
          fileType: resource.fileType,
          likesCount: resource.likesCount || 0,
          dislikesCount: resource.dislikesCount || 0,
          created_at: resource.uploadedAt || resource.created_at,
          linkedTo: {
            topicId: resource.topic?.id || null,
            subTopicId: resource.subTopic?.id || null
          },
          // For backward compatibility
          fileName: resource.fileName || resource.filePath?.split('/').pop() || 'Unknown File'
        }));
        setResources(mappedResources);
        setFilteredResources(mappedResources);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  // Filter resources based on search and filters
  useEffect(() => {
    let filtered = resources;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource => {
        const fileName = resource.fileName || resource.filePath?.split('/').pop() || '';
        return fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               resource.fileType?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // File type filter
    if (filterFileType !== 'all') {
      filtered = filtered.filter(resource =>
        resource.fileType?.toLowerCase() === filterFileType.toLowerCase()
      );
    }

    // Topic filter
    if (filterTopic !== 'all') {
      const topicId = parseInt(filterTopic);
      filtered = filtered.filter(resource =>
        resource.linkedTo?.topicId === topicId
      );
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, filterFileType, filterTopic]);

  // Handle status updates from like/dislike buttons
  const handleStatusUpdate = (resourceId: number, newStatus: { likesCount: number; dislikesCount: number; userReaction: 'like' | 'dislike' | null }) => {
    setResourceStatuses(prev => ({
      ...prev,
      [resourceId]: newStatus
    }));
  };

  // Handle successful upload
  const handleUploadSuccess = () => {
    fetchResources(); // Refresh resources list
    // Removed duplicate toast - it's already shown in ResourceUpload component
  };

  // Get file type icon
  const getFileTypeIcon = (fileType: string) => {
    const type = fileType?.toLowerCase();
    switch (type) {
      case 'pdf': return faFilePdf;
      case 'doc':
      case 'docx': return faFileWord;
      case 'xls':
      case 'xlsx': return faFileExcel;
      case 'ppt':
      case 'pptx': return faFilePowerpoint;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'image': return faImage;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'video': return faFileVideo;
      case 'mp3':
      case 'wav':
      case 'audio': return faFileAudio;
      case 'txt':
      case 'text': return faFileText;
      default: return faFile;
    }
  };

  // Get file type color classes
  // const getFileTypeColors = (fileType: string) => {
  //   const type = fileType?.toLowerCase();
  //   switch (type) {
  //     case 'pdf': return 'bg-red-50 border-red-200 text-red-800';
  //     case 'doc':
  //     case 'docx': return 'bg-blue-50 border-blue-200 text-blue-800';
  //     case 'xls':
  //     case 'xlsx': return 'bg-green-50 border-green-200 text-green-800';
  //     case 'ppt':
  //     case 'pptx': return 'bg-orange-50 border-orange-200 text-orange-800';
  //     case 'jpg':
  //     case 'jpeg':
  //     case 'png':
  //     case 'gif':
  //     case 'image': return 'bg-purple-50 border-purple-200 text-purple-800';
  //     case 'mp4':
  //     case 'avi':
  //     case 'mov':
  //     case 'video': return 'bg-pink-50 border-pink-200 text-pink-800';
  //     case 'mp3':
  //     case 'wav':
  //     case 'audio': return 'bg-indigo-50 border-indigo-200 text-indigo-800';
  //     case 'txt':
  //     case 'text': return 'bg-gray-50 border-gray-200 text-gray-800';
  //     default: return 'bg-gray-50 border-gray-200 text-gray-800';
  //   }
  // };

  // Get unique file types for filter
  const getUniqueFileTypes = () => {
    const types = resources.map(r => r.fileType?.toLowerCase()).filter(Boolean) as string[];
    return [...new Set(types)];
  };

  // Get topic name by ID
  const getTopicName = (topicId: number) => {
    const topic = topics.find(t => parseInt(t.id) === topicId);
    return topic?.title || `Topic ${topicId}`;
  };

  // Get subtopic name by topic ID and subtopic ID
  const getSubTopicName = (topicId: number, subTopicId: number) => {
    const topic = topics.find(t => parseInt(t.id) === topicId);
    const subtopic = topic?.subTopics?.find(st => parseInt(st.id) === subTopicId);
    return subtopic?.title || `Subtopic ${subTopicId}`;
  };

  // Initial load and handle refreshes
  useEffect(() => {
    // Only fetch resources if not passed as initialResources
    if (initialResources.length === 0) {
      fetchResources();
    } else {
      // Map initialResources to ensure proper format
      const mappedInitialResources = initialResources.map(resource => ({
        ...resource,
        fileName: resource.fileName || resource.filePath?.split('/').pop() || 'Unknown File',
        linkedTo: resource.linkedTo || {
          topicId: null,
          subTopicId: null
        }
      }));
      setResources(mappedInitialResources);
      setFilteredResources(mappedInitialResources);
    }
  }, [groupCode, initialResources.length]);

  return (
    <Card className="shadow-lg h-fit">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="font-bold text-2xl">Resources</span>
          <div className="flex gap-2">
            <Button
              onClick={fetchResources}
              disabled={loading}
              className="text-gray-500 bg-transparent hover:bg-gray-50 text-sm"
              variant="ghost"
              size="sm"
            >
              <FontAwesomeIcon icon={faRefresh} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {canUpload && (
              <Button
                onClick={() => setShowUpload(true)}
                className="text-blue-500 bg-transparent hover:bg-blue-50 text-sm"
                variant="ghost"
              >
                <FontAwesomeIcon icon={faFileArrowUp} className="mr-2" />
                Upload
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Search and Filters */}
        <div className="space-y-4 mb-4">
          {/* Search */}
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Select value={filterFileType} onValueChange={setFilterFileType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {getUniqueFileTypes().map(type => (
                  <SelectItem key={type} value={type}>
                    {type?.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {topics.length > 0 && (
              <Select value={filterTopic} onValueChange={setFilterTopic}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map(topic => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Resources List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>Loading resources...</p>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="space-y-3">
            {filteredResources.map((resource, index) => {
              const fileName = resource.filePath.split('/').pop() || resource.filePath;
              const fileType = resource.fileType || 'file';
              
              return (
                <div 
                  key={resource.id || index} 
                  className={`p-3 rounded-lg border hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-3">
                    {/* File Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <FontAwesomeIcon 
                        icon={getFileTypeIcon(fileType)} 
                        className="text-lg"
                      />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <a
                          href={`http://localhost:3000/${resource.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline text-blue-600 truncate"
                        >
                          {fileName}
                        </a>
                        <span className="px-2 py-1 rounded text-xs font-mono bg-white/50">
                          {fileType.toUpperCase()}
                        </span>
                      </div>

                      {/* Topic/Subtopic Info */}
                      {resource.linkedTo?.topicId && (
                        <div className="text-sm text-gray-600 mb-2">
                          📚 Linked to: {getTopicName(resource.linkedTo.topicId)}
                          {resource.linkedTo.subTopicId && (
                            <span className="text-gray-500">
                              {` → ${getSubTopicName(resource.linkedTo.topicId, resource.linkedTo.subTopicId)}`}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions and Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-7 px-2 text-xs"
                          >
                            <a
                              href={`http://localhost:3000/${resource.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <FontAwesomeIcon icon={faEye} />
                              View
                            </a>
                          </Button>
                          
                          {/* <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-7 px-2 text-xs"
                          >
                            <a
                              href={`http://localhost:3000/${resource.filePath}`}
                              download
                              className="flex items-center gap-1"
                            >
                              <FontAwesomeIcon icon={faDownload} />
                              Download
                            </a>
                          </Button> */}
                        </div>

                        {/* Like/Dislike Buttons */}
                        {resource.id && (
                          <LikeDislikeButton
                            resourceId={resource.id}
                            initialLikesCount={resourceStatuses[resource.id]?.likesCount ?? (resource.likesCount || 0)}
                            initialDislikesCount={resourceStatuses[resource.id]?.dislikesCount ?? (resource.dislikesCount || 0)}
                            initialUserReaction={resourceStatuses[resource.id]?.userReaction ?? (resource.userReaction || null)}
                            onStatusUpdate={handleStatusUpdate}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || filterFileType !== 'all' || filterTopic !== 'all' ? (
              <div>
                <p>No resources match your filters.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterFileType('all');
                    setFilterTopic('all');
                  }}
                  className="text-blue-500"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <p>No resources available. {canUpload && 'Upload some resources to get started!'}</p>
            )}
          </div>
        )}
      </CardContent>

      {/* Upload Modal */}
      <ResourceUpload
        groupCode={groupCode}
        topics={topics}
        onUploadSuccess={handleUploadSuccess}
        onClose={() => setShowUpload(false)}
        open={showUpload}
      />
    </Card>
  );
};

export default ResourcesSection;
