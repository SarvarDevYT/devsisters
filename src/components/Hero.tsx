'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpenCheck, CheckCircle2, HeartHandshake, Shield, Smartphone } from 'lucide-react';

interface HeroProps {
  onStartLearning?: () => void;
}

export default function Hero({ onStartLearning }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-indigo-600/10 blur-[130px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>Raqamli avlod qizlar uchun milliy ta‘lim platformasi</span>
          </div>

          {/* Big Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            Ilm olishda <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400">
              devsisters.uz
            </span>{' '}
            bilan yangi bosqich
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
            Qizlarga qulay, zamonaviy va mutlaqo bepul bilim olish muhiti. 
            Yetti fan, yetti professional ustoz va qulay raqamli platforma!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => {
                if (onStartLearning) onStartLearning();
                else window.location.href = '#fanlar';
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-base shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
            >
              <span>Darslarni Boshlash</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              href="#testlar"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-base transition-all flex items-center justify-center gap-2.5"
            >
              <BookOpenCheck className="w-5 h-5 text-purple-400" />
              <span>Bilimni Sinash</span>
            </Link>
          </div>

          {/* Highlights / Features Row matching PDF Page 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-6 rounded-3xl bg-[#1e1338]/80 border border-purple-800/40 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Loyiha Maqsadi</h3>
              <p className="text-sm text-slate-300 leading-snug">
                Qizlarga qulay, zamonaviy va bepul bilim olish muhitini yaratish.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#1e1338]/80 border border-purple-800/40 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Auditoriya</h3>
              <p className="text-sm text-slate-300 leading-snug">
                Telefon va internet orqali o‘rganishga odatlangan raqamli avlod qizlari.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-600/90 to-rose-700/90 border border-pink-500/50 text-white shadow-xl shadow-pink-600/20">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Yondashuv</h3>
              <p className="text-sm text-pink-100 leading-snug">
                Yetti fan, yetti kuchli o‘qituvchi, bitta qulay va chiroyli sayt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
