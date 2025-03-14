import { AnimationVariants } from '../types';

// Container animation for staggered children
export const containerVariants: AnimationVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

// Item animation for staggered elements
export const itemVariants: AnimationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Fade in animation for sections
export const fadeInVariants: AnimationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

// Page transition animations
export const pageVariants: AnimationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Button hover animation
export const buttonHoverVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
}; 