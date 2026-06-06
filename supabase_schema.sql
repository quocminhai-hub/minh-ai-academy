-- 1. Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can update their own profile." on public.profiles;
create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Trigger to automatically create profile on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists first
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Courses table
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  description text,
  price bigint not null default 0,
  old_price bigint,
  image_url text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

drop policy if exists "Courses are viewable by everyone." on public.courses;
create policy "Courses are viewable by everyone." on public.courses
  for select using (true);

drop policy if exists "Only admins can modify courses." on public.courses;
create policy "Only admins can modify courses." on public.courses
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 4. Lessons table
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses on delete cascade not null,
  title text not null,
  slug text not null,
  description text,
  video_url text,
  duration integer default 0, -- minutes
  order_index integer not null,
  is_free boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (course_id, order_index)
);

alter table public.lessons enable row level security;

drop policy if exists "Lessons are viewable by everyone." on public.lessons;
create policy "Lessons are viewable by everyone." on public.lessons
  for select using (true);

drop policy if exists "Only admins can modify lessons." on public.lessons;
create policy "Only admins can modify lessons." on public.lessons
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 5. Orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  amount bigint not null,
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  payment_method text,
  payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

drop policy if exists "Users can view their own orders." on public.orders;
create policy "Users can view their own orders." on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "Only admins can view/modify all orders." on public.orders;
create policy "Only admins can view/modify all orders." on public.orders
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 6. Blog Posts table
create table if not exists public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  image_url text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_id uuid references public.profiles on delete set null
);

alter table public.blog_posts enable row level security;

drop policy if exists "Published blog posts are viewable by everyone." on public.blog_posts;
create policy "Published blog posts are viewable by everyone." on public.blog_posts
  for select using (published = true or exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

drop policy if exists "Only admins can modify blog posts." on public.blog_posts;
create policy "Only admins can modify blog posts." on public.blog_posts
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ==========================================
-- SEED DATA
-- ==========================================

-- Insert Courses
insert into public.courses (slug, title, description, price, old_price, image_url, published)
values 
('tao-anh-ai-chuyen-nghiep', 'Tạo Ảnh AI Chuyên Nghiệp', 'Thành thạo Midjourney, DALL-E 3, Stable Diffusion — tạo ảnh AI chất lượng cao cho thương hiệu cá nhân và kinh doanh.', 0, null, '🎨', true),
('video-ai-viral', 'Video AI Viral — Triệu View', 'Tạo video AI chuyên nghiệp với Sora, Runway, Kling — xây kênh triệu view trên YouTube, TikTok, Reels.', 1990000, 3990000, '🎬', true),
('xay-thuong-hieu-ca-nhan-bang-ai', 'Xây Thương Hiệu Cá Nhân Bằng AI', 'Hệ thống hoàn chỉnh xây dựng thương hiệu cá nhân — từ định vị, tạo nội dung đến bán hàng tự động với AI Agent.', 4990000, 9990000, '🚀', true)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  old_price = excluded.old_price,
  image_url = excluded.image_url,
  published = excluded.published;

-- Insert Lessons for 'Tạo Ảnh AI Chuyên Nghiệp' (order_index 1 to 12)
insert into public.lessons (course_id, title, slug, duration, order_index, is_free)
values 
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Tổng quan về AI tạo ảnh', 'tong-quan-ve-ai-tao-anh', 15, 1, true),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'So sánh các công cụ: Midjourney vs DALL-E vs SD', 'so-sanh-cac-cong-cu', 20, 2, true),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Cách tư duy prompt hiệu quả', 'cach-tu-duy-prompt-hieu-qua', 25, 3, true),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Thiết lập tài khoản & workspace', 'thiet-lap-tai-khoan-workspace', 15, 4, true),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Cú pháp prompt Midjourney A-Z', 'cu-phap-prompt-midjourney', 30, 5, false),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Parameters nâng cao (--ar, --s, --c)', 'parameters-nang-cao', 20, 6, false),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Kỹ thuật Style Reference', 'ky-thuat-style-reference', 25, 7, false),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Tạo bộ ảnh nhất quán cho thương hiệu', 'tao-bo-anh-nhat-quan', 30, 8, false),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Tạo ảnh avatar & banner cá nhân', 'tao-anh-avatar-banner-ca-nhan', 20, 9, false),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Thiết kế ảnh quảng cáo Facebook', 'thiet-ke-anh-quang-cao-facebook', 25, 10, false),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Tạo thumbnail YouTube triệu view', 'tao-thumbnail-youtube-trieu-view', 25, 11, false),
((select id from public.courses where slug = 'tao-anh-ai-chuyen-nghiep'), 'Xây bộ Visual Identity bằng AI', 'xay-bo-visual-identity-bang-ai', 30, 12, false)
on conflict (course_id, order_index) do update set
  title = excluded.title,
  slug = excluded.slug,
  duration = excluded.duration,
  is_free = excluded.is_free;

-- Insert Lessons for 'Video AI Viral — Triệu View' (order_index 1 to 12)
insert into public.lessons (course_id, title, slug, duration, order_index, is_free)
values 
((select id from public.courses where slug = 'video-ai-viral'), 'Video AI là gì? Tại sao là cơ hội vàng?', 'video-ai-co-hoi-vang', 15, 1, true),
((select id from public.courses where slug = 'video-ai-viral'), 'So sánh Sora vs Runway vs Kling AI', 'so-sanh-cac-cong-cu-video-ai', 20, 2, true),
((select id from public.courses where slug = 'video-ai-viral'), 'Workflow tạo video từ ý tưởng → xuất bản', 'workflow-tao-video-ai', 25, 3, false),
((select id from public.courses where slug = 'video-ai-viral'), 'Thiết lập công cụ & tài khoản', 'thiet-lap-cong-cu-video-ai', 15, 4, false),
((select id from public.courses where slug = 'video-ai-viral'), 'Cấu trúc prompt video hoàn hảo', 'cau-truc-prompt-video', 30, 5, false),
((select id from public.courses where slug = 'video-ai-viral'), 'Camera movement & cinematic techniques', 'camera-movement-cinematic', 20, 6, false),
((select id from public.courses where slug = 'video-ai-viral'), 'Kỹ thuật consistency giữ nhân vật nhất quán', 'consistency-nhan-vat-video-ai', 30, 7, false),
((select id from public.courses where slug = 'video-ai-viral'), 'Text-to-Video vs Image-to-Video', 'text-to-video-vs-image-to-video', 25, 8, false),
((select id from public.courses where slug = 'video-ai-viral'), 'Nghiên cứu niche & đối thủ bằng AI', 'nghien-cuu-niche-doi-thu-ai', 25, 9, false),
((select id from public.courses where slug = 'video-ai-viral'), 'Tạo kịch bản viral với ChatGPT', 'tao-kich-ban-viral-chatgpt', 30, 10, false),
((select id from public.courses where slug = 'video-ai-viral'), 'Thuật toán YouTube Shorts & TikTok 2026', 'thuat-toan-shorts-tiktok-2026', 20, 11, false),
((select id from public.courses where slug = 'video-ai-viral'), 'Kiếm tiền từ YouTube Partner Program', 'kiem-tien-youtube-partner', 30, 12, false)
on conflict (course_id, order_index) do update set
  title = excluded.title,
  slug = excluded.slug,
  duration = excluded.duration,
  is_free = excluded.is_free;

-- Insert Lessons for 'Xây Thương Hiệu Cá Nhân Bằng AI' (order_index 1 to 12)
insert into public.lessons (course_id, title, slug, duration, order_index, is_free)
values 
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Tìm điểm mạnh & USP của bạn', 'tim-diem-manh-usp', 20, 1, true),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Nghiên cứu thị trường bằng AI', 'nghien-cuu-thi-truong-ai', 25, 2, true),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Xây dựng Brand Story hấp dẫn', 'xay-dung-brand-story', 30, 3, false),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Hệ thống tạo 30 bài/tháng bằng AI', 'he-thong-tao-30-bai-thang-ai', 30, 4, false),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Copywriting chuyển đổi cao', 'copywriting-chuyen-doi-cao', 25, 5, false),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Repurpose 1 nội dung → 10 nền tảng', 'repurpose-noi-dung-da-nen-tang', 30, 6, false),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Đóng gói kiến thức thành khóa học', 'dong-goi-kien-thuc-khoa-hoc', 30, 7, false),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Xây website All-in-One bằng AI', 'xay-website-all-in-one-bang-ai', 35, 8, false),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Landing page chuyển đổi cao', 'landing-page-chuyen-doi-cao', 30, 9, false),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Hệ thống thanh toán tự động', 'he-thong-thanh-toan-tu-dong', 30, 10, false),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Chatbot AI tư vấn & chốt đơn', 'chatbot-ai-tu-van-chot-don', 30, 11, false),
((select id from public.courses where slug = 'xay-thuong-hieu-ca-nhan-bang-ai'), 'Email marketing tự động', 'email-marketing-tu-dong-ai', 25, 12, false)
on conflict (course_id, order_index) do update set
  title = excluded.title,
  slug = excluded.slug,
  duration = excluded.duration,
  is_free = excluded.is_free;

-- Insert Blog Posts (4 entries)
insert into public.blog_posts (slug, title, excerpt, content, image_url, published)
values 
(
  'huong-dan-midjourney-v6', 
  'Hướng Dẫn Midjourney v6 Từ Cơ Bản Đến Nâng Cao', 
  'Khám phá các kỹ thuật viết prompt mới nhất trong Midjourney v6 để tạo ra những tác phẩm nghệ thuật AI chân thực nhất.', 
  '# Hướng Dẫn Midjourney v6 Từ Cơ Bản Đến Nâng Cao\n\nMidjourney v6 là một bước nhảy vọt lớn trong thế giới hình ảnh nghệ thuật tạo từ AI...\n\n## 1. Cú pháp viết prompt mới\n\nTránh viết các cụm từ sáo rỗng như "hyperrealistic", "4k", "photorealistic". Thay vào đó, hãy mô tả chi tiết bằng ngôn ngữ tự nhiên...\n\n## 2. Tính năng Style Reference (--sref)\n\nSử dụng style reference để giữ tính nhất quán của màu sắc và nét vẽ...', 
  '🎨', 
  true
),
(
  'sora-va-tuong-lai-nganh-lam-phim', 
  'Sora và Tương Lai Của Ngành Làm Phim Quảng Cáo', 
  'Sự xuất hiện của OpenAI Sora đang định hình lại cách chúng ta sản xuất video. Cơ hội hay thách thức cho các Film Creator?', 
  '# Sora và Tương Lai Của Ngành Làm Phim Quảng Cáo\n\nOpenAI Sora đã làm cả thế giới kinh ngạc với khả năng tạo video 60 giây chân thực chỉ từ mô tả văn bản...\n\n## 1. Tiết kiệm chi phí sản xuất\n\nCác doanh nghiệp nhỏ giờ đây có thể tự tạo các video quảng cáo chất lượng điện ảnh mà không cần ngân sách hàng trăm triệu...\n\n## 2. Sự trỗi dậy của các "Solo Creator"\n\nMột người làm phim có thể tự hoàn thành một dự án lớn nhờ sự hỗ trợ đắc lực từ Sora và các công cụ AI khác...', 
  '🎬', 
  true
),
(
  'xay-dung-ai-agent-ban-hang-tu-dong', 
  'Xây Dựng AI Agent Bán Hàng Tự Động 24/7', 
  'Tìm hiểu cách tích hợp Chatbot AI thông minh vào Fanpage và Website để tự động hóa khâu tư vấn, chăm sóc khách hàng.', 
  '# Xây Dựng AI Agent Bán Hàng Tự Động 24/7\n\nTự động hóa bán hàng không còn là câu chuyện của tương lai. Với các LLM tiên tiến, bạn có thể dạy AI hiểu sản phẩm của bạn...\n\n## 1. Chuẩn bị tài liệu nguồn (Knowledge Base)\n\nTải lên danh sách sản phẩm, bảng giá và kịch bản tư vấn thường gặp...\n\n## 2. Tích hợp AI Agent\n\nKết nối AI Agent với các kênh phân phối của bạn như Website, Messenger, Zalo...', 
  '🚀', 
  true
),
(
  '5-cong-cu-ai-viet-content-tieng-viet-tot-nhat', 
  '5 Công Cụ AI Viết Content Tiếng Việt Tốt Nhất 2026', 
  'Đánh giá thực tế các công cụ AI viết bài SEO, social content bằng tiếng Việt mượt mà và tự nhiên nhất.', 
  '# 5 Công Cụ AI Viết Content Tiếng Việt Tốt Nhất 2026\n\nViết content tiếng Việt bằng AI từng gặp nhiều rào cản về ngữ nghĩa và giọng điệu. Nhưng giờ đây...\n\n## 1. Claude 3.5 Sonnet / Claude 4\n\nLuôn đứng đầu về khả năng viết tự nhiên, sâu sắc và cực kỳ hiểu ngữ cảnh văn hóa Việt Nam...\n\n## 2. ChatGPT Plus (GPT-4o)\n\nPhù hợp cho việc lên outline, brainstorming và viết bài quảng cáo ngắn...', 
  '✍️', 
  true
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  image_url = excluded.image_url,
  published = excluded.published;

-- ==========================================
-- USER PROGRESS (LMS tracking)
-- ==========================================
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade not null,
  completed boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, lesson_id)
);

alter table public.user_progress enable row level security;

drop policy if exists "Users can view and update their own progress." on public.user_progress;
create policy "Users can view and update their own progress." on public.user_progress
  for all using (auth.uid() = user_id);

-- Additional policies for orders
drop policy if exists "Users can insert their own orders." on public.orders;
create policy "Users can insert their own orders." on public.orders
  for insert with check (auth.uid() = user_id);

-- Security definer function to confirm orders (bypassing RLS securely)
create or replace function public.confirm_order(order_id uuid)
returns void as $$
begin
  update public.orders
  set status = 'completed'
  where id = order_id;
end;
$$ language plpgsql security definer;


-- 7. Student Questions table (for lesson Q&A support)
create table if not exists public.student_questions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade,
  question_text text not null,
  status text default 'pending' check (status in ('pending', 'answered')),
  answer_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.student_questions enable row level security;

-- Policies for student questions
drop policy if exists "Users can view and insert their own questions." on public.student_questions;
create policy "Users can view and insert their own questions." on public.student_questions
  for all using (auth.uid() = user_id);

drop policy if exists "Admins can view and update all questions." on public.student_questions;
create policy "Admins can view and update all questions." on public.student_questions
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
