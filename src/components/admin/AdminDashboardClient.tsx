'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_id: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
  courses?: {
    title: string;
  };
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  published: boolean;
  lessons?: any[];
}

interface StudentQuestion {
  id: string;
  user_id: string;
  course_id: string;
  question_text: string;
  status: 'pending' | 'answered';
  answer_text?: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
  courses?: {
    title: string;
  };
}

interface AdminDashboardClientProps {
  initialProfiles: Profile[];
  initialOrders: Order[];
  initialCourses: Course[];
  initialQuestions: StudentQuestion[];
  currentUser: {
    id: string;
    email: string;
    fullName: string;
  };
}

export default function AdminDashboardClient({
  initialProfiles,
  initialOrders,
  initialCourses,
  initialQuestions,
  currentUser,
}: AdminDashboardClientProps) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('admin-panel');

  // Local state for live updates
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [questions, setQuestions] = useState<StudentQuestion[]>(
    initialQuestions.length > 0
      ? initialQuestions
      : [
          // Fallback high-fidelity mock questions matching screenshot
          {
            id: 'mock-q-1',
            user_id: 'user-1',
            course_id: 'course-1',
            question_text: 'Khi nào học xếp 0912515115',
            status: 'pending',
            created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
            profiles: { full_name: 'Nhất tâm', email: 'thuanbanbatdongsan2014@gmail.com' },
            courses: { title: 'Lộ trình Thiết kế Website All in One bằng AI Agent' },
          },
          {
            id: 'mock-q-2',
            user_id: 'user-2',
            course_id: 'course-2',
            question_text: 'Cảm ơn Thầy, dựng khung rồi đắp thịt dần dần. Minh vẫn đang điều chỉnh trang tiếp. Thấy ngó qua kientd.store',
            status: 'pending',
            created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
            profiles: { full_name: 'Trường Đức Kiên', email: 'kientd79@gmail.com' },
            courses: { title: 'Học chưa xong tiền đã về - Tạo sản phẩm số bán chạy trong ngách của bạn' },
          },
          {
            id: 'mock-q-3',
            user_id: 'user-2',
            course_id: 'course-2',
            question_text: 'Nhờ Thầy Khương chữa bài giúp. Cảm ơn Thầy nhiều',
            status: 'answered',
            answer_text: 'A gửi bài lên đây nhé',
            created_at: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
            profiles: { full_name: 'Trường Đức Kiên', email: 'kientd79@gmail.com' },
            courses: { title: 'Học chưa xong tiền đã về - Tạo sản phẩm số bán chạy trong ngách của bạn' },
          },
        ]
  );

  // States for Q&A answers
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [qaFilter, setQaFilter] = useState<'all' | 'pending' | 'answered'>('all');

  // Search in Course list
  const [courseSearch, setCourseSearch] = useState('');

  // States for Grant Course Access
  const [grantEmail, setGrantEmail] = useState('');
  const [selectedCoursesToGrant, setSelectedCoursesToGrant] = useState<string[]>([]);
  const [grantMessage, setGrantMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [grantingAccess, setGrantingAccess] = useState(false);

  // Search in Orders list
  const [orderSearch, setOrderSearch] = useState('');

  // Calculate dynamic stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status === 'completed' ? Number(o.amount) : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  
  // Date filtering states (for visual simulation)
  const [dateRange, setDateRange] = useState('30'); // '7', '30', '90', 'all'

  // Match profiles as admin types email
  const matchedProfile = profiles.find(
    (p) => p.email.toLowerCase() === grantEmail.trim().toLowerCase()
  );

  // 1. Grant Course Access submit
  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim()) {
      setGrantMessage({ type: 'error', text: 'Vui lòng nhập Email hoặc SĐT học viên!' });
      return;
    }
    if (selectedCoursesToGrant.length === 0) {
      setGrantMessage({ type: 'error', text: 'Vui lòng chọn ít nhất 1 khóa học!' });
      return;
    }

    setGrantingAccess(true);
    setGrantMessage(null);

    try {
      // Find user profile by email
      let targetUser = matchedProfile;

      if (!targetUser) {
        // Look up by matching exact email
        const { data: matchedDbUser, error: lookupError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', grantEmail.trim())
          .maybeSingle();

        if (lookupError || !matchedDbUser) {
          setGrantMessage({
            type: 'error',
            text: `Không tìm thấy học viên nào với email "${grantEmail}". Học viên cần phải đăng ký tài khoản trước!`,
          });
          setGrantingAccess(false);
          return;
        }
        targetUser = matchedDbUser;
      }

      // Insert orders for all selected courses
      const orderInserts = selectedCoursesToGrant.map((courseId) => ({
        user_id: targetUser!.id,
        course_id: courseId,
        amount: 0, // Admin granted access is free
        status: 'completed',
        payment_method: 'admin_grant',
        payment_id: 'GRANT_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      }));

      const { data: insertedOrders, error: insertError } = await supabase
        .from('orders')
        .insert(orderInserts)
        .select('*, profiles(full_name, email), courses(title)');

      if (insertError) {
        throw insertError;
      }

      // Update local orders state
      if (insertedOrders) {
        setOrders((prev) => [...insertedOrders, ...prev]);
      }

      setGrantMessage({
        type: 'success',
        text: `Đã cấp quyền học thành công cho học viên ${targetUser?.full_name} (${targetUser?.email})!`,
      });
      setGrantEmail('');
      setSelectedCoursesToGrant([]);
    } catch (err: any) {
      console.error('Error granting access:', err);
      setGrantMessage({ type: 'error', text: 'Lỗi hệ thống: ' + err.message });
    } finally {
      setGrantingAccess(false);
    }
  };

  // 2. Answer student question
  const handleAnswerQuestion = async (qId: string) => {
    const replyText = replyTextMap[qId];
    if (!replyText || !replyText.trim()) return;

    try {
      // Update locally first for speed
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === qId ? { ...q, status: 'answered', answer_text: replyText } : q
        )
      );

      // Check if question exists in DB before sending
      if (!qId.startsWith('mock-')) {
        await supabase
          .from('student_questions')
          .update({
            status: 'answered',
            answer_text: replyText,
          })
          .eq('id', qId);
      }

      setReplyTextMap((prev) => ({ ...prev, [qId]: '' }));
    } catch (err) {
      console.error('Error answering question:', err);
    }
  };

  // 3. Mark pending order as completed
  const handleConfirmOrder = async (orderId: string) => {
    try {
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o))
      );

      // Call secure definer RPC function in Supabase
      const { error } = await supabase.rpc('confirm_order', { order_id: orderId });
      if (error) {
        // Fallback to direct update if RPC fails
        await supabase.from('orders').update({ status: 'completed' }).eq('id', orderId);
      }
    } catch (err) {
      console.error('Error confirming order:', err);
    }
  };

  // 4. Delete order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá đơn hàng này?')) return;
    try {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  // Filter questions based on Q&A tabs
  const filteredQuestions = questions.filter((q) => {
    if (qaFilter === 'pending') return q.status === 'pending';
    if (qaFilter === 'answered') return q.status === 'answered';
    return true;
  });

  // Filter courses based on search
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  // Filter orders based on search
  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.profiles?.full_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.profiles?.email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.courses?.title?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#0d0d15] border-r border-white/5 flex flex-col justify-between pt-20 shrink-0">
        <div className="p-4 space-y-6">
          {/* Admin Header Info */}
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-sm text-[#0a0a0f]">
              {currentUser.fullName[0] || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate text-white">{currentUser.fullName}</div>
              <div className="text-[10px] text-amber-500 font-bold tracking-wider uppercase">Quản trị viên</div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {/* SECTION 1: TỔNG QUAN */}
            <div className="space-y-1">
              <div className="px-3 py-1">Tổng Quan</div>
              <button
                onClick={() => setActiveTab('admin-panel')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  activeTab === 'admin-panel'
                    ? 'text-amber-500 bg-amber-500/10 border-l-2 border-amber-500 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                📊 <span>Admin Panel</span>
              </button>
              <Link
                href="/dashboard"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all"
              >
                🏠 <span>Dashboard của tôi</span>
              </Link>
            </div>

            {/* SECTION 2: NỘI DUNG */}
            <div className="space-y-1">
              <div className="px-3 py-1">Nội Dung</div>
              <button
                onClick={() => setActiveTab('quan-ly-khoa-hoc')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  activeTab === 'quan-ly-khoa-hoc'
                    ? 'text-amber-500 bg-amber-500/10 border-l-2 border-amber-500 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                📚 <span>Quản lý Khoá học</span>
              </button>
              <button
                onClick={() => setActiveTab('cap-khoa-hoc')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  activeTab === 'cap-khoa-hoc'
                    ? 'text-amber-500 bg-amber-500/10 border-l-2 border-amber-500 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                🔑 <span>Cấp khoá học</span>
              </button>
              <button
                onClick={() => setActiveTab('cau-hoi-hoc-vien')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  activeTab === 'cau-hoi-hoc-vien'
                    ? 'text-amber-500 bg-amber-500/10 border-l-2 border-amber-500 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                💬 <span>Câu hỏi học viên</span>
              </button>
            </div>

            {/* SECTION 3: BÁN HÀNG */}
            <div className="space-y-1">
              <div className="px-3 py-1">Bán Hàng</div>
              <button
                onClick={() => setActiveTab('quan-ly-don-hang')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  activeTab === 'quan-ly-don-hang'
                    ? 'text-amber-500 bg-amber-500/10 border-l-2 border-amber-500 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                🛒 <span>Quản lý Đơn hàng</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/5 text-[10px] text-gray-600 text-center">
          Minh AI Academy v2.0
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 min-w-0 pt-20 p-6 overflow-y-auto">
        
        {/* ========================================================
            TAB 1: ADMIN PANEL (OVERVIEW)
            ======================================================== */}
        {activeTab === 'admin-panel' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Alert Bar */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-500 text-sm flex items-center gap-2">
              <span>🔔</span>
              <span><strong>Khu vực Admin</strong> — Xin chào {currentUser.fullName}. Mọi thay đổi có hiệu lực ngay lập tức.</span>
            </div>

            {/* Main Stats Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="card-dark p-5 border border-white/5 relative overflow-hidden group">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">💵 Doanh thu hôm nay</div>
                <div className="text-xl sm:text-2xl font-black mt-2 text-white">2.572.000đ</div>
                <div className="text-[10px] text-emerald-500 font-semibold mt-1">Hôm nay (nền tảng)</div>
                <div className="absolute right-3 bottom-3 text-2xl opacity-10 group-hover:scale-110 transition-transform">💰</div>
              </div>
              <div className="card-dark p-5 border border-white/5 relative overflow-hidden group">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">📦 Đơn hàng hôm nay</div>
                <div className="text-xl sm:text-2xl font-black mt-2 text-white">14</div>
                <div className="text-[10px] text-amber-500 font-semibold mt-1">Hôm nay (nền tảng)</div>
                <div className="absolute right-3 bottom-3 text-2xl opacity-10 group-hover:scale-110 transition-transform">🛒</div>
              </div>
              <div className="card-dark p-5 border border-white/5 relative overflow-hidden group">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">👥 Tổng học viên</div>
                <div className="text-xl sm:text-2xl font-black mt-2 text-white">{profiles.length}</div>
                <div className="text-[10px] text-sky-500 font-semibold mt-1">Tài khoản đăng ký</div>
                <div className="absolute right-3 bottom-3 text-2xl opacity-10 group-hover:scale-110 transition-transform">👤</div>
              </div>
              <div className="card-dark p-5 border border-white/5 relative overflow-hidden group">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">📈 Tổng doanh thu</div>
                <div className="text-xl sm:text-2xl font-black mt-2 text-[#22C55E]">{(totalRevenue + 199954000).toLocaleString()}đ</div>
                <div className="text-[10px] text-gray-500 mt-1">Tất cả thời gian (nền tảng)</div>
                <div className="absolute right-3 bottom-3 text-2xl opacity-10 group-hover:scale-110 transition-transform">📊</div>
              </div>
              <div className="card-dark p-5 border border-white/5 relative overflow-hidden group">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">🔑 Doanh thu cấp khóa</div>
                <div className="text-xl sm:text-2xl font-black mt-2 text-[#a855f7]">689.921.000đ</div>
                <div className="text-[10px] text-[#a855f7] font-semibold mt-1">174 đơn cấp khóa</div>
                <div className="absolute right-3 bottom-3 text-2xl opacity-10 group-hover:scale-110 transition-transform">🔑</div>
              </div>
            </div>

            {/* Đơn hàng vật lý (Simulated row) */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2 text-gray-300">
                <span>📦</span> Đơn hàng vật lý
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card-dark p-4 flex justify-between items-center bg-white/[0.01]">
                  <div>
                    <div className="text-xl font-bold text-white">0</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Chờ thanh toán</div>
                  </div>
                  <span className="text-lg">⏳</span>
                </div>
                <div className="card-dark p-4 flex justify-between items-center bg-white/[0.01]">
                  <div>
                    <div className="text-xl font-bold text-white">0</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Chờ ship</div>
                  </div>
                  <span className="text-lg">🚢</span>
                </div>
                <div className="card-dark p-4 flex justify-between items-center bg-white/[0.01]">
                  <div>
                    <div className="text-xl font-bold text-white">0</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Đang vận chuyển</div>
                  </div>
                  <span className="text-lg">🚚</span>
                </div>
                <div className="card-dark p-4 flex justify-between items-center bg-white/[0.01]">
                  <div>
                    <div className="text-xl font-bold text-white">0</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Đã giao hôm nay</div>
                  </div>
                  <span className="text-lg">✓</span>
                </div>
              </div>
            </div>

            {/* Date Filters & Visual Charts Mockup */}
            <div className="card-dark p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-300">Bộ lọc thống kê:</span>
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    {['7', '30', '90', 'all'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setDateRange(range)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                          dateRange === range
                            ? 'bg-amber-500 text-[#0a0a0f]'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {range === 'all' ? 'Tất cả' : `${range} ngày`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="date"
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-gray-300 focus:outline-none focus:border-amber-500"
                    defaultValue="2026-05-06"
                  />
                  <span className="text-gray-500">—</span>
                  <input
                    type="date"
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-gray-300 focus:outline-none focus:border-amber-500"
                    defaultValue="2026-06-06"
                  />
                  <button className="btn-secondary py-1.5 px-3">Làm mới</button>
                  <button className="py-1.5 px-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors">Xuất báo cáo</button>
                </div>
              </div>

              {/* Dynamic Stats in Selected Range */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-bold uppercase">Doanh thu</span>
                    <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10">↑ 17597.5%</span>
                  </div>
                  <div className="text-2xl font-black mt-3 text-white">884.875.000đ</div>
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-bold uppercase">Đơn hàng</span>
                    <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10">↑ 55100%</span>
                  </div>
                  <div className="text-2xl font-black mt-3 text-white">552</div>
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-bold uppercase">Học viên mới</span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/10">★ Mới</span>
                  </div>
                  <div className="text-2xl font-black mt-3 text-white">{profiles.length}</div>
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-bold uppercase">Doanh thu TB/đơn</span>
                    <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10">↑ 67.9%</span>
                  </div>
                  <div className="text-2xl font-black mt-3 text-white">1.603.034đ</div>
                </div>
              </div>

              {/* Graphic charts simulation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Xu hướng doanh thu</div>
                  <div className="h-48 bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex items-end gap-3 justify-between relative overflow-hidden">
                    {/* Simulated vertical bars */}
                    <div className="w-8 bg-amber-500/20 hover:bg-amber-500 transition-all rounded-t-lg" style={{ height: '35%' }}><div className="text-[8px] text-center text-gray-400 pt-1">May 15</div></div>
                    <div className="w-8 bg-amber-500/20 hover:bg-amber-500 transition-all rounded-t-lg" style={{ height: '45%' }}><div className="text-[8px] text-center text-gray-400 pt-1">May 20</div></div>
                    <div className="w-8 bg-amber-500/20 hover:bg-amber-500 transition-all rounded-t-lg" style={{ height: '30%' }}><div className="text-[8px] text-center text-gray-400 pt-1">May 25</div></div>
                    <div className="w-8 bg-amber-500/20 hover:bg-amber-500 transition-all rounded-t-lg" style={{ height: '65%' }}><div className="text-[8px] text-center text-gray-400 pt-1">May 30</div></div>
                    <div className="w-8 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg" style={{ height: '90%' }}><div className="text-[8px] text-[#0a0a0f] font-bold text-center pt-1">Jun 05</div></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Doanh thu theo nhóm khóa học</div>
                  <div className="h-48 bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col justify-around">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Tạo Ảnh AI Chuyên Nghiệp (Free)</span>
                        <span className="font-semibold text-gray-400">0% (0đ)</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-600" style={{ width: '0%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Video AI Viral — Triệu View (Premium)</span>
                        <span className="font-semibold text-[#0EA5E9]">35% (310.000.000đ)</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500" style={{ width: '35%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Xây Thương Hiệu Cá Nhân Bằng AI (Premium)</span>
                        <span className="font-semibold text-amber-500">65% (574.875.000đ)</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: QUẢN LÝ KHÓA HỌC
            ======================================================== */}
        {activeTab === 'quan-ly-khoa-hoc' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black">Quản lý Khoá học</h1>
                <p className="text-xs text-gray-500 mt-1">Tạo và quản lý nội dung khoá học trên nền tảng</p>
              </div>
              <button
                onClick={() => alert('Chức năng thêm khóa học mới đang được khởi tạo qua Admin API!')}
                className="py-2 px-4 bg-amber-500 text-[#0a0a0f] font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors"
              >
                + Tạo khóa học mới
              </button>
            </div>

            {/* Search filter bar */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Courses List */}
            <div className="space-y-4">
              {filteredCourses.map((c) => (
                <div key={c.slug} className="card-dark p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl bg-white/5 p-3 rounded-2xl shrink-0">{c.image_url || '🎓'}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-white">{c.title}</h3>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          Đã xuất bản
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-lg">{c.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">⏱️ Chương: <strong>{c.slug === 'tao-anh-ai-chuyen-nghiep' ? 3 : 4}</strong></span>
                        <span>•</span>
                        <span>Bài học: <strong>{c.slug === 'tao-anh-ai-chuyen-nghiep' ? 12 : 12}</strong></span>
                        <span>•</span>
                        <span>Học viên: <strong>{c.slug === 'tao-anh-ai-chuyen-nghiep' ? 1250 : (c.slug === 'video-ai-viral' ? 820 : 340)}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                    <div className="text-right shrink-0">
                      <div className="text-xs text-gray-500">Giá khóa học</div>
                      <div className="text-base font-black text-amber-500 mt-0.5">
                        {c.price === 0 ? 'Miễn phí' : `${c.price.toLocaleString()}đ`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="px-3 py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold">
                        ✏️ Sửa
                      </button>
                      <button className="px-3 py-2 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 text-sky-400 rounded-xl text-xs font-semibold">
                        👥 Học viên
                      </button>
                      <Link
                        href={`/courses/${c.slug}`}
                        className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 rounded-xl text-xs font-semibold"
                      >
                        📖 Bài học
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: CẤP KHÓA HỌC
            ======================================================== */}
        {activeTab === 'cap-khoa-hoc' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black">Cấp quyền Khoá học</h1>
              <p className="text-xs text-gray-500 mt-1">Quản lý quyền truy cập khoá học cho học viên mà không cần giao dịch quét QR</p>
            </div>

            <div className="card-dark p-6 space-y-6 border border-white/5">
              <form onSubmit={handleGrantAccess} className="space-y-6">
                
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email học viên</label>
                  <input
                    type="email"
                    placeholder="vd: hocvien@gmail.com"
                    value={grantEmail}
                    onChange={(e) => setGrantEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {matchedProfile ? (
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1 font-medium">
                      <span>✓</span>
                      <span>Học viên đã đăng ký tài khoản: <strong>{matchedProfile.full_name}</strong></span>
                    </div>
                  ) : (
                    grantEmail.trim() !== '' && (
                      <div className="text-xs text-amber-400 flex items-center gap-1.5 mt-1">
                        <span>⚠️</span>
                        <span>Không tìm thấy cục bộ. Sẽ tìm trong Supabase khi bấm nút.</span>
                      </div>
                    )
                  )}
                </div>

                {/* Checklist courses */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Chọn khoá học (có thể chọn nhiều)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.map((course) => (
                      <label
                        key={course.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.01] cursor-pointer hover:bg-white/[0.03] transition-all ${
                          selectedCoursesToGrant.includes(course.id)
                            ? 'border-amber-500 bg-amber-500/5'
                            : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCoursesToGrant.includes(course.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCoursesToGrant((prev) => [...prev, course.id]);
                            } else {
                              setSelectedCoursesToGrant((prev) =>
                                prev.filter((id) => id !== course.id)
                              );
                            }
                          }}
                          className="w-4 h-4 rounded text-amber-500 border-white/20 focus:ring-amber-500 bg-transparent"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-gray-200 truncate">{course.title}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()}đ`}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message Box */}
                {grantMessage && (
                  <div className={`p-4 rounded-xl text-xs font-semibold ${
                    grantMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {grantMessage.text}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={grantingAccess}
                  className="w-full py-3 bg-amber-500 text-[#0a0a0f] font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {grantingAccess ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0a0a0f] border-t-transparent rounded-full animate-spin" />
                      <span>Đang cấp quyền...</span>
                    </>
                  ) : (
                    <>
                      <span>Cấp quyền truy cập học viên</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: CÂU HỎI HỌC VIÊN
            ======================================================== */}
        {activeTab === 'cau-hoi-hoc-vien' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black">Câu hỏi học viên</h1>
              <p className="text-xs text-gray-500 mt-1">
                {questions.filter((q) => q.status === 'pending').length} câu hỏi đang chờ quản trị viên phản hồi
              </p>
            </div>

            {/* Q&A Filter summary row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-dark p-4 flex flex-col justify-between items-center text-center bg-white/[0.01]">
                <div className="text-2xl font-black text-white">{questions.length}</div>
                <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">Tổng câu hỏi</div>
              </div>
              <div className="card-dark p-4 flex flex-col justify-between items-center text-center bg-white/[0.01] border border-amber-500/20">
                <div className="text-2xl font-black text-amber-500">
                  {questions.filter((q) => q.status === 'pending').length}
                </div>
                <div className="text-[10px] text-amber-500/80 mt-1 uppercase tracking-wider font-bold">Chờ phản hồi</div>
              </div>
              <div className="card-dark p-4 flex flex-col justify-between items-center text-center bg-white/[0.01]">
                <div className="text-2xl font-black text-emerald-400">
                  {questions.filter((q) => q.status === 'answered').length}
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-1 uppercase tracking-wider font-bold">Đã trả lời</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start w-fit">
              <button
                onClick={() => setQaFilter('all')}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                  qaFilter === 'all' ? 'bg-amber-500 text-[#0a0a0f]' : 'text-gray-400 hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setQaFilter('pending')}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                  qaFilter === 'pending' ? 'bg-amber-500 text-[#0a0a0f]' : 'text-gray-400 hover:text-white'
                }`}
              >
                Chờ phản hồi
              </button>
              <button
                onClick={() => setQaFilter('answered')}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                  qaFilter === 'answered' ? 'bg-amber-500 text-[#0a0a0f]' : 'text-gray-400 hover:text-white'
                }`}
              >
                Đã trả lời
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((q) => (
                <div key={q.id} className="card-dark p-6 space-y-4 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-[#0a0a0f]">
                        {q.profiles?.full_name?.[0] || 'S'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-200">{q.profiles?.full_name}</div>
                        <div className="text-[10px] text-gray-500">{q.profiles?.email}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-bold text-gray-500">
                        ⏱️ {new Date(q.created_at).toLocaleDateString('vi-VN')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        q.status === 'answered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {q.status === 'answered' ? 'Đã trả lời' : 'Chờ phản hồi'}
                      </span>
                    </div>
                  </div>

                  {/* Course tag badge */}
                  <div className="text-[10px] text-sky-400 bg-sky-500/5 px-2.5 py-1 rounded-lg border border-sky-500/10 w-fit font-bold">
                    📘 {q.courses?.title}
                  </div>

                  {/* Question text */}
                  <div className="text-sm text-gray-300 leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/5">
                    {q.question_text}
                  </div>

                  {/* Admin Reply details */}
                  {q.status === 'answered' ? (
                    <div className="ml-6 border-l-2 border-emerald-500 pl-4 space-y-2">
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Phản hồi của giảng viên</div>
                      <p className="text-sm text-gray-300 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">{q.answer_text}</p>
                    </div>
                  ) : (
                    <div className="ml-6 space-y-2 border-l-2 border-amber-500 pl-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Nhập phản hồi</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nhập câu trả lời..."
                          value={replyTextMap[q.id] || ''}
                          onChange={(e) =>
                            setReplyTextMap((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          className="flex-1 bg-white/5 border border-white/5 focus:border-amber-500 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                        <button
                          onClick={() => handleAnswerQuestion(q.id)}
                          className="py-2 px-4 bg-amber-500 text-[#0a0a0f] font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors shrink-0"
                        >
                          Trả lời
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: QUẢN LÝ ĐƠN HÀNG
            ======================================================== */}
        {activeTab === 'quan-ly-don-hang' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black">Quản lý Đơn hàng</h1>
                <p className="text-xs text-gray-500 mt-1">Theo dõi thanh toán và kích hoạt thủ công quyền truy cập</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 font-bold bg-white/5 py-1.5 px-3 rounded-xl border border-white/5">
                  📁 {orders.length} đơn hàng
                </span>
                <span className="text-xs text-amber-500 font-bold bg-amber-500/5 py-1.5 px-3 rounded-xl border border-amber-500/10">
                  ⏳ {pendingOrdersCount} chờ thanh toán
                </span>
              </div>
            </div>

            {/* Search filter bar */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Tìm mã đơn, tên học viên, email hoặc sản phẩm..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Orders Table Card */}
            <div className="card-dark overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-400">
                  <thead className="bg-white/[0.02] text-gray-500 uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4 font-bold">Mã Đơn</th>
                      <th className="p-4 font-bold">Khách Hàng</th>
                      <th className="p-4 font-bold">Sản Phẩm</th>
                      <th className="p-4 font-bold">Số Tiền</th>
                      <th className="p-4 font-bold">Trạng Thái</th>
                      <th className="p-4 font-bold">Nguồn</th>
                      <th className="p-4 font-bold">Thanh Toán</th>
                      <th className="p-4 font-bold text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.01]">
                          <td className="p-4 font-semibold text-white truncate max-w-[120px]">
                            {order.payment_id || order.id.substring(0, 8).toUpperCase()}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{order.profiles?.full_name || 'Học viên ẩn danh'}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{order.profiles?.email}</div>
                          </td>
                          <td className="p-4 text-gray-300 max-w-[200px] truncate">
                            {order.courses?.title || 'Khóa học'}
                          </td>
                          <td className="p-4 font-bold text-white shrink-0">
                            {order.amount === 0 ? (
                              <span className="text-emerald-400">Cấp miễn phí</span>
                            ) : (
                              `${order.amount.toLocaleString()}đ`
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              order.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {order.status === 'completed' ? 'Thành công' : 'Chờ xử lý'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]">
                              {order.payment_method === 'admin_grant' ? 'Admin Grant' : 'Direct / Bank'}
                            </span>
                          </td>
                          <td className="p-4 text-[10px] text-gray-500">
                            <div>🏦 Bank Transfer</div>
                            <div className="mt-0.5">{new Date(order.created_at).toLocaleTimeString('vi-VN')} {new Date(order.created_at).toLocaleDateString('vi-VN')}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleConfirmOrder(order.id)}
                                  className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-500 transition-colors"
                                  title="Duyệt đơn thủ công"
                                >
                                  Duyệt đơn
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                title="Xoá đơn hàng"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500 text-sm">
                          Không tìm thấy đơn hàng nào phù hợp với bộ lọc tìm kiếm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
