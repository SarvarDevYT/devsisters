'use client';

import React, { useState } from 'react';
import { Quiz } from '../lib/types';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizSectionProps {
  quizzes: Quiz[];
  onViewCertificate?: (courseName: string, scorePercent: number) => void;
}

export default function QuizSection({ quizzes, onViewCertificate }: QuizSectionProps) {
  const [activeQuizId, setActiveQuizId] = useState<string>(quizzes[0]?.id || '');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const activeQuiz = quizzes.find((q) => q.id === activeQuizId) || quizzes[0];
  const questions = activeQuiz?.questions || [];
  const currentQ = questions[currentQuestionIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQ.correct_index) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e24b80', '#a855f7', '#38bdf8', '#fbbf24'],
        });
      } catch (e) {
        // ignore in non-browser
      }
    }
  };

  const handleRestart = (quizId?: string) => {
    if (quizId) setActiveQuizId(quizId);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <section id="testlar" className="py-20 bg-[#140b2a]/90 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Interaktiv Testlar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bilimingizni Mustaqil Tekshiring
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            O‘zlashtirgan bilimlaringizni interaktiv test orqali sinab ko‘ring va mustahkamlang.
          </p>
        </div>

        {/* Quiz Selector tabs */}
        <div className="flex items-center sm:justify-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2 px-1 scrollbar-none">
          {quizzes.map((q) => (
            <button
              key={q.id}
              onClick={() => handleRestart(q.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                activeQuiz?.id === q.id
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {q.title}
            </button>
          ))}
        </div>

        {/* Quiz Card */}
        {activeQuiz && questions.length > 0 && (
          <div className="p-5 sm:p-10 rounded-3xl bg-[#1d1238] border border-purple-800/40 shadow-2xl backdrop-blur-xl">
            {!isCompleted ? (
              <div>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
                  <span>
                    Savol {currentQuestionIdx + 1} / {questions.length}
                  </span>
                  <span>{Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 mb-8 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Question Text */}
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-8 leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {currentQ.options.map((opt, idx) => {
                    let optStyle = 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-pink-500/40';

                    if (selectedOption === idx) {
                      optStyle = 'bg-pink-600/20 border-pink-500 text-white font-semibold';
                    }

                    if (isAnswerSubmitted) {
                      if (idx === currentQ.correct_index) {
                        optStyle = 'bg-emerald-600/20 border-emerald-500 text-emerald-200 font-bold';
                      } else if (selectedOption === idx) {
                        optStyle = 'bg-rose-600/20 border-rose-500 text-rose-200';
                      } else {
                        optStyle = 'bg-white/5 border-white/5 opacity-50 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${optStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-white/10 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-sm sm:text-base">{opt}</span>
                        </div>

                        {isAnswerSubmitted && idx === currentQ.correct_index && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        )}
                        {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correct_index && (
                          <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Explanation */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-2xl bg-purple-900/30 border border-purple-500/30 text-xs sm:text-sm text-purple-200 mb-6 animate-fade-in">
                    <p className="font-bold text-pink-300 mb-1">Izoh:</p>
                    <p>{currentQ.explanation}</p>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-center justify-center flex items-center"
                    >
                      Javobni Tekshirish
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <span>
                        {currentQuestionIdx + 1 < questions.length ? 'Keyingi Savol' : 'Natijani Ko‘rish'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Completion Screen */
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-3xl bg-pink-500/20 text-pink-400 mx-auto flex items-center justify-center mb-6 shadow-xl shadow-pink-500/20">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  Tabriklaymiz! Test yakunlandi 🎉
                </h3>
                <p className="text-slate-300 text-sm mb-6">
                  Siz ushbu test bo‘yicha o‘z bilimlaringizni muvaffaqiyatli sinovdan o‘tkazdingiz.
                </p>

                <div className="inline-block p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 min-w-[220px]">
                  <p className="text-xs uppercase font-bold tracking-widest text-pink-400 mb-1">
                    Sizning Natijangiz
                  </p>
                  <p className="text-4xl font-black text-white">
                    {score} / {questions.length}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    To‘g‘rilik ko‘rsatkichi: {Math.round((score / questions.length) * 100)}%
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                  <button
                    onClick={() => handleRestart()}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-pink-600/30"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Qayta topshirish</span>
                  </button>

                  {onViewCertificate && Math.round((score / questions.length) * 100) >= 70 ? (
                    <button
                      onClick={() =>
                        onViewCertificate(
                          activeQuiz.title,
                          Math.round((score / questions.length) * 100)
                        )
                      }
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/30"
                    >
                      <Award className="w-4 h-4 text-emerald-200" />
                      <span>🏆 Sertifikatni Olish</span>
                    </button>
                  ) : (
                    <div className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold text-center">
                      🔒 Sertifikat olish uchun kamida 70% natija kerak (Hozir: {Math.round((score / questions.length) * 100)}%)
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
