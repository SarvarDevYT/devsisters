'use client';

import React from 'react';
import { Sparkles, CheckCircle2, Rocket, Code2, Users2, FileSpreadsheet } from 'lucide-react';

export default function RoadmapSection() {
  const steps = [
    {
      num: '1',
      title: 'Tayyorgarlik',
      desc: 'Dars materiallarini 7 ta o‘qituvchi bilan birgalikda tizimlashtirish va tayyorlash.',
      icon: FileSpreadsheet,
      badge: 'Bajarildi',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      num: '2',
      title: 'Yaratish',
      desc: 'Sayt dizayni, dasturlash va boshqaruv admin panelini ishlab chiqish.',
      icon: Code2,
      badge: 'Jarayonda',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    },
    {
      num: '3',
      title: 'Sinov',
      desc: 'O‘quvchi qizlar va o‘qituvchilar bilan birgalikda saytni to‘liq sinab ko‘rish.',
      icon: Users2,
      badge: 'Rejalashtirilgan',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      num: '4',
      title: 'Ishga tushirish',
      desc: 'devsisters.uz domenida platformani rasmiy e‘lon qilish va keng ommaga taqdim etish.',
      icon: Rocket,
      badge: 'Final bosqich',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
  ];

  return (
    <section className="py-20 bg-[#100922]/90 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rivojlanish bosqichlari</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Loyiha Rivojlanish Rejasi
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            devsisters.uz platformasini bosqichma-bosqich hayotga tadbiq etish strategiyasi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className="relative rounded-3xl p-7 bg-[#1c1137]/80 border border-purple-800/40 hover:border-pink-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-extrabold text-base flex items-center justify-center shadow-md">
                      {step.num}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${step.badgeColor}`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-purple-900/40 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <Icon className="w-4 h-4 text-pink-400" />
                  <span>Bosqich {step.num}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
