'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  BookOpen,
  Video,
  Award,
  Play,
  Clock,
  ArrowLeft,
  LogOut,
  Flame,
  CheckCircle2,
  Trophy,
  Dumbbell,
  Users,
  Compass,
  Filter,
} from 'lucide-react';
import { User, Lesson, Quiz, PracticeItem } from '@/lib/types';
import { getStoredUser, setStoredUser, updateUserSubject } from '@/lib/auth';
import { INITIAL_LESSONS, INITIAL_TEACHERS, INITIAL_QUIZZES, INITIAL_PRACTICE } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { getYouTubeThumbnail, YouTubeIcon } from '@/lib/youtube';
import VideoModal from '@/components/VideoModal';
import CertificateModal from '@/components/CertificateModal';

export default function StudentPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'lessons' | 'quizzes' | 'practice'>('lessons');

  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>(INITIAL_PRACTICE);

  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [activeVideo, setActiveVideo] = useState<Lesson | null>(null);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  // Subject filtering: defaults to student's chosen subject or 'arab-tili'
  const [subjectFilter, setSubjectFilter] = useState<string>('arab-tili');

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    if (user.subject_slug) {
      setSubjectFilter(user.subject_slug);
    }

    // Load completed lessons from localStorage
    const savedCompleted = localStorage.getItem(`devsisters_completed_${user.id}`);
    if (savedCompleted) {
      setCompletedLessons(JSON.parse(savedCompleted));
    }

    // Load live lessons
    async function loadData() {
      try {
        const { data: dbLessons } = await supabase.from('lessons').select('*');
        if (dbLessons && dbLessons.length > 0) setLessons(dbLessons);

        const { data: dbQuizzes } = await supabase.from('quizzes').select('*');
        if (dbQuizzes && dbQuizzes.length > 0) setQuizzes(dbQuizzes);
      } catch (e) {
        console.warn(e);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = () => {
    setStoredUser(null);
    router.push('/login');
  };

  const handleToggleComplete = (lessonId: string) => {
    if (!currentUser) return;
    const updated = {
      ...completedLessons,
      [lessonId]: !completedLessons[lessonId],
    };
    setCompletedLessons(updated);
    localStorage.setItem(`devsisters_completed_${currentUser.id}`, JSON.stringify(updated));
  };

  const handleSwitchSubject = async (slug: string) => {
    setSubjectFilter(slug);
    if (currentUser && slug !== 'all') {
      const updated = await updateUserSubject(currentUser.id, slug);
      if (updated) setCurrentUser(updated);
    }
  };

  if (!currentUser) return null;

  // Active Teacher for the chosen subject
  const currentSubjectTeacher = INITIAL_TEACHERS.find(
    (t) => t.slug === (subjectFilter === 'all' ? currentUser.subject_slug || 'arab-tili' : subjectFilter)
  ) || INITIAL_TEACHERS[1]; // default to Arab tili

  // Filter items based on selected subject
  const displayedLessons =
    subjectFilter && subjectFilter !== 'all'
      ? lessons.filter((l) => l.subject_slug === subjectFilter)
      : lessons;

  const displayedQuizzes =
    subjectFilter && subjectFilter !== 'all'
      ? quizzes.filter((q) => q.subject_slug === subjectFilter)
      : quizzes;

  const displayedPractice =
    subjectFilter && subjectFilter !== 'all'
      ? practiceItems.filter((p) => p.subject_slug === subjectFilter)
      : practiceItems;

  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#0d071d] text-slate-100 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#160d2e]/90 backdrop-blur-md border-b border-purple-900/40 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Saytga qaytish</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h1 className="text-lg font-black text-white">O‘quvchi Kabineti</h1>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-bold border border-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Chiqish</span>
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Student Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1d123b] via-[#170e30] to-[#120a26] border border-purple-800/40 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-pink-500/20">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Raqamli Avlod O‘quvchisi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Salom, {currentUser.name}! ✨
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Bugun o‘z oldingizga qanday yangi maqsad qo‘ydingiz?
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-xs mb-0.5">
                <Trophy className="w-4 h-4" />
                <span>Ballaringiz</span>
              </div>
              <p className="text-2xl font-black text-white">{currentUser.points || 100} ball</p>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-center">
              <div className="flex items-center justify-center gap-1 text-pink-400 font-bold text-xs mb-0.5">
                <Flame className="w-4 h-4" />
                <span>O‘zlashtirish</span>
              </div>
              <p className="text-2xl font-black text-white">{progressPercent}%</p>
            </div>

            <button
              onClick={() => setShowCertModal(true)}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/20 transition-all"
            >
              <Award className="w-4 h-4 text-pink-200" />
              <span>Sertifikatni Ko‘rish</span>
            </button>
          </div>
        </div>

        {/* Dedicated Subject Track Highlight Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/50 to-[#180f33] border border-pink-500/30 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <img
              src={currentSubjectTeacher.avatar_url}
              alt={currentSubjectTeacher.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-pink-500 shadow-lg shadow-pink-500/20 flex-shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1 justify-center sm:justify-start">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/25 text-pink-300 border border-pink-500/40 uppercase tracking-wider">
                  Tanlangan Yo‘nalishingiz
                </span>
                <span className="text-xs text-slate-400">
                  Ustoz: <strong className="text-white">{currentSubjectTeacher.name}</strong>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {currentSubjectTeacher.subject} Darslari & Mashg‘ulotlari
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                {currentSubjectTeacher.bio}
              </p>
            </div>
          </div>

          {/* Quick Subject Switcher */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#0e071e] border border-purple-700/60 w-full sm:w-auto">
              <Compass className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <select
                value={subjectFilter}
                onChange={(e) => handleSwitchSubject(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer w-full"
              >
                <option value="arab-tili" className="bg-[#160d2e]">📖 Arab tili (Lutfulloyeva Mahliyo)</option>
                <option value="ingliz-tili" className="bg-[#160d2e]">🇬🇧 Ingliz tili (Hazratova Sevinch)</option>
                <option value="sport" className="bg-[#160d2e]">🏃‍♀️ Sport (Mattiyeva Ilmira)</option>
                <option value="ona-tili" className="bg-[#160d2e]">📝 Ona tili (Hikmatulloyeva Mubina)</option>
                <option value="geografiya" className="bg-[#160d2e]">🌍 Geografiya (Ergashboyeva Gulnoza)</option>
                <option value="rus-tili" className="bg-[#160d2e]">🇷🇺 Rus tili (Normo‘minova Shaxrizoda)</option>
                <option value="kimyo" className="bg-[#160d2e]">🧪 Kimyo (Abdurashidova Farida)</option>
                <option value="all" className="bg-[#160d2e]">🌐 Barcha 7 ta fanni ko‘rish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-3 mb-8 border-b border-purple-900/40 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'lessons'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Darsliklar ({displayedLessons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'quizzes'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Testlarim ({displayedQuizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'practice'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Lug‘at & Mashqlar ({displayedPractice.length})</span>
          </button>
        </div>

        {/* TAB 1: LESSONS */}
        {activeTab === 'lessons' && (
          <div>
            {displayedLessons.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#160d2e] border border-purple-800/40">
                <BookOpen className="w-12 h-12 text-pink-400 mx-auto mb-3 opacity-60" />
                <h4 className="text-lg font-bold text-white mb-1">
                  Ushbu fan bo‘yicha darslar tez kunda yuklanadi
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Ustoz tomonidan yangi video darslar tayyorlanmoqda.
                </p>
                <button
                  onClick={() => setSubjectFilter('all')}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 text-white text-xs font-bold"
                >
                  Barcha fanlar darslarini ko‘rish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedLessons.map((lesson) => {
                  const isDone = !!completedLessons[lesson.id];
                  const teacher = INITIAL_TEACHERS.find((t) => t.slug === lesson.subject_slug);

                  return (
                    <div
                      key={lesson.id}
                      className={`rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between border ${
                        isDone
                          ? 'bg-[#15102a] border-emerald-500/40'
                          : 'bg-[#180f30] border-purple-800/40 hover:border-pink-500/40'
                      }`}
                    >
                      <div>
                        {/* YouTube Video Preview Banner */}
                        <div
                          onClick={() => setActiveVideo(lesson)}
                          className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-black/60 cursor-pointer group"
                        >
                          {getYouTubeThumbnail(lesson.video_url) ? (
                            <img
                              src={getYouTubeThumbnail(lesson.video_url)}
                              alt={lesson.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 group-hover:via-black/10 transition-colors" />

                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-pink-600 text-white flex items-center justify-center shadow-lg group-hover:scale-115 transition-transform border border-white/20">
                              <Play className="w-5 h-5 ml-0.5 fill-white" />
                            </div>
                          </div>

                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-pink-300 backdrop-blur-md">
                              {teacher?.subject || lesson.subject_slug}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white flex items-center gap-1 backdrop-blur-md">
                              <YouTubeIcon className="w-2.5 h-2.5 text-white" /> HD
                            </span>
                          </div>

                          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-pink-400" />
                            <span>{lesson.duration || '12:00'}</span>
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-white mb-2 line-clamp-2">
                          {lesson.title}
                        </h4>

                        <p className="text-xs text-slate-300 line-clamp-2 mb-6 leading-relaxed">
                          {lesson.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between gap-3">
                        <button
                          onClick={() => setActiveVideo(lesson)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-pink-600/20"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Darsni ko‘rish</span>
                        </button>

                        <button
                          onClick={() => handleToggleComplete(lesson.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                            isDone
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                          title={isDone ? 'Tugatildi deb belgilangan' : 'Tugatilgan deb belgilash'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: QUIZZES */}
        {activeTab === 'quizzes' && (
          <div>
            {displayedQuizzes.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#160d2e] border border-purple-800/40">
                <Award className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
                <h4 className="text-lg font-bold text-white mb-1">
                  Ushbu fan bo‘yicha testlar tez kunda qo‘shiladi
                </h4>
                <button
                  onClick={() => setSubjectFilter('all')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold mt-2"
                >
                  Barcha testlarni ko‘rish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-6 rounded-3xl bg-[#180f30] border border-purple-800/40 hover:border-pink-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
                        {quiz.questions?.length || 0} ta savol
                      </span>
                      <h4 className="text-lg font-bold text-white mb-2">{quiz.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-300 mb-6">{quiz.description}</p>
                    </div>

                    <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                      <span className="text-xs text-pink-300 font-semibold">
                        Har bir to‘g‘ri javob: +10 ball
                      </span>
                      <Link
                        href="/#testlar"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-pink-600/30"
                      >
                        Testni yechish →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRACTICE */}
        {activeTab === 'practice' && (
          <div>
            {displayedPractice.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#160d2e] border border-purple-800/40">
                <Dumbbell className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
                <h4 className="text-lg font-bold text-white mb-1">
                  Mashqlar va lug‘at tez kunda joylanadi
                </h4>
                <button
                  onClick={() => setSubjectFilter('all')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold mt-2"
                >
                  Barcha mashqlarni ko‘rish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPractice.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-3xl bg-[#180f30] border border-purple-800/40"
                  >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-3">
                      {item.category === 'vocabulary' ? 'Lug‘at' : 'Sport mashqi'}
                    </span>
                    <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                    {item.data.word && (
                      <p className="text-2xl font-black text-pink-300 mb-1">{item.data.word}</p>
                    )}
                    {item.data.translation && (
                      <p className="text-sm text-slate-300 mb-3">{item.data.translation}</p>
                    )}
                    <Link
                      href="/#amaliyot"
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-block mt-2"
                    >
                      Amaliyot sahifasida ochish →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      <VideoModal
        lesson={activeVideo}
        onClose={() => setActiveVideo(null)}
      />

      {/* Student Official Certificate Modal */}
      {currentUser && (
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          studentName={currentUser.name}
          courseName={`devsisters.uz ${currentSubjectTeacher.subject} Kursi`}
          scorePercent={progressPercent >= 50 ? 100 : 90}
        />
      )}
    </main>
  );
}
