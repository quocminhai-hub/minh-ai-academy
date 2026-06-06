import { getBlogPosts, getBlogPostBySlug } from '@/lib/supabase/queries';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl sm:text-2xl font-extrabold mt-8 mb-4 text-white">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-bold mt-6 mb-3 text-white">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('```')) {
        return null; // Skip code fences for simplicity
      }
      if (line.startsWith('| ')) {
        return <p key={i} className="text-sm text-gray-400 font-mono">{line}</p>;
      }
      if (line.startsWith('- ') || line.match(/^\d+\./)) {
        return (
          <div key={i} className="flex items-start gap-2 text-gray-300 leading-relaxed ml-4 mb-1">
            <span className="text-[#0EA5E9] mt-1">•</span>
            <span>{line.replace(/^[-\d.]+\s*\*\*/, '').replace(/\*\*/g, '')}</span>
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-gray-300 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-24">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors mb-6 inline-flex items-center gap-1">
          ← Tất cả bài viết
        </Link>

        {/* Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{post.coverEmoji}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.1)', color: '#A78BFA' }}>
              {post.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-4">{post.title}</h1>
          <p className="text-gray-400 leading-relaxed mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} đọc</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="card-dark p-6 sm:p-8 mt-12 text-center">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="text-xl font-bold mb-2">Muốn học sâu hơn?</h3>
          <p className="text-sm text-gray-400 mb-4">Tham gia khóa học AI thực chiến cùng Minh để ứng dụng ngay vào công việc.</p>
          <Link href="/courses" className="btn-primary py-2.5 px-6">
            Xem khóa học →
          </Link>
        </div>
      </article>
    </div>
  );
}
