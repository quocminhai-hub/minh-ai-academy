'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Lesson {
  id: string;
  title: string;
  slug: string;
  duration: number;
  order_index: number;
  video_url: string;
  is_free: boolean;
}

interface Course {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
}

interface LmsPlayerProps {
  course: Course;
  lessons: Lesson[];
  initialCompletedLessonIds: string[];
  userId: string;
}

export default function LmsPlayer({
  course,
  lessons,
  initialCompletedLessonIds,
  userId,
}: LmsPlayerProps) {
  const router = useRouter();
  const supabase = createClient();

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(initialCompletedLessonIds);
  const [savingProgress, setSavingProgress] = useState(false);

  const activeLesson = lessons[activeLessonIndex] || null;

  // Calculate progress percent
  const progressPercent = lessons.length > 0
    ? Math.round((completedLessonIds.length / lessons.length) * 100)
    : 0;

  const toggleLessonCompleted = async (lessonId: string) => {
    if (savingProgress) return;
    setSavingProgress(true);

    const isCurrentlyCompleted = completedLessonIds.includes(lessonId);

    try {
      if (isCurrentlyCompleted) {
        // Remove progress
        const { error } = await supabase
          .from('user_progress')
          .delete()
          .eq('user_id', userId)
          .eq('lesson_id', lessonId);

        if (!error) {
          setCompletedLessonIds(prev => prev.filter(id => id !== lessonId));
        }
      } else {
        // Add progress
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: userId,
            course_id: course.id,
            lesson_id: lessonId,
            completed: true
          });

        if (!error) {
          setCompletedLessonIds(prev => [...prev, lessonId]);
        }
      }
      router.refresh(); // Refresh layout to update progress bars elsewhere
    } catch (err) {
      console.error('Error saving progress:', err);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex(prev => prev + 1);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(prev => prev - 1);
    }
  };

  // Helper to extract YouTube video ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = activeLesson ? getYoutubeId(activeLesson.video_url) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header bar */}
      <header className="h-14 bg-[#0d0d14] border-b border-white/5 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            ← Dashboard
          </Link>
          <span className="text-gray-600">|</span>
          <span className="text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-md text-gray-300">
            {course.thumbnail} {course.title}
          </span>
        </div>
        
        {/* Progress Display */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs text-gray-500">Tiến trình học</div>
            <div className="text-xs font-semibold text-[#0EA5E9]">{progressPercent}% ({completedLessonIds.length}/{lessons.length} bài)</div>
          </div>
          <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </header>

      {/* Main player layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Video & Player details */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {activeLesson ? (
            <>
              {/* Video Player */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-black shadow-2xl">
                {youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
                    title={activeLesson.title}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-[#0c1628] to-[#0a0a0f]">
                    <div className="text-6xl mb-4">🎥</div>
                    <h3 className="text-lg font-bold mb-2">Video Bài Học Mẫu</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      Đây là bài học: &quot;{activeLesson.title}&quot;. Video bài giảng chi tiết đã được mở khóa cho tài khoản của bạn.
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation & Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevLesson}
                    disabled={activeLessonIndex === 0}
                    className="btn-secondary py-2 px-4 text-xs font-semibold justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ◀ Bài trước
                  </button>
                  <button
                    onClick={handleNextLesson}
                    disabled={activeLessonIndex === lessons.length - 1}
                    className="btn-secondary py-2 px-4 text-xs font-semibold justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Bài tiếp theo ▶
                  </button>
                </div>

                <button
                  onClick={() => toggleLessonCompleted(activeLesson.id)}
                  disabled={savingProgress}
                  className={`py-2 px-5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 border ${
                    completedLessonIds.includes(activeLesson.id)
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-[#0EA5E9] text-[#0a0a0f] border-transparent hover:bg-[#38bdf8]'
                  }`}
                >
                  {completedLessonIds.includes(activeLesson.id) ? (
                    <>
                      <span>✓ Đã hoàn thành</span>
                    </>
                  ) : (
                    <>
                      <span>Đánh dấu hoàn thành</span>
                    </>
                  )}
                </button>
              </div>

              {/* Lesson Text Content */}
              <div className="card-dark p-6 space-y-4">
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-white/5">
                  <div>
                    <span className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">Bài {activeLesson.order_index}</span>
                    <h1 className="text-xl sm:text-2xl font-black mt-1 text-white">{activeLesson.title}</h1>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 font-medium bg-white/5 py-1 px-2.5 rounded-lg border border-white/5">⏱️ {activeLesson.duration} phút</span>
                </div>
                <div className="prose prose-invert max-w-none text-sm text-gray-400 leading-relaxed">
                  <p>
                    Chào mừng bạn đến với bài học thứ {activeLesson.order_index} trong khóa học. Hãy xem kỹ nội dung video và thực hành theo các hướng dẫn.
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Thực hành viết các câu lệnh (prompts) tương ứng</li>
                    <li>Sử dụng các tài liệu đính kèm ở cộng đồng thảo luận để làm bài tập</li>
                    <li>Nếu có bất kỳ thắc mắc nào, hãy click mục &quot;Cộng đồng&quot; ở thanh điều hướng để trao đổi cùng các bạn học viên khác.</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="card-dark p-8 text-center text-gray-500">
              Không tìm thấy bài học nào trong khóa học này.
            </div>
          )}
        </div>

        {/* Sidebar curriculum listing */}
        <div className="w-full lg:w-80 bg-[#0d0d14] border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="font-bold text-sm text-gray-300">Giáo trình khóa học</h2>
            <p className="text-xs text-gray-500 mt-1">{lessons.length} bài học</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {lessons.map((lesson, index) => {
              const isActive = index === activeLessonIndex;
              const isCompleted = completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonIndex(index)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 ${
                    isActive
                      ? 'bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 text-white'
                      : 'hover:bg-white/[0.02] border border-transparent text-gray-400'
                  }`}
                >
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid selecting lesson
                      toggleLessonCompleted(lesson.id);
                    }}
                    className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs shrink-0 mt-0.5 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-[#0a0a0f]'
                        : 'border-white/20 text-transparent hover:border-[#0EA5E9]'
                    }`}
                  >
                    ✓
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs font-semibold leading-tight ${isActive ? 'text-[#0EA5E9]' : 'text-gray-300'}`}>
                      Bài {lesson.order_index}: {lesson.title}
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[10px] text-gray-500">
                      <span>⏱️ {lesson.duration} phút</span>
                      {lesson.is_free && (
                        <span className="text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.2 rounded border border-[#22C55E]/10 font-bold uppercase">Học thử</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
