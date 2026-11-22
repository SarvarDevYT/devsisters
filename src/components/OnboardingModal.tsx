'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  GraduationCap,
  Heart,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import { registerStudent } from '@/lib/auth';
import { INITIAL_TEACHERS } from '@/lib/data';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('arab-tili');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Iltimos, ismingizni kiriting!');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Iltimos, to‘g‘ri email manzil kiriting!');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Parol kamida 4 ta belgidan iborat bo‘lsin!');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleFinish = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await registerStudent(name, email, password, selectedSubject);
      if (res.error) {
        setErrorMsg(res.error);
        setStep(1);
        setLoading(false);
        return;
      }

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e24b80', '#a855f7', '#38bdf8', '#10b981'],
        });
      } catch (e) {
        // ignore
      }

      onClose();
      router.push('/student');
    } catch (err) {
      setErrorMsg('Ro‘yxatdan o‘tishda xatolik yuz berdi. Qaytadan urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const currentTeacher = INITIAL_TEACHERS.find((t) => t.slug === selectedSubject);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-[#160d2e] border border-purple-700/50 p-5 sm:p-8 shadow-2xl relative my-6 sm:my-8">
        {/* Close / Guest browsing button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Saytni ko‘rib chiqish"
        >
          <span>Saytni ko‘rish</span>
          <X className="w-4 h-4" />
        </button>

        {/* Header Indicator */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>devsisters.uz ga xush kelibsiz!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {step === 1 ? '1-Qadam: Ro‘yxatdan o‘tish' : '2-Qadam: O‘qish faningizni tanlang'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {step === 1
              ? 'Qizlar uchun bepul bilim olish muhiti. Bir necha soniyada shaxsiy profilingizni oching.'
              : 'Qaysi fan bo‘yicha o‘qimoqchisiz? Tanlangan yo‘nalish bo‘yicha darslar siz uchun moslashtiriladi.'}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 ${
                step === 1 ? 'w-1/2' : 'w-full'
              }`}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Ism-Familiyangiz
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Madina Rahimova"
                className="w-full px-4 py-3 rounded-2xl bg-[#0d071d] border border-purple-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email manzilingiz
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="madina@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-[#0d071d] border border-purple-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Parol o‘ylab toping
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kamida 4 ta belgi"
                className="w-full px-4 py-3 rounded-2xl bg-[#0d071d] border border-purple-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push('/login');
                }}
                className="text-xs text-slate-400 hover:text-pink-300 font-semibold transition-colors flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Allaqachon hisobim bor (Kirish)</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Fanni Tanlash</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Subject Selection (Fan Tanlash) */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-xs font-semibold text-slate-300">
              Quyidagi fanlardan birini asosiy ta’lim yo‘nalishi sifatida tanlang:
            </p>

            {/* 7 Subjects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {INITIAL_TEACHERS.map((teacher) => {
                const isSelected = selectedSubject === teacher.slug;
                return (
                  <button
                    key={teacher.slug}
                    type="button"
                    onClick={() => setSelectedSubject(teacher.slug)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-950/60 to-purple-950/60 border-pink-500 shadow-lg shadow-pink-500/20 ring-1 ring-pink-500'
                        : 'bg-[#100924] border-purple-800/40 hover:border-purple-600/60 text-slate-300'
                    }`}
                  >
                    <img
                      src={teacher.avatar_url}
                      alt={teacher.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                          {teacher.subject}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">{teacher.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{teacher.experience}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Subject Preview Card */}
            {currentTeacher && (
              <div className="p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center gap-3 text-xs text-pink-200">
                <BookOpen className="w-5 h-5 text-pink-400 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-bold text-white">
                    Tanlangan yo‘nalish: {currentTeacher.subject}
                  </span>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Siz ushbu yo‘nalishdagi videodarslar, interaktiv testlar va so‘z boyligini
                    o‘rganasiz.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Orqaga</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleFinish}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-pink-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                <GraduationCap className="w-5 h-5" />
                <span>{loading ? 'Tayyorlanmoqda...' : 'O‘qishni Boshlash 🚀'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
