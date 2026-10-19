import publicEngineering from "./data/public-engineering.json";
export const contact = {
  email: "milanoracing10@gmail.com",
  instagram: "https://www.instagram.com/milanoracing_/",
  linkedin: "https://www.linkedin.com/company/142975934/",
  youtube: "https://www.youtube.com/@MilanoRacing",
};
// Public illustrative dataset. Competition evidence remains in the engineering portfolio.
export const cars = publicEngineering.versions;
export { publicEngineering };
export type Person = {
  id: string;
  name: string;
  role: string;
  image: string;
  contribution: string;
  imagePosition?: string;
  supplied?: boolean;
  number?: string;
  source: string;
  quote?: string;
  introduction?: string;
  highlights?: string[];
};
export const people: Person[] = [
  {
    id: "raahi",
    quote: "Impossible is just a problem that hasn't met the right mind.",
    name: "Raahi Chheda",
    number: "01",
    role: "Team Leader",
    image: "raahi-portrait.jpg",
    contribution: "Team introduction from Milano Racing’s Instagram.",
    source: "https://www.instagram.com/milanoracing_/p/DclThrdmjCN/",
  },
  {
    id: "ajinkya",
    quote: "Fueled by caffeine and CFD",
    name: "Ajinkya Velukar",
    number: "16",
    role: "Lead Engineer",
    image: "ajinkya-portrait.jpg",
    contribution: "Team introduction from Milano Racing’s Instagram.",
    source: "https://www.instagram.com/milanoracing_/p/DclTqZcmuvZ/",
  },
  {
    id: "geet",
    quote: "I'm honestly always trying to get faster even though its not a race",
    name: "Geet Bathamsetty",
    number: "33",
    role: "Aerodynamicist",
    image: "geet-portrait.jpg",
    contribution: "Team introduction from Milano Racing’s Instagram.",
    source: "https://www.instagram.com/milanoracing_/p/DclTXIkGi5F/",
  },
  {
    id: "niteesh",
    quote: "Built on earth, Bound for galaxies", name: "Niteesh Kumar", role: "Resource Lead", number: "12",
    image: "niteesh-portrait.jpg", supplied: true,
    contribution: "Resource Lead, confirmed in the supplied team introduction.", source: "https://www.instagram.com/p/DclTLqAmk87/",
  },
  {
    id: "gayatri",
    quote: "Chase both, the car and the vision", name: "Gayatri Pandkar", role: "Designer", number: "10",
    image: "gayatri-portrait.jpg", supplied: true,
    contribution: "Designer, confirmed in the supplied team introduction.", source: "https://www.instagram.com/p/DclTDU0mnYR/",
  },
  {
    id: "ashmitha", name: "Ashmitha Pitani", role: "Outreach Lead", number: "25",
    image: "ashmitha-portrait.jpg", supplied: true,
    contribution: "Outreach Lead, confirmed in the supplied team introduction.", source: "https://www.instagram.com/p/DclS60Bmpn3/",
  },
];
export const sponsors = [
  { name: "Hustle Hive", image: "hustle-hive.png", description: "Hustle Hive helps job seekers manage applications with AI tools and human supervision. Its service includes tailored resumes, application tracking and progress reports.", url: "https://hustlehive.ai/", linkLabel: "Visit Hustle Hive" },
  { name: "NPE Print Communications", image: "npe.png", description: "A Singapore printing company producing commercial print, custom packaging and large-format graphics. NPE combines design, digital printing and production services.", url: "https://npeprint.com/", linkLabel: "Visit NPE" },
  { name: "Enermax Synergy (SEA)", image: "enermax.png", description: "Based in Singapore, Enermax Synergy (SEA) works in engineering design and consultancy for energy management and clean-energy systems.", url: "https://www.companies.sg/business/201818407R/ENERMAX-SYNERGY-SEA-PTE-LTD-", linkLabel: "Company profile" },
  { name: "Brinda’s", image: "brindas.png", description: "Brinda’s is a restaurant and caterer in Bukit Merah, Singapore. It serves North and South Indian food and provides island-wide delivery and catering for events.", url: "https://www.brindas.com.sg/", linkLabel: "Visit Brinda’s" },
  { name: "Axis", image: "axis.png", description: "Axis Container Lines connects businesses through land, sea and air freight. Its network includes Axis Logistics & Services in Singapore.", url: "https://www.axiscontainerlines.com/", linkLabel: "Visit Axis" },
];
export const posts = [
  {
    id: "livery",
    category: "Design",
    title: "A new look. Under wraps.",
    image: "",
    caption: "New Milano Racing livery. Coming soon.",
    excerpt: "Our next livery. Revealed on release day.",
    body: [],
  },
  {
    id: "jersey",
    category: "Team",
    title: "Our identity, in the details.",
    image: "jersey-front-recreated.png",
    caption: "Milano Racing team kit",
    excerpt: "Explore our kit from every angle and personalise the back.",
    body: [
      "Dragon artwork across the body, blue trim and orange side panels. Our partners’ marks sit on the chest and sleeves.",
      "The dragon graphic, contrasting side panels and team mark give the kit its own character. Rotate the garment in the team kit viewer to inspect its front, back and sleeve details.",
    ],
  },
  {
    id: "drag-log",
    category: "Engineering",
    title: "Understanding the airflow.",
    image: "03_convergence.svg",
    caption: "Illustrative CFD convergence chart",
    excerpt: "Drag, pressure and convergence: a look inside the design process.",
    body: [
      "Aerodynamic development connects shape, airflow and resistance. Our public charts illustrate how those relationships can be explored across a series of car versions.",
      "Compare drag and mass, explore a wing-angle sweep, or follow how a simulation settles over its iterations. These are illustrative datasets; competition statistics and detailed design evidence are presented in our engineering portfolio.",
    ],
  },
];
