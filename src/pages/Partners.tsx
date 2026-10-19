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
        <Eyebrow>Let’s build something together</Eyebrow>
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
        label="The people who back the team"
        title="Good work takes support."
        description="Our partners help make this student engineering project possible. Thank you for being part of Milano Racing."
      />
      <section className="sponsor-feature raised">
        <div className="featured-logo">
          <img src={asset("hustle-hive.png")} alt="Hustle Hive" />
        </div>
        <div>
          <Eyebrow>Team sponsor</Eyebrow>
          <h2>Hustle Hive</h2>
          <p>
            A confirmed Milano Racing sponsor, proudly featured on our team
            jersey and car livery.
          </p>
          <span className="small-label">
            Thank you for supporting our journey.
          </span>
        </div>
      </section>
      <div className="sponsor-grid">
        {sponsors.slice(1).map((s) => (
          <Reveal className="sponsor-card raised" key={s.name}>
            <div>
              <img src={asset(s.image)} alt={s.name} loading="lazy" />
            </div>
            <span className="small-label">Team sponsor</span>
            <h3>{s.name}</h3>
          </Reveal>
        ))}
      </div>
      <section className="partner-note section">
        <Eyebrow>More than a logo</Eyebrow>
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
