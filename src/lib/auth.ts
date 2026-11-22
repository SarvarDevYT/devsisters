import { User } from './types';
import { supabase } from './supabase';

export const DEMO_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Asosiy Administrator',
    email: 'admin@devsisters.uz',
    password: 'admin123',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    phone: '+998 90 123 45 67',
    points: 999,
  },
  {
    id: 'u-teacher-1',
    name: 'Hazratova Sevinch',
    email: 'sevinch@devsisters.uz',
    password: 'teacher123',
    role: 'teacher',
    subject_slug: 'ingliz-tili',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    phone: '+998 91 234 56 78',
    points: 500,
  },
  {
    id: 'u-teacher-2',
    name: 'Lutfulloyeva Mahliyo',
    email: 'mahliyo@devsisters.uz',
    password: 'teacher123',
    role: 'teacher',
    subject_slug: 'arab-tili',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    phone: '+998 93 345 67 89',
    points: 500,
  },
  {
    id: 'u-teacher-3',
    name: 'Mattiyeva Ilmira',
    email: 'ilmira@devsisters.uz',
    password: 'teacher123',
    role: 'teacher',
    subject_slug: 'sport',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    phone: '+998 94 456 78 90',
    points: 500,
  },
  {
    id: 'u-student-1',
    name: 'Madina Rahimova',
    email: 'madina@devsisters.uz',
    password: 'student123',
    role: 'student',
    subject_slug: 'ingliz-tili',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    phone: '+998 95 901 23 45',
    points: 240,
  },
];

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('devsisters_active_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem('devsisters_active_user');
    sessionStorage.removeItem('devsisters_admin_auth');
  } else {
    localStorage.setItem('devsisters_active_user', JSON.stringify(user));
    if (user.role === 'admin') {
      sessionStorage.setItem('devsisters_admin_auth', 'true');
    }
  }
}

export async function loginUser(email: string, pass: string): Promise<{ user?: User; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  try {
    // 1. Try Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .eq('password', cleanPass)
      .maybeSingle();

    if (!error && data) {
      setStoredUser(data);
      return { user: data };
    }
  } catch (e) {
    console.warn('Supabase auth fallback:', e);
  }

  // 2. Check local users or demo users
  const localUsersJson = typeof window !== 'undefined' ? localStorage.getItem('devsisters_users_list') : null;
  const allUsers: User[] = localUsersJson ? JSON.parse(localUsersJson) : DEMO_USERS;

  const found = allUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
  );

  if (found) {
    setStoredUser(found);
    return { user: found };
  }

  return { error: 'Email yoki parol noto‘g‘ri kiritildi!' };
}

export async function registerStudent(
  name: string,
  email: string,
  pass: string,
  subject_slug?: string,
  phone?: string
): Promise<{ user?: User; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  const newUser: User = {
    id: `u-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    password: pass.trim(),
    role: 'student',
    subject_slug: subject_slug || 'arab-tili',
    phone: phone?.trim() || '',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    points: 100, // Welcome bonus points!
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('users').insert([newUser]);
  } catch (e) {
    console.warn('Supabase register error:', e);
  }

  // Save to local
  const localUsersJson = typeof window !== 'undefined' ? localStorage.getItem('devsisters_users_list') : null;
  const list: User[] = localUsersJson ? JSON.parse(localUsersJson) : [...DEMO_USERS];
  list.push(newUser);
  localStorage.setItem('devsisters_users_list', JSON.stringify(list));

  setStoredUser(newUser);
  return { user: newUser };
}

export async function updateUserSubject(userId: string, subjectSlug: string): Promise<User | null> {
  const current = getStoredUser();
  if (!current) return null;
  const updated: User = { ...current, subject_slug: subjectSlug };
  setStoredUser(updated);

  // Update in local list
  const localUsersJson = typeof window !== 'undefined' ? localStorage.getItem('devsisters_users_list') : null;
  if (localUsersJson) {
    const list: User[] = JSON.parse(localUsersJson);
    const idx = list.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      list[idx].subject_slug = subjectSlug;
      localStorage.setItem('devsisters_users_list', JSON.stringify(list));
    }
  }

  // Update in Supabase
  try {
    await supabase.from('users').update({ subject_slug: subjectSlug }).eq('id', userId);
  } catch (e) {
    console.warn('Supabase update subject:', e);
  }

  return updated;
}
