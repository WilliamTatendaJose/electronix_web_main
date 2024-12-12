/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Comments } from '@/app/components/comments';
import client from '@/lib/client';
import { notFound } from 'next/navigation';
import Head from 'next/head';
import { PortableText } from '@portabletext/react';

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPost(props: BlogPageProps) {
  const params = await props.params;
  const id = params.id;

  const fetchPostData = async (id: string) => {
    const query = `*[_type == "post" && _id == $id][0] {
      _id,
      title,
      date,
      author {
        name,
        email,
        image {
          asset -> {
            url
          }
        }
      },
      excerpt,
      content[] {
        ...,
        _type,
        style,
        markDefs[] {
          ...,
          _type,
          _key,
          href
        },
        children[] {
          ...,
          _type,
          marks,
          text
        }
      },
      mainImage {
        asset -> {
          url
        },
        alt
      },
      comments[] {
        author {
          name,
          email,
          image {
            asset -> {
              url
            }
          }
        },
        content,
        createdAt,
        likes,
        dislikes,
        replies[] {
          author {
            name,
            email,
            image {
              asset -> {
                url
              }
            }
          },
          content,
          createdAt,
          likes,
          dislikes
        }
      }
    }`;
    return client.fetch(query, { id });
  };

  const post = await fetchPostData(id);

  if (!post) {
    notFound();
  }

  console.log('Post content:', JSON.stringify(post.content, null, 2));

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={`https://www.techrehub.co.zw/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
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
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{post.author?.name}</span>
          </div>

          {post.mainImage?.asset?.url && (
            <Image
              src={post.mainImage.asset.url}
              alt={post.mainImage.alt || 'Blog post cover image'}
              width={800}
              height={400}
              className="rounded-lg mb-8"
            />
          )}

          <div className="prose prose-invert max-w-none">
            {post.content ? (
              <PortableText 
                value={post.content}
                components={{
                  block: {
                    normal: ({children}) => {
                      return <p className="text-gray-300 mb-6">{children}</p>;
                    },
                    h1: ({children}) => <h1 className="text-3xl font-bold mb-4 text-white">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-bold mb-3 text-white">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-bold mb-3 text-white">{children}</h3>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4">{children}</blockquote>,
                  },
                  list: {
                    bullet: ({children}) => <ul className="list-disc list-inside mb-4 text-gray-300">{children}</ul>,
                    number: ({children}) => <ol className="list-decimal list-inside mb-4 text-gray-300">{children}</ol>,
                  },
                  marks: {
                    strong: ({children}) => <strong className="font-bold">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                    code: ({children}) => <code className="bg-gray-800 rounded px-1 py-0.5">{children}</code>,
                    link: ({value, children}) => {
                      return (
                        <a href={value?.href} className="text-blue-400 hover:text-blue-300 underline">
                          {children}
                        </a>
                      );
                    },
                  }
                }}
              />
            ) : (
              <p className="text-gray-300">No content available</p>
            )}
          </div>

          <Comments postId={post._id} initialComments={post.comments} />
        </div>
      </article>
    </div>
    </>
  );
}
