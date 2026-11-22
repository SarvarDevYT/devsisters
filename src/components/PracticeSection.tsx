'use client';

import React, { useState } from 'react';
import { PracticeItem } from '../lib/types';
import { Dumbbell, Languages, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';

interface PracticeSectionProps {
  items: PracticeItem[];
}

export default function PracticeSection({ items }: PracticeSectionProps) {
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'workout'>('vocabulary');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const vocabItems = items.filter((i) => i.category === 'vocabulary');
  const workoutItems = items.filter((i) => i.category === 'workout');

  return (
    <section id="amaliyot" className="py-20 bg-[#120a23]/60 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 uppercase tracking-wider">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Interaktiv Amaliyot</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Lug‘at va Mashqlar To‘plami
            </h2>
            <p className="text-slate-400 mt-2 text-base max-w-xl">
              Til fanlarida interaktiv kartochkalar orqali so‘z boyligingizni oshiring, sport mashqlari bilan esa sog‘lom bo‘ling.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('vocabulary')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                activeTab === 'vocabulary'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Languages className="w-4 h-4" />
              <span>Til Lug‘atlari</span>
            </button>
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                activeTab === 'workout'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Sport & Gimnastika</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Vocabulary Cards (Flip effect) */}
        {activeTab === 'vocabulary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vocabItems.map((item) => {
              const isFlipped = !!flippedCards[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => toggleFlip(item.id)}
                  className="cursor-pointer group relative h-72 rounded-3xl p-6 bg-[#1a1033] border border-purple-800/40 hover:border-pink-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-pink-300">
                      {isFlipped ? 'Orqasini ko‘rish' : 'Aylantirish uchun bosing 🔄'}
                    </span>
                  </div>

                  {!isFlipped ? (
                    /* Front: Word & Pronunciation */
                    <div className="my-auto text-center">
                      <p className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight group-hover:text-pink-300 transition-colors">
                        {item.data.word}
                      </p>
                      {item.data.pronunciation && (
                        <p className="text-sm text-pink-400 font-mono flex items-center justify-center gap-1.5">
                          <Volume2 className="w-4 h-4" />
                          <span>{item.data.pronunciation}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Back: Meaning, Example, Tip */
                    <div className="my-auto space-y-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-pink-400">
                          Tarjimasi:
                        </p>
                        <p className="text-xl font-bold text-white">{item.data.translation}</p>
                      </div>
                      {item.data.example && (
                        <div className="p-3 rounded-xl bg-purple-900/30 border border-purple-500/20 text-xs text-purple-200">
                          <span className="font-semibold text-pink-300">Misol: </span>
                          {item.data.example}
                        </div>
                      )}
                      {item.data.tip && (
                        <p className="text-xs text-amber-300/90 font-medium">💡 {item.data.tip}</p>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t border-purple-900/40 text-center">
                    <span className="text-xs text-slate-400 font-medium">
                      {isFlipped ? 'Tarjimasi ko‘rindi' : 'Kartani aylantiring'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Sport & Workout */}
        {activeTab === 'workout' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workoutItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl p-8 bg-gradient-to-br from-[#1a1033] to-[#140b2a] border border-emerald-500/30 shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {item.data.reps || '10 daqiqa'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>

                {item.data.steps && (
                  <div className="space-y-3 mb-6">
                    {item.data.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 text-sm text-slate-200"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {item.data.tip && (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs sm:text-sm text-emerald-200">
                    <span className="font-bold text-emerald-300">Murabbiy tavsiyasi: </span>
                    {item.data.tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
