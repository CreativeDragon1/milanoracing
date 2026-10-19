import { useState } from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { people } from "../content";
import { Press, Reveal } from "../motion";
import JerseyViewer from "../components/JerseyViewer";
import TeamPortrait from "../components/TeamPortrait";

import { Heading, SingaporeFlag } from "../components/site";
import "./Team.css";

export default function Team() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <>
      <Heading
        title="Different minds. One team."
        description={<>Six people working together to compete in STEM Racing.<span className="team-location">Based in <span className="location-inline">Singapore <SingaporeFlag/></span>.</span></>}
      />
      <section className="team-grid" aria-label="Meet the Milano Racing team">
        {people.map((person, index) => (
          <Reveal as="article" className="person raised" aria-labelledby={`member-${person.id}`} key={person.id} delay={(index % 3) * .055}>
            <TeamPortrait person={person}/>
            <div className="person-copy">
              <span className="small-label">{person.role}</span>
              <h2 id={`member-${person.id}`}>{person.name}</h2>
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
      </section>
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
