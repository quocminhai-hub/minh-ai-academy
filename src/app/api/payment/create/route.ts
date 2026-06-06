import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Vui lòng đăng nhập để tiếp tục.' },
        { status: 401 }
      );
    }

    // 2. Parse body
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { message: 'Mã khóa học không hợp lệ.' },
        { status: 400 }
      );
    }

    // 3. Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { message: 'Không tìm thấy khóa học.' },
        { status: 404 }
      );
    }

    // Check if course is free
    if (course.price === 0) {
      return NextResponse.json(
        { message: 'Khóa học này miễn phí, không cần thanh toán.' },
        { status: 400 }
      );
    }

    // 4. Create pending order in Database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        course_id: course.id,
        amount: course.price,
        status: 'pending',
        payment_method: 'bank_transfer',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Database order creation error:', orderError);
      return NextResponse.json(
        { message: 'Không thể tạo đơn hàng trong cơ sở dữ liệu.' },
        { status: 500 }
      );
    }

    // 5. Payment Link Generation
    // We check if PayOS is configured, otherwise fallback to local Simulation Mode
    const hasPayos = !!(
      process.env.PAYOS_CLIENT_ID &&
      process.env.PAYOS_API_KEY &&
      process.env.PAYOS_CHECKSUM_KEY
    );

    if (hasPayos) {
      // In a real production setup, we would call PayOS API here:
      // const payOS = new PayOS(clientId, apiKey, checksumKey);
      // const paymentLinkRes = await payOS.createPaymentLink(paymentData);
      // return NextResponse.json({ paymentUrl: paymentLinkRes.checkoutUrl });
      
      // Let's implement the skeleton / fallback for now to be safe,
      // or if they input dummy keys, redirect to simulation page.
      const paymentUrl = `/payment/simulate?orderId=${order.id}`;
      return NextResponse.json({ paymentUrl });
    } else {
      // Simulation mode
      const paymentUrl = `/payment/simulate?orderId=${order.id}`;
      return NextResponse.json({ paymentUrl });
    }
  } catch (err: any) {
    console.error('API Payment Create Error:', err);
    return NextResponse.json(
      { message: err?.message || 'Có lỗi xảy ra trong quá trình xử lý.' },
      { status: 500 }
    );
  }
}
