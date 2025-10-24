import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ทำนายดวงชะตา',
  description: 'เลือกวิธีการทำนายที่คุณสนใจ',
  openGraph: {
    title: 'ทำนายดวงชะตา',
    description: 'เลือกวิธีการทำนายที่คุณสนใจ',
    url: '/fortune'
  }
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          ทำนายดวงชะตา
        </h1>
        <p className="text-xl text-muted-foreground">เลือกวิธีการทำนายที่คุณสนใจ</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/fortune/seamsi" className="group cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-105 animate-scale-in p-8 rounded-lg">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18"/></svg>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ทำนายเซียมซี
              </h2>
              <p className="text-muted-foreground">เสี่ยงเซียมซีจากวัดดังทั่วกรุงเทพฯ เพื่อทำนายดวงชะตาและแนวทางชีวิต</p>
            </div>
          </div>
        </Link>

        <Link href="/fortune/lagna" className="group cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-105 animate-scale-in p-8 rounded-lg">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                เช็กลัคนา
              </h2>
              <p className="text-muted-foreground">กรอกวันและเวลาเกิด เพื่อดูว่าคุณอยู่ลัคนาอะไร</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}


