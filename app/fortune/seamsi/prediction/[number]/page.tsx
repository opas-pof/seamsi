import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase-next';
import { buildSeoFromFortuneRecord } from '@/lib/seo';
import GradientBackground from '@/components/GradientBackground';
import ShareButtons from './share-buttons';

export const runtime = 'edge';

type Props = { params: { number: string } };

// ไม่ generate static params ในโหมด SSR/Dev เพื่อลดเงื่อนไขตอนพัฒนา

export async function generateMetadata(
  { params }: { params: Promise<{ number: string }> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { number } = await params;
  const num = parseInt(number, 10);
  
  // ดึงข้อมูล fortune พร้อม SEO fields
  const { data: fortuneData } = await supabase
    .from('fortunes')
    .select('fortune_number,title,content,seo_title,seo_description,seo_keywords,seo_image,smo_title,smo_description,temple_id')
    .eq('fortune_number', num)
    .limit(1);
  
  const fortune = (fortuneData ?? [])[0];
  if (!fortune) {
    return {
      title: `ผลเซียมซีใบที่ ${number}`,
      description: 'คำทำนายเซียมซี'
    };
  }

  // ดึงข้อมูลวัดถ้ามี temple_id
  let temple = undefined;
  if (fortune.temple_id) {
    const { data: templeData } = await supabase
      .from('temples')
      .select('name,image')
      .eq('temple_id', fortune.temple_id)
      .limit(1);
    temple = (templeData ?? [])[0];
  }

  const seo = buildSeoFromFortuneRecord({ fortune, temple });
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `/fortune/seamsi/prediction/${number}`,
      images: seo.image ? [{ url: seo.image }] : [{ url: '/assets/images/og-fortune.jpg' }],
      type: 'article'
    },
    twitter: { 
      card: 'summary_large_image', 
      title: seo.ogTitle, 
      description: seo.ogDescription, 
      images: seo.image ? [seo.image] : ['/assets/images/og-fortune.jpg'] 
    }
  };
}

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const num = parseInt(number, 10);
  const { data: f } = await supabase
    .from('fortunes')
    .select('fortune_number,title,content,temple_id')
    .eq('fortune_number', num)
    .limit(1);
  const row = (f ?? [])[0];
  if (!row) return notFound();
  const title = String(row.title ?? `ผลเซียมซีใบที่ ${number}`);
  const content = String(row.content ?? '');
  let templeName: string | undefined = undefined;
  if (row.temple_id) {
    const { data: t } = await supabase
      .from('temples')
      .select('name')
      .eq('temple_id', row.temple_id)
      .limit(1);
    templeName = (t ?? [])[0]?.name as string | undefined;
  }
  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-16">
        <a href="/fortune/seamsi" className="text-primary">กลับ</a>
        <div className="max-w-3xl mx-auto mt-6 rounded-lg p-8 bg-white/90 backdrop-blur-sm shadow-[var(--shadow-card)]">
          <div className="text-center mb-8">
            {templeName && (
              <div className="text-sm text-muted-foreground mb-2">{templeName}</div>
            )}
            <h1 className="text-5xl pt-4 font-bold text-[#e85aad] mb-6">{title}</h1>
          </div>
          <div className="rounded-xl p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-start mb-3">
              <svg className="w-6 h-6 text-primary mr-3 mt-1" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17l-5 3 1.9-5.9L4 9h6L12 3l2 6h6l-4.9 5.1L17 20z"/></svg>
              <h2 className="text-2xl font-bold text-foreground">คำทำนาย</h2>
            </div>
            <p className="text-lg leading-relaxed text-foreground pl-9">{content}</p>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <a href="/fortune/seamsi" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white">กลับหน้าหลัก</a>
            <ShareButtons />
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}


