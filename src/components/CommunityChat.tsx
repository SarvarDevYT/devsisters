'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CommunityPost, User } from '../lib/types';
import { INITIAL_POSTS } from '../lib/data';
import {
  Users,
  Heart,
  MessageSquare,
  Send,
  Sparkles,
  PlusCircle,
  Radio,
  Trash2,
  CheckCircle2,
  Award,
  ShieldCheck,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface ChatMessage {
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

interface CommunityChatProps {
  currentUser?: User | null;
  className?: string;
}

export default function CommunityChat({ currentUser, className = '' }: CommunityChatProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'forum'>('chat');

  // Forum state
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  // Live Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load live messages and posts
  useEffect(() => {
    const savedChat = localStorage.getItem('devsisters_live_chat');
    if (savedChat) {
      try {
        setChatMessages(JSON.parse(savedChat));
      } catch (e) {
        console.error(e);
      }
    }

    const savedPosts = localStorage.getItem('devsisters_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error(e);
      }
    }

    // Attempt to load from Supabase if table exists
    async function fetchPosts() {
      try {
        const { data: dbPosts } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (dbPosts && dbPosts.length > 0) {
          setPosts(dbPosts);
        }
      } catch (e) {
        // ignore
      }
    }
    fetchPosts();
  }, []);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    if (activeTab === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeTab]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const role = currentUser?.role || 'student';
    let avatarGrad = 'from-pink-500 to-purple-600';
    if (role === 'teacher') avatarGrad = 'from-amber-500 to-rose-600';
    if (role === 'admin') avatarGrad = 'from-purple-600 to-indigo-600';

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender_name: currentUser?.name || 'O‘quvchi Qiz',
      sender_role: role,
      avatar_color: avatarGrad,
      content: chatInput.trim(),
      time: timeStr,
      reactions: {},
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    setChatInput('');
    localStorage.setItem('devsisters_live_chat', JSON.stringify(updated));
  };

  const handleChatReaction = (messageId: string, emoji: string) => {
    const updated = chatMessages.map((m) => {
      if (m.id === messageId) {
        const currentCount = m.reactions[emoji] || 0;
        return {
          ...m,
          reactions: {
            ...m.reactions,
            [emoji]: currentCount + 1,
          },
        };
      }
      return m;
    });
    setChatMessages(updated);
    localStorage.setItem('devsisters_live_chat', JSON.stringify(updated));
  };

  const handleDeleteMessage = (messageId: string) => {
    const updated = chatMessages.filter((m) => m.id !== messageId);
    setChatMessages(updated);
    localStorage.setItem('devsisters_live_chat', JSON.stringify(updated));
  };

  const handleLikePost = (id: string, initialLikes: number) => {
    if (likedPosts[id]) return;
    const current = likesMap[id] ?? initialLikes;
    setLikesMap((prev) => ({ ...prev, [id]: current + 1 }));
    setLikedPosts((prev) => ({ ...prev, [id]: true }));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author_name: currentUser?.name || 'O‘quvchi',
      subject_slug: currentUser?.subject_slug || 'umumiy',
      title: postTitle.trim(),
      content: postContent.trim(),
      likes: 0,
      created_at: 'Hozirgina',
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('devsisters_posts', JSON.stringify(updated));

    try {
      await supabase.from('community_posts').insert([
        {
          author_name: newPost.author_name,
          title: newPost.title,
          content: newPost.content,
          likes: 0,
        },
      ]);
    } catch (e) {
      // ignore
    }

    setPostTitle('');
    setPostContent('');
    setShowModal(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#160d2e] border border-purple-900/40">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse text-rose-300" />
            <span>Ommaviy Jonli Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('forum')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'forum'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Savol-Javoblar Forumi</span>
          </button>
        </div>

        {/* Identity badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 w-full sm:w-auto justify-center sm:justify-start">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>
            Hisobingiz: <strong className="text-white">{currentUser?.name || 'Mehmon'}</strong>
          </span>
          {currentUser?.role === 'teacher' && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
              Ustoz
            </span>
          )}
          {currentUser?.role === 'admin' && (
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* TAB 1: LIVE CHAT */}
      {activeTab === 'chat' && (
        <div className="rounded-3xl bg-[#150c2e] border border-purple-800/40 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-purple-800/40 gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  Jonli Muloqot Xonasi
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    56 nafar faol onlayn
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  O‘zbekiston bo‘ylab barcha o‘quvchi qizlar, ustozlar va ma’muriyat yagona muloqotda
                </p>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            ref={chatScrollRef}
            className="space-y-4 max-h-[480px] overflow-y-auto pr-2 mb-4 scrollbar-thin scrollbar-thumb-purple-800"
          >
            {chatMessages.map((msg) => {
              const isTeacher = msg.sender_role === 'teacher';
              const isAdmin = msg.sender_role === 'admin';
              const canDelete = currentUser?.role === 'admin' || (currentUser && currentUser.name === msg.sender_name);

              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isAdmin
                      ? 'bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-[#190f38] border-purple-500/40'
                      : isTeacher
                      ? 'bg-gradient-to-r from-pink-950/40 to-[#190e33] border-pink-500/30'
                      : 'bg-[#1a1038]/70 border-purple-800/30'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-tr ${msg.avatar_color} flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0`}
                      >
                        {msg.sender_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{msg.sender_name}</span>
                          {isTeacher && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              <Award className="w-3 h-3 text-amber-400" /> Ustoz
                            </span>
                          )}
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/25 text-purple-300 border border-purple-500/40">
                              <ShieldCheck className="w-3 h-3 text-purple-400" /> Admin
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{msg.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      {['❤️', '🔥', '👏', '💪'].map((emoji) => (
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

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          title="Xabarni o‘chirish"
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-0 sm:pl-10 mt-1">
                    {msg.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`${currentUser?.name || 'Siz'}: xabaringizni yozing (savol bering, fikr bildiring)...`}
              className="flex-1 px-4 py-3 rounded-2xl bg-[#0d061e] border border-purple-700/50 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Yuborish</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: FORUM */}
      {activeTab === 'forum' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Savol-Javoblar & Fikrlar</h3>
              <p className="text-xs text-slate-400">Darslar va fanlar yuzasidan muhokamalar</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-600/30 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yangi Savol Yo‘llash</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const currentLikes = likesMap[post.id] ?? post.likes;
              const isLiked = likedPosts[post.id];

              return (
                <div
                  key={post.id}
                  className="rounded-3xl p-6 bg-[#180f30] border border-purple-800/40 hover:border-pink-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {post.author_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{post.author_name}</h4>
                        <p className="text-[11px] text-slate-400">{post.created_at}</p>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-4 mb-6">
                      {post.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                    <button
                      onClick={() => handleLikePost(post.id, post.likes)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        isLiked
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`}
                      />
                      <span>{currentLikes}</span>
                    </button>

                    <span className="text-[11px] text-pink-300 font-medium">Hamjamiyat savoli</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Question Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
              <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#1b1035] border border-purple-800/60 shadow-2xl relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="text-xl font-bold text-white mb-2">Yangi Savol / Fikr Yo‘llash</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Ustozlar va boshqa qizlar savolingizga javob berishadi.
                </p>

                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Mavzu / Savol sarlavhasi
                    </label>
                    <input
                      type="text"
                      required
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="Masalan: Arab tili harakatlari bo‘yicha savol..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#0d061e] border border-purple-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Batafsil matn
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Savolingizni yoki fikringizni batafsil tushuntirib yozing..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#0d061e] border border-purple-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-sm shadow-xl shadow-pink-600/30 transition-all cursor-pointer"
                  >
                    E’lon qilish
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
