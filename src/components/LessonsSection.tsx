'use client';

import React, { useState } from 'react';
import { Lesson, Teacher } from '../lib/types';
import { Play, Clock, Sparkles, Video, User } from 'lucide-react';
import { getYouTubeThumbnail, getYouTubeId, YouTubeIcon } from '@/lib/youtube';

interface LessonsSectionProps {
  lessons: Lesson[];
  teachers: Teacher[];
  selectedSubject: string | null;
  onSelectSubject: (slug: string) => void;
  onOpenVideo: (lesson: Lesson) => void;
}

export default function LessonsSection({
  lessons,
  teachers,
  selectedSubject,
  onSelectSubject,
  onOpenVideo,
}: LessonsSectionProps) {
  const currentSubject = selectedSubject || 'all';

  const filteredLessons = currentSubject === 'all'
    ? lessons
    : lessons.filter((l) => l.subject_slug === currentSubject);

  return (
    <section id="darslar" className="py-20 bg-[#110a22]/80 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold mb-3 uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            <span>Video Darslar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Qisqa va Tushunarli Darslar
          </h2>
          <p className="text-slate-400 mt-2 text-base max-w-2xl">
            Har bir mavzu bosqichma-bosqich, o‘quvchilarga tushunarli tarzda tushuntiriladi.
          </p>
        </div>

        {/* Subjects filter */}
        <div className="flex items-center gap-2 sm:gap-2.5 mb-8 sm:mb-10 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
          <button
            onClick={() => onSelectSubject('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              currentSubject === 'all'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            Hammasi ({lessons.length})
          </button>
          {teachers.map((teacher) => (
            <button
              key={teacher.slug}
              onClick={() => onSelectSubject(teacher.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                currentSubject === teacher.slug
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {teacher.subject}
            </button>
          ))}
        </div>

        {/* Lessons List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const teacher = teachers.find((t) => t.slug === lesson.subject_slug);

            return (
              <div
                key={lesson.id}
                className="group rounded-3xl overflow-hidden bg-[#1a1033] border border-purple-800/30 hover:border-pink-500/40 transition-all flex flex-col justify-between"
              >
                {/* Thumbnail / Video Preview Area */}
                <div
                  onClick={() => onOpenVideo(lesson)}
                  className="relative aspect-video w-full bg-gradient-to-tr from-purple-950 via-slate-900 to-pink-950 flex items-center justify-center cursor-pointer overflow-hidden group"
                >
                  {/* YouTube Video Thumbnail */}
                  {getYouTubeThumbnail(lesson.video_url) ? (
                    <img
                      src={getYouTubeThumbnail(lesson.video_url)}
                      alt={lesson.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 group-hover:via-black/10 transition-colors" />

                  {/* YouTube Styled Play Button */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-pink-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover:scale-115 group-hover:shadow-red-600/70 transition-all z-10 border border-white/20">
                    <Play className="w-6 h-6 ml-0.5 fill-white text-white" />
                  </div>

                  {/* Subject badge & YouTube tag top left */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-pink-300 border border-white/10">
                      {teacher?.subject || lesson.subject_slug}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600/80 text-white flex items-center gap-1 backdrop-blur-md">
                      <YouTubeIcon className="w-3 h-3 text-white" />
                      <span>HD</span>
                    </span>
                  </div>

                  {/* Duration badge bottom right */}
                  <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-medium">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    <span>{lesson.duration || '12:00'}</span>
                  </div>
                </div>

                {/* Lesson Info */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2 mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-300">
                        {teacher?.name || 'Ustoz'}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenVideo(lesson)}
                      className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
                    >
                      <span>Tomosha qilish</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-16 bg-[#180f33]/50 rounded-3xl border border-dashed border-purple-800/40">
            <p className="text-slate-400 text-base">Bu fan bo‘yicha hozircha darslar yuklanmoqda...</p>
          </div>
        )}
      </div>
    </section>
  );
}
