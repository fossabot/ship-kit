"use client";

import { Icons } from "@/components/images/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { useWindowScroll } from "@uidotdev/usehooks";
import { BoxesIcon, Menu } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { CommandMenu } from "@/components/ui/command-menu";
import styles from "@/styles/header.module.css";

interface NavLink {
  href: string;
  label: string;
  isCurrent?: boolean;
}

interface HeaderProps {
  navLinks?: NavLink[];
  logoHref?: string;
  logoIcon?: React.ReactNode;
  logoText?: string;
  searchPlaceholder?: string;
  userMenuItems?: { label: string; action: () => void }[];
}

const defaultNavLinks = [
  { href: routes.app.dashboard, label: "Features", isCurrent: false },
  { href: routes.app.dashboard, label: "Pricing", isCurrent: false },
  { href: routes.app.dashboard, label: "Docs", isCurrent: false },
];

export const Header: React.FC<HeaderProps> = ({
  logoHref = routes.home,
  logoIcon = <BoxesIcon />,
  logoText = "ShipKit",
  navLinks = defaultNavLinks,
  searchPlaceholder = "Search documentation...",
}) => {
  const [{ y }] = useWindowScroll();
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
            "-top-[12px] [--background:#fafafc30] dark:[--background:#1c1c2230]",
        )}
      >
        <div className="h-[12px] w-full"></div>
        <div className="container flex items-center justify-between gap-md">
          <nav className="hidden flex-col gap-md md:flex md:flex-row md:items-center">
            <Link
              href={logoHref}
              className="flex grow items-center gap-2 text-lg font-semibold md:mr-6 md:text-base"
            >
              {logoIcon}
              <span className="block">{logoText}</span>
              <span className="sr-only">{logoText}</span>
            </Link>
            <div className="flex items-center justify-between gap-md">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-foreground",
                    link.isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
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
          <div className="flex items-center gap-2 md:ml-auto lg:gap-4">
            <CommandMenu />
            <Button variant="outline" size="sm">
              Dashbboard
            </Button>
            <div className="flex items-center">
              <Link
                href={routes.external.github}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                )}
              >
                <Icons.github className="size-4" />
              </Link>
              <Link
                href={routes.external.x_follow}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                )}
              >
                <Icons.x className="size-4" />
              </Link>
              <ThemeToggle variant="ghost" size="icon" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
