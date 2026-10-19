import { contact } from "../content";
import { ArrowUpRight } from "lucide-react";

// Transcribed from page 4, including its printed prices and cross-tier references.
export const partnershipPlans = [
  { name: "Signature", price: "$100–350", includes: "Everything in Essence, plus", benefits: ["Logo placement on team apparel", "Logo inclusion on selected printed materials", "Placement on our pit display sponsor panel", "3+ sponsor acknowledgement posts or stories during the campaign"] },
  { name: "Essence", price: "$350–600", includes: "", benefits: ["Logo placement on our website", "Recognition across our digital portfolio where applicable", "Social media acknowledgement", "Inclusion in our sponsor acknowledgement communications"] },
  { name: "Aurum", price: "$600–850", includes: "Everything in Signature, plus", benefits: ["Prominent logo placement on our race car", "Priority placement across pit display materials", "Recognition in selected team presentations", "Inclusion in competition day and team photography", "Acknowledgement in our end-of-season performance summary"] },
  { name: "Legacy", price: "$850+", includes: "Everything in Prestige, plus", benefits: ["Largest available sponsor logo placement", "Priority branding across Milano Racing materials", "Recognition in major team announcements and presentations", "Dedicated feature highlighting your organisation", "Detailed end-of-season impact and performance report"] },
];
const inKind = ["Manufacturing and machining support", "Materials and components", "Software licences", "Transportation and logistics", "Technical expertise and mentorship"];
const enquiry = (name: string) => `mailto:${contact.email}?subject=${encodeURIComponent(`${name} partnership enquiry`)}&body=${encodeURIComponent(`Hello Milano Racing,\n\nI'd like to discuss the ${name} partnership.\n\nOrganisation:\nHow we would like to support the team:\n`)}`;

export default function PartnershipPlans() {
  return <section className="partnership-plans section" id="partnerships">
    <div className="section-heading"><h2>Find your place<br/>on the team.</h2><p>Support the next stage of Milano Racing.</p></div>
    <div className="plans-grid">{partnershipPlans.map(plan => <article className="plan-card raised" key={plan.name}>
      <h3>{plan.name}</h3><p className="plan-price">{plan.price}</p>
      {plan.includes && <p className="plan-includes">{plan.includes}</p>}
      <ul>{plan.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>
      <a className="button secondary" href={enquiry(plan.name)}>Discuss {plan.name}<ArrowUpRight size={17}/></a>
    </article>)}</div>
    <article className="in-kind-plan">
      <div><h3>Prestige</h3><p className="plan-price">In kind</p><p>Bring your resources, expertise or services to the project.</p><a className="text-link" href={enquiry("Prestige")}>Talk about in-kind support <ArrowUpRight size={18}/></a></div>
      <ul>{inKind.map(item => <li key={item}>{item}</li>)}</ul>
    </article>
  </section>;
}
