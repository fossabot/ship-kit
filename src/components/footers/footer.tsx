import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import React from "react";

const defaultLinks: { href: string; label: string }[] = [
  { href: routes.home, label: "Home" },
  // { href: routes.about, label: "About" },
  // { href: routes.contact, label: "Contact" },
];

const footerStyles = cva("flex flex-col gap-lg p-lg", {
  variants: {
    variant: {
      default: "container flex-row items-center justify-between",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface FooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof footerStyles> {
  links?: { href: string; label: string }[];
}

export const Footer: React.FC<FooterProps> = async ({
  variant = "default",
  links = defaultLinks,
  ...props
}) => {
  const { className, ...rest } = props;

  const linkElement = (
    <ul className="flex flex-wrap">
      {links.map((link, index) => {
        if (!link.href) {
          return null;
        }

        return (
          <li key={index}>
            <Link
              className={cn(buttonVariants({ variant: "link" }))}
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <footer className={cn(footerStyles({ variant }), className)} {...rest}>
      <p className="">Copyright &copy; Ship Kit. All Right Reserved.</p>

      {variant === "default" && linkElement}
    </footer>
  );
};
