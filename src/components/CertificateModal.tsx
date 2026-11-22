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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl my-8 relative">
        {/* Actions bar above certificate */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2 text-pink-300 font-bold text-sm">
            <Award className="w-5 h-5 text-pink-400" />
            <span>Rasmiy Ta‘lim Sertifikati</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-pink-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Chop etish / Yuklab olish</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Card Printable */}
        <div
          id="certificate-print"
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1b1038] via-[#241348] to-[#160d2e] border-4 border-amber-400/60 shadow-2xl relative overflow-hidden text-center text-slate-100"
        >
          {/* Ornamental corner decorations */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400/50 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/50 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400/50 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400/50 rounded-br-xl pointer-events-none" />

          {/* Background watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-white" />
          </div>

          {/* Header */}
          <div className="mb-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Raqamli Avlod Qizlar Akademiyasi</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
              SERTIFIKAT
            </h1>
            <p className="text-xs uppercase tracking-widest text-pink-300 font-semibold">
              Muvaffaqiyatli yakunlaganlik to‘g‘risida
            </p>
          </div>

          {/* Body */}
          <div className="my-8 relative z-10">
            <p className="text-sm text-slate-300 mb-2 font-light">Ushbu sertifikat tasdiqlaydiki,</p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-amber-200 to-pink-300 my-3 font-serif">
              {studentName || 'O‘quvchi'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mt-4">
              <strong>devsisters.uz</strong> platformasida <strong>{courseName}</strong> fani bo‘yicha 
              video darslar va interaktiv testlarni <strong>{scorePercent}%</strong> a‘lo natija bilan 
              muvaffaqiyatli tamomladi.
            </p>
          </div>

          {/* Footer of certificate: QR, Seal, ID, Signatures */}
          <div className="pt-8 border-t border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-left">
            {/* QR Code and Cert ID */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 p-2 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-lg">
                <QrCode className="w-12 h-12" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sertifikat ID:
                </p>
                <p className="font-mono text-xs font-bold text-pink-300">{certId}</p>
                <p className="text-[10px] text-slate-400">Berilgan sana: {dateStr}</p>
              </div>
            </div>

            {/* Seal / Badge */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-700 p-1 flex items-center justify-center shadow-xl shadow-pink-600/30">
              <div className="w-full h-full rounded-full bg-[#1b1038] flex flex-col items-center justify-center text-center p-1">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                <span className="text-[8px] font-black uppercase tracking-tight text-white">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Signatures */}
            <div className="text-center sm:text-right">
              <p className="font-serif italic text-base text-pink-300">devsisters.uz jamoasi</p>
              <div className="w-32 h-0.5 bg-purple-700 my-1 mx-auto sm:ml-auto" />
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Platforma boshqaruv kengashi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
