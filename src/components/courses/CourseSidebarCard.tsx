'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CourseSidebarCardProps {
  courseId: string;
  coursePrice: number;
  courseOriginalPrice?: number;
  courseSlug: string;
  isFree: boolean;
  isEnrolled: boolean;
  isLoggedIn: boolean;
}

export default function CourseSidebarCard({
  courseId,
  coursePrice,
  courseOriginalPrice,
  courseSlug,
  isFree,
  isEnrolled,
  isLoggedIn,
}: CourseSidebarCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnrollOrPurchase = async () => {
    if (!isLoggedIn) {
      router.push(`/register?redirectTo=/courses/${courseSlug}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create pending order
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Không thể tạo yêu cầu thanh toán.');
      }

      // Redirect to payment url (either simulate URL or real PayOS URL)
      router.push(result.paymentUrl);
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err?.message || 'Có lỗi xảy ra khi bắt đầu thanh toán.');
      setLoading(false);
    }
  };

  return (
    <div className="card-dark p-6 sticky top-24">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
          {error}
        </div>
      )}

      <div className="text-center mb-6">
        {isFree ? (
          <div className="text-3xl font-extrabold text-[#22C55E]">Miễn phí</div>
        ) : (
          <>
            {courseOriginalPrice && (
              <div className="text-lg text-gray-600 line-through">{courseOriginalPrice.toLocaleString()}đ</div>
            )}
            <div className="text-3xl font-extrabold text-[#0EA5E9]">{coursePrice.toLocaleString()}đ</div>
            {courseOriginalPrice && (
              <div className="text-sm text-[#22C55E] mt-1">
                Tiết kiệm {((1 - coursePrice / courseOriginalPrice) * 100).toFixed(0)}%
              </div>
            )}
          </>
        )}
      </div>

      {isEnrolled ? (
        <Link
          href={`/courses/${courseSlug}/learn`}
          className="btn-primary w-full justify-center py-3 text-base mb-3 text-center"
        >
          ▶ Vào học ngay
        </Link>
      ) : (
        <button
          onClick={handleEnrollOrPurchase}
          disabled={loading}
          className="btn-primary w-full justify-center py-3 text-base mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang xử lý...</span>
            </div>
          ) : isFree ? (
            '🚀 Học miễn phí ngay'
          ) : (
            '🛒 Mua khóa học'
          )}
        </button>
      )}

      {!isLoggedIn && (
        <Link
          href={`/login?redirectTo=/courses/${courseSlug}`}
          className="btn-secondary w-full justify-center py-2.5 text-sm text-center"
        >
          Đăng nhập để học
        </Link>
      )}

      <div className="mt-6 space-y-3 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>
          Truy cập trọn đời
        </div>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>
          Cập nhật nội dung miễn phí
        </div>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>
          Hỗ trợ qua cộng đồng
        </div>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>
          Chứng chỉ hoàn thành
        </div>
      </div>
    </div>
  );
}
