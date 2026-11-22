export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'teacher' | 'student';
  subject_slug?: string; // For teachers
  avatar_url?: string;
  phone?: string;
  points?: number;
  created_at?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  slug: string;
  bio: string;
  experience: string;
  avatar_url: string;
  telegram?: string;
  display_order?: number;
}

export interface Lesson {
  id: string;
  teacher_id?: string;
  subject_slug: string;
  title: string;
  description: string;
  video_url: string;
  duration: string;
  order_num: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  subject_slug: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface PracticeItem {
  id: string;
  subject_slug: string;
  category: 'vocabulary' | 'exercise' | 'workout';
  title: string;
  data: {
    word?: string;
    translation?: string;
    pronunciation?: string;
    example?: string;
    steps?: string[];
    reps?: string;
    tip?: string;
  };
}

export interface CommunityPost {
  id: string;
  author_name: string;
  subject_slug?: string;
  title: string;
  content: string;
  likes: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id?: string;
  quiz_id?: string;
  quiz_score?: number;
  completed: boolean;
  created_at?: string;
}
