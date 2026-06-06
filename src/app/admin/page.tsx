import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCourses } from '@/lib/supabase/queries';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const metadata = {
  title: 'Admin Control Center',
  description: 'Trang quản trị Minh AI Academy.',
};

export default async function AdminPage() {
  const supabase = await createClient();

  // 1. Get current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Fetch profile details and check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin' || user.email?.endsWith('@minhai.academy');
  if (!isAdmin) {
    redirect('/dashboard');
  }

  const fullName = profile?.full_name || user.user_metadata?.full_name || 'Quản trị viên';

  // 3. Fetch all profiles from Supabase for admin control
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: false });

  // 4. Fetch all orders with profiles and courses details
  const { data: orders } = await supabase
    .from('orders')
    .select('id, user_id, course_id, amount, status, payment_method, payment_id, created_at, profiles(full_name, email), courses(title)')
    .order('created_at', { ascending: false });

  // 5. Fetch all course templates
  const allCourses = await getCourses();

  // 6. Try to fetch student questions from database (with fallback if table is not yet created)
  let initialQuestions: any[] = [];
  try {
    const { data: questions } = await supabase
      .from('student_questions')
      .select('id, user_id, course_id, question_text, status, answer_text, created_at, profiles(full_name, email), courses(title)')
      .order('created_at', { ascending: false });
    if (questions) {
      initialQuestions = questions;
    }
  } catch (e) {
    console.warn('student_questions table not found. Using high-fidelity fallback mock data.');
  }

  return (
    <AdminDashboardClient
      initialProfiles={profiles || []}
      initialOrders={(orders as any) || []}
      initialCourses={allCourses.map((c) => ({
        id: c.id || '',
        slug: c.slug,
        title: c.title,
        description: c.description,
        price: c.price,
        image_url: c.thumbnail,
        published: true,
      }))}
      initialQuestions={initialQuestions}
      currentUser={{
        id: user.id,
        email: user.email || '',
        fullName: fullName,
      }}
    />
  );
}
