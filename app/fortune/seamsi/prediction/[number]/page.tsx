import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase-next';
import GradientBackground from '@/components/GradientBackground';
import ShareButtons from './share-buttons';

type Props = { params: { number: string } };

// ไม่ generate static params ในโหมด SSR/Dev เพื่อลดเงื่อนไขตอนพัฒนา

export async function generateMetadata(
  { params, searchParams }: any,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const spTitle = typeof searchParams?.title === 'string' ? searchParams.title : '';
  const spContent = typeof searchParams?.content === 'string' ? searchParams.content : '';
  let title = spTitle;
  let description = spContent;
  if (!title || !description) {
    const num = parseInt(params.number, 10);
    const { data } = await supabase
      .from('fortunes')
      .select('fortune_number,title,content')
      .eq('fortune_number', num)
      .limit(1);
    const row = (data ?? [])[0];
    title = title || (row?.title ? String(row.title) : `ผลเซียมซีใบที่ ${params.number}`);
    description = description || (row?.content ? String(row.content) : 'คำทำนาย');
  }
  const image = '/assets/images/og-fortune.jpg';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/fortune/seamsi/prediction/${params.number}`,
      images: [image],
      type: 'article'
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] }
  };
}

export default async function Page({ params, searchParams }: any) {
  let title: string | undefined = typeof searchParams?.title === 'string' ? searchParams.title : undefined;
  let content: string | undefined = typeof searchParams?.content === 'string' ? searchParams.content : undefined;
  let templeName: string | undefined = typeof searchParams?.temple === 'string' ? searchParams.temple : undefined;
  if (!title || !content || !templeName) {
    const num = parseInt(params.number, 10);
    const { data: f } = await supabase
      .from('fortunes')
      .select('fortune_number,title,content,temple_id')
      .eq('fortune_number', num)
      .limit(1);
    const row = (f ?? [])[0];
    if (!row) return notFound();
    title = title || String(row.title ?? `ผลเซียมซีใบที่ ${params.number}`);
    content = content || String(row.content ?? '');
    if (!templeName && row.temple_id) {
      const { data: t } = await supabase
        .from('temples')
        .select('name')
        .eq('temple_id', row.temple_id)
        .limit(1);
      templeName = (t ?? [])[0]?.name as string | undefined;
    }
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


