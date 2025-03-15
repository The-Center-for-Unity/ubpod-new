// Base interfaces for repeated patterns
interface BaseSection {
  title: string;
  description: string;
}

interface PointSection extends BaseSection {
  points: string[];
}

// Main content interfaces
interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  callToAction: string;
}

interface SectionContent extends BaseSection {
  sections: PointSection[];
}

interface TrustIndicator {
  title: string;
  description: string;
}

interface CTAContent extends BaseSection {
  buttonText: string;
  contactEmail: string;
  trustIndicators: TrustIndicator[];
}

// Main content structure type
interface SCContentSimple {
  hero: HeroContent;
  problem: SectionContent;
  vision: SectionContent;
  development: SectionContent;
  cta: CTAContent;
}

// Content implementation
export const scContentSimple: SCContentSimple = {
  hero: {
    title: "Sacred Companions",
    subtitle: "Supporting Authentic Spiritual Journeys",
    description: "Many people today seek spiritual meaning but feel disconnected from traditional institutions. They need authentic guidance without dogma, safe spaces to explore spiritual questions, and support from someone who has walked a similar path.",
    callToAction: "Learn More"
  },
  problem: {
    title: "The Problem We're Solving",
    description: "A growing need for authentic spiritual guidance that isn't tied to specific traditions",
    sections: [
      {
        title: "What Seekers Need",
        description: "Essential support for spiritual exploration",
        points: [
          "Authentic guidance without requiring specific beliefs",
          "Safe spaces to explore spiritual questions",
          "Support from experienced fellow travelers",
          "Help navigating their journey without dependency",
          "Practical spiritual wisdom for daily life"
        ]
      },
      {
        title: "Current Challenges",
        description: "Gaps in traditional spiritual support",
        points: [
          "Disconnection from traditional religious institutions",
          "Lack of safe spaces for spiritual exploration",
          "Need for guidance without dogma",
          "Desire for authentic spiritual connection",
          "Search for practical spiritual wisdom"
        ]
      }
    ]
  },
  vision: {
    title: "Our Innovation: The Sacred Companion Model",
    description: "A new approach to spiritual guidance that's both personal and protected",
    sections: [
      {
        title: "The Sacred Companion Role",
        description: "Supporting as a spiritual case manager",
        points: [
          "Takes a holistic view of the seeker's journey",
          "Helps navigate different approaches to growth",
          "Makes suggestions based on personal experience",
          "Maintains continuity of support over time",
          "Acts as trusted guide rather than authority"
        ]
      },
      {
        title: "Key Differences",
        description: "What makes our approach unique",
        points: [
          "One-to-one spiritual guidance relationship",
          "'Elder sibling' dynamic rather than guru/teacher",
          "Focus on supporting unique spiritual paths",
          "No specific religious tradition required",
          "Built-in safety and supervision structure"
        ]
      }
    ]
  },
  development: {
    title: "How It Works",
    description: "A structured approach to spiritual companionship",
    sections: [
      {
        title: "For Seekers",
        description: "Finding authentic spiritual support",
        points: [
          "Connect with an experienced spiritual companion",
          "Explore spiritual questions in a safe space",
          "Receive guidance on your spiritual journey",
          "Access support without dependency",
          "Maintain autonomy in your spiritual path"
        ]
      },
      {
        title: "For Companions",
        description: "Serving within a supportive framework",
        points: [
          "Work within a structured support system",
          "Regular connection with peer companions",
          "Clear guidelines and boundaries",
          "Ongoing training and development",
          "Focus on authentic spiritual guidance"
        ]
      }
    ]
  },
  cta: {
    title: "Want to Learn More?",
    description: "If you're interested in learning more about the Sacred Companions initiative or would like to explore how you might contribute to this vision, we'd love to hear from you.",
    buttonText: "Contact Us",
    contactEmail: "gabriel.rymberg@thecenterforunity.org",
    trustIndicators: [
      {
        title: "Personal Connection",
        description: "Direct conversation with our team"
      },
      {
        title: "No Commitment",
        description: "Explore possibilities at your own pace"
      }
    ]
  }
}; 