import { asset } from "../assets";
import SignatureReveal, { MilanoSignature } from "./SignatureReveal";
export default function FinalCarPreview({ compact = false }: { compact?: boolean }) {
  return <div className="car-viewer-stage mr-sealed">
    <img className="mr-sealed-pattern" src={asset("kit-dragon-original.png")} alt="" aria-hidden="true"/>
    <div className="mr-sealed-content"><MilanoSignature/><h2>MR 26</h2><p>Coming soon.</p></div>
    <SignatureReveal variant="car" replay={!compact}/>
  </div>;
}
