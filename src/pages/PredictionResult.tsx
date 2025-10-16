import { useNavigate, useParams, useLocation } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import { predictions } from "@/data/predictions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Heart, Lightbulb } from "lucide-react";

const PredictionResult = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const temple = location.state?.temple;

  const prediction = predictions.find(p => p.number === number);

  if (!prediction) {
    return (
      <GradientBackground>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">ไม่พบคำทำนาย</h1>
          <Button onClick={() => navigate("/prophesy/seamsi")}>
            กลับไปเสี่ยงใหม่
          </Button>
        </div>
      </GradientBackground>
    );
  }

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

        <div className="max-w-3xl mx-auto">
          <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-8 md:p-12 animate-scale-in">
            <div className="text-center mb-8">
              {temple && (
                <p className="text-xl text-muted-foreground mb-4">
                  {temple.name}
                </p>
              )}
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full mb-4">
                <span className="text-2xl font-bold text-white">เซียมซีเบอร์ที่ {prediction.number}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
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

              <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-lg p-6">
                <div className="flex items-start mb-3">
                  <Heart className="w-6 h-6 text-secondary mr-3 mt-1 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-foreground">ความหมาย</h2>
                </div>
                <p className="text-lg leading-relaxed text-foreground pl-9">
                  {prediction.meaning}
                </p>
              </div>

              <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg p-6">
                <div className="flex items-start mb-3">
                  <Lightbulb className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-foreground">คำแนะนำ</h2>
                </div>
                <p className="text-lg leading-relaxed text-foreground pl-9">
                  {prediction.advice}
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button 
                size="lg"
                onClick={() => navigate("/prophesy/seamsi")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold px-8 py-6 text-lg"
              >
                เสี่ยงใหม่อีกครั้ง
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </GradientBackground>
  );
};

export default PredictionResult;
