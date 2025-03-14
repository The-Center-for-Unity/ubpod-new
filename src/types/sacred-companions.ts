import { Variants } from 'framer-motion';

// Base interfaces for sections
export interface BaseSection {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

// Animation variants interface
export type AnimationVariants = Variants;

// Icon props interface
export interface IconProps {
  className?: string;
  size?: number;
}

// Hero section types
export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
}

// Vision section types
export interface VisionSection {
  title: string;
  description: string;
  points: string[];
}

// Council section types
export interface CouncilRole {
  title: string;
  description: string;
  commitment: string;
  qualifications: string[];
}

export interface CouncilContent {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  roles: CouncilRole[];
}

// Safety section types
export interface SafetyPoint {
  title: string;
  points: string[];
}

export interface SafetyContent {
  title: string;
  description: string;
  points: SafetyPoint[];
}

// Development section types
export interface DevelopmentStage {
  title: string;
  description: string;
  duration: string;
  activities: string[];
}

export interface DevelopmentContent {
  title: string;
  description: string;
  stages: DevelopmentStage[];
}

// CTA section types
export interface CTAContent {
  title: string;
  description: string;
  buttonText: string;
  trustIndicators: string[];
}

// Trust indicator type
export interface TrustIndicator {
  title: string;
  description: string;
} 