import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  return (
    <div className={cn(
      "font-bold text-2xl tracking-tight",
      variant === "white" ? "text-white" : "text-primary",
      className
    )}>
      Q<span className="text-success">invest</span>
    </div>
  );
}