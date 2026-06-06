import Image from 'next/image';
import Link from 'next/link';
import { getCourses } from '@/lib/supabase/queries';

export default async function HomePage() {
  const courses = await getCourses();
  return (
    <div className="bg-[#0a0a0f] min-h-screen text-white overflow-x-hidden">
      {/* ============ HERO SECTION ============ */}
      <section className="pt-24 sm:pt-36 pb-12 sm:pb-24 relative">
        {/* Glow Effects */}
        <div className="glow-blue animate-pulse-glow" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, opacity: 0.12 }} />
        <div className="glow-purple animate-pulse-glow" style={{ top: '30%', right: '-5%', width: 300, height: 300, opacity: 0.08, animationDelay: '2s' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 sm:mb-8 text-xs sm:text-sm font-medium" style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)', color: '#0EA5E9' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
            Đã giúp 2,000+ học viên ứng dụng AI thành công
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] mb-4 sm:mb-6">
            Làm Chủ{' '}
            <span className="gradient-text-blue">AI Ứng Dụng</span>
            <br className="hidden sm:block" />{' '}
            Thực Chiến Cùng{' '}
            <span className="gradient-text-accent">Minh</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed">
            Từ <strong className="text-white">tạo ảnh AI</strong>, <strong className="text-white">video viral triệu view</strong> đến <strong className="text-white">xây thương hiệu cá nhân</strong> — tất cả đều dễ dàng khi bạn có đúng phương pháp. <em className="text-[#0EA5E9]">&quot;AI dễ lắm — để Minh chỉ cho&quot;</em>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/courses" className="btn-primary text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 justify-center">
              🚀 Khám phá khóa học miễn phí
            </Link>
            <Link href="#about" className="btn-secondary text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 justify-center">
              Tìm hiểu thêm →
            </Link>
          </div>

          {/* Avatar */}
          <div className="mt-10 sm:mt-14 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#06B6D4] opacity-50 blur-md" />
              <Image
                src="/images/minh-avatar.png"
                alt="Minh - AI Expert"
                width={180}
                height={180}
                className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-2 border-[#0a0a0f]"
                priority
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="text-[#0EA5E9]">👥</span> 2,000+ học viên
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#8B5CF6]">🎬</span> 3 khóa học
            </span>
            <span className="flex items-center gap-1.5">
              ⭐⭐⭐⭐⭐ <span className="ml-1">4.9/5</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============ PAIN POINTS ============ */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-14">
            Bạn có đang <span className="text-[#EF4444]">mắc kẹt</span> với những điều này?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              { emoji: '😫', title: 'Muốn dùng AI nhưng không biết bắt đầu từ đâu', desc: 'Quá nhiều công cụ, quá nhiều thông tin. Học lung tung trên mạng nhưng không áp dụng được.' },
              { emoji: '📉', title: 'Tạo nội dung mãi mà không ai xem', desc: 'Đăng video, ảnh đều đặn nhưng chỉ được vài chục view. Không hiểu thuật toán muốn gì.' },
              { emoji: '🤷', title: 'Có chuyên môn nhưng chẳng ai biết đến', desc: 'Bạn giỏi thật sự, nhưng không biết cách xây thương hiệu để thu hút khách hàng.' },
              { emoji: '⏰', title: 'Làm việc kiệt sức mà thu nhập không tăng', desc: 'Tư vấn từng người, trả tin nhắn đến nửa đêm. Không có thời gian cho bản thân.' },
            ].map((item, i) => (
              <div key={i} className="card-dark p-6 hover:border-red-500/20">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-gray-400">
            👇 <em>Tất cả đều giải quyết được — bằng AI, đúng phương pháp, đúng người chỉ.</em>
          </p>
        </div>
      </section>

      {/* ============ ROADMAP ============ */}
      <section id="roadmap" className="section-padding bg-[#0d0d14]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
              Lộ Trình <span className="gradient-text-blue">4 Bước</span> Từ Minh
            </h2>
            <p className="text-gray-400">Từ người mới → Thành thạo AI → Thu nhập tự động</p>
          </div>

          <div className="space-y-5">
            {[
              { step: 1, color: '#0EA5E9', icon: '🎨', title: 'LÀM CHỦ TẠO ẢNH AI', subtitle: 'Midjourney, DALL-E, Stable Diffusion', items: ['Viết prompt chuẩn — ra ảnh đẹp ngay lần đầu', 'Tạo ảnh thương hiệu, avatar, banner', 'Không cần biết thiết kế', 'Từ ý tưởng → ảnh chuyên nghiệp trong 30 giây'] },
              { step: 2, color: '#8B5CF6', icon: '🎬', title: 'TẠO VIDEO AI VIRAL', subtitle: 'Sora, Runway, Kling — Triệu view', items: ['Tạo video chuyên nghiệp không cần quay', 'Kịch bản viral với công thức đã kiểm chứng', 'Hiểu thuật toán YouTube, TikTok, Reels', '1 video/ngày dễ dàng, không kiệt sức'] },
              { step: 3, color: '#06B6D4', icon: '🚀', title: 'XÂY THƯƠNG HIỆU CÁ NHÂN', subtitle: 'Từ vô danh → Chuyên gia uy tín', items: ['Định vị bản thân & tìm USP độc nhất', 'Hệ thống tạo 30 bài/tháng bằng AI', 'Xây website & landing page chuyển đổi cao', 'Tạo sản phẩm số bán tự động 24/7'] },
              { step: 4, color: '#22C55E', icon: '🤖', title: 'AI AGENT BÁN HÀNG TỰ ĐỘNG', subtitle: 'Hệ thống kiếm tiền 24/7', items: ['AI Agent tư vấn & chốt đơn tự động', 'Email marketing nurture lead 24/7', 'Chatbot thông minh thay bạn trả lời', 'Bạn ngủ — hệ thống vẫn bán hàng'] },
            ].map((step) => (
              <div key={step.step} className="card-dark p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-4 right-6 text-[80px] font-extrabold leading-none opacity-5" style={{ color: step.color }}>{step.step}</div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl" style={{ background: `${step.color}20` }}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: step.color }}>Bước {step.step}</div>
                      <h3 className="text-xl font-extrabold">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-300 font-medium mb-4">{step.subtitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {step.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT / INSTRUCTOR ============ */}
      <section id="about" className="section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-14">
            Minh <span className="gradient-text-blue">Là Ai?</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/20 via-[#8B5CF6]/10 to-transparent blur-xl" />
                <Image
                  src="/images/minh-avatar.png"
                  alt="Minh - Chuyên gia AI"
                  width={320}
                  height={400}
                  className="relative rounded-2xl object-cover border border-white/10 w-full max-w-xs"
                />
              </div>
            </div>
            <div className="lg:col-span-3 space-y-5">
              <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                Chuyên gia đào tạo <span className="gradient-text-blue">AI ứng dụng thực chiến</span> hàng đầu Việt Nam
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Xin chào! Mình là <strong className="text-white">Minh</strong> — người sáng lập Minh AI Academy. Với niềm đam mê giúp mọi người tiếp cận AI một cách dễ hiểu và thực tế nhất, mình đã xây dựng hệ thống đào tạo giúp hàng nghìn người Việt Nam ứng dụng AI vào công việc và kinh doanh.
              </p>
              <div className="space-y-3">
                {[
                  { emoji: '🎓', text: 'Founder Minh AI Academy — Hệ sinh thái đào tạo AI thực chiến' },
                  { emoji: '👥', text: 'Đã đào tạo 2,000+ học viên thành thạo AI' },
                  { emoji: '🎬', text: 'Chuyên gia Video AI & Personal Branding' },
                  { emoji: '🤖', text: 'Tiên phong ứng dụng AI Agent vào kinh doanh tự động' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg shrink-0">{item.emoji}</span>
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
              <blockquote className="border-l-2 border-[#0EA5E9] pl-4 italic text-gray-400 text-sm">
                &quot;AI dễ lắm — để Minh chỉ cho. Mình tin rằng ai cũng có thể làm chủ AI nếu được hướng dẫn đúng cách.&quot;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COURSES PREVIEW ============ */}
      <section className="section-padding bg-[#0d0d14]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-3">
            Khóa Học <span className="gradient-text-accent">Nổi Bật</span>
          </h2>
          <p className="text-center text-gray-400 mb-10 sm:mb-14">Chọn lộ trình phù hợp với bạn</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className="card-dark p-5 sm:p-6 group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{course.thumbnail}</div>
                <div className="mb-3">
                  <span className={course.badge === 'free' ? 'badge-free' : course.badge === 'new' ? 'badge-new' : 'badge-premium'}>
                    {course.badge === 'free' ? 'Miễn phí' : course.badge === 'new' ? 'Mới' : 'Premium'}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-[#0EA5E9] transition-colors">{course.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                  <span>{course.lessons} bài học</span>
                  <span>{course.students.toLocaleString()} học viên</span>
                </div>
                <div className="mt-3 text-right">
                  {course.price === 0 ? (
                    <span className="text-[#22C55E] font-bold">Miễn phí</span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      {course.originalPrice && (
                        <span className="text-xs text-gray-600 line-through">{course.originalPrice.toLocaleString()}đ</span>
                      )}
                      <span className="text-[#0EA5E9] font-bold">{course.price.toLocaleString()}đ</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/courses" className="btn-secondary py-3 px-8">
              Xem tất cả khóa học →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-14">
            Học viên nói gì về <span className="gradient-text-blue">Minh AI Academy?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: 'Anh Tuấn', role: 'Freelancer', text: 'Từ khi học khóa Tạo Ảnh AI, mình đã kiếm thêm 15-20tr/tháng từ dịch vụ thiết kế bằng AI. Quá xứng đáng!', stars: 5 },
              { name: 'Chị Hương', role: 'Content Creator', text: 'Video AI giúp mình đăng 2 video/ngày dễ dàng. Kênh TikTok mình đã đạt 500K followers sau 3 tháng.', stars: 5 },
              { name: 'Anh Phong', role: 'Doanh nhân', text: 'Khóa Thương Hiệu Cá Nhân giúp mình xây được hệ thống bán khóa học tự động. Doanh thu tăng 300%.', stars: 5 },
              { name: 'Chị Lan', role: 'Giáo viên', text: 'Mình không biết gì về AI, nhưng cách Minh dạy rất dễ hiểu. Giờ mình dùng AI hàng ngày cho công việc.', stars: 5 },
              { name: 'Anh Khoa', role: 'Developer', text: 'Mình đã biết code nhưng khóa học mở ra hướng kiếm tiền mới với AI content. Rất thực chiến!', stars: 5 },
              { name: 'Chị My', role: 'Bác sĩ', text: 'Nhờ xây thương hiệu cá nhân bằng AI, phòng khám mình có thêm rất nhiều bệnh nhân mới tìm đến.', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="card-dark p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <svg key={j} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] flex items-center justify-center text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section id="free-offer" className="section-padding bg-[#0d0d14] relative overflow-hidden">
        <div className="glow-blue animate-pulse-glow" style={{ bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, opacity: 0.1 }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-6">🎁</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
            Nhận <span className="gradient-text-blue">Tài Liệu AI</span> Miễn Phí
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Đăng ký ngay để nhận bộ tài liệu &quot;50 Prompt AI Thực Chiến&quot; — giúp bạn bắt đầu hành trình làm chủ AI ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="input-dark flex-1"
            />
            <button className="btn-primary py-2.5 px-6 justify-center whitespace-nowrap">
              Nhận miễn phí 🚀
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            Miễn phí 100%. Không spam. Hủy bất kỳ lúc nào.
          </p>
        </div>
      </section>
    </div>
  );
}
