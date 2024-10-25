import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { ButtonHTMLAttributes } from "react";
import styles from "./animated-button.module.css";

// Extend the ButtonHTMLAttributes to include all possible button props
interface AnimatedButtonProps
  extends ButtonHTMLAttributes<ButtonProps | LinkProps> {
  children: React.ReactNode;
  href?: string;
}

/**
 * AnimatedButton component
 *
 * A button with an animated background effect.
 * This component wraps the base Button component and adds animation.
 * It passes all received props to the underlying Button.
 */
const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  ...props
}) => {
  const Element = props?.href ? (
    <Link
      className={cn(
        buttonVariants({ variant: "outline" }),
        "border border-transparent bg-transparent transition-all ease-in-out hover:border-[#818cf8]",
        className,
      )}
      href={props.href}
    >
      {children}
    </Link>
  ) : (
    <Button
      // {...props}
      className={cn(
        "border border-transparent bg-transparent px-md transition-all duration-1000 ease-in-out hover:border-[#818cf8]",
        className,
      )}
    >
      {children}
    </Button>
  );

  return (
    <div
      className={`${styles.buttonWrapper} relative z-0 flex min-h-9 items-center justify-center overflow-hidden rounded-md text-white [--background:#fafafc] dark:text-black dark:[--background:#111827]`}
    >
      <div
        className={`${styles.animatedBackground} absolute z-[-2] m-auto h-[200px] w-[200px] translate-x-[-50%] translate-y-[-50%] bg-cover bg-[0_0] bg-no-repeat`}
      ></div>
      {Element}
    </div>
  );
};

export default AnimatedButton;
