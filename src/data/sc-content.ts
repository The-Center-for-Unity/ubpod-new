// Base interfaces for repeated patterns
interface BaseSection {
  title: string;
  description: string;
}

interface PointSection extends BaseSection {
  points: string[];
  subtitle?: string;  // Optional subtitle for section points
}

// Main content interfaces
interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  callToAction: string;
}

interface VisionContent extends BaseSection {
  sections: PointSection[];
}

interface CouncilContent extends BaseSection {
  sections: PointSection[];
}

interface SafetyContent extends BaseSection {
  sections: PointSection[];
}

interface DevelopmentContent extends BaseSection {
  sections: PointSection[];
}

interface TrustIndicator {
  title: string;
  description: string;
}

interface CTAContent extends BaseSection {
  buttonText: string;
  trustIndicators: TrustIndicator[];
}

// Main content structure type
interface SCContent {
  hero: HeroContent;
  vision: VisionContent;
  council: CouncilContent;
  safety: SafetyContent;
  development: DevelopmentContent;
  cta: CTAContent;
}

// Content implementation
export const scContent: SCContent = {
  hero: {
    title: "Sacred Companions",
    subtitle: "Guiding Souls on Their Divine Journey",
    description: "Join a rigorously trained and supervised community of spiritual companions providing ethical, professional companionship for seekers exploring deeper meaning and connection.",
    callToAction: "Begin Your Journey as a Companion"
  },
  vision: {
    title: "Our Vision",
    description: "Building a network of spiritual companions who walk alongside seekers as experienced fellow travelers, not as teachers or gurus. We support through shared wisdom, ongoing supervision, and clear ethical frameworks.",
    sections: [
      {
        title: "Companioning Approach",
        description: "Walking alongside seekers as experienced fellow travelers",
        points: [
          "Non-hierarchical companioning relationship",
          "Supporting seekers' own spiritual discernment",
          "Sharing experience while honoring individual paths",
          "Maintaining appropriate boundaries while being authentically present",
          "Recognizing and respecting each person's unique journey",
          "Creating space for mutual growth and learning"
        ]
      },
      {
        title: "Professional Excellence",
        description: "Setting and maintaining rigorous standards",
        points: [
          "Comprehensive selection and vetting process",
          "Structured 18-month training program",
          "Regular supervision at multiple levels",
          "Ongoing professional development requirements",
          "Clear performance evaluation metrics",
          "Evidence-based practice standards"
        ]
      },
      {
        title: "Ethical Practice",
        description: "Ensuring safe and responsible guidance",
        points: [
          "Robust ethical guidelines and boundaries",
          "Multi-level accountability system",
          "Regular oversight and documentation",
          "Clear incident reporting procedures",
          "Strong client protection measures",
          "Transparent review processes"
        ]
      },
      {
        title: "Community Support",
        description: "Fostering collective growth and wisdom",
        points: [
          "Structured peer learning groups",
          "Comprehensive resource library",
          "Mentorship opportunities",
          "Regular community gatherings",
          "Professional collaboration networks",
          "Ongoing skill-sharing programs"
        ]
      }
    ]
  },
  council: {
    title: "The Guidance Council",
    description: "Our governing body ensuring rigorous standards, ethical practice, and continuous development of our community.",
    sections: [
      {
        title: "Executive Council",
        description: "Strategic leadership and oversight",
        points: [
          "5-7 senior members with rotating chairs",
          "Weekly review meetings and planning",
          "Strategic direction and development",
          "Crisis response coordination",
          "Resource allocation oversight",
          "Community health monitoring"
        ]
      },
      {
        title: "Ethics Committee",
        description: "Maintaining highest ethical standards",
        points: [
          "Weekly case review meetings",
          "Ethics guideline development",
          "Violation investigation protocols",
          "Boundary maintenance oversight",
          "Ethics training development",
          "Regular ethical audits"
        ]
      },
      {
        title: "Relationship Guidelines",
        description: "Maintaining healthy and appropriate relationships",
        points: [
          "Clear guidelines on power dynamics",
          "Regular assessment of relationship boundaries",
          "Prevention of dependency formation",
          "Recognition of inherent relationship vulnerabilities",
          "Clear processes for addressing concerns",
          "Support for maintaining appropriate boundaries"
        ]
      },
      {
        title: "Training Committee",
        description: "Ensuring educational excellence",
        points: [
          "Curriculum development and updates",
          "Trainer certification oversight",
          "Assessment design and validation",
          "Resource development coordination",
          "Training quality monitoring",
          "Learning outcomes evaluation"
        ]
      },
      {
        title: "Quality Assurance",
        description: "Maintaining professional excellence",
        points: [
          "Performance metrics tracking",
          "Regular program evaluation",
          "Client feedback analysis",
          "Continuous improvement planning",
          "Documentation audits",
          "Outcome measurement system"
        ]
      }
    ]
  },
  development: {
    title: "Companion Development Journey",
    description: "A structured pathway combining rigorous training, supervised practice, and ongoing professional development.",
    sections: [
      {
        title: "Prerequisites",
        description: "Essential foundations for entering the program",
        points: [
          "Minimum 5 years active spiritual practice",
          "Experience in supportive or guidance roles",
          "Personal therapy/counseling experience",
          "Professional and spiritual references",
          "Demonstrated emotional stability",
          "Commitment to ongoing personal growth"
        ]
      },
      {
        title: "Personal Development Requirements",
        description: "Ongoing commitment to self-awareness and growth",
        points: [
          "Regular personal therapy or counseling",
          "Active spiritual practice and reflection",
          "Willingness to examine personal challenges",
          "Openness to feedback and growth",
          "Regular self-assessment practices",
          "Commitment to personal spiritual journey"
        ]
      },
      {
        title: "Selection Process",
        description: "A comprehensive evaluation process ensuring ideal fit and capability",
        points: [
          "Initial application with spiritual journey narrative",
          "Professional and spiritual references check",
          "Multi-stage interview process with council panels",
          "Scenario-based assessments and role-playing",
          "Group interaction evaluation",
          "6-month probationary period with regular reviews"
        ]
      },
      {
        title: "Foundation Phase",
        description: "Six months of intensive training and preparation",
        points: [
          "Ethics and boundaries training (40 hours)",
          "Basic counseling skills development (60 hours)",
          "Spiritual companioning principles (40 hours)",
          "Cultural competency training (30 hours)",
          "Self-awareness and personal development",
          "Trauma-informed approach training"
        ]
      },
      {
        title: "Practicum Phase",
        description: "Six months of supervised practice and integration",
        points: [
          "Weekly supervision sessions",
          "Role-playing and case study analysis",
          "Practice with 3-5 supervised clients",
          "Regular case documentation review",
          "Group facilitation practice",
          "Crisis intervention preparation"
        ]
      },
      {
        title: "Ongoing Development",
        description: "Continuous growth and professional excellence",
        points: [
          "40 hours annual continuing education",
          "Monthly individual supervision",
          "Weekly peer group participation",
          "Regular case presentations",
          "Specialization opportunities",
          "Leadership development pathways"
        ]
      }
    ]
  },
  safety: {
    title: "Our Safety Framework",
    description: "A comprehensive system protecting both companions and seekers through regular supervision, clear accountability, and ongoing support.",
    sections: [
      {
        title: "Support for Companions",
        description: "Creating safe spaces for authentic sharing and growth",
        points: [
          "Confidential supervision spaces for processing challenges",
          "Non-judgmental peer support groups",
          "Safe environment for sharing difficulties",
          "Regular opportunities for honest reflection",
          "Support during challenging situations",
          "Recognition that companions also need support"
        ]
      },
      {
        title: "Protective Supervision",
        description: "Supporting and protecting all participants",
        points: [
          "Regular space to process challenging situations",
          "Support for maintaining healthy boundaries",
          "Protection against emotional burnout",
          "Clear guidance for difficult decisions",
          "Safe space for addressing concerns",
          "Mutual protection through oversight"
        ]
      },
      {
        title: "Supervision Framework",
        description: "Regular oversight and support at multiple levels",
        points: [
          "Weekly group supervision (6-8 companions, 2-hour sessions)",
          "Monthly individual supervision with senior council member",
          "Annual external review by independent assessor",
          "Required case presentation and documentation",
          "Progress tracking with defined milestones",
          "Peer feedback and development planning"
        ]
      },
      {
        title: "Documentation & Reporting",
        description: "Clear processes for maintaining records and handling concerns",
        points: [
          "Standardized session documentation templates",
          "Regular supervision reports and assessments",
          "24/7 crisis reporting system with clear escalation paths",
          "Anonymous feedback channels for companions and clients",
          "Incident tracking and resolution documentation",
          "Monthly compliance and safety audits"
        ]
      },
      {
        title: "Crisis Response Protocol",
        description: "Structured approach to handling emergency situations",
        points: [
          "24/7 council member availability for emergencies",
          "Immediate supervisor notification system",
          "Clear criteria for crisis escalation",
          "Mental health referral network access",
          "Post-incident review and documentation",
          "Regular crisis response training"
        ]
      },
      {
        title: "Quality Assurance",
        description: "Continuous monitoring and improvement processes",
        points: [
          "Regular companion performance reviews",
          "Client feedback collection and analysis",
          "Monthly program effectiveness evaluation",
          "Regular policy and procedure updates",
          "Ongoing risk assessment and mitigation",
          "Annual safety framework review"
        ]
      }
    ]
  },
  cta: {
    title: "Join Our Journey",
    description: "Take the first step towards becoming a Sacred Companion through our comprehensive development program. Join a community dedicated to the highest standards of spiritual companioning.",
    buttonText: "Begin Application Process",
    trustIndicators: [
      {
        title: "Professional Development",
        description: "Comprehensive training with ongoing supervision and support"
      },
      {
        title: "Ethical Framework",
        description: "Clear guidelines with strong accountability measures"
      },
      {
        title: "Community Support",
        description: "Join an active network of experienced companions and mentors"
      },
      {
        title: "Quality Assurance",
        description: "Regular evaluation and continuous improvement processes"
      }
    ]
  }
}; 