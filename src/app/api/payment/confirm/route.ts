import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendActivationEmail } from '@/lib/email/resend';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Yêu cầu đăng nhập.' },
        { status: 401 }
      );
    }

    // 2. Parse body
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { message: 'Mã đơn hàng không hợp lệ.' },
        { status: 400 }
      );
    }

    // 3. Get order details along with relations
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, courses(*), profiles(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { message: 'Không tìm thấy đơn hàng.' },
        { status: 404 }
      );
    }

    // If already completed, just return success
    if (order.status === 'completed') {
      return NextResponse.json({ success: true, message: 'Đơn hàng đã hoàn thành trước đó.' });
    }

    // 4. Update order to completed securely via database RPC function (bypassing RLS)
    const { error: updateError } = await supabase
      .rpc('confirm_order', { order_id: orderId });

    if (updateError) {
      throw updateError;
    }

    // 5. Send confirmation email via Resend helper
    const email = order.profiles?.email || user.email;
    const fullName = order.profiles?.full_name || user.user_metadata?.full_name || 'Học viên';
    const courseTitle = order.courses?.title || 'Khóa học Premium';

    if (email) {
      await sendActivationEmail(email, fullName, courseTitle);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Confirm API error:', err);
    return NextResponse.json(
      { message: err?.message || 'Lỗi khi xác nhận thanh toán.' },
      { status: 500 }
    );
  }
}
