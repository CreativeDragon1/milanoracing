import { asset } from "../assets";
import "./LiveryPreview.css";

export default function LiveryPreview({ compact = false }: { compact?: boolean }) {
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
    <span className="livery-reveal-label">THE LIVERY, UNVEILED</span>
  </div>;
}
