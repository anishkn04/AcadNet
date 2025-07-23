import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFile, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { addGroupResourcesAPI } from '@/services/UserServices';
import type { topics } from '@/models/User';

interface ResourceUploadProps {
  groupCode: string;
  topics?: topics[];
  onUploadSuccess: () => void;
  onClose: () => void;
  open: boolean;
}

interface SelectedFile {
  file: File;
  id: string;
}

export const ResourceUpload: React.FC<ResourceUploadProps> = ({
  groupCode,
  topics = [],
  onUploadSuccess,
  onClose,
  open
}) => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>();
  const [selectedSubTopicId, setSelectedSubTopicId] = useState<number | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get subtopics for selected topic
  const getSubTopicsForTopic = (topicId: number) => {
    const topic = topics.find(t => parseInt(t.id) === topicId);
    return topic?.subTopics || [];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: SelectedFile[] = Array.from(files).map(file => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleTopicChange = (value: string) => {
    const topicId = parseInt(value);
    setSelectedTopicId(topicId);
    setSelectedSubTopicId(undefined); // Reset subtopic when topic changes
  };

  const handleSubTopicChange = (value: string) => {
    setSelectedSubTopicId(parseInt(value));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setIsUploading(true);
    try {
      const files = selectedFiles.map(sf => sf.file);
      const { data, status } = await addGroupResourcesAPI(
        groupCode, 
        files, 
        selectedTopicId, 
        selectedSubTopicId
      );

      if (status === 201 && data.success) {
        toast.success('Resources uploaded successfully!');
        setSelectedFiles([]);
        setSelectedTopicId(undefined);
        setSelectedSubTopicId(undefined);
        onUploadSuccess();
        onClose();
      } else {
        toast.error(data.message || 'Failed to upload resources');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resources');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'text-red-600 bg-red-50';
      case 'doc':
      case 'docx': return 'text-blue-600 bg-blue-50';
      case 'xls':
      case 'xlsx': return 'text-green-600 bg-green-50';
      case 'ppt':
      case 'pptx': return 'text-orange-600 bg-orange-50';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'text-purple-600 bg-purple-50';
      case 'mp4':
      case 'avi':
      case 'mov': return 'text-pink-600 bg-pink-50';
      case 'mp3':
      case 'wav': return 'text-indigo-600 bg-indigo-50';
      case 'txt': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gray-50">
          <DialogTitle className="text-xl font-bold">Upload Resources</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-4">
          {/* File Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Select Files</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav,.txt"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUpload} />
                Choose Files
              </Button>
              <span className="text-sm text-gray-500">
                Max 10 files, various formats supported
              </span>
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Selected Files ({selectedFiles.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles.map(({ file, id }) => (
                  <div 
                    key={id}
                    className={`flex items-center justify-between p-2 rounded-lg border ${getFileTypeColor(file.name)}`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FontAwesomeIcon icon={faFile} className="flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topic Selection */}
          {topics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Link to Topic (Optional)</Label>
                <Select onValueChange={handleTopicChange} value={selectedTopicId?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map(topic => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTopicId && getSubTopicsForTopic(selectedTopicId).length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Link to Subtopic (Optional)</Label>
                  <Select onValueChange={handleSubTopicChange} value={selectedSubTopicId?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subtopic" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubTopicsForTopic(selectedTopicId).map(subtopic => (
                        <SelectItem key={subtopic.id} value={subtopic.id}>
                          {subtopic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Upload Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="flex items-center gap-2"
            >
              {isUploading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <FontAwesomeIcon icon={faUpload} />
              {isUploading ? 'Uploading...' : 'Upload Resources'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceUpload;
