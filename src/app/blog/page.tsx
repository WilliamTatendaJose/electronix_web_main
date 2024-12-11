import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Latest Trends in Electronics Repair",
      excerpt: "Discover the cutting-edge techniques and tools revolutionizing the electronics repair industry...",
      date: "2023-12-11",
      category: "Industry Trends"
    },
    {
      id: 2,
      title: "Solar Solutions for Businesses",
      excerpt: "Learn how businesses can benefit from our comprehensive solar power solutions...",
      date: "2023-12-10",
      category: "Solar"
    },
    {
      id: 3,
      title: "Common Laptop Repair Issues",
      excerpt: "Expert insights into the most frequent laptop problems and how we solve them...",
      date: "2023-12-09",
      category: "Repairs"
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            TechRehub Blog
          </h1>
          <p className="text-lg text-gray-400">
            Stay updated with the latest in electronics repair and technology
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.id}`}>
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

