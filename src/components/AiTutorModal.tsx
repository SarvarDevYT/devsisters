'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, MessageSquare, User, BookOpen } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export default function AiTutorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Assalomu alaykum! Men devsisters.uz platformasining Sun‘iy Intellekt repetitoriman. 7 ta fandan (Ingliz tili, Arab tili, Rus tili, Ona tili, Kimyo, Geografiya, Sport) istalgan savolingizni bering, sizga jon deb tushuntirib beraman! ✨',
      time: 'Hozir',
    },
  ]);

  const quickPrompts = [
    'Ingliz tilida Speakingni qanday rivojlantirsa bo‘ladi?',
    'Kimyoda suv formulasining tuzilishi',
    'Arab alifbosida nechta harf bor?',
    'Ertalabki yengil badantarbiya mashqi',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const generateAiReply = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes('ingliz') || q.includes('speaking') || q.includes('so\'z') || q.includes('soz')) {
      return "Ingliz tilida Speakingni o‘stirish uchun har kuni kamida 15 daqiqa baland ovozda gapirish va Sevinch Hazratova ustozimizning darslaridagi yangi iboralarni ko‘zgu oldida takrorlash juda yaxshi natija beradi. Shuningdek, 'Amaliyot' bo‘limidagi lug‘at kartochkalaridan foydalanishingizni tavsiya qilaman!";
    }

    if (q.includes('kimyo') || q.includes('suv') || q.includes('atom') || q.includes('formula')) {
      return "Suv — ikkita Vodorod (H) va bitta Kislorod (O) atomining kovalent qutbli bog‘lanishidan hosil bo‘lgan modda (H2O). Farida Abdurashidova ustozimizning 1-darsida modda tuzilishi va atomlar haqida juda qiziqarli ko‘rgazmali misollar berilgan!";
    }

    if (q.includes('arab') || q.includes('alifbo') || q.includes('harf') || q.includes('tajvid')) {
      return "Arab alifbosida 28 ta harf mavjud bo‘lib, ularning barchasi undosh tovushlarni ifodalaydi. Harflar o‘ngdan chapga qarab yoziladi va so‘z boshida, o‘rtasida hamda oxirida o‘zgarib yoziladi. Mahliyo Lutfulloyeva ustozimizning video darsida bular amaliy ko‘rsatilgan!";
    }

    if (q.includes('sport') || q.includes('qomat') || q.includes('mashq') || q.includes('badantarbiya')) {
      return "Qomatni tiklash uchun kuniga 10 daqiqa yelka va umurtqani to‘g‘rilovchi cho‘zilish mashqlarini bajarish zarur. Ilmira Mattiyeva ustozimiz tavsiya qilgan 'Qomatni tiklash' darsini ko‘rishni va har kuni kamida 1.5-2 litr toza suv ichishni unutmang!";
    }

    if (q.includes('ona tili') || q.includes('ot') || q.includes('sifat') || q.includes('grammatika')) {
      return "Ona tilimizda Ot — shaxs, narsa va tushunchalarni bildirib 'Kim? Nima? Qayer?' so‘rog‘iga javob bo‘ladi. Sifat esa belgini bildirib 'Qanday? Qanaqa?' so‘rog‘iga javob beradi. Mubina Hikmatulloyeva ustozimiz bu mavzuni 'Ona tili' 1-darsida chuqur tahlil qilgan.";
    }

    return `Savolingiz uchun tashakkur! Ushbu mavzu bo‘yicha devsisters.uz saytidagi tegishli fan bo‘limiga o‘ting. Professional ustozlarimizning video darsliklari va interaktiv testlari sizga mavzuni mustahkam o‘rganishda yordam beradi. Yana savollaringiz bo‘lsa, bemalol so‘rang! 🌸`;
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: 'Hozir',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = generateAiReply(text);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        time: 'Hozir',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 text-white shadow-2xl shadow-pink-600/40 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 group"
        title="SisterAI Repetitor bilan suhbat"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#130a27] animate-pulse" />
        </div>
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          SisterAI Repetitor
        </span>
      </button>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] max-h-[80vh] rounded-3xl bg-[#180f33] border border-purple-700/60 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-[#140b2a] border-b border-purple-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>SisterAI — Qizlar Repetitori</span>
                </h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>24/7 faol ta‘lim yordamchisi</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';

              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-purple-900/30 border border-purple-700/40 text-slate-100 rounded-tl-sm'
                        : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-tr-sm shadow-md'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className="block text-[9px] opacity-60 text-right mt-1">{m.time}</span>
                  </div>

                  {!isAi && (
                    <div className="w-7 h-7 rounded-xl bg-white/10 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-pink-300">
                <Bot className="w-4 h-4" />
                <span className="animate-pulse">SisterAI javob tayyorlamoqda...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 border-t border-purple-900/40 bg-[#140b2a]/60 overflow-x-auto flex items-center gap-2 scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/5 hover:border-pink-500/30 text-[11px] text-slate-300 hover:text-pink-200 whitespace-nowrap transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#130a27] border-t border-purple-900/50 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Savolingizni yozing..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-2xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white transition-all shadow-md shadow-pink-600/30 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
