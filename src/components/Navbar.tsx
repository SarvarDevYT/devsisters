'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, Video, Award, Users, ShieldCheck, Menu, X, Dumbbell } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#130a27]/85 border-b border-purple-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-white">devsisters</span>
                <span className="text-2xl font-extrabold text-pink-400">.uz</span>
              </div>
              <p className="text-[11px] font-medium text-pink-300/80 tracking-wide uppercase">
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
            <Link
              href="#hamjamiyat"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-blue-400" />
              Hamjamiyat
            </Link>
          </nav>

          {/* Right Action: Admin Panel */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl text-xs font-bold text-pink-300 bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-pink-400" />
              Admin Panel
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300"
              title="Admin Panel"
            >
              <ShieldCheck className="w-5 h-5" />
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
          <Link
            href="#hamjamiyat"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:bg-white/5"
          >
            <Users className="w-5 h-5 text-blue-400" />
            Hamjamiyat
          </Link>
          <div className="pt-2">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-pink-200 bg-gradient-to-r from-pink-600 to-purple-600 shadow-md shadow-pink-600/30"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Boshqaruv Paneliga Kirish
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
