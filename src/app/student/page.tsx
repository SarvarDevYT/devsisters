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
  Lock,
  Unlock,
  Check,
  XCircle,
  RotateCcw,
  ChevronRight,
  X,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, Lesson, Quiz, PracticeItem } from '@/lib/types';
import { getStoredUser, setStoredUser } from '@/lib/auth';
import { INITIAL_LESSONS, INITIAL_TEACHERS, INITIAL_QUIZZES, INITIAL_PRACTICE } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { getYouTubeThumbnail, YouTubeIcon } from '@/lib/youtube';
import VideoModal from '@/components/VideoModal';
import CertificateModal from '@/components/CertificateModal';
import CommunityChat from '@/components/CommunityChat';

export default function StudentPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'lessons' | 'quizzes' | 'practice' | 'community'>('lessons');

  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>(INITIAL_PRACTICE);

  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [activeVideo, setActiveVideo] = useState<Lesson | null>(null);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [showLockedModal, setShowLockedModal] = useState<boolean>(false);

  // Quiz state
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [quizPercentage, setQuizPercentage] = useState<number>(0);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    const studentSubject = user.subject_slug || 'arab-tili';

    // Load completed lessons from localStorage
    const savedCompleted = localStorage.getItem(`devsisters_completed_${user.id}`);
    if (savedCompleted) {
      setCompletedLessons(JSON.parse(savedCompleted));
    }

    // Check if quiz was previously passed
    const passed = localStorage.getItem(`devsisters_quiz_passed_${user.id}_${studentSubject}`) === 'true';
    setQuizPassed(passed);

    // Load live data from Supabase
    async function loadData() {
      try {
        const { data: dbLessons } = await supabase.from('lessons').select('*');
        if (dbLessons && dbLessons.length > 0) setLessons(dbLessons);

        const { data: dbQuizzes } = await supabase.from('quizzes').select('*');
        if (dbQuizzes && dbQuizzes.length > 0) {
          // Merge to ensure all 7 subjects are present
          const merged = [...INITIAL_QUIZZES];
          dbQuizzes.forEach((dbQ) => {
            const idx = merged.findIndex((q) => q.subject_slug === dbQ.subject_slug);
            if (idx >= 0) {
              merged[idx] = dbQ;
            } else {
              merged.push(dbQ);
            }
          });
          setQuizzes(merged);
        }
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

  // STRICT SINGLE-SUBJECT ISOLATION
  const studentSubject = currentUser.subject_slug || 'arab-tili';

  // Dedicated Teacher for the student's chosen subject
  const currentSubjectTeacher =
    INITIAL_TEACHERS.find((t) => t.slug === studentSubject) || INITIAL_TEACHERS[1];

  // Strictly filter items for this student's chosen subject only
  const displayedLessons = lessons.filter((l) => l.subject_slug === studentSubject);
  const displayedQuizzes = quizzes.filter((q) => q.subject_slug === studentSubject);
  const displayedPractice = practiceItems.filter((p) => p.subject_slug === studentSubject);

  const completedSubjectCount = displayedLessons.filter((l) => !!completedLessons[l.id]).length;
  const progressPercent =
    displayedLessons.length > 0
      ? Math.round((completedSubjectCount / displayedLessons.length) * 100)
      : 0;

  // Certificate unlock rules:
  // 1. All lessons in this subject completed OR
  // 2. Passed quiz with >= 70%
  const isAllLessonsDone = displayedLessons.length > 0 && completedSubjectCount === displayedLessons.length;
  const isCertUnlocked = quizPassed || isAllLessonsDone;

  // Active Quiz
  const currentQuiz = displayedQuizzes[0] || INITIAL_QUIZZES.find((q) => q.subject_slug === studentSubject) || INITIAL_QUIZZES[0];
  const questions = currentQuiz?.questions || [];
  const currentQ = questions[currentQuestionIdx];

  // Quiz Handlers
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQ.correct_index) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished quiz
      const finalScore = quizScore;
      const pct = Math.round((finalScore / questions.length) * 100);
      setQuizPercentage(pct);
      setIsQuizFinished(true);

      if (pct >= 70) {
        setQuizPassed(true);
        localStorage.setItem(`devsisters_quiz_passed_${currentUser.id}_${studentSubject}`, 'true');

        // Award bonus points (+50)
        const updatedPoints = (currentUser.points || 100) + 50;
        const updatedUser = { ...currentUser, points: updatedPoints };
        setCurrentUser(updatedUser);
        setStoredUser(updatedUser);

        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#e24b80', '#a855f7', '#38bdf8', '#fbbf24', '#10b981'],
          });
        } catch (e) {
          // ignore
        }
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizFinished(false);
    setQuizPercentage(0);
  };

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
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0" />
            <h1 className="text-sm sm:text-lg font-black text-white truncate">O‘quvchi Kabineti</h1>
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
        {/* Student Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1d123b] via-[#170e30] to-[#120a26] border border-purple-800/40 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-pink-500/20 flex-shrink-0">
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
          <div className="grid grid-cols-2 sm:flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-xs mb-0.5">
                <Trophy className="w-4 h-4" />
                <span>Ballaringiz</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">{currentUser.points || 100} ball</p>
            </div>

            <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-center">
              <div className="flex items-center justify-center gap-1 text-pink-400 font-bold text-xs mb-0.5">
                <Flame className="w-4 h-4" />
                <span>O‘zlashtirish</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">{progressPercent}%</p>
            </div>

            {/* Smart Certificate Button (Locked or Unlocked) */}
            {isCertUnlocked ? (
              <button
                onClick={() => setShowCertModal(true)}
                className="col-span-2 sm:col-span-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer transform hover:scale-105"
              >
                <Award className="w-4 h-4 text-emerald-100" />
                <span>🏆 Sertifikatni Olish</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLockedModal(true)}
                className="col-span-2 sm:col-span-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer hover:border-amber-500/40 text-center"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>🔒 Sertifikat (Qulflangan)</span>
              </button>
            )}
          </div>
        </div>

        {/* Dedicated Subject Track Highlight Banner (STRICT 1-SUBJECT ISOLATION) */}
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
                  🎓 Sizning Tanlangan Yagona Yo‘nalishingiz
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

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-purple-700/40 text-center sm:text-right">
            <div>
              <p className="text-[11px] text-pink-300 font-bold uppercase tracking-wider">Biriktirilgan fan</p>
              <p className="text-sm font-black text-white">{currentSubjectTeacher.subject}</p>
            </div>
          </div>
        </div>

        {/* Tab switch */}
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
            <span>Testlarim {quizPassed ? '✅' : `(${questions.length} savol)`}</span>
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

          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'community'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Jonli Chat & Muhokama</span>
          </button>
        </div>

        {/* TAB 1: LESSONS */}
        {activeTab === 'lessons' && (
          <div>
            {displayedLessons.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#160d2e] border border-purple-800/40">
                <BookOpen className="w-12 h-12 text-pink-400 mx-auto mb-3 opacity-60" />
                <h4 className="text-lg font-bold text-white mb-1">
                  Ushbu fan bo‘yicha yangi darslar tez kunda yuklanadi
                </h4>
                <p className="text-xs text-slate-400">
                  {currentSubjectTeacher.name} tomonidan video darslar tayyorlanmoqda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedLessons.map((lesson) => {
                  const isDone = !!completedLessons[lesson.id];

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
                              {currentSubjectTeacher.subject}
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

        {/* TAB 2: QUIZZES (INTERACTIVE IN-CABINET RUNNER FOR THIS SUBJECT) */}
        {activeTab === 'quizzes' && (
          <div className="max-w-3xl mx-auto">
            {questions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#160d2e] border border-purple-800/40">
                <Award className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
                <h4 className="text-lg font-bold text-white mb-1">
                  Ushbu fan bo‘yicha test savollari tayyorlanmoqda
                </h4>
              </div>
            ) : isQuizFinished ? (
              /* Quiz Finished Summary */
              <div className="p-8 sm:p-10 rounded-3xl bg-[#180f30] border border-purple-800/50 shadow-2xl text-center">
                <div
                  className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-5 ${
                    quizPercentage >= 70
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                  }`}
                >
                  {quizPercentage >= 70 ? (
                    <Trophy className="w-10 h-10" />
                  ) : (
                    <Award className="w-10 h-10" />
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  {quizPercentage >= 70 ? '🎉 Tabriklaymiz, ajoyib natija!' : 'Urinish yakunlandi'}
                </h3>

                <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                  {quizPercentage >= 70
                    ? `Siz ${currentSubjectTeacher.subject} testi bo‘yicha ${questions.length} ta savoldan ${quizScore} tasiga to‘g‘ri javob berdingiz (${quizPercentage}%). Rasmiy sertifikat qulfi ochildi!`
                    : `Siz ${questions.length} ta savoldan ${quizScore} tasiga to‘g‘ri javob berdingiz (${quizPercentage}%). Sertifikatni ochish uchun kamida 70% to‘plash zarur. Qaytadan urinib ko‘ring.`}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {quizPercentage >= 70 && (
                    <button
                      onClick={() => setShowCertModal(true)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>🏆 Sertifikatni Ko‘rish</span>
                    </button>
                  )}

                  <button
                    onClick={handleRestartQuiz}
                    className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center gap-2 border border-white/10 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Qaytadan topshirish</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Question Runner */
              <div className="p-6 sm:p-8 rounded-3xl bg-[#180f30] border border-purple-800/40 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-purple-900/40 pb-4 mb-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
                      {currentSubjectTeacher.subject} Testi
                    </span>
                    <h4 className="text-lg font-bold text-white mt-0.5">{currentQuiz.title}</h4>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
                    Savol {currentQuestionIdx + 1} / {questions.length}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/5 h-2 rounded-full mb-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}%`,
                    }}
                  />
                </div>

                {/* Question Text */}
                <h5 className="text-base sm:text-lg font-bold text-white mb-6 leading-relaxed">
                  {currentQ?.question}
                </h5>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentQ?.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correct_index;

                    let btnClass = 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-500/20 border-rose-500/60 text-rose-200 line-through';
                      } else {
                        btnClass = 'bg-white/5 border-white/5 text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-pink-600/30 border-pink-500 text-white font-bold shadow-md shadow-pink-600/20';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-4 rounded-2xl border text-left text-sm flex items-center justify-between transition-all ${btnClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>

                        {isAnswerSubmitted && isCorrect && (
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {isAnswerSubmitted && currentQ?.explanation && (
                  <div className="mb-6 p-4 rounded-2xl bg-purple-950/40 border border-purple-700/40 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-pink-300 block mb-1">Izoh:</strong>
                    {currentQ.explanation}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    To‘g‘ri javoblar: <strong className="text-white">{quizScore}</strong>
                  </span>

                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-pink-600/20 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Javobni Tekshirish
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>
                        {currentQuestionIdx + 1 < questions.length
                          ? 'Keyingi Savol'
                          : 'Natijani Ko‘rish'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
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
                  Ushbu fanning mashg‘ulotlari tez kunda qo‘shiladi
                </h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPractice.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-3xl bg-[#180f30] border border-purple-800/40"
                  >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-3">
                      {item.category === 'vocabulary' ? 'Lug‘at boyligi' : 'Salomatlik mashqi'}
                    </span>
                    <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                    {item.data.word && (
                      <p className="text-2xl font-black text-pink-300 mb-1">{item.data.word}</p>
                    )}
                    {item.data.pronunciation && (
                      <p className="text-xs text-purple-300 mb-2 font-mono">
                        Talaffuzi: {item.data.pronunciation}
                      </p>
                    )}
                    {item.data.translation && (
                      <p className="text-sm text-slate-300 mb-3">{item.data.translation}</p>
                    )}
                    {item.data.example && (
                      <p className="text-xs text-slate-400 italic bg-white/5 p-3 rounded-xl mb-3">
                        “{item.data.example}”
                      </p>
                    )}
                    {item.data.tip && (
                      <p className="text-[11px] text-amber-300/90 font-medium">
                        💡 {item.data.tip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COMMUNITY CHAT & FORUM */}
        {activeTab === 'community' && (
          <div className="animate-fade-in">
            <CommunityChat currentUser={currentUser} />
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      <VideoModal lesson={activeVideo} onClose={() => setActiveVideo(null)} />

      {/* Student Official Certificate Modal (Unlocked) */}
      {currentUser && (
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          studentName={currentUser.name}
          courseName={`devsisters.uz ${currentSubjectTeacher.subject} Kursi`}
          scorePercent={quizPercentage >= 70 ? quizPercentage : 100}
        />
      )}

      {/* Locked Certificate Information Modal */}
      {showLockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-[#1c1138] border border-amber-500/40 shadow-2xl relative text-center">
            <button
              onClick={() => setShowLockedModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Sertifikat Hali Qulflangan 🔒
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              Hurmatli <strong className="text-pink-300">{currentUser.name}</strong>, rasmiy QR-kodli
              sertifikatga ega bo‘lish uchun quyidagi 2 ta shartdan birini bajaring:
            </p>

            <div className="space-y-3 mb-6 text-left">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Video darslarni to‘liq ko‘rib chiqing</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Holat: {completedSubjectCount} / {displayedLessons.length} ta dars yakunlandi ({progressPercent}%)
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Fanga oid testdan kamida 70% to‘plang</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    "Testlarim" bo‘limida {questions.length} ta savolga javob bering.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowLockedModal(false);
                setActiveTab('quizzes');
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 hover:scale-[1.01] transition-all cursor-pointer"
            >
              Testni Topshirishga O‘tish →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
