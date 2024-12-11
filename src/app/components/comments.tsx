/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
// import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ThumbsUp, ThumbsDown, Reply, Send } from 'lucide-react'
import client from '@/lib/client'

// Sanity Client Configuration

interface Comment {
  _id: string
  author: {
    name: string
    email: string
    image?: string
  }
  content: string
  likes: number
  dislikes: number
  replies?: Comment[]
  createdAt: string
}

interface CommentProps {
  postId: string
}

export function Comments({ postId }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: ''
  })
  const [replyStates, setReplyStates] = useState<{ [key: string]: boolean }>({})
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({})

  // Fetch comments for specific post
  useEffect(() => {
    const fetchComments = async () => {
     const query = `*[_type == "post" && _id == $postId][0]{
  "comments": comments[]{
    _id,
    "author": author->{
      name,
      email,
      image{ asset-> { url } }
    },
    content,
    likes,
    dislikes,
    createdAt,
    "replies": replies[]{
      _id,
      "author": author->{
        name,
        email,
        image{ asset-> { url } }
      },
      content,
      likes,
      dislikes,
      createdAt
    }
  }
}`;


      try {
        const result = await client.fetch(query, { postId })
        setComments(result?.comments || [])
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }

    if (postId) {
      fetchComments()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const commentDoc = {
        _type: 'comment',
        author: {
          _type: 'reference',
          _ref: await createOrFindAuthor()
        },
        content: newComment.content,
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString()
      }

      // Patch the post to add the comment
      await client
        .patch(postId)
        .setIfMissing({ comments: [] })
        .append('comments', [commentDoc])
        .commit()
        console.log('posted')
      // Reset form
      setNewComment({ name: '', email: '', content: '' })
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  // Create or find author in Sanity
  const createOrFindAuthor = async () => {
    // Check if author exists
    const existingAuthor = await client.fetch(
      `*[_type == "author" && email == $email][0]._id`,
      { email: newComment.email }
    )

    if (existingAuthor) return existingAuthor

    // Create new author
    const author = await client.create({
      _type: 'author',
      name: newComment.name,
      email: newComment.email
    })

    return author._id
  }

  // Handle reply submission
  const handleReplySubmit = async (parentCommentId: string) => {

    console.log (parentCommentId)
    try {
      const replyDoc = {
        _type: 'comment',
        author: {
          _type: 'reference',
          _ref: await createOrFindAuthor()
        },
        content: replyContent[parentCommentId],
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString()
      }

      // Add reply to specific comment
      await client
        .patch(parentCommentId)
        .setIfMissing({ replies: [] })
        .append('replies', [replyDoc])
        .commit()

      // Clear reply state
      setReplyContent(prev => ({ ...prev, [parentCommentId]: '' }))
      setReplyStates(prev => ({ ...prev, [parentCommentId]: false }))
    } catch (error) {
      console.error('Error submitting reply:', error)
    }
  }

  // Increment likes/dislikes
  const handleReaction = async (commentId: string, type: 'likes' | 'dislikes') => {
    try {
      await client
        .patch(commentId)
        .commit()
    } catch (error) {
      console.error(`Error updating ${type}:`, error)
    }
  }

  return (
    <div className="mt-16 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">Comments</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="grid gap-4 mb-4">
          <input
            type="text"
            placeholder="Your Name"
            value={newComment.name}
            onChange={(e: { target: { value: any } }) => setNewComment({ ...newComment, name: e.target.value })}
            required
            className="bg-gray-800 text-white border-gray-700"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={newComment.email}
            onChange={(e: { target: { value: any } }) => setNewComment({ ...newComment, email: e.target.value })}
            required
            className="bg-gray-800 text-white border-gray-700"
          />
          <Textarea
            placeholder="Your Comment"
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            required
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Post Comment
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-900 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                {/* {comment.author.image && (
                  <Image
                    src={comment.author.image}
                    alt={comment.author.name}
                    className="rounded-full w-10 h-10"
                  />
                )} */}
                <div>
                  <h3 className="text-lg font-semibold text-white">{comment.author.name}</h3>
                  <p className="text-sm text-gray-400">{comment.author.email}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-gray-300 mb-4">{comment.content}</p>

            {/* Reaction and Reply Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction(comment._id, 'likes')}
                className="flex items-center space-x-1"
              >
                <ThumbsUp size={16} />
                <span>{comment.likes || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction(comment._id, 'dislikes')}
                className="flex items-center space-x-1"
              >
                <ThumbsDown size={16} />
                <span>{comment.dislikes || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyStates(prev => ({
                  ...prev,
                  [comment._id]: !prev[comment._id]
                }))}
              >
                <Reply size={16} className="mr-1" /> Reply
              </Button>
            </div>

            {/* Reply Input */}
            {replyStates[comment._id] && (
              <div className="mt-4 pl-4 border-l-2 border-gray-700">
                <div className="flex space-x-2 mb-2">
                  <input
                    placeholder="Your Name"
                    className="bg-gray-800 text-white border-gray-700 w-1/2"
                  />
                  <input
                    placeholder="Your Email"
                    className="bg-gray-800 text-white border-gray-700 w-1/2"
                  />
                </div>
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent[comment._id] || ''}
                    onChange={(e) => setReplyContent(prev => ({
                      ...prev,
                      [comment._id]: e.target.value
                    }))}
                    className="bg-gray-800 text-white border-gray-700 flex-grow"
                  />
                  <Button
                    onClick={() => handleReplySubmit(comment._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.map((reply) => (
              <div key={reply._id} className="mt-4 pl-4 border-l-2 border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    {/* {reply.author.image && (
                      <Image
                        src={reply.author.image}
                        alt={reply.author.name}
                        className="rounded-full w-8 h-8"
                      />
                    )} */}
                    <div>
                      <h4 className="text-md font-semibold text-white">{reply.author.name}</h4>
                      <p className="text-xs text-gray-400">{reply.author.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">{reply.content}</p>

                {/* Reply Reactions */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(reply._id, 'likes')}
                    className="flex items-center space-x-1"
                  >
                    <ThumbsUp size={14} />
                    <span>{reply.likes || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(reply._id, 'dislikes')}
                    className="flex items-center space-x-1"
                  >
                    <ThumbsDown size={14} />
                    <span>{reply.dislikes || 0}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}