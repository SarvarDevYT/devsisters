'use client';

import React, { useState } from 'react';
import { Lesson } from '../lib/types';
import {
  X,
  Play,
  Clock,
  ExternalLink,
  CheckCircle2,
  Share2,
  Sparkles,
  BookOpen,
  Tv,
} from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeId, YouTubeIcon } from '@/lib/youtube';
import { INITIAL_TEACHERS } from '@/lib/data';

interface VideoModalProps {
  lesson: Lesson | null;
  onClose: () => void;
}

export default function VideoModal({ lesson, onClose }: VideoModalProps) {
  const [copied, setCopied] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!lesson) return null;

  const embedUrl = getYouTubeEmbedUrl(lesson.video_url, true);
  const videoId = getYouTubeId(lesson.video_url);
  const teacher = INITIAL_TEACHERS.find((t) => t.slug === lesson.subject_slug);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(lesson.video_url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-5xl rounded-2xl sm:rounded-3xl bg-[#140b2a] border border-purple-700/60 overflow-hidden shadow-2xl relative my-4 sm:my-6">
        {/* Top YouTube Player Custom Header */}
        <div className="flex flex-wrap items-center justify-between px-3.5 sm:px-7 py-3 border-b border-purple-900/40 bg-[#100824]/90 gap-2 sm:gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* YouTube Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 font-bold text-xs flex-shrink-0">
              <YouTubeIcon className="w-4 h-4 text-red-500" />
              <span>YouTube HD</span>
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                {lesson.title}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-pink-300 font-semibold">{teacher?.subject || lesson.subject_slug}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-pink-400" />
                  {lesson.duration || '12:00'}
                </span>
                {teacher && (
                  <>
                    <span>•</span>
                    <span className="truncate">Ustoz: {teacher.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-2">
            {lesson.video_url && (
              <a
                href={lesson.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
                title="YouTube'da ko‘rish"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>YouTube'da ochish</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-white transition-colors"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 16:9 Cinema Video Player with Glowing Ambient Shadow */}
        <div className="relative aspect-video w-full bg-black shadow-inner">
          <iframe
            src={embedUrl}
            title={lesson.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Bottom Control Bar & Info */}
        <div className="p-5 sm:p-6 bg-[#160d2e] border-t border-purple-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-purple-900/30">
            {/* Teacher Info */}
            {teacher && (
              <div className="flex items-center gap-3">
                <img
                  src={teacher.avatar_url}
                  alt={teacher.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-pink-500/50 shadow-md flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{teacher.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
                      {teacher.subject}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{teacher.experience}</p>
                </div>
              </div>
            )}

            {/* Interaction Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleToggleComplete}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}
                />
                <span>{isCompleted ? 'Tugatildi' : 'Tugatildi deb belgilash'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'Nusxalandi! ✨' : 'Ulashish'}</span>
              </button>
            </div>
          </div>

          {/* Lesson Synopsis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dars Mazmuni va Konspekt:</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lesson.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
