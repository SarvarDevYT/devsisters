'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Video,
  Plus,
  Trash2,
  Edit2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Teacher, Lesson } from '@/lib/types';
import { INITIAL_TEACHERS, INITIAL_LESSONS } from '@/lib/data';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'teachers' | 'lessons'>('teachers');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Teacher Edit / Create State
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isNewTeacher, setIsNewTeacher] = useState<boolean>(false);

  // Lesson Edit / Create State
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isNewLesson, setIsNewLesson] = useState<boolean>(false);

  // Check existing session
  useEffect(() => {
    const savedAuth = typeof window !== 'undefined' ? sessionStorage.getItem('devsisters_admin_auth') : null;
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchData() {
      setLoading(true);
      try {
        // Try fetch teachers from Supabase
        const { data: dbTeachers, error: tErr } = await supabase
          .from('teachers')
          .select('*')
          .order('display_order', { ascending: true });

        if (!tErr && dbTeachers && dbTeachers.length > 0) {
          setTeachers(dbTeachers);
        } else {
          // Check localStorage or fallback to INITIAL_TEACHERS
          const localT = localStorage.getItem('devsisters_teachers');
          setTeachers(localT ? JSON.parse(localT) : INITIAL_TEACHERS);
        }

        // Try fetch lessons from Supabase
        const { data: dbLessons, error: lErr } = await supabase
          .from('lessons')
          .select('*')
          .order('order_num', { ascending: true });

        if (!lErr && dbLessons && dbLessons.length > 0) {
          setLessons(dbLessons);
        } else {
          const localL = localStorage.getItem('devsisters_lessons');
          setLessons(localL ? JSON.parse(localL) : INITIAL_LESSONS);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        const localT = localStorage.getItem('devsisters_teachers');
        setTeachers(localT ? JSON.parse(localT) : INITIAL_TEACHERS);
        const localL = localStorage.getItem('devsisters_lessons');
        setLessons(localL ? JSON.parse(localL) : INITIAL_LESSONS);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isAuthenticated]);

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin code is 'admin123' or 'devsisters2025'
    if (passwordInput === 'admin123' || passwordInput === 'devsisters2025') {
      setIsAuthenticated(true);
      sessionStorage.setItem('devsisters_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Maxfiy parol noto‘g‘ri kiritildi! (Maslahat: admin123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('devsisters_admin_auth');
  };

  // Save Teacher
  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    try {
      let updated: Teacher[];
      if (isNewTeacher) {
        const newTeacherItem: Teacher = {
          ...editingTeacher,
          id: editingTeacher.id || `t-${Date.now()}`,
          display_order: teachers.length + 1,
        };
        updated = [...teachers, newTeacherItem];

        // Supabase insert
        await supabase.from('teachers').insert([newTeacherItem]);
      } else {
        updated = teachers.map((t) => (t.id === editingTeacher.id ? editingTeacher : t));

        // Supabase update
        await supabase
          .from('teachers')
          .update({
            name: editingTeacher.name,
            subject: editingTeacher.subject,
            bio: editingTeacher.bio,
            experience: editingTeacher.experience,
            avatar_url: editingTeacher.avatar_url,
            telegram: editingTeacher.telegram,
          })
          .eq('id', editingTeacher.id);
      }

      setTeachers(updated);
      localStorage.setItem('devsisters_teachers', JSON.stringify(updated));
      setEditingTeacher(null);
      setIsNewTeacher(false);
      setStatusMessage({ type: 'success', text: 'O‘qituvchi ma‘lumotlari va rasmi muvaffaqiyatli saqlandi!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Saqlashda xatolik yuz berdi.' });
    }
  };

  // Delete Teacher
  const handleDeleteTeacher = async (id: string) => {
    if (!confirm('Haqiqatan ham ushbu o‘qituvchini o‘chirmoqchimisiz?')) return;

    try {
      const updated = teachers.filter((t) => t.id !== id);
      setTeachers(updated);
      localStorage.setItem('devsisters_teachers', JSON.stringify(updated));
      await supabase.from('teachers').delete().eq('id', id);

      setStatusMessage({ type: 'success', text: 'O‘qituvchi o‘chirildi.' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Save Lesson
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    try {
      let updated: Lesson[];
      if (isNewLesson) {
        const newLessonItem: Lesson = {
          ...editingLesson,
          id: editingLesson.id || `l-${Date.now()}`,
        };
        updated = [...lessons, newLessonItem];
        await supabase.from('lessons').insert([newLessonItem]);
      } else {
        updated = lessons.map((l) => (l.id === editingLesson.id ? editingLesson : l));
        await supabase
          .from('lessons')
          .update({
            title: editingLesson.title,
            description: editingLesson.description,
            video_url: editingLesson.video_url,
            duration: editingLesson.duration,
            subject_slug: editingLesson.subject_slug,
          })
          .eq('id', editingLesson.id);
      }

      setLessons(updated);
      localStorage.setItem('devsisters_lessons', JSON.stringify(updated));
      setEditingLesson(null);
      setIsNewLesson(false);
      setStatusMessage({ type: 'success', text: 'Dars ma‘lumotlari muvaffaqiyatli saqlandi!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Xatolik yuz berdi.' });
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Darsni o‘chirmoqchimisiz?')) return;
    const updated = lessons.filter((l) => l.id !== id);
    setLessons(updated);
    localStorage.setItem('devsisters_lessons', JSON.stringify(updated));
    await supabase.from('lessons').delete().eq('id', id);
    setStatusMessage({ type: 'success', text: 'Dars o‘chirildi.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // If not logged in, show Password prompt
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0e071e] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#1b1035] border border-purple-800/50 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-pink-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-white mb-2">devsisters.uz</h2>
          <p className="text-xs sm:text-sm text-pink-300 font-semibold mb-6">
            Admin Boshqaruv Paneliga Kirish
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Maxfiy parolni kiriting..."
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm text-center"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-pink-600/30 hover:scale-[1.01] transition-all"
            >
              Kirish
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-purple-900/40">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Bosh sahifaga qaytish</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d071d] text-slate-100 pb-20">
      {/* Top Admin Bar */}
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
            <ShieldCheck className="w-5 h-5 text-pink-400" />
            <h1 className="text-lg font-black text-white">devsisters.uz Admin Paneli</h1>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-bold border border-white/10 transition-colors"
        >
          Chiqish
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Status alert message */}
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 mb-8 border-b border-purple-900/40 pb-4 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('teachers');
              setEditingTeacher(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'teachers'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>O‘qituvchilar ({teachers.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('lessons');
              setEditingLesson(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'lessons'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Darslar ({lessons.length})</span>
          </button>
        </div>

        {/* TAB 1: TEACHERS MANAGEMENT */}
        {activeTab === 'teachers' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  O‘qituvchilarni Boshqarish
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  O‘qituvchi ismini, fani, tajribasini va rasmini yangilashingiz mumkin.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTeacher({
                    id: '',
                    name: '',
                    subject: 'Ingliz tili',
                    slug: 'ingliz-tili',
                    bio: '',
                    experience: '',
                    avatar_url: '',
                    telegram: '',
                  });
                  setIsNewTeacher(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-pink-600/25"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Ustoz Qo‘shish</span>
              </button>
            </div>

            {/* Teacher Form Modal / Inline editor */}
            {editingTeacher && (
              <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-[#1b1035] border-2 border-pink-500/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-pink-400" />
                    <span>
                      {isNewTeacher ? 'Yangi o‘qituvchi qo‘shish' : 'O‘qituvchi ma‘lumotlarini tahrirlash'}
                    </span>
                  </h3>
                  <button
                    onClick={() => setEditingTeacher(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Bekor qilish ✕
                  </button>
                </div>

                <form onSubmit={handleSaveTeacher} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      F.I.SH (Ism-Familiya)
                    </label>
                    <input
                      type="text"
                      required
                      value={editingTeacher.name}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, name: e.target.value })
                      }
                      placeholder="Masalan: Hazratova Sevinch"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Fan nomi
                    </label>
                    <input
                      type="text"
                      required
                      value={editingTeacher.subject}
                      onChange={(e) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          subject: e.target.value,
                          slug: editingTeacher.slug || e.target.value.toLowerCase().replace(/\s+/g, '-'),
                        })
                      }
                      placeholder="Masalan: Ingliz tili"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Rasm havolasi (Avatar URL)
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="url"
                        value={editingTeacher.avatar_url}
                        onChange={(e) =>
                          setEditingTeacher({ ...editingTeacher, avatar_url: e.target.value })
                        }
                        placeholder="https://... rasm havolasi"
                        className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                      />
                      {editingTeacher.avatar_url && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={editingTeacher.avatar_url}
                          alt="Ko‘rish"
                          className="w-11 h-11 rounded-xl object-cover border border-pink-500 flex-shrink-0"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Tajriba va Sertifikatlar
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.experience}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, experience: e.target.value })
                      }
                      placeholder="Masalan: IELTS 8.0 | 5 yillik tajriba"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Telegram foydalanuvchi nomi
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.telegram || ''}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, telegram: e.target.value })
                      }
                      placeholder="@foydalanuvchi_nomi"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Ustoz haqida qisqacha ma‘lumot (Bio)
                    </label>
                    <textarea
                      rows={3}
                      value={editingTeacher.bio}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, bio: e.target.value })
                      }
                      placeholder="Dars berish uslubi va yutuqlari haqida..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-purple-900/40">
                    <button
                      type="button"
                      onClick={() => setEditingTeacher(null)}
                      className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-semibold"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Saqlash</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Teachers Table / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((t) => (
                <div
                  key={t.id || t.slug}
                  className="p-6 rounded-3xl bg-[#170e30] border border-purple-800/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'}
                        alt={t.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-pink-500/40 flex-shrink-0"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wide">
                          {t.subject}
                        </span>
                        <h4 className="text-base font-bold text-white line-clamp-1">{t.name}</h4>
                        <p className="text-xs text-amber-300/80 line-clamp-1">{t.experience}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 mb-6 leading-relaxed">
                      {t.bio}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{t.telegram || 'Telegram yo‘q'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingTeacher(t);
                          setIsNewTeacher(false);
                          window.scrollTo({ top: 100, behavior: 'smooth' });
                        }}
                        className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(t.id)}
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
          </div>
        )}

        {/* TAB 2: LESSONS MANAGEMENT */}
        {activeTab === 'lessons' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Video Darslar Boshqaruvi</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Dars qo‘shish, YouTube video havolalarini ulash va darslarni boshqarish.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingLesson({
                    id: '',
                    title: '',
                    subject_slug: teachers[0]?.slug || 'ingliz-tili',
                    description: '',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    duration: '12:00',
                    order_num: lessons.length + 1,
                  });
                  setIsNewLesson(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-600/25"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Dars Qo‘shish</span>
              </button>
            </div>

            {/* Lesson Edit / Create Form */}
            {editingLesson && (
              <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-[#1b1035] border-2 border-purple-500/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-purple-400" />
                    <span>{isNewLesson ? 'Yangi dars qo‘shish' : 'Darsni tahrirlash'}</span>
                  </h3>
                  <button
                    onClick={() => setEditingLesson(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Bekor qilish ✕
                  </button>
                </div>

                <form onSubmit={handleSaveLesson} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Dars Sarlavhasi
                    </label>
                    <input
                      type="text"
                      required
                      value={editingLesson.title}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, title: e.target.value })
                      }
                      placeholder="Masalan: 1-dars: Tanishuv va salomlashish"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Qaysi fanga tegishli?
                    </label>
                    <select
                      value={editingLesson.subject_slug}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, subject_slug: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#231545] border border-white/10 text-white focus:outline-none focus:border-purple-500 text-sm"
                    >
                      {teachers.map((t) => (
                        <option key={t.slug} value={t.slug}>
                          {t.subject} ({t.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Video havolasi (YouTube Embed yoki Havola)
                    </label>
                    <input
                      type="url"
                      required
                      value={editingLesson.video_url}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, video_url: e.target.value })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Davomiyligi (Daqiqa)
                    </label>
                    <input
                      type="text"
                      value={editingLesson.duration}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, duration: e.target.value })
                      }
                      placeholder="Masalan: 15:30"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Dars tavsifi
                    </label>
                    <textarea
                      rows={3}
                      value={editingLesson.description}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, description: e.target.value })
                      }
                      placeholder="Ushbu darsda nimalar o‘rgatiladi..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-sm"
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
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Saqlash</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lessons List */}
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-5 rounded-2xl bg-[#170e30] border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                        {lesson.subject_slug}
                      </span>
                      <span className="text-xs text-slate-400">{lesson.duration}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{lesson.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-1">{lesson.description}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingLesson(lesson);
                        setIsNewLesson(false);
                      }}
                      className="p-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold transition-colors"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
