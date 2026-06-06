import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received PayOS Webhook:', body);

    const { data, code } = body;

    // Code "00" represents success in PayOS
    if (code === '00' && data) {
      const description = data.description || '';
      // Extract the order prefix like MADXXXXXX or NADXXXXXX (case-insensitive)
      const match = description.match(/(?:[MN]AD)?([0-9A-Fa-f]{8})/i);
      
      if (match && match[1]) {
        const orderPrefix = match[1].toLowerCase();
        const supabase = await createClient();

        // Search for the pending order starting with the code prefix
        const { data: order, error } = await supabase
          .from('orders')
          .select('id, status')
          .ilike('id', `${orderPrefix}%`)
          .eq('status', 'pending')
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Database query error in webhook:', error);
        }

        if (order) {
          // Update order to completed securely via database RPC function (bypassing RLS)
          const { error: updateError } = await supabase
            .rpc('confirm_order', { order_id: order.id });

          if (updateError) {
            console.error('Error updating order in webhook:', updateError);
          } else {
            console.log(`Order ${order.id} marked as COMPLETED successfully via webhook.`);
            
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
        console.warn(`Webhook description did not match transfer code pattern: ${description}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('PayOS Webhook Exception:', err);
    return NextResponse.json(
      { error: err?.message || 'Có lỗi xảy ra khi xử lý webhook.' },
      { status: 500 }
    );
  }
}
