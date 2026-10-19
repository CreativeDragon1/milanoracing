import { useState } from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { contact, people } from "../content";
import { Press, Reveal } from "../motion";
import JerseyViewer from "../components/JerseyViewer";
import TeamPortrait from "../components/TeamPortrait";

import { asset, nav, ArrowLink, Eyebrow, Heading, SingaporeFlag } from "../components/site";
export default function Team() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <>
      <Heading
        title="Different minds. One team."
        description={<>Six people working together to compete in STEM Racing.<span className="team-location">Based in <span className="location-inline">Singapore <SingaporeFlag/></span>.</span></>}
      />
      <div className="team-grid">
        {people.map((person) => (
          <Reveal className="person raised" key={person.id}>
            <TeamPortrait person={person}/>
            <div className="person-copy">
              <span className="small-label">{person.role}</span>
              <h2>{person.name}</h2>
              {person.source && <a
                className="text-link"
                href={person.source}
                target="_blank"
                rel="noreferrer"
              >
                View introduction <ArrowUpRight size={15} />
              </a>}
              {person.introduction && <Press
                className="profile-toggle"
                aria-expanded={expanded === person.id}
                aria-controls={`profile-${person.id}`}
                onClick={() =>
                  setExpanded(expanded === person.id ? null : person.id)
                }
              >
                Member introduction{" "}
                {expanded === person.id ? (
                  <Minus size={17} />
                ) : (
                  <Plus size={17} />
                )}
              </Press>}
              {expanded === person.id && (
                <div id={`profile-${person.id}`} className="profile-expanded">
                  <p>{person.introduction}</p>
                  {person.highlights?.map(item => <p key={item}>{item}</p>)}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
      <section className="jersey-section kit-section section" id="team-kit">
        <Reveal className="jersey-copy">
          <h2>Our identity.<br />From every angle.</h2>
          <p>Turn the kit around. Look closer at the dragon motif, our team mark and the partner details that make it ours.</p>
        </Reveal>
        <JerseyViewer />
      </section>
    </>
  );
}
