"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import Meteors from "@/components/ui/meteors";
import { cn } from "@/lib/utils";

export function MeteorsHero({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-background", className)}
    >
      {children}
      <Meteors number={5} />
    </div>
  );
}
