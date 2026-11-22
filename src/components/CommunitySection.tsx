'use client';

import React, { useState } from 'react';
import { CommunityPost } from '../lib/types';
import { Users, Heart, MessageSquare, Send, Sparkles, PlusCircle } from 'lucide-react';

interface CommunitySectionProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'created_at'>) => void;
}

export default function CommunitySection({ posts, onAddPost }: CommunitySectionProps) {
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold mb-3 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Qizlar Hamjamiyati</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Savol bering, tajriba almashing
            </h2>
            <p className="text-slate-400 mt-2 text-base max-w-xl">
              Bir-birimizni qo‘llab-quvvatlaydigan va birgalikda o‘sadigan xavfsiz qizlar klubi.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-600/30 hover:scale-[1.02] transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Savol Yo‘llash</span>
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
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                    <span>{currentLikes} taqqoslash</span>
                  </button>

                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <MessageSquare className="w-4 h-4" />
                    <span>Fikr bildirish</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: New Question */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-[#1b1035] border border-purple-800/60 p-6 sm:p-8 shadow-2xl relative">
              <h3 className="text-2xl font-bold text-white mb-2">Hamjamiyatga savol yo‘llash</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Qiziqtirgan savolingizni yozing, ustozlar yoki boshqa o‘quvchi qizlar javob berishadi.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Ism-sharifingiz
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Nilufar Karimova"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Mavzu / Savol sarlavhasi
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Savolingizning qisqacha mazmuni"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Savol matni
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Savolingizni batafsil tushuntirib yozing..."
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-semibold"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Yuborish</span>
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
