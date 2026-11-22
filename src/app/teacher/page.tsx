'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Video,
  Plus,
  Play,
  Clock,
  Edit2,
  Trash2,
  Save,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Eye,
  LogOut,
  User as UserIcon,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { User, Lesson, Teacher } from '@/lib/types';
import { getStoredUser, setStoredUser } from '@/lib/auth';
import { INITIAL_LESSONS, INITIAL_TEACHERS } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { getYouTubeThumbnail, getYouTubeId, YouTubeIcon } from '@/lib/youtube';
import VideoModal from '@/components/VideoModal';
import CommunityChat from '@/components/CommunityChat';

export default function TeacherPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'lessons' | 'community'>('lessons');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Video preview modal
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  // Lesson Edit / Add modal
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isNewLesson, setIsNewLesson] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    async function loadTeacherData() {
      setLoading(true);
      try {
        const subjectSlug = user?.subject_slug || 'ingliz-tili';

        const { data: dbLessons, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('subject_slug', subjectSlug)
          .order('order_num', { ascending: true });

        if (!error && dbLessons && dbLessons.length > 0) {
          setLessons(dbLessons);
        } else {
          const localL = localStorage.getItem('devsisters_lessons');
          const allL: Lesson[] = localL ? JSON.parse(localL) : INITIAL_LESSONS;
          setLessons(allL.filter((l) => l.subject_slug === subjectSlug));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadTeacherData();
  }, [router]);

  const handleLogout = () => {
    setStoredUser(null);
    router.push('/login');
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !currentUser) return;

    try {
      const subjectSlug = currentUser.subject_slug || 'ingliz-tili';
      let updated: Lesson[];

      if (isNewLesson) {
        const payload = {
          title: editingLesson.title,
          description: editingLesson.description,
          video_url: editingLesson.video_url,
          duration: editingLesson.duration || '12:00',
          subject_slug: subjectSlug,
          order_num: lessons.length + 1,
        };
        const { data: insData, error: insErr } = await supabase.from('lessons').insert([payload]).select();
        const savedItem: Lesson = insData && insData[0] ? insData[0] : { ...payload, id: crypto.randomUUID() };
        updated = [...lessons, savedItem];
      } else {
        updated = lessons.map((l) => (l.id === editingLesson.id ? editingLesson : l));
        await supabase
          .from('lessons')
          .update({
            title: editingLesson.title,
            description: editingLesson.description,
            video_url: editingLesson.video_url,
            duration: editingLesson.duration,
          })
          .eq('id', editingLesson.id);
      }

      setLessons(updated);

      // Also update master list in localStorage
      const localL = localStorage.getItem('devsisters_lessons');
      let allL: Lesson[] = localL ? JSON.parse(localL) : INITIAL_LESSONS;
      if (isNewLesson) {
        allL.push(updated[updated.length - 1]);
      } else {
        allL = allL.map((l) => (l.id === editingLesson.id ? editingLesson : l));
      }
      localStorage.setItem('devsisters_lessons', JSON.stringify(allL));

      setEditingLesson(null);
      setIsNewLesson(false);
      setStatusMessage({ type: 'success', text: 'Video dars muvaffaqiyatli saqlandi!' });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Saqlashda xatolik yuz berdi.' });
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Darsni o‘chirmoqchimisiz?')) return;

    const updated = lessons.filter((l) => l.id !== id);
    setLessons(updated);

    const localL = localStorage.getItem('devsisters_lessons');
    let allL: Lesson[] = localL ? JSON.parse(localL) : INITIAL_LESSONS;
    allL = allL.filter((l) => l.id !== id);
    localStorage.setItem('devsisters_lessons', JSON.stringify(allL));

    await supabase.from('lessons').delete().eq('id', id);
    setStatusMessage({ type: 'success', text: 'Dars o‘chirildi.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  if (!currentUser) return null;

  return (
    <main className="min-h-screen bg-[#0d071d] text-slate-100 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#160d2e]/90 backdrop-blur-md border-b border-purple-900/40 px-3 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Saytga qaytish</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0" />
            <h1 className="text-sm sm:text-lg font-black text-white truncate">O‘qituvchi Kabineti</h1>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-bold border border-white/10 transition-colors flex-shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Chiqish</span>
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Teacher Profile Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1d123b] via-[#170e30] to-[#120a26] border border-purple-800/40 shadow-xl mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-pink-500 shadow-xl flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fan ustozi: {currentUser.subject_slug?.replace('-', ' ').toUpperCase()}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
              Xush kelibsiz, {currentUser.name}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-4 max-w-2xl">
              Ushbu paneldan yangi video darsliklar yuklashingiz, mavzular konspektlarini kiritishingiz va darslarni to‘g‘ridan-to‘g‘ri boshqarishingiz mumkin.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                Email: {currentUser.email}
              </span>
              <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold">
                Jami yuklangan darslar: {lessons.length} ta
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingLesson({
                id: '',
                title: '',
                subject_slug: currentUser.subject_slug || 'ingliz-tili',
                description: '',
                video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '12:00',
                order_num: lessons.length + 1,
              });
              setIsNewLesson(true);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 self-center sm:self-start flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi Video Dars Yuklash</span>
          </button>
        </div>

        {/* Teacher Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 mb-8 border-b border-purple-900/40 pb-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'lessons'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Darslarim ({lessons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'community'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Jonli Chat & O‘quvchilar bilan muloqot</span>
          </button>
        </div>

        {activeTab === 'community' ? (
          <div className="animate-fade-in">
            <CommunityChat currentUser={currentUser} />
          </div>
        ) : (
          <div>
            {/* Lesson Editor / Upload Form */}
        {editingLesson && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-[#1b1035] border-2 border-pink-500/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-pink-400" />
                <span>{isNewLesson ? 'Yangi Video Darslik Yuklash' : 'Darsni Tahrirlash'}</span>
              </h3>
              <button
                onClick={() => setEditingLesson(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Bekor qilish ✕
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Dars Sarlavhasi / Mavzu nomi
                </label>
                <input
                  type="text"
                  required
                  value={editingLesson.title}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, title: e.target.value })
                  }
                  placeholder="Masalan: 2-dars: Fe‘llar zamoni va gap tuzish qoidalari"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Video Havolasi (YouTube yoki to‘g‘ridan-to‘g‘ri video URL)
                </label>
                <input
                  type="url"
                  required
                  value={editingLesson.video_url}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, video_url: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=... yoki https://...mp4"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 YouTube video havolasi (masalan, Unlisted / Yashirin) kiriting. U saytda to‘g‘ridan-to‘g‘ri ochiladi.
                </p>

                {editingLesson.video_url && getYouTubeId(editingLesson.video_url) && (
                  <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-purple-800/50 flex items-center gap-3">
                    <img
                      src={getYouTubeThumbnail(editingLesson.video_url)}
                      alt="YouTube Preview"
                      className="w-24 h-14 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>YouTube video aniqlandi</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Ushbu video devsisters.uz pleyerida moslashuvchan ravishda to‘g‘ridan-to‘g‘ri ochiladi.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Dars Davomiyligi
                </label>
                <input
                  type="text"
                  required
                  value={editingLesson.duration}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, duration: e.target.value })
                  }
                  placeholder="Masalan: 14:30"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Dars Mazmuni va Konspekti (Tavsif)
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingLesson.description}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, description: e.target.value })
                  }
                  placeholder="Ushbu darsda o‘quvchilar nimalarni o‘rganadi va qanday vazifalar berilgan..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-purple-900/40">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Saqlash va Saytga Chiqarish</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lessons List Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span>Siz yuklagan darsliklar ro‘yxati</span>
            </h3>
            <span className="text-xs text-slate-400">
              O‘quvchilar bu darslarni asosiy sahifada ko‘ra oladi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-3xl p-5 sm:p-6 bg-[#180f30] border border-purple-800/40 hover:border-pink-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* YouTube Thumbnail Preview */}
                  <div
                    onClick={() => setPreviewLesson(lesson)}
                    className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-black/60 cursor-pointer group"
                  >
                    {getYouTubeThumbnail(lesson.video_url) ? (
                      <img
                        src={getYouTubeThumbnail(lesson.video_url)}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      </div>
                    </div>

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white flex items-center gap-1">
                        <YouTubeIcon className="w-3 h-3 text-white" /> HD
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-pink-400" />
                      <span>{lesson.duration || '12:00'}</span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2 line-clamp-2">
                    {lesson.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-6">
                    {lesson.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono truncate max-w-[140px]">
                    {lesson.video_url}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingLesson(lesson);
                        setIsNewLesson(false);
                      }}
                      className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-colors"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {lessons.length === 0 && (
            <div className="text-center py-16 bg-[#160d2b]/60 rounded-3xl border border-dashed border-purple-800/40">
              <p className="text-slate-400 text-sm mb-4">Siz hali birorta dars yuklamadingiz.</p>
              <button
                onClick={() => {
                  setEditingLesson({
                    id: '',
                    title: '',
                    subject_slug: currentUser.subject_slug || 'ingliz-tili',
                    description: '',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    duration: '12:00',
                    order_num: 1,
                  });
                  setIsNewLesson(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs"
              >
                Birinchi darsni yuklash
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </div>

      {/* Video Modal Preview */}
      <VideoModal
        lesson={previewLesson}
        onClose={() => setPreviewLesson(null)}
      />
    </main>
  );
}
