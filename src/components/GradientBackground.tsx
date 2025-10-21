import { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
}

const GradientBackground = ({ children, className = "" }: GradientBackgroundProps) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(55.9%_55.87%_at_50.8%_44.13%,_#E2843E_0%,_#500019_100%)]">
      {children}
    </div>
  );
};

export default GradientBackground;
