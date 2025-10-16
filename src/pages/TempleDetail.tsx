import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import SeamsiIcon from "@/components/SeamsiIcon";
import { temples } from "@/data/temples";
import { predictions } from "@/data/predictions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin } from "lucide-react";

const TempleDetail = () => {
  const { templeId } = useParams();
  const navigate = useNavigate();
  const [isShaking, setIsShaking] = useState(false);

  const temple = temples.find(t => t.id === templeId);

  if (!temple) {
    return (
      <GradientBackground>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">ไม่พบข้อมูลวัด</h1>
          <Button onClick={() => navigate("/prophesy/seamsi")}>
            กลับไปเลือกวัด
          </Button>
        </div>
      </GradientBackground>
    );
  }

  const handleShake = () => {
    if (isShaking) return;
    
    setIsShaking(true);
    
    setTimeout(() => {
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
      navigate(`/prophesy/seamsi/prediction/${randomPrediction.number}`, {
        state: { temple }
      });
    }, 5000);
  };

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/prophesy/seamsi")}
          className="mb-8 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับ
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-8 mb-12 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                {temple.name}
              </h1>
              <div className="flex items-center justify-center text-muted-foreground mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{temple.location}</span>
              </div>
            </div>

            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <p className="text-lg text-foreground leading-relaxed mb-8">
              {temple.description}
            </p>

            <div className="text-center">
              <p className="text-xl text-muted-foreground mb-8">
                {isShaking ? "กำลังเขย่าเซียมซี..." : "กดที่ไอคอนเซียมซีเพื่อเสี่ยงทาย"}
              </p>
              <div className="flex justify-center">
                <SeamsiIcon 
                  onClick={handleShake}
                  isAnimating={isShaking}
                  size="xl"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </GradientBackground>
  );
};

export default TempleDetail;
