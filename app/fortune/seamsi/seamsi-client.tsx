'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import GradientBackground from '@/components/GradientBackground';
import SeamsiIcon from '@/components/SeamsiIcon';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter } from 'lucide-react';
import { supabase } from '@/lib/supabase-next';
import { useRouter } from 'next/navigation';

type Temple = { id: string; name: string; location: string; image?: string };

export default function SeamsiClient() {
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [temples, setTemples] = useState<Temple[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const { data, error } = await supabase
          .from('temples')
          .select('temple_id,name,location,image')
          .order('name', { ascending: true });
        if (error) {
          setError(error.message);
          setTemples([]);
        } else {
          const mapped = (data ?? []).map(t => ({
            id: t.temple_id as string,
            name: t.name as string,
            location: (t.location ?? '') as string,
            image: (t.image ?? undefined) as string | undefined,
          }));
          setTemples(mapped);
          console.log('[seamsi] temples loaded', mapped.length);
          if (mapped.length === 0) setError('ไม่พบวัดในระบบ');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRandomPrediction = () => {
    if (isShaking || loading) return;
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      // Debug: ดึง fortunes ทั้งตารางมาโชว์ใน log (ตัดการสุ่มชั่วคราว)
      (async () => {
        try {
          // Random: temple -> one fortune
          const randomTemple = temples[Math.floor(Math.random() * temples.length)];
          const templeId = (randomTemple.id || '').trim();
          const res = await fetch(`/api/fortunes?temple=${encodeURIComponent(templeId)}&random=1`, { cache: 'no-store' });
          const json = await res.json();
          if (json?.row) {
            const f = json.row;
            const num = String(f.fortune_number).padStart(3, '0');
            router.push(`/fortune/seamsi/prediction/${num}`);
          } else {
            // ไม่แสดงข้อความรบกวนผู้ใช้ แค่ log ไว้เฉยๆ
            console.warn('[seamsi] no fortune for temple', templeId);
          }
        } catch (e) {
          console.error('[seamsi] random via server api error', e);
        }
      })();
      return; // ตัด flow ต่อจากนี้เพื่อไม่ให้ข้อความ error จากเส้นทางเดิมแสดง
      if (temples.length === 0) {
        console.error('[seamsi] temples is empty');
        setError('ไม่พบวัดสำหรับสุ่ม');
        return;
      }
      const randomTemple = temples[Math.floor(Math.random() * temples.length)];
      console.log('[seamsi] selected temple', randomTemple);
      const templeId = (randomTemple.id || '').trim();
      // Step 1: ดึงจำนวนเรคคอร์ดของวัดนี้
      console.log('[seamsi] templeId for query', templeId);
      // Approach A: count -> range (หลัก)
      supabase
        .from('fortunes')
        .select('fortune_number', { count: 'exact', head: true })
        .eq('temple_id', templeId)
        .then(async ({ count, error }) => {
          if (error) {
            console.error('[seamsi] count error', error);
            setError(error.message);
            return;
          }
          const total = count ?? 0;
          console.log('[seamsi] fortunes total (eq)', total);
          if (total <= 0) {
            // debug: นับจำนวนทั้งหมดที่อ่านได้ (ไม่กรองวัด) เพื่อเช็ค RLS
            const { count: allCount } = await supabase
              .from('fortunes')
              .select('fortune_number', { count: 'exact', head: true });
            console.log('[seamsi] fortunes total (all rows visible)', allCount ?? 0);
            // debug: ลองดึง 1 แถวด้วย eq เพื่อตรวจสอบว่าติด RLS หรือ temple_id ไม่ตรง
            const { data: peek } = await supabase
              .from('fortunes')
              .select('temple_id,fortune_number')
              .eq('temple_id', templeId)
              .limit(1);
            console.log('[seamsi] peek eq result', peek);
            // ลอง ilike เป็น fallback
            const { count: c2 } = await supabase
              .from('fortunes')
              .select('fortune_number', { count: 'exact', head: true })
              .ilike('temple_id', `%${templeId}%`);
            const total2 = c2 ?? 0;
            console.log('[seamsi] fortunes total (ilike)', total2);
            if (total2 <= 0) {
              setError('ไม่พบใบเซียมซีของวัดนี้');
              return;
            }
            // ใช้ total2 และคิวรีด้วย ilike
            const idx = Math.floor(Math.random() * total2);
            const { data: row } = await supabase
              .from('fortunes')
              .select('fortune_number,title,content')
              .ilike('temple_id', `%${templeId}%`)
              .order('fortune_number')
              .range(idx, idx);
            const f = (row ?? [])[0];
            if (!f) { setError('สุ่มไม่สำเร็จ'); return; }
            const num = String(f.fortune_number).padStart(3, '0');
            router.push(`/fortune/seamsi/prediction/${num}`);
            return;
          }

          const idx = Math.floor(Math.random() * total);
          // Step 2: ดึงเฉพาะเรคคอร์ดลำดับ idx ตาม fortune_number
          const { data: row } = await supabase
            .from('fortunes')
            .select('fortune_number,title,content')
            .eq('temple_id', templeId)
            .order('fortune_number')
            .range(idx, idx);
          const f = (row ?? [])[0];
          if (!f) {
            // Approach B: fallback ไม่ใช้ count เลย -> ดึงลิสต์ตรงๆ แล้วสุ่ม
            console.warn('[seamsi] fallback list without count');
            const { data: list2, error: e2 } = await supabase
              .from('fortunes')
              .select('fortune_number,title,content')
              .eq('temple_id', templeId)
              .limit(1000);
            if (e2) {
              console.error('[seamsi] fallback error', e2);
              setError('เกิดข้อผิดพลาดในการสุ่ม');
              return;
            }
            const arr = list2 ?? [];
            if (arr.length === 0) { setError('ไม่พบใบเซียมซีของวัดนี้'); return; }
            const f2 = arr[Math.floor(Math.random() * arr.length)];
            const num2 = String(f2.fortune_number).padStart(3, '0');
            router.push(`/fortune/seamsi/prediction/${num2}`);
            return;
          }
          const num = String(f.fortune_number).padStart(3, '0');
          router.push(`/fortune/seamsi/prediction/${num}`);
        })
        .catch((e) => {
          console.error('[seamsi] unexpected error', e);
          setError('เกิดข้อผิดพลาดในการสุ่ม');
        });
    }, 5000);
  };

  const openShareWindow = (url: string) => {
    if (typeof window === 'undefined') return;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleShare = (platform: 'facebook' | 'twitter') => {
    if (typeof window === 'undefined') return;
    const currentUrl = window.location.href;
    const text = 'เสี่ยงเซียมซีออนไลน์ฟรี เช็กดวงแม่น ๆ';
    const shareUrl =
      platform === 'facebook'
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
        : `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`;
    openShareWindow(shareUrl);
  };

  return (
    <GradientBackground>
      <div className="mx-auto pt-16 relative">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-4">ทำนายเซียมซี</h1>
          <p className="text-xl text-white">
            {isShaking ? 'กำลังเขย่าเซียมซี...' : 'เลือกวัดที่ต้องการเสี่ยงเซียมซี หรือกดที่ไอคอนกลางเพื่อสุ่มวัดและเซียมซี'}
          </p>
          <div className="flex justify-center mb-16 relative z-10">
            <SeamsiIcon onClick={handleRandomPrediction} isAnimating={isShaking} size="xl" />
          </div>
        </div>

        <div className="relative mb-8 mt-[-62px] pt-24 bg-white w-full before:content-[''] before:w-[327px] before:h-[134px] before:absolute before:top-[-54px] before:left-1/2 before:-translate-x-1/2 before:bg-[url('/assets/images/base.png')] before:bg-cover before:bg-center">
          <h3 className="text-3xl font-bold text-center mb-8 text-foreground">เลือกวัดที่ต้องการ</h3>

          <div className="absolute z-10 text-white top-[-60px] right-2 flex justify-end items-center gap-3 bg-black/30 backdrop-blur-sm rounded-full pl-6 pr-2 py-1">
            แชร์
            <Button className="bg-blue-800 rounded-full" onClick={() => handleShare('facebook')}>
              <Facebook className="h-4 w-4" />
            </Button>
            <Button className="bg-blue-500 rounded-full" onClick={() => handleShare('twitter')}>
              <Twitter className="h-4 w-4" />
            </Button>
          </div>

          {loading && <p className="text-center text-muted-foreground">กำลังโหลดวัด...</p>}
          {!loading && error && <p className="text-center text-destructive">{error}</p>}

          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {temples.map((temple, index) => (
              <a href={`/fortune/seamsi/temple/${temple.id}`} key={temple.id} style={{ animationDelay: `${index * 0.1}s` }} className="group cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-300 hover:scale-105 rounded-lg block">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                  {temple.image ? (
                    <img src={temple.image} alt={temple.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{temple.name}</h3>
                    <div className="text-sm text-white/80">{temple.location}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}


