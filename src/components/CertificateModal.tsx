'use client';

import React from 'react';
import { X, Download, Award, Sparkles, CheckCircle2, QrCode } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  scorePercent: number;
}

export default function CertificateModal({
  isOpen,
  onClose,
  studentName,
  courseName,
  scorePercent,
}: CertificateModalProps) {
  if (!isOpen) return null;

  const certId = `DS-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = '22-Noyabr, 2025';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl my-6 sm:my-8 relative">
        {/* Actions bar above certificate */}
        <div className="flex flex-wrap items-center justify-between mb-3 px-1 gap-2">
          <div className="flex items-center gap-2 text-pink-300 font-bold text-xs sm:text-sm">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
            <span>Rasmiy Ta‘lim Sertifikati</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 sm:px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Chop etish / Yuklab olish</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Card Printable */}
        <div
          id="certificate-print"
          className="p-5 sm:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1b1038] via-[#241348] to-[#160d2e] border-2 sm:border-4 border-amber-400/60 shadow-2xl relative overflow-hidden text-center text-slate-100"
        >
          {/* Ornamental corner decorations */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-6 h-6 sm:w-12 sm:h-12 border-t-2 border-l-2 border-amber-400/50 rounded-tl-lg sm:rounded-tl-xl pointer-events-none" />
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-12 sm:h-12 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg sm:rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-6 h-6 sm:w-12 sm:h-12 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg sm:rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-6 h-6 sm:w-12 sm:h-12 border-b-2 border-r-2 border-amber-400/50 rounded-br-lg sm:rounded-br-xl pointer-events-none" />

          {/* Background watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-white" />
          </div>

          {/* Header */}
          <div className="mb-4 sm:mb-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2 sm:mb-3">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span>Raqamli Avlod Qizlar Akademiyasi</span>
            </div>
            <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-white mb-1 sm:mb-2">
              SERTIFIKAT
            </h1>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-pink-300 font-semibold">
              Muvaffaqiyatli yakunlaganlik to‘g‘risida
            </p>
          </div>

          {/* Body */}
          <div className="my-5 sm:my-8 relative z-10">
            <p className="text-xs sm:text-sm text-slate-300 mb-1 sm:mb-2 font-light">Ushbu sertifikat tasdiqlaydiki,</p>
            <h2 className="text-xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-amber-200 to-pink-300 my-2 sm:my-3 font-serif">
              {studentName || 'O‘quvchi'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mt-2 sm:mt-4">
              <strong>devsisters.uz</strong> platformasida <strong>{courseName}</strong> fani bo‘yicha 
              video darslar va interaktiv testlarni <strong>{scorePercent}%</strong> a‘lo natija bilan 
              muvaffaqiyatli tamomladi.
            </p>
          </div>

          {/* Footer of certificate: QR, Seal, ID, Signatures */}
          <div className="pt-6 sm:pt-8 border-t border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10 text-center sm:text-left">
            {/* QR Code and Cert ID */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 p-1.5 sm:p-2 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-lg">
                <QrCode className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sertifikat ID:
                </p>
                <p className="font-mono text-xs font-bold text-pink-300">{certId}</p>
                <p className="text-[10px] text-slate-400">Berilgan sana: {dateStr}</p>
              </div>
            </div>

            {/* Seal / Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-700 p-1 flex items-center justify-center shadow-xl shadow-pink-600/30">
              <div className="w-full h-full rounded-full bg-[#1b1038] flex flex-col items-center justify-center text-center p-1">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tight text-white">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Signatures */}
            <div className="text-center sm:text-right">
              <p className="font-serif italic text-sm sm:text-base text-pink-300">devsisters.uz jamoasi</p>
              <div className="w-28 sm:w-32 h-0.5 bg-purple-700 my-1 mx-auto sm:ml-auto" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Platforma boshqaruv kengashi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
