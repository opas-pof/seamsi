import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-next';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('fortunes')
    .select('fortune_number,title,content')
    .eq('temple_id', params.id);
  const base = new URL(req.url);
  if (error) return NextResponse.redirect(new URL(`/fortune/seamsi/temple/${params.id}`, base));
  const list = data ?? [];
  if (list.length === 0) return NextResponse.redirect(new URL(`/fortune/seamsi/temple/${params.id}`, base));
  const idx = Math.floor(Math.random() * list.length);
  const f = list[idx];
  const num = String(f.fortune_number).padStart(3, '0');
  const q = new URLSearchParams({
    title: f.title ?? '',
    content: f.content ?? '',
  }).toString();
  return NextResponse.redirect(new URL(`/fortune/seamsi/prediction/${num}?${q}`, base));
}


