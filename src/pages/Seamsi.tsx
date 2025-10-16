import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import TempleCard from "@/components/TempleCard";
import SeamsiIcon from "@/components/SeamsiIcon";
import { temples } from "@/data/temples";
import { predictions } from "@/data/predictions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Seamsi = () => {
  const navigate = useNavigate();
  const [isShaking, setIsShaking] = useState(false);

  const handleRandomPrediction = () => {
    if (isShaking) return;
    
    setIsShaking(true);
    
    setTimeout(() => {
      const randomTemple = temples[Math.floor(Math.random() * temples.length)];
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
      
      navigate(`/prophesy/seamsi/${randomPrediction.number}`, {
        state: { temple: randomTemple }
      });
    }, 5000);
  };

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/prophesy")}
          className="mb-8 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับ
        </Button>

        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            ทำนายเซียมซี
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {isShaking ? "กำลังเขย่าเซียมซี..." : "เลือกวัดที่ต้องการเสี่ยงเซียมซี หรือกดที่ไอคอนกลางเพื่อสุ่มวัดและเซียมซี"}
          </p>

          <div className="flex justify-center mb-16">
            <SeamsiIcon 
              onClick={handleRandomPrediction}
              isAnimating={isShaking}
              size="xl"
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            เลือกวัดที่ต้องการ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
