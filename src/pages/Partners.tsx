import { useState } from "react";
import {
  ArrowUpRight,
  Mail,
  Instagram,
  Linkedin,
  Youtube,
  Check,
  Copy,
} from "lucide-react";
import { contact, sponsors } from "../content";
import { Press, Reveal } from "../motion";

import { asset, nav, ArrowLink, Eyebrow, Heading } from "../components/site";
function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <section id="contact" className="contact-section raised">
      <div>
        <h2>
          A conversation
          <br />
          starts here.
        </h2>
        <p>
          Interested in supporting the team, sharing expertise or asking about
          the car? Get in touch.
        </p>
      </div>
      <div className="contact-actions">
        <a
          className="button primary"
          href={`mailto:${contact.email}?subject=Hello%20Milano%20Racing`}
        >
          <Mail size={18} />
          Email the team
          <ArrowUpRight size={17} />
        </a>
        <div className="email-copy">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <Press
            className="icon-button"
            onClick={copy}
            aria-label="Copy team email"
          >
            {copied ? <Check size={17} /> : <Copy size={17} />}
          </Press>
        </div>
        <span className="copy-status" role="status">
          {copied
            ? "Email address copied"
            : copyError
              ? "Select and copy the email address above."
              : ""}
        </span>
        <div className="social-links">
          <a
            href={contact.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Milano Racing on Instagram"
          >
            <Instagram />
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="Milano Racing on LinkedIn"
          >
            <Linkedin />
          </a>
          <a
            href={contact.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label="Milano Racing on YouTube"
          >
            <Youtube />
          </a>
        </div>
      </div>
    </section>
  );
}
export default function Partners() {
  return (
    <>
      <Heading
        title="Good work takes support."
        description="The businesses supporting Milano Racing."
      />
      <section className="sponsor-feature raised">
        <div className="featured-logo">
          <img src={asset("hustle-hive.png")} alt="Hustle Hive" />
        </div>
        <div>
          <h2>Hustle Hive</h2>
          <p>{sponsors[0].description}</p>
          <a className="text-link" href={sponsors[0].url} target="_blank" rel="noreferrer">{sponsors[0].linkLabel} ↗</a>
        </div>
      </section>
      <div className="sponsor-grid">
        {sponsors.slice(1).map((s) => (
          <Reveal className="sponsor-card raised" key={s.name}>
            <div>
              <img src={asset(s.image)} alt={s.name} loading="lazy" />
            </div>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <a className="text-link" href={s.url} target="_blank" rel="noreferrer">{s.linkLabel} ↗</a>
          </Reveal>
        ))}
      </div>
      <section className="partner-note section">
        <h2>
          Help the next idea
          <br />
          become something real.
        </h2>
        <p>
          We welcome conversations about practical support, resources and
          expertise. Talk to the team about how you could contribute.
        </p>
      </section>
      <Contact />
    </>
  );
}
