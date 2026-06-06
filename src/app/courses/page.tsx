import Link from 'next/link';
import { getCourses } from '@/lib/supabase/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khóa Học AI Thực Chiến',
  description: 'Khám phá các khóa học AI ứng dụng từ cơ bản đến nâng cao. Tạo ảnh AI, Video AI viral, xây thương hiệu cá nhân.',
};

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <div className="min-h-screen pt-20 sm:pt-24">
      {/* Hero */}
      <section className="section-padding relative">
        <div className="glow-blue animate-pulse-glow" style={{ top: '0', left: '30%', width: 400, height: 300, opacity: 0.08 }} />
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Khóa Học <span className="gradient-text-blue">AI Thực Chiến</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Từ người mới bắt đầu đến chuyên gia — chọn lộ trình phù hợp và bắt đầu hành trình làm chủ AI ngay hôm nay.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className="card-dark p-5 sm:p-6 group hover:border-[#0EA5E9]/20">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{course.thumbnail}</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={course.badge === 'free' ? 'badge-free' : course.badge === 'new' ? 'badge-new' : 'badge-premium'}>
                    {course.badge === 'free' ? 'Miễn phí' : course.badge === 'new' ? 'Mới' : 'Premium'}
                  </span>
                  <span className="text-xs text-gray-500">{course.level}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-[#0EA5E9] transition-colors">{course.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">📚 {course.lessons} bài</span>
                  <span className="flex items-center gap-1">⏱️ {course.duration}</span>
                  <span className="flex items-center gap-1">👥 {course.students.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  {course.price === 0 ? (
                    <span className="text-[#22C55E] font-bold text-lg">Miễn phí</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      {course.originalPrice && (
                        <span className="text-sm text-gray-600 line-through">{course.originalPrice.toLocaleString()}đ</span>
                      )}
                      <span className="text-[#0EA5E9] font-bold text-lg">{course.price.toLocaleString()}đ</span>
                    </div>
                  )}
                  <span className="text-xs text-[#0EA5E9] group-hover:translate-x-1 transition-transform">Xem chi tiết →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
