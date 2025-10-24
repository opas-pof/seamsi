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
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          ทำนายดวงชะตา
        </h1>
        <p className="text-xl text-muted-foreground">เลือกวิธีการทำนายที่คุณสนใจ</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/fortune/seamsi" className="group cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-105 p-8 rounded-lg block text-center">
          <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ทำนายเซียมซี
          </div>
          <div className="text-muted-foreground">เสี่ยงเซียมซีจากวัดดัง เพื่อทำนายดวงชะตา</div>
        </Link>

        <Link href="/fortune/lagna" className="group cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-105 p-8 rounded-lg block text-center">
          <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            เช็กลัคนา
          </div>
          <div className="text-muted-foreground">กรอกวันและเวลาเกิด เพื่อตรวจลัคนาของคุณ</div>
        </Link>
      </div>
    </div>
  );
}


