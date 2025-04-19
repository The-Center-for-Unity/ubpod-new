# UrantiaBookPod Transformation Plan

## Project Overview

This document outlines the comprehensive plan to transform The Divine Within (TDW) Vite-based React application into UrantiaBookPod (UBPod), a podcast platform for exploring the Urantia Book. The transformation will preserve TDW's design system and component architecture while implementing UBPod's specific functionality.

## Current State Analysis

### TDW (Source)
- **Framework**: React with Vite
- **Design System**: Custom design system with Tailwind CSS
- **Styling**: Typography classes, color scheme, and component styling
- **Architecture**: Component-based with clear separation of concerns

### UBPod (Target)
- **Current Framework**: Next.js
- **Content**: Audio podcasts, PDFs, and transcripts for Urantia Book papers
- **Features**: Audio playback, PDF viewing, episode navigation
- **Series**: Multiple content series (Urantia Papers, Discover Jesus, History, Sadler Workbooks)

## Transformation Strategy

The transformation will follow these key principles:
1. Preserve TDW's design system and component architecture
2. Implement UBPod's functionality using React Router instead of Next.js
3. Maintain the same content organization and user experience
4. Ensure robust audio playback and PDF viewing capabilities
5. Implement analytics tracking for user interactions

## Phase 1: Project Setup and Cleanup

### Step 1: Initialize Project Structure
- Set up the basic Vite project structure
- Configure essential dependencies
- Set up TypeScript configuration
- Configure Tailwind CSS

### Step 2: Clean TDW-Specific Content
- Remove TDW-specific pages and components
- Preserve design system components and utilities
- Set up folder structure for UBPod content

### Step 3: Configure Build System
- Set up Vite configuration
- Configure deployment settings
- Set up environment variables

## Phase 2: Core Components Implementation

### Step 1: Design System Migration
- Implement typography system
- Set up color scheme
- Create base component styles

### Step 2: Layout Components
- Create Header component with navigation
- Implement Footer component
- Create Layout wrapper component

### Step 3: Core Functionality Components
- Implement AudioPlayer component
- Create PDFViewer component
- Implement EpisodeCard component
- Create EpisodeGrid component

## Phase 3: Data and Logic Migration

### Step 1: Data Models
- Define TypeScript interfaces for episodes and other entities
- Implement data access functions
- Set up file existence checking utilities

### Step 2: Custom Hooks
- Create useEpisode hook for episode data management
- Implement useAudioAnalytics hook for tracking
- Create useFileCheck hook for file existence verification

### Step 3: Routing Setup
- Configure React Router
- Set up route definitions
- Implement navigation logic

## Phase 4: Page Implementation

### Step 1: Home Page
- Implement hero section
- Create episode grid with filtering
- Add platform links

### Step 2: Episode Pages
- Implement main episode page with audio player and PDF viewer
- Create specialized episode pages for different series
- Implement navigation between episodes

### Step 3: Series Pages
- Create Discover Jesus page
- Implement History page
- Create Sadler Workbooks page

### Step 4: Additional Pages
- Implement Disclaimer page
- Create 404 page

## Phase 5: Advanced Features

### Step 1: Analytics Integration
- Implement Vercel Analytics
- Set up event tracking for audio playback
- Configure page view tracking

### Step 2: Performance Optimization
- Implement lazy loading for components
- Optimize asset loading
- Configure caching strategies

### Step 3: Accessibility Improvements
- Ensure keyboard navigation
- Add ARIA attributes
- Test with screen readers

## Phase 6: Testing and Deployment

### Step 1: Testing
- Test audio playback across browsers
- Verify PDF viewing functionality
- Test responsive design
- Validate analytics tracking

### Step 2: Deployment
- Configure CI/CD pipeline
- Set up production environment
- Deploy to hosting platform

## Implementation Timeline

1. **Week 1**: Project setup, core components, and design system
2. **Week 2**: Data migration, page implementation, and routing
3. **Week 3**: Advanced features, testing, and deployment

## Progress Tracking

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: Project Setup | Not Started | |
| Phase 2: Core Components | Not Started | |
| Phase 3: Data and Logic | Not Started | |
| Phase 4: Page Implementation | Not Started | |
| Phase 5: Advanced Features | Not Started | |
| Phase 6: Testing and Deployment | Not Started | |

## Key Technical Decisions

### Component Architecture
- Use functional components with hooks
- Implement proper prop typing with TypeScript
- Follow single responsibility principle

### State Management
- Use React hooks for local state
- Implement context for shared state when necessary
- Create custom hooks for reusable logic

### Styling Approach
- Use Tailwind utility classes for layout
- Implement custom design system classes for typography
- Follow mobile-first responsive design

### Audio Implementation
- Create robust audio player with error handling
- Implement analytics tracking for playback events
- Ensure cross-browser compatibility

### PDF Viewing
- Implement native browser PDF viewing
- Provide download fallbacks
- Handle loading states appropriately

## Lessons Learned

This section will be updated throughout the transformation process to document insights and challenges.

## Next Steps

1. Initialize the project structure using the setup script
2. Implement core components (Header, Footer, Layout)
3. Create the AudioPlayer component
4. Set up data models and hooks
5. Implement the HomePage component

## References

- Original UBPod codebase structure
- TDW design system documentation
- Migration guides provided in the docs folder 