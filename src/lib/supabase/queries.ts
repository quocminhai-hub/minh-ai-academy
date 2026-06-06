import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { courses as fallbackCourses, Course } from '@/data/courses';
import { blogPosts as fallbackBlogPosts, BlogPost } from '@/data/blog-posts';

// Create a static cookie-less client for public queries to support static prerendering
const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackCourses;
    }

    // Map Supabase course back to Course interface format
    return data.map((course: any) => {
      // Find corresponding fallback course to merge chapters and other details
      const matched = fallbackCourses.find(c => c.slug === course.slug);
      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description || '',
        longDescription: matched?.longDescription || course.description || '',
        price: Number(course.price),
        originalPrice: course.old_price ? Number(course.old_price) : undefined,
        badge: course.price === 0 ? 'free' : (course.old_price ? 'premium' : 'new') as any,
        thumbnail: course.image_url || matched?.thumbnail || '🎓',
        lessons: matched?.lessons || 12,
        duration: matched?.duration || '8 giờ',
        students: matched?.students || 100,
        level: matched?.level || 'Mọi cấp độ',
        category: matched?.category || 'AI',
        chapters: matched?.chapters || []
      };
    });
  } catch (e) {
    console.warn('Error fetching courses from Supabase, using mock data:', e);
    return fallbackCourses;
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, lessons(*)')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      return fallbackCourses.find(c => c.slug === slug) || null;
    }

    const matched = fallbackCourses.find(c => c.slug === slug);
    
    // Group lessons into chapters (either from lessons table or fall back to mock chapters)
    let chapters = matched?.chapters || [];
    if (data.lessons && data.lessons.length > 0) {
      // Sort lessons by order_index
      const sortedLessons = [...data.lessons].sort((a: any, b: any) => a.order_index - b.order_index);
      
      if (!matched) {
        chapters = [
          {
            title: 'Nội dung khóa học',
            lessons: sortedLessons.map((l: any) => l.title)
          }
        ];
      }
    }

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description || '',
      longDescription: matched?.longDescription || data.description || '',
      price: Number(data.price),
      originalPrice: data.old_price ? Number(data.old_price) : undefined,
      badge: data.price === 0 ? 'free' : (data.old_price ? 'premium' : 'new') as any,
      thumbnail: data.image_url || matched?.thumbnail || '🎓',
      lessons: data.lessons?.length || matched?.lessons || 12,
      duration: matched?.duration || '8 giờ',
      students: matched?.students || 100,
      level: matched?.level || 'Mọi cấp độ',
      category: matched?.category || 'AI',
      chapters
    };
  } catch (e) {
    console.warn(`Error fetching course ${slug} from Supabase, using mock data:`, e);
    return fallbackCourses.find(c => c.slug === slug) || null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackBlogPosts;
    }

    return data.map((post: any) => {
      const matched = fallbackBlogPosts.find(b => b.slug === post.slug);
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content || '',
        coverEmoji: post.image_url || matched?.coverEmoji || '📝',
        category: matched?.category || 'AI',
        date: new Date(post.created_at).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        readTime: matched?.readTime || '5 phút',
        tags: matched?.tags || ['AI', 'Tech']
      };
    });
  } catch (e) {
    console.warn('Error fetching blog posts from Supabase, using mock data:', e);
    return fallbackBlogPosts;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      return fallbackBlogPosts.find(b => b.slug === slug) || null;
    }

    const matched = fallbackBlogPosts.find(b => b.slug === slug);
    return {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt || '',
      content: data.content || '',
      coverEmoji: data.image_url || matched?.coverEmoji || '📝',
      category: matched?.category || 'AI',
      date: new Date(data.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      readTime: matched?.readTime || '5 phút',
      tags: matched?.tags || ['AI', 'Tech']
    };
  } catch (e) {
    console.warn(`Error fetching blog post ${slug} from Supabase, using mock data:`, e);
    return fallbackBlogPosts.find(b => b.slug === slug) || null;
  }
}
