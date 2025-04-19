# TDW to UBPod: Comprehensive Migration Plan from Next.js to Vite

Last edited: March 14, 2025 6:56 PM
Tags: Urantia Book Pod

# Comprehensive Migration Plan: UrantiaBookPod to Vite

This document outlines a systematic approach to migrate UrantiaBookPod (UBPod) from Next.js to a Vite-based React application using The Divine Within (TDW) as a foundation. This migration focuses on preserving all functionality while improving the design and maintainability.

## Phase 1: Project Setup and Cleanup

### Step 1: Clone and Clean TDW Repository

1. Clone The Divine Within repository
2. Remove TDW-specific content while preserving the structure:
    
    ```bash
    git clone <tdw-repo-url> urantiabookpod-vite
    cd urantiabookpod-vite
    # Remove Git history to start fresh
    rm -rf .git
    git init
    
    ```
    
3. Review and update package.json:
    - Update project name, description, and version
    - Keep essential dependencies (React, Vite, Tailwind, Framer Motion)
    - Remove any TDW-specific packages
    - Add UBPod-specific dependencies (audio players, PDF viewers)

### Step 2: Clean Up Existing Components

1. Create a temporary directory for TDW reference components:
    
    ```bash
    mkdir -p reference/components
    
    ```
    
2. Move key design system components to preserve:
    
    ```bash
    # Keep these essential components for reference
    mv src/components/Header.tsx reference/components/
    mv src/components/Footer.tsx reference/components/
    mv src/constants/animations.ts reference/
    mv src/styles/typography.css reference/
    # etc.
    
    ```
    
3. Remove TDW-specific pages and components:
    
    ```bash
    rm -rf src/pages/SCPage.tsx
    rm -rf src/components/sacred-companions
    rm -rf src/components/sacred-companions-simple
    rm -rf src/data/sc-content.ts
    rm -rf src/data/sc-content-simple.ts
    # etc.
    
    ```
    
4. Simplify the routing structure:
    - Remove TDW-specific routes from src/App.tsx
    - Create a minimal temporary main component

## Phase 2: Core Structure Implementation

### Step 1: Set Up Core Design System

1. Create a design system folder structure:
    
    ```bash
    mkdir -p src/design-system/{components,hooks,utils}
    
    ```
    
2. Implement the UBPod color scheme and typography:
    
    ```bash
    # Based on TDW's typography.css but updated for UBPod
    cp reference/typography.css src/styles/typography.css
    # Edit for UBPod color scheme
    
    ```
    
3. Set up Tailwind configuration:
    - Update tailwind.config.js with UBPod color scheme
    - Copy over any custom Tailwind utilities

### Step 2: Implement Base Components

1. Create shared layout components:
    - Header (navigation)
    - Footer
    - Layout wrapper (for consistent padding/margins)
    - ScrollToTop component (from UBPod)
2. Implement reusable UI components:
    - Button variations (primary, secondary, text)
    - Card components for episodes
    - Audio player component

## Phase 3: Data Migration

### Step 1: Migrate Data Models and Content

1. Copy over UBPod data models:
    
    ```bash
    mkdir -p src/data
    cp /path/to/ubpod/app/data/episodes.ts src/data/
    cp /path/to/ubpod/app/types.ts src/types/
    
    ```
    
2. Adapt data models to work with the new structure:
    - Ensure type definitions are compatible
    - Update imports and exports as needed
3. Set up static assets:
    
    ```bash
    mkdir -p public/{audio,pdf,transcripts}
    cp -r /path/to/ubpod/public/audio public/
    cp -r /path/to/ubpod/public/pdf public/
    cp -r /path/to/ubpod/public/transcripts public/
    
    ```
    

### Step 2: Create Data Hooks

1. Implement data access hooks:
    
    ```bash
    touch src/hooks/useEpisodes.ts
    touch src/hooks/useAudioPlayer.ts
    # etc.
    
    ```
    
2. Migrate necessary functionality from UBPod:
    - Audio playback tracking
    - Episode filtering and sorting
    - PDF state management

## Phase 4: Page Implementation

### Step 1: Implement Main Pages

1. Create page components:
    
    ```bash
    mkdir -p src/pages
    touch src/pages/HomePage.tsx
    touch src/pages/EpisodePage.tsx
    touch src/pages/DiscoverJesusPage.tsx
    touch src/pages/HistoryPage.tsx
    # etc.
    
    ```
    
2. Create routes in App.tsx:
    
    ```jsx
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/episode/:id" element={<EpisodePage />} />
      <Route path="/discover-jesus" element={<DiscoverJesusPage />} />
      <Route path="/discover-jesus/:id" element={<DiscoverJesusEpisodePage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/history/:id" element={<HistoryEpisodePage />} />
      <Route path="/sadler-workbooks" element={<WorkbooksPage />} />
      <Route path="/sadler-workbooks/:id" element={<WorkbookEpisodePage />} />
      <Route path="/disclaimer" element={<DisclaimerPage />} />
    </Routes>
    
    ```
    

### Step 2: Implement Episode Pages

1. Create the episode detail page with audio player and PDF viewer:
    - Adapt UBPod's EpisodeClient.tsx functionality
    - Apply TDW's styling approach
2. Implement specialized episode pages for different series:
    - Regular Urantia Papers episodes
    - Discover Jesus episodes
    - History episodes
    - Sadler Workbooks episodes

## Phase 5: Special Features

### Step 1: Implement Audio Player

1. Create a custom audio player component:
    
    ```bash
    touch src/components/AudioPlayer.tsx
    
    ```
    
2. Implement audio playback tracking:
    - Play/pause events
    - Duration tracking
    - Analytics integration

### Step 2: Implement PDF Viewer

1. Create a PDF viewer component:
    
    ```bash
    touch src/components/PDFViewer.tsx
    
    ```
    
2. Add download capabilities for transcripts and PDFs

### Step 3: Implement Analytics

1. Migrate analytics setup:
    - Google Tag Manager
    - Hotjar
    - Vercel Analytics

## Phase 6: Finishing Touches

### Step 1: Responsive Design

1. Ensure responsive design for all pages:
    - Mobile navigation
    - Responsive audio player
    - Adaptive layouts

### Step 2: Animations

1. Implement page transitions and animations:
    - Use TDW's animation constants
    - Add subtle motion to improve UX

### Step 3: SEO and Metadata

1. Set up SEO metadata:
    - Page titles and descriptions
    - Open Graph tags
    - Favicon and app icons

## Phase 7: Testing and Deployment

### Step 1: Testing

1. Manual testing of all features:
    - Navigation across all pages
    - Audio playback functionality
    - PDF viewing and downloads
    - Mobile responsiveness
2. Cross-browser testing:
    - Chrome, Firefox, Safari, Edge

### Step 2: Build and Deploy

1. Configure build process:
    
    ```bash
    # Update vite.config.js as needed
    
    ```
    
2. Set up deployment:
    - Configure CI/CD
    - Set up hosting (Vercel, Netlify, etc.)
3. Deploy and verify:
    - Final production testing
    - Performance checks

## Implementation Notes

- **Design System:** Preserve TDW's design system approach while adapting to UBPod's branding
- **Component Structure:** Use TDW's component organization but with UBPod's functionality
- **State Management:** Keep it simple with React hooks for most state needs
- **Routing:** Use React Router similar to TDW's approach
- **Performance:** Ensure audio files and PDFs are loaded efficiently