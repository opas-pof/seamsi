import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { seoRegistry } from "@/lib/seo";
import TempleCard from "@/components/TempleCard";
import SeamsiIcon from "@/components/SeamsiIcon";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Seamsi = () => {
  const navigate = useNavigate();
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [temples, setTemples] = useState<Array<{ id: string; name: string; location: string; image?: string }>>([]);
  useSeo(seoRegistry.seamsi);

  useEffect(() => {
    const loadTemples = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("temples")
        .select("temple_id,name,location,image")
        .order("name", { ascending: true });
      if (error) {
        setError(error.message);
      } else {
        const mapped = (data ?? []).map(t => ({ id: t.temple_id as string, name: t.name as string, location: (t.location ?? "") as string, image: t.image ?? undefined }));
        setTemples(mapped);
      }
      setLoading(false);
    };
    loadTemples();
  }, []);

  const handleRandomPrediction = () => {
    if (isShaking) return;
    
    setIsShaking(true);
    
    setTimeout(async () => {
      if (temples.length === 0) {
        setIsShaking(false);
        return;
      }
      const randomTemple = temples[Math.floor(Math.random() * temples.length)];
      const { data: fortunes } = await supabase
        .from("fortunes")
        .select("fortune_number,title,content,meaning,advice,seo_title,seo_description,seo_keywords,seo_image,smo_title,smo_description")
        .eq("temple_id", randomTemple.id)
        .order("fortune_number");
      if (!fortunes || fortunes.length === 0) {
        setIsShaking(false);
        return;
      }
      const f = fortunes[Math.floor(Math.random() * fortunes.length)];
      navigate(`/prophesy/seamsi/prediction/${String(f.fortune_number)}`,
        { state: { temple: randomTemple, fortune: f } }
      );
    }, 5000);
  };

  return (
    <GradientBackground>
      <div className="mx-auto pt-16">
        

        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-4">
            ทำนายเซียมซี
          </h1>
          <p className="text-xl text-white">
            {isShaking ? "กำลังเขย่าเซียมซี..." : "เลือกวัดที่ต้องการเสี่ยงเซียมซี หรือกดที่ไอคอนกลางเพื่อสุ่มวัดและเซียมซี"}
          </p>

          <div className="flex justify-center mb-16 relative z-10">
            <SeamsiIcon 
              onClick={handleRandomPrediction}
              isAnimating={isShaking}
              size="xl"
            />
          </div>
        </div>

        <div className="relative mb-8 mt-[-62px] pt-24 bg-white w-full before:content-[''] before:w-[327px] before:h-[134px] before:absolute before:top-[-54px] before:left-1/2 before:-translate-x-1/2 before:bg-[url('/assets/images/base.png')] before:bg-cover before:bg-center">
          <h3 className="text-3xl font-bold text-center mb-8 text-foreground">
            เลือกวัดที่ต้องการ
          </h3>
          {loading && (<p className="text-center text-muted-foreground">กำลังโหลดวัด...</p>)}
          {!loading && error && (<p className="text-center text-destructive">{error}</p>)}
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {temples.map((temple, index) => (
              <div 
                key={temple.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TempleCard temple={temple} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Seamsi;
