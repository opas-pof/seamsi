import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TempleRow {
  temple_id: string;
  name: string;
}

const AdminFortuneAdd = () => {
  const navigate = useNavigate();
  const { templeId } = useParams();

  const [temples, setTemples] = useState<TempleRow[]>([]);
  const [form, setForm] = useState({
    temple_id: templeId ?? "",
    fortune_number: 1,
    title: "",
    content: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useSeo({ title: "เพิ่มเซียมซีให้วัด" });

  useEffect(() => {
    const loadTemples = async () => {
      const { data } = await supabase.from("temples").select("temple_id,name").order("name", { ascending: true });
      setTemples(data ?? []);
    };
    loadTemples();
  }, []);

  const saveFortune = async () => {
    if (!form.temple_id) {
      setError("กรุณาเลือกวัด");
      return;
    }
    setSaving(true);
    setError("");
    const { error } = await supabase.from("fortunes").insert({
      temple_id: form.temple_id,
      fortune_number: Number(form.fortune_number),
      title: form.title,
      content: form.content
    });
    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    navigate("/admin/temples");
  };

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">ย้อนกลับ</Button>
        <Card className="p-6 bg-card/90 border-border/50">
          <h1 className="text-2xl font-bold mb-4">เพิ่มเซียมซีตามวัด</h1>
          {error && <p className="text-destructive mb-4">{error}</p>}
          <div className="space-y-3">
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.temple_id}
              onChange={(e) => setForm({ ...form, temple_id: e.target.value })}
            >
              <option value="">-- เลือกวัด --</option>
              {temples.map((t) => (
                <option key={t.temple_id} value={t.temple_id}>{t.name}</option>
              ))}
            </select>
            <Input type="number" placeholder="หมายเลข" value={form.fortune_number} onChange={(e) => setForm({ ...form, fortune_number: Number(e.target.value) })} />
            <Input placeholder="หัวข้อ" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="คำทำนาย" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <Button onClick={saveFortune} disabled={saving} className="mt-2">{saving ? "กำลังบันทึก..." : "บันทึกเซียมซี"}</Button>
          </div>
        </Card>
      </div>
    </GradientBackground>
  );
};

export default AdminFortuneAdd;


