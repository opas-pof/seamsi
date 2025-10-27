'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TempleRow {
  temple_id: string;
  name: string;
  location: string;
  description?: string;
  image?: string;
}

export default function AdminTempleList() {
  const router = useRouter();
  const [temples, setTemples] = useState<TempleRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase.from('temples').select('temple_id,name,location,description,image').order('name', { ascending: true });
      if (error) setError(error.message);
      setTemples(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">รายการวัด</h1>
        <div className="space-x-2">
          <Button onClick={() => router.push('/admin/temples/new')}>เพิ่มวัดใหม่</Button>
        </div>
      </div>

      {loading && <p className="text-muted-foreground">กำลังโหลด...</p>}
      {!loading && error && <p className="text-destructive">เกิดข้อผิดพลาด: {error}</p>}

      {!loading && !error && temples.length === 0 && (
        <Card className="p-6 bg-card/90 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg">ยังไม่มีวัดในระบบ</p>
              <p className="text-sm text-muted-foreground">กดปุ่มด้านขวาเพื่อเพิ่มวัดแรก</p>
            </div>
            <Button onClick={() => router.push('/admin/temples/new')}>เพิ่มวัดใหม่</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {temples.map((t) => (
          <Card key={t.temple_id} className="p-6 bg-card/90 border-border/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{t.name}</h2>
                <p className="text-sm text-muted-foreground">{t.location}</p>
                <p className="text-xs text-muted-foreground mt-1">slug: {t.temple_id}</p>
              </div>
              <div className="whitespace-nowrap flex flex-col gap-2">
                <Button variant="outline" onClick={() => router.push(`/admin/temples/${t.temple_id}/edit`)}>
                  แก้ไขวัด
                </Button>
                <Button variant="secondary" onClick={() => router.push(`/admin/temples/${t.temple_id}/fortunes`)}>
                  จัดการเซียมซี
                </Button>
                <Button onClick={() => router.push(`/admin/temples/${t.temple_id}/fortunes/new`)}>
                  เพิ่มเซียมซี
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


