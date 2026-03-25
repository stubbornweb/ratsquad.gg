"use client"

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { pageTransition } from "@/hooks/useAnimations";

interface PageTransitionProps {
  children: ReactNode;
  routeKey?: string;
}

export function PageTransition({ children, routeKey }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
