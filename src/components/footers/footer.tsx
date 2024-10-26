import { NeonCTA } from "@/app/(landing)/_components/neon-cta";
import { buttonVariants } from "@/components/ui/button";
import RetroGrid from "@/components/ui/retro-grid";
import SparklesText from "@/components/ui/sparkles-text";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import React from "react";

interface FooterGroup {
  header: {
    label: string;
    href?: string;
  };
  items: {
    label: string;
    href: string;
  }[];
}

const defaultGroups: FooterGroup[] = [
  {
    header: { label: "Product" },
    items: [
      { href: routes.home, label: "Home" },
      { href: "#", label: "Features" },
      { href: "#", label: "Pricing" },
    ],
  },
  {
    header: { label: "Resources", href: "#" },
    items: [
      { href: "#", label: "Documentation" },
      { href: "#", label: "Blog" },
      { href: "#", label: "Support" },
    ],
  },
  {
    header: { label: "Legal" },
    items: [
      { href: "#", label: "Terms of Service" },
      { href: "#", label: "Privacy Policy" },
    ],
  },
];

const footerStyles = cva("flex flex-col gap-lg", {
  variants: {
    variant: {
      default: "flex-row items-center justify-between",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface FooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof footerStyles> {
  groups?: FooterGroup[];
}

export const Footer: React.FC<FooterProps> = ({
  variant = "default",
  groups = defaultGroups,
  ...props
}) => {
  const { className, ...rest } = props;

  const groupElements = groups.map((group, groupIndex) => (
    <div key={groupIndex} className="mb-8 md:mb-0">
      {group.header.href ? (
        <Link href={group.header.href} className="mb-2 block font-semibold">
          {group.header.label}
        </Link>
      ) : (
        <h3 className="mb-2 font-semibold">{group.header.label}</h3>
      )}
      <ul className="space-y-2">
        {group.items.map((item, itemIndex) => (
          <li key={itemIndex}>
            <Link
              className={cn(buttonVariants({ variant: "link" }), "p-0")}
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ));

  return (
    <footer className={cn(footerStyles({ variant }), className)} {...rest}>
      <div className="container flex min-h-80 w-full flex-col items-stretch gap-2xl py-2xl">
        <Link href={routes.buy} className="mx-auto my-40">
          <NeonCTA />
        </Link>
        <div className="flex justify-between gap-2xl">
          <div className="">
            <SparklesText
              duration={2}
              sparklesCount={6}
              text="Ship Kit"
              className="mb-12"
              colors={{ first: "#ff69b4", second: "#FA00FF" }}
            />
            <div className="">
              Sign up to be notified of new features and updates.
            </div>
          </div>
          <div className="flex flex-wrap gap-2xl lg:gap-20">
            {groupElements}
          </div>
        </div>
      </div>
      <RetroGrid
        className={cn("[mask-image:linear-gradient(to_top,white,transparent)]")}
      />
    </footer>
  );
};
