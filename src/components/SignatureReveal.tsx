import { useEffect, useId, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { asset } from "../assets";
import { Press, teaserMotion } from "../motion";
import "./SignatureReveal.css";

export function MilanoSignature({ className = "" }: { className?: string }) {
  return <svg className={`teaser-signature ${className}`} viewBox="25 230 555 185" aria-hidden="true">
    <image href={asset("milano-official.png")} width="648" height="648" />
  </svg>;
}

export default function SignatureReveal({ variant, replay = false }: { variant: "car" | "livery"; replay?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: .4 });
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [take, setTake] = useState(0);
  const [armed, setArmed] = useState(false);
  const maskId = useId().replace(/:/g, "");
  const active = inView && !reduced && armed;
  useEffect(() => {
    if (!inView || reduced || !playing) return;
    const frame = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, playing, take]);
  useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);
  return <div ref={ref} className={`signature-sequence signature-sequence-${variant}`} data-phase={reduced || !playing ? "sealed" : active ? "revealing" : "waiting"}>
    {!reduced && playing && <motion.div key={take} className="signature-curtain" aria-hidden="true"
      initial={{ opacity: 1 }} animate={active ? { opacity: [1, 1, 0] } : { opacity: 1 }}
      transition={{ duration: teaserMotion.duration, times: [0, .82, 1], ease: "easeInOut" }}
      onAnimationComplete={() => { if (active) setPlaying(false); }}>
      <motion.div className="signature-track signature-track-blue" initial={{ scaleX: 0 }} animate={active ? { scaleX: [0, 1, 1], opacity: [0, 1, 0] } : { scaleX: 0 }} transition={{ duration: 1.7, delay: .1, ease: teaserMotion.ease }}/>
      <motion.div className="signature-track signature-track-orange" initial={{ scaleX: 0 }} animate={active ? { scaleX: [0, 1, 1], opacity: [0, 1, 0] } : { scaleX: 0 }} transition={{ duration: 1.7, delay: .35, ease: teaserMotion.ease }}/>
      <motion.div className="signature-build" initial={{ scale: .93, opacity: 0 }} animate={active ? { scale: [ .93, 1, 1.025 ], opacity: [0, 1, 1] } : { opacity: 0 }} transition={{ duration: 2.6, times: [0,.35,1], ease: teaserMotion.ease }}>
        <svg className="signature-draw" viewBox="25 230 555 185">
          <defs><clipPath id={maskId}><motion.rect x="20" y="220" height="210" initial={{ width: 0 }} animate={active ? { width: 570 } : { width: 0 }} transition={{ duration: 1.35, delay: .45, ease: teaserMotion.ease }}/></clipPath></defs>
          <image href={asset("milano-official.png")} width="648" height="648" opacity=".12" className="signature-ghost" />
          <image href={asset("milano-official.png")} width="648" height="648" clipPath={`url(#${maskId})`} />
        </svg>
        <motion.span className="signature-message" initial={{ opacity: 0, y: 8 }} animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }} transition={{ ...teaserMotion.text, delay: 1.6 }}>{variant === "car" ? "THE NEXT CHAPTER" : "A NEW SIGNATURE"}</motion.span>
      </motion.div>
      <motion.div className="signature-pass" initial={{ x: "-160%", opacity: 0 }} animate={active ? { x: "160%", opacity: [0,.65,0] } : { opacity: 0 }} transition={{ duration: 1.1, delay: 1.8, ease: teaserMotion.ease }}/>
    </motion.div>}
    {replay && !reduced && <Press className="signature-replay" disabled={playing} aria-label={`Replay ${variant === "car" ? "MR 26" : "livery"} reveal`} onClick={() => { setArmed(false); setTake(value => value + 1); setPlaying(true); }}><RotateCcw size={15} aria-hidden="true"/><span>Replay</span></Press>}
  </div>;
}
