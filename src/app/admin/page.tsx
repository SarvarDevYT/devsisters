'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  KeyRound,
  UserCheck,
  User as UserIcon,
  MessageSquare,
  Sparkles,
  BookOpen,
  Award,
  Filter,
} from 'lucide-react';
import { Teacher, Lesson, User } from '@/lib/types';
import { INITIAL_TEACHERS, INITIAL_LESSONS } from '@/lib/data';
import { DEMO_USERS, getStoredUser, setStoredUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getYouTubeThumbnail, YouTubeIcon } from '@/lib/youtube';
import CommunityChat from '@/components/CommunityChat';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState<'teachers' | 'lessons' | 'users' | 'community'>('teachers');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters for Users tab
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');
  const [userSubjectFilter, setUserSubjectFilter] = useState<string>('all');

  // Teacher Edit / Create State
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isNewTeacher, setIsNewTeacher] = useState<boolean>(false);
  const [teacherEmail, setTeacherEmail] = useState<string>('');
  const [teacherPassword, setTeacherPassword] = useState<string>('teacher123');

  // Lesson Edit / Create State
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isNewLesson, setIsNewLesson] = useState<boolean>(false);

  // User Edit / Create State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  // Check existing session: must be admin from unified login
  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
    setCurrentUser(user);
  }, [router]);

  // Fetch initial data
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchData() {
      setLoading(true);
      try {
        // 1. Fetch teachers
        const { data: dbTeachers, error: tErr } = await supabase
          .from('teachers')
          .select('*')
          .order('display_order', { ascending: true });

        if (!tErr && dbTeachers && dbTeachers.length > 0) {
          setTeachers(dbTeachers);
        } else {
          const localT = localStorage.getItem('devsisters_teachers');
          setTeachers(localT ? JSON.parse(localT) : INITIAL_TEACHERS);
        }

        // 2. Fetch lessons
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

        // 3. Fetch users
        const { data: dbUsers, error: uErr } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (!uErr && dbUsers && dbUsers.length > 0) {
          setUsers(dbUsers);
        } else {
          const localU = localStorage.getItem('devsisters_users_list');
          setUsers(localU ? JSON.parse(localU) : DEMO_USERS);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        const localT = localStorage.getItem('devsisters_teachers');
        setTeachers(localT ? JSON.parse(localT) : INITIAL_TEACHERS);
        const localL = localStorage.getItem('devsisters_lessons');
        setLessons(localL ? JSON.parse(localL) : INITIAL_LESSONS);
        const localU = localStorage.getItem('devsisters_users_list');
        setUsers(localU ? JSON.parse(localU) : DEMO_USERS);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    setStoredUser(null);
    router.push('/login');
  };

  // Open Teacher Editor
  const handleOpenAddTeacher = () => {
    setEditingTeacher({
      id: '',
      name: '',
      subject: '',
      slug: '',
      bio: '',
      experience: '',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      telegram: '@ustoz',
    });
    setTeacherEmail('');
    setTeacherPassword('teacher123');
    setIsNewTeacher(true);
  };

  const handleOpenEditTeacher = (t: Teacher) => {
    setEditingTeacher(t);
    const existingUser = users.find(
      (u) => u.role === 'teacher' && (u.subject_slug === t.slug || u.name === t.name)
    );
    setTeacherEmail(existingUser?.email || `${t.slug}@devsisters.uz`);
    setTeacherPassword(existingUser?.password || 'teacher123');
    setIsNewTeacher(false);
  };

  // Save Teacher
  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    try {
      const generatedSlug =
        editingTeacher.slug?.trim() ||
        editingTeacher.subject
          .toLowerCase()
          .trim()
          .replace(/['‘`]/g, '')
          .replace(/\s+/g, '-');

      let updated: Teacher[];

      if (isNewTeacher) {
        const payload = {
          name: editingTeacher.name.trim(),
          subject: editingTeacher.subject.trim(),
          slug: generatedSlug,
          bio: editingTeacher.bio?.trim() || '',
          experience: editingTeacher.experience?.trim() || '',
          avatar_url:
            editingTeacher.avatar_url ||
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
          telegram: editingTeacher.telegram || '@ustoz',
          display_order: teachers.length + 1,
        };

        const { data: insData, error: insErr } = await supabase
          .from('teachers')
          .insert([payload])
          .select();

        if (insErr) {
          console.error('Teacher insert error:', insErr);
          setStatusMessage({ type: 'error', text: 'Xatolik: ' + insErr.message });
          return;
        }

        const savedTeacher: Teacher =
          insData && insData[0] ? insData[0] : { ...payload, id: crypto.randomUUID() };
        updated = [...teachers, savedTeacher];

        // Also create teacher account in users table so teacher can log in!
        const tEmail = teacherEmail.trim().toLowerCase() || `${generatedSlug}@devsisters.uz`;
        const userPayload = {
          name: editingTeacher.name.trim(),
          email: tEmail,
          password: teacherPassword.trim() || 'teacher123',
          role: 'teacher' as const,
          subject_slug: generatedSlug,
          avatar_url: savedTeacher.avatar_url,
          points: 500,
        };

        const { data: insUser } = await supabase.from('users').insert([userPayload]).select();
        if (insUser && insUser[0]) {
          const updatedUsers = [insUser[0], ...users];
          setUsers(updatedUsers);
          localStorage.setItem('devsisters_users_list', JSON.stringify(updatedUsers));
        }
      } else {
        // Update existing teacher
        await supabase
          .from('teachers')
          .update({
            name: editingTeacher.name,
            subject: editingTeacher.subject,
            slug: generatedSlug,
            bio: editingTeacher.bio,
            experience: editingTeacher.experience,
            avatar_url: editingTeacher.avatar_url,
            telegram: editingTeacher.telegram,
          })
          .eq('id', editingTeacher.id);

        updated = teachers.map((t) =>
          t.id === editingTeacher.id ? { ...editingTeacher, slug: generatedSlug } : t
        );

        // Update corresponding teacher user account
        if (teacherEmail) {
          const tEmail = teacherEmail.trim().toLowerCase();
          const existingUser = users.find(
            (u) =>
              u.role === 'teacher' &&
              (u.subject_slug === editingTeacher.slug || u.name === editingTeacher.name)
          );

          if (existingUser) {
            await supabase
              .from('users')
              .update({
                name: editingTeacher.name,
                email: tEmail,
                password: teacherPassword.trim(),
                subject_slug: generatedSlug,
                avatar_url: editingTeacher.avatar_url,
              })
              .eq('id', existingUser.id);

            const updatedUsers = users.map((u) =>
              u.id === existingUser.id
                ? {
                    ...u,
                    name: editingTeacher.name,
                    email: tEmail,
                    password: teacherPassword.trim(),
                    subject_slug: generatedSlug,
                  }
                : u
            );
            setUsers(updatedUsers);
            localStorage.setItem('devsisters_users_list', JSON.stringify(updatedUsers));
          } else {
            const userPayload = {
              name: editingTeacher.name,
              email: tEmail,
              password: teacherPassword.trim() || 'teacher123',
              role: 'teacher' as const,
              subject_slug: generatedSlug,
              avatar_url: editingTeacher.avatar_url,
              points: 500,
            };
            const { data: insUser } = await supabase.from('users').insert([userPayload]).select();
            if (insUser && insUser[0]) {
              const updatedUsers = [insUser[0], ...users];
              setUsers(updatedUsers);
              localStorage.setItem('devsisters_users_list', JSON.stringify(updatedUsers));
            }
          }
        }
      }

      setTeachers(updated);
      localStorage.setItem('devsisters_teachers', JSON.stringify(updated));
      setEditingTeacher(null);
      setIsNewTeacher(false);
      setStatusMessage({
        type: 'success',
        text: 'O‘qituvchi va uning kirish hisobi (login/parol) muvaffaqiyatli saqlandi!',
      });
      setTimeout(() => setStatusMessage(null), 3500);
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
        const payload = {
          title: editingLesson.title.trim(),
          description: editingLesson.description.trim(),
          video_url: editingLesson.video_url.trim(),
          duration: editingLesson.duration || '12:00',
          subject_slug: editingLesson.subject_slug,
          order_num: lessons.length + 1,
        };
        const { data: insData, error: insErr } = await supabase
          .from('lessons')
          .insert([payload])
          .select();

        const savedItem: Lesson =
          insData && insData[0] ? insData[0] : { ...payload, id: crypto.randomUUID() };
        updated = [...lessons, savedItem];
      } else {
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

        updated = lessons.map((l) => (l.id === editingLesson.id ? editingLesson : l));
      }

      setLessons(updated);
      localStorage.setItem('devsisters_lessons', JSON.stringify(updated));
      setEditingLesson(null);
      setIsNewLesson(false);
      setStatusMessage({ type: 'success', text: 'Dars ma‘lumotlari muvaffaqiyatli saqlandi!' });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Darsni saqlashda xatolik yuz berdi.' });
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

  // Save User
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      let updated: User[];
      if (isNewUser) {
        const payload = {
          name: editingUser.name.trim(),
          email: editingUser.email.trim().toLowerCase(),
          password: editingUser.password || 'student123',
          role: editingUser.role || 'student',
          subject_slug: editingUser.subject_slug,
          phone: editingUser.phone,
          points: editingUser.points || 100,
        };
        const { data: insUser, error: insErr } = await supabase
          .from('users')
          .insert([payload])
          .select();

        const savedUser: User =
          insUser && insUser[0] ? insUser[0] : { ...payload, id: crypto.randomUUID() };
        updated = [savedUser, ...users];
      } else {
        await supabase
          .from('users')
          .update({
            name: editingUser.name,
            email: editingUser.email,
            password: editingUser.password,
            role: editingUser.role,
            phone: editingUser.phone,
            points: editingUser.points,
            subject_slug: editingUser.subject_slug,
          })
          .eq('id', editingUser.id);

        updated = users.map((u) => (u.id === editingUser.id ? editingUser : u));
      }

      setUsers(updated);
      localStorage.setItem('devsisters_users_list', JSON.stringify(updated));
      setEditingUser(null);
      setIsNewUser(false);
      setStatusMessage({
        type: 'success',
        text: 'Foydalanuvchi ma‘lumotlari va paroli saqlandi!',
      });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Foydalanuvchini saqlashda xatolik yuz berdi.' });
    }
  };

  // Delete User
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Foydalanuvchini o‘chirmoqchimisiz?')) return;
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem('devsisters_users_list', JSON.stringify(updated));
    await supabase.from('users').delete().eq('id', id);
    setStatusMessage({ type: 'success', text: 'Foydalanuvchi o‘chirildi.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  if (!isAuthenticated) return null;

  // Analytics Computations
  const students = users.filter((u) => u.role === 'student');
  const teachersCount = teachers.length;
  const lessonsCount = lessons.length;

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSubjectFilter !== 'all' && u.subject_slug !== userSubjectFilter) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#0e0720] text-slate-100 pb-20">
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
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0" />
            <h1 className="text-sm sm:text-lg font-black text-white truncate">devsisters.uz Admin Paneli</h1>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-bold border border-white/10 transition-colors flex-shrink-0"
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

        {/* 1. TOP ANALYTICS & DASHBOARD SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1e133d] via-[#170e30] to-[#130a26] border border-purple-800/40 shadow-xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Jami O‘quvchilar
                </p>
                <h3 className="text-3xl font-black text-white">{students.length} nafar</h3>
              </div>
            </div>
            <p className="text-xs text-pink-300 font-medium">Barcha fanlar bo‘yicha ro‘yxatdan o‘tgan</p>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1e133d] via-[#170e30] to-[#130a26] border border-purple-800/40 shadow-xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  O‘qituvchilar
                </p>
                <h3 className="text-3xl font-black text-white">{teachersCount} nafar</h3>
              </div>
            </div>
            <p className="text-xs text-amber-300 font-medium">Faol dars berayotgan pedagoglar</p>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1e133d] via-[#170e30] to-[#130a26] border border-purple-800/40 shadow-xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Video Darsliklar
                </p>
                <h3 className="text-3xl font-black text-white">{lessonsCount} ta</h3>
              </div>
            </div>
            <p className="text-xs text-emerald-300 font-medium">Platformaga yuklangan HD darslar</p>
          </div>
        </div>

        {/* 2. FANLAR BO‘YICHA O‘QUVCHILAR TAQSIMOTI (REAL-TIME BREAKDOWN) */}
        <div className="p-6 rounded-3xl bg-[#180f33] border border-purple-800/40 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Fanlar bo‘yicha o‘quvchilar taqsimoti (Onlayn statistika)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Har bir fanga qancha o‘quvchi a’zo bo‘lganligini onlayn kuzatish
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold">
              Jami fanlar: <strong className="text-pink-400">{teachers.length} ta</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {teachers.map((t) => {
              const enrolledCount = users.filter(
                (u) => u.role === 'student' && u.subject_slug === t.slug
              ).length;

              return (
                <div
                  key={t.slug || t.id}
                  onClick={() => {
                    setActiveTab('users');
                    setUserRoleFilter('student');
                    setUserSubjectFilter(t.slug);
                  }}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-pink-600/20 border border-white/10 hover:border-pink-500/50 cursor-pointer transition-all text-center group"
                  title="Ushbu fanning o‘quvchilarini ko‘rish"
                >
                  <p className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors truncate">
                    {t.subject}
                  </p>
                  <p className="text-2xl font-black text-pink-400 my-1">{enrolledCount}</p>
                  <p className="text-[10px] text-slate-400 truncate">{t.name.split(' ')[0]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 mb-8 border-b border-purple-900/40 pb-4 overflow-x-auto scrollbar-none">
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

          <button
            onClick={() => {
              setActiveTab('users');
              setEditingUser(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Foydalanuvchilar & Parollar ({users.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('community');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'community'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Jonli Chat & Moderatsiya</span>
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
                  O‘qituvchi qo‘shish, login va parollarini berish va darslarini boshqarish.
                </p>
              </div>

              <button
                onClick={handleOpenAddTeacher}
                className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-pink-600/25 cursor-pointer"
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
                      {isNewTeacher
                        ? 'Yangi o‘qituvchi va uning kirish hisobini qo‘shish'
                        : 'O‘qituvchi ma‘lumotlari va parolini tahrirlash'}
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
                      placeholder="Masalan: Dilnoza Karimova"
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
                          slug:
                            editingTeacher.slug ||
                            e.target.value
                              .toLowerCase()
                              .trim()
                              .replace(/['‘`]/g, '')
                              .replace(/\s+/g, '-'),
                        })
                      }
                      placeholder="Masalan: Tarix"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 text-sm"
                    />
                  </div>

                  {/* Teacher Login Credentials */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Ustoz Kirish Emaili (Login)
                    </label>
                    <input
                      type="email"
                      required
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      placeholder="masalan: dilnoza@devsisters.uz"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-purple-500/40 text-white focus:outline-none focus:border-pink-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Ustoz Paroli (O‘qituvchi kabinetiga kirish uchun)
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      placeholder="teacher123"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-purple-500/40 text-white focus:outline-none focus:border-pink-500 text-sm font-mono"
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
                      placeholder="Masalan: Magistr | 5 yillik tajriba"
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
                      placeholder="@ustoz_telegram"
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
                      className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Saqlash va Hisobni Faollashtirish</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Teachers Table / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((t) => {
                const associatedUser = users.find(
                  (u) => u.role === 'teacher' && (u.subject_slug === t.slug || u.name === t.name)
                );
                const studentCount = users.filter(
                  (u) => u.role === 'student' && u.subject_slug === t.slug
                ).length;

                return (
                  <div
                    key={t.id || t.slug}
                    className="p-6 rounded-3xl bg-[#170e30] border border-purple-800/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            t.avatar_url ||
                            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
                          }
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

                      <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                        {t.bio}
                      </p>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-4 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Kirish emaili:</span>
                          <span className="font-mono text-pink-300 font-bold truncate max-w-[170px]">
                            {associatedUser?.email || `${t.slug}@devsisters.uz`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Paroli:</span>
                          <span className="font-mono text-emerald-300">
                            {associatedUser?.password || 'teacher123'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">A’zo o‘quvchilar:</span>
                          <span className="text-white font-bold">{studentCount} nafar</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{t.telegram || 'Telegram yo‘q'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            handleOpenEditTeacher(t);
                            window.scrollTo({ top: 100, behavior: 'smooth' });
                          }}
                          className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition-colors cursor-pointer"
                          title="Tahrirlash va parolini ko‘rish"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(t.id)}
                          className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    subject_slug: teachers[0]?.slug || 'arab-tili',
                    description: '',
                    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    duration: '12:00',
                    order_num: lessons.length + 1,
                  });
                  setIsNewLesson(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-600/25 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Dars Qo‘shish</span>
              </button>
            </div>

            {/* Lesson Form Modal / Inline editor */}
            {editingLesson && (
              <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-[#1b1035] border-2 border-purple-500/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-400" />
                    <span>{isNewLesson ? 'Yangi darslik qo‘shish' : 'Darsni tahrirlash'}</span>
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
                      Dars Sarlavhasi / Mavzusi
                    </label>
                    <input
                      type="text"
                      required
                      value={editingLesson.title}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, title: e.target.value })
                      }
                      placeholder="Masalan: 1-Dars: Harflar va talaffuz qoidalari"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Fanni tanlang
                    </label>
                    <select
                      value={editingLesson.subject_slug}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, subject_slug: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#110a24] border border-white/10 text-white focus:outline-none focus:border-purple-500 text-sm cursor-pointer"
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
                      Davomiyligi (daqiqada)
                    </label>
                    <input
                      type="text"
                      value={editingLesson.duration}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, duration: e.target.value })
                      }
                      placeholder="14:30"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      YouTube Video Havolasi (URL)
                    </label>
                    <input
                      type="url"
                      required
                      value={editingLesson.video_url}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, video_url: e.target.value })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-sm font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Dars Tavsifi / Konspekti
                    </label>
                    <textarea
                      rows={3}
                      value={editingLesson.description}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, description: e.target.value })
                      }
                      placeholder="Darsning qisqacha mazmuni va o‘quvchilar nimalarni o‘rganishi..."
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
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Darsni Saqlash</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lessons List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => {
                const teacher = teachers.find((t) => t.slug === lesson.subject_slug);

                return (
                  <div
                    key={lesson.id}
                    className="p-6 rounded-3xl bg-[#170e30] border border-purple-800/40 flex flex-col justify-between"
                  >
                    <div>
                      {/* YouTube Thumbnail */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-black/60">
                        {getYouTubeThumbnail(lesson.video_url) ? (
                          <img
                            src={getYouTubeThumbnail(lesson.video_url)}
                            alt={lesson.title}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-bold text-pink-300">
                          {teacher?.subject || lesson.subject_slug}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-bold text-white">
                          {lesson.duration || '12:00'}
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white mb-2 line-clamp-2">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-3 mb-6 leading-relaxed">
                        {lesson.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Ustoz: {teacher?.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingLesson(lesson);
                            setIsNewLesson(false);
                            window.scrollTo({ top: 100, behavior: 'smooth' });
                          }}
                          className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors cursor-pointer"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: USERS & PASSWORDS MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Foydalanuvchilar, Fanlar va Parollar
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  O‘quvchilar va ustozlar hisoblarini boshqarish, tanlagan fanlarini va parollarini ko‘rish.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingUser({
                    id: '',
                    name: '',
                    email: '',
                    password: 'student123',
                    role: 'student',
                    subject_slug: teachers[0]?.slug || 'arab-tili',
                    phone: '',
                    points: 100,
                  });
                  setIsNewUser(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Foydalanuvchi Qo‘shish</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#160d2e] border border-purple-800/40 mb-6">
              {/* Role filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Rol:
                </span>
                {(['all', 'student', 'teacher', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userRoleFilter === r
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r === 'all'
                      ? 'Barchasi'
                      : r === 'student'
                      ? 'O‘quvchilar'
                      : r === 'teacher'
                      ? 'O‘qituvchilar'
                      : 'Admin'}
                  </button>
                ))}
              </div>

              {/* Subject filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Fan:
                </span>
                <select
                  value={userSubjectFilter}
                  onChange={(e) => setUserSubjectFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#0d061e] border border-purple-700/50 text-white text-xs font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all">Barcha fanlar</option>
                  {teachers.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* User Edit / Create Form */}
            {editingUser && (
              <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-[#1b1035] border-2 border-emerald-500/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-emerald-400" />
                    <span>
                      {isNewUser ? 'Yangi foydalanuvchi qo‘shish' : 'Foydalanuvchi parolini yangilash'}
                    </span>
                  </h3>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Bekor qilish ✕
                  </button>
                </div>

                <form onSubmit={handleSaveUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      F.I.SH
                    </label>
                    <input
                      type="text"
                      required
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      placeholder="Masalan: Nilufar Karimova"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Email Manzil (Login)
                    </label>
                    <input
                      type="email"
                      required
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      placeholder="nilufar@devsisters.uz"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Parol (Kirish paroli)
                    </label>
                    <input
                      type="text"
                      required
                      value={editingUser.password || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Tizimdagi Roli
                    </label>
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value as 'student' | 'teacher' | 'admin',
                        })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#110a24] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm cursor-pointer"
                    >
                      <option value="student">O‘quvchi</option>
                      <option value="teacher">O‘qituvchi (Ustoz)</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Biriktirilgan Fan (Yo‘nalish)
                    </label>
                    <select
                      value={editingUser.subject_slug || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, subject_slug: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#110a24] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm cursor-pointer"
                    >
                      <option value="">Tanlanmagan</option>
                      {teachers.map((t) => (
                        <option key={t.slug} value={t.slug}>
                          {t.subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Telefon raqam
                    </label>
                    <input
                      type="text"
                      value={editingUser.phone || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-purple-900/40">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-semibold"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Saqlash</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users List Table */}
            <div className="overflow-x-auto rounded-3xl border border-purple-800/40 bg-[#160d2e]/80">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-purple-900/40 text-slate-400 bg-white/5">
                    <th className="py-3.5 px-6 font-bold">Foydalanuvchi</th>
                    <th className="py-3.5 px-4 font-bold">Roli</th>
                    <th className="py-3.5 px-4 font-bold">Tanlangan Fani</th>
                    <th className="py-3.5 px-4 font-bold">Paroli (Ochiq)</th>
                    <th className="py-3.5 px-4 font-bold">Telefon</th>
                    <th className="py-3.5 px-4 font-bold">Ballari</th>
                    <th className="py-3.5 px-6 font-bold text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/30 text-slate-200">
                  {filteredUsers.map((user) => {
                    let roleBadge = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
                    let roleLabel = 'O‘quvchi';

                    if (user.role === 'admin') {
                      roleBadge = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
                      roleLabel = 'Admin';
                    } else if (user.role === 'teacher') {
                      roleBadge = 'bg-pink-500/15 text-pink-300 border-pink-500/30';
                      roleLabel = 'Ustoz';
                    }

                    const teacher = teachers.find((t) => t.slug === user.subject_slug);

                    return (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-pink-400">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white">{user.name}</p>
                              <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${roleBadge}`}
                          >
                            {roleLabel}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          {teacher ? (
                            <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-300 font-semibold text-xs border border-pink-500/20">
                              {teacher.subject}
                            </span>
                          ) : user.subject_slug ? (
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 text-xs">
                              {user.subject_slug}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        <td className="py-4 px-4 font-mono text-xs text-amber-300 font-bold bg-amber-500/5 px-2 py-1 rounded-lg">
                          {user.password || '••••••••'}
                        </td>

                        <td className="py-4 px-4 text-xs text-slate-300">
                          {user.phone || '—'}
                        </td>

                        <td className="py-4 px-4 font-bold text-amber-300">
                          {user.points || 0}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setIsNewUser(false);
                                window.scrollTo({ top: 100, behavior: 'smooth' });
                              }}
                              className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors cursor-pointer"
                              title="Tahrirlash va parolni yangilash"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors cursor-pointer"
                              title="O‘chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COMMUNITY CHAT & MODERATION */}
        {activeTab === 'community' && (
          <div className="animate-fade-in">
            <CommunityChat currentUser={currentUser} />
          </div>
        )}
      </div>
    </main>
  );
}
