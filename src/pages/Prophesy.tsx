import { useNavigate } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Prophesy = () => {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            ทำนายดวงชะตา
          </h1>
          <p className="text-xl text-muted-foreground">
            เลือกวิธีการทำนายที่คุณสนใจ
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seamsi Card */}
          <Card 
            className="group cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-105 animate-scale-in p-8"
            onClick={() => navigate("/prophesy/seamsi")}
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                <div className="w-full h-full rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ทำนายเซียมซี
                </h2>
                <p className="text-muted-foreground">
                  เสี่ยงเซียมซีจากวัดดังทั่วกรุงเทพฯ เพื่อทำนายดวงชะตาและแนวทางชีวิต
                </p>
              </div>
            </div>
          </Card>

          {/* Placeholder for other divination methods */}
          <Card className="opacity-50 cursor-not-allowed bg-card/50 backdrop-blur-sm border-border/50 p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                <span className="text-4xl">🔮</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2 text-muted-foreground">
                  เร็วๆ นี้
                </h2>
                <p className="text-muted-foreground">
                  วิธีการทำนายอื่นๆ กำลังจะมาเร็วๆ นี้
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Prophesy;
