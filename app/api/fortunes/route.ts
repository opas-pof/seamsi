import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-next';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const temple = url.searchParams.get('temple');
  const random = url.searchParams.get('random');
  const number = url.searchParams.get('number');

  console.log('[API] GET request:', { url: url.toString(), temple, random, number, origin: req.headers.get('origin') });

  try {
    if (temple) {
      if (random === '1' || random === 'true') {
        // Random one fortune for temple
        console.log('[API] Random fortune request for temple:', temple);
        const { count, error: countErr } = await supabase
          .from('fortunes')
          .select('fortune_number', { count: 'exact', head: true })
          .eq('temple_id', temple);
        console.log('[API] Count result:', { count, error: countErr?.message });
        if (countErr) throw countErr;
        const total = count ?? 0;
        if (total <= 0) {
          console.log('[API] No fortunes found for temple:', temple);
          return NextResponse.json({ row: null, total }, { status: 200 });
        }
        const idx = Math.floor(Math.random() * total);
        console.log('[API] Fetching fortune at index:', idx, 'of', total);
        const { data, error } = await supabase
          .from('fortunes')
          .select('temple_id,fortune_number,title,content')
          .eq('temple_id', temple)
          .order('fortune_number')
          .range(idx, idx);
        console.log('[API] Fortune result:', { dataLength: data?.length, error: error?.message });
        if (error) throw error;
        const row = (data ?? [])[0] ?? null;
        console.log('[API] Returning row:', row ? 'found' : 'null');
        const response = NextResponse.json({ row, total }, { status: 200 });
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        return response;
      }
      if (number && !random) {
        // Single fortune by temple and number
        const { data, error } = await supabase
          .from('fortunes')
          .select('temple_id,fortune_number,title,content,seo_title,seo_description,seo_keywords,seo_image,smo_title,smo_description')
          .eq('temple_id', temple)
          .eq('fortune_number', Number(number))
          .maybeSingle();
        if (error) throw error;
        return NextResponse.json({ row: data ?? null }, { status: 200 });
      }
      // All fortunes of a temple
      const { data, error } = await supabase
        .from('fortunes')
        .select('temple_id,fortune_number,title,content,seo_title,seo_description,seo_keywords,seo_image,smo_title,smo_description')
        .eq('temple_id', temple)
        .order('fortune_number', { ascending: true })
        .limit(1000);
      if (error) throw error;
      return NextResponse.json({ rows: data }, { status: 200 });
    }

    // All fortunes (no filter)
    const { data, error } = await supabase
      .from('fortunes')
      .select('temple_id,fortune_number,title,content,seo_title,seo_description,seo_keywords,seo_image,smo_title,smo_description')
      .order('fortune_number', { ascending: true })
      .limit(1000);
    if (error) throw error;
    return NextResponse.json({ rows: data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const temple_id = body?.temple_id as string | undefined;
    const fortune_number = body?.fortune_number as number | undefined;
    if (!temple_id || !Number.isFinite(fortune_number)) {
      return NextResponse.json({ error: 'temple_id and fortune_number are required' }, { status: 400 });
    }

    const payload: any = {};
    const fields = [
      'title',
      'content',
      'seo_title',
      'seo_description',
      'seo_keywords',
      'seo_image',
      'smo_title',
      'smo_description',
    ];
    for (const key of fields) {
      if (body.hasOwnProperty(key)) {
        const v = body[key];
        payload[key] = v === '' ? null : v;
      }
    }

    const { error } = await supabase
      .from('fortunes')
      .update(payload)
      .match({ temple_id, fortune_number });

    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}


