import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. Verify SePay API Key (Webhook token) if configured
    const authHeader = request.headers.get('authorization');
    const webhookToken = process.env.SEPAY_WEBHOOK_TOKEN || process.env.SEPAY_API_KEY;

    if (webhookToken) {
      const cleanToken = webhookToken.trim().toLowerCase();
      const cleanHeader = (authHeader || '').trim().toLowerCase();
      if (!cleanHeader.includes(cleanToken)) {
        console.warn(`Unauthorized SePay Webhook attempt: Token mismatch. Received header: ${authHeader}`);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();
    console.log('Received SePay Webhook:', body);

    const { content: rawContent, description, transferType, transferAmount } = body;

    // Only process incoming transfers
    if (transferType !== 'in') {
      return NextResponse.json({ success: true, message: 'Ignored non-incoming transaction' });
    }

    // SePay sends the transfer description/memo in 'content' or 'description' field
    const content = rawContent || description || '';
    // Extract the order prefix like MADXXXXXX or NADXXXXXX (strictly require prefix to avoid matching transaction numbers)
    const match = content.match(/[MN]AD([0-9A-Fa-f]{8})/i);

    if (match && match[1]) {
      const orderPrefix = match[1].toLowerCase();
      const supabase = await createClient();

      const startUuid = `${orderPrefix}-0000-0000-0000-000000000000`;
      const endUuid = `${orderPrefix}-ffff-ffff-ffff-ffffffffffff`;

      // Search for the pending order starting with the code prefix
      const { data: order, error } = await supabase
        .from('orders')
        .select('id, status, amount')
        .gte('id', startUuid)
        .lte('id', endUuid)
        .eq('status', 'pending')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Database query error in SePay webhook:', error);
      }

      if (order) {
        // Optional: Verify amount if needed (SePay transferAmount should match order.amount)
        if (transferAmount && Number(transferAmount) < Number(order.amount)) {
          console.warn(`Amount mismatch for order ${order.id}. Expected: ${order.amount}, Received: ${transferAmount}`);
          // We can still confirm it or log a warning. Let's confirm it anyway or let the admin handle it.
        }

        // Update order to completed securely via database RPC function (bypassing RLS)
        const { error: updateError } = await supabase
          .rpc('confirm_order', { order_id: order.id });

        if (updateError) {
          console.error('Error updating order in SePay webhook:', updateError);
        } else {
          console.log(`Order ${order.id} marked as COMPLETED successfully via SePay webhook.`);
          
          // Fetch order relations to send email
          const { data: orderDetails } = await supabase
            .from('orders')
            .select('*, courses(*), profiles(*)')
            .eq('id', order.id)
            .single();

          if (orderDetails) {
            const email = orderDetails.profiles?.email;
            const fullName = orderDetails.profiles?.full_name || 'Học viên';
            const courseTitle = orderDetails.courses?.title || 'Khóa học Premium';

            if (email) {
              // Import dynamic helper
              const { sendActivationEmail } = await import('@/lib/email/resend');
              await sendActivationEmail(email, fullName, courseTitle);
            }
          }
        }
      } else {
        console.warn(`No pending order found matching prefix: ${orderPrefix}`);
      }
    } else {
      console.warn(`SePay Webhook description did not match transfer code pattern: ${content}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('SePay Webhook Exception:', err);
    return NextResponse.json(
      { error: err?.message || 'Có lỗi xảy ra khi xử lý webhook.' },
      { status: 500 }
    );
  }
}
