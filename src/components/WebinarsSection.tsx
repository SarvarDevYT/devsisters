'use client';

import React, { useState } from 'react';
import { Calendar, Video, Clock, Check, Bell, ExternalLink, Sparkles } from 'lucide-react';

interface Webinar {
  id: string;
  teacher_name: string;
  teacher_avatar: string;
  subject: string;
  title: string;
  date: string;
  time: string;
  link: string;
  seats: string;
}

export default function WebinarsSection() {
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  const webinars: Webinar[] = [
    {
      id: 'w-1',
      teacher_name: 'Hazratova Sevinch',
      teacher_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      subject: 'Ingliz tili',
      title: 'IELTS Speaking: Qizlar bilan jonli jonli savol-javob muloqoti',
      date: 'Juma, 28-Noyabr',
      time: '19:00',
      link: 'https://meet.google.com',
      seats: 'Onlayn (Bepul)',
    },
    {
      id: 'w-2',
      teacher_name: 'Mattiyeva Ilmira',
      teacher_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      subject: 'Sport',
      title: 'Dars paytida umurtqa va qomatni to‘g‘ri saqlash mahorat darsi',
      date: 'Shanba, 29-Noyabr',
      time: '18:00',
      link: 'https://meet.google.com',
      seats: 'Onlayn (Bepul)',
    },
    {
      id: 'w-3',
      teacher_name: 'Abdurashidova Farida',
      teacher_avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600',
      subject: 'Kimyo',
      title: 'Davriy jadval va kimyoviy reaksiyalarni sodda yodlash sirlari',
      date: 'Yakshanba, 30-Noyabr',
      time: '17:00',
      link: 'https://meet.google.com',
      seats: 'Onlayn (Bepul)',
    },
  ];

  const toggleReminder = (id: string) => {
    setReminders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="vebinarlar" className="py-20 bg-[#120a24]/90 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold mb-3 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Jonli Muloqot & Darslar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ustozlar Bilan Jonli Vebinarlar
            </h2>
            <p className="text-slate-400 mt-2 text-base max-w-xl">
              Hafta davomida sevimli ustozlaringiz bilan bepul jonli onlayn muloqot qiling va savollaringizga to‘g‘ridan-to‘g‘ri javob oling.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars.map((w) => {
            const hasReminder = reminders[w.id];

            return (
              <div
                key={w.id}
                className="rounded-3xl p-6 bg-[#1b1035] border border-purple-800/40 hover:border-pink-500/40 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                      {w.subject}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{w.seats}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-snug">
                    {w.title}
                  </h3>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={w.teacher_avatar}
                      alt={w.teacher_name}
                      className="w-10 h-10 rounded-xl object-cover border border-pink-500/40"
                    />
                    <div>
                      <p className="text-xs text-slate-400">Spiker ustoz:</p>
                      <p className="text-sm font-bold text-white">{w.teacher_name}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>{w.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-pink-400" />
                      <span>Boshlanish vaqti: <strong>{w.time}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between gap-3">
                  <a
                    href={w.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-600/20"
                  >
                    <span>Ulanish</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => toggleReminder(w.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1 ${
                      hasReminder
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                    title="Eslatma"
                  >
                    {hasReminder ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    <span>{hasReminder ? 'Qo‘shildi' : 'Eslatish'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
