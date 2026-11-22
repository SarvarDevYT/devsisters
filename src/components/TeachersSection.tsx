'use client';

import React, { useState } from 'react';
import { Teacher } from '../lib/types';
import { Sparkles, Send, BookOpen, GraduationCap, Award } from 'lucide-react';

interface TeachersSectionProps {
  teachers: Teacher[];
  selectedSubject: string | null;
  onSelectSubject: (slug: string) => void;
}

export default function TeachersSection({
  teachers,
  selectedSubject,
  onSelectSubject,
}: TeachersSectionProps) {
  const [filter, setFilter] = useState<string>('all');

  const filteredTeachers = filter === 'all'
    ? teachers
    : teachers.filter((t) => t.slug === filter);

  return (
    <section id="fanlar" className="py-20 bg-[#120a24]/60 border-y border-purple-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>7 ta Fan • 7 ta Tajribali Ustoz</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Fanlar va O‘qituvchilar
          </h2>
          <p className="text-slate-400 mt-2 text-base max-w-2xl">
            Har bir fanni o‘z sohasining mutaxassisi bo‘lgan kuchli ustozlar bilan o‘rganing.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 sm:gap-2.5 mb-8 sm:mb-10 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              filter === 'all'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            Barcha Fanlar
          </button>
          {teachers.map((teacher) => (
            <button
              key={teacher.slug}
              onClick={() => setFilter(teacher.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                filter === teacher.slug
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {teacher.subject}
            </button>
          ))}
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => {
            const isSelected = selectedSubject === teacher.slug;

            return (
              <div
                key={teacher.id || teacher.slug}
                className={`group relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#29174d] border-2 border-pink-500 shadow-xl shadow-pink-500/20 scale-[1.02]'
                    : 'bg-[#1b1033]/80 border border-purple-800/30 hover:border-pink-500/40 hover:bg-[#20133c]'
                }`}
              >
                <div>
                  {/* Top: Avatar & Badge */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-500/40 group-hover:border-pink-500 transition-colors shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={teacher.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'}
                        alt={teacher.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 mb-1">
                        {teacher.subject}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors leading-snug">
                        {teacher.name}
                      </h3>
                    </div>
                  </div>

                  {/* Experience badge */}
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-300/90 mb-3 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                    <Award className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="line-clamp-1">{teacher.experience}</span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed line-clamp-3 mb-6">
                    {teacher.bio}
                  </p>
                </div>

                {/* Bottom actions */}
                <div className="pt-4 border-t border-purple-900/40 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectSubject(teacher.slug);
                      const el = document.getElementById('darslar');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-pink-600/90 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Darslarni ko‘rish</span>
                  </button>

                  {teacher.telegram && (
                    <a
                      href={`https://t.me/${teacher.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                      title="Telegramda bog‘lanish"
                    >
                      <Send className="w-4 h-4 text-sky-400" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {/* 8-card: Devsisters.uz Banner card matching PDF Page 3 */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-purple-900/80 via-indigo-900/60 to-pink-900/70 border border-pink-500/30 flex flex-col justify-between text-white shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-pink-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black mb-2">devsisters.uz</h3>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-4">
                Barcha fanlar bir joyda! Istalgan vaqtda, istalgan joyda smartfoningiz orqali bilim oling.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <span className="text-xs font-semibold text-pink-300">
                O‘rganish mutlaqo bepul ✨
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
