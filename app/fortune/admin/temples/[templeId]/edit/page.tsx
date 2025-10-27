'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadTempleImage, uploadTempleSeoImage } from '@/lib/storage';

export default function AdminTempleEdit() {
  const router = useRouter();
  const params = useParams<{ templeId: string }>();
  const templeId = params?.templeId as string | undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [info, setInfo] = useState<string>('');
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    image: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    seo_image: '',
    smo_title: '',
    smo_description: ''
  });

  useEffect(() => {
    const load = async () => {
      if (!templeId) return;
      const { data, error } = await supabase
        .from('temples')
        .select('name,location,description,image,seo_title,seo_description,seo_keywords,seo_image,smo_title,smo_description')
        .eq('temple_id', templeId)
        .maybeSingle();
      if (error) setError(error.message);
      if (data) {
        setForm({
          name: data.name ?? '',
          location: data.location ?? '',
          description: data.description ?? '',
          image: data.image ?? '',
          seo_title: data.seo_title ?? '',
          seo_description: data.seo_description ?? '',
          seo_keywords: Array.isArray(data.seo_keywords) ? data.seo_keywords.join(', ') : '',
          seo_image: data.seo_image ?? '',
          smo_title: data.smo_title ?? '',
          smo_description: data.smo_description ?? ''
        });
      }
      setLoading(false);
    };
    load();
  }, [templeId]);

  useEffect(() => {
    if (!form.image) {
      setPreviewUrl('');
      setImageFileName('');
      return;
    }
    setPreviewUrl(form.image);
    try {
      const u = new URL(form.image);
      const last = u.pathname.split('/').pop() || '';
      setImageFileName(decodeURIComponent(last));
    } catch {
      const last = form.image.split('?')[0].split('/').pop() || '';
      setImageFileName(decodeURIComponent(last));
    }
  }, [form.image]);

  const save = async () => {
    if (!templeId) return;
    setSaving(true);
    setError('');
    const keywordsArray = form.seo_keywords
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const { error } = await supabase
      .from('temples')
      .update({
        name: form.name,
        location: form.location,
        description: form.description,
        image: form.image,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        seo_keywords: keywordsArray.length ? keywordsArray : null,
        seo_image: form.seo_image || null,
        smo_title: form.smo_title || null,
        smo_description: form.smo_description || null
      })
      .eq('temple_id', templeId);
    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    router.push('/fortune/admin/temples');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">ย้อนกลับ</Button>
      <Card className="p-6 bg-card/90 border-border/50">
        <h1 className="text-2xl font-bold mb-4">แก้ไขวัด: {templeId}</h1>
        {loading && <p className="text-muted-foreground">กำลังโหลด...</p>}
        {error && <p className="text-destructive mb-4">{error}</p>}
        {!loading && (
          <div className="space-y-3">
            <Input placeholder="ชื่อวัด" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="จังหวัด/ทำเล" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Textarea placeholder="คำบรรยาย" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="space-y-2">
              <label className="block text-sm">รูปวัด</label>
              {previewUrl && (
                <div className="rounded border p-2 bg-muted/20">
                  <img src={previewUrl} alt="ตัวอย่างรูปวัด" className="max-h-60 object-contain mx-auto" />
                  {imageFileName && <p className="text-xs text-muted-foreground mt-2 text-center">{imageFileName}</p>}
                </div>
              )}
              {info && <p className="text-xs text-muted-foreground">{info}</p>}
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Input type="file" accept="image/*" disabled={uploading} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !templeId) return;
                const localUrl = URL.createObjectURL(file);
                setPreviewUrl(localUrl);
                setImageFileName(file.name);
                try {
                  setUploading(true);
                  setError('');
                  setInfo('กำลังอัปโหลดรูป...');
                  const url = await uploadTempleImage(file, templeId);
                  setForm({ ...form, image: url });
                  setPreviewUrl(url);
                  const { error: updateError } = await supabase.from('temples').update({ image: url }).eq('temple_id', templeId);
                  if (updateError) setError(`บันทึก URL รูปลงฐานข้อมูลไม่สำเร็จ: ${updateError.message}`);
                  else setInfo('บันทึก URL รูปลงฐานข้อมูลสำเร็จ');
                } catch (err: any) {
                  setError(err?.message || 'อัปโหลดรูปไม่สำเร็จ');
                } finally {
                  setTimeout(() => URL.revokeObjectURL(localUrl), 5000);
                  setUploading(false);
                  setTimeout(() => setInfo(''), 3000);
                }
              }} />
            </div>
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
                      if (!file || !templeId) return;
                      try {
                        setUploading(true);
                        setError('');
                        setInfo('กำลังอัปโหลดรูป SEO...');
                        const url = await uploadTempleSeoImage(file, templeId);
                        setForm({ ...form, seo_image: url });
                        const { error: updateError } = await supabase.from('temples').update({ seo_image: url }).eq('temple_id', templeId);
                        if (updateError) setError(`บันทึก URL รูป SEO ไม่สำเร็จ: ${updateError.message}`);
                        else setInfo('บันทึก URL รูป SEO สำเร็จ');
                      } catch (err: any) {
                        setError(err?.message || 'อัปโหลดรูป SEO ไม่สำเร็จ');
                      } finally {
                        setUploading(false);
                        setTimeout(() => setInfo(''), 3000);
                      }
                    }} />
                  </div>
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


