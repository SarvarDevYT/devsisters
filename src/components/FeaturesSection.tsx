'use client';

import React from 'react';
import Link from 'next/link';
import { Video, Award, Dumbbell, Users, ArrowUpRight } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Video darslar',
      desc: 'Har bir fan bo‘yicha qisqa, tushunarli va yuqori sifatli darslar to‘plami.',
      icon: Video,
      color: 'from-pink-500 to-rose-500',
      textColor: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      link: '#darslar',
    },
    {
      title: 'Testlar',
      desc: 'Bilimni mustaqil tekshirish va mustahkamlash uchun interaktiv viktorinalar.',
      icon: Award,
      color: 'from-purple-500 to-indigo-500',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      link: '#testlar',
    },
    {
      title: 'Amaliyot',
      desc: 'Til fanlarida lug‘at va mashqlar, sportda esa kundalik qomatni tiklovchi mashqlar to‘plami.',
      icon: Dumbbell,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      link: '#amaliyot',
    },
    {
      title: 'Hamjamiyat',
      desc: 'Qizlar savol berib, fikr almashadigan va bir-birini qo‘llab-quvvatlaydigan xavfsiz maskan.',
      icon: Users,
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      link: '/login',
      highlighted: true,
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase tracking-widest">
            Imkoniyatlar
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4 tracking-tight">
            Sayt Imkoniyatlari
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            O‘quvchilar uchun maksimal darajada qulay, qiziqarli va zamonaviy ta‘lim muhiti yaratilgan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;

            return (
              <Link
                key={idx}
                href={item.link}
                className={`group p-7 rounded-3xl transition-all duration-300 flex flex-col justify-between border relative overflow-hidden ${
                  item.highlighted
                    ? 'bg-gradient-to-br from-pink-600 to-rose-700 text-white border-pink-400 shadow-xl shadow-pink-600/20 hover:scale-[1.02]'
                    : 'bg-[#180f30]/80 border-purple-900/40 hover:border-pink-500/40 hover:bg-[#1e133c] text-slate-100 hover:scale-[1.02]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${
                        item.highlighted ? 'bg-white/20 text-white' : `${item.bgColor} ${item.textColor}`
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                      <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    </div>
                  </div>

                  <h3
                    className={`text-xl font-bold mb-3 ${
                      item.highlighted ? 'text-white' : 'text-white group-hover:text-pink-300 transition-colors'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed ${
                      item.highlighted ? 'text-pink-100' : 'text-slate-300'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center text-xs font-bold gap-1">
                  <span>Batafsil ko‘rish</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
