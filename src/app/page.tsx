'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TeachersSection from '@/components/TeachersSection';
import FeaturesSection from '@/components/FeaturesSection';
import LessonsSection from '@/components/LessonsSection';
import QuizSection from '@/components/QuizSection';
import PracticeSection from '@/components/PracticeSection';
import CommunitySection from '@/components/CommunitySection';
import RoadmapSection from '@/components/RoadmapSection';
import Footer from '@/components/Footer';
import VideoModal from '@/components/VideoModal';

import { Teacher, Lesson, Quiz, PracticeItem, CommunityPost } from '@/lib/types';
import {
  INITIAL_TEACHERS,
  INITIAL_LESSONS,
  INITIAL_QUIZZES,
  INITIAL_PRACTICE,
  INITIAL_POSTS,
} from '@/lib/data';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>(INITIAL_PRACTICE);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_POSTS);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeVideoLesson, setActiveVideoLesson] = useState<Lesson | null>(null);

  // Load live data from Supabase & localStorage
  useEffect(() => {
    async function loadLiveData() {
      try {
        // 1. Fetch Teachers
        const { data: dbTeachers, error: tErr } = await supabase
          .from('teachers')
          .select('*')
          .order('display_order', { ascending: true });

        if (!tErr && dbTeachers && dbTeachers.length > 0) {
          setTeachers(dbTeachers);
        } else {
          const localT = localStorage.getItem('devsisters_teachers');
          if (localT) setTeachers(JSON.parse(localT));
        }

        // 2. Fetch Lessons
        const { data: dbLessons, error: lErr } = await supabase
          .from('lessons')
          .select('*')
          .order('order_num', { ascending: true });

        if (!lErr && dbLessons && dbLessons.length > 0) {
          setLessons(dbLessons);
        } else {
          const localL = localStorage.getItem('devsisters_lessons');
          if (localL) setLessons(JSON.parse(localL));
        }

        // 3. Fetch Quizzes
        const { data: dbQuizzes, error: qErr } = await supabase.from('quizzes').select('*');
        if (!qErr && dbQuizzes && dbQuizzes.length > 0) {
          setQuizzes(dbQuizzes);
        }

        // 4. Fetch Community Posts
        const { data: dbPosts, error: pErr } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!pErr && dbPosts && dbPosts.length > 0) {
          setCommunityPosts(dbPosts);
        } else {
          const localP = localStorage.getItem('devsisters_posts');
          if (localP) setCommunityPosts(JSON.parse(localP));
        }
      } catch (err) {
        console.warn('Could not sync with Supabase in background:', err);
      }
    }

    loadLiveData();
  }, []);

  // Handle adding new community post
  const handleAddPost = async (newPost: Omit<CommunityPost, 'id' | 'likes' | 'created_at'>) => {
    const postItem: CommunityPost = {
      ...newPost,
      id: `post-${Date.now()}`,
      likes: 0,
      created_at: 'Hozirgina',
    };

    const updated = [postItem, ...communityPosts];
    setCommunityPosts(updated);
    localStorage.setItem('devsisters_posts', JSON.stringify(updated));

    // Also insert to Supabase
    try {
      await supabase.from('community_posts').insert([
        {
          author_name: postItem.author_name,
          title: postItem.title,
          content: postItem.content,
          likes: 0,
        },
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Hero />

        <TeachersSection
          teachers={teachers}
          selectedSubject={selectedSubject}
          onSelectSubject={(slug) => setSelectedSubject(slug)}
        />

        <FeaturesSection />

        <LessonsSection
          lessons={lessons}
          teachers={teachers}
          selectedSubject={selectedSubject}
          onSelectSubject={(slug) => setSelectedSubject(slug)}
          onOpenVideo={(lesson) => setActiveVideoLesson(lesson)}
        />

        <QuizSection quizzes={quizzes} />

        <PracticeSection items={practiceItems} />

        <CommunitySection posts={communityPosts} onAddPost={handleAddPost} />

        <RoadmapSection />
      </main>

      <Footer />

      {/* Video Modal Player */}
      <VideoModal
        lesson={activeVideoLesson}
        onClose={() => setActiveVideoLesson(null)}
      />
    </div>
  );
}
