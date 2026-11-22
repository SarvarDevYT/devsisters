'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Globe, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b0518] border-t border-purple-950 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold text-white">devsisters</span>
                <span className="text-xl font-extrabold text-pink-400">.uz</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
              Raqamli avlod qizlari uchun qulay, zamonaviy va bepul ta‘lim platformasi. 
              Yetti fan bo‘yicha sifatli video darslar, interaktiv testlar, amaliy mashg‘ulotlar va qizlar hamjamiyati.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Rasmiy domen: devsisters.uz</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Bo‘limlar
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#fanlar" className="hover:text-pink-400 transition-colors">
                  Fanlar va O‘qituvchilar
                </Link>
              </li>
              <li>
                <Link href="#darslar" className="hover:text-pink-400 transition-colors">
                  Video darslar
                </Link>
              </li>
              <li>
                <Link href="#testlar" className="hover:text-pink-400 transition-colors">
                  Interaktiv testlar
                </Link>
              </li>
              <li>
                <Link href="#amaliyot" className="hover:text-pink-400 transition-colors">
                  Lug‘at va Sport mashqlari
                </Link>
              </li>
              <li>
                <Link href="#hamjamiyat" className="hover:text-pink-400 transition-colors">
                  Qizlar hamjamiyati
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Admin & Help */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Boshqaruv
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-semibold transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Boshqaruv Paneli</span>
                </Link>
              </li>
              <li className="text-xs text-slate-500 pt-2">
                O‘qituvchilar ma‘lumotlari, rasmlari va darslarini yangilash uchun maxfiy panel.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-purple-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 devsisters.uz. Barcha huquqlar himoyalangan.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>O‘zbekiston qizlari uchun</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>muhabbat bilan yaratildi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
