import { createClient } from "@supabase/supabase-js";

// รองรับทั้ง Vite เดิมและ Next
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || (import.meta as any)?.env?.VITE_SUPABASE_URL) as string;
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY) as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


