import type { Metadata } from 'next';
import SeamsiClient from './seamsi-client';

export const metadata: Metadata = {
  title: 'ทำนายเซียมซี',
  description: 'เลือกวัดที่ต้องการเสี่ยงเซียมซี หรือสุ่มเพื่อรับคำทำนาย',
  openGraph: { url: '/fortune/seamsi' }
};

export default function Page() {
  return <SeamsiClient />;
}


