import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, X, Plus, Minus, Box, ExternalLink } from "lucide-react";
import { cars, type Car } from "../content";
import { Press, Reveal, physics } from "../motion";

import { asset, nav, ArrowLink, Eyebrow, Heading } from "../components/site";
function MissingModel({
  car,
  compact = false,
}: {
  car: Car;
  compact?: boolean;
}) {
  return (
    <div className={`model-placeholder ${compact ? "compact" : ""}`}>
      <span className="model-version" aria-hidden="true">
        {car.id}
      </span>
      <Box size={compact ? 32 : 46} strokeWidth={1} />
      <strong>Original model goes here</strong>
      <span>Awaiting {car.id} CAD / render</span>
      <small>Editable content placeholder</small>
    </div>
  );
}
function CarMedia({ car, compact = false }: { car: Car; compact?: boolean }) {
  return car.image ? (
    <img
      className="version-render"
      src={car.image}
      alt={`${car.id} official car render`}
    />
  ) : (
    <MissingModel car={car} compact={compact} />
  );
}
export default function Evolution() {
  const [selected, setSelected] = useState("V10");
  const [compare, setCompare] = useState(false);
  const [left, setLeft] = useState("V04");
  const [right, setRight] = useState("V05");
  const car = cars.find((c) => c.id === selected)!;
  const reduced = useReducedMotion();
  function tabKey(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % cars.length;
    else if (e.key === "ArrowLeft")
      next = (index + cars.length - 1) % cars.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = cars.length - 1;
    else return;
    e.preventDefault();
    setSelected(cars[next].id);
    document.getElementById(`tab-${cars[next].id}`)?.focus();
  }
  return (
    <>
      <Heading
        label="The development archive"
        title="Built. Tested. Reconsidered."
        description="A record of the car’s evolution, with room for every model, every change and the evidence behind it."
      />
      <section className="evolution-shell raised">
        <div className="archive-toolbar">
          <div>
            <span className="small-label">Select an iteration</span>
            <div
              className="version-tabs"
              role="tablist"
              aria-label="Car version"
            >
              {cars.map((c, i) => (
                <Press
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-controls="car-panel"
                  aria-selected={selected === c.id}
                  tabIndex={selected === c.id ? 0 : -1}
                  onKeyDown={(e) => tabKey(e, i)}
                  className={selected === c.id ? "selected" : ""}
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                >
                  {c.id}
                  {selected === c.id && (
                    <motion.span
                      className="tab-underline"
                      layoutId="version-indicator"
                      transition={reduced ? { duration: 0 } : physics.spring}
                    />
                  )}
                </Press>
              ))}
            </div>
          </div>
          <Press
            className={`button secondary compare-button ${compare ? "pressed" : ""}`}
            aria-pressed={compare}
            onClick={() => setCompare(!compare)}
          >
            {compare ? <Minus size={17} /> : <Plus size={17} />}Compare versions
          </Press>
        </div>
        <div
          id="car-panel"
          role="tabpanel"
          aria-labelledby={`tab-${car.id}`}
          className="car-panel"
        >
          <div className="car-stage">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={car.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.14 }}
              >
                <CarMedia car={car} />
              </motion.div>
            </AnimatePresence>
            <div className="stage-caption">
              <span>{car.id} / MODEL ARCHIVE</span>
              <span>Original geometry only</span>
            </div>
          </div>
          <div className="car-details">
            <span className="version-tag">{car.id}</span>
            <h2>{car.title}</h2>
            <p>{car.note}</p>
            <div className="drag-readout">
              <span className="small-label">Recorded drag</span>
              <strong>
                {car.drag !== null ? (
                  <>
                    {car.drag.toFixed(3)}
                    <small>N</small>
                  </>
                ) : (
                  <span className="awaiting">Awaiting data</span>
                )}
              </strong>
              <span className="data-note">
                {car.drag !== null
                  ? "Supplied by the team · conditions not yet documented"
                  : "No verified figure supplied for this version"}
              </span>
            </div>
            <h3 className="small-label">Development notes</h3>
            <ul className="change-list">
              {car.changes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {car.modelUrl && (
              <a
                className="text-link"
                href={car.modelUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open model <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </section>
      {compare && (
        <Reveal className="comparison section">
          <div className="section-heading">
            <div>
              <Eyebrow>Side by side</Eyebrow>
              <h2>Compare the record.</h2>
            </div>
            <Press
              className="icon-button"
              aria-label="Close comparison"
              onClick={() => setCompare(false)}
            >
              <X />
            </Press>
          </div>
          <div className="comparison-grid">
            {[
              { id: left, set: setLeft, label: "Left comparison version" },
              { id: right, set: setRight, label: "Right comparison version" },
            ].map((slot) => {
              const c = cars.find((c) => c.id === slot.id)!;
              return (
                <div className="compare-card raised" key={slot.label}>
                  <label className="small-label">
                    {slot.label}
                    <select
                      aria-label={slot.label}
                      value={slot.id}
                      onChange={(e) => slot.set(e.target.value)}
                    >
                      {cars.map((c) => (
                        <option key={c.id}>{c.id}</option>
                      ))}
                    </select>
                  </label>
                  <CarMedia car={c} compact />
                  <h3>{c.title}</h3>
                  <p className="comparison-number">
                    {c.drag?.toFixed(3) ?? "—"}{" "}
                    <small>
                      {c.drag !== null ? "N" : "Result awaiting data"}
                    </small>
                  </p>
                  <p>{c.note}</p>
                </div>
              );
            })}
          </div>
          <p className="notice">
            These are recorded values, not a validated matched-condition
            comparison. Test speed, mesh, solver settings and uncertainty will
            be added with the original reports.
          </p>
        </Reveal>
      )}
      <section className="section">
        <div className="section-heading">
          <div>
            <Eyebrow>The longer view</Eyebrow>
            <h2>A timeline with room to grow.</h2>
          </div>
          <p className="narrow-copy">
            Select any version to explore its entry. More models will join the
            archive as the original files arrive.
          </p>
        </div>
        <div className="timeline">
          {cars.map((c, i) => (
            <Press
              className={`timeline-item ${selected === c.id ? "active" : ""}`}
              key={c.id}
              onClick={() => {
                setSelected(c.id);
                document
                  .querySelector(".evolution-shell")
                  ?.scrollIntoView({
                    behavior: reduced ? "auto" : "smooth",
                    block: "start",
                  });
              }}
            >
              <span className="timeline-dot" />
              <span className="small-label">ITERATION 0{i + 1}</span>
              <strong>{c.id}</strong>
              <span>
                {c.drag !== null
                  ? `${c.drag.toFixed(3)} N recorded drag`
                  : "Retained rear inflow splitters"}
              </span>
              <ArrowUpRight size={20} />
            </Press>
          ))}
        </div>
        <details className="evidence-details">
          <summary>
            About the engineering evidence <Plus size={18} />
          </summary>
          <p>
            The values shown here come directly from the team’s supplied notes.
            No extra drag, lift, speed or race performance figures have been
            inferred. The current livery render is not labelled as a specific
            version because that mapping has not been confirmed. Each archive
            entry can accept its own render and model link.
          </p>
        </details>
      </section>
    </>
  );
}
