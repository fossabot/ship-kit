import { Icons } from "@/components/images/icons";
import { buttonVariants } from "@/components/ui/button";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { useWindowScroll } from "@uidotdev/usehooks";
import { HomeIcon, PencilIcon } from "lucide-react";
import Link from "next/link";

const DATA = {
  navbar: [
    { href: routes.home, icon: HomeIcon, label: "Home" },
    { href: routes.docs, icon: PencilIcon, label: "Docs" },
  ],
  contact: {
    social: {
      GitHub: {
        name: "GitHub",
        url: routes.external.github,
        icon: Icons.github,
      },
      // LinkedIn: {
      //   name: "LinkedIn",
      //   url: "#",
      //   icon: Icons.linkedin,
      // },
      X: {
        name: "X",
        url: routes.external.x,
        icon: Icons.x,
      },
      email: {
        name: "Email",
        url: routes.external.email,
        icon: Icons.email,
      },
    },
  },
};

const LinkOrIcon = ({ href, ...props }: { href?: string } & React.ComponentPropsWithoutRef<"a">) => {
  return href ? <Link href={href} {...props} /> : <a {...props} />;
};

export const SocialDock = ({ className }: { className?: string }) => {
  const [{ x, y }, scrollTo] = useWindowScroll();
  const isVisible = y && y > 100;

  return (
    <>
      <Dock
        direction="middle"
        className={cn(
          "opacity-0 transition-opacity delay-100 duration-500 bg-black/15",
          isVisible && "opacity-100",
          className,
        )}
      >
        {DATA.navbar.map((item) => (
          <DockIcon key={item.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <LinkOrIcon
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full",
                  )}
                >
                  <item.icon className="size-4" />
                </LinkOrIcon>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {Object.entries(DATA.contact.social).map(([name, social]) => (
          <DockIcon key={name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <LinkOrIcon
                  href={social.url}
                  aria-label={social.name}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full",
                  )}
                >
                  <social.icon className="size-4" />
                </LinkOrIcon>
              </TooltipTrigger>
              <TooltipContent>
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger>
              <ThemeToggle className="rounded-full size-12" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </>
  );
};
