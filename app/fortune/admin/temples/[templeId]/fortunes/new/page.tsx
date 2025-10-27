'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadFortuneSeoImage } from '@/lib/storage';

interface TempleRow { temple_id: string; name: string; }

export default function AdminFortuneAdd() {
  const router = useRouter();
  const params = useParams<{ templeId: string }>();
  const templeIdParam = params?.templeId as string | undefined;

  const [temples, setTemples] = useState<TempleRow[]>([]);
  const [form, setForm] = useState({
    temple_id: templeIdParam ?? '',
    fortune_number: 1,
    title: '',
    content: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    seo_image: '',
    smo_title: '',
    smo_description: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [info, setInfo] = useState('');

  useEffect(() => {
    const loadTemples = async () => {
      const { data } = await supabase.from('temples').select('temple_id,name').order('name', { ascending: true });
      setTemples(data ?? []);
    };
    loadTemples();
  }, []);

  const saveFortune = async () => {
    if (!form.temple_id) {
      setError('กรุณาเลือกวัด');
      return;
    }
    setSaving(true);
    setError('');
    const keywordsArray = form.seo_keywords
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const { error } = await supabase.from('fortunes').insert({
      temple_id: form.temple_id,
      fortune_number: Number(form.fortune_number),
      title: form.title,
      content: form.content,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_keywords: keywordsArray.length ? keywordsArray : null,
      seo_image: form.seo_image || null,
      smo_title: form.smo_title || null,
      smo_description: form.smo_description || null
    });
    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    router.push(`/fortune/admin/temples/${form.temple_id}/fortunes`);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">ย้อนกลับ</Button>
      <Card className="p-6 bg-card/90 border-border/50">
        <h1 className="text-2xl font-bold mb-4">เพิ่มเซียมซีตามวัด</h1>
        {error && <p className="text-destructive mb-4">{error}</p>}
        <div className="space-y-3">
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.temple_id}
            onChange={(e) => setForm({ ...form, temple_id: e.target.value })}
          >
            <option value="">-- เลือกวัด --</option>
            {temples.map((t) => (
              <option key={t.temple_id} value={t.temple_id}>{t.name}</option>
            ))}
          </select>
          <Input type="number" placeholder="หมายเลข" value={form.fortune_number} onChange={(e) => setForm({ ...form, fortune_number: Number(e.target.value) })} />
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
                    <img src={form.seo_image} alt="ตัวอย่าง OG" className="max-h-48 object-contain mx-auto" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input type="file" accept="image/*" disabled={uploading} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !form.temple_id) return;
                    try {
                      setUploading(true);
                      setError('');
                      setInfo('กำลังอัปโหลดรูป SEO...');
                      const url = await uploadFortuneSeoImage(file, form.temple_id, Number(form.fortune_number));
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
          <Button onClick={saveFortune} disabled={saving} className="mt-2">{saving ? 'กำลังบันทึก...' : 'บันทึกเซียมซี'}</Button>
        </div>
      </Card>
    </div>
  );
}


