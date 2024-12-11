'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"

interface Comment {
  id: number
  name: string
  email: string
  content: string
  date: string
}

export function Comments() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      content: "Great article! Very informative.",
      date: "2023-12-11 14:30"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      content: "I learned a lot from this. Thanks for sharing!",
      date: "2023-12-11 15:45"
    }
  ])
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const comment: Comment = {
      id: comments.length + 1,
      ...newComment,
      date: new Date().toLocaleString()
    }
    setComments([...comments, comment])
    setNewComment({ name: '', email: '', content: '' })
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-8">Comments</h2>
      
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="grid gap-4 mb-4">
          <Input
            type="text"
            placeholder="Your Name"
            value={newComment.name}
            onChange={(e) => setNewComment({...newComment, name: e.target.value})}
            required
            className="bg-gray-800 text-white border-gray-700"
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={newComment.email}
            onChange={(e) => setNewComment({...newComment, email: e.target.value})}
            required
            className="bg-gray-800 text-white border-gray-700"
          />
          <Textarea
            placeholder="Your Comment"
            value={newComment.content}
            onChange={(e) => setNewComment({...newComment, content: e.target.value})}
            required
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Post Comment
        </Button>
      </form>

      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-900 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{comment.name}</h3>
                <p className="text-sm text-gray-400">{comment.email}</p>
              </div>
              <span className="text-sm text-gray-500">{comment.date}</span>
            </div>
            <p className="text-gray-300">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

