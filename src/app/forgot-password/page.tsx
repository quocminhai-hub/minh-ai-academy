import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Quên mật khẩu',
  description: 'Khôi phục mật khẩu tài khoản Minh AI Academy.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20" style={{ background: 'radial-gradient(ellipse at top, #0a1628 0%, #0a0a0f 60%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/images/minh-avatar.png"
            alt="Minh AI Academy"
            width={56}
            height={56}
            className="w-14 h-14 rounded-2xl mb-4 object-cover inline-block border border-white/10"
          />
          <h1 className="text-2xl font-bold text-white">Quên mật khẩu?</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        {/* ForgotPasswordForm Client Component */}
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

