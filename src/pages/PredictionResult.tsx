import { useNavigate, useParams, useLocation } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { buildSeoFromFortuneRecord } from "@/lib/seo";
import { predictions } from "@/data/predictions";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Facebook, Twitter } from "lucide-react";
import { saveDraw } from "@/services/draws";

const PredictionResult = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const temple = location.state?.temple;
  const fortuneFromState = location.state?.fortune;
  const prediction = useMemo(() => {
    if (fortuneFromState) {
      return {
        number: String(fortuneFromState.fortune_number),
        title: fortuneFromState.title,
        content: fortuneFromState.content
      };
    }
    const found = predictions.find(p => p.number === number);
    return found ? { number: found.number, title: found.title, content: found.content } : undefined;
  }, [fortuneFromState, number]);

  if (!prediction) {
    return (
      <GradientBackground>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">ไม่พบคำทำนาย</h1>
          <Button onClick={() => navigate("/fortune/seamsi")}>
            กลับไปเสี่ยงใหม่
          </Button>
        </div>
      </GradientBackground>
    );
  }

  if (fortuneFromState) {
    useSeo(buildSeoFromFortuneRecord({
      fortune: {
        fortune_number: Number(prediction.number),
        title: prediction.title,
        content: prediction.content,
        seo_title: fortuneFromState.seo_title,
        seo_description: fortuneFromState.seo_description,
        seo_keywords: fortuneFromState.seo_keywords,
        seo_image: fortuneFromState.seo_image,
        smo_title: fortuneFromState.smo_title,
        smo_description: fortuneFromState.smo_description
      },
      temple
    }));
  } else {
    useSeo({
      title: `เซียมซีเบอร์ ${prediction.number} - ${prediction.title}`,
      description: prediction.content,
      keywords: ["เซียมซี", `${prediction.number}`, prediction.title]
    });
  }

  const openShareWindow = (url: string) => {
    if (typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleShare = (platform: "facebook" | "twitter") => {
    if (typeof window === "undefined") return;
    const currentUrl = window.location.href;
    const text = `เซียมซีใบที่ ${prediction.number} - ${prediction.title}`;
    const shareUrl =
      platform === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
        : `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`;
    openShareWindow(shareUrl);
  };

  const handleSave = async () => {
    await saveDraw({
      templeId: temple?.id ?? "unknown",
      templeName: temple?.name ?? "ไม่ระบุ",
      fortuneNumber: Number(prediction.number),
      fortuneTitle: prediction.title,
      fortuneContent: prediction.content
    });
  };

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/fortune/seamsi")}
          className="mb-8 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับ
        </Button>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-8 md:p-12 animate-scale-in">
            <div className="text-center mb-8">
              {temple && (
                <p className="text-xl text-muted-foreground mb-4">
                  {temple.name}
                </p>
              )}
              <h1 className="text-4xl md:text-5xl leading-16 pt-4 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                {prediction.title}
              </h1>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                <div className="flex items-start mb-3">
                  <Sparkles className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-foreground">คำทำนาย</h2>
                </div>
                <p className="text-lg leading-relaxed text-foreground pl-9">
                  {prediction.content}
                </p>
              </div>              
            </div>

            <div className="mt-12 text-center grid grid-cols-2 gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/fortune/seamsi")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold px-8 py-6 text-lg"
              >
                กลับหน้าหลัก
              </Button>
              <div className="flex justify-end items-center gap-3">
                แชร์ 
                <Button className="bg-blue-800 rounded-full" onClick={() => handleShare("facebook")}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button className="bg-blue-500 rounded-full" onClick={() => handleShare("twitter")}>
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </GradientBackground>
  );
};

export default PredictionResult;
