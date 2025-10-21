import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadTempleImage } from "@/lib/storage";

const AdminTempleEdit = () => {
  const navigate = useNavigate();
  const { templeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    image: ""
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageFileName, setImageFileName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [info, setInfo] = useState<string>("");

  useSeo({ title: "แก้ไขรายละเอียดวัด" });

  useEffect(() => {
    const load = async () => {
      if (!templeId) return;
      const { data, error } = await supabase
        .from("temples")
        .select("name,location,description,image")
        .eq("temple_id", templeId)
        .maybeSingle();
      if (error) setError(error.message);
      if (data) {
        setForm({
          name: data.name ?? "",
          location: data.location ?? "",
          description: data.description ?? "",
          image: data.image ?? ""
        });
      }
      setLoading(false);
    };
    load();
  }, [templeId]);

  useEffect(() => {
    if (!form.image) {
      setPreviewUrl("");
      setImageFileName("");
      return;
    }
    setPreviewUrl(form.image);
    try {
      const u = new URL(form.image);
      const last = u.pathname.split("/").pop() || "";
      setImageFileName(decodeURIComponent(last));
    } catch {
      const last = form.image.split("?")[0].split("/").pop() || "";
      setImageFileName(decodeURIComponent(last));
    }
  }, [form.image]);

  const save = async () => {
    if (!templeId) return;
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("temples")
      .update({
        name: form.name,
        location: form.location,
        description: form.description,
        image: form.image
      })
      .eq("temple_id", templeId);
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
          <h1 className="text-2xl font-bold mb-4">แก้ไขวัด: {templeId}</h1>
          {loading && <p className="text-muted-foreground">กำลังโหลด...</p>}
          {error && <p className="text-destructive mb-4">{error}</p>}
          {!loading && (
            <div className="space-y-3">
              <Input placeholder="ชื่อวัด" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="จังหวัด/ทำเล" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Textarea placeholder="คำบรรยาย" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="space-y-2">
                <label className="block text-sm">รูปวัด</label>
                {previewUrl && (
                  <div className="rounded border p-2 bg-muted/20">
                    <img src={previewUrl} alt="ตัวอย่างรูปวัด" className="max-h-60 object-contain mx-auto" />
                    {imageFileName && <p className="text-xs text-muted-foreground mt-2 text-center">{imageFileName}</p>}
                  </div>
                )}
                {info && <p className="text-xs text-muted-foreground">{info}</p>}
                {error && <p className="text-xs text-destructive">{error}</p>}
                <Input type="file" accept="image/*" disabled={uploading} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !templeId) return;
                  // แสดงตัวอย่างทันที
                  const localUrl = URL.createObjectURL(file);
                  setPreviewUrl(localUrl);
                  setImageFileName(file.name);
                  try {
                    setUploading(true);
                    setError("");
                    setInfo("กำลังอัปโหลดรูป...");
                    const url = await uploadTempleImage(file, templeId);
                    setForm({ ...form, image: url });
                    setPreviewUrl(url);
                    // อัปเดตลงฐานข้อมูลทันที เพื่อให้หน้าอื่นดึงไปใช้ได้เลย
                    const { error: updateError } = await supabase
                      .from("temples")
                      .update({ image: url })
                      .eq("temple_id", templeId);
                    if (updateError) {
                      setError(`บันทึก URL รูปลงฐานข้อมูลไม่สำเร็จ: ${updateError.message}`);
                    } else {
                      setInfo("บันทึก URL รูปลงฐานข้อมูลสำเร็จ");
                    }
                  } catch (err: any) {
                    setError(err?.message || "อัปโหลดรูปไม่สำเร็จ");
                  } finally {
                    // cleanup local object url
                    setTimeout(() => URL.revokeObjectURL(localUrl), 5000);
                    setUploading(false);
                    setTimeout(() => setInfo(""), 3000);
                  }
                }} />
              </div>
              <Button onClick={save} disabled={saving} className="mt-2">{saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}</Button>
            </div>
          )}
        </Card>
      </div>
    </GradientBackground>
  );
};

export default AdminTempleEdit;


