'use client'

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadFortuneSeoImage } from '@/lib/storage';

export default function AdminFortuneEdit() {
  const router = useRouter();
  const params = useParams<{ templeId: string; fortuneNumber: string }>();
  const templeId = params?.templeId as string | undefined;
  const fortuneNumber = params?.fortuneNumber ? Number(params.fortuneNumber) : undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [info, setInfo] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    seo_image: '',
    smo_title: '',
    smo_description: ''
  });

  useEffect(() => {
    const load = async () => {
      if (!templeId || !fortuneNumber) return;
      try {
        const basePath = window.location.pathname.includes('/fortune/') ? '/fortune' : '';
        const res = await fetch(`${basePath}/api/fortunes?temple=${encodeURIComponent(templeId)}&number=${fortuneNumber}&_t=${Date.now()}`, { cache: 'no-store' });
        const json = await res.json();
        
        // รองรับทั้ง format {row} และ {rows}
        let data = null;
        if (json?.row) {
          data = json.row;
        } else if (json?.rows && Array.isArray(json.rows) && json.rows.length > 0) {
          // ถ้าได้ rows มา ให้หา fortune ที่ตรงกับทั้ง temple_id และ fortune_number
          data = json.rows.find((f: any) => 
            f.temple_id === templeId && f.fortune_number === Number(fortuneNumber)
          );
        }
        
        if (data) {
          setForm({
            title: data.title ?? '',
            content: data.content ?? '',
            seo_title: data.seo_title ?? '',
            seo_description: data.seo_description ?? '',
            seo_keywords: Array.isArray(data.seo_keywords) ? data.seo_keywords.join(', ') : '',
            seo_image: data.seo_image ?? '',
            smo_title: data.smo_title ?? '',
            smo_description: data.smo_description ?? ''
          });
        } else {
          setError('ไม่พบข้อมูลเซียมซี');
        }
      } catch (e: any) {
        setError(e?.message || 'โหลดข้อมูลไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [templeId, fortuneNumber]);

  const save = async () => {
    if (!templeId || !fortuneNumber) return;
    setSaving(true);
    setError('');
    const keywordsArray = form.seo_keywords
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    try {
      const basePath = window.location.pathname.includes('/fortune/') ? '/fortune' : '';
      const res = await fetch(`${basePath}/api/fortunes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temple_id: templeId,
          fortune_number: Number(fortuneNumber),
          title: form.title,
          content: form.content,
          seo_title: form.seo_title || null,
          seo_description: form.seo_description || null,
          seo_keywords: keywordsArray.length ? keywordsArray : null,
          seo_image: form.seo_image || null,
          smo_title: form.smo_title || null,
          smo_description: form.smo_description || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'บันทึกไม่สำเร็จ');
      router.push(`/admin/temples/${templeId}/fortunes`);
    } catch (e: any) {
      setError(e?.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">ย้อนกลับ</Button>
      <Card className="p-6 bg-card/90 border-border/50">
        <h1 className="text-2xl font-bold mb-4">แก้ไขเซียมซี #{fortuneNumber}</h1>
        {loading && <p className="text-muted-foreground">กำลังโหลด...</p>}
        {error && <p className="text-destructive mb-4">{error}</p>}
        {!loading && (
          <div className="space-y-3">
            <Input placeholder="หัวข้อ" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="คำทำนาย" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <div className="pt-4">
              <h2 className="text-lg font-semibold mb-2">SEO / SMO</h2>
              <div className="space-y-3">
                <Input placeholder="SEO Title (title)" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
                <Textarea placeholder="SEO Description (meta description)" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
                <Input placeholder="SEO Keywords (คั่นด้วย comma)" value={form.seo_keywords} onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })} />
                <div className="space-y-2">
                  <label className="block text-sm">SEO/OG Image</label>
                  {form.seo_image && (
                    <div className="rounded border p-2 bg-muted/20">
                      <img src={form.seo_image} alt="ตัวอย่าง OG" className="max_h-48 object-contain mx-auto" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input type="file" accept="image/*" disabled={uploading} onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !templeId || !fortuneNumber) return;
                      try {
                        setUploading(true);
                        setError('');
                        setInfo('กำลังอัปโหลดรูป SEO...');
                        const url = await uploadFortuneSeoImage(file, templeId, Number(fortuneNumber));
                        setForm({ ...form, seo_image: url });
                      } catch (err: any) {
                        setError(err?.message || 'อัปโหลดรูป SEO ไม่สำเร็จ');
                      } finally {
                        setUploading(false);
                        setTimeout(() => setInfo(''), 3000);
                      }
                    }} />
                  </div>
                  {info && <p className="text-xs text-muted-foreground">{info}</p>}
                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
                <Input placeholder="SMO Title (og:title/twitter:title)" value={form.smo_title} onChange={(e) => setForm({ ...form, smo_title: e.target.value })} />
                <Textarea placeholder="SMO Description (og:description/twitter:description)" value={form.smo_description} onChange={(e) => setForm({ ...form, smo_description: e.target.value })} />
              </div>
            </div>
            <Button onClick={save} disabled={saving} className="mt-2">{saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}</Button>
          </div>
        )}
      </Card>
    </div>
  );
}


