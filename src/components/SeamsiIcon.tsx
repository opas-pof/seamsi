import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeamsiIconProps {
  onClick?: () => void;
  isAnimating?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const SeamsiIcon = ({ onClick, isAnimating = false, size = "lg" }: SeamsiIconProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48"
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary p-1 cursor-pointer transition-all duration-300 hover:scale-110",
        sizeClasses[size],
        isAnimating && "animate-shake",
        onClick && "hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
      )}
    >
      <div className="w-full h-full rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center">
        <Sparkles className={cn(
          "text-white",
          size === "sm" && "w-8 h-8",
          size === "md" && "w-12 h-12",
          size === "lg" && "w-16 h-16",
          size === "xl" && "w-24 h-24",
          isAnimating && "animate-glow"
        )} />
      </div>
    </div>
  );
};

export default SeamsiIcon;
