import { LockKeyhole } from "lucide-react";
import { asset } from "../assets";
export default function FinalCarPreview() {
  return <div className="car-viewer-stage mr-sealed">
    <img className="mr-sealed-pattern" src={asset("kit-dragon-original.png")} alt="" aria-hidden="true"/>
    <div className="mr-sealed-content"><LockKeyhole size={24} aria-hidden="true"/><h2>MR 26</h2><p>Coming soon.</p></div>
  </div>;
}
