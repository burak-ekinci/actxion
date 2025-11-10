"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", as, ...props }, ref) => {
    const Component = as || motion.button;

    return (
      <Component
        ref={ref}
        whileHover={{
          scale: 1.07,
          boxShadow: "0 0 16px 2px #6366f1",
        }}
        whileTap={{
          scale: 0.97,
          boxShadow: "0 0 8px 0 #818cf8",
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 15,
        }}
        className={
          "neon-glow bg-primary text-primary-foreground px-6 py-2 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all " +
          className
        }
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";

export { Button };
