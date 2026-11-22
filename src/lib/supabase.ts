import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uibaudggdyerfamvmobw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpYmF1ZGdnZHllcmZhbXZtb2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzNTU0NDEsImV4cCI6MjExMDkzMTQ0MX0.u8r177ctKUV6y0qjLUD8IGH2L_m5XcokrZbm_gE6tIc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
