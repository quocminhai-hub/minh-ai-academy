import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập vào tài khoản Minh AI Academy để truy cập khóa học và cộng đồng.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20" style={{ background: 'radial-gradient(ellipse at top, #0a1628 0%, #0a0a0f 60%)' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/images/minh-avatar.png"
            alt="Minh AI Academy"
            width={56}
            height={56}
            className="w-14 h-14 rounded-2xl mb-4 object-cover inline-block border border-white/10"
          />
          <h1 className="text-2xl font-bold text-white">Đăng nhập</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Chào mừng trở lại — <span className="text-[#0EA5E9]">Minh AI Academy</span>
          </p>
        </div>

        {/* LoginForm Client Component with Suspense */}
        <Suspense fallback={<div className="card-dark p-8 text-center text-gray-500 animate-pulse">Đang tải form đăng nhập...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

