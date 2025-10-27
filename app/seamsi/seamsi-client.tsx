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
      (async () => {
        try {
          const randomTemple = temples[Math.floor(Math.random() * temples.length)];
          const templeId = (randomTemple.id || '').trim();
          const timestamp = Date.now();
          const res = await fetch(`/fortune/api/fortunes?temple=${encodeURIComponent(templeId)}&random=1&_t=${timestamp}`, { 
            cache: 'no-store'
          });
          const json = await res.json();
          
          // รองรับทั้ง format {row} และ {rows}
          let fortuneData = null;
          if (json?.row) {
            fortuneData = json.row;
          } else if (json?.rows && Array.isArray(json.rows) && json.rows.length > 0) {
            fortuneData = json.rows[Math.floor(Math.random() * json.rows.length)];
          }
          
          if (fortuneData) {
            const num = String(fortuneData.fortune_number).padStart(3, '0');
            router.push(`/seamsi/prediction/${num}`);
          }
        } catch (e) {
          // Silent error
        }
      })();
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

        <div className="relative mb-8 mt-[-62px] pt-24 bg-white w-full before:content-[''] before:w-[327px] before:h-[134px] before:absolute before:top-[-54px] before:left-1/2 before:-translate-x-1/2 before:bg-[url('/fortune/assets/images/base.png')] before:bg-cover before:bg-center">
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


