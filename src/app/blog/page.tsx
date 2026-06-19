import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/data/blog'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/blog/' },
  title: 'Blog',
  description:
    'News, volunteer spotlights, and stories from Free For Charity. Learn about our mission to build free websites for nonprofits.',
  keywords: [
    'nonprofit volunteer blog',
    'charity web development',
    'volunteer spotlight',
    'free nonprofit website',
    'FFC news',
  ],
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-violet-100 max-w-3xl mx-auto">
            Stories, spotlights, and updates from the Free For Charity volunteer community
          </p>
        </div>
      </div>

      {/* Blog Post Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href={post.href} className="hover:text-violet-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">{post.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.author}</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to contribute?</h2>
          <p className="text-gray-600 mb-6">
            Join the FFC volunteer community and help build free websites for nonprofits. Your story
            could be featured here next.
          </p>
          <Link
            href="/get-involved"
            className="inline-flex items-center px-8 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors"
          >
            Get Involved
          </Link>
        </div>
      </section>
    </div>
  )
}
