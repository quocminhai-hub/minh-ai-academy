// Demo data: Khóa học
export interface Course {
  id?: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  badge: 'free' | 'premium' | 'new';
  thumbnail: string;
  lessons: number;
  duration: string;
  students: number;
  level: string;
  category: string;
  chapters: { title: string; lessons: string[] }[];
}

export const courses: Course[] = [
  {
    slug: 'tao-anh-ai-chuyen-nghiep',
    title: 'Tạo Ảnh AI Chuyên Nghiệp',
    description: 'Thành thạo Midjourney, DALL-E 3, Stable Diffusion — tạo ảnh AI chất lượng cao cho thương hiệu cá nhân và kinh doanh.',
    longDescription: 'Khóa học toàn diện giúp bạn làm chủ các công cụ tạo ảnh AI hàng đầu hiện nay. Từ việc viết prompt chuẩn đến kỹ thuật nâng cao như inpainting, outpainting, style transfer. Sau khóa học, bạn có thể tạo ra ảnh chuyên nghiệp cho mạng xã hội, quảng cáo, và thương hiệu cá nhân.',
    price: 0,
    badge: 'free',
    thumbnail: '🎨',
    lessons: 24,
    duration: '8 giờ',
    students: 1250,
    level: 'Cơ bản → Nâng cao',
    category: 'AI Image',
    chapters: [
      {
        title: 'Module 1: Nền tảng AI Image',
        lessons: ['Tổng quan về AI tạo ảnh', 'So sánh các công cụ: Midjourney vs DALL-E vs SD', 'Cách tư duy prompt hiệu quả', 'Thiết lập tài khoản & workspace']
      },
      {
        title: 'Module 2: Midjourney Mastery',
        lessons: ['Cú pháp prompt Midjourney A-Z', 'Parameters nâng cao (--ar, --s, --c)', 'Kỹ thuật Style Reference', 'Tạo bộ ảnh nhất quán cho thương hiệu']
      },
      {
        title: 'Module 3: Ứng dụng thực chiến',
        lessons: ['Tạo ảnh avatar & banner cá nhân', 'Thiết kế ảnh quảng cáo Facebook', 'Tạo thumbnail YouTube triệu view', 'Xây bộ Visual Identity bằng AI']
      }
    ]
  },
  {
    slug: 'video-ai-viral',
    title: 'Video AI Viral — Triệu View',
    description: 'Tạo video AI chuyên nghiệp với Sora, Runway, Kling — xây kênh triệu view trên YouTube, TikTok, Reels.',
    longDescription: 'Khóa học độc quyền dạy bạn cách sử dụng các công cụ Video AI mới nhất để tạo nội dung viral. Học cách viết kịch bản, tạo video, edit và tối ưu thuật toán để đạt triệu view. Phương pháp đã giúp 500+ học viên xây kênh thành công.',
    price: 1990000,
    originalPrice: 3990000,
    badge: 'premium',
    thumbnail: '🎬',
    lessons: 42,
    duration: '16 giờ',
    students: 820,
    level: 'Trung cấp → Chuyên sâu',
    category: 'AI Video',
    chapters: [
      {
        title: 'Module 1: Nền tảng Video AI',
        lessons: ['Video AI là gì? Tại sao là cơ hội vàng?', 'So sánh Sora vs Runway vs Kling AI', 'Workflow tạo video từ ý tưởng → xuất bản', 'Thiết lập công cụ & tài khoản']
      },
      {
        title: 'Module 2: Prompt Engineering cho Video',
        lessons: ['Cấu trúc prompt video hoàn hảo', 'Camera movement & cinematic techniques', 'Kỹ thuật consistency giữ nhân vật nhất quán', 'Text-to-Video vs Image-to-Video']
      },
      {
        title: 'Module 3: Xây kênh triệu view',
        lessons: ['Nghiên cứu niche & đối thủ bằng AI', 'Tạo kịch bản viral với ChatGPT', 'Thuật toán YouTube Shorts & TikTok 2026', 'Lịch đăng bài & tối ưu metadata']
      },
      {
        title: 'Module 4: Monetize & Scale',
        lessons: ['Kiếm tiền từ YouTube Partner Program', 'Bán sản phẩm số qua video', 'Automation: Lên lịch & đăng tự động', 'Case study: Từ 0 → 1M view trong 30 ngày']
      }
    ]
  },
  {
    slug: 'xay-thuong-hieu-ca-nhan-bang-ai',
    title: 'Xây Thương Hiệu Cá Nhân Bằng AI',
    description: 'Hệ thống hoàn chỉnh xây dựng thương hiệu cá nhân — từ định vị, tạo nội dung đến bán hàng tự động với AI Agent.',
    longDescription: 'Khóa học cao cấp nhất của Minh AI Academy. Bạn sẽ được hướng dẫn xây dựng hệ thống thương hiệu cá nhân hoàn chỉnh: từ định vị bản thân, tạo nội dung AI đa nền tảng, xây website bán khóa học, đến thiết lập AI Agent bán hàng tự động 24/7.',
    price: 4990000,
    originalPrice: 9990000,
    badge: 'new',
    thumbnail: '🚀',
    lessons: 68,
    duration: '32 giờ',
    students: 340,
    level: 'Chuyên sâu',
    category: 'Personal Brand',
    chapters: [
      {
        title: 'Module 1: Định vị Thương hiệu Cá nhân',
        lessons: ['Tìm điểm mạnh & USP của bạn', 'Nghiên cứu thị trường bằng AI', 'Xây dựng Brand Story hấp dẫn', 'Thiết kế Visual Identity (logo, màu, font)']
      },
      {
        title: 'Module 2: Content Machine',
        lessons: ['Hệ thống tạo 30 bài/tháng bằng AI', 'Copywriting chuyển đổi cao', 'Repurpose 1 nội dung → 10 nền tảng', 'SEO & Organic Traffic']
      },
      {
        title: 'Module 3: Sản phẩm số & Website',
        lessons: ['Đóng gói kiến thức thành khóa học', 'Xây website All-in-One bằng AI', 'Landing page chuyển đổi cao', 'Hệ thống thanh toán tự động']
      },
      {
        title: 'Module 4: AI Agent Bán hàng',
        lessons: ['Chatbot AI tư vấn & chốt đơn', 'Email marketing tự động', 'Funnel bán hàng 24/7', 'Scale lên 100tr/tháng với AI']
      }
    ]
  }
];
