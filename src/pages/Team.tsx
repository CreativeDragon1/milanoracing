import { useState } from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { contact, people } from "../content";
import { Press, Reveal } from "../motion";
import JerseyViewer from "../components/JerseyViewer";

import { asset, nav, ArrowLink, Eyebrow, Heading, SingaporeFlag } from "../components/site";
export default function Team() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <>
      <Heading
        label="The people behind the project"
        title="Different minds. One team."
        description={<>Six people bringing design, engineering and communication together. Based in Singapore <SingaporeFlag/>.</>}
      />
      <div className="team-grid">
        {people.map((person, i) => (
          <Reveal className="person raised" key={person.id}>
            <div className="portrait">
              <img src={asset(person.image)} alt={`${person.name} — ${person.role}`} loading="lazy" style={person.imagePosition ? {objectFit:"cover",objectPosition:person.imagePosition} : undefined} />
              <span className="person-number">0{i + 1}</span>
            </div>
            <div className="person-copy">
              <span className="small-label">{person.role}</span>
              <h2>{person.name}</h2>
              {person.supplied ? null : <a
                className="text-link"
                href={person.source}
                target="_blank"
                rel="noreferrer"
              >
                View introduction <ArrowUpRight size={15} />
              </a>}
              <Press
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
              </Press>
              {expanded === person.id && (
                <div id={`profile-${person.id}`} className="profile-expanded">
                  {person.introduction ? (
                    <>
                      <p>{person.introduction}</p>
                      {person.highlights?.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </>
                  ) : (
                    <>
                      <strong>A little more to come.</strong>
                      <p>
                        Personal introduction and individual project highlights
                        awaiting the team’s words.
                      </p>
                      <span className="placeholder-label">
                        Editable introduction placeholder
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
      <section className="jersey-section kit-section section" id="team-kit">
        <Reveal className="jersey-copy">
          <Eyebrow>Made to be seen up close</Eyebrow>
          <h2>Our identity.<br />From every angle.</h2>
          <p>Turn the kit around. Look closer at the dragon motif, our team mark and the partner details that make it ours.</p>
        </Reveal>
        <JerseyViewer />
      </section>
    </>
  );
}
