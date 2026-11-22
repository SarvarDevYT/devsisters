'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TeachersSection from '@/components/TeachersSection';
import FeaturesSection from '@/components/FeaturesSection';
import LessonsSection from '@/components/LessonsSection';
import WebinarsSection from '@/components/WebinarsSection';
import QuizSection from '@/components/QuizSection';
import PracticeSection from '@/components/PracticeSection';
import RoadmapSection from '@/components/RoadmapSection';
import Footer from '@/components/Footer';
import VideoModal from '@/components/VideoModal';
import CertificateModal from '@/components/CertificateModal';
import AiTutorModal from '@/components/AiTutorModal';
import OnboardingModal from '@/components/OnboardingModal';

import { Teacher, Lesson, Quiz, PracticeItem, CommunityPost } from '@/lib/types';
import {
  INITIAL_TEACHERS,
  INITIAL_LESSONS,
  INITIAL_QUIZZES,
  INITIAL_PRACTICE,
  INITIAL_POSTS,
} from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { getStoredUser } from '@/lib/auth';

export default function Home() {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>(INITIAL_PRACTICE);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_POSTS);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeVideoLesson, setActiveVideoLesson] = useState<Lesson | null>(null);

  // Onboarding Modal for first-time visitors
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Certificate Modal state
  const [certData, setCertData] = useState<{
    isOpen: boolean;
    courseName: string;
    scorePercent: number;
    studentName: string;
  }>({
    isOpen: false,
    courseName: 'Umumiy Ta‘lim Kursi',
    scorePercent: 100,
    studentName: 'O‘quvchi Qiz',
  });

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
          const merged = [...INITIAL_QUIZZES];
          dbQuizzes.forEach((dbQ) => {
            const idx = merged.findIndex((q) => q.subject_slug === dbQ.subject_slug);
            if (idx >= 0) {
              merged[idx] = dbQ;
            } else {
              merged.push(dbQ);
            }
          });
          setQuizzes(merged);
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

    // Check if new visitor for onboarding
    const activeUser = getStoredUser();
    if (!activeUser) {
      const seen = sessionStorage.getItem('devsisters_onboarding_seen');
      if (!seen) {
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
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

  const handleOpenCertificate = (courseName: string, scorePercent: number) => {
    const user = getStoredUser();
    setCertData({
      isOpen: true,
      courseName: courseName || 'devsisters.uz Ta‘lim Dasturi',
      scorePercent: scorePercent || 100,
      studentName: user?.name || 'Munisa Aliyeva',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Hero onStartLearning={() => setShowOnboarding(true)} />

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

        <WebinarsSection />

        <QuizSection
          quizzes={quizzes}
          onViewCertificate={(course, score) => handleOpenCertificate(course, score)}
        />

        <PracticeSection items={practiceItems} />

        <RoadmapSection />
      </main>

      <Footer />

      {/* Video Modal Player */}
      <VideoModal
        lesson={activeVideoLesson}
        onClose={() => setActiveVideoLesson(null)}
      />

      {/* Luxury Educational Certificate Modal */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        studentName={certData.studentName}
        courseName={certData.courseName}
        scorePercent={certData.scorePercent}
      />

      {/* SisterAI 24/7 Smart Floating Tutor */}
      <AiTutorModal />

      {/* First-time Visitor Onboarding & Subject Selection Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => {
          setShowOnboarding(false);
          sessionStorage.setItem('devsisters_onboarding_seen', 'true');
        }}
      />
    </div>
  );
}
