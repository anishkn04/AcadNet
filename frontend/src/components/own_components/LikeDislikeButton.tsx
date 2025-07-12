import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { likeResourceAPI, dislikeResourceAPI, getResourceStatusAPI } from '@/services/UserServices';
import { toast } from 'react-toastify';

interface LikeDislikeButtonProps {
  resourceId: number;
  initialLikesCount?: number;
  initialDislikesCount?: number;
  initialUserReaction?: 'like' | 'dislike' | null;
}

export const LikeDislikeButton = ({ 
  resourceId, 
  initialLikesCount = 0, 
  initialDislikesCount = 0, 
  initialUserReaction = null 
}: LikeDislikeButtonProps) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [dislikesCount, setDislikesCount] = useState(initialDislikesCount);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(initialUserReaction);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current status on component mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data, status } = await getResourceStatusAPI(resourceId);
        if (status === 200 && data.success) {
          setLikesCount(data.likesCount || 0);
          setDislikesCount(data.dislikesCount || 0);
          setUserReaction(data.userReaction || null);
        }
      } catch (error) {
        console.error('Failed to fetch resource status:', error);
      }
    };

    fetchStatus();
  }, [resourceId]);

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { data, status } = await likeResourceAPI(resourceId);
      if (status === 200 && data.success) {
        setLikesCount(data.likesCount);
        setDislikesCount(data.dislikesCount);
        setUserReaction(data.userReaction);
        toast.success(data.message || 'Reaction updated successfully');
      }
    } catch (error: any) {
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
        setLikesCount(data.likesCount);
        setDislikesCount(data.dislikesCount);
        setUserReaction(data.userReaction);
        toast.success(data.message || 'Reaction updated successfully');
      }
    } catch (error: any) {
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
        {likesCount}
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
        {dislikesCount}
      </Button>
    </div>
  );
};

export default LikeDislikeButton;
