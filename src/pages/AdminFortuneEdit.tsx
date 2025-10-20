import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AdminFortuneEdit = () => {
  const navigate = useNavigate();
  const { templeId, fortuneNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: ""
  });

  useSeo({ title: "แก้ไขเซียมซี" });

  useEffect(() => {
    const load = async () => {
      if (!templeId || !fortuneNumber) return;
      const { data, error } = await supabase
        .from("fortunes")
        .select("title,content")
        .match({ temple_id: templeId, fortune_number: Number(fortuneNumber) })
        .maybeSingle();
      if (error) setError(error.message);
      if (data) {
        setForm({
          title: data.title ?? "",
          content: data.content ?? ""
        });
      }
      setLoading(false);
    };
    load();
  }, [templeId, fortuneNumber]);

  const save = async () => {
    if (!templeId || !fortuneNumber) return;
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("fortunes")
      .update({
        title: form.title,
        content: form.content
      })
      .match({ temple_id: templeId, fortune_number: Number(fortuneNumber) });
    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    navigate(`/admin/temples/${templeId}/fortunes`);
  };

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">ย้อนกลับ</Button>
        <Card className="p-6 bg-card/90 border-border/50">
          <h1 className="text-2xl font-bold mb-4">แก้ไขเซียมซี #{fortuneNumber}</h1>
          {loading && <p className="text-muted-foreground">กำลังโหลด...</p>}
          {error && <p className="text-destructive mb-4">{error}</p>}
          {!loading && (
            <div className="space-y-3">
              <Input placeholder="หัวข้อ" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="คำทำนาย" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              <Button onClick={save} disabled={saving} className="mt-2">{saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}</Button>
            </div>
          )}
        </Card>
      </div>
    </GradientBackground>
  );
};

export default AdminFortuneEdit;


