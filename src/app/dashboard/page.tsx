import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/dashboard/LogoutButton';
import { getCourses } from '@/lib/supabase/queries';

export const metadata = {
  title: 'Dashboard Học Viên',
  description: 'Trang cá nhân học viên Minh AI Academy.',
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile details
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || 'Học viên';
  const role = profile?.role || user.user_metadata?.role || 'student';
  const email = profile?.email || user.email;

  // Fetch all courses
  const allCourses = await getCourses();

  // Fetch completed orders for the current user
  const { data: completedOrders } = await supabase
    .from('orders')
    .select('course_id')
    .eq('user_id', user.id)
    .eq('status', 'completed');

  const completedCourseIds = completedOrders?.map((o) => o.course_id) || [];

  // Enrolled courses include:
  // 1. Free courses (price === 0)
  // 2. Purchased courses (course id in completedCourseIds)
  // 3. All courses if the user is an admin
  const enrolledCourses = allCourses.filter(
    (c) =>
      c.price === 0 ||
      c.slug === 'tao-anh-ai-chuyen-nghiep' ||
      completedCourseIds.includes(c.id || '') ||
      role === 'admin'
  );

  // Available courses are paid courses that haven't been purchased yet (and user is not an admin)
  const availableCourses = allCourses.filter(
    (c) =>
      c.price > 0 &&
      c.slug !== 'tao-anh-ai-chuyen-nghiep' &&
      !completedCourseIds.includes(c.id || '') &&
      role !== 'admin'
  );

  // Fetch all lessons to get total counts per course
  const { data: lessonsData } = await supabase
    .from('lessons')
    .select('id, course_id');

  const lessonsCountMap: Record<string, number> = {};
  if (lessonsData) {
    lessonsData.forEach((l) => {
      lessonsCountMap[l.course_id] = (lessonsCountMap[l.course_id] || 0) + 1;
    });
  }

  // Fetch completed lessons for the user
  const { data: userProgressData } = await supabase
    .from('user_progress')
    .select('course_id, lesson_id')
    .eq('user_id', user.id)
    .eq('completed', true);

  const completedCountMap: Record<string, number> = {};
  if (userProgressData) {
    userProgressData.forEach((p) => {
      completedCountMap[p.course_id] = (completedCountMap[p.course_id] || 0) + 1;
    });
  }

  const totalCompletedLessons = Object.values(completedCountMap).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 sm:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Chào mừng trở lại, <span className="gradient-text-blue">{fullName}</span>!
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Hôm nay bạn muốn học gì nào? &quot;AI dễ lắm — để Minh chỉ cho&quot;
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] flex items-center justify-center font-bold text-sm">
              {fullName[0]}
            </div>
            <div>
              <div className="text-sm font-semibold">{fullName}</div>
              <div className="text-xs text-gray-500 capitalize">{role === 'admin' ? 'Quản trị viên' : 'Học viên'}</div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1 space-y-2">
            <div className="card-dark p-4 space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#0EA5E9] rounded-xl bg-[#0EA5E9]/10 transition-all duration-200"
              >
                📊 <span>Tổng quan</span>
              </Link>
              <Link
                href="/courses"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white rounded-xl hover:bg-white/[0.03] transition-all duration-200"
              >
                📚 <span>Tất cả khóa học</span>
              </Link>
              <Link
                href="/community"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white rounded-xl hover:bg-white/[0.03] transition-all duration-200"
              >
                👥 <span>Cộng đồng Forum</span>
              </Link>
              {role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-amber-400 hover:text-amber-300 rounded-xl hover:bg-amber-500/10 transition-all duration-200"
                >
                  ⚙️ <span>Trang Quản Trị</span>
                </Link>
              )}
              <div className="pt-4 mt-4 border-t border-white/5">
                <LogoutButton />
              </div>
            </div>

            {/* Profile Info Widget */}
            <div className="card-dark p-5 text-sm space-y-3">
              <h3 className="font-bold text-gray-300">Thông tin tài khoản</h3>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-gray-300 truncate">{email}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Loại tài khoản</div>
                <div className="text-gray-300 capitalize">{role === 'admin' ? 'Quản trị viên (Admin)' : 'Thành viên'}</div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-dark p-5">
                <div className="text-2xl mb-1">🎓</div>
                <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                <div className="text-xs text-gray-500 mt-1">Khóa học đang tham gia</div>
              </div>
              <div className="card-dark p-5">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-2xl font-bold">{totalCompletedLessons}</div>
                <div className="text-xs text-gray-500 mt-1">Bài học đã hoàn thành</div>
              </div>
              <div className="card-dark p-5">
                <div className="text-2xl mb-1">💬</div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-xs text-gray-500 mt-1">Bài viết thảo luận cộng đồng</div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📚</span> Khóa Học Của Tôi
              </h2>
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {enrolledCourses.map((course) => {
                    const totalLessons = lessonsCountMap[course.id || ''] || 12;
                    const completedLessons = completedCountMap[course.id || ''] || 0;
                    const progressPercent = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

                    return (
                      <div key={course.slug} className="card-dark p-5 flex flex-col justify-between">
                        <div>
                          <div className="text-4xl mb-3">{course.thumbnail}</div>
                          <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2 mb-4">{course.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Tiến độ học</span>
                              <span className="text-[#0EA5E9] font-medium">{progressPercent}% ({completedLessons}/{totalLessons} bài)</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] rounded-full" style={{ width: `${progressPercent}%` }} />
                            </div>
                          </div>
                        </div>
                        
                        <Link
                          href={`/courses/${course.slug}`}
                          className="btn-primary w-full justify-center py-2 text-sm text-center"
                        >
                          Vào học ngay ▶
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="card-dark p-8 text-center text-gray-500">
                  Bạn chưa đăng ký khóa học nào. Hãy ghé trang Khóa Học để chọn một lộ trình nhé!
                </div>
              )}
            </div>

            {/* Recommended Courses to Upgrade */}
            {availableCourses.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🚀</span> Khóa Học Đề Xuất Cho Bạn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {availableCourses.map((course) => (
                    <div key={course.slug} className="card-dark p-5 flex flex-col justify-between hover:border-[#8B5CF6]/20">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-4xl">{course.thumbnail}</div>
                          <span className="badge-premium">Premium</span>
                        </div>
                        <h3 className="font-bold text-base mb-1">{course.title}</h3>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-4">{course.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                        <span className="text-sm font-bold text-[#0EA5E9]">{course.price.toLocaleString()}đ</span>
                        <Link
                          href={`/courses/${course.slug}`}
                          className="btn-secondary py-1.5 px-4 text-xs font-semibold"
                        >
                          Tìm hiểu thêm →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
