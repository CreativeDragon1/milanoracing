import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef, useState, type ReactNode, type CSSProperties } from "react";
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
// Native view timelines keep scrolling independent of main-thread React work.
// Older browsers retain the same reversible Motion fallback.
const nativeScroll = typeof CSS !== "undefined" && CSS.supports("animation-timeline", "view()");
export function Reveal(props: React.ComponentProps<typeof LegacyReveal>) {
  if (!nativeScroll) return <LegacyReveal {...props}/>;
  const { as: Tag = "div", className = "", children, delay = 0, ...rest } = props;
  return <Tag {...rest} className={`scroll-reveal native-reveal ${className}`} style={{ '--reveal-offset': `${Math.min(5, delay * 30)}%` } as CSSProperties} data-reveal-state="native-scroll">{children}</Tag>;
}
function LegacyReveal({
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Position, rather than elapsed time, drives the effect in either direction.
  // Keep the centre readable while position and scale continue following the scroll.
  const edge = .32 + Math.min(.025, Math.max(0, delay) * .15);
  const opacity = useTransform(scrollYProgress, [0, edge, 1 - edge, 1], [0, 1, 1, 0]);
  const editorial = /(?:page-heading|ec-section|plan-card|partner-equal-card|person)/.test(className);
  const distance = editorial ? 24 : 100;
  const midpoint = editorial ? 4 : 18;
  const y = useTransform(scrollYProgress, [0, edge, .5, 1 - edge, 1], [distance, midpoint, 0, -midpoint, -distance]);
  const scale = useTransform(scrollYProgress, [0, edge, .5, 1 - edge, 1], [.94, .99, 1, .99, .94]);
  const [focused, setFocused] = useState(false);
  const staticContent = !!reduced || focused;
  const Tag = as === "section" ? motion.section : as === "article" ? motion.article : motion.div;
  return (
    <Tag
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      className={`scroll-reveal ${className}`}
      data-reveal-state={staticContent ? "static" : "scroll-linked"}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
      initial={false}
      style={{ opacity: staticContent || editorial ? 1 : opacity, y: staticContent ? 0 : y, scale:staticContent || editorial ? 1 : scale }}
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
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: reduced ? { duration: 0 } : physics.exit }}
      transition={reduced ? { duration: 0 } : { duration: .38, ease: teaserMotion.ease }}
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
