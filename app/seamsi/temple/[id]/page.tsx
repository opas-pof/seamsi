import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase-next';
import { buildSeoFromTempleRecord } from '@/lib/seo';
import SeamsiIcon from '@/components/SeamsiIcon';
import TempleRandomClient from './TempleRandomClient';
import type { Metadata } from 'next';

export const runtime = 'edge';

type PageParams = { id: string };

// SSG แบบ on-demand: ถ้า export ทั้งหมดช้า/ดาต้าเยอะ ให้คงเพจนี้เป็น dynamic โดยไม่ใส่ generateStaticParams
// เลือกอย่างใดอย่างหนึ่งเท่านั้น หากต้องการ export เต็ม ให้ uncomment ด้านล่าง
// export async function generateStaticParams() {
//   const { data } = await supabase.from('temples').select('temple_id');
//   return (data ?? []).map((t: any) => ({ id: t.temple_id }));
// }

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { id } = await params;
  const { data: row } = await supabase
    .from('temples')
    .select('temple_id,name,description,location,image,seo_title,seo_description,seo_keywords,seo_image,smo_title,smo_description')
    .eq('temple_id', id)
    .maybeSingle();
  
  if (!row) {
    return {
      title: 'ไม่พบข้อมูลวัด',
      description: 'ไม่พบข้อมูลวัดที่ต้องการ'
    };
  }

  const seo = buildSeoFromTempleRecord(row);
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.image ? [{ url: seo.image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.image ? [seo.image] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { id } = await params;
  const { data: row } = await supabase
    .from('temples')
    .select('temple_id,name,description,location,image')
    .eq('temple_id', id)
    .maybeSingle();
  if (!row) return notFound();

  return (
    <div className="container mx-auto px-4 py-16">
      <a href="/seamsi" className="text-primary">กลับ</a>
      <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border border-border/50 p-8 rounded-lg mt-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">{row.name}</h1>
          <div className="text-muted-foreground">{row.location}</div>
        </div>
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-6 relative overflow-hidden">
          {row.image ? <img src={row.image} alt={row.name} className="absolute inset-0 w-full h-full object-cover" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <p className="text-lg text-foreground leading-relaxed mb-8">{row.description}</p>
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-8">กดที่ไอคอนเซียมซีเพื่อเสี่ยงทาย</p>
          <div className="flex justify-center">
            <TempleRandomClient templeId={row.temple_id} />
          </div>
        </div>
      </div>
    </div>
  );
}


