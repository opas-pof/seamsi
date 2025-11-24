import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const temple = url.searchParams.get('temple')?.trim();
  const random = url.searchParams.get('random');
  const number = url.searchParams.get('number');

  try {
    if (temple && temple.length > 0) {
      if (random === '1' || random === 'true') {
        const { count, error: countErr } = await supabaseServer
          .from('fortunes')
          .select('fortune_number', { count: 'exact', head: true })
          .eq('temple_id', temple);
        if (countErr) throw countErr;
        const total = count ?? 0;
        if (total <= 0) return NextResponse.json({ row: null, total }, { 
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Vary': 'Accept, Accept-Encoding',
            'X-Accel-Expires': '0',
            'Surrogate-Control': 'no-store',
          },
        });
        const idx = Math.floor(Math.random() * total);
        const { data, error } = await supabaseServer
          .from('fortunes')
          .select('temple_id,fortune_number,title,content')
          .eq('temple_id', temple)
          .order('fortune_number')
          .range(idx, idx);
        if (error) throw error;
        const row = (data ?? [])[0] ?? null;
        return NextResponse.json({ row, total }, { 
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Vary': 'Accept, Accept-Encoding',
            'X-Accel-Expires': '0',
            'Surrogate-Control': 'no-store',
          },
        });
      }
      if (number && !random) {
        // Single fortune by temple and number
        const { data, error } = await supabaseServer
          .from('fortunes')
          .select('temple_id,fortune_number,title,content,seo_title,seo_description,seo_keywords,seo_image,smo_title,smo_description')
          .eq('temple_id', temple)
          .eq('fortune_number', Number(number))
          .maybeSingle();
        if (error) throw error;
        return NextResponse.json({ row: data ?? null }, { 
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Vary': 'Accept, Accept-Encoding',
            'X-Accel-Expires': '0',
            'Surrogate-Control': 'no-store',
          },
        });
      }
      // All fortunes of a temple
      const { data, error } = await supabaseServer
        .from('fortunes')
        .select('temple_id,fortune_number,title,content,seo_title,seo_description,seo_keywords,seo_image,smo_title,smo_description')
        .eq('temple_id', temple)
        .order('fortune_number', { ascending: true })
        .limit(1000);
      if (error) throw error;
      return NextResponse.json({ rows: data ?? [] }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Vary': 'Accept, Accept-Encoding',
          'X-Accel-Expires': '0',
          'Surrogate-Control': 'no-store',
        },
      });
    }

    // All fortunes (no filter)
    const { data, error } = await supabaseServer
      .from('fortunes')
      .select('temple_id,fortune_number,title,content,seo_title,seo_description,seo_keywords,seo_image,smo_title,smo_description')
      .order('fortune_number', { ascending: true })
      .limit(1000);
    if (error) throw error;
    return NextResponse.json({ rows: data ?? [] }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Vary': 'Accept, Accept-Encoding',
        'X-Accel-Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const temple_id = body?.temple_id as string | undefined;
    const fortune_number = body?.fortune_number as number | undefined;
    if (!temple_id || !Number.isFinite(fortune_number)) {
      return NextResponse.json({ error: 'temple_id and fortune_number are required' }, { status: 400 });
    }

    const keywordsArray = body?.seo_keywords
      ? (Array.isArray(body.seo_keywords) 
          ? body.seo_keywords 
          : typeof body.seo_keywords === 'string' 
            ? body.seo_keywords.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
            : [])
      : null;

    const payload: any = {
      temple_id,
      fortune_number: Number(fortune_number),
      title: body?.title || '',
      content: body?.content || '',
      seo_title: body?.seo_title || null,
      seo_description: body?.seo_description || null,
      seo_keywords: keywordsArray && keywordsArray.length > 0 ? keywordsArray : null,
      seo_image: body?.seo_image || null,
      smo_title: body?.smo_title || null,
      smo_description: body?.smo_description || null,
    };

    const { error } = await supabaseServer
      .from('fortunes')
      .insert(payload);

    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 200 });
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

    const { error } = await supabaseServer
      .from('fortunes')
      .update(payload)
      .match({ temple_id, fortune_number });

    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}

