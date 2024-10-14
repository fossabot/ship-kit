import { Button, ButtonProps, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link, { LinkProps } from 'next/link';
import React, { ButtonHTMLAttributes } from 'react';
import styles from './animated-button.module.css';

// Extend the ButtonHTMLAttributes to include all possible button props
interface AnimatedButtonProps extends ButtonHTMLAttributes<ButtonProps | LinkProps> {
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
const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, className, ...props }) => {

    const Element = props?.href ? <Link className={cn(
        buttonVariants({variant: 'outline'}),
        'border border-transparent bg-transparent hover:border-[#818cf8] transition-all duration-1000 ease-in-out', 
        className
        )} href={props.href}>{children}</Link> : (<Button
        // {...props}
        className={cn(
        'border border-transparent bg-transparent hover:border-[#818cf8] transition-all duration-1000 ease-in-out px-md', 
        className
        )}
      >
        {children}
      </Button>)

  return (
    <div className={`${styles.buttonWrapper} relative z-0 min-h-9 rounded-md overflow-hidden flex justify-center items-center`}>
      <div className={`${styles.animatedBackground} absolute translate-x-[-50%] translate-y-[-50%] z-[-2] w-[200px] h-[200px] bg-no-repeat bg-[0_0] bg-cover m-auto`}>
      </div>
      {Element}
    </div>
  );
};

export default AnimatedButton;
