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
} from 'lucide-react';
import { User, Lesson, Quiz, PracticeItem } from '@/lib/types';
import { getStoredUser, setStoredUser } from '@/lib/auth';
import { INITIAL_LESSONS, INITIAL_TEACHERS, INITIAL_QUIZZES, INITIAL_PRACTICE } from '@/lib/data';
import { supabase } from '@/lib/supabase';
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

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

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

  if (!currentUser) return null;

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
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1d123b] via-[#170e30] to-[#120a26] border border-purple-800/40 shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
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
            <span>Video Darsliklar ({lessons.length})</span>
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
            <span>Testlarim ({quizzes.length})</span>
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
            <span>Lug‘at & Mashqlar ({practiceItems.length})</span>
          </button>
        </div>

        {/* TAB 1: LESSONS */}
        {activeTab === 'lessons' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => {
                const isDone = !!completedLessons[lesson.id];
                const teacher = INITIAL_TEACHERS.find((t) => t.slug === lesson.subject_slug);

                return (
                  <div
                    key={lesson.id}
                    className={`rounded-3xl p-6 transition-all flex flex-col justify-between border ${
                      isDone
                        ? 'bg-[#15102a] border-emerald-500/40'
                        : 'bg-[#180f30] border-purple-800/40 hover:border-pink-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                          {teacher?.subject || lesson.subject_slug}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-pink-400" />
                          <span>{lesson.duration || '12:00'}</span>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white mb-2 line-clamp-2">
                        {lesson.title}
                      </h4>

                      <p className="text-xs text-slate-300 line-clamp-3 mb-6 leading-relaxed">
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
          </div>
        )}

        {/* TAB 2: QUIZZES */}
        {activeTab === 'quizzes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
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

        {/* TAB 3: PRACTICE */}
        {activeTab === 'practice' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceItems.map((item) => (
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
          courseName="devsisters.uz Raqamli Avlod Ta‘lim Kursi"
          scorePercent={progressPercent >= 50 ? 100 : 85}
        />
      )}
    </main>
  );
}
