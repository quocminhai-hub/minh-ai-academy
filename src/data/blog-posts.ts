// Demo data: Blog posts
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverEmoji: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'huong-dan-viet-prompt-midjourney-2026',
    title: 'Hướng dẫn viết Prompt Midjourney chuẩn chuyên gia (2026)',
    excerpt: 'Tổng hợp kỹ thuật viết prompt Midjourney từ cơ bản đến nâng cao. Bao gồm công thức, ví dụ thực tế và tips giúp bạn tạo ảnh AI chất lượng cao.',
    content: `## Tại sao Prompt quan trọng?

Prompt chính là "ngôn ngữ" để bạn giao tiếp với AI. Một prompt tốt sẽ tạo ra kết quả chất lượng cao, tiết kiệm thời gian và tiền bạc.

## Công thức Prompt chuẩn

\`\`\`
[Subject] + [Style] + [Lighting] + [Camera Angle] + [Details] + [Parameters]
\`\`\`

### Ví dụ thực tế:

**Prompt:** "A Vietnamese entrepreneur working on laptop in modern office, cinematic lighting, 8K, photorealistic, shallow depth of field --ar 16:9 --s 750"

## 5 Tips viết Prompt hiệu quả

1. **Cụ thể hóa**: Thay vì "a cat", hãy viết "a Persian cat sitting on a velvet cushion"
2. **Thêm style**: Mention nghệ sĩ hoặc phong cách cụ thể
3. **Lighting matters**: Cinematic, golden hour, studio lighting
4. **Camera angle**: Eye-level, bird's eye, low angle
5. **Parameters**: Sử dụng --ar, --s, --c để kiểm soát output

## Kết luận

Viết prompt là một kỹ năng, và kỹ năng thì luyện được. Hãy bắt đầu với công thức trên và thực hành mỗi ngày!`,
    coverEmoji: '✨',
    category: 'AI Image',
    date: '2026-06-01',
    readTime: '8 phút',
    tags: ['Midjourney', 'Prompt', 'AI Image']
  },
  {
    slug: 'so-sanh-cong-cu-video-ai-2026',
    title: 'So sánh 5 công cụ Video AI tốt nhất 2026: Sora vs Runway vs Kling',
    excerpt: 'Đánh giá chi tiết Sora, Runway Gen-3, Kling AI, Pika Labs và Luma Dream Machine. Công cụ nào phù hợp với bạn nhất?',
    content: `## Tổng quan thị trường Video AI 2026

Năm 2026 là năm bùng nổ của Video AI. Hàng loạt công cụ mới ra đời với chất lượng ngày càng cao.

## Bảng so sánh

| Công cụ | Chất lượng | Giá | Tốc độ | Phù hợp |
|---------|-----------|-----|--------|---------|
| Sora | ⭐⭐⭐⭐⭐ | $20/tháng | Trung bình | Phim ngắn, quảng cáo |
| Runway Gen-3 | ⭐⭐⭐⭐ | $15/tháng | Nhanh | Content creator |
| Kling AI | ⭐⭐⭐⭐ | Free tier có | Nhanh | Người mới bắt đầu |
| Pika Labs | ⭐⭐⭐ | $10/tháng | Rất nhanh | Video ngắn, social |
| Luma | ⭐⭐⭐⭐ | $12/tháng | Trung bình | 3D, sci-fi |

## Lời khuyên từ Minh

Nếu bạn mới bắt đầu, hãy thử Kling AI (miễn phí) trước. Khi đã quen, nâng cấp lên Sora để có chất lượng cinema.`,
    coverEmoji: '🎥',
    category: 'AI Video',
    date: '2026-05-28',
    readTime: '12 phút',
    tags: ['Video AI', 'Sora', 'Runway', 'So sánh']
  },
  {
    slug: 'xay-thuong-hieu-ca-nhan-tu-so-0',
    title: 'Xây thương hiệu cá nhân từ số 0 với AI — Lộ trình 90 ngày',
    excerpt: 'Hướng dẫn từng bước xây dựng thương hiệu cá nhân mạnh mẽ bằng AI. Từ định vị, tạo nội dung đến kiếm tiền online.',
    content: `## Tại sao cần thương hiệu cá nhân?

Trong thời đại AI, thương hiệu cá nhân là tài sản quý giá nhất. Khi AI có thể làm mọi thứ, con người sẽ tin tưởng CON NGƯỜI hơn.

## Lộ trình 90 ngày

### Tháng 1: Định vị (Ngày 1-30)
- Tuần 1: Tìm USP (điểm độc nhất) của bạn
- Tuần 2: Nghiên cứu đối thủ bằng AI
- Tuần 3: Xây dựng Brand Story
- Tuần 4: Thiết kế Visual Identity

### Tháng 2: Tạo nội dung (Ngày 31-60)
- Đăng 1 bài/ngày trên 3 nền tảng
- Sử dụng AI để tạo ảnh + video
- Xây email list từ lead magnet

### Tháng 3: Monetize (Ngày 61-90)
- Tạo sản phẩm số đầu tiên
- Xây landing page bán hàng
- Thiết lập hệ thống tự động

## Kết quả kỳ vọng sau 90 ngày

- 5,000+ followers trên mạng xã hội
- 1,000+ email subscribers
- Doanh thu đầu tiên từ sản phẩm số`,
    coverEmoji: '🚀',
    category: 'Personal Brand',
    date: '2026-05-20',
    readTime: '15 phút',
    tags: ['Thương hiệu cá nhân', 'AI', 'Lộ trình']
  },
  {
    slug: 'chatgpt-cho-nguoi-moi-bat-dau',
    title: 'ChatGPT cho người mới: 20 cách sử dụng AI tăng năng suất gấp 10 lần',
    excerpt: 'Hướng dẫn sử dụng ChatGPT hiệu quả cho công việc hàng ngày. 20 use-case thực tế giúp bạn tiết kiệm hàng giờ mỗi ngày.',
    content: `## ChatGPT không chỉ là chatbot

ChatGPT là trợ lý AI đa năng có thể giúp bạn trong mọi lĩnh vực. Dưới đây là 20 cách sử dụng hiệu quả nhất.

## Top 20 Use Cases

1. **Viết email chuyên nghiệp** trong 30 giây
2. **Tóm tắt tài liệu dài** thành bullet points
3. **Brainstorm ý tưởng** nội dung cho 1 tháng
4. **Dịch thuật** đa ngôn ngữ chính xác
5. **Code review** và fix bugs
6. **Phân tích dữ liệu** từ bảng tính
7. **Viết copy quảng cáo** chuyển đổi cao
8. **Tạo kế hoạch dự án** chi tiết
9. **Nghiên cứu thị trường**
10. **Viết bài blog chuẩn SEO**

...và 10 use cases nữa trong khóa học miễn phí!`,
    coverEmoji: '🤖',
    category: 'AI Basics',
    date: '2026-05-15',
    readTime: '10 phút',
    tags: ['ChatGPT', 'Năng suất', 'Người mới']
  }
];
