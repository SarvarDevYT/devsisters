'use client';

import React from 'react';
import { Lesson } from '../lib/types';
import { X, Play, Clock } from 'lucide-react';

interface VideoModalProps {
  lesson: Lesson | null;
  onClose: () => void;
}

export default function VideoModal({ lesson, onClose }: VideoModalProps) {
  if (!lesson) return null;

  // Format youtube url to embed format if needed
  let embedUrl = lesson.video_url;
  if (embedUrl.includes('watch?v=')) {
    embedUrl = embedUrl.replace('watch?v=', 'embed/');
  } else if (embedUrl.includes('youtu.be/')) {
    embedUrl = embedUrl.replace('youtu.be/', 'www.youtube.com/embed/');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl rounded-3xl bg-[#190f33] border border-purple-700/60 overflow-hidden shadow-2xl relative">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/40 bg-[#140b2a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Play className="w-4 h-4 fill-pink-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white line-clamp-1">{lesson.title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Clock className="w-3 h-3 text-pink-400" />
                <span>{lesson.duration || '12:00'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={embedUrl}
            title={lesson.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Description footer */}
        <div className="p-6 bg-[#160d2e]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-1">
            Dars Mazmuni:
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">{lesson.description}</p>
        </div>
      </div>
    </div>
  );
}
