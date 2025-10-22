import { useEffect, useMemo, useState } from "react";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { seoRegistry } from "@/lib/seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calculateLagna, SIGN_TO_IMAGE_INDEX } from "@/data/lagna";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LagnaChecker = () => {
  useSeo(seoRegistry.lagna);

  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [day, setDay] = useState<number>(today.getDate());
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  // ไม่ใช้ปีในคำนวณ: กำหนดจำนวนวันตามเดือนทั่วไป (ก.พ. 29 วัน รองรับ 29)
  const daysInMonth = (m: number) => {
    if ([1, 3, 5, 7, 8, 10, 12].includes(m)) return 31;
    if ([4, 6, 9, 11].includes(m)) return 30;
    return 29; // กุมภาพันธ์
  };

  useEffect(() => {
    const maxDay = daysInMonth(month);
    if (day > maxDay) setDay(maxDay);
  }, [month]);

  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
  ];

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const pad2 = (n: number) => String(n).padStart(2, "0");

  const onCalculate = () => {
    try {
      // ใช้ปีสมมติ (2000) เพราะคำนวณใช้เฉพาะเดือน/วัน
      const sign = calculateLagna(new Date(2000, month - 1, day), hour, minute);
      setResult(sign);
      setError("");
    } catch (e: any) {
      setError(e?.message || "คำนวณไม่สำเร็จ");
      setResult("");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl leading-16 font-bold pt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            เช็กลัคนา
          </h1>
          <p className="text-muted-foreground mt-2">อ้างอิงตารางเทียบวันและเวลาเกิดแบบไทย</p>
        </div>

        <Card className="max-w-2xl mx-auto p-6 space-y-6 bg-card/80 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-12">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">วันเกิด</label>
                <Select value={String(day)} onValueChange={(v) => setDay(parseInt(v, 10))}>
                  <SelectTrigger>
                    <SelectValue placeholder="วัน" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: daysInMonth(month) }, (_, i) => i + 1).map((d) => (
                      <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm mb-1">เดือนเกิด</label>
                <Select value={String(month)} onValueChange={(v) => setMonth(parseInt(v, 10))}>
                  <SelectTrigger>
                    <SelectValue placeholder="เดือน" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m, idx) => (
                      <SelectItem key={idx + 1} value={String(idx + 1)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">ชั่วโมง (0–23)</label>
                <Select value={String(hour)} onValueChange={(v) => setHour(parseInt(v, 10))}>
                  <SelectTrigger>
                    <SelectValue placeholder="ชั่วโมง" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={String(h)}>{pad2(h)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm mb-1">นาที (0–59)</label>
                <Select value={String(minute)} onValueChange={(v) => setMinute(parseInt(v, 10))}>
                  <SelectTrigger>
                    <SelectValue placeholder="นาที" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={String(m)}>{pad2(m)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button size="lg" onClick={onCalculate}>
              คำนวณลัคนา
            </Button>
          </div>

          {error && (
            <div className="text-center text-red-500 text-sm">{error}</div>
          )}

          {result && (
            <div className="text-center mt-2 space-y-4">
              <div className="text-xl text-muted-foreground">คุณอยู่ลัคนา</div>
              <div className="text-5xl font-bold mt-1">{result}</div>
              {SIGN_TO_IMAGE_INDEX[result] && (
                <img
                  src={`/assets/images/${SIGN_TO_IMAGE_INDEX[result]}.png`}
                  alt={`ลัคนา ${result}`}
                  className="mx-auto w-56 h-56 object-contain"
                  loading="lazy"
                />
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default LagnaChecker;


