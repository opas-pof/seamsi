import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ทำนายดวงชะตา - หน้าแรก',
  description: 'เริ่มต้นเสี่ยงเซียมซีและค้นพบคำทำนายของคุณ',
  openGraph: {
    title: 'ทำนายดวงชะตา - หน้าแรก',
    description: 'เริ่มต้นเสี่ยงเซียมซีและค้นพบคำทำนายของคุณ',
    url: '/'
  }
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[radial-gradient(55.9%_55.87%_at_50.8%_44.13%,_#E2843E_0%,_#500019_100%)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <div className="animate-fade-in space-y-8">
            <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary p-2 animate-glow">
              <div className="w-full h-full rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-24 h-24 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v18M3 12h18"/>
                </svg>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
              ทำนายดวงชะตา
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl mx-auto">
              ค้นพบคำทำนายและแนวทางชีวิตของคุณ
            </p>
            <Link href="/fortune" className="inline-block mt-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold px-12 py-4 text-2xl rounded-full shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)] transition-all">
              เริ่มทำนาย
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


