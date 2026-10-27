import { motion, useReducedMotion } from "motion/react";
import { asset } from "../assets";
import "./LiveryPreview.css";

export default function LiveryPreview({ compact = false }: { compact?: boolean }) {
  const reducedMotion = useReducedMotion();
  return <div className={`livery-reveal ${compact ? "is-compact" : ""}`}>
    <img
      className="livery-reveal-photo"
      src={asset("milano-livery-unveiled.webp")}
      srcSet={`${asset("milano-livery-unveiled-720.webp")} 720w, ${asset("milano-livery-unveiled.webp")} 1440w`}
      sizes={compact ? "(max-width: 700px) 100vw, 40vw" : "(max-width: 700px) 100vw, 70vw"}
      width={1440} height={840}
      alt="The unveiled Milano Racing car in its white and orange livery, with STEM Racing sidepod branding, shown in a blue-lit garage."
      loading={compact ? "lazy" : "eager"}
    />
    <motion.span
      className="livery-reveal-label"
      initial={reducedMotion ? false : { opacity: 0, x: -14, y: -4 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }}
    >
      <span className="livery-reveal-label-title">MILANO LIVERY<span className="sr-only">, </span></span>
      <motion.span
        className="livery-reveal-label-accent"
        initial={reducedMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0 : .6, delay: reducedMotion ? 0 : .18, ease: [.22, 1, .36, 1] }}
      >REVEALED</motion.span>
    </motion.span>
  </div>;
}
