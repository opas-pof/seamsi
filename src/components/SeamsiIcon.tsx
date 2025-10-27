import { cn } from "@/lib/utils";

interface SeamsiIconProps {
  onClick?: () => void;
  isAnimating?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const SeamsiIcon = ({ onClick, isAnimating = false, size = "lg" }: SeamsiIconProps) => {
  const sizeMap = {
    sm: { container: 80 },
    md: { container: 120 },
    lg: { container: 160 },
    xl: { container: 275 }
  };

  const dimensions = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:scale-105 inline-block select-none",
        isAnimating && "animate-seamsi-swing",
        onClick && "hover:drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
      )}
      style={{ width: dimensions.container }}
    >
      <img src="/fortune/assets/images/seamsi.png" alt="เซียมซี" className="w-full h-auto object-contain pointer-events-none block" />
    </div>
  );
};

export default SeamsiIcon;
