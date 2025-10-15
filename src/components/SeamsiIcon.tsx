import { cn } from "@/lib/utils";

interface SeamsiIconProps {
  onClick?: () => void;
  isAnimating?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const SeamsiIcon = ({ onClick, isAnimating = false, size = "lg" }: SeamsiIconProps) => {
  const sizeMap = {
    sm: { container: 80, sticks: 60 },
    md: { container: 120, sticks: 90 },
    lg: { container: 160, sticks: 120 },
    xl: { container: 240, sticks: 180 }
  };

  const dimensions = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:scale-110 inline-block",
        isAnimating && "animate-shake-long",
        onClick && "hover:drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
      )}
      style={{ width: dimensions.container, height: dimensions.container }}
    >
      {/* SVG Seamsi Icon */}
      <svg
        viewBox="0 0 200 300"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Container (Red cylinder) */}
        <rect
          x="40"
          y="180"
          width="120"
          height="110"
          rx="8"
          fill="hsl(0, 75%, 60%)"
          stroke="hsl(0, 0%, 10%)"
          strokeWidth="4"
        />
        
        {/* Container shadow/detail */}
        <rect
          x="40"
          y="180"
          width="30"
          height="110"
          rx="8"
          fill="hsl(0, 0%, 100%)"
          opacity="0.2"
        />
        
        {/* Container bands */}
        <rect
          x="40"
          y="195"
          width="120"
          height="8"
          fill="hsl(0, 0%, 10%)"
        />
        <rect
          x="40"
          y="270"
          width="120"
          height="8"
          fill="hsl(0, 0%, 10%)"
        />

        {/* Seamsi Sticks */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const positions = [50, 70, 90, 100, 110, 130, 150];
          const heights = [160, 140, 120, 170, 130, 155, 145];
          const x = positions[i];
          const height = heights[i];
          
          return (
            <g key={i}>
              {/* Stick body (beige/wood color) */}
              <rect
                x={x}
                y={180 - height}
                width="12"
                height={height}
                fill="hsl(30, 40%, 70%)"
                stroke="hsl(0, 0%, 10%)"
                strokeWidth="2"
              />
              
              {/* Stick tip (yellow/gold) */}
              <ellipse
                cx={x + 6}
                cy={180 - height}
                rx="8"
                ry="12"
                fill="hsl(45, 95%, 60%)"
                stroke="hsl(0, 0%, 10%)"
                strokeWidth="2"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default SeamsiIcon;
