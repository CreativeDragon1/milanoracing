import PartnershipPlans from "../components/PartnershipPlans";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Press } from "../motion";

import { Heading } from "../components/site";
import SponsorLogo from "../components/SponsorLogo";
function Contact() {
  const [searchParams] = useSearchParams();
  const requestedPlan = searchParams.get("plan");
  const plan = ["Signature", "Essence", "Aurum", "Legacy", "Prestige"].find(name => name === requestedPlan);
  const subject = plan ? `${plan} partnership enquiry` : "Hello Milano Racing";
  const body = plan
    ? `Hello Milano Racing,\n\nI'd like to discuss the ${plan} partnership.\n\nOrganisation:\nHow we would like to support the team:\n`
    : "Hello Milano Racing,\n\n";
  const gmail = `https://mail.google.com/mail/?${new URLSearchParams({ view: "cm", fs: "1", to: contact.email, su: subject, body })}`;
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
        {plan && <p className="contact-enquiry" role="status">Let’s talk about {plan}.</p>}
        <a
          className="button primary"
          href={gmail}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Mail size={18} />
          Open Gmail
          <ArrowUpRight size={17} />
        </a>
        <a className="button secondary contact-email-app" href={mailto}>Use another email app <ArrowUpRight size={17} /></a>
        <div className="email-copy">
          <a href={mailto}>{contact.email}</a>
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
        description="The businesses supporting Milano Racing as we compete in STEM Racing."
      />
      <section className="partners-equal-grid" aria-label="Our sponsors">
        {sponsors.map((s) => (
          <article className="partner-equal-card raised" key={s.name}>
            <div className="partner-logo-stage"><SponsorLogo image={s.image} name={s.name} /></div>
            <h2>{s.name}</h2>
            <p>{s.description}</p>
            <a className="text-link" href={s.url} target="_blank" rel="noreferrer">
              {s.linkLabel} <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </article>
        ))}
      </section>
      <PartnershipPlans />
      <Contact />
    </>
  );
}
