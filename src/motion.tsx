import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
const MotionRouterLink = motion.create(Link);
export const physics = {
  spring: { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 },
  gentle: { type: "spring" as const, stiffness: 230, damping: 30, mass: 0.8 },
  fade: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
  exit: { duration: 0.09 },
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
      initial={reduced ? false : { opacity: 0, y: 10 }}
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
      className={`motion-control ${className}`}
      whileHover={reduced ? undefined : { y: -1.5 }}
      whileTap={reduced ? undefined : { scale: 0.98, y: 1 }}
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
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: reduced ? { duration: 0 } : physics.exit }}
      transition={reduced ? { duration: 0 } : physics.fade}
    >
      {children}
    </motion.div>
  );
}

export function TactileLink({ className = "", ...props }: React.ComponentProps<typeof MotionRouterLink>) {
  const reduced = useReducedMotion();
  return <MotionRouterLink className={`motion-control ${className}`}
    whileHover={reduced ? undefined : { y: -1.5 }}
    whileTap={reduced ? undefined : { scale: 0.98, y: 1 }}
    transition={physics.spring} {...props} />;
}
