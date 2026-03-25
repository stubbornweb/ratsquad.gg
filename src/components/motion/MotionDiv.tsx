"use client"

import { type ReactNode } from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

interface MotionDivProps {
  children: ReactNode;
  variant?: Variants;
  className?: string;
  delay?: number;
  transition?: Transition;
}

export function MotionDiv({
  children,
  variant,
  className,
  delay = 0,
  transition,
  ...props
}: MotionDivProps) {
  return (
    <motion.div
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={transition ?? { delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
