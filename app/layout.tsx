import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  metadataBase: new URL('https://horoscope.kapook.com/fortune'),
  title: 'เสี่ยงเซียมซี เช็กลัคนา ดูดวง 12 ราศี พร้อมสุ่มพรวิเศษแม่น ๆ',
  description: 'เปิดดวง เสี่ยงเซียมซี เช็กลัคนา ดวงชะตา 12 ราศี ดูดวงออนไลน์ฟรี พร้อมสุ่มพรวิเศษ เปิดคำทำนายแม่น ๆ และเคล็ดลับเสริมดวงที่ดูดวง kapook.com',
  openGraph: {
    title: 'เสี่ยงเซียมซี เช็กลัคนา ดูดวง 12 ราศี พร้อมสุ่มพรวิเศษแม่น ๆ',
    description: 'เปิดดวง เสี่ยงเซียมซี เช็กลัคนา ดวงชะตา 12 ราศี ดูดวงออนไลน์ฟรี พร้อมสุ่มพรวิเศษ เปิดคำทำนายแม่น ๆ และเคล็ดลับเสริมดวงที่ดูดวง kapook.com',
    images: ['/fortune/assets/images/og-fortune.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <header className="w-full bg-[#3ec9b0] text-white">
          <div className="container mx-auto">
            <div className="h-16 flex items-center gap-4">
              <Link href="/" className="inline-flex items-center">
                <img src="https://my.kapook.com/img-portal/logo-kapook.png" alt="Kapook" className="h-[53px] w-[168px]" />
              </Link>
              <div className="flex items-center ml-4">
                <strong className="text-3xl font-semibold text-white">HOROSCOPE</strong>
              </div>
            </div>
          </div>
        </header>
        <div className="nav w-full h-[45px] bg-[#2bb99f]">
          <nav className="container h-full">
            <ul>
              <li className="active"><a href="/">หน้าแรก</a></li>
              <li><a href="/2568">ดูดวง 2568</a></li>
              <li><a href="/horo_daily.php">ดูดวงรายวัน</a></li>
              <li><a href="/horo_love.php">ดูดวงความรัก</a></li>
              <li><a href="/tarot.php">ดูดวงไพ่ยิปซี</a></li>
              <li><a href="/horo_birthday.php">ดูดวงวันเดือนปีเกิด</a></li>
              <li><a href="/fortuneteller">เช็กดวงกับหมอดัง</a></li>
              <li><a href="/dream">ทำนายฝัน</a></li>
            </ul>
          </nav>
        </div>
        {children}
      </body>
    </html>
  );
}


