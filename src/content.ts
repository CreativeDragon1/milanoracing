export const contact = {
  email: "milanoracing10@gmail.com",
  instagram: "https://www.instagram.com/milanoracing_/",
  linkedin: "https://www.linkedin.com/company/142975934/",
  youtube: "https://www.youtube.com/@MilanoRacing",
};
export type Car = {
  id: string;
  title: string;
  drag: number | null;
  note: string;
  changes: string[];
  image: string | null;
  modelUrl: string | null;
};
// Add genuine version-specific renders and exported model links here as they arrive.
export const cars: Car[] = [
  {
    id: "V04",
    title: "The early benchmark",
    drag: 0.5,
    note: "An early recorded drag result in the development archive.",
    changes: ["Design notes awaiting the original model and engineering log."],
    image: null,
    modelUrl: null,
  },
  {
    id: "V05",
    title: "A lower recorded drag",
    drag: 0.449,
    note: "The lowest supplied drag value among V04, V05 and V06.",
    changes: [
      "Geometry changes awaiting the original model and engineering log.",
    ],
    image: null,
    modelUrl: null,
  },
  {
    id: "V06",
    title: "The next iteration",
    drag: 0.455,
    note: "A further recorded iteration in the car development process.",
    changes: [
      "Geometry changes awaiting the original model and engineering log.",
    ],
    image: null,
    modelUrl: null,
  },
  {
    id: "V10",
    title: "Retaining rear inflow",
    drag: null,
    note: "This version retained rear inflow splitters.",
    changes: [
      "Rear inflow splitters retained.",
      "Further changes and aerodynamic results awaiting source files.",
    ],
    image: null,
    modelUrl: null,
  },
];
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
  introduction?: string;
  highlights?: string[];
};
export const people: Person[] = [
  {
    id: "raahi",
    name: "Raahi Chheda",
    number: "01",
    role: "Team Leader",
    image: "raahi-current.jpg",
    contribution: "Team introduction from Milano Racing’s Instagram.",
    source: "https://www.instagram.com/milanoracing_/p/DclThrdmjCN/",
  },
  {
    id: "ajinkya",
    name: "Ajinkya Velukar",
    number: "16",
    role: "Lead Engineer",
    image: "ajinkya-current.jpg",
    contribution: "Team introduction from Milano Racing’s Instagram.",
    source: "https://www.instagram.com/milanoracing_/p/DclTqZcmuvZ/",
  },
  {
    id: "geet",
    name: "Geet Bathamsetty",
    number: "33",
    role: "Aerodynamicist",
    image: "geet-current.jpg",
    contribution: "Team introduction from Milano Racing’s Instagram.",
    source: "https://www.instagram.com/milanoracing_/p/DclTXIkGi5F/",
  },
  {
    id: "niteesh", name: "Niteesh Kumar", role: "Resource Lead", number: "12",
    image: "team-introductions.png", imagePosition: "0% center", supplied: true,
    contribution: "Resource Lead, confirmed in the supplied team introduction.", source: "",
  },
  {
    id: "gayatri", name: "Gayatri Pandkar", role: "Designer", number: "10",
    image: "team-introductions.png", imagePosition: "50% center", supplied: true,
    contribution: "Designer, confirmed in the supplied team introduction.", source: "",
  },
  {
    id: "ashmitha", name: "Ashmitha Pitani", role: "Outreach Lead", number: "25",
    image: "team-introductions.png", imagePosition: "100% center", supplied: true,
    contribution: "Outreach Lead, confirmed in the supplied team introduction.", source: "",
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
    title: "A closer look at our current livery.",
    image: "current-car.webp",
    caption: "Team-supplied car render",
    excerpt:
      "The supplied render brings the miniature car and partner branding together.",
    body: [
      "This is the current livery render supplied by Milano Racing. It shows the actual miniature STEM Racing car, including the team’s partner branding.",
      "The render has not been assigned a version number. Version-specific models and renders will be added to the Car Evolution archive when the team supplies them.",
    ],
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
    title: "Three iterations. Three recorded values.",
    image: null,
    caption: "Team-supplied engineering notes",
    excerpt:
      "V04, V05 and V06 form the first entries in our aerodynamic record.",
    body: [
      "The team has supplied drag values of 0.500 N for V04, 0.449 N for V05 and 0.455 N for V06.",
      "These values are preserved as supplied. Test speed, mesh settings, solver setup and uncertainty have not yet been provided. They should not be interpreted as a validated comparison under matched conditions.",
      "The evolution page provides version selection and a side-by-side comparison. Original CAD models and test records can be attached as the archive grows.",
    ],
  },
];
