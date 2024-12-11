import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import client from '../../lib/client'

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export default async function BlogPage() {
 const posts = await client.fetch(`*[_type == "post"]{_id, title, excerpt, date, category}`) 

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            TechRehub Blog
          </h1>
          <p className="text-lg text-gray-400">
            Stay updated with the latest in Engineering and Technology
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <Link key={post._id} href={`/blog/${post._id}`}>
              <Card className="h-full bg-gray-900 border-gray-800 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="text-sm text-blue-400 mb-2">{post.category}</div>
                  <CardTitle className="text-xl text-white">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">{post.excerpt}</p>
                  <div className="text-sm text-gray-500">{post.date}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

