import { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
}

const GradientBackground = ({ children, className = "" }: GradientBackgroundProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950 ${className}`}>
      {children}
    </div>
  );
};

export default GradientBackground;
