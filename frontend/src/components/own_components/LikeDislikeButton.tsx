import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { likeResourceAPI, dislikeResourceAPI, getResourceStatusAPI } from '@/services/UserServices';
import { toast } from "@/utils/toast";

interface LikeDislikeButtonProps {
  resourceId: number;
  initialLikesCount?: number;
  initialDislikesCount?: number;
  initialUserReaction?: 'like' | 'dislike' | null;
  onStatusUpdate?: (resourceId: number, newStatus: { likesCount: number; dislikesCount: number; userReaction: 'like' | 'dislike' | null }) => void;
}

export const LikeDislikeButton = ({ 
  resourceId, 
  initialLikesCount = 0, 
  initialDislikesCount = 0, 
  initialUserReaction = null,
  onStatusUpdate 
}: LikeDislikeButtonProps) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [dislikesCount, setDislikesCount] = useState(initialDislikesCount);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(initialUserReaction);
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when props change (from parent updates)
  useEffect(() => {
    if (initialLikesCount !== undefined) setLikesCount(initialLikesCount);
    if (initialDislikesCount !== undefined) setDislikesCount(initialDislikesCount);
    if (initialUserReaction !== undefined) setUserReaction(initialUserReaction);
  }, [initialLikesCount, initialDislikesCount, initialUserReaction]);

  // Helper function to fetch and update status
  const fetchAndUpdateStatus = async () => {
    try {
      const { data, status } = await getResourceStatusAPI(resourceId);
      if (status === 200 && data.success) {
        // The API returns { resource: {...}, userReaction: ... }
        const resourceData = data.message.resource;
        const userReaction = data.message.userReaction;
        
        const newStatus = {
          likesCount: resourceData.likesCount || 0,
          dislikesCount: resourceData.dislikesCount || 0,
          userReaction: userReaction
        };
        
        setLikesCount(newStatus.likesCount);
        setDislikesCount(newStatus.dislikesCount);
        setUserReaction(newStatus.userReaction);
        
        // Notify parent component of the status update
        if (onStatusUpdate) {
          onStatusUpdate(resourceId, newStatus);
        }
        
        return newStatus;
      }
    } catch (error) {
      console.error('Failed to fetch resource status:', error);
    }
    return null;
  };

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { data, status } = await likeResourceAPI(resourceId);
      if (status === 200 && data.success) {
        // Fetch updated status after like action
        await fetchAndUpdateStatus();
        // toast.success(data.message || 'Reaction updated successfully');
      }
    } catch (error: unknown) {
      console.error('Failed to like resource:', error);
      toast.error('Failed to update reaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { data, status } = await dislikeResourceAPI(resourceId);
      if (status === 200 && data.success) {
        // Fetch updated status after dislike action
        await fetchAndUpdateStatus();
        // toast.success(data.message || 'Reaction updated successfully');
      }
    } catch (error: unknown) {
      console.error('Failed to dislike resource:', error);
      toast.error('Failed to update reaction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 ml-auto">
      <Button
        variant={userReaction === 'like' ? 'default' : 'outline'}
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={`text-xs px-2 py-1 h-auto ${
          userReaction === 'like' 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'hover:bg-green-50 hover:text-green-600'
        }`}
      >
        <FontAwesomeIcon 
          icon={faThumbsUp} 
          className={`w-3 h-3 mr-1 ${userReaction === 'like' ? 'text-white' : 'text-green-600'}`} 
        />
        {likesCount > 0 && likesCount}
      </Button>
      
      <Button
        variant={userReaction === 'dislike' ? 'default' : 'outline'}
        size="sm"
        onClick={handleDislike}
        disabled={isLoading}
        className={`text-xs px-2 py-1 h-auto ${
          userReaction === 'dislike' 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'hover:bg-red-50 hover:text-red-600'
        }`}
      >
        <FontAwesomeIcon 
          icon={faThumbsDown} 
          className={`w-3 h-3 mr-1 ${userReaction === 'dislike' ? 'text-white' : 'text-red-600'}`} 
        />
        {dislikesCount > 0 && dislikesCount}
      </Button>
    </div>
  );
};

export default LikeDislikeButton;
