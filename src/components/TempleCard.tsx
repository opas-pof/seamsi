import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface TempleCardProps {
  temple: {
    id: string;
    name: string;
    location: string;
    image?: string;
  };
}

const TempleCard = ({ temple }: TempleCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-300 hover:scale-105 animate-fade-in"
      onClick={() => navigate(`/fortune/seamsi/temple/${temple.id}`)}
    >
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
        {temple.image ? (
          <img src={temple.image} alt={temple.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{temple.name}</h3>
        </div>
      </div>
    </Card>
  );
};

export default TempleCard;
