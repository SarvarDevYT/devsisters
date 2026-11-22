'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Video,
  Award,
  Users,
  Menu,
  X,
  Dumbbell,
  LogIn,
  User as UserIcon,
  LogOut,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { getStoredUser, setStoredUser } from '@/lib/auth';
import { User } from '@/lib/types';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    setStoredUser(null);
    setCurrentUser(null);
    window.location.reload();
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin';
    if (currentUser.role === 'teacher') return '/teacher';
    return '/student';
  };

  const getRoleLabel = () => {
    if (!currentUser) return '';
    if (currentUser.role === 'admin') return 'Admin';
    if (currentUser.role === 'teacher') return 'Ustoz';
    return 'O‘quvchi';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#130a27]/85 border-b border-purple-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">devsisters</span>
                <span className="text-xl sm:text-2xl font-extrabold text-pink-400">.uz</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-pink-300/80 tracking-wide uppercase truncate">
                Raqamli avlod qizlar platformasi
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="#fanlar"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-pink-400" />
              Fanlar & Ustozlar
            </Link>
            <Link
              href="#darslar"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-purple-400" />
              Video darslar
            </Link>
            <Link
              href="#testlar"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Testlar
            </Link>
            <Link
              href="#amaliyot"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              Amaliyot & Lug‘at
            </Link>
          </nav>

          {/* Right Action: Kirish / Kabinet */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href={getDashboardLink()}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all flex items-center gap-2 shadow-md shadow-pink-600/25"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
                    {getRoleLabel()}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition-colors"
                  title="Chiqish"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl text-xs font-bold text-pink-300 bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-pink-400" />
                Kirish
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href={getDashboardLink()}
              className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300"
              title="Kabinet"
            >
              <UserIcon className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#160c2e] border-b border-purple-900/40 space-y-2">
          <Link
            href="#fanlar"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:bg-white/5"
          >
            <BookOpen className="w-5 h-5 text-pink-400" />
            Fanlar & Ustozlar
          </Link>
          <Link
            href="#darslar"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:bg-white/5"
          >
            <Video className="w-5 h-5 text-purple-400" />
            Video darslar
          </Link>
          <Link
            href="#testlar"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:bg-white/5"
          >
            <Award className="w-5 h-5 text-amber-400" />
            Testlar
          </Link>
          <Link
            href="#amaliyot"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:bg-white/5"
          >
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            Amaliyot & Lug‘at
          </Link>

          <div className="pt-2">
            {currentUser ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-600 to-purple-600 shadow-md"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Kabinetim ({currentUser.name})</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-pink-200 bg-gradient-to-r from-pink-600 to-purple-600 shadow-md shadow-pink-600/30"
              >
                <LogIn className="w-4 h-4" />
                Kirish / Ro‘yxatdan o‘tish
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
