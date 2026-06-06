import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <div>
                <div className="text-sm font-bold">Minh AI Academy</div>
                <div className="text-[10px] text-[#0EA5E9]">AI dễ lắm</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Nền tảng đào tạo AI ứng dụng thực chiến #1 Việt Nam. Giúp bạn làm chủ AI để tăng năng suất và kiếm tiền online.
            </p>
          </div>

          {/* Khóa học */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-white">Khóa học</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/courses/tao-anh-ai-chuyen-nghiep" className="text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors">
                  Tạo Ảnh AI
                </Link>
              </li>
              <li>
                <Link href="/courses/video-ai-viral" className="text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors">
                  Video AI Viral
                </Link>
              </li>
              <li>
                <Link href="/courses/xay-thuong-hieu-ca-nhan-bang-ai" className="text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors">
                  Thương Hiệu Cá Nhân
                </Link>
              </li>
            </ul>
          </div>

          {/* Tài nguyên */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-white">Tài nguyên</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/blog" className="text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors">
                  Cộng đồng
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors">
                  Tất cả khóa học
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-white">Liên hệ</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <span>📧</span> hello@minhai.academy
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors">
                  <span>📘</span> Facebook
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors">
                  <span>🎬</span> YouTube
                </a>
              </li>
              <li>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors">
                  <span>🎵</span> TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © 2026 Minh AI Academy. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Made with 💙 & AI — &quot;AI dễ lắm — để Minh chỉ cho&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
