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
    image: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    seo_image: "",
    smo_title: "",
    smo_description: ""
  });

  useSeo({ title: "เพิ่มวัดใหม่" });

  const saveTemple = async () => {
    if (!form.temple_id || !form.name) {
      setError("กรุณากรอก temple_id และ ชื่อวัด");
      return;
    }
    setSaving(true);
    setError("");
    const keywordsArray = form.seo_keywords
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const { error } = await supabase.from("temples").insert({
      temple_id: form.temple_id,
      name: form.name,
      location: form.location,
      description: form.description,
      image: form.image,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_keywords: keywordsArray.length ? keywordsArray : null,
      seo_image: form.seo_image || null,
      smo_title: form.smo_title || null,
      smo_description: form.smo_description || null
    });
    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    navigate("/fortune/admin/temples");
  };

  return (
    <>
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
            <div className="pt-4">
              <h2 className="text-lg font-semibold mb-2">SEO / SMO</h2>
              <div className="space-y-3">
                <Input placeholder="SEO Title (title)" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
                <Textarea placeholder="SEO Description (meta description)" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
                <Input placeholder="SEO Keywords (คั่นด้วย comma)" value={form.seo_keywords} onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })} />
                <Input placeholder="SEO/OG Image URL (og:image)" value={form.seo_image} onChange={(e) => setForm({ ...form, seo_image: e.target.value })} />
                <Input placeholder="SMO Title (og:title/twitter:title)" value={form.smo_title} onChange={(e) => setForm({ ...form, smo_title: e.target.value })} />
                <Textarea placeholder="SMO Description (og:description/twitter:description)" value={form.smo_description} onChange={(e) => setForm({ ...form, smo_description: e.target.value })} />
              </div>
            </div>
            <Button onClick={saveTemple} disabled={saving} className="mt-2">{saving ? "กำลังบันทึก..." : "บันทึกวัด"}</Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminTempleAdd;


