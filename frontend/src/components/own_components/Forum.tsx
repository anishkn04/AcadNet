import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faPlus, faEye, faReply, faClock, faLock, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { getGroupForumAPI, createThreadAPI, getThreadDetailsAPI, createReplyAPI, likeReplyAPI, dislikeReplyAPI } from '@/services/UserServices';
import type { GroupForum, Thread } from '@/models/User';

interface ForumProps {
  groupCode: string;
}

const Forum = ({ groupCode }: ForumProps) => {
  const [forumData, setForumData] = useState<GroupForum | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [isCreatingReply, setIsCreatingReply] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState<{ [key: number]: boolean }>({});
  const [replyContents, setReplyContents] = useState<{ [key: number]: string }>({});
  const [isSubmittingReply, setIsSubmittingReply] = useState<{ [key: number]: boolean }>({});

  // Early return if no groupCode is provided
  if (!groupCode) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMessage} className="text-blue-500" />
            Discussion Forum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Group code is required to load the forum.</p>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    const fetchForum = async () => {
      try {
        setLoading(true);
        console.log('Fetching forum for group code:', groupCode);
        const { data, status } = await getGroupForumAPI(groupCode);
        console.log('Forum API response:', { data, status });
        if (status === 200 && data.success) {
          console.log('Forum data received:', data.message);
          setForumData(data.message);
        } else {
          console.error('Failed to fetch forum:', data);
          setForumData(null);
        }
      } catch (error) {
        console.error('Failed to fetch forum:', error);
        setForumData(null);
      } finally {
        setLoading(false);
      }
    };

    if (groupCode) {
      fetchForum();
    }
  }, [groupCode]);

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    try {
      setIsCreatingThread(true);
      const { data, status } = await createThreadAPI(groupCode, {
        title: newThreadTitle,
        content: newThreadContent
      });

      if (status === 201 && data.success) {
        // Refresh forum data
        const { data: forumResponse } = await getGroupForumAPI(groupCode);
        if (forumResponse.success) {
          setForumData(forumResponse.message);
        }
        
        setShowCreateThread(false);
        setNewThreadTitle('');
        setNewThreadContent('');
      }
    } catch (error) {
      console.error('Failed to create thread:', error);
    } finally {
      setIsCreatingThread(false);
    }
  };

  const handleThreadClick = async (thread: Thread) => {
    try {
      const { data, status } = await getThreadDetailsAPI(thread.id);
      if (status === 200 && data.success) {
        setSelectedThread(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch thread details:', error);
    }
  };

  const handleCreateReply = async () => {
    if (!newReplyContent.trim() || !selectedThread) return;

    try {
      setIsCreatingReply(true);
      const { data, status } = await createReplyAPI(selectedThread.id, {
        content: newReplyContent
      });

      if (status === 201 && data.success) {
        // Refresh thread details to show new reply
        const { data: threadResponse } = await getThreadDetailsAPI(selectedThread.id);
        if (threadResponse.success) {
          setSelectedThread(threadResponse.message);
        }
        setNewReplyContent('');
      }
    } catch (error) {
      console.error('Failed to create reply:', error);
    } finally {
      setIsCreatingReply(false);
    }
  };

  const handleInlineReply = async (threadId: number) => {
    const content = replyContents[threadId];
    if (!content?.trim()) return;

    try {
      setIsSubmittingReply(prev => ({ ...prev, [threadId]: true }));
      const { data, status } = await createReplyAPI(threadId, {
        content: content.trim()
      });

      if (status === 201 && data.success) {
        // Refresh forum data to show new reply count
        const { data: forumResponse } = await getGroupForumAPI(groupCode);
        if (forumResponse.success) {
          setForumData(forumResponse.message);
        }
        
        // Clear the reply form
        setReplyContents(prev => ({ ...prev, [threadId]: '' }));
        setShowReplyForm(prev => ({ ...prev, [threadId]: false }));
      }
    } catch (error) {
      console.error('Failed to create reply:', error);
    } finally {
      setIsSubmittingReply(prev => ({ ...prev, [threadId]: false }));
    }
  };

  const toggleReplyForm = (threadId: number) => {
    setShowReplyForm(prev => ({
      ...prev,
      [threadId]: !prev[threadId]
    }));
    
    // Initialize reply content if not exists
    if (!replyContents[threadId]) {
      setReplyContents(prev => ({ ...prev, [threadId]: '' }));
    }
  };

  const handleReplyContentChange = (threadId: number, content: string) => {
    setReplyContents(prev => ({ ...prev, [threadId]: content }));
  };

  const handleLikeReply = async (replyId: number) => {
    try {
      await likeReplyAPI(replyId);
      // Refresh thread details to update like counts
      if (selectedThread) {
        const { data: threadResponse } = await getThreadDetailsAPI(selectedThread.id);
        if (threadResponse.success) {
          setSelectedThread(threadResponse.message);
        }
      }
    } catch (error) {
      console.error('Failed to like reply:', error);
    }
  };

  const handleDislikeReply = async (replyId: number) => {
    try {
      await dislikeReplyAPI(replyId);
      // Refresh thread details to update like counts
      if (selectedThread) {
        const { data: threadResponse } = await getThreadDetailsAPI(selectedThread.id);
        if (threadResponse.success) {
          setSelectedThread(threadResponse.message);
        }
      }
    } catch (error) {
      console.error('Failed to dislike reply:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuthorInitials = (username: string, fullName?: string) => {
    if (fullName) {
      const nameParts = fullName.trim().split(' ');
      return nameParts.length >= 2 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : nameParts[0].slice(0, 2).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMessage} className="text-blue-500" />
            Discussion Forum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading forum...</p>
        </CardContent>
      </Card>
    );
  }

  if (!forumData || !forumData.forum) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMessage} className="text-blue-500" />
              <span className="text-base sm:text-lg">Discussion Forum</span>
            </div>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
              onClick={() => setShowCreateThread(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Thread
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8">
            <FontAwesomeIcon icon={faMessage} className="text-gray-400 text-3xl sm:text-4xl mb-4" />
            <p className="text-gray-500 mb-4 text-sm sm:text-base">Welcome to your group's discussion forum!</p>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 px-4">Be the first to start a conversation with your group members.</p>
            <Button onClick={() => setShowCreateThread(true)} className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Start the first discussion
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedThread) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setSelectedThread(null)} variant="outline" className="w-full sm:w-auto">
          ← Back to Forum
        </Button>
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl leading-tight">{selectedThread.title}</CardTitle>
            <CardDescription className="text-sm">
              by {selectedThread.author.fullName || selectedThread.author.username} • {formatDate(selectedThread.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-sm sm:text-base leading-relaxed">{selectedThread.content}</p>
            </div>
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Replies ({selectedThread.replyCount})</h3>
              {selectedThread.replies && selectedThread.replies.length > 0 ? (
                <div className="space-y-4">
                  {selectedThread.replies.map((reply) => (
                    <div key={reply.id} className="border rounded-lg p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                          <AvatarFallback className="bg-gray-500 text-white font-semibold text-xs">
                            {getAuthorInitials(reply.author.username, reply.author.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                            <span className="font-semibold text-sm sm:text-base">{reply.author.fullName || reply.author.username}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{formatDate(reply.created_at)}</span>
                            {reply.isEdited && (
                              <span className="text-xs text-gray-400">(edited)</span>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm sm:text-base mb-3">{reply.content}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <span className="text-xs sm:text-sm text-gray-500">
                              {reply.likeCount} likes
                            </span>
                            <Button 
                              onClick={() => handleLikeReply(reply.id)} 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1 text-xs sm:text-sm"
                            >
                              <FontAwesomeIcon icon={faThumbsUp} className="text-xs" />
                              Like
                            </Button>
                            <Button 
                              onClick={() => handleDislikeReply(reply.id)} 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1 text-xs sm:text-sm"
                            >
                              <FontAwesomeIcon icon={faThumbsDown} className="text-xs" />
                              Dislike
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base">No replies yet.</p>
              )}
            </div>
            <div className="mt-4">
              <h4 className="text-sm sm:text-base font-semibold mb-2">Leave a Reply</h4>
              <textarea
                className="min-h-[60px] sm:min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                placeholder="Write your reply..."
              />
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedThread(null)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateReply}
                  disabled={isCreatingReply || !newReplyContent.trim()}
                  className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto order-1 sm:order-2"
                >
                  {isCreatingReply ? 'Posting...' : 'Post Reply'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
        <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMessage} className="text-blue-500" />
              <span className="text-base sm:text-lg">{forumData && forumData.forum && forumData.forum.name ? forumData.forum.name : 'Discussion Forum'}</span>
            </div>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
              onClick={() => setShowCreateThread(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Thread
            </Button>
          </CardTitle>
          {forumData && forumData.forum && forumData.forum.description && (
            <CardDescription>{forumData.forum.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {forumData && forumData.forum && forumData.forum.threads && forumData.forum.threads.length > 0 ? (
            <div className="space-y-3">
              {(forumData.forum.threads || []).map((thread) => (
                <div key={thread.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div 
                    className="flex items-start gap-2 sm:gap-3 cursor-pointer"
                    onClick={() => handleThreadClick(thread)}
                  >
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                      <AvatarFallback className="bg-blue-500 text-white font-semibold text-xs sm:text-sm">
                        {getAuthorInitials(thread.author.username, thread.author.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <div className="flex items-center gap-1 sm:gap-2">
                          {thread.isPinned && (
                            <span className="text-yellow-500 text-sm">📌</span>
                          )}
                          {thread.isLocked && (
                            <FontAwesomeIcon icon={faLock} className="text-red-500 text-sm" />
                          )}
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg truncate">{thread.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {thread.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                        <span className="truncate">by {thread.author.fullName || thread.author.username}</span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <FontAwesomeIcon icon={faClock} />
                          <span className="hidden sm:inline">{formatDate(thread.created_at)}</span>
                          <span className="sm:hidden">{new Date(thread.created_at).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <FontAwesomeIcon icon={faReply} />
                          {thread.replyCount} replies
                        </span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <FontAwesomeIcon icon={faEye} />
                          {thread.viewCount} views
                        </span>
                        {thread.lastReplyAt && (
                          <span className="hidden lg:flex items-center gap-1 truncate">
                            Last reply: {formatDate(thread.lastReplyAt)}
                            {thread.lastReplier && ` by ${thread.lastReplier.fullName || thread.lastReplier.username}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                    {/* Inline Reply Section */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReplyForm(thread.id);
                        }}
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 w-full sm:w-auto"
                      >
                        <FontAwesomeIcon icon={faReply} />
                        Reply
                      </Button>
                      
                      {/* Quick Stats */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 w-full sm:w-auto justify-center sm:justify-end">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faThumbsUp} className="text-blue-500" />
                          {thread.replyCount > 0 && `${thread.replyCount} ${thread.replyCount === 1 ? 'reply' : 'replies'}`}
                        </span>
                      </div>
                    </div>
                    
                    {/* Reply Form */}
                    {showReplyForm[thread.id] && (
                      <div className="mt-3 space-y-3 bg-gray-50 rounded-lg p-2 sm:p-3">
                        <div className="flex gap-2 sm:gap-3">
                          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                            <AvatarFallback className="bg-blue-500 text-white font-semibold text-xs">
                              You
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <textarea
                              className="w-full rounded-lg border border-gray-300 bg-white px-2 sm:px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm"
                              rows={3}
                              value={replyContents[thread.id] || ''}
                              onChange={(e) => handleReplyContentChange(thread.id, e.target.value)}
                              placeholder={`Reply to ${thread.author.fullName || thread.author.username}...`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                  e.preventDefault();
                                  handleInlineReply(thread.id);
                                }
                              }}
                            />
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                              <span className="text-xs text-gray-400 order-2 sm:order-1">
                                <span className="hidden sm:inline">Press Ctrl+Enter to post</span>
                                <span className="sm:hidden">Tap to post</span>
                              </span>
                              <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReplyForm(prev => ({ ...prev, [thread.id]: false }));
                                    setReplyContents(prev => ({ ...prev, [thread.id]: '' }));
                                  }}
                                  className="flex-1 sm:flex-none"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInlineReply(thread.id);
                                  }}
                                  disabled={isSubmittingReply[thread.id] || !replyContents[thread.id]?.trim()}
                                  className="bg-blue-500 hover:bg-blue-600 flex-1 sm:flex-none"
                                >
                                  {isSubmittingReply[thread.id] ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                      <span className="hidden sm:inline">Posting...</span>
                                      <span className="sm:hidden">...</span>
                                    </>
                                  ) : (
                                    <span>Post Reply</span>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 px-4">
              <FontAwesomeIcon icon={faMessage} className="text-gray-400 text-3xl sm:text-4xl mb-4" />
              <p className="text-gray-500 mb-4 text-sm sm:text-base">No discussions yet in this forum.</p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed">
                Be the first to share your thoughts, ask questions, or start a conversation!<br/>
                <span className="text-xs">💬 Tip: Once discussions start, you can reply directly below each message - just like social media!</span>
              </p>
              <Button onClick={() => setShowCreateThread(true)} className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Start the first discussion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={showCreateThread} onOpenChange={setShowCreateThread}>
        
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-w-[95vw] sm:w-[500px] mx-2">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Create New Thread</DialogTitle>
            <DialogDescription className="text-sm">
              Start a new discussion in the forum.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="Enter thread title..."
                className="text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content" className="text-sm font-medium">Content</Label>
              <textarea
                id="content"
                className="min-h-[100px] sm:min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newThreadContent}
                onChange={(e) => setNewThreadContent(e.target.value)}
                placeholder="Write your message..."
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateThread(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateThread}
              disabled={isCreatingThread || !newThreadTitle.trim() || !newThreadContent.trim()}
              className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto order-1 sm:order-2"
            >
              {isCreatingThread ? 'Creating...' : 'Create Thread'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Forum;
