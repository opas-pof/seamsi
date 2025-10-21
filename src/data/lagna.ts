export type MonthDay = { month: number; day: number };

// รายชื่อราศีตามลำดับแบบไทย (เริ่ม มกร -> ธนู)
export const ZODIAC_SIGNS_TH = [
  "มกร",
  "กุมภ",
  "มีน",
  "เมษ",
  "พฤษภ",
  "มิถุน",
  "กรกฎ",
  "สิงห์",
  "กันย์",
  "ตุลย์",
  "พิจิก",
  "ธนู"
];

// ช่วงวันที่ตามโหราศาสตร์ไทย (สุริยคติ) ใช้สำหรับหาแถวของตาราง
// 15 ม.ค.-12 ก.พ. เป็นแถวที่ 0 (มกร) แล้วเลื่อนไปตามลำดับถึง 16 ธ.ค.-14 ม.ค. (ธนู)
export const SOLAR_MONTH_RANGES: Array<{ start: MonthDay; end: MonthDay }> = [
  { start: { month: 1, day: 15 }, end: { month: 2, day: 12 } },
  { start: { month: 2, day: 13 }, end: { month: 3, day: 13 } },
  { start: { month: 3, day: 14 }, end: { month: 4, day: 12 } },
  { start: { month: 4, day: 13 }, end: { month: 5, day: 14 } },
  { start: { month: 5, day: 15 }, end: { month: 6, day: 13 } },
  { start: { month: 6, day: 14 }, end: { month: 7, day: 14 } },
  { start: { month: 7, day: 15 }, end: { month: 8, day: 16 } },
  { start: { month: 8, day: 17 }, end: { month: 9, day: 16 } },
  { start: { month: 9, day: 17 }, end: { month: 10, day: 16 } },
  { start: { month: 10, day: 17 }, end: { month: 11, day: 15 } },
  { start: { month: 11, day: 16 }, end: { month: 12, day: 15 } },
  { start: { month: 12, day: 16 }, end: { month: 1, day: 14 } }
];

function compareMonthDay(a: MonthDay, b: MonthDay): number {
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

function isInRange(target: MonthDay, start: MonthDay, end: MonthDay): boolean {
  const normalOrder = compareMonthDay(start, end) <= 0;
  if (normalOrder) {
    return compareMonthDay(target, start) >= 0 && compareMonthDay(target, end) <= 0;
  }
  // กรณีช่วงวันที่พาดผ่านข้ามปี (เช่น 16 ธ.ค. - 14 ม.ค.)
  return compareMonthDay(target, start) >= 0 || compareMonthDay(target, end) <= 0;
}

// หาแถวจากวันเกิด (index 0..11)
export function getSolarRowIndex(date: Date): number {
  const md: MonthDay = { month: date.getMonth() + 1, day: date.getDate() };
  const found = SOLAR_MONTH_RANGES.findIndex(({ start, end }) => isInRange(md, start, end));
  if (found === -1) throw new Error("ไม่พบช่วงเดือนตามโหราศาสตร์ไทยสำหรับวันนี้");
  return found; // 0 = มกร, 1 = กุมภ, ..., 11 = ธนู
}

// หา column index 0..11 จากเวลาเกิด
// อ้างอิงช่วงเวลาในภาพ: 05:01-07:00 | 07:01-09:00 | ... | 23:01-01:00 | 01:01-03:00 | 03:01-05:00
export function getTimeColumnIndex(hours: number, minutes: number): number {
  const m = hours * 60 + minutes;

  if (m >= 5 * 60 + 1 && m <= 7 * 60) return 0;
  if (m >= 7 * 60 + 1 && m <= 9 * 60) return 1;
  if (m >= 9 * 60 + 1 && m <= 11 * 60) return 2;
  if (m >= 11 * 60 + 1 && m <= 13 * 60) return 3;
  if (m >= 13 * 60 + 1 && m <= 15 * 60) return 4;
  if (m >= 15 * 60 + 1 && m <= 17 * 60) return 5;
  if (m >= 17 * 60 + 1 && m <= 19 * 60) return 6;
  if (m >= 19 * 60 + 1 && m <= 21 * 60) return 7;
  if (m >= 21 * 60 + 1 && m <= 23 * 60) return 8;

  // 23:01 - 24:00 และ 00:00 - 01:00 รวมเป็นคอลัมน์เดียว (index 9)
  if ((m >= 23 * 60 + 1 && m <= 24 * 60) || m <= 60) return 9;

  if (m >= 1 * 60 + 1 && m <= 3 * 60) return 10;
  if (m >= 3 * 60 + 1 && m <= 5 * 60) return 11;

  // กรณีเวลาอยู่ที่เส้นพอดี เช่น 05:00 ให้อยู่คอลัมน์สุดท้าย
  if (m === 5 * 60) return 11;
  if (m === 7 * 60) return 0;
  if (m === 9 * 60) return 1;
  if (m === 11 * 60) return 2;
  if (m === 13 * 60) return 3;
  if (m === 15 * 60) return 4;
  if (m === 17 * 60) return 5;
  if (m === 19 * 60) return 6;
  if (m === 21 * 60) return 7;
  if (m === 23 * 60) return 8;
  if (m === 1 * 60) return 9;
  if (m === 3 * 60) return 10;

  throw new Error("เวลาไม่อยู่ในช่วงที่กำหนด");
}

// คำนวณลัคนาตามวันที่และเวลาเกิด
export function calculateLagna(date: Date, hours: number, minutes: number): string {
  const row = getSolarRowIndex(date);
  const col = getTimeColumnIndex(hours, minutes);
  const index = (row + col) % 12;
  return ZODIAC_SIGNS_TH[index];
}

// Helper สำหรับหน้า UI: รับค่าแบบสตริงจาก input[type=date], input[type=time]
export function calculateLagnaFromInputs(dateStr: string, timeStr: string): string {
  const date = new Date(dateStr);
  const [hh, mm] = timeStr.split(":").map((v) => parseInt(v, 10));
  return calculateLagna(date, hh, mm);
}


