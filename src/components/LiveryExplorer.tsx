import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { asset } from "../assets";
import { Press } from "../motion";
import { liveryComponents } from "../data/livery-components";
import "./LiveryExplorer.css";

export default function LiveryExplorer() {
  const [selected, setSelected] = useState(0);
  const current = liveryComponents[selected];
  function step(direction: number) {
    setSelected(index => (index + direction + liveryComponents.length) % liveryComponents.length);
  }
  return <section className="livery-explorer" aria-label="Explore the car components">
    <div className="livery-explorer-toolbar"><p>Choose a point on the car to look closer.</p><span>{selected + 1} / {liveryComponents.length}</span></div>
    <div className="livery-explorer-layout">
      <div className="livery-explorer-visual">
        <div className="livery-hotspot-stage">
          <img src={asset("current-car.webp")} alt="Milano Racing miniature car, viewed from the front left" width="1166" height="841"/>
          {liveryComponents.map((component, index) => <button key={component.id} type="button" className={`livery-hotspot ${index === selected ? "active" : ""}`} style={{left:`${component.x}%`,top:`${component.y}%`}} aria-label={`Explore ${component.name}`} aria-pressed={index === selected} aria-controls="livery-component-details" title={component.name} onClick={() => setSelected(index)}>
            <span>{index + 1}</span><span className="hotspot-tooltip" aria-hidden="true">{component.name}</span>
          </button>)}
        </div>
        <div className="livery-component-list" role="group" aria-label="Choose a car component">{liveryComponents.map((component, index) => <Press key={component.id} className={index === selected ? "active" : ""} onClick={() => setSelected(index)} aria-pressed={index === selected} aria-controls="livery-component-details"><span>{index + 1}</span>{component.name}</Press>)}</div>
      </div>
      <div className="livery-component-details" id="livery-component-details">
        <div className="livery-panel-stack">{liveryComponents.map((component,index) => <div className={`livery-panel ${selected === index ? "active" : ""}`} key={component.id} aria-hidden={selected !== index}>
          <h2>{component.name}</h2><p className="livery-component-headline">{component.headline}</p>
          {component.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <p className="livery-look-closer">{component.detail}</p>
        </div>)}</div>
        <div className="livery-step-controls"><Press className="icon-button" aria-label="Previous component" onClick={() => step(-1)}><ChevronLeft size={18}/></Press><span aria-live="polite" aria-atomic="true">{current.name}</span><Press className="icon-button" aria-label="Next component" onClick={() => step(1)}><ChevronRight size={18}/></Press></div>
      </div>
    </div>
  </section>;
}
