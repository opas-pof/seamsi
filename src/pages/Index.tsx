import { useNavigate } from "react-router-dom";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  useSeo({
    title: "ทำนายดวงชะตา - หน้าแรก",
    description: "เริ่มต้นเสี่ยงเซียมซีและค้นพบคำทำนายของคุณ",
    keywords: ["หน้าแรก", "เซียมซี", "ทำนายดวง"]
  });

  return (
    <GradientBackground>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <div className="animate-fade-in space-y-8">
            <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary p-2 animate-glow">
              <div className="w-full h-full rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
              ทำนายดวงชะตา
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl mx-auto">
              ค้นพบคำทำนายและแนวทางชีวิตของคุณ
            </p>
            
            <Button 
              size="lg"
              onClick={() => navigate("/prophesy")}
              className="mt-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold px-12 py-8 text-2xl rounded-full shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)] transition-all"
            >
              เริ่มทำนาย
            </Button>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Index;
