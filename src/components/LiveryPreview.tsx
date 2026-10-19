import SignatureReveal, { MilanoSignature } from "./SignatureReveal";
import { asset } from "../assets";
import "./LiveryPreview.css";

export default function LiveryPreview({ compact = false, replay = false }: { compact?: boolean; replay?: boolean }) {
  return <div className={`livery-reveal ${compact ? "is-compact" : ""}`} role="group" aria-label="New Milano Racing livery. Coming soon.">
    <div className="livery-reveal-art" aria-hidden="true">
      <div className="livery-reveal-panel" />
      <img className="livery-reveal-dragon" src={asset("kit-dragon-original.png")} alt="" />
      <div className="livery-reveal-seam" />
      <span className="livery-reveal-word">LIVERY</span>
      <div className="livery-reveal-copy"><span>UNDER WRAPS</span><strong>Coming soon.</strong></div>
      <MilanoSignature/>
      <span className="livery-reveal-signature">MILANO RACING</span>
    </div>
    <SignatureReveal variant="livery" replay={replay}/>
  </div>;
}
