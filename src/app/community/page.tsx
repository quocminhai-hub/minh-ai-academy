import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cộng đồng AI Thực Chiến',
  description: 'Cộng đồng Minh AI Academy — Nơi chia sẻ kiến thức, thảo luận và kết nối với những người đam mê AI.',
};

// Demo forum data
const categories = [
  {
    id: 'general',
    icon: '💬',
    name: 'Thảo luận chung',
    description: 'Trao đổi mọi thứ liên quan đến AI, học tập và phát triển bản thân.',
    topics: 156,
    posts: 1243,
    color: '#0EA5E9',
  },
  {
    id: 'ai-image',
    icon: '🎨',
    name: 'Tạo Ảnh AI',
    description: 'Chia sẻ prompt, kết quả và tips về Midjourney, DALL-E, Stable Diffusion.',
    topics: 98,
    posts: 876,
    color: '#8B5CF6',
  },
  {
    id: 'ai-video',
    icon: '🎬',
    name: 'Video AI & Kênh Triệu View',
    description: 'Thảo luận về Sora, Runway, Kling AI và chiến lược xây kênh.',
    topics: 124,
    posts: 1087,
    color: '#06B6D4',
  },
  {
    id: 'personal-brand',
    icon: '🚀',
    name: 'Thương Hiệu Cá Nhân',
    description: 'Chia sẻ kinh nghiệm xây dựng thương hiệu, tạo sản phẩm số, bán hàng.',
    topics: 67,
    posts: 534,
    color: '#22C55E',
  },
  {
    id: 'showcase',
    icon: '🏆',
    name: 'Showcase — Khoe Thành Quả',
    description: 'Khoe kết quả học tập: ảnh AI, video, kênh YouTube, doanh thu.',
    topics: 45,
    posts: 312,
    color: '#F59E0B',
  },
  {
    id: 'support',
    icon: '🆘',
    name: 'Hỏi đáp & Hỗ trợ',
    description: 'Đặt câu hỏi, nhờ hỗ trợ kỹ thuật và các vấn đề liên quan.',
    topics: 89,
    posts: 678,
    color: '#EF4444',
  },
];

const recentTopics = [
  {
    title: 'Cách tạo ảnh nhất quán cho thương hiệu với Midjourney v6.1',
    category: 'Tạo Ảnh AI',
    author: 'Anh Tuấn',
    replies: 23,
    time: '2 giờ trước',
    hot: true,
  },
  {
    title: '[SHARE] Kênh YouTube đạt 100K subscribers sau 2 tháng dùng Video AI',
    category: 'Showcase',
    author: 'Chị Hương',
    replies: 56,
    time: '4 giờ trước',
    hot: true,
  },
  {
    title: 'So sánh Sora vs Kling AI cho video quảng cáo sản phẩm',
    category: 'Video AI',
    author: 'Anh Phong',
    replies: 18,
    time: '6 giờ trước',
    hot: false,
  },
  {
    title: 'Hỏi: Cách setup AI Agent chatbot bán hàng trên website?',
    category: 'Hỏi đáp',
    author: 'Chị Lan',
    replies: 12,
    time: '8 giờ trước',
    hot: false,
  },
  {
    title: 'Template Prompt tạo thumbnail YouTube triệu view (Free)',
    category: 'Tạo Ảnh AI',
    author: 'Minh',
    replies: 89,
    time: '1 ngày trước',
    hot: true,
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen pt-20 sm:pt-24">
      {/* Hero */}
      <section className="section-padding relative">
        <div className="glow-blue animate-pulse-glow" style={{ top: '0', left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, opacity: 0.07 }} />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="text-5xl mb-4">🌐</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Cộng đồng <span className="gradient-text-blue">AI Thực Chiến</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Kết nối với 2,000+ thành viên cùng đam mê AI. Chia sẻ kiến thức, hỏi đáp, và cùng nhau phát triển.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">👥 <strong className="text-white">2,000+</strong> thành viên</span>
            <span className="flex items-center gap-1.5">💬 <strong className="text-white">4,730</strong> bài viết</span>
            <span className="flex items-center gap-1.5">📂 <strong className="text-white">579</strong> chủ đề</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories */}
            <div>
              <h2 className="text-xl font-bold mb-4">Danh mục</h2>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="card-dark p-4 sm:p-5 flex items-center gap-4 hover:border-white/10 cursor-pointer group">
                    <div className="text-3xl shrink-0 group-hover:scale-110 transition-transform">{cat.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold group-hover:text-[#0EA5E9] transition-colors">{cat.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{cat.description}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 shrink-0">
                      <div className="text-center">
                        <div className="font-bold text-white text-sm">{cat.topics}</div>
                        <div>Chủ đề</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white text-sm">{cat.posts}</div>
                        <div>Bài viết</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Topics */}
            <div>
              <h2 className="text-xl font-bold mb-4">Thảo luận mới nhất</h2>
              <div className="space-y-2">
                {recentTopics.map((topic, i) => (
                  <div key={i} className="card-dark p-4 hover:border-white/10 cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {topic.author[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {topic.hot && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                              🔥 HOT
                            </span>
                          )}
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                            {topic.category}
                          </span>
                        </div>
                        <h3 className="font-medium text-sm group-hover:text-[#0EA5E9] transition-colors leading-snug">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{topic.author}</span>
                          <span>·</span>
                          <span>💬 {topic.replies} phản hồi</span>
                          <span>·</span>
                          <span>{topic.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* New Topic CTA */}
            <div className="card-dark p-5 text-center">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="font-bold mb-2">Tạo bài viết mới</h3>
              <p className="text-sm text-gray-500 mb-4">Chia sẻ kiến thức hoặc đặt câu hỏi cho cộng đồng</p>
              <Link href="/login" className="btn-primary w-full justify-center py-2.5 text-sm">
                Đăng nhập để viết bài
              </Link>
            </div>

            {/* Top Contributors */}
            <div className="card-dark p-5">
              <h3 className="font-bold mb-4">🏅 Top đóng góp</h3>
              <div className="space-y-3">
                {[
                  { name: 'Minh', role: 'Admin', posts: 234 },
                  { name: 'Anh Tuấn', role: 'Pro Member', posts: 156 },
                  { name: 'Chị Hương', role: 'Pro Member', posts: 98 },
                  { name: 'Anh Khoa', role: 'Member', posts: 76 },
                  { name: 'Chị My', role: 'Member', posts: 54 },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-sm font-bold text-gray-500 w-5">{i + 1}</div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] flex items-center justify-center text-[10px] font-bold">
                      {user.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-[10px] text-gray-500">{user.role}</div>
                    </div>
                    <div className="text-xs text-gray-500">{user.posts} bài</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="card-dark p-5">
              <h3 className="font-bold mb-3">📋 Nội quy</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#22C55E]">✓</span> Tôn trọng lẫn nhau
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#22C55E]">✓</span> Chia sẻ kiến thức chất lượng
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#22C55E]">✓</span> Không spam, quảng cáo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#22C55E]">✓</span> Đặt câu hỏi rõ ràng
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
