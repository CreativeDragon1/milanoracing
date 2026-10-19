import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { cars } from "../content";
import { Press, physics } from "../motion";
import { Heading } from "../components/site";
import EngineeringCharts from "../components/EngineeringCharts";

export default function Evolution() {
  const [selected, setSelected] = useState("V4");
  const [compare, setCompare] = useState(false);
  const [left, setLeft] = useState("V1");
  const [right, setRight] = useState("V4");
  const car = cars.find(item => item.id === selected)!;
  const reduced = useReducedMotion();
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % cars.length : event.key === "ArrowLeft" ? (index + cars.length - 1) % cars.length : event.key === "Home" ? 0 : event.key === "End" ? cars.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault(); setSelected(cars[next].id);
    document.getElementById(`tab-${cars[next].id}`)?.focus();
  }
  return <>
    <Heading title="Built. Tested. Reconsidered." description="Explore the relationships between shape, airflow and performance."/>
    <section className="evolution-shell raised">
      <div className="archive-toolbar">
        <div className="version-tabs" role="tablist" aria-label="Car version">{cars.map((item, index) => <Press role="tab" id={`tab-${item.id}`} aria-controls="car-panel" aria-selected={selected === item.id} tabIndex={selected === item.id ? 0 : -1} onKeyDown={event => tabKey(event, index)} onClick={() => setSelected(item.id)} className={selected === item.id ? "selected" : ""} key={item.id}>{item.id}{selected === item.id && <motion.span className="tab-underline" layoutId="version-indicator" transition={reduced ? { duration: 0 } : physics.spring}/>}</Press>)}</div>
        <Press className="button secondary" aria-pressed={compare} onClick={() => setCompare(!compare)}>{compare ? <Minus size={17}/> : <Plus size={17}/>}Compare versions</Press>
      </div>
      <div id="car-panel" role="tabpanel" aria-labelledby={`tab-${selected}`} className="public-version-panel">
        <div className="version-plot">
          <div className="chart-heading"><span>DRAG / N</span><span>Illustrative data</span></div>
          {cars.map(item => <button key={item.id} onClick={() => setSelected(item.id)} className={`version-bar ${selected === item.id ? "active" : ""}`} aria-label={`Select ${item.id} ${item.name}`} aria-pressed={selected === item.id}>
            <span>{item.id}<small>{item.name}</small></span><span className="version-bar-track"><motion.span initial={false} animate={{width:`${item.dragN / .7 * 100}%`}} transition={reduced ? { duration: 0 } : physics.spring}/></span><strong>{item.dragN.toFixed(3)}</strong>
          </button>)}
          <p className="data-note">Car models will be added here.</p>
        </div>
        <AnimatePresence mode="wait" initial={false}><motion.div className="public-version-details" key={car.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced ? 0 : .12}}>
          <span className="version-tag">{car.id}</span><h2>{car.name}</h2>
          <dl><div><dt>Drag</dt><dd>{car.dragN.toFixed(3)} <small>N</small></dd></div><div><dt>Downforce</dt><dd>{car.downforceN.toFixed(3)} <small>N</small></dd></div><div><dt>Mass</dt><dd>{car.massG.toFixed(1)} <small>g</small></dd></div></dl>
          <p className="data-note">Illustrative data</p>
        </motion.div></AnimatePresence>
      </div>
    </section>
    {compare && <section className="comparison section"><h2>Compare versions.</h2><div className="comparison-grid">{[{id:left,set:setLeft,label:"Left comparison version"},{id:right,set:setRight,label:"Right comparison version"}].map(slot => {
      const item = cars.find(version => version.id === slot.id)!;
      return <div className="compare-card raised" key={slot.label}><label>{slot.label}<select aria-label={slot.label} value={slot.id} onChange={event => slot.set(event.target.value)}>{cars.map(version => <option value={version.id} key={version.id}>{version.id} — {version.name}</option>)}</select></label><h3>{item.name}</h3><dl className="comparison-stats"><div><dt>Drag</dt><dd>{item.dragN.toFixed(3)} N</dd></div><div><dt>Downforce</dt><dd>{item.downforceN.toFixed(3)} N</dd></div><div><dt>Mass</dt><dd>{item.massG.toFixed(1)} g</dd></div></dl></div>;
    })}</div><p className="data-note">Illustrative data</p></section>}
    <EngineeringCharts/>
    <details className="evidence-details"><summary>About these charts <Plus size={18}/></summary><p>These public datasets illustrate the development process. Detailed design evidence and competition statistics are presented in the engineering portfolio.</p></details>
  </>;
}
