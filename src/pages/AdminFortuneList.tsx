import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FortuneRow {
  temple_id: string;
  fortune_number: number;
  title: string;
  content: string;
  meaning: string | null;
  advice: string | null;
}

const AdminFortuneList = () => {
  const navigate = useNavigate();
  const { templeId } = useParams();

  const [templeName, setTempleName] = useState<string>("");
  const [fortunes, setFortunes] = useState<FortuneRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useSeo({ title: "จัดการเซียมซีตามวัด" });

  const loadData = async () => {
    if (!templeId) return;
    setLoading(true);
    setError("");
    const [{ data: t }, { data: f, error: fErr }] = await Promise.all([
      supabase.from("temples").select("name").eq("temple_id", templeId).maybeSingle(),
      supabase.from("fortunes").select("temple_id,fortune_number,title,content,meaning,advice").eq("temple_id", templeId).order("fortune_number", { ascending: true })
    ]);
    if (t?.name) setTempleName(t.name);
    if (fErr) setError(fErr.message);
    setFortunes(f ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [templeId]);

  const handleDelete = async (fortuneNumber: number) => {
    if (!templeId) return;
    const ok = window.confirm(`ยืนยันลบ เซียมซีหมายเลข ${fortuneNumber}?`);
    if (!ok) return;
    const { error } = await supabase.from("fortunes").delete().match({ temple_id: templeId, fortune_number: fortuneNumber });
    if (error) {
      alert(error.message);
      return;
    }
    await loadData();
  };

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">จัดการเซียมซี</h1>
            <p className="text-muted-foreground">วัด: {templeName || templeId}</p>
          </div>
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => navigate(-1)}>ย้อนกลับ</Button>
            <Button onClick={() => navigate(`/admin/temples/${templeId}/fortunes/new`)}>เพิ่มเซียมซี</Button>
          </div>
        </div>

        {loading && <p className="text-muted-foreground">กำลังโหลด...</p>}
        {!loading && error && <p className="text-destructive">เกิดข้อผิดพลาด: {error}</p>}

        {!loading && fortunes.length === 0 && (
          <Card className="p-6 bg-card/90 border-border/50">
            <p className="text-sm">ยังไม่มีเซียมซีสำหรับวัดนี้</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fortunes.map((f) => (
            <Card key={`${f.temple_id}-${f.fortune_number}`} className="p-6 bg-card/90 border-border/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">หมายเลข {f.fortune_number}: {f.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{f.content}</p>
                </div>
                <div className="space-x-2 whitespace-nowrap">
                  <Button variant="secondary" onClick={() => navigate(`/admin/temples/${templeId}/fortunes/${f.fortune_number}/edit`)}>แก้ไข</Button>
                  <Button variant="destructive" onClick={() => handleDelete(f.fortune_number)}>ลบ</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </GradientBackground>
  );
};

export default AdminFortuneList;


