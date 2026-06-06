import Link from 'next/link';
import { getBlogPosts } from '@/lib/supabase/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog AI Thực Chiến',
  description: 'Chia sẻ kiến thức AI ứng dụng thực chiến: hướng dẫn, tips, so sánh công cụ và lộ trình học AI.',
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  return (
    <div className="min-h-screen pt-20 sm:pt-24">
      <section className="section-padding relative">
        <div className="glow-purple animate-pulse-glow" style={{ top: '0', right: '20%', width: 350, height: 250, opacity: 0.07 }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
              Blog <span className="gradient-text-accent">AI Thực Chiến</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Kiến thức, tips và hướng dẫn AI mới nhất — giúp bạn ứng dụng AI hiệu quả mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card-dark p-5 sm:p-6 group hover:border-[#8B5CF6]/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{post.coverEmoji}</div>
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.1)', color: '#A78BFA' }}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <h2 className="font-bold text-lg mb-2 group-hover:text-[#0EA5E9] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                  <span>{post.date}</span>
                  <span>{post.readTime} đọc</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
