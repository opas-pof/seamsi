import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AdminTempleAdd = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    temple_id: "",
    name: "",
    location: "",
    description: "",
    image: ""
  });

  useSeo({ title: "เพิ่มวัดใหม่" });

  const saveTemple = async () => {
    if (!form.temple_id || !form.name) {
      setError("กรุณากรอก temple_id และ ชื่อวัด");
      return;
    }
    setSaving(true);
    setError("");
    const { error } = await supabase.from("temples").insert(form);
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
          <h1 className="text-2xl font-bold mb-4">เพิ่มวัด</h1>
          {error && <p className="text-destructive mb-4">{error}</p>}
          <div className="space-y-3">
            <Input placeholder="temple_id (slug)" value={form.temple_id} onChange={(e) => setForm({ ...form, temple_id: e.target.value })} />
            <Input placeholder="ชื่อวัด" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="จังหวัด/ทำเล" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Textarea placeholder="คำบรรยาย" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="URL รูปภาพ" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <Button onClick={saveTemple} disabled={saving} className="mt-2">{saving ? "กำลังบันทึก..." : "บันทึกวัด"}</Button>
          </div>
        </Card>
      </div>
    </GradientBackground>
  );
};

export default AdminTempleAdd;


