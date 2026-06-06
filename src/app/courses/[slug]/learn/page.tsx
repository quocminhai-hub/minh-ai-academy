import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LmsPlayer from '@/components/lms/LmsPlayer';

type Props = { params: Promise<{ slug: string }> };

export default async function LearnPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Get current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=/courses/${slug}/learn`);
  }

  // 2. Fetch course by slug from Supabase
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!course) {
    notFound();
  }

  // 3. Authorization Check
  const isFree = course.price === 0;

  if (!isFree) {
    // Check if the user has purchased this course
    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .eq('status', 'completed')
      .limit(1)
      .maybeSingle();

    // If no order is found, and user is not admin, redirect to purchase page
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin' || user.email?.endsWith('@minhai.academy');

    if (!order && !isAdmin) {
      redirect(`/courses/${slug}?error=need-purchase`);
    }
  }

  // 4. Fetch all lessons for this course
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true });

  if (!lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Đang cập nhật bài học</h1>
          <p className="text-gray-500 mb-4">Khóa học này chưa được đăng tải video bài giảng. Vui lòng quay lại sau.</p>
          <a href="/dashboard" className="btn-primary py-2 px-6 inline-block">Về Dashboard</a>
        </div>
      </div>
    );
  }

  // 5. Fetch user's completed lessons for this course
  const { data: progress } = await supabase
    .from('user_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('course_id', course.id);

  const completedLessonIds = progress ? progress.map((p) => p.lesson_id) : [];

  return (
    <LmsPlayer
      course={{
        id: course.id,
        slug: course.slug,
        title: course.title,
        thumbnail: course.image_url || '🎓',
      }}
      lessons={lessons.map((l: any) => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        duration: l.duration || 0,
        order_index: l.order_index,
        video_url: l.video_url || '',
        is_free: l.is_free || false,
      }))}
      initialCompletedLessonIds={completedLessonIds}
      userId={user.id}
    />
  );
}
