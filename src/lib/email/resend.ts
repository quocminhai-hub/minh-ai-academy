export async function sendActivationEmail(email: string, fullName: string, courseTitle: string) {
  const apiKey = process.env.RESEND_API_KEY;

  const emailHtml = `
    <div style="font-family: sans-serif; background-color: #0a0a0f; color: #ffffff; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.05);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #0EA5E9; font-size: 24px; font-weight: 900; margin: 0;">MINH AI ACADEMY</h1>
        <p style="color: #64748B; font-size: 12px; margin: 5px 0 0 0;">"AI dễ lắm — để Minh chỉ cho"</p>
      </div>
      
      <div style="background-color: rgba(255,255,255,0.02); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px;">
        <h2 style="font-size: 18px; margin-top: 0; color: #ffffff;">Chào mừng ${fullName},</h2>
        <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
          Cảm ơn bạn đã đăng ký khóa học <strong style="color: #0EA5E9;">${courseTitle}</strong> tại Minh AI Academy. Đơn hàng của bạn đã được kích hoạt thành công!
        </p>
        <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
          Bây giờ bạn đã có toàn quyền truy cập vào các bài giảng video, tài liệu thực hành và cộng đồng của khóa học này.
        </p>
        
        <div style="text-align: center; margin: 30px 0 20px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard" style="background-color: #0EA5E9; color: #0a0a0f; padding: 12px 30px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px;">
            Vào Học Ngay 🚀
          </a>
        </div>
      </div>
      
      <div style="text-align: center; font-size: 11px; color: #475569;">
        <p>Email này được gửi tự động bởi hệ thống Minh AI Academy.</p>
        <p>Copyright © 2026 Minh AI Academy. All rights reserved.</p>
      </div>
    </div>
  `;

  if (!apiKey) {
    console.log('--- [SIMULATED EMAIL] ---');
    console.log(`To: ${email}`);
    console.log(`Subject: Kích hoạt khóa học: ${courseTitle}`);
    console.log(`Content: Hello ${fullName}, your course has been activated!`);
    console.log('-------------------------');
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Minh AI Academy <onboarding@resend.dev>',
        to: email,
        subject: `[Minh AI Academy] Kích hoạt thành công: ${courseTitle}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    console.log('Resend email response:', data);
    return { success: res.ok, data };
  } catch (error) {
    console.error('Failed to send email via Resend:', error);
    return { success: false, error };
  }
}
