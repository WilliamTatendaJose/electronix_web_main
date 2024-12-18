/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Reply, Send, Loader2 } from 'lucide-react';
import client from '@/lib/client';

interface Comment {
  _id: string;
  _key?: string;
  author: {
    name: string;
    email: string;
    image?: string;
  };
  content: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
  createdAt: string;
}

interface CommentProps {
  postId: string;
  initialComments?: Comment[];
}

export function Comments({ postId, initialComments = [] }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: '',
  });
  const [replyStates, setReplyStates] = useState<{ [key: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reactionLoading, setReactionLoading] = useState<{[key: string]: boolean}>({});

  // Fetch comments for specific post
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);

      const query = `*[_type == "post" && _id == $postId][0]{
        "comments": comments[]{
          _id,
          author {
            name,
            email,
            image
          },
          content,
          likes,
          dislikes,
          createdAt,
          "replies": replies[]{
            _id,
            author {
              name,
              email,
              image
            },
            content,
            likes,
            dislikes,
            createdAt
          }
        }
      }`;

      try {
        const result = await client.fetch(query, { postId });
        setComments(result?.comments || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) fetchComments();
  }, [postId]);

  // Submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const commentDoc: Comment = {
        _id: new Date().toISOString(),
        author: {
          name: newComment.name,
          email: newComment.email,
        },
        content: newComment.content,
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString()
      };

      // Update in Sanity with the correct structure
      await client
        .patch(postId)
        .setIfMissing({ comments: [] })
        .append('comments', [{
          _type: 'comment',
          _key: commentDoc._id,
          author: commentDoc.author,
          content: commentDoc.content,
          likes: commentDoc.likes,
          dislikes: commentDoc.dislikes,
          createdAt: commentDoc.createdAt
        }])
        .commit();

      setComments(prev => [...prev, commentDoc]);
      setNewComment({ name: '', email: '', content: '' });
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (parentCommentId: string) => {
    setError(null);

    try {
      const replyDoc: Comment = {
        _id: new Date().toISOString(),
        author: {
          name: newComment.name || 'Anonymous', // Use current user's name
          email: newComment.email || '', // Use current user's email
        },
        content: replyContent[parentCommentId],
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString()
      };

      // Update in Sanity
      await client
        .patch(postId)
        .set({
          comments: comments.map(comment => 
            comment._id === parentCommentId
              ? { 
                  ...comment, 
                  replies: [...(comment.replies || []), replyDoc] 
                }
              : comment
          )
        })
        .commit();

      // Update local state
      setComments(prev => 
        prev.map(comment =>
          comment._id === parentCommentId
            ? { 
                ...comment, 
                replies: [...(comment.replies || []), replyDoc] 
              }
            : comment
        )
      );

      setReplyContent(prev => ({ ...prev, [parentCommentId]: '' }));
      setReplyStates(prev => ({ ...prev, [parentCommentId]: false }));
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError('Failed to submit reply. Please try again.');
    }
  };

  // Increment likes/dislikes
  const handleReaction = async (commentId: string, type: 'likes' | 'dislikes', isReply?: boolean) => {
    setError(null);
    const reactionKey = `${commentId}-${type}`;
    setReactionLoading(prev => ({ ...prev, [reactionKey]: true }));

    try {
      // Update in Sanity
      await client
        .patch(postId)
        .set({
          comments: comments.map(comment => {
            if (isReply) {
              // Handle reply reactions
              return {
                ...comment,
                replies: comment.replies?.map(reply =>
                  reply._id === commentId
                    ? { ...reply, [type]: (reply[type] || 0) + 1 }
                    : reply
                )
              };
            }
            // Handle main comment reactions
            return comment._id === commentId
              ? { ...comment, [type]: (comment[type] || 0) + 1 }
              : comment;
          })
        })
        .commit();

      // Update local state
      setComments(prev =>
        prev.map(comment => {
          if (isReply) {
            return {
              ...comment,
              replies: comment.replies?.map(reply =>
                reply._id === commentId
                  ? { ...reply, [type]: (reply[type] || 0) + 1 }
                  : reply
              )
            };
          }
          return comment._id === commentId
            ? { ...comment, [type]: (comment[type] || 0) + 1 }
            : comment;
        })
      );
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
      setError(`Failed to update ${type}. Please try again.`);
    } finally {
      setReactionLoading(prev => ({ ...prev, [reactionKey]: false }));
    }
  };

  return (
    <div className="mt-8 w-full px-4 sm:px-0 sm:max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid gap-3 mb-4">
          <input
            type="text"
            placeholder="Your Name"
            value={newComment.name}
            onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            required
            className="w-full bg-gray-800 text-white border-gray-700 rounded-md p-2 text-sm sm:text-base"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={newComment.email}
            onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
            required
            className="w-full bg-gray-800 text-white border-gray-700 rounded-md p-2 text-sm sm:text-base"
          />
          <Textarea
            placeholder="Your Comment"
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            required
            className="w-full bg-gray-800 text-white border-gray-700 text-sm sm:text-base"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-white text-black rounded-lg hover:bg-gray-200 text-sm sm:text-lg py-4 sm:py-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            'Post Comment'
          )}
        </Button>
      </form>

      {isLoading && (
        <div className="text-center text-gray-400">
          <p>Loading comments...</p>
        </div>
      )}

    
      {!isLoading &&  comments.length === 0 && (
        <div className="text-center text-gray-400">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}

      {!isLoading && !error && comments.length > 0 && (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._key || comment._id} className="bg-gray-900 p-4 sm:p-6 rounded-lg text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {comment.author?.name || 'Anonymous'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReaction(comment._id, 'likes')}
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                    disabled={reactionLoading[`${comment._id}-likes`]}
                  >
                    {reactionLoading[`${comment._id}-likes`] ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <ThumbsUp className="w-4 h-4 mr-1 transform hover:scale-110 transition-transform" />
                    )}
                    {comment.likes}
                  </button>
                  <button
                    onClick={() => handleReaction(comment._id, 'dislikes')}
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                    disabled={reactionLoading[`${comment._id}-dislikes`]}
                  >
                    {reactionLoading[`${comment._id}-dislikes`] ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <ThumbsDown className="w-4 h-4 mr-1 transform hover:scale-110 transition-transform" />
                    )}
                    {comment.dislikes}
                  </button>
                </div>
              </div>
              <p className="text-gray-300 mt-4">{comment.content}</p>
              <button
                onClick={() =>
                  setReplyStates((prev) => ({ ...prev, [comment._id]: !prev[comment._id] }))
                }
                className="text-blue-500 mt-4 flex items-center"
              >
                <Reply className="w-4 h-4 mr-2" /> Reply
              </button>

              {replyStates[comment._id] && (
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newComment.name}
                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                    required
                    className="w-full bg-gray-800 text-white border-gray-700 rounded-md p-2"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={newComment.email}
                    onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                    required
                    className="w-full bg-gray-800 text-white border-gray-700 rounded-md p-2"
                  />
                  <Textarea
                    placeholder="Your Reply"
                    value={replyContent[comment._id] || ''}
                    onChange={(e) =>
                      setReplyContent((prev) => ({ ...prev, [comment._id]: e.target.value }))
                    }
                    required
                    className="bg-gray-800 text-white border-gray-700"
                  />
                  <Button
                    onClick={() => handleReplySubmit(comment._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" /> Submit Reply
                  </Button>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-6 pl-6 border-l border-gray-700">
                  {comment.replies.map((reply) => (
                    <div key={reply._key || reply._id} className="mt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-md font-semibold text-white">
                            {reply.author?.name || 'Anonymous'}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleReaction(reply._id, 'likes', true)}
                            className="flex items-center text-gray-400 hover:text-white"
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" /> {reply.likes}
                          </button>
                          <button
                            onClick={() => handleReaction(reply._id, 'dislikes', true)}
                            className="flex items-center text-gray-400 hover:text-white"
                          >
                            <ThumbsDown className="w-4 h-4 mr-1" /> {reply.dislikes}
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 mt-4">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}