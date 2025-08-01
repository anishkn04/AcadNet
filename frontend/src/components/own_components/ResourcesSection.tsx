import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faRefresh,
  faPlay,
  // faFlag
} from "@fortawesome/free-solid-svg-icons";
import { LikeDislikeButton } from "./LikeDislikeButton";
import ResourceUpload from "./ResourceUpload";
import VideoPlayerModal from "./VideoPlayerModal";
import FileViewerModal from "./FileViewerModal";
// import ReportResourceModal from './ReportResourceModal';
import { getGroupResourcesAPI } from "@/services/UserServices";
import type { Resource, topics } from "@/models/User";
import { toast } from "@/utils/toast";
import { useData } from "@/hooks/userInfoContext";

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
  initialResources = [],
}) => {
  const { userId } = useData();
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [filteredResources, setFilteredResources] =
    useState<Resource[]>(initialResources);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFileType, setFilterFileType] = useState<string>("all");
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [filterUploader, setFilterUploader] = useState<string>("all");
  const [resourceStatuses, setResourceStatuses] = useState<Record<number, any>>(
    {}
  );

  // Video player modal state
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [selectedVideoName, setSelectedVideoName] = useState("");

  // File viewer modal state
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");

  // // Report resource modal state
  // const [showReportModal, setShowReportModal] = useState(false);
  // const [selectedResourceForReport, setSelectedResourceForReport] = useState<{id: number; name: string} | null>(null);

  // Helper function to sort resources by creation date (newest first)
  const sortResourcesByDate = (resources: Resource[]) => {
    return [...resources].sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime(); // Newest first
    });
  };

  // Fetch resources
  const fetchResources = async () => {
    if (!groupCode) return;

    setLoading(true);
    try {
      const { data, status } = await getGroupResourcesAPI(groupCode);
      if (status === 200 && data.success) {
        console.log("raw data:", data);
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
          // Add uploader information
          uploader: resource.uploader
            ? {
                id: resource.uploader.id || resource.uploadedBy,
                username: resource.uploader.username || "Unknown",
                fullName: resource.uploader.fullName || "Unknown",
              }
            : {
                id: resource.uploadedBy || 0,
                username: "Unknown",
                fullName: "Unknown",
              },
          linkedTo: {
            topicId: resource.topic?.id || null,
            subTopicId: resource.subTopic?.id || null,
          },
          // For backward compatibility
          fileName:
            resource.fileName ||
            resource.filePath?.split("/").pop() ||
            "Unknown File",
        }));
        console.log(mappedResources);
        // Sort resources to ensure consistent ordering
        const sortedResources = sortResourcesByDate(mappedResources);
        setResources(sortedResources);
        setFilteredResources(sortedResources);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  // Filter resources based on search and filters
  useEffect(() => {
    let filtered = resources;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((resource) => {
        const fileName =
          resource.fileName || resource.filePath?.split("/").pop() || "";
        return (
          fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.fileType?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // File type filter
    if (filterFileType !== "all") {
      filtered = filtered.filter(
        (resource) =>
          resource.fileType?.toLowerCase() === filterFileType.toLowerCase()
      );
    }

    // Topic filter
    if (filterTopic !== "all") {
      const topicId = parseInt(filterTopic);
      filtered = filtered.filter(
        (resource) => resource.linkedTo?.topicId === topicId
      );
    }

    // Uploader filter - NEW
    if (filterUploader === "mine") {
      filtered = filtered.filter(
        (resource) => resource.uploader?.id === userId
      );
    }

    // Apply consistent sorting to filtered results
    const sortedFiltered = sortResourcesByDate(filtered);
    setFilteredResources(sortedFiltered);
  }, [
    resources,
    searchTerm,
    filterFileType,
    filterTopic,
    filterUploader,
    userId,
  ]);

  // Handle status updates from like/dislike buttons
  const handleStatusUpdate = (
    resourceId: number,
    newStatus: {
      likesCount: number;
      dislikesCount: number;
      userReaction: "like" | "dislike" | null;
    }
  ) => {
    setResourceStatuses((prev) => ({
      ...prev,
      [resourceId]: newStatus,
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

    // Handle mimetype format (e.g., 'video/mp4', 'image/jpeg')
    if (type?.startsWith("video/")) return faFileVideo;
    if (type?.startsWith("audio/")) return faFileAudio;
    if (type?.startsWith("image/")) return faImage;
    if (type?.includes("pdf")) return faFilePdf;
    if (type?.includes("word") || type?.includes("document")) return faFileWord;
    if (type?.includes("sheet") || type?.includes("excel")) return faFileExcel;
    if (type?.includes("presentation") || type?.includes("powerpoint"))
      return faFilePowerpoint;
    if (type?.includes("text/plain")) return faFileText;

    // Handle processed file type format (e.g., 'video', 'pdf')
    switch (type) {
      case "pdf":
        return faFilePdf;
      case "doc":
      case "docx":
        return faFileWord;
      case "xls":
      case "xlsx":
        return faFileExcel;
      case "ppt":
      case "pptx":
        return faFilePowerpoint;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "image":
        return faImage;
      case "mp4":
      case "avi":
      case "mov":
      case "video":
        return faFileVideo;
      case "mp3":
      case "wav":
      case "audio":
        return faFileAudio;
      case "txt":
      case "text":
        return faFileText;
      default:
        return faFile;
    }
  };

  // Get unique file types for filter
  const getUniqueFileTypes = () => {
    const types = resources
      .map((r) => r.fileType?.toLowerCase())
      .filter(Boolean) as string[];
    return [...new Set(types)];
  };

  // Get topic name by ID
  const getTopicName = (topicId: number) => {
    const topic = topics.find((t) => parseInt(t.id) === topicId);
    return topic?.title || `Topic ${topicId}`;
  };

  // Get subtopic name by topic ID and subtopic ID
  const getSubTopicName = (topicId: number, subTopicId: number) => {
    const topic = topics.find((t) => parseInt(t.id) === topicId);
    const subtopic = topic?.subTopics?.find(
      (st) => parseInt(st.id) === subTopicId
    );
    return subtopic?.title || `Subtopic ${subTopicId}`;
  };

  // Check if file is a video
  const isVideoFile = (fileType: string) => {
    if (!fileType) return false;

    const videoTypes = [
      "mp4",
      "avi",
      "mov",
      "mkv",
      "webm",
      "video",
      "wmv",
      "flv",
      "m4v",
      "ogv",
      "3gp",
    ];
    const lowerFileType = fileType?.toLowerCase();

    // Check for processed file type (like 'video') or file extensions (like 'mp4')
    if (videoTypes.includes(lowerFileType)) {
      return true;
    }

    // Check for mimetype format (like 'video/mp4')
    if (lowerFileType?.startsWith("video/")) {
      return true;
    }

    // Check if the file type contains video-related keywords
    if (lowerFileType?.includes("video")) {
      return true;
    }

    return false;
  };

  // Handle video file click
  const handleVideoClick = (resource: Resource) => {
    const videoUrl = `http://localhost:3000/${resource.filePath}`;
    const fileName = resource.filePath.split("/").pop() || resource.filePath;
    setSelectedVideoUrl(videoUrl);
    setSelectedVideoName(fileName);
    setShowVideoModal(true);
  };

  // Handle non-video file click
  const handleFileClick = (resource: Resource) => {
    const fileUrl = `http://localhost:3000/${resource.filePath}`;
    const fileName = resource.filePath.split("/").pop() || resource.filePath;
    setSelectedFileUrl(fileUrl);
    setSelectedFileName(fileName);
    setSelectedFileType(resource.fileType || "unknown");
    setShowFileModal(true);
  };

  // // Handle report resource
  // const handleReportResource = (resource: Resource) => {
  //   const fileName = resource.filePath.split('/').pop() || resource.filePath;
  //   setSelectedResourceForReport({
  //     id: resource.id || 0,
  //     name: fileName
  //   });
  //   setShowReportModal(true);
  // };

  // Handle close report modal
  // const handleCloseReportModal = () => {
  //   setShowReportModal(false);
  //   setSelectedResourceForReport(null);
  // };

  // Initial load and handle refreshes
  useEffect(() => {
    // Only fetch resources if not passed as initialResources
    if (initialResources.length === 0) {
      fetchResources();
    } else {
      // Map initialResources to ensure proper format
      const mappedInitialResources = initialResources.map((resource) => ({
        ...resource,
        fileName:
          resource.fileName ||
          resource.filePath?.split("/").pop() ||
          "Unknown File",
        linkedTo: resource.linkedTo || {
          topicId: (resource as any).topicId || null,
          subTopicId: (resource as any).subTopicId || null,
        },
      }));

      // Sort initial resources to ensure consistent ordering
      const sortedInitialResources = sortResourcesByDate(
        mappedInitialResources
      );
      setResources(sortedInitialResources);
      setFilteredResources(sortedInitialResources);
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
              <FontAwesomeIcon
                icon={faRefresh}
                className={`mr-2 ${loading ? "animate-spin" : ""}`}
              />
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
        {/* Anonymous User Info */}
        {!canUpload && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-amber-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-800">
                  <strong>Anonymous Member:</strong> You can view, but cannot
                  upload new ones.
                </p>
              </div>
            </div>
          </div>
        )}

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
          <div className="flex gap-2">
            <Select value={filterFileType} onValueChange={setFilterFileType}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {getUniqueFileTypes().map((type) => (
                  <SelectItem key={type} value={type}>
                    {type?.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {topics.length > 0 && (
              <Select value={filterTopic} onValueChange={setFilterTopic}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* NEW: My uploads filter */}
            <Select value={filterUploader} onValueChange={setFilterUploader}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Uploads</SelectItem>
                <SelectItem value="mine">My Uploads</SelectItem>
              </SelectContent>
            </Select>
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
              const fileName =
                resource.filePath.split("/").pop() || resource.filePath;
              const fileType = resource.fileType || "file";

              // Additional check: extract extension from filename if fileType is not helpful
              const fileExtension = fileName.split(".").pop()?.toLowerCase();
              const isVideo =
                isVideoFile(fileType) ||
                (fileExtension && isVideoFile(fileExtension));

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
                        <span className="font-medium text-gray-800 truncate cursor-default">
                          {fileName}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-mono bg-white/50">
                          {fileType.toUpperCase()}
                        </span>
                      </div>

                      {/* Topic/Subtopic Info */}
                      {resource.linkedTo?.topicId && (
                        <div className="text-sm text-gray-600 mb-2">
                          📚 Linked to:{" "}
                          {getTopicName(resource.linkedTo.topicId)}
                          {resource.linkedTo.subTopicId && (
                            <span className="text-gray-500">
                              {` → ${getSubTopicName(
                                resource.linkedTo.topicId,
                                resource.linkedTo.subTopicId
                              )}`}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions and Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isVideo ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVideoClick(resource)}
                              className="h-7 px-2 text-xs"
                            >
                              <FontAwesomeIcon icon={faPlay} className="mr-1" />
                              Play
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileClick(resource)}
                              className="h-7 px-2 text-xs"
                            >
                              <FontAwesomeIcon icon={faEye} />
                              View
                            </Button>
                          )}

                          {/* Report Button - Only show for resources not owned by current user */}
                          {/* {resource.uploader?.id !== Number(userId) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReportResource(resource)}
                              className="h-7 px-2 text-xs ml-2 text-red-600 border-red-300 hover:bg-red-50"
                              title="Report this resource"
                            >
                              <FontAwesomeIcon icon={faFlag} />
                            </Button>
                          )} */}

                          {/* Add uploader info */}
                          <span className="text-xs text-gray-500 ml-2">
                            Uploaded by:{" "}
                            <span className="font-medium">
                              {resource.uploader?.username || "Unknown"}
                            </span>
                          </span>
                        </div>

                        {/* Like/Dislike Buttons */}
                        {resource.id && (
                          <LikeDislikeButton
                            resourceId={resource.id}
                            initialLikesCount={
                              resourceStatuses[resource.id]?.likesCount ??
                              (resource.likesCount || 0)
                            }
                            initialDislikesCount={
                              resourceStatuses[resource.id]?.dislikesCount ??
                              (resource.dislikesCount || 0)
                            }
                            initialUserReaction={
                              resourceStatuses[resource.id]?.userReaction ??
                              (resource.userReaction || null)
                            }
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
            {searchTerm ||
            filterFileType !== "all" ||
            filterTopic !== "all" ||
            filterUploader !== "all" ? (
              <div>
                <p>No resources match your filters.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterFileType("all");
                    setFilterTopic("all");
                    setFilterUploader("all");
                  }}
                  className="text-blue-500"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <p>
                No resources available.{" "}
                {canUpload && "Upload some resources to get started!"}
              </p>
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

      {/* Report Resource Modal
      <ReportResourceModal
        isOpen={showReportModal}
        onClose={handleCloseReportModal}
        resourceId={selectedResourceForReport?.id || 0}
        resourceName={selectedResourceForReport?.name || ''}
        groupCode={groupCode}
      /> */}
    </Card>
  );
};

export default ResourcesSection;
