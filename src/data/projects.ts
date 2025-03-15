import { Project, Provider, CircleAffinity } from "../types";

export const domains = [
  {
    id: "discovery",
    name: "Discovery Domain",
    color: "#4169E1",
    description:
      "Begin your journey through accessible media and technology, exploring spiritual concepts at your own pace.",
  },
  {
    id: "connection",
    name: "Connection Domain",
    color: "#9932CC",
    description:
      "Connect with fellow seekers and experienced guides in safe, nurturing environments designed for authentic spiritual exploration.",
  },
  {
    id: "wisdom",
    name: "Wisdom Domain",
    color: "#FF6B6B",
    description:
      "Access profound spiritual teachings and timeless wisdom when you're ready to deepen your understanding.",
  },
] as const;

export const providers: Provider[] = [
  {
    id: "urantia-foundation",
    name: "Urantia Foundation",
    description:
      "The original publisher and guardian of The Urantia Book, dedicated to disseminating its teachings worldwide.",
    color: "#2563EB",
  },
  {
    id: "uai",
    name: "Urantia Association International",
    description:
      "A global network focused on in-depth study and dissemination of The Urantia Book teachings.",
    color: "#059669",
  },
  {
    id: "cfu",
    name: "The Center for Unity",
    description:
      "Creating innovative platforms and communities for spiritual seekers in the digital age.",
    color: "#7C3AED",
  },
  {
    id: "fellowship",
    name: "Urantia Book Fellowship",
    description:
      "Supporting study groups and fostering community among readers of The Urantia Book.",
    color: "#DC2626",
  },
  {
    id: "derek-samaras",
    name: "Derek Samaras",
    description:
      "A spiritual seeker and guide who shares his journey and insights on spiritual topics.",
    color: "#C026D3",
  },
  {
    id: "jim-watkins",
    name: "Jim Watkins",
    description:
      "A spiritual seeker and guide who shares his journey and insights on spiritual topics.",
    color: "#D97706",
  },
  {
    id: "jan-herca",
    name: "Jan Herca",
    description:
      "A spiritual seeker and guide who shares his journey and insights on spiritual topics.",
    color: "#D97706",
  },
  {
    id: "kelson-adams",
    name: "Kelson Adams",
    description:
      "A spiritual seeker and guide who shares his journey and insights on spiritual topics.",
    color: "#D97706",
  },
];

// Helper function to create a project with default values
const createProject = (params: {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  affinities: CircleAffinity;
  position?: { x: number; y: number };
  size?: number;
  status: "development" | "active" | "planning";
  tags: string[];
  providerId: string;
  seekerFriendliness: number;
  websiteUrl?: string;
}): Project => ({
  size: 1.0, // Default size if not specified
  ...params,
});

export const projects: Project[] = [
  createProject({
    id: "divine-within-podcast",
    name: "The Divine Within Podcast",
    shortDescription:
      "Authentic conversations exploring spiritual journeys through real stories of transformation",
    longDescription:
      "A weekly podcast featuring deep conversations with seekers, guides, and wisdom-keepers who share their experiences of discovering and nurturing their connection with the divine.",
    position: { x: 0.3, y: 0.4 },
    affinities: { discovery: 0.6, connection: 0.1, wisdom: 0.3 },
    size: 1.5,
    status: "development",
    tags: ["media", "storytelling", "outreach"],
    providerId: "cfu",
    seekerFriendliness: 5,
    websiteUrl: "",
  }),

  createProject({
    id: "circles-of-trust",
    name: "Circles of Trust",
    shortDescription:
      "Small groups of seekers supporting each other's spiritual growth in safe, nurturing environments",
    longDescription:
      "Carefully facilitated small groups where spiritual seekers can share their journey, ask deep questions, and support each other's growth in a confidential, nurturing space.",
    position: { x: 0.5, y: 0.6 },
    affinities: { discovery: 0.1, connection: 0.8, wisdom: 0.1 },
    size: 1.2,
    status: "planning",
    tags: ["community", "support", "discussion"],
    providerId: "cfu",
    seekerFriendliness: 5,
    websiteUrl: "",
  }),

  createProject({
    id: "ub-tutor",
    name: "UB Tutor",
    shortDescription:
      "AI-powered spiritual exploration tool helping seekers engage with profound teachings at their own pace",
    longDescription:
      "An innovative platform combining artificial intelligence with spiritual wisdom, allowing seekers to explore deep teachings through natural conversation and personalized guidance.",
    position: { x: 0.7, y: 0.5 },
    affinities: { discovery: 0.3, connection: 0.2, wisdom: 0.5 },
    size: 1.8,
    status: "active",
    tags: ["technology", "AI", "learning"],
    providerId: "cfu",
    seekerFriendliness: 4,
    websiteUrl: "https://urantiabooktutor.com",
  }),

  createProject({
    id: "urantiapedia",
    name: "UrantiaPedia",
    shortDescription: "A collaborative knowledge hub for exploring and sharing insights from The Urantia Book",
    longDescription: 
      "UrantiaPedia is a comprehensive wiki platform dedicated to publishing, sharing, and collaborating on " +
      "Urantia Book-related content. It serves as an accessible gateway to understanding the book's profound " +
      "teachings about humanity's origin, history, and destiny. The platform helps readers explore answers to " +
      "life's deepest questions about God, the inhabited universe, and Jesus's life and teachings. Through " +
      "community collaboration, it provides study aids, commentary, and resources that support both new readers " +
      "and longtime students in their spiritual journey.",
    affinities: { discovery: 0.4, connection: 0.1, wisdom: 0.5 },
    status: "active",
    tags: ["wiki", "research", "collaboration", "study", "archive"],
    providerId: "jan-herca",
    seekerFriendliness: 3,
    websiteUrl: "https://urantiapedia.org/en/home",
  }),

  createProject({
    id: "urantiahub",
    name: "Urantia Hub",
    shortDescription: "Revolutionary ideas for life's biggest questions through an accessible digital platform",
    longDescription: 
      "Discover the Urantia Papers - a unique revelation that bridges lost history with modern science, " +
      "offering unprecedented insights into our origin, purpose, and destiny. This digital platform makes " +
      "these profound teachings accessible through modern interfaces, study tools, and community features.",
    affinities: { discovery: 0.5, connection: 0, wisdom: 0.5 },
    status: "development",
    tags: ["platform", "community", "learning", "technology"],
    providerId: "kelson-adams",
    seekerFriendliness: 4,
    websiteUrl: "https://urantiahub.org",
  }),

  createProject({
    id: "pure-wisdom",
    name: "Wisdom Library",
    shortDescription: "Curated collection of spiritual teachings",
    longDescription:
      "A comprehensive digital library of spiritual teachings, wisdom traditions, and sacred texts.",
    affinities: { discovery: 0.0, connection: 0.0, wisdom: 1.0 },
    status: "planning",
    tags: ["content", "learning"],
    providerId: "fellowship",
    seekerFriendliness: 3,
    websiteUrl: "https://ubfellowship.org/library",
  }),

  createProject({
    id: "balanced-project",
    name: "Spiritual Hub",
    shortDescription: "Integrated platform for spiritual growth",
    longDescription:
      "A comprehensive platform combining learning resources, community features, and wisdom teachings.",
    affinities: { discovery: 0.33, connection: 0.34, wisdom: 0.33 },
    size: 1.4,
    status: "development",
    tags: ["platform", "community", "learning"],
    providerId: "derek-samaras",
    seekerFriendliness: 4,
    websiteUrl: "https://spiritualhub.org",
  }),

  createProject({
    id: "discovery-connection",
    name: "Group Exploration",
    shortDescription: "Guided group spiritual exploration program",
    longDescription:
      "A structured program combining self-paced learning with group discussions and shared experiences.",
    affinities: { discovery: 0.5, connection: 0.5, wisdom: 0.0 },
    size: 1.2,
    status: "planning",
    tags: ["program", "community"],
    providerId: "derek-samaras",
    seekerFriendliness: 5,
  }),

  createProject({
    id: "connection-wisdom",
    name: "Wisdom Circles",
    shortDescription: "Small groups studying spiritual teachings",
    longDescription:
      "Intimate groups focused on deeply studying and discussing spiritual teachings together.",
    affinities: { discovery: 0.0, connection: 0.5, wisdom: 0.5 },
    size: 1.3,
    status: "development",
    tags: ["study", "community"],
    providerId: "derek-samaras",
    seekerFriendliness: 3,
  }),

  createProject({
    id: "discovery-wisdom",
    name: "Sacred Learning",
    shortDescription: "Interactive courses on spiritual teachings",
    longDescription:
      "Self-paced interactive courses exploring deep spiritual teachings with multimedia content.",
    affinities: { discovery: 0.5, connection: 0.0, wisdom: 0.5 },
    size: 1.1,
    status: "planning",
    tags: ["education", "content"],
    providerId: "jim-watkins",
    seekerFriendliness: 4,
  }),

  createProject({
    id: "overlap-test-1",
    name: "Community Portal",
    shortDescription: "Online community platform",
    longDescription:
      "A digital space for spiritual seekers to connect and share their journey.",
    affinities: { discovery: 0.7, connection: 0.2, wisdom: 0.1 },
    status: "planning",
    tags: ["community", "technology"],
    providerId: "cfu",
    seekerFriendliness: 5,
    websiteUrl: "https://community.divinewithinfoundation.org",
  }),

  createProject({
    id: "overlap-test-2",
    name: "Spiritual Network",
    shortDescription: "Social network for spiritual seekers",
    longDescription:
      "A dedicated social platform for connecting spiritual seekers and sharing experiences.",
    affinities: { discovery: 0.7, connection: 0.2, wisdom: 0.1 },
    status: "development",
    tags: ["community", "technology"],
    providerId: "fellowship",
    seekerFriendliness: 4,
  }),
];
