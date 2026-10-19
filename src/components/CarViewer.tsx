import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Minus, Plus, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Press } from "../motion";
import { asset } from "../assets";
import type { CarScene, CarView } from "../lib/carScene";

export default function CarViewer({ id, name }: { id: string; name: string }) {
  const label = `MK ${id.slice(1)}`;
  const host = useRef<HTMLDivElement>(null), scene = useRef<CarScene | null>(null);
  const reduced = useReducedMotion();
  const [available, setAvailable] = useState(false), [loaded, setLoaded] = useState("");
  const [failed, setFailed] = useState(false), [view, setView] = useState<CarView | null>("Perspective");
  useEffect(() => {
    if (!host.current) return;
    let cancelled = false, owned: CarScene | undefined;
    setAvailable(false); setLoaded(""); setFailed(false);
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return; observer.disconnect();
      import("../lib/carScene").then(module => {
        if (cancelled || !host.current) return;
        owned = module.createCarScene(host.current, !!reduced); scene.current = owned; setAvailable(true);
      }).catch(() => { if (!cancelled) setFailed(true); });
    }, {rootMargin:"200px"});
    observer.observe(host.current);
    return () => { cancelled = true; observer.disconnect(); owned?.dispose(); scene.current = null; };
  }, [reduced]);
  useEffect(() => {
    if (!available || !scene.current) return;
    let cancelled = false; setFailed(false);
    scene.current.show(`concept-${id.toLowerCase()}.glb`).then(() => { if (!cancelled) setLoaded(id); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [id, available]);
  const ready = available && loaded === id && !failed;
  function preset(next: CarView) { setView(next); scene.current?.preset(next); }
  return <div className="car-viewer">
    <div className="car-viewer-stage">
      <img className={`car-poster ${ready ? "is-hidden" : ""}`} src={asset(`concept-${id.toLowerCase()}.webp`)} alt={`${label} ${name} CAD model`} width="1200" height="700" />
      <div className={`car-canvas ${ready ? "is-ready" : ""}`} ref={host} tabIndex={0} role="region"
        aria-label={`Interactive ${label} ${name} car. Drag to rotate, left and right arrow keys rotate, plus and minus zoom, Home resets.`}
        onPointerDown={() => setView(null)} onKeyDown={event => {
          if (!ready) return;
          const actions: Record<string, () => void> = {
            ArrowLeft: () => scene.current?.rotate(-Math.PI/12), ArrowRight: () => scene.current?.rotate(Math.PI/12),
            "+": () => scene.current?.zoom(1), "=": () => scene.current?.zoom(1), "-": () => scene.current?.zoom(-1),
            Home: () => { scene.current?.reset(); setView("Perspective"); },
          };
          if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
        }} />
      {!ready && <span className="car-load-status" role="status">{failed ? "3D unavailable · model preview" : `Loading ${label} model…`}</span>}
    </div>
    <div className="car-viewer-controls">
      <div className="segmented car-views" role="group" aria-label="Car viewing angle">
        {(["Perspective","Side","Top","Front"] as CarView[]).map(option => <Press key={option} disabled={!ready} aria-pressed={view===option} onClick={() => preset(option)}>{option}</Press>)}
      </div>
      <div className="car-tools" role="group" aria-label="Car inspection controls">
        <Press className="icon-button" disabled={!ready} aria-label="Rotate car left" onClick={() => {scene.current?.rotate(-Math.PI/6);setView(null);}}><ChevronLeft size={17}/></Press>
        <Press className="icon-button" disabled={!ready} aria-label="Rotate car right" onClick={() => {scene.current?.rotate(Math.PI/6);setView(null);}}><ChevronRight size={17}/></Press>
        <Press className="icon-button" disabled={!ready} aria-label="Zoom out car" onClick={() => scene.current?.zoom(-1)}><Minus size={17}/></Press>
        <Press className="icon-button" disabled={!ready} aria-label="Zoom in car" onClick={() => scene.current?.zoom(1)}><Plus size={17}/></Press>
        <Press className="icon-button" disabled={!ready} aria-label="Reset car view" onClick={() => {scene.current?.reset();setView("Perspective");}}><RotateCcw size={17}/></Press>
      </div>
    </div>
    <p className="car-viewer-help">Drag to rotate · use + / − to zoom</p>
  </div>;
}
