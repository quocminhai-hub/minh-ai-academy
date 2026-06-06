import { getCourses, getCourseBySlug } from '@/lib/supabase/queries';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import CourseSidebarCard from '@/components/courses/CourseSidebarCard';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  // Check enrollment
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  
  let isEnrolled = false;
  if (isLoggedIn && user) {
    if (course.price === 0) {
      isEnrolled = true;
    } else {
      // Query completed orders
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id || '')
        .eq('status', 'completed')
        .limit(1)
        .maybeSingle();

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      const isAdmin = profile?.role === 'admin' || user.email?.endsWith('@minhai.academy');
      
      if (order || isAdmin) {
        isEnrolled = true;
      }
    }
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-24">
      {/* Hero Banner */}
      <section className="section-padding relative bg-[#0d0d14]">
        <div className="glow-blue animate-pulse-glow" style={{ top: '0', left: '20%', width: 400, height: 250, opacity: 0.08 }} />
        <div className="relative max-w-5xl mx-auto">
          <Link href="/courses" className="text-sm text-gray-500 hover:text-[#0EA5E9] transition-colors mb-6 inline-flex items-center gap-1">
            ← Tất cả khóa học
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className={course.badge === 'free' ? 'badge-free' : course.badge === 'new' ? 'badge-new' : 'badge-premium'}>
                  {course.badge === 'free' ? 'Miễn phí' : course.badge === 'new' ? 'Mới' : 'Premium'}
                </span>
                <span className="text-xs text-gray-500">{course.category}</span>
              </div>
              <div className="text-6xl mb-4">{course.thumbnail}</div>
              <h1 className="text-2xl sm:text-4xl font-extrabold mb-4">{course.title}</h1>
              <p className="text-gray-400 leading-relaxed mb-6">{course.longDescription}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">📚 {course.lessons} bài học</span>
                <span className="flex items-center gap-1.5">⏱️ {course.duration}</span>
                <span className="flex items-center gap-1.5">👥 {course.students.toLocaleString()} học viên</span>
                <span className="flex items-center gap-1.5">📊 {course.level}</span>
              </div>
            </div>

            {/* Dynamic Sidebar Card Component */}
            <div className="lg:col-span-1">
              <CourseSidebarCard
                courseId={course.id || ''}
                coursePrice={course.price}
                courseOriginalPrice={course.originalPrice}
                courseSlug={course.slug}
                isFree={course.price === 0}
                isEnrolled={isEnrolled}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8">
            Nội dung khóa học
          </h2>
          <div className="space-y-4">
            {course.chapters.map((chapter, i) => (
              <details key={i} className="card-dark group" open={i === 0}>
                <summary className="p-5 cursor-pointer flex items-center justify-between hover:bg-white/[0.02] transition-colors rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9] text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base">{chapter.title}</h3>
                  </div>
                  <span className="text-xs text-gray-500">{chapter.lessons.length} bài</span>
                </summary>
                <div className="px-5 pb-5 space-y-2">
                  {chapter.lessons.map((lesson, j) => (
                    <div key={j} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors text-sm text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 shrink-0"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                      {lesson}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
