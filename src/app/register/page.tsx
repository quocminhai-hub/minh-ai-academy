import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'Tạo tài khoản Minh AI Academy miễn phí để bắt đầu học AI ứng dụng thực chiến.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20" style={{ background: 'radial-gradient(ellipse at top, #0f0a28 0%, #0a0a0f 60%)' }}>
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
          <h1 className="text-2xl font-bold text-white">Đăng ký miễn phí</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Bắt đầu hành trình làm chủ AI cùng <span className="text-[#0EA5E9]">Minh</span>
          </p>
        </div>

        {/* RegisterForm Client Component */}
        <RegisterForm />
      </div>
    </div>
  );
}

