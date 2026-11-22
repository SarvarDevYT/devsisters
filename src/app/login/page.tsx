'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { loginUser, registerStudent, getStoredUser } from '@/lib/auth';
import { INITIAL_TEACHERS } from '@/lib/data';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('arab-tili');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already logged in, redirect to appropriate portal
  useEffect(() => {
    const current = getStoredUser();
    if (current) {
      if (current.role === 'admin') router.push('/admin');
      else if (current.role === 'teacher') router.push('/teacher');
      else router.push('/student');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginUser(email, password);
        if (res.error) {
          setErrorMessage(res.error);
        } else if (res.user) {
          if (res.user.role === 'admin') router.push('/admin');
          else if (res.user.role === 'teacher') router.push('/teacher');
          else router.push('/student');
        }
      } else {
        if (!name.trim()) {
          setErrorMessage('Ismingizni kiriting!');
          setLoading(false);
          return;
        }
        const res = await registerStudent(name, email, password, selectedSubject, phone);
        if (res.error) {
          setErrorMessage(res.error);
        } else if (res.user) {
          router.push('/student');
        }
      }
    } catch (err) {
      setErrorMessage('Tizimga kirishda xatolik yuz berdi. Qaytadan urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0e071e] text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-indigo-600/10 blur-[130px] -z-10 pointer-events-none rounded-full" />

      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-black text-white">devsisters<span className="text-pink-400">.uz</span></span>
        </div>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="p-7 sm:p-9 rounded-3xl bg-[#1b1035]/90 border border-purple-800/50 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
              {mode === 'login' ? 'Tizimga Kirish' : 'Ro‘yxatdan O‘tish'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              O‘quvchi, O‘qituvchi va Administrator uchun yagona portal
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kirish
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ro‘yxatdan o‘tish
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Ism-Familiyangiz
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Nilufar Karimova"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email manzil
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@devsisters.uz"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Parol
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Telefon raqam (Ixtiyoriy)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                />
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  O‘rganmoqchi bo‘lgan faningizni tanlang:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {INITIAL_TEACHERS.map((t) => {
                    const isSel = selectedSubject === t.slug;
                    return (
                      <button
                        key={t.slug}
                        type="button"
                        onClick={() => setSelectedSubject(t.slug)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                          isSel
                            ? 'bg-pink-600/30 border-pink-500 text-white shadow-md shadow-pink-600/20'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-sm">{isSel ? '🌸' : '📚'}</span>
                        <div className="truncate">
                          <p className="font-bold truncate text-white">{t.subject}</p>
                          <p className="text-[10px] text-slate-400 truncate">{t.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-sm shadow-xl shadow-pink-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{loading ? 'Tekshirilmoqda...' : mode === 'login' ? 'Tizimga Kirish' : 'Hisob Yaratish'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-slate-500 py-3">
        © 2025 devsisters.uz ta‘lim platformasi
      </div>
    </main>
  );
}
