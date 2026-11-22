'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CommunityPost } from '../lib/types';
import {
  Users,
  Heart,
  MessageSquare,
  Send,
  Sparkles,
  PlusCircle,
  Radio,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Award,
} from 'lucide-react';

interface CommunitySectionProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'created_at'>) => void;
}

interface ChatMessage {
  id: string;
  sender_name: string;
  sender_role: 'student' | 'teacher' | 'admin';
  avatar_color: string;
  content: string;
  time: string;
  reactions: Record<string, number>;
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender_name: 'Hazratova Sevinch',
    sender_role: 'teacher',
    avatar_color: 'from-pink-500 to-rose-600',
    content: 'Qizlarjonlar, hammangizga xayrli kech! Yangi 1-darsimiz yuklandi, vazifalarni ko‘rib savollaringiz bo‘lsa shu yerda yozishingiz mumkin! 🌸',
    time: '20:15',
    reactions: { '❤️': 14, '🔥': 8 },
  },
  {
    id: 'm-2',
    sender_name: 'Madinaxon',
    sender_role: 'student',
    avatar_color: 'from-purple-500 to-indigo-600',
    content: 'Ustoz, 1-darsdagi iboralarni yodlab chiqdim, speaking darsingiz juda zo‘r tushuntirilgan ekan! Rahmat katta! ✨',
    time: '20:18',
    reactions: { '👏': 6, '❤️': 9 },
  },
  {
    id: 'm-3',
    sender_name: 'Mattiyeva Ilmira',
    sender_role: 'teacher',
    avatar_color: 'from-amber-500 to-rose-500',
    content: 'Ertalab 07:00 da barchangiz bilan 10 daqiqalik yengil badantarbiya qilamiz, o‘tkazib yubormang! Sog‘lom qomat — go‘zallik garovi 💪',
    time: '20:25',
    reactions: { '🔥': 12, '💪': 15 },
  },
  {
    id: 'm-4',
    sender_name: 'Ziyoda Karimova',
    sender_role: 'student',
    avatar_color: 'from-emerald-500 to-teal-600',
    content: 'Kimyo fanidagi testdan 100 ball oldim! Sertifikatni yuklab oldim, juda ham chiroyli chiqdi 🎉',
    time: '20:31',
    reactions: { '🎉': 19, '✨': 11 },
  },
  {
    id: 'm-5',
    sender_name: 'Abdurashidova Farida',
    sender_role: 'teacher',
    avatar_color: 'from-blue-500 to-cyan-600',
    content: 'Barakalla Ziyodaxon! Hamma qizlarimizga omad tilayman, savollaringiz bo‘lsa doim yordamga tayyorman 🧪👏',
    time: '20:34',
    reactions: { '❤️': 10 },
  },
];

export default function CommunitySection({ posts, onAddPost }: CommunitySectionProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'forum'>('chat');

  // Forum state
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Live Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [senderName, setSenderName] = useState('Mehmon O‘quvchi');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // load saved messages if any
    const saved = localStorage.getItem('devsisters_live_chat');
    if (saved) {
      try {
        setChatMessages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender_name: senderName.trim() || 'O‘quvchi Qiz',
      sender_role: 'student',
      avatar_color: 'from-pink-500 to-purple-600',
      content: chatInput.trim(),
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      reactions: { '❤️': 1 },
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    setChatInput('');
    localStorage.setItem('devsisters_live_chat', JSON.stringify(updated));

    setTimeout(() => {
      chatScrollRef.current?.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleChatReaction = (msgId: string, emoji: string) => {
    setChatMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          const current = m.reactions[emoji] || 0;
          return {
            ...m,
            reactions: { ...m.reactions, [emoji]: current + 1 },
          };
        }
        return m;
      })
    );
  };

  const handleLike = (id: string, currentLikes: number) => {
    if (likedPosts[id]) return;

    setLikedPosts((prev) => ({ ...prev, [id]: true }));
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? currentLikes) + 1,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !content.trim()) return;

    onAddPost({
      author_name: name.trim(),
      title: title.trim(),
      content: content.trim(),
    });

    setName('');
    setTitle('');
    setContent('');
    setShowModal(false);
  };

  return (
    <section id="hamjamiyat" className="py-20 relative bg-[#0e071e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold mb-3 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Qizlar Hamjamiyati</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hamjamiyat & Jonli Muhokamalar
            </h2>
            <p className="text-slate-400 mt-2 text-base max-w-xl">
              Ustozlar va o‘quvchi qizlar bilan to‘g‘ridan-to‘g‘ri muloqot, savol-javoblar va o‘zaro qo‘llab-quvvatlash maydoni.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-[#140b2b] border border-purple-800/50 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-rose-300" />
              <span>Ommaviy Jonli Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'forum'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Savol-Javoblar Forumi</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Ommaviy Jonli Chat */}
        {activeTab === 'chat' && (
          <div className="rounded-3xl bg-[#150c2e] border border-purple-800/40 p-4 sm:p-6 shadow-2xl relative overflow-hidden animate-fade-in">
            {/* Top Chat Bar */}
            <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-purple-800/40 gap-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Jonli Muloqot Xonasi
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      56 nafar qiz onlayn
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    O‘zbekiston bo‘ylab barcha qizlar va 7 nafar ustoz bir joyda
                  </p>
                </div>
              </div>

              {/* Sender Name tag */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Ismingiz:</span>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Ismingizni kiriting"
                  className="px-3 py-1.5 rounded-xl bg-[#0d061e] border border-purple-700/50 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Chat Stream */}
            <div
              ref={chatScrollRef}
              className="space-y-4 max-h-[460px] overflow-y-auto pr-2 mb-4 scrollbar-thin scrollbar-thumb-purple-800"
            >
              {chatMessages.map((msg) => {
                const isTeacher = msg.sender_role === 'teacher';
                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isTeacher
                        ? 'bg-gradient-to-r from-pink-950/30 to-purple-950/30 border-pink-500/30'
                        : 'bg-[#1a1038]/70 border-purple-800/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-tr ${msg.avatar_color} flex items-center justify-center text-white font-bold text-xs shadow-md`}
                        >
                          {msg.sender_name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{msg.sender_name}</span>
                            {isTeacher && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                                <Award className="w-3 h-3 text-pink-400" /> Ustoz
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{msg.time}</span>
                        </div>
                      </div>

                      {/* Quick reaction buttons */}
                      <div className="flex items-center gap-1 text-xs">
                        {['❤️', '🔥', '👏'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleChatReaction(msg.id, emoji)}
                            className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
                          >
                            <span>{emoji}</span>
                            {msg.reactions[emoji] ? (
                              <span className="text-[10px] font-semibold text-pink-300">
                                {msg.reactions[emoji]}
                              </span>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-10">
                      {msg.content}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Xabaringizni yozing (savol bering, fikr bildiring)..."
                className="flex-1 px-4 py-3 rounded-2xl bg-[#0d061e] border border-purple-700/50 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-pink-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Yuborish</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: Savol-Javoblar Forumi */}
        {activeTab === 'forum' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Yangi Savol Yo‘llash</span>
              </button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const currentLikes = likesMap[post.id] ?? post.likes;
                const isLiked = likedPosts[post.id];

                return (
                  <div
                    key={post.id}
                    className="rounded-3xl p-6 bg-[#1a1033]/80 border border-purple-800/40 hover:border-pink-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {post.author_name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{post.author_name}</h4>
                            <p className="text-[11px] text-slate-400">{post.created_at}</p>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-4 mb-6">
                        {post.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                      <button
                        onClick={() => handleLike(post.id, post.likes)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          isLiked
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`}
                        />
                        <span>{currentLikes} taqqoslash</span>
                      </button>

                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <MessageSquare className="w-4 h-4" />
                        <span>Fikrlar</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal for creating a post */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-[#1a1033] border border-purple-700/50 p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Savol Yo‘llash</h3>
                    <p className="text-xs text-slate-400">Ustozlar va qizlar sizga javob berishadi</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Ismingiz
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Dilnoza"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e071e] border border-purple-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Savol sarlavhasi
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Qisqa va tushunarli sarlavha"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e071e] border border-purple-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Savol matni yoki fikringiz
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Batafsil yozing..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e071e] border border-purple-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold shadow-lg shadow-pink-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Joylashtirish</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
