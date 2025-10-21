import { useEffect, useMemo, useState } from "react";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateLagna } from "@/data/lagna";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LagnaChecker = () => {
  useSeo({
    title: "เช็คลัคนา - ตามวันเวลาเกิด",
    description: "เลือกวันเกิดและเวลาเกิดเพื่อดูว่าคุณอยู่ลัคนาใด",
    keywords: ["ลัคนา", "โหราศาสตร์", "เช็คลัคนา"]
  });

  const today = new Date();
  const defaultYear = today.getFullYear() - 15; // เริ่มต้นย้อนหลัง 15 ปี
  const defaultTime = "12:00";
  const [year, setYear] = useState<number>(defaultYear);
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [day, setDay] = useState<number>(today.getDate());
  const [timeStr, setTimeStr] = useState<string>(defaultTime);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const daysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();

  useEffect(() => {
    const maxDay = daysInMonth(month, year);
    if (day > maxDay) setDay(maxDay);
  }, [month, year]);

  const years = useMemo(() => {
    const current = today.getFullYear();
    return Array.from({ length: 121 }, (_, i) => current - i); // ย้อน 120 ปี
  }, [today]);

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

  const onCalculate = () => {
    try {
      const [hhStr, mmStr] = timeStr.split(":");
      const sign = calculateLagna(new Date(year, month - 1, day), parseInt(hhStr, 10), parseInt(mmStr, 10));
      setResult(sign);
      setError("");
    } catch (e: any) {
      setError(e?.message || "คำนวณไม่สำเร็จ");
      setResult("");
    }
  };

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            เช็คลัคนา
          </h1>
          <p className="text-muted-foreground mt-2">อ้างอิงตารางเทียบวันและเวลาเกิดแบบไทย</p>
        </div>

        <Card className="max-w-xl mx-auto p-6 space-y-6 bg-card/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1">วัน</label>
                <Select value={String(day)} onValueChange={(v) => setDay(parseInt(v, 10))}>
                  <SelectTrigger>
                    <SelectValue placeholder="วัน" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1).map((d) => (
                      <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm mb-1">เดือน</label>
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
              <div>
                <label className="block text-sm mb-1">ปี (ค.ศ.)</label>
                <Select value={String(year)} onValueChange={(v) => setYear(parseInt(v, 10))}>
                  <SelectTrigger>
                    <SelectValue placeholder="ปี" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">เวลาเกิด</label>
              <Input type="time" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} step={60} />
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
            <div className="text-center mt-2">
              <div className="text-xl text-muted-foreground">คุณอยู่ลัคนา</div>
              <div className="text-5xl font-bold mt-1">{result}</div>
            </div>
          )}
        </Card>
      </div>
    </GradientBackground>
  );
};

export default LagnaChecker;


