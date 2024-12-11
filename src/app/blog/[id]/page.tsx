import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Comments } from '@/app/components/comments';
import client from '@/lib/client';
import { notFound } from 'next/navigation';

interface BlogPageProps {
  params: { id: string }; // Adjusted to directly use the expected shape.
}

export default async function BlogPost({ params }: BlogPageProps) {
  const id = params.id; // Directly extract `id` from `params`.

  const fetchPostData = async (id: string) => {
    const query = `*[_type == "post" && _id == $id][0] {
      _id,
      title,
      date,
      author,
      excerpt,
      content,
      image {
        asset -> {
          url
        }
      }
    }`;
    return client.fetch(query, { id });
  };

  const post = await fetchPostData(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <article className="container mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            {post.title}
          </h1>

          <div className="flex items-center text-gray-400 mb-8">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </div>

          {post.image?.asset?.url && (
            <Image
              src={post.image.asset.url}
              alt="Blog post cover image"
              width={800}
              height={400}
              className="rounded-lg mb-8"
            />
          )}

          <div className="prose prose-invert max-w-none">
            {post.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="text-gray-300 mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          <Comments />
        </div>
      </article>
    </div>
  );
}
