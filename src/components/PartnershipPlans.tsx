import { Reveal } from "../motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// Transcribed from page 4, including its printed prices and cross-tier references.
export const partnershipPlans = [
  { name: "Signature", price: "$100–350", includes: "Everything in Essence, plus", benefits: ["Logo placement on team apparel", "Logo inclusion on selected printed materials", "Placement on our pit display sponsor panel", "3+ sponsor acknowledgement posts or stories during the campaign"] },
  { name: "Essence", price: "$350–600", includes: "", benefits: ["Logo placement on our website", "Recognition across our digital portfolio where applicable", "Social media acknowledgement", "Inclusion in our sponsor acknowledgement communications"] },
  { name: "Aurum", price: "$600–850", includes: "Everything in Signature, plus", benefits: ["Prominent logo placement on our race car", "Priority placement across pit display materials", "Recognition in selected team presentations", "Inclusion in competition day and team photography", "Acknowledgement in our end-of-season performance summary"] },
  { name: "Legacy", price: "$850+", includes: "Everything in Prestige, plus", benefits: ["Largest available sponsor logo placement", "Priority branding across Milano Racing materials", "Recognition in major team announcements and presentations", "Dedicated feature highlighting your organisation", "Detailed end-of-season impact and performance report"] },
];
const inKind = ["Manufacturing and machining support", "Materials and components", "Software licences", "Transportation and logistics", "Technical expertise and mentorship"];
const enquiry = (name: string) => `/partners?plan=${encodeURIComponent(name)}#contact`;

export default function PartnershipPlans() {
  return <section className="partnership-plans section" id="partnerships">
    <Reveal className="section-heading"><h2>Find your place<br/>on the team.</h2><p>Support the next stage of Milano Racing.</p></Reveal>
    <div className="plans-grid">{partnershipPlans.map((plan, index) => <Reveal as="article" delay={(index % 2) * .06} className="plan-card raised" key={plan.name}>
      <h3>{plan.name}</h3><p className="plan-price">{plan.price}</p>
      {plan.includes && <p className="plan-includes">{plan.includes}</p>}
      <ul>{plan.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>
      <Link className="button secondary" to={enquiry(plan.name)}>Discuss {plan.name}<ArrowUpRight size={17}/></Link>
    </Reveal>)}</div>
    <Reveal as="article" className="in-kind-plan">
      <div><h3>Prestige</h3><p className="plan-price">In kind</p><p>Bring your resources, expertise or services to the project.</p><Link className="text-link" to={enquiry("Prestige")}>Talk about in-kind support <ArrowUpRight size={18}/></Link></div>
      <ul>{inKind.map(item => <li key={item}>{item}</li>)}</ul>
    </Reveal>
  </section>;
}
