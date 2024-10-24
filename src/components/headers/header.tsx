"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useWindowScroll } from "@uidotdev/usehooks";
import { Menu, Search } from "lucide-react";
import Link from "next/link";

import AnimatedButton from "@/components/buttons/animated-button/animated-button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ThemeToggle } from "@/components/ui/theme";
import styles from "@/styles/header.module.css";
import { useMemo } from "react";

// Define types for our props
type NavLink = {
  href: string;
  label: string;
  isCurrent?: boolean;
};

type HeaderProps = {
  navLinks: NavLink[];
  logoHref: string;
  logoIcon: React.ReactNode;
  logoText: string;
  searchPlaceholder: string;
  userMenuItems: { label: string; action: () => void }[];
};

export const Header: React.FC<HeaderProps> = ({
  navLinks,
  logoHref,
  logoIcon,
  logoText,
  searchPlaceholder,
  userMenuItems,
}) => {
  const [{ x, y }, scrollTo] = useWindowScroll();
  const isOpaque = useMemo(() => y && y > 100, [y]);

  return (
    <>
      <header
        className={cn(
          "translate-z-0 sticky top-0 z-50 p-md",
          styles.header,
          styles.container,
          isOpaque && styles.opaque,
          isOpaque &&
            "-top-[12px] [--background:#fafafc80] dark:[--background:#1c1c22B0]",
        )}
      >
        <div className="h-[12px] w-full"></div>
        <div className="container flex items-center justify-between gap-md">
          <nav className="hidden flex-col gap-md md:flex md:flex-row md:items-center">
            <Link
              href={logoHref}
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              {logoIcon}
              <span className="sr-only">{logoText}</span>
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  link.isCurrent ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href={logoHref}
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  {logoIcon}
                  <span className="sr-only">{logoText}</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-muted-foreground hover:text-foreground",
                      link.isCurrent ? "text-foreground" : "",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>
            <RainbowButton className="text-primary-foreground">
              Login
            </RainbowButton>
            <AnimatedButton>Animated Button</AnimatedButton>
            <ThemeToggle variant="ghost" />
          </div>
        </div>
      </header>
    </>
  );
};
