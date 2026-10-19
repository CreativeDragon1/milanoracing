import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
const MotionRouterLink = motion.create(Link);
export const teaserMotion = {
  duration: 3.6,
  ease: [0.22, 1, 0.36, 1] as const,
  text: { duration: .55, ease: [0.22, 1, 0.36, 1] as const },
};
export const physics = {
  spring: { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 },
  gentle: { type: "spring" as const, stiffness: 230, damping: 30, mass: 0.8 },
  fade: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
  exit: { duration: 0.09 },
};
export function Reveal({
  children,
  className = "",
  as = "div",
  delay = 0,
  id,
  "aria-labelledby": labelledBy,
  "aria-label": label,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  delay?: number;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -24px 0px", amount: "some" });
  const [focused, setFocused] = useState(false);
  const visible = !!reduced || inView || focused;
  const Tag = as === "section" ? motion.section : as === "article" ? motion.article : motion.div;
  return (
    <Tag
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      className={`scroll-reveal ${className}`}
      data-reveal-state={visible ? "visible" : "waiting"}
      onFocusCapture={() => setFocused(true)}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: reduced || focused ? 0 : .55, delay: reduced || focused ? 0 : Math.min(.16, Math.max(0, delay)), ease: [.22, 1, .36, 1] }}
    >
      {children}
    </Tag>
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
