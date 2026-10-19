import FinalCarPreview from "../components/FinalCarPreview";

import CarViewer from "../components/CarViewer";

import { asset } from "../assets";

import { useState, type KeyboardEvent } from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Plus, Minus } from "lucide-react";

import { cars } from "../content";

import { Press, Reveal, physics } from "../motion";

import { Heading } from "../components/site";

import EngineeringCharts from "../components/EngineeringCharts";



export default function Evolution() {

  const [selected, setSelected] = useState("MR26");

  const [compare, setCompare] = useState(false);

  const [left, setLeft] = useState("V1");

  const [right, setRight] = useState("V4");

  const final = selected === "MR26";

  const car = cars.find(item => item.id === selected) ?? cars[3];

  const tabs = [...cars.map(item => ({id:item.id,label:item.label})), {id:"MR26",label:"MR 26"}];

  const reduced = useReducedMotion();

  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {

    const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length : event.key === "ArrowDown" ? 4 : event.key === "ArrowUp" ? Math.min(index,3) : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : -1;

    if (next < 0) return;

    event.preventDefault(); setSelected(tabs[next].id);

    document.getElementById(`tab-${tabs[next].id}`)?.focus();

  }

  return <>

    <Heading title="Built. Tested. Reconsidered." description="Explore the relationships between shape, airflow and performance."/>

    <section className="evolution-shell raised">

      <div className="archive-toolbar">

        <div className="version-tabs has-final" role="tablist" aria-label="Car version">{tabs.map((item, index) => <Press role="tab" id={`tab-${item.id}`} aria-controls="car-panel" aria-selected={selected === item.id} tabIndex={selected === item.id ? 0 : -1} onKeyDown={event => tabKey(event, index)} onClick={() => setSelected(item.id)} className={`${selected === item.id ? "selected" : ""} ${item.id === "MR26" ? "final-version-tab" : ""}`} key={item.id}>{item.label}{selected === item.id && <motion.span className="tab-underline" layoutId="version-indicator" transition={reduced ? { duration: 0 } : physics.spring}/>}</Press>)}</div>

        <Press className="button secondary" aria-pressed={compare} onClick={() => setCompare(!compare)}>{compare ? <Minus size={17}/> : <Plus size={17}/>}Compare versions</Press>

      </div>

      <div id="car-panel" role="tabpanel" aria-labelledby={`tab-${selected}`}>

        <div hidden={final}><CarViewer id={car.id} name={car.name}/></div>

        {final && <div className="final-car-panel">

          <FinalCarPreview/>

        </div>}

        {!final && <Reveal className="public-version-panel">

        <div className="version-plot">

          <div className="chart-heading"><span>DRAG / N</span><span>Illustrative data</span></div>

          {cars.map(item => <button key={item.id} onClick={() => setSelected(item.id)} className={`version-bar ${selected === item.id ? "active" : ""}`} aria-label={`Select ${item.label} ${item.name}`} aria-pressed={selected === item.id}>

            <span>{item.label}<small>{item.name}</small></span><span className="version-bar-track"><motion.span initial={false} animate={{width:`${item.dragN / .7 * 100}%`}} transition={reduced ? { duration: 0 } : physics.spring}/></span><strong>{item.dragN.toFixed(3)}</strong>

          </button>)}



        </div>

        <AnimatePresence mode="wait" initial={false}><motion.div className="public-version-details" key={car.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={reduced ? {duration: 0} : physics.fade}>

          <span className="version-tag">{car.label}</span><h2>{car.name}</h2>

          <dl><div><dt>Drag</dt><dd>{car.dragN.toFixed(3)} <small>N</small></dd></div><div><dt>Downforce</dt><dd>{car.downforceN.toFixed(3)} <small>N</small></dd></div><div><dt>Mass</dt><dd>{car.massG.toFixed(1)} <small>g</small></dd></div></dl>

          <p className="data-note">Illustrative data</p>

        </motion.div></AnimatePresence>

        </Reveal>}

      </div>

    </section>

    <AnimatePresence initial={false}>{compare && <motion.section className="comparison section" initial={reduced ? false : {height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={reduced ? {duration:0} : physics.gentle} style={{overflow:"hidden"}}><h2>Compare versions.</h2><div className="comparison-grid">{[{id:left,set:setLeft,label:"First comparison version"},{id:right,set:setRight,label:"Second comparison version"}].map(slot => {

      const item = cars.find(version => version.id === slot.id);

      return <div className="compare-card raised" key={slot.label}>
        <label className="compare-selection">{slot.label}<select aria-label={slot.label} value={slot.id} onChange={event => slot.set(event.target.value)}>
          {cars.map(version => <option value={version.id} key={version.id}>{version.label} — {version.name}</option>)}
          <option value="MR26">MR 26</option>
        </select></label>
        <div className="compare-preview">
          {item ? <img src={asset(`concept-${item.id.toLowerCase()}.webp`)} alt={`${item.label} ${item.name} CAD model`} width="1200" height="700" loading="lazy"/> : <FinalCarPreview compact/>}
        </div>
        <div className={`compare-summary ${item ? "" : "is-sealed"}`}>
          <h3>{item ? item.name : "MR 26"}</h3>
          {item ? <dl className="comparison-stats"><div><dt>Drag</dt><dd>{item.dragN.toFixed(3)} N</dd></div><div><dt>Downforce</dt><dd>{item.downforceN.toFixed(3)} N</dd></div><div><dt>Mass</dt><dd>{item.massG.toFixed(1)} g</dd></div></dl> : <p>Coming soon.</p>}
        </div>
      </div>;

    })}</div>{(left !== "MR26" || right !== "MR26") && <p className="data-note">Illustrative data</p>}</motion.section>}</AnimatePresence>

    <EngineeringCharts/>

    <details className="evidence-details"><summary>About these charts <Plus size={18}/></summary><p>These public datasets illustrate the development process. Detailed design evidence and competition statistics are presented in the engineering portfolio.</p></details>

  </>;

}
