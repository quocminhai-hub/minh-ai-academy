'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function RegisterForm() {
  const router = useRouter();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullname,
            role: 'student', // default role
          },
          // Email confirmation is enabled by default in new Supabase projects.
          // In development/demo, they might login directly if confirmation is disabled.
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // If user is auto-confirmed or email confirmation is off
      if (data?.session) {
        setSuccess('Đăng ký thành công! Đang chuyển hướng...');
        router.refresh();
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setSuccess('Đăng ký thành công! Vui lòng kiểm tra hộp thư email để kích hoạt tài khoản.');
        setFullname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Đã xảy ra lỗi không xác định.');
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Đã xảy ra lỗi khi kết nối Google.');
      setLoading(false);
    }
  };

  return (
    <div className="card-dark p-6 sm:p-8">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-1.5">Họ và tên</label>
          <input
            id="fullname"
            type="text"
            placeholder="Nguyễn Văn A"
            className="input-dark w-full"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            placeholder="ban@email.com"
            className="input-dark w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">Mật khẩu</label>
          <input
            id="password"
            type="password"
            placeholder="Tối thiểu 8 ký tự"
            className="input-dark w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            minLength={8}
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1.5">Xác nhận mật khẩu</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="input-dark w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-2.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang xử lý...</span>
            </div>
          ) : (
            '🚀 Tạo tài khoản miễn phí'
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs text-gray-500 uppercase tracking-wide">hoặc</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Social */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-white disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Đăng ký bằng Google
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-[#0EA5E9] font-medium hover:underline">
          Đăng nhập
        </Link>
      </p>

      <p className="text-center text-xs text-gray-600 mt-4">
        Bằng việc đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật.
      </p>
    </div>
  );
}
