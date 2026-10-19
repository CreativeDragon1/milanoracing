import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
export const physics = {
  spring: { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.8 },
  gentle: { type: "spring" as const, stiffness: 180, damping: 26 },
  fade: { duration: 0.2 },
};
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-25px" }}
      transition={physics.gentle}
    >
      {children}
    </motion.div>
  );
}
export function Press({
  children,
  className = "",
  ...props
}: React.ComponentProps<typeof motion.button>) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      className={className}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.975, y: 1 }}
      transition={physics.spring}
      {...props}
    >
      {children}
    </motion.button>
  );
}
export function PageMotion({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={physics.fade}
    >
      {children}
    </motion.div>
  );
}
