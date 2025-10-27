'use client';
import { useEffect, useMemo, useState } from 'react';

const months = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'
];

export default function LagnaClient() {
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [day, setDay] = useState<number>(today.getDate());
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const daysInMonth = (m: number) => {
    if ([1,3,5,7,8,10,12].includes(m)) return 31;
    if ([4,6,9,11].includes(m)) return 30;
    return 29;
  };

  useEffect(() => {
    const maxDay = daysInMonth(month);
    if (day > maxDay) setDay(maxDay);
  }, [month]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const pad2 = (n: number) => String(n).padStart(2, '0');

  const onCalculate = () => {
    try {
      // แทนที่ด้วยอัลกอริทึมจริงของคุณหรือเรียก API
      const signs = ['เมษ','พฤษภ','เมถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มังกร','กุมภ์','มีน'];
      const idx = (month + day + hour + Math.floor(minute / 5)) % 12;
      setResult(signs[idx]);
      setError('');
    } catch (e: any) {
      setError(e?.message || 'คำนวณไม่สำเร็จ');
      setResult('');
    }
  };

  // คำนวณหมายเลขรูปจากชื่อลัคนา
  const getImageNumber = (signName: string) => {
    const signs = ['เมษ','พฤษภ','เมถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มังกร','กุมภ์','มีน'];
    const index = signs.indexOf(signName);
    return index + 1; // 1-12
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl leading-16 font-bold pt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">เช็กลัคนา</h1>
        <p className="text-muted-foreground mt-2">อ้างอิงตารางเทียบวันและเวลาเกิดแบบไทย</p>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg">
        <div className="grid grid-cols-2 gap-12">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">วันเกิด</label>
              <select value={String(day)} onChange={(e) => setDay(parseInt(e.target.value, 10))} className="w-full border rounded p-2">
                {Array.from({ length: daysInMonth(month) }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={String(d)}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">เดือนเกิด</label>
              <select value={String(month)} onChange={(e) => setMonth(parseInt(e.target.value, 10))} className="w-full border rounded p-2">
                {months.map((m, idx) => (
                  <option key={idx + 1} value={String(idx + 1)}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">ชั่วโมง (0–23)</label>
              <select value={String(hour)} onChange={(e) => setHour(parseInt(e.target.value, 10))} className="w-full border rounded p-2">
                {hours.map((h) => (
                  <option key={h} value={String(h)}>{pad2(h)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">นาที (0–59)</label>
              <select value={String(minute)} onChange={(e) => setMinute(parseInt(e.target.value, 10))} className="w-full border rounded p-2">
                {minutes.map((m) => (
                  <option key={m} value={String(m)}>{pad2(m)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button onClick={onCalculate} className="px-6 py-3 rounded bg-primary text-white">คำนวณลัคนา</button>
        </div>

        {error && <div className="text-center text-red-500 text-sm">{error}</div>}
        {result && (
          <div className="text-center mt-2 space-y-4">
            <div className="text-xl text-muted-foreground">คุณอยู่ลัคนา</div>
            <div className="text-5xl font-bold mt-1">{result}</div>
            <img src={`/fortune/assets/images/${getImageNumber(result)}.png`} alt={`ลัคนา ${result}`} className="mx-auto w-56 h-56 object-contain" />
          </div>
        )}
      </div>
    </div>
  );
}
