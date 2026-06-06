'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function SimulatePaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const supabase = createClient();

  const [order, setOrder] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('Mã đơn hàng không hợp lệ.');
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderErr || !orderData) {
          setError('Không tìm thấy đơn hàng.');
          setLoading(false);
          return;
        }

        setOrder(orderData);

        const { data: courseData, error: courseErr } = await supabase
          .from('courses')
          .select('*')
          .eq('id', orderData.course_id)
          .single();

        if (!courseErr) {
          setCourse(courseData);
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Có lỗi xảy ra khi tải thông tin đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, supabase]);

  const handleConfirmPayment = async () => {
    if (!orderId) return;
    setConfirming(true);

    try {
      // Securely confirm order and send activation email via API
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Không thể xác nhận thanh toán.');
      }

      // Redirect to dashboard on success
      router.push('/dashboard?payment=success');
      router.refresh();
    } catch (err: any) {
      console.error('Error confirming payment:', err);
      alert('Không thể xác nhận thanh toán: ' + err.message);
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-[#0EA5E9] mx-auto" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-400">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
        <div className="card-dark p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Lỗi thanh toán</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <Link href="/courses" className="btn-primary py-2.5 px-6 inline-block">Quay lại khóa học</Link>
        </div>
      </div>
    );
  }

  const transferCode = `MAD${order.id.slice(0, 8).toUpperCase()}`;
  // Use VietQR dynamic QR code builder for beautiful simulation
  const qrCodeUrl = `https://img.vietqr.io/image/MB-09090909999-compact2.png?amount=${order.amount}&addInfo=${transferCode}&accountName=NGUYEN%20QUOC%20MINH`;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Payment QR Mockup */}
        <div className="md:col-span-2 card-dark p-6 flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-sm text-gray-300 mb-4">Quét mã để chuyển khoản</h3>
          <div className="relative w-48 h-48 bg-white p-2 rounded-xl mb-4">
            <Image
              src={qrCodeUrl}
              alt="VietQR Payment Code"
              width={200}
              height={200}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Sử dụng ứng dụng ngân hàng quét mã QR này để tự động điền số tiền và nội dung chuyển khoản.
          </p>
        </div>

        {/* Transfer details */}
        <div className="md:col-span-3 space-y-6">
          <div className="card-dark p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">Chi tiết đơn hàng</span>
              <h2 className="text-xl font-black mt-1">{course?.title || 'Khóa học Premium'}</h2>
            </div>
            
            <div className="border-t border-white/5 pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngân hàng</span>
                <span className="font-semibold text-white">MB Bank (Quân Đội)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tài khoản</span>
                <span className="font-mono font-semibold text-white select-all">09090909999</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chủ tài khoản</span>
                <span className="font-semibold text-white">NGUYEN QUOC MINH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tiền chuyển</span>
                <span className="font-bold text-[#0EA5E9]">{order.amount.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nội dung chuyển</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 select-all">{transferCode}</span>
              </div>
            </div>
          </div>

          {/* Action Simulation */}
          <div className="card-dark p-6 border border-amber-500/20 bg-amber-500/[0.02] space-y-4">
            <h3 className="font-bold text-amber-400 flex items-center gap-2">
              <span>🛠️</span> Chế độ Giả lập Thanh toán
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Bạn đang ở trong môi trường phát triển local. Nhấn nút dưới đây để giả lập tín hiệu từ hệ thống ngân hàng (webhook) gửi về web, cập nhật trạng thái đơn hàng thành công và mở khóa khóa học lập tức.
            </p>
            <button
              onClick={handleConfirmPayment}
              disabled={confirming}
              className="btn-primary w-full justify-center py-3 text-sm font-bold disabled:opacity-50"
            >
              {confirming ? 'Đang kích hoạt...' : '✓ Xác nhận đã chuyển khoản thành công'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SimulatePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
        <p className="text-gray-400">Đang tải...</p>
      </div>
    }>
      <SimulatePaymentContent />
    </Suspense>
  );
}
