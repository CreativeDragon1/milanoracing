import { useState, type CSSProperties } from "react";
import { Quote, X } from "lucide-react";
import type { Person } from "../content";
import { asset } from "../assets";
import "./TeamPortrait.css";

export default function TeamPortrait({ person }: { person: Person }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [focused, setFocused] = useState(false);
  const open = hovered || pinned || focused;
  const photo = <img src={asset(person.image)} alt={`${person.name} — ${person.role}`} loading="lazy" width="1080" height="1350" />;
  if (!person.quote) return <div className="portrait">{photo}</div>;
  return <button type="button" className={`portrait quote-portrait ${open ? "is-open" : ""}`}
    aria-label={`${person.name}'s quote`} aria-expanded={open} aria-controls={`quote-${person.id}`}
    onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
    onPointerLeave={() => setHovered(false)}
    onFocus={event => setFocused(event.currentTarget.matches(":focus-visible"))}
    onBlur={() => { setFocused(false); setPinned(false); }}
    onClick={() => { setPinned(!open); setFocused(false); setHovered(false); }}
    onKeyDown={event => { if (event.key === "Escape") { setHovered(false); setPinned(false); setFocused(false); } }}>
    {photo}
    <span className="quote-cue" aria-hidden="true">{open ? <X size={18}/> : <Quote size={18}/>}</span>
    <span className="portrait-quote" id={`quote-${person.id}`} aria-hidden={!open}>
      <span className="quote-rule" aria-hidden="true"/>
      <span className="quote-words">{person.quote.split(" ").map((word, i, words) => <span key={i} style={{ "--word-delay": `${Math.min(i * 18, 240)}ms` } as CSSProperties}>{i === 0 ? "“" : ""}{word}{i === words.length - 1 ? "”" : " "}</span>)}</span>
    </span>
  </button>;
}
