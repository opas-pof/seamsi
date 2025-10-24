import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const temple = url.searchParams.get('temple');
  const random = url.searchParams.get('random');

  try {
    if (temple) {
      if (random) {
        // Random one fortune for temple
        const { count, error: countErr } = await supabaseServer
          .from('fortunes')
          .select('fortune_number', { count: 'exact', head: true })
          .eq('temple_id', temple);
        if (countErr) throw countErr;
        const total = count ?? 0;
        if (total <= 0) return NextResponse.json({ row: null, total }, { status: 200 });
        const idx = Math.floor(Math.random() * total);
        const { data, error } = await supabaseServer
          .from('fortunes')
          .select('temple_id,fortune_number,title,content')
          .eq('temple_id', temple)
          .order('fortune_number')
          .range(idx, idx);
        if (error) throw error;
        const row = (data ?? [])[0] ?? null;
        return NextResponse.json({ row, total }, { status: 200 });
      }
      // All fortunes of a temple
      const { data, error } = await supabaseServer
        .from('fortunes')
        .select('temple_id,fortune_number,title,content')
        .eq('temple_id', temple)
        .limit(1000);
      if (error) throw error;
      return NextResponse.json({ rows: data }, { status: 200 });
    }

    // All fortunes (no filter)
    const { data, error } = await supabaseServer
      .from('fortunes')
      .select('temple_id,fortune_number,title,content')
      .limit(1000);
    if (error) throw error;
    return NextResponse.json({ rows: data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}


